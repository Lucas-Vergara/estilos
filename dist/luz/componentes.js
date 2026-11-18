import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { acomodarLuces } from "./acomodo.js";
import { PINTORES_FONDO_LUZ } from "./fondos.js";
import { DURACION_ENCENDIDO_LUZ } from "./encendidos.js";
/**
 * Una luz: botón redondo que se enciende despacio, con un destello. Encendida basta: no lleva ✓ (el estado queda en
 * aria-pressed para los lectores de pantalla). `color` es uno de COLORES_LUZ (ambar, coral…). `tam` cambia el
 * diámetro (p. ej. "96px") y `estilo` posiciona la casilla dentro de un tablero con forma. `encendido` elige cómo se
 * prende (ENCENDIDOS_LUZ; por defecto, el destello).
 */
export function Luz({ nombre, detalle, color, hecho, onCambiar, tam, estilo, encendido = "destello" }) {
    const [destello, setDestello] = useState(0); // > 0 mientras se enciende; contar las veces reinicia el reloj
    useEffect(() => {
        if (!destello)
            return;
        const t = setTimeout(() => setDestello(0), DURACION_ENCENDIDO_LUZ[encendido]);
        return () => clearTimeout(t);
    }, [destello, encendido]);
    useEffect(() => { if (!hecho)
        setDestello(0); }, [hecho]); // apagar corta la animación
    return (_jsxs("div", { className: `l-casilla l-color-${color}`, style: tam || estilo ? { ...estilo, ...(tam && { "--l-tam-luz": tam }) } : undefined, children: [_jsx("button", { type: "button", className: claseLuz(encendido, destello > 0), "aria-pressed": hecho, "aria-label": `${nombre}: ${hecho ? "hecho, tocar para apagar" : "pendiente, tocar para encender"}`, onClick: () => {
                    if (!hecho)
                        setDestello((n) => n + 1);
                    onCambiar(!hecho);
                }, children: _jsx(CapasEncendido, { encendido: encendido }) }), _jsx("span", { className: "l-nombre", children: nombre }), detalle && _jsx("span", { className: "l-detalle", children: detalle })] }));
}
/** Las clases de una .l-luz según cómo se enciende y si está encendiéndose ahora (sirve para muestras sin Luz). */
export function claseLuz(encendido = "destello", destellando = false) {
    return `l-luz${encendido !== "destello" ? ` l-encendido-${encendido}` : ""}${destellando ? " l-destellando" : ""}`;
}
/** Las capas que necesita cada encendido dentro de la .l-luz (el destello no lleva: usa ::after). */
export function CapasEncendido({ encendido }) {
    const ondas = encendido === "pulsos" ? 3 : encendido === "completa" ? 2 : 0;
    const arco = encendido === "carga" || encendido === "completa";
    return (_jsxs(_Fragment, { children: [Array.from({ length: ondas }, (_, i) => _jsx("span", { className: "l-efecto l-onda", "aria-hidden": "true" }, i)), arco && _jsx("span", { className: "l-efecto l-arco l-arco-brillo", "aria-hidden": "true" }), arco && _jsx("span", { className: "l-efecto l-arco", "aria-hidden": "true" }), arco && _jsx("span", { className: "l-efecto l-punta", "aria-hidden": "true" })] }));
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
