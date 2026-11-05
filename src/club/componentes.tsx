import { useCallback, useEffect, useState, type ReactNode, type RefObject } from "react";

/** Indicador de pasos de un formulario: 1 Tus datos · 2 … · 3 Confirma. `actual` parte en 0. */
export function IndicadorPasos({ pasos, actual, etiqueta = "Pasos" }: { pasos: string[]; actual: number; etiqueta?: string }) {
  return (
    <ol className="c-indicador-pasos" aria-label={etiqueta}>
      {pasos.map((p, i) => (
        <li key={p} aria-current={i === actual ? "step" : undefined} className={i < actual ? "c-hecho" : undefined}>
          <span>{i < actual ? "✓" : i + 1}</span>
          <span>{p}</span>
        </li>
      ))}
    </ol>
  );
}

/** Marco de celular con la barra de la app de miembros y la barra de pestañas de abajo. */
export function Telefono({ marca, sub, inicial = "C", pestanas, activa = 0, children }: {
  marca: string; sub?: string; inicial?: string; pestanas?: string[]; activa?: number; children: ReactNode;
}) {
  return (
    <div className="c-tel" role="img" aria-label={`Vista de la app de ${marca}`}>
      <div className="c-tel-pantalla">
        <div className="c-tel-barra">
          <span className="c-marca">
            <span className="c-marca-nombre">{marca}</span>
            {sub && <span className="c-marca-sub">{sub}</span>}
          </span>
          <span className="c-tel-avatar">{inicial}</span>
        </div>
        <div className="c-tel-contenido">{children}</div>
        {pestanas && (
          <div className="c-tel-tabs">
            {pestanas.map((p, i) => <span key={p} className={i === activa ? "c-activo" : undefined}>{p}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Sección fija que avanza con el scroll: la sección mide `n` pantallas de alto y su contenido queda pegado (.c-app-fija).
 * Devuelve el índice activo y una función que hace scroll hasta el tramo de un índice (para los botones de la lista).
 */
export function useProgresoFijo(ref: RefObject<HTMLElement | null>, n: number): [number, (i: number) => void] {
  const [activo, setActivo] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cuadro = 0;
    const medir = () => {
      cuadro = 0;
      const r = el.getBoundingClientRect();
      const recorrido = r.height - window.innerHeight;
      const p = recorrido > 0 ? Math.min(Math.max(-r.top / recorrido, 0), 0.9999) : 0;
      setActivo(Math.floor(p * n));
    };
    const alMover = () => { if (!cuadro) cuadro = requestAnimationFrame(medir); };
    medir();
    window.addEventListener("scroll", alMover, { passive: true });
    window.addEventListener("resize", alMover);
    return () => { window.removeEventListener("scroll", alMover); window.removeEventListener("resize", alMover); cancelAnimationFrame(cuadro); };
  }, [ref, n]);
  const ir = useCallback((i: number) => {
    const el = ref.current;
    if (!el) return;
    const recorrido = el.offsetHeight - window.innerHeight;
    const arriba = el.getBoundingClientRect().top + window.scrollY;
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: arriba + recorrido * ((i + 0.5) / n), behavior: quieto ? "auto" : "smooth" });
  }, [ref, n]);
  return [activo, ir];
}
