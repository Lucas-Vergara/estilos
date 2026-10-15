import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { sonidos } from "./sonidos.js";

export interface EnlaceNav { id: string; texto: string; href?: string }

/**
 * Navegación en píldora (al estilo de Josh Comeau): una píldora blanca marca la página actual y se desliza hacia el
 * enlace bajo el cursor; al salir vuelve a la actual. `onIr` permite cambiar de página con irCon (telón).
 */
export function NavPildora({ enlaces, activo, onIr, etiqueta = "Principal" }: {
  enlaces: EnlaceNav[];
  activo: string;
  onIr?: (enlace: EnlaceNav) => void;
  etiqueta?: string;
}) {
  const refs = useRef(new Map<string, HTMLElement>());
  const [sobre, setSobre] = useState<string | null>(null);
  const [caja, setCaja] = useState<{ x: number; w: number } | null>(null);
  const objetivo = sobre ?? activo;

  useLayoutEffect(() => {
    const medir = () => {
      const el = refs.current.get(objetivo);
      setCaja(el ? { x: el.offsetLeft, w: el.offsetWidth } : null);
    };
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, [objetivo, enlaces]);

  return (
    <nav className="s-nav" aria-label={etiqueta} onPointerLeave={() => setSobre(null)}>
      <span
        className="s-nav-indicador"
        aria-hidden="true"
        style={{ width: caja?.w ?? 0, transform: `translateX(${caja?.x ?? 0}px)`, opacity: caja ? 1 : 0 } as CSSProperties}
      />
      {enlaces.map((e) => (
        <a
          key={e.id}
          ref={(el) => { if (el) refs.current.set(e.id, el); }}
          href={e.href ?? `#${e.id}`}
          aria-current={e.id === activo ? "page" : undefined}
          onPointerEnter={() => setSobre(e.id)}
          onFocus={() => setSobre(e.id)}
          onBlur={() => setSobre(null)}
          onClick={(ev) => {
            sonidos.clic();
            if (onIr) { ev.preventDefault(); onIr(e); }
          }}
        >
          {e.texto}
        </a>
      ))}
    </nav>
  );
}

/**
 * Id de la sección que se está leyendo (la que cruza la franja central de la pantalla), para marcar el menú al hacer
 * scroll en una página de una sola pieza. Devuelve el primero de la lista mientras no hay ninguna a la vista.
 */
export function useSeccionActiva(ids: string[]) {
  const [activa, setActiva] = useState(ids[0]);
  const clave = ids.join(",");
  useEffect(() => {
    const visibles = new Set<string>();
    const io = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) visibles.add(e.target.id); else visibles.delete(e.target.id);
      }
      const primera = ids.find((id) => visibles.has(id));
      if (primera) setActiva(primera);
    }, { rootMargin: "-40% 0px -55% 0px" });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [clave]); // eslint-disable-line react-hooks/exhaustive-deps
  return activa;
}
