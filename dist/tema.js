import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
function leerTema(clave, predeterminado) {
    try {
        const guardado = localStorage.getItem(clave);
        return guardado === "dark" || guardado === "light" ? guardado : predeterminado;
    }
    catch {
        return predeterminado;
    }
}
function aplicarTema(tema, clave) {
    if (tema === "dark")
        document.documentElement.dataset.theme = "dark";
    else
        delete document.documentElement.dataset.theme;
    try {
        localStorage.setItem(clave, tema);
    }
    catch {
        /* sin almacenamiento: el tema dura solo esta sesión */
    }
}
/**
 * Botón claro/oscuro, independiente del sistema. El claro es el predeterminado; la línea consola usa
 * `predeterminado="dark"` con su propia `clave` (y el script de index.html que aplica el tema antes de pintar).
 */
export function BotonTema({ predeterminado = "light", clave = "tema", className = "boton boton-icono", tamano = 18 } = {}) {
    const [tema, setTema] = useState(() => leerTema(clave, predeterminado));
    const siguiente = tema === "dark" ? "light" : "dark";
    const etiqueta = siguiente === "dark" ? "Cambiar a modo oscuro" : "Cambiar a modo claro";
    return (_jsx("button", { type: "button", className: className, title: etiqueta, "aria-label": etiqueta, onClick: () => {
            aplicarTema(siguiente, clave);
            setTema(siguiente);
        }, children: tema === "dark" ? (_jsxs("svg", { width: tamano, height: tamano, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", "aria-hidden": "true", children: [_jsx("circle", { cx: "12", cy: "12", r: "4" }), _jsx("path", { d: "M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" })] })) : (_jsx("svg", { width: tamano, height: tamano, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("path", { d: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" }) })) }));
}
