import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
function leerTema() {
    try {
        return localStorage.getItem("tema") === "dark" ? "dark" : "light";
    }
    catch {
        return "light";
    }
}
function aplicarTema(tema) {
    if (tema === "dark")
        document.documentElement.dataset.theme = "dark";
    else
        delete document.documentElement.dataset.theme;
    try {
        localStorage.setItem("tema", tema);
    }
    catch {
        /* sin almacenamiento: el tema dura solo esta sesión */
    }
}
/** Botón claro/oscuro. El modo claro es el predeterminado, independiente del sistema. */
export function BotonTema() {
    const [tema, setTema] = useState(leerTema);
    const siguiente = tema === "dark" ? "light" : "dark";
    const etiqueta = siguiente === "dark" ? "Cambiar a modo oscuro" : "Cambiar a modo claro";
    return (_jsx("button", { className: "boton boton-icono", title: etiqueta, "aria-label": etiqueta, onClick: () => {
            aplicarTema(siguiente);
            setTema(siguiente);
        }, children: tema === "dark" ? (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", "aria-hidden": "true", children: [_jsx("circle", { cx: "12", cy: "12", r: "4" }), _jsx("path", { d: "M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" })] })) : (_jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("path", { d: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" }) })) }));
}
