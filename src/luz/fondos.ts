// Fondos de la línea luz: lo que va detrás de las luces. Cada uno pinta dentro de una capa (.l-fondo) y devuelve cómo
// limpiarse. Lo que se mueve lo hace muy despacio (ciclos de 10 s a 3 min), a ~24 cuadros por segundo,
// y solo mientras se ve. Con "reducir movimiento", queda un cuadro quieto.
// Elegidos en la app de hábitos (02-11-2026).

export const FONDOS_LUZ = [
  "papel", "piscina", "piscina-tarde", "estanque", "reflejo", "gotas",
  "amanecer", "niebla", "aurora", "respiracion", "hora",
  "madera", "arena", "washi",
] as const;
export type FondoLuz = (typeof FONDOS_LUZ)[number];

export const NOMBRES_FONDO_LUZ: Record<FondoLuz, string> = {
  papel: "Papel liso",
  piscina: "Fondo de piscina",
  "piscina-tarde": "Piscina al atardecer",
  estanque: "Estanque de piedra",
  reflejo: "Reflejo en el muro",
  gotas: "Gotas en el estanque",
  amanecer: "Amanecer",
  niebla: "Niebla",
  aurora: "Aurora pálida",
  respiracion: "Respiración",
  hora: "Hora del día",
  madera: "Madera clara",
  arena: "Arena rastrillada",
  washi: "Papel washi",
};

/** Pinta en `capa`. `luces` devuelve dónde están las luces (la arena las rodea). Devuelve la limpieza. */
export type Pintor = (capa: HTMLElement, luces: () => DOMRect[]) => () => void;

const quieto = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ——— Animación: un bucle por fondo, pausado si la capa no se ve o la pestaña está oculta ——— */
function animar(capa: HTMLElement, dibujar: (s: number) => void): () => void {
  if (quieto()) {
    const id = requestAnimationFrame(() => dibujar(40));
    return () => cancelAnimationFrame(id);
  }
  let visible = true, ultimo = -1, id = 0;
  const vigia = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  vigia.observe(capa);
  const cuadro = (ms: number) => {
    const s = ms / 1000;
    if (visible && document.visibilityState === "visible" && s - ultimo >= 1 / 24) { ultimo = s; dibujar(s); }
    id = requestAnimationFrame(cuadro);
  };
  id = requestAnimationFrame(cuadro);
  return () => { cancelAnimationFrame(id); vigia.disconnect(); };
}

/* ——— Utilidades ——— */
type Rgb = [number, number, number];
const hex = (h: string): Rgb => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as Rgb;
const mezcla = (a: Rgb, b: Rgb, t: number): Rgb => a.map((v, i) => v + (b[i] - v) * t) as Rgb;
const rgb = (c: Rgb) => `rgb(${c.map(Math.round).join(",")})`;

/** Un canvas que llena la capa, a una resolución acotada. Llama a `alCambiar` cuando cambia de tamaño. */
function lienzo(capa: HTMLElement, { max = 1100, esc = 1 } = {}, alCambiar?: () => void) {
  const cv = document.createElement("canvas");
  capa.append(cv);
  let k = 1, listo = false;
  // La primera medida no avisa: quien pide el lienzo dibuja después de recibirlo
  const ajustar = () => {
    const w = capa.clientWidth, h = capa.clientHeight;
    if (!w || !h) return;
    k = Math.min(esc * Math.min(devicePixelRatio || 1, 1.5), max / w);
    const W = Math.max(2, Math.round(w * k)), H = Math.max(2, Math.round(h * k));
    if (cv.width === W && cv.height === H) return;
    cv.width = W; cv.height = H;
    if (listo) alCambiar?.();
  };
  const vigia = new ResizeObserver(ajustar);
  vigia.observe(capa);
  ajustar();
  listo = true;
  return { cv, escala: () => k, fin: () => vigia.disconnect() };
}

function azar(semilla: number) {
  let s = semilla >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ruido(semilla: number) {
  const h = (x: number, y: number) => {
    let n = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(semilla, 1442695041);
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    n ^= n >>> 16;
    return (n >>> 0) / 4294967295;
  };
  const v = (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
    const u = fx * fx * (3 - 2 * fx), w = fy * fy * (3 - 2 * fy);
    const a = h(xi, yi), b = h(xi + 1, yi), c = h(xi, yi + 1), d = h(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * w + (a - b - c + d) * u * w;
  };
  return (x: number, y: number, oct = 4) => {
    let s = 0, amp = 0.5, f = 1, tot = 0;
    for (let i = 0; i < oct; i++) { s += v(x * f, y * f) * amp; tot += amp; amp *= 0.5; f *= 2; }
    return s / tot;
  };
}

/* ——— Agua: la red de luz que el agua proyecta en el fondo (WebGL) ——— */
const SOMBREADOR = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 r; uniform float t; uniform vec3 base; uniform vec3 luz; uniform vec3 hondo;
uniform float esc; uniform float expo; uniform float fuerza;
#define TAU 6.28318530718
void main() {
  vec2 uv = gl_FragCoord.xy / r.y * esc + vec2(0.13, 0.31);
  vec2 p = mod(uv * TAU, TAU) - 250.0;
  vec2 i = p; float c = 1.0; float inten = 0.005;
  for (int n = 0; n < 5; n++) {
    float tt = t * (1.0 - (3.5 / float(n + 1)));
    i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten)));
  }
  c /= 5.0; c = 1.17 - pow(c, 1.4);
  float v = clamp(pow(abs(c), expo), 0.0, 1.0);
  vec3 fondo = mix(hondo, base, 0.55 + 0.45 * gl_FragCoord.y / r.y);
  gl_FragColor = vec4(mix(fondo, luz, v * fuerza), 1.0);
}`;

function agua(o: { base: string; hondo: string; luz: string; esc: number; expo: number; fuerza: number; vel: number }): Pintor {
  return (capa) => {
    capa.style.background = o.base;
    const cv = document.createElement("canvas");
    capa.append(cv);
    const gl = cv.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return () => {};
    const sh = (tipo: number, src: string) => { const s = gl.createShader(tipo)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}"));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, SOMBREADOR));
    gl.linkProgram(pr);
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(pr, n);
    const col = (n: string, h: string) => gl.uniform3fv(U(n), hex(h).map((v) => v / 255));
    col("base", o.base); col("luz", o.luz); col("hondo", o.hondo);
    gl.uniform1f(U("esc"), o.esc); gl.uniform1f(U("expo"), o.expo); gl.uniform1f(U("fuerza"), o.fuerza);
    const uR = U("r"), uT = U("t");
    let ult = 40;
    const dibujar = (s: number) => {
      ult = s;
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(uR, cv.width, cv.height);
      gl.uniform1f(uT, s * o.vel + 23);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    // Media resolución: la luz del agua es borrosa de por sí y así cuesta poco
    const ajustar = () => {
      const w = capa.clientWidth, h = capa.clientHeight;
      if (!w) return;
      const k = Math.min(0.75, 640 / w);
      cv.width = Math.max(2, Math.round(w * k)); cv.height = Math.max(2, Math.round(h * k));
      dibujar(ult);
    };
    const vigia = new ResizeObserver(ajustar);
    vigia.observe(capa);
    ajustar();
    const parar = animar(capa, dibujar);
    return () => { parar(); vigia.disconnect(); gl.getExtension("WEBGL_lose_context")?.loseContext(); };
  };
}

/* ——— Gotas en el estanque ——— */
const gotas: Pintor = (capa) => {
  const { cv, fin } = lienzo(capa, { max: 1000 });
  const ctx = cv.getContext("2d")!;
  const rnd = azar(7), VIDA = 11;
  let anillos: { x: number; y: number; t: number }[] | null = null, prox = 0;
  const parar = animar(capa, (s) => {
    const W = cv.width, H = cv.height;
    if (!anillos) { anillos = [0, 1, 2, 3].map((k) => ({ x: rnd() * W, y: rnd() * H, t: s - k * 2.7 - 0.5 })); prox = s + 2; }
    if (s > prox) { anillos.push({ x: rnd() * W, y: rnd() * H, t: s }); prox = s + 2.6 + rnd() * 2.8; }
    anillos = anillos.filter((a) => s - a.t < VIDA);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#e4ecec"); g.addColorStop(1, "#d8e3e2");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const lw = Math.max(1, W * 0.0024);
    for (const a of anillos) {
      const e = (s - a.t) / VIDA;
      const R = W * 0.24 * (1 - Math.pow(1 - e, 2.2));
      const alfa = Math.pow(1 - e, 1.5) * 0.55;
      for (const j of [1, 0.72, 0.48]) {
        const r = R * j;
        if (r < 2) continue;
        ctx.lineWidth = lw;
        ctx.strokeStyle = `rgba(255,255,255,${alfa * j})`;
        ctx.beginPath(); ctx.ellipse(a.x, a.y, r, r * 0.92, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = `rgba(58,88,92,${alfa * j * 0.3})`;
        ctx.beginPath(); ctx.ellipse(a.x, a.y + lw * 1.3, r + lw, (r + lw) * 0.92, 0, 0, Math.PI * 2); ctx.stroke();
      }
    }
  });
  return () => { parar(); fin(); };
};

/* ——— Gradientes con CSS (las clases viven en lineas/luz.css) ——— */
function manchas(base: string, lista: [color: string, x: number, y: number, tam: number, dur: number, anim: string][]): Pintor {
  return (capa) => {
    capa.classList.add("l-fondo-manchas");
    capa.style.background = base;
    lista.forEach(([color, x, y, tam, dur, anim], i) => {
      const m = document.createElement("i");
      Object.assign(m.style, {
        left: `${x - tam / 2}%`, top: `${y - tam * 0.8}%`, width: `${tam}%`, aspectRatio: "1",
        background: `radial-gradient(circle, ${color} 0%, transparent 68%)`,
        animation: `${anim} ${dur}s var(--l-curva-luz) infinite alternate`, animationDelay: `${-i * 13}s`,
      });
      capa.append(m);
    });
    return () => {};
  };
}
const clase = (c: string): Pintor => (capa) => { capa.classList.add(c); return () => {}; };

/* ——— Hora del día: el color sigue la hora (de Chile por defecto: la zona de mis proyectos) ——— */
const HORAS: [number, string, string][] = [
  [0, "#e4e2ea", "#eeece8"], [5.5, "#ebe0e0", "#f0ece8"], [7, "#f7dccb", "#f4eee8"], [10, "#f3ecdc", "#f5f3ee"],
  [13, "#e2edf2", "#f4f3ef"], [16.5, "#efe6d6", "#f5f1ea"], [19, "#f5d9c2", "#f3ece4"], [21, "#e6dbe3", "#efebe7"], [24, "#e4e2ea", "#eeece8"],
];
function horaEnChile(): number {
  const [h, m] = new Date().toLocaleTimeString("en-GB", { timeZone: "America/Santiago", hour: "2-digit", minute: "2-digit" }).split(":").map(Number);
  return (h % 24) + m / 60;
}
/** Los dos colores (arriba y abajo) del fondo "hora" a una hora del día (0 a 24). */
export function coloresDeLaHora(h: number): [string, string] {
  let i = 0;
  while (h > HORAS[i + 1][0]) i++;
  const [h0, a0, b0] = HORAS[i], [h1, a1, b1] = HORAS[i + 1];
  const t = (h - h0) / (h1 - h0);
  return [rgb(mezcla(hex(a0), hex(a1), t)), rgb(mezcla(hex(b0), hex(b1), t))];
}
const hora: Pintor = (capa) => {
  const pintar = () => { const [a, b] = coloresDeLaHora(horaEnChile()); capa.style.background = `linear-gradient(180deg, ${a} 0%, ${b} 78%)`; };
  pintar();
  const id = setInterval(pintar, 60_000);
  return () => clearInterval(id);
};

/* ——— Madera clara ——— */
const madera: Pintor = (capa) => {
  const n = ruido(11), h = ruido(5);
  const claro = hex("#efe5d3"), oscuro = hex("#d6c2a2");
  const { cv, fin } = lienzo(capa, { max: 760, esc: 0.8 }, () => dibujar());
  const ctx = cv.getContext("2d")!;
  function dibujar() {
    const W = cv.width, H = cv.height, img = ctx.createImageData(W, H), d = img.data;
    const k = 1000 / W, TABLA = 190;
    for (let y = 0; y < H; y++) {
      const v = y * k, pi = Math.floor(v / TABLA), local = v - pi * TABLA;
      const tono = (h(pi * 3.7, 1.3, 1) - 0.5) * 0.12;
      for (let x = 0; x < W; x++) {
        const u = x * k;
        const g = v * 0.1 + n(u * 0.0022 + pi * 17, v * 0.011, 3) * 10 + pi * 3.1;
        const veta = Math.pow(0.5 + 0.5 * Math.sin(g), 7);
        const fibra = n(u * 0.0016 + pi * 9, v * 0.32, 2);
        let t = 0.12 + veta * 0.42 + (fibra - 0.5) * 0.3 + tono;
        if (local < 1.6 * k || local > TABLA - 0.6 * k) t += 0.5;   // la junta entre tablas
        t = Math.max(0, Math.min(1, t));
        const c = mezcla(claro, oscuro, t), o = (y * W + x) * 4;
        d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2]; d[o + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }
  dibujar();
  return fin;
};

/* ——— Arena rastrillada: las luces son las piedras y la arena las rodea con surcos ——— */
const arena: Pintor = (capa, luces) => {
  const n = ruido(23), base = hex("#ece6d9");
  let pendiente = 0;
  const pedir = () => { cancelAnimationFrame(pendiente); pendiente = requestAnimationFrame(dibujar); };
  const { cv, escala, fin } = lienzo(capa, { max: 900 }, pedir);
  const ctx = cv.getContext("2d")!;
  let firma = "";
  function dibujar() {
    const W = cv.width, H = cv.height, k = escala();
    const c = capa.getBoundingClientRect();
    const piedras = luces().map((r) => ({ x: (r.left - c.left + r.width / 2) * k, y: (r.top - c.top + r.height / 2) * k, r: (r.width / 2) * k * 1.12 }));
    firma = JSON.stringify(piedras.map((p) => [Math.round(p.x), Math.round(p.y), Math.round(p.r)]));
    const paso = W * 0.0125, zona = paso * 5.5;
    const img = ctx.createImageData(W, H), d = img.data;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        let dm = 1e9;
        for (const p of piedras) { const dd = Math.hypot(x - p.x, y - p.y) - p.r; if (dd < dm) dm = dd; }
        const f = dm < zona ? Math.max(0, dm) : y + n((x / W) * 6, (y / W) * 6, 2) * paso * 1.4;
        const surco = Math.sin((f / paso) * Math.PI * 2);
        const grano = (n(x * 0.9, y * 0.9, 1) - 0.5) * 9;
        const sh = surco * 6.5 + grano + (dm < paso * 0.5 ? -4 : 0);
        const o = (y * W + x) * 4;
        d[o] = base[0] + sh; d[o + 1] = base[1] + sh; d[o + 2] = base[2] + sh * 1.08; d[o + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }
  pedir();
  // Si las luces cambian de lugar (otro hábito, otro tamaño), se vuelve a rastrillar
  const id = setInterval(() => {
    const c = capa.getBoundingClientRect(), k = escala();
    const ahora = JSON.stringify(luces().map((r) => [Math.round((r.left - c.left + r.width / 2) * k), Math.round((r.top - c.top + r.height / 2) * k), Math.round((r.width / 2) * k * 1.12)]));
    if (ahora !== firma) pedir();
  }, 1000);
  return () => { clearInterval(id); cancelAnimationFrame(pendiente); fin(); };
};

/* ——— Papel washi ——— */
const washi: Pintor = (capa) => {
  const n = ruido(41);
  const { cv, fin } = lienzo(capa, { max: 1000 }, () => dibujar());
  const ctx = cv.getContext("2d")!;
  function dibujar() {
    const W = cv.width, H = cv.height, rnd = azar(9);
    const img = ctx.createImageData(W, H), d = img.data, b = hex("#f4f0e6");
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const m = (n((x / W) * 5, (y / W) * 5, 4) - 0.5) * 12 + (rnd() - 0.5) * 4, o = (y * W + x) * 4;
      d[o] = b[0] + m; d[o + 1] = b[1] + m; d[o + 2] = b[2] + m * 1.15; d[o + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    ctx.lineCap = "round";
    for (let i = 0, fibras = Math.round((W * H) / 900); i < fibras; i++) {
      const x = rnd() * W, y = rnd() * H, l = W * (0.015 + rnd() * 0.06), a = rnd() * Math.PI * 2;
      ctx.strokeStyle = rnd() < 0.6 ? `rgba(255,255,255,${0.25 + rnd() * 0.35})` : `rgba(150,128,92,${0.05 + rnd() * 0.07})`;
      ctx.lineWidth = Math.max(0.5, W * 0.0008 * (0.5 + rnd()));
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + Math.cos(a + 0.6) * l * 0.5, y + Math.sin(a + 0.6) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l);
      ctx.stroke();
    }
  }
  dibujar();
  return fin;
};

/** Cómo se pinta cada fondo. "papel" no pinta nada: es el fondo de la línea. */
export const PINTORES_FONDO_LUZ: Record<FondoLuz, Pintor | null> = {
  papel: null,
  piscina: agua({ base: "#dcefef", hondo: "#cfe6e8", luz: "#ffffff", esc: 0.85, expo: 7, fuerza: 0.9, vel: 0.06 }),
  "piscina-tarde": agua({ base: "#f2e5d1", hondo: "#ead8c0", luz: "#fff8ea", esc: 0.8, expo: 7, fuerza: 0.85, vel: 0.05 }),
  estanque: agua({ base: "#e3e6df", hondo: "#d9ddd5", luz: "#f8f9f4", esc: 1.05, expo: 8, fuerza: 0.65, vel: 0.045 }),
  reflejo: agua({ base: "#efeee8", hondo: "#e3eae7", luz: "#ffffff", esc: 0.42, expo: 3, fuerza: 0.8, vel: 0.04 }),
  gotas,
  amanecer: clase("l-fondo-amanecer"),
  niebla: manchas("#eceeed", [
    ["rgba(255,255,255,.95)", 22, 30, 80, 70, "l-deriva-a"], ["rgba(196,208,214,.55)", 78, 40, 85, 95, "l-deriva-b"],
    ["rgba(255,255,255,.8)", 60, 85, 90, 110, "l-deriva-c"], ["rgba(208,214,220,.5)", 15, 85, 70, 80, "l-deriva-b"],
  ]),
  aurora: manchas("#f3f1ec", [
    ["rgba(160,222,200,.5)", 20, 28, 85, 80, "l-deriva-a"], ["rgba(196,182,238,.45)", 82, 35, 80, 100, "l-deriva-b"],
    ["rgba(255,205,178,.45)", 55, 92, 90, 90, "l-deriva-c"],
  ]),
  respiracion: clase("l-fondo-respira"),
  hora,
  madera,
  arena,
  washi,
};
