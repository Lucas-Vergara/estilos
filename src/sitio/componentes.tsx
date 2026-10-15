import { useEffect, useRef, type CSSProperties } from "react";

// Componentes de la línea "sitio". Las clases están en css/lineas/sitio.css.

/** Texto con las palabras entre *asteriscos* en itálica acento (.s-acento). */
export function Acento({ texto }: { texto: string }) {
  return (
    <>
      {texto.split(/(\*[^*]+\*)/g).map((parte, i) =>
        parte.startsWith("*") && parte.endsWith("*") ? <span key={i} className="s-acento">{parte.slice(1, -1)}</span> : parte,
      )}
    </>
  );
}

/**
 * Divide un texto en palabras animables ([data-w]) para el movimiento de scroll: "stagger" entran escalonadas al
 * aparecer; "scroll" se encienden con el avance. "*con carácter*" va en itálica acento como un solo bloque.
 */
export function Palabras({ texto, modo, como: Etiqueta = "h2", className }: {
  texto: string;
  modo: "stagger" | "scroll";
  como?: "h1" | "h2" | "h3" | "p";
  className?: string;
}) {
  const piezas = texto.match(/\*[^*]+\*|\S+/g) ?? [];
  return (
    <Etiqueta data-words={modo} className={className}>
      {piezas.map((p, i) => {
        const acento = p.startsWith("*");
        return (
          <span key={i}>
            <span data-w="" className={acento ? "s-acento" : undefined} style={modo === "stagger" ? ({ "--i": i } as CSSProperties) : undefined}>
              {acento ? p.slice(1, -1) : p}
            </span>
            {i < piezas.length - 1 ? " " : null}
          </span>
        );
      })}
    </Etiqueta>
  );
}

/**
 * Cursor propio (solo escritorio con mouse): un punto acento que sigue al puntero y se agranda con una etiqueta sobre
 * los elementos con data-cursor="Ver". No reemplaza el cursor del sistema, así nada deja de funcionar.
 */
export function Cursor() {
  const punto = useRef<HTMLDivElement>(null);
  const etiqueta = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fino = window.matchMedia("(pointer: fine)").matches;
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fino || reducido) return;
    const el = punto.current!;
    let x = -100, y = -100, cx = x, cy = y, raf = 0;
    const bucle = () => {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      el.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.1 ? requestAnimationFrame(bucle) : 0;
    };
    const mover = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      el.dataset.on = "";
      const destino = (e.target as Element | null)?.closest?.("[data-cursor]") as HTMLElement | null;
      const texto = destino?.dataset.cursor ?? "";
      if (etiqueta.current && etiqueta.current.textContent !== texto) etiqueta.current.textContent = texto;
      if (texto) el.dataset.grande = "";
      else delete el.dataset.grande;
      if (!raf) raf = requestAnimationFrame(bucle);
    };
    const salir = () => delete el.dataset.on;
    window.addEventListener("pointermove", mover, { passive: true });
    document.documentElement.addEventListener("pointerleave", salir);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", mover);
      document.documentElement.removeEventListener("pointerleave", salir);
    };
  }, []);

  return (
    <div ref={punto} className="s-cursor" aria-hidden="true">
      <span ref={etiqueta} />
    </div>
  );
}

/**
 * Navega con una transición de página (View Transitions) si el navegador la soporta y el usuario no pidió menos
 * movimiento. El estilo lo elige <html data-transicion="fundido|telon">.
 */
export function conTransicion(cambiar: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!doc.startViewTransition || reducido) cambiar();
  else doc.startViewTransition(cambiar);
}
