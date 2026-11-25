// Verifica el contraste de los pares de tokens de la línea panel, con cada acento y en ambos temas.
// Texto: 4,5:1 (WCAG AA). Bordes de campos, foco e íconos: 3:1. Se corre con `npm run contraste`; sale con error si algo falla.
import { readFileSync, readdirSync } from "node:fs";

// Lee las variables de los bloques :root y :root[data-theme="dark"] de un archivo CSS
// (la línea consola usa :root:has(> body.consola) y :root[data-theme="dark"]:has(> body.consola))
function leer(ruta) {
  const css = readFileSync(ruta, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const temas = { claro: {}, oscuro: {} };
  for (const [, selector, cuerpo] of css.matchAll(/(:root(?:\[data-theme="dark"\])?(?::has\(> body\.consola\))?)\s*\{([^}]*)\}/g)) {
    const tema = selector.includes("dark") ? temas.oscuro : temas.claro;
    for (const [, nombre, valor] of cuerpo.matchAll(/--([\w-]+):\s*([^;]+);/g)) tema[nombre] = valor.trim();
  }
  return temas;
}

function rgba(valor) {
  const hex = valor.match(/^#([0-9a-f]{6})$/i);
  if (hex) return [0, 2, 4].map((i) => parseInt(hex[1].slice(i, i + 2), 16)).concat(1);
  const fn = valor.match(/^rgba?\(([^)]+)\)$/);
  if (fn) { const p = fn[1].split(",").map(Number); return [p[0], p[1], p[2], p[3] ?? 1]; }
  throw new Error(`Color no reconocido: ${valor}`);
}

// Un color translúcido se mezcla con el fondo sobre el que está
const sobre = ([r, g, b, a], [fr, fg, fb]) => [r * a + fr * (1 - a), g * a + fg * (1 - a), b * a + fb * (1 - a)];

function luminancia(rgb) {
  const [r, g, b] = rgb.map((c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contraste(frente, fondo) {
  const f = rgba(fondo);
  const [a, b] = [luminancia(sobre(rgba(frente), f)), luminancia(f)];
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const TEXTO = 4.5, CONTROL = 3;
const PARES = [
  ...["tinta", "tinta-2", "tinta-3"].flatMap((t) => ["superficie", "superficie-2", "plano"].map((f) => [t, f, TEXTO])),
  ["acento", "superficie", TEXTO], ["acento", "plano", TEXTO],
  ["sobre-acento", "acento", TEXTO], ["sobre-acento-suave", "acento-suave", TEXTO],
  ["bueno-texto", "superficie", TEXTO], ["critico", "superficie", TEXTO], ["advertencia-texto", "superficie", TEXTO],
  ["acento", "superficie-2", CONTROL],
];
// Conocidos y pendientes de decidir (PREFERENCIAS.md): se informan, pero no hacen fallar la revisión
const PENDIENTES = [["borde-campo", "superficie", CONTROL]];

const base = leer("css/tokens.css");
let fallas = 0;
for (const archivo of readdirSync("css/acentos")) {
  const acento = leer(`css/acentos/${archivo}`);
  for (const tema of ["claro", "oscuro"]) {
    const v = { ...base.claro, ...acento.claro, ...(tema === "oscuro" ? { ...base.oscuro, ...acento.oscuro } : {}) };
    for (const [frente, fondo, minimo] of PARES) {
      const r = contraste(v[frente], v[fondo]);
      if (r < minimo) { fallas++; console.log(`✗ ${archivo.replace(".css", "")} ${tema}: --${frente} sobre --${fondo} = ${r.toFixed(2)}:1 (mínimo ${minimo}:1)`); }
    }
    for (const [frente, fondo, minimo] of PENDIENTES) {
      const r = contraste(v[frente], v[fondo]);
      if (r < minimo) console.log(`· pendiente ${archivo.replace(".css", "")} ${tema}: --${frente} sobre --${fondo} = ${r.toFixed(2)}:1 (mínimo ${minimo}:1)`);
    }
  }
}
// Línea consola: redefine todos los tokens de texto y superficie, sobre cualquier acento (se prueba con azul)
{
  const consola = leer("css/lineas/consola.css");
  const azul = leer("css/acentos/azul.css");
  const PARES_CONSOLA = [...PARES, ["tinta-2", "compositor", TEXTO], ["tinta-3", "compositor", TEXTO],
    ["lateral-tinta", "lateral-fondo", TEXTO], ["lateral-tinta-2", "lateral-fondo", TEXTO]];
  for (const tema of ["claro", "oscuro"]) {
    const v = { ...base.claro, ...azul.claro, ...consola.claro, ...(tema === "oscuro" ? { ...base.oscuro, ...azul.oscuro, ...consola.oscuro } : {}) };
    for (const [frente, fondo, minimo] of PARES_CONSOLA) {
      const r = contraste(v[frente], v[fondo]);
      if (r < minimo) { fallas++; console.log(`✗ consola ${tema}: --${frente} sobre --${fondo} = ${r.toFixed(2)}:1 (mínimo ${minimo}:1)`); }
    }
  }
}
// Línea remanso: sus propios tokens (bloque .remanso), cada paleta (.r-paleta-…) y cada tono de tesela (.r-tono-…)
{
  const css = readFileSync("css/lineas/remanso.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const bloque = (selector) => {
    const m = css.match(new RegExp(`(^|\\n)${selector.replace(".", "\\.")}\\s*\\{([^}]*)\\}`));
    return m ? Object.fromEntries([...m[2].matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, n, v]) => [n, v.trim()])) : {};
  };
  const raiz = bloque(".remanso");
  const PARES_REMANSO = [
    ...["r-tinta", "r-tinta-2", "r-tenue"].flatMap((t) => ["r-fondo", "r-superficie", "r-superficie-2"].map((f) => [t, f, TEXTO])),
    ["r-acento", "r-fondo", TEXTO], ["r-acento", "r-superficie", TEXTO], ["r-sobre-acento", "r-acento", TEXTO],
    ["r-acento-hondo", "r-acento-suave", TEXTO], ["r-acento-vivo", "r-acento", TEXTO], ["#ffffff", "r-calido", TEXTO],
    ["r-acento", "r-superficie-2", CONTROL],
  ];
  for (const paleta of ["bosque", "marea", "arcilla"]) {
    const v = { ...raiz, ...(paleta === "bosque" ? {} : bloque(`.r-paleta-${paleta}`)) };
    const color = (x) => (x.startsWith("#") ? x : v[x]);
    for (const [frente, fondo, minimo] of PARES_REMANSO) {
      const r = contraste(color(frente), color(fondo));
      if (r < minimo) { fallas++; console.log(`✗ remanso ${paleta}: ${frente} sobre ${fondo} = ${r.toFixed(2)}:1 (mínimo ${minimo}:1)`); }
    }
  }
  for (const [, tono] of css.matchAll(/\.r-tono-([a-z]+)\s*\{/g)) {
    const t = bloque(`.r-tono-${tono}`);
    for (const [frente, fondo] of [[t["r-tono-tinta"], t["r-tono"]], ["#ffffff", t["r-tono-tinta"]]]) {
      const r = contraste(frente, fondo);
      if (r < TEXTO) { fallas++; console.log(`✗ remanso tono ${tono}: ${frente} sobre ${fondo} = ${r.toFixed(2)}:1`); }
    }
  }
}
// Línea mascota: sus tokens (bloque .mascota), cada dirección (.mascota.m-direccion-…) en claro y oscuro, las
// categorías de registro y, en Álbum, el texto blanco de los pases sobre el color de cada mascota
{
  const css = readFileSync("css/lineas/mascota.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const bloque = (selector) => {
    const vars = {};
    for (const [, sel, cuerpo] of css.matchAll(/([^{}]+)\{([^}]*)\}/g))
      if (sel.trim() === selector) for (const [, n, v] of cuerpo.matchAll(/--m-([\w-]+):\s*(#[0-9a-f]{6})\s*;/gi)) vars[n] = v;
    return vars;
  };
  const PARES_MASCOTA = [
    ...["tinta", "tinta-2", "tenue"].flatMap((t) => ["fondo", "superficie", "superficie-2"].map((f) => [t, f, TEXTO])),
    ["tenue", "hundido", TEXTO], ["tinta", "hundido", TEXTO], ["tinta-2", "hundido", TEXTO],
    ["acento-texto", "superficie", TEXTO], ["acento-texto", "fondo", TEXTO], ["sobre-acento", "acento", TEXTO],
    ["sobre-acento-suave", "acento-suave", TEXTO], ["sobre-primario", "primario", TEXTO],
    ["critico", "superficie", TEXTO], ["critico", "critico-suave", TEXTO], ["aviso", "superficie", TEXTO], ["aviso", "aviso-suave", TEXTO],
    ["bueno", "superficie", TEXTO], ["bueno", "bueno-suave", TEXTO],
    ["vivo-tinta", "vivo-fondo", TEXTO], ["vivo-tenue", "vivo-fondo", TEXTO], ["vivo-tinta", "vivo-superficie", TEXTO],
    ...["vacuna", "antiparasitario", "comida", "remedio", "veterinario", "peso"].map((c) => [`cat-${c}`, "superficie", TEXTO]),
    ["acento", "superficie", CONTROL],
  ];
  const raiz = { claro: bloque(".mascota"), oscuro: bloque('[data-theme="dark"] .mascota') };
  for (const d of ["paseo", "album", "agenda"])
    for (const tema of ["claro", "oscuro"]) {
      const v = { ...raiz.claro, ...bloque(`.mascota.m-direccion-${d}`), ...(tema === "oscuro" ? { ...raiz.oscuro, ...bloque(`[data-theme="dark"] .mascota.m-direccion-${d}`) } : {}) };
      const pares = [...PARES_MASCOTA, ...(d === "album" ? [1, 2, 3, 4].map((n) => ["#ffffff", `color-${n}`, TEXTO]) : [])];
      for (const [frente, fondo, minimo] of pares) {
        const color = (x) => (x.startsWith("#") ? x : v[x]);
        const r = contraste(color(frente), color(fondo));
        if (r < minimo) { fallas++; console.log(`✗ mascota ${d} ${tema}: ${frente} sobre ${fondo} = ${r.toFixed(2)}:1 (mínimo ${minimo}:1)`); }
      }
    }
}
console.log(fallas ? `\n${fallas} pares bajo el mínimo.` : `✓ Todos los pares cumplen (${PARES.length} pares × acentos × 2 temas).`);
process.exit(fallas ? 1 : 0);
