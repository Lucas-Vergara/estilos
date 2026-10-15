import { useEffect, useState, type CSSProperties } from "react";
import { sonidos } from "../../src/sitio";
import "./vitrina-paletas.css";

// Paletas de la línea sitio (clases .s-paleta-… en sitio.css). Los colores aquí son solo para las muestras del selector.
// La vitrina parte en grafito; la biblioteca, sin clase, usa índigo.
export const PALETAS = [
  { id: "grafito", nombre: "Grafito", acento: "#18181b", destello: "#d9f84a" },
  { id: "indigo", nombre: "Índigo", acento: "#3d5afe", destello: "#ffd84d" },
  { id: "ciruela", nombre: "Ciruela", acento: "#6d3ee8", destello: "#ff8fc2" },
  { id: "coral", nombre: "Coral", acento: "#cc4128", destello: "#ffd166" },
  { id: "bosque", nombre: "Bosque", acento: "#1d7a4c", destello: "#f2d45c" },
  { id: "oceano", nombre: "Océano", acento: "#0b7189", destello: "#ffb84d" },
  { id: "arena", nombre: "Arena", acento: "#2a241d", destello: "#ff7a45" },
];
const POR_DEFECTO = "grafito";
const CLAVE = "estilos-paleta-vitrina";

function leer() {
  try { const v = localStorage.getItem(CLAVE); return PALETAS.some((p) => p.id === v) ? v! : POR_DEFECTO; } catch { return POR_DEFECTO; }
}

/** Paleta elegida: la aplica en <body> y la recuerda en este navegador. */
export function usePaleta() {
  const [paleta, setPaleta] = useState(leer);
  useEffect(() => {
    PALETAS.forEach((p) => document.body.classList.toggle(`s-paleta-${p.id}`, p.id === paleta));
    try { localStorage.setItem(CLAVE, paleta); } catch { /* sin almacenamiento: no se recuerda */ }
  }, [paleta]);
  return [paleta, setPaleta] as const;
}

export function SelectorPaleta({ paleta, setPaleta }: { paleta: string; setPaleta: (p: string) => void }) {
  const actual = PALETAS.find((p) => p.id === paleta)!;
  return (
    <div className="paletas" role="group" aria-label="Paleta de colores">
      <span className="paletas-nombre">{actual.nombre}</span>
      {PALETAS.map((p) => (
        <button key={p.id} type="button" className="paleta-muestra" aria-pressed={paleta === p.id} aria-label={`Paleta ${p.nombre}`} title={p.nombre}
          style={{ "--m-acento": p.acento, "--m-destello": p.destello } as CSSProperties}
          onClick={() => { setPaleta(p.id); sonidos.clic(); }} />
      ))}
    </div>
  );
}
