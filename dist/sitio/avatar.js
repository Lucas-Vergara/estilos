import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Avatar circular con anillo y una burbuja de saludo que se mueve al pasar el cursor (al estilo de Josh Comeau y
 * Robb Owen). Sin foto muestra las iniciales sobre un degradado del acento.
 */
export function Avatar({ src, alt = "", iniciales, tamano = 96, saludo = "Hola" }) {
    return (_jsxs("span", { className: "s-avatar", style: { ["--tamano"]: `${tamano}px` }, children: [src ? _jsx("img", { src: src, alt: alt }) : _jsx("span", { className: "s-avatar-iniciales", "aria-hidden": !alt, children: iniciales }), saludo && _jsx("span", { className: "s-avatar-saludo", "aria-hidden": "true", children: saludo })] }));
}
