import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from "react";
/** Indicador de pasos de un formulario: 1 Tus datos · 2 … · 3 Confirma. `actual` parte en 0. */
export function IndicadorPasos({ pasos, actual, etiqueta = "Pasos" }) {
    return (_jsx("ol", { className: "c-indicador-pasos", "aria-label": etiqueta, children: pasos.map((p, i) => (_jsxs("li", { "aria-current": i === actual ? "step" : undefined, className: i < actual ? "c-hecho" : undefined, children: [_jsx("span", { children: i < actual ? "✓" : i + 1 }), _jsx("span", { children: p })] }, p))) }));
}
/** Marco de celular con la barra de la app de miembros y la barra de pestañas de abajo. */
export function Telefono({ marca, sub, inicial = "C", pestanas, activa = 0, children }) {
    return (_jsx("div", { className: "c-tel", role: "img", "aria-label": `Vista de la app de ${marca}`, children: _jsxs("div", { className: "c-tel-pantalla", children: [_jsxs("div", { className: "c-tel-barra", children: [_jsxs("span", { className: "c-marca", children: [_jsx("span", { className: "c-marca-nombre", children: marca }), sub && _jsx("span", { className: "c-marca-sub", children: sub })] }), _jsx("span", { className: "c-tel-avatar", children: inicial })] }), _jsx("div", { className: "c-tel-contenido", children: children }), pestanas && (_jsx("div", { className: "c-tel-tabs", children: pestanas.map((p, i) => _jsx("span", { className: i === activa ? "c-activo" : undefined, children: p }, p)) }))] }) }));
}
/**
 * Sección fija que avanza con el scroll: la sección mide `n` pantallas de alto y su contenido queda pegado (.c-app-fija).
 * Devuelve el índice activo y una función que hace scroll hasta el tramo de un índice (para los botones de la lista).
 */
export function useProgresoFijo(ref, n) {
    const [activo, setActivo] = useState(0);
    useEffect(() => {
        const el = ref.current;
        if (!el)
            return;
        let cuadro = 0;
        const medir = () => {
            cuadro = 0;
            const r = el.getBoundingClientRect();
            const recorrido = r.height - window.innerHeight;
            const p = recorrido > 0 ? Math.min(Math.max(-r.top / recorrido, 0), 0.9999) : 0;
            setActivo(Math.floor(p * n));
        };
        const alMover = () => { if (!cuadro)
            cuadro = requestAnimationFrame(medir); };
        medir();
        window.addEventListener("scroll", alMover, { passive: true });
        window.addEventListener("resize", alMover);
        return () => { window.removeEventListener("scroll", alMover); window.removeEventListener("resize", alMover); cancelAnimationFrame(cuadro); };
    }, [ref, n]);
    const ir = useCallback((i) => {
        const el = ref.current;
        if (!el)
            return;
        const recorrido = el.offsetHeight - window.innerHeight;
        const arriba = el.getBoundingClientRect().top + window.scrollY;
        const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: arriba + recorrido * ((i + 0.5) / n), behavior: quieto ? "auto" : "smooth" });
    }, [ref, n]);
    return [activo, ir];
}
