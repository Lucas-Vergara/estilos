import { useState } from "react";

type Tema = "light" | "dark";

function leerTema(clave: string, predeterminado: Tema): Tema {
  try {
    const guardado = localStorage.getItem(clave);
    return guardado === "dark" || guardado === "light" ? guardado : predeterminado;
  } catch {
    return predeterminado;
  }
}

function aplicarTema(tema: Tema, clave: string) {
  if (tema === "dark") document.documentElement.dataset.theme = "dark";
  else delete document.documentElement.dataset.theme;
  try {
    localStorage.setItem(clave, tema);
  } catch {
    /* sin almacenamiento: el tema dura solo esta sesión */
  }
}

/**
 * Botón claro/oscuro, independiente del sistema. El claro es el predeterminado; la línea consola usa
 * `predeterminado="dark"` con su propia `clave` (y el script de index.html que aplica el tema antes de pintar).
 */
export function BotonTema({ predeterminado = "light", clave = "tema", className = "boton boton-icono", tamano = 18 }: {
  predeterminado?: Tema;
  /** Clave en localStorage. */
  clave?: string;
  className?: string;
  tamano?: number;
} = {}) {
  const [tema, setTema] = useState<Tema>(() => leerTema(clave, predeterminado));
  const siguiente: Tema = tema === "dark" ? "light" : "dark";
  const etiqueta = siguiente === "dark" ? "Cambiar a modo oscuro" : "Cambiar a modo claro";
  return (
    <button
      type="button"
      className={className}
      title={etiqueta}
      aria-label={etiqueta}
      onClick={() => {
        aplicarTema(siguiente, clave);
        setTema(siguiente);
      }}
    >
      {tema === "dark" ? (
        // Sol: volver a claro
        <svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        // Luna: pasar a oscuro
        <svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
