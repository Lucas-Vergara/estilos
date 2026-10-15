import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { sonidos } from "./sonidos.js";
/**
 * Navegación en píldora (al estilo de Josh Comeau): una píldora blanca marca la página actual y se desliza hacia el
 * enlace bajo el cursor; al salir vuelve a la actual. `onIr` permite cambiar de página con irCon (telón).
 */
export function NavPildora({ enlaces, activo, onIr, etiqueta = "Principal" }) {
    const refs = useRef(new Map());
    const [sobre, setSobre] = useState(null);
    const [caja, setCaja] = useState(null);
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
    return (_jsxs("nav", { className: "s-nav", "aria-label": etiqueta, onPointerLeave: () => setSobre(null), children: [_jsx("span", { className: "s-nav-indicador", "aria-hidden": "true", style: { width: caja?.w ?? 0, transform: `translateX(${caja?.x ?? 0}px)`, opacity: caja ? 1 : 0 } }), enlaces.map((e) => (_jsx("a", { ref: (el) => { if (el)
                    refs.current.set(e.id, el); }, href: e.href ?? `#${e.id}`, "aria-current": e.id === activo ? "page" : undefined, onPointerEnter: () => setSobre(e.id), onFocus: () => setSobre(e.id), onBlur: () => setSobre(null), onClick: (ev) => {
                    sonidos.clic();
                    if (onIr) {
                        ev.preventDefault();
                        onIr(e);
                    }
                }, children: e.texto }, e.id)))] }));
}
/**
 * Id de la sección que se está leyendo (la que cruza la franja central de la pantalla), para marcar el menú al hacer
 * scroll en una página de una sola pieza. Devuelve el primero de la lista mientras no hay ninguna a la vista.
 */
export function useSeccionActiva(ids) {
    const [activa, setActiva] = useState(ids[0]);
    const clave = ids.join(",");
    useEffect(() => {
        const visibles = new Set();
        const io = new IntersectionObserver((entradas) => {
            for (const e of entradas) {
                if (e.isIntersecting)
                    visibles.add(e.target.id);
                else
                    visibles.delete(e.target.id);
            }
            const primera = ids.find((id) => visibles.has(id));
            if (primera)
                setActiva(primera);
        }, { rootMargin: "-40% 0px -55% 0px" });
        ids.forEach((id) => { const el = document.getElementById(id); if (el)
            io.observe(el); });
        return () => io.disconnect();
    }, [clave]); // eslint-disable-line react-hooks/exhaustive-deps
    return activa;
}
