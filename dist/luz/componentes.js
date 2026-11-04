import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { acomodarLuces } from "./acomodo.js";
import { PINTORES_FONDO_LUZ } from "./fondos.js";
/**
 * Una luz: botón redondo que se enciende despacio, con un destello. Encendida basta: no lleva ✓ (el estado queda en
 * aria-pressed para los lectores de pantalla). `color` es uno de COLORES_LUZ (ambar, coral…). `tam` cambia el
 * diámetro (p. ej. "96px") y `estilo` posiciona la casilla dentro de un tablero con forma.
 */
export function Luz({ nombre, detalle, color, hecho, onCambiar, tam, estilo }) {
    const [destello, setDestello] = useState(false);
    return (_jsxs("div", { className: `l-casilla l-color-${color}`, style: tam || estilo ? { ...estilo, ...(tam && { "--l-tam-luz": tam }) } : undefined, children: [_jsx("button", { type: "button", className: `l-luz${destello ? " l-destellando" : ""}`, "aria-pressed": hecho, "aria-label": `${nombre}: ${hecho ? "hecho, tocar para apagar" : "pendiente, tocar para encender"}`, onClick: () => {
                    if (!hecho)
                        setDestello(true);
                    onCambiar(!hecho);
                }, onAnimationEnd: () => setDestello(false) }), _jsx("span", { className: "l-nombre", children: nombre }), detalle && _jsx("span", { className: "l-detalle", children: detalle })] }));
}
/**
 * El fondo detrás de las luces: una capa .l-fondo (absoluta; con `fijo`, ocupa la ventana). En reposo se apaga sola.
 * `luces` dice dónde buscar las luces (la arena las rodea con surcos).
 */
export function CapaFondo({ fondo, fijo = false, luces, className = "" }) {
    const capa = useRef(null);
    const buscar = useRef(luces);
    buscar.current = luces;
    const clase = `l-fondo${fijo ? " l-fondo-fijo" : ""}${className ? ` ${className}` : ""}`;
    useEffect(() => {
        const el = capa.current;
        const pintar = PINTORES_FONDO_LUZ[fondo];
        if (!el || !pintar)
            return;
        const limpiar = pintar(el, () => [...(buscar.current?.()?.querySelectorAll(".l-luz") ?? [])].map((b) => b.getBoundingClientRect()));
        return () => {
            limpiar();
            el.replaceChildren();
            el.removeAttribute("style");
            el.className = clase;
        };
    }, [fondo, clase]);
    return _jsx("div", { ref: capa, className: clase, "aria-hidden": "true" });
}
/**
 * Mide el tablero y calcula dónde va cada luz para un orden con forma. Devuelve null con "filas" (lo hace el CSS).
 * Al tablero se le pone .l-forma, y a cada casilla, `estiloDeLuz(acomodo, i)`.
 */
export function useAcomodoLuces(tablero, orden, cantidad, opciones) {
    const [tam, setTam] = useState([0, 0]);
    useEffect(() => {
        const el = tablero.current;
        if (!el || orden === "filas")
            return;
        const vigia = new ResizeObserver(([e]) => setTam([e.contentRect.width, e.contentRect.height]));
        vigia.observe(el);
        return () => vigia.disconnect();
    }, [tablero, orden, cantidad]);
    return acomodarLuces(orden, cantidad, tam[0], tam[1], opciones);
}
/** Posición y tamaño de la luz `i` dentro de un tablero .l-forma (para `tam` y `estilo` de `Luz`). */
export function lugarDeLuz(acomodo, i) {
    const c = acomodo?.centros[i];
    if (!acomodo || !c)
        return {};
    return { tam: `${Math.round(acomodo.d)}px`, estilo: { left: c[0], top: c[1] - acomodo.d / 2 } };
}
