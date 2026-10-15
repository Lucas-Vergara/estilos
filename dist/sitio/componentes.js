import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
/** Texto con las palabras entre *asteriscos* destacadas con la clase acento de la línea (.s-acento / .sd-acento). */
export function Acento({ texto, prefijo = "s" }) {
    return (_jsx(_Fragment, { children: texto.split(/(\*[^*]+\*)/g).map((parte, i) => parte.startsWith("*") && parte.endsWith("*") ? _jsx("span", { className: `${prefijo}-acento`, children: parte.slice(1, -1) }, i) : parte) }));
}
/**
 * Divide un texto en palabras animables ([data-w]) para el movimiento de scroll: "stagger" entran escalonadas al
 * aparecer; "scroll" se encienden con el avance. "*con carácter*" va en itálica acento como un solo bloque.
 */
export function Palabras({ texto, modo, como: Etiqueta = "h2", className, prefijo = "s" }) {
    // Una palabra destacada conserva la puntuación pegada a ella ("*claros*," → "claros,").
    const piezas = texto.match(/\*[^*]+\*[^\s*]*|\S+/g) ?? [];
    return (_jsx(Etiqueta, { "data-words": modo, className: className, children: piezas.map((p, i) => {
            const acento = p.startsWith("*");
            const cierre = acento ? p.indexOf("*", 1) : -1;
            return (_jsxs("span", { children: [_jsx("span", { "data-w": "", style: modo === "stagger" ? { "--i": i } : undefined, children: acento ? _jsxs(_Fragment, { children: [_jsx("span", { className: `${prefijo}-acento`, children: p.slice(1, cierre) }), p.slice(cierre + 1)] }) : p }), i < piezas.length - 1 ? " " : null] }, i));
        }) }));
}
/**
 * Cursor propio (solo escritorio con mouse): un punto acento que sigue al puntero y se agranda con una etiqueta sobre
 * los elementos con data-cursor="Ver". No reemplaza el cursor del sistema, así nada deja de funcionar.
 */
export function Cursor({ prefijo = "s" }) {
    const punto = useRef(null);
    const etiqueta = useRef(null);
    useEffect(() => {
        const fino = window.matchMedia("(pointer: fine)").matches;
        const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!fino || reducido)
            return;
        const el = punto.current;
        let x = -100, y = -100, cx = x, cy = y, raf = 0;
        const bucle = () => {
            cx += (x - cx) * 0.22;
            cy += (y - cy) * 0.22;
            el.style.transform = `translate3d(${cx}px,${cy}px,0)`;
            raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.1 ? requestAnimationFrame(bucle) : 0;
        };
        const mover = (e) => {
            if (e.pointerType !== "mouse")
                return;
            x = e.clientX;
            y = e.clientY;
            el.dataset.on = "";
            const destino = e.target?.closest?.("[data-cursor]");
            const texto = destino?.dataset.cursor ?? "";
            if (etiqueta.current && etiqueta.current.textContent !== texto)
                etiqueta.current.textContent = texto;
            if (texto)
                el.dataset.grande = "";
            else
                delete el.dataset.grande;
            if (!raf)
                raf = requestAnimationFrame(bucle);
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
    return (_jsx("div", { ref: punto, className: `${prefijo}-cursor`, "aria-hidden": "true", children: _jsx("span", { ref: etiqueta }) }));
}
/**
 * Navega con una transición de página (View Transitions) si el navegador la soporta y el usuario no pidió menos
 * movimiento. El estilo lo elige <html data-transicion="fundido|telon">.
 */
export function conTransicion(cambiar) {
    const doc = document;
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reducido)
        cambiar();
    else
        doc.startViewTransition(cambiar);
}
