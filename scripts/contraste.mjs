// Verifica el contraste de los pares de tokens de la línea panel, con cada acento y en ambos temas.
// Texto: 4,5:1 (WCAG AA). Bordes de campos, foco e íconos: 3:1. Se corre con `npm run contraste`; sale con error si algo falla.
import { readFileSync, readdirSync } from "node:fs";

// Lee las variables de los bloques :root y :root[data-theme="dark"] de un archivo CSS
function leer(ruta) {
  const css = readFileSync(ruta, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const temas = { claro: {}, oscuro: {} };
  for (const [, selector, cuerpo] of css.matchAll(/(:root(?:\[data-theme="dark"\])?)\s*\{([^}]*)\}/g)) {
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
console.log(fallas ? `\n${fallas} pares bajo el mínimo.` : `✓ Todos los pares cumplen (${PARES.length} pares × acentos × 2 temas).`);
process.exit(fallas ? 1 : 0);
