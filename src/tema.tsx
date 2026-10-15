import { useState } from "react";

type Tema = "light" | "dark";

function leerTema(): Tema {
  try {
    return localStorage.getItem("tema") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function aplicarTema(tema: Tema) {
  if (tema === "dark") document.documentElement.dataset.theme = "dark";
  else delete document.documentElement.dataset.theme;
  try {
    localStorage.setItem("tema", tema);
  } catch {
    /* sin almacenamiento: el tema dura solo esta sesión */
  }
}

/** Botón claro/oscuro. El modo claro es el predeterminado, independiente del sistema. */
export function BotonTema() {
  const [tema, setTema] = useState<Tema>(leerTema);
  const siguiente: Tema = tema === "dark" ? "light" : "dark";
  const etiqueta = siguiente === "dark" ? "Cambiar a modo oscuro" : "Cambiar a modo claro";
  return (
    <button
      className="boton boton-icono"
      title={etiqueta}
      aria-label={etiqueta}
      onClick={() => {
        aplicarTema(siguiente);
        setTema(siguiente);
      }}
    >
      {tema === "dark" ? (
        // Sol: volver a claro
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        // Luna: pasar a oscuro
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
