// Cómo se acomodan las luces de un tablero. "filas" es el de siempre (.l-tablero reparte las filas solo, con CSS). Los
// demás ponen cada luz en un punto calculado según cuántas hay y la forma del tablero (.l-tablero.l-forma). Elegidos en la
// app de hábitos (02-11-2026); su pantalla ESP32 repite la cuenta en C++.

export const ORDENES_LUZ = ["filas", "equilibrio", "figuras", "circulo", "piedras", "sendero"] as const;
export type OrdenLuz = (typeof ORDENES_LUZ)[number];

export const NOMBRES_ORDEN_LUZ: Record<OrdenLuz, string> = {
  filas: "Filas",
  equilibrio: "Equilibrio",
  figuras: "Figuras",
  circulo: "Círculo",
  piedras: "Piedras",
  sendero: "Sendero",
};

export const NOTAS_ORDEN_LUZ: Record<OrdenLuz, string> = {
  filas: "Filas que se reparten solas, como siempre.",
  equilibrio: "Filas que encajan como un panal: 2 sobre 1, el cinco del dado.",
  figuras: "Triángulo, rombo, cruz, pirámide, flor.",
  circulo: "Un anillo, como un ensō.",
  piedras: "Grupos asimétricos, como un jardín seco.",
  sendero: "Piedras de paso en zigzag.",
};

/** Cuántas luces sabe acomodar: con más, se acomodan las primeras. */
export const MAX_LUCES = 10;

type Punto = [number, number];
const S3 = Math.sqrt(3) / 2;

const filas = (lista: number[]): Punto[] => lista.flatMap((k, f) => Array.from({ length: k }, (_, i): Punto => [i - (k - 1) / 2, f * 0.92]));
const anillo = (n: number, giro = -Math.PI / 2): Punto[] => {
  const r = (0.5 / Math.sin(Math.PI / n)) * 1.08;
  return Array.from({ length: n }, (_, i): Punto => [Math.cos(giro + (i * 2 * Math.PI) / n) * r, Math.sin(giro + (i * 2 * Math.PI) / n) * r]);
};

/** Posiciones en unidades abstractas: dos luces vecinas quedan a ~1 de distancia. */
const ABSTRACTAS: Record<"equilibrio" | "figuras" | "circulo" | "sendero", (n: number) => Punto[]> = {
  equilibrio: (n) => filas(({ 1: [1], 2: [2], 3: [2, 1], 4: [2, 2], 5: [2, 1, 2], 6: [3, 3], 7: [2, 3, 2], 8: [3, 2, 3], 9: [4, 5], 10: [3, 4, 3] } as Record<number, number[]>)[n]),
  figuras: (n) => {
    switch (n) {
      case 1: return [[0, 0]];
      case 2: return [[-0.6, 0], [0.6, 0]];
      case 3: return [[0, 0], [-0.58, S3 * 1.08], [0.58, S3 * 1.08]];
      case 4: return [[0, -0.82], [-0.82, 0], [0.82, 0], [0, 0.82]];
      case 5: return [[0, -1], [-1, 0], [0, 0], [1, 0], [0, 1]];
      case 6: return filas([1, 2, 3]).map(([x, y]): Punto => [x * 1.05, y]);
      case 7: return [[0, 0], ...anillo(6, 0).map(([x, y]): Punto => [x * 1.05, y * 1.05])];
      case 8: return [[0, -0.45], [0, 0.45], ...anillo(6, 0).map(([x, y]): Punto => [x * 1.55, y * 1.1])];
      case 9: return [[0, 0], ...anillo(8)];
      default: return filas([1, 2, 3, 4]).map(([x, y]): Punto => [x * 1.05, y]);
    }
  },
  circulo: (n) => (n === 1 ? [[0, 0]] : n === 2 ? [[-0.6, 0], [0.6, 0]] : anillo(n)),
  sendero: (n) => (n === 1 ? [[0, 0]] : Array.from({ length: n }, (_, i): Punto => [i * 0.62, (i % 2) * 0.86 + Math.sin(i * 0.9) * 0.12])),
};

/** Piedras: puntos de pantalla (0 a 1) pensados en horizontal; en vertical se trasponen. */
const PIEDRAS: Punto[][] = [
  [[0.4, 0.46]],
  [[0.38, 0.4], [0.6, 0.6]],
  [[0.3, 0.4], [0.45, 0.64], [0.7, 0.44]],
  [[0.24, 0.36], [0.37, 0.64], [0.52, 0.36], [0.76, 0.56]],
  [[0.18, 0.4], [0.32, 0.66], [0.4, 0.3], [0.65, 0.44], [0.8, 0.68]],
  [[0.14, 0.4], [0.28, 0.7], [0.36, 0.3], [0.58, 0.56], [0.7, 0.26], [0.86, 0.66]],
  [[0.12, 0.36], [0.24, 0.7], [0.34, 0.3], [0.5, 0.62], [0.62, 0.28], [0.78, 0.5], [0.9, 0.78]],
  [[0.1, 0.36], [0.22, 0.7], [0.32, 0.28], [0.46, 0.62], [0.56, 0.24], [0.7, 0.52], [0.82, 0.22], [0.9, 0.74]],
  [[0.09, 0.34], [0.2, 0.7], [0.3, 0.28], [0.42, 0.6], [0.52, 0.26], [0.62, 0.7], [0.72, 0.4], [0.84, 0.22], [0.91, 0.7]],
  [[0.08, 0.36], [0.18, 0.72], [0.27, 0.28], [0.38, 0.58], [0.47, 0.22], [0.56, 0.74], [0.64, 0.44], [0.76, 0.22], [0.84, 0.62], [0.93, 0.32]],
];
const TAM_PIEDRAS = [0.3, 0.27, 0.25, 0.23, 0.21, 0.2, 0.185, 0.17, 0.16, 0.15];

export interface AcomodoLuz {
  /** Diámetro de las luces, en px */
  d: number;
  /** Centro de cada luz, en px desde la esquina del tablero */
  centros: Punto[];
}

/**
 * Dónde va cada luz en un tablero de W × H px. `etiqueta`: alto del nombre (y detalle) bajo la luz.
 * Devuelve null para "filas", que acomoda el CSS.
 */
export function acomodarLuces(orden: OrdenLuz, n: number, W: number, H: number, { etiqueta = 0, maximo = 132 }: { etiqueta?: number; maximo?: number } = {}): AcomodoLuz | null {
  if (orden === "filas" || n < 1 || W < 1 || H < 1) return null;
  n = Math.min(n, MAX_LUCES);
  const vertical = H > W * 1.05;
  const minimo = Math.min(W, H);

  if (orden === "piedras") {
    // Si después de separarlas algo sigue chocando, se achican un poco y se vuelve a intentar
    let d = Math.min(maximo, minimo * TAM_PIEDRAS[n - 1]);
    for (let intento = 0; ; intento++) {
      const centros = PIEDRAS[n - 1].map(([x, y]): Punto => (vertical ? [y * W, x * H] : [x * W, y * H]));
      separar(centros, d * 1.35, d + etiqueta + 14, W, H, d, etiqueta);
      if (!choca(centros, d, etiqueta) || intento >= 8) return { d, centros };
      d *= 0.93;
    }
  }

  let pts = ABSTRACTAS[orden](n);
  const ancho = (p: Punto[]) => Math.max(...p.map((q) => q[0])) - Math.min(...p.map((q) => q[0]));
  const alto = (p: Punto[]) => Math.max(...p.map((q) => q[1])) - Math.min(...p.map((q) => q[1]));
  // En una pantalla vertical, lo que es más ancho que alto se gira (filas pasan a columnas)
  if (vertical && orden !== "circulo" && ancho(pts) > alto(pts) * 1.15) pts = pts.map(([x, y]): Punto => [y, x]);
  const pad = Math.max(16, minimo * 0.06);
  const Wa = W - 2 * pad, Ha = H - 2 * pad;
  const bw = ancho(pts), bh = alto(pts);
  const cx = (Math.max(...pts.map((p) => p[0])) + Math.min(...pts.map((p) => p[0]))) / 2;
  const cy = (Math.max(...pts.map((p) => p[1])) + Math.min(...pts.map((p) => p[1]))) / 2;
  // Escala: que quepa todo, contando el nombre bajo la fila de más abajo
  const s = Math.min(Wa / (bw + 0.95), (Ha - etiqueta) / (bh + 0.62));
  const ubicar = (sy: number) => pts.map(([x, y]): Punto => [W / 2 + (x - cx) * s, H / 2 + (y - cy) * sy - etiqueta / 2]);
  // La luz más grande (hasta el 60 % del paso) que no tape a otra ni a su nombre. Si sobra alto, se estira en vertical.
  let mejor: AcomodoLuz | null = null;
  for (let d = Math.min(s * 0.6, maximo); d >= 32; d -= 2) {
    const syMax = bh > 0 ? (Ha - etiqueta - d) / bh : s;
    for (const sy of [s, Math.max(s, Math.min(syMax, s * 1.25)), Math.max(s, Math.min(syMax, s * 1.5))]) {
      const centros = ubicar(sy);
      if (!choca(centros, d, etiqueta)) { mejor = { d, centros }; break; }
    }
    if (mejor) break;
  }
  mejor ??= { d: 32, centros: ubicar(s) };
  // Con pocas luces, que no queden demasiado separadas
  const k = Math.min(1, ((mejor.d / 0.6) * 1.25) / s);
  if (k < 1) mejor.centros = mejor.centros.map(([x, y]): Punto => [W / 2 + (x - W / 2) * k, (H - etiqueta) / 2 + (y - (H - etiqueta) / 2) * k]);
  return mejor;
}

/** ¿Alguna luz toca a otra, o al nombre de otra? (El nombre ocupa el ancho de la luz más 12 px por lado.) */
function choca(c: Punto[], d: number, etiqueta: number): boolean {
  for (let i = 0; i < c.length; i++) for (let j = 0; j < c.length; j++) {
    if (i === j) continue;
    const [ax, ay] = c[i], [bx, by] = c[j];
    if (j > i && Math.hypot(ax - bx, ay - by) < d + 6) return true;
    if (etiqueta > 0) {
      const arriba = ay + d / 2, abajo = arriba + etiqueta, izq = ax - d / 2 - 12, der = ax + d / 2 + 12;
      const px = Math.max(izq, Math.min(bx, der)), py = Math.max(arriba, Math.min(by, abajo));
      if (Math.hypot(bx - px, by - py) < d / 2 + 3) return true;
    }
  }
  return false;
}

/** Empuja las luces que quedan muy cerca (en vertical cuenta el nombre de abajo) y las deja dentro del tablero. */
function separar(c: Punto[], dx: number, dy: number, W: number, H: number, d: number, etiqueta: number) {
  for (let it = 0; it < 80; it++) {
    for (let i = 0; i < c.length; i++) for (let j = i + 1; j < c.length; j++) {
      const ex = (c[j][0] - c[i][0]) / dx, ey = (c[j][1] - c[i][1]) / dy, dist = Math.hypot(ex, ey);
      if (dist < 1 && dist > 0) {
        const k = (1 - dist) / 2 / dist;
        c[i][0] -= ex * k * dx; c[i][1] -= ey * k * dy;
        c[j][0] += ex * k * dx; c[j][1] += ey * k * dy;
      }
    }
    for (const p of c) {
      p[0] = Math.min(W - d * 0.8, Math.max(d * 0.8, p[0]));
      p[1] = Math.min(H - d / 2 - etiqueta - 8, Math.max(d * 0.65, p[1]));
    }
  }
}
