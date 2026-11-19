import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const VARIANTES_GRILLA = ["editorial", "celdas"];
export const NOMBRES_VARIANTE_GRILLA = { editorial: "A · Editorial", celdas: "B · Celdas" };
export const NOTAS_VARIANTE_GRILLA = {
    editorial: "Columnas con separación fija y mucho aire, como una revista.",
    celdas: "Celdas con línea fina y relleno, como una ficha técnica.",
};
/** Columnas en celular: A cae a 4 y B a 2. */
export const COLUMNAS_CELULAR_GRILLA = { editorial: 4, celdas: 2 };
/**
 * Ancho de celular (en 12avos) redondeado a lo que calza con la grilla de celular de la variante:
 * cuartos en A (3, 6, 9, 12) y mitades en B (6, 12). Sin valor, la celda ocupa todo el ancho.
 */
export function anchoCelularGrilla(variante, ancho) {
    if (!ancho)
        return 12;
    const paso = 12 / COLUMNAS_CELULAR_GRILLA[variante];
    return Math.min(12, Math.max(paso, Math.round(ancho / paso) * paso));
}
export function Grilla({ variante = "editorial", alinear, cabecera, className, style, children, ...datos }) {
    const partes = Array.isArray(cabecera) ? cabecera : cabecera != null ? [cabecera] : [];
    return (_jsxs("div", { className: `grilla grilla-${variante}${className ? ` ${className}` : ""}`, "data-variante": variante, "data-alinear": alinear, style: style, ...datos, children: [variante === "celdas" && partes.length > 0 && (_jsx("div", { className: "grilla-cabecera", children: partes.map((p, i) => _jsx("span", { children: p }, i)) })), children] }));
}
export function Celda({ ancho = 12, anchoCelular, variante = "editorial", relleno = true, className, style, children, ...datos }) {
    const vars = { "--grilla-ancho": Math.min(12, Math.max(1, ancho)), "--grilla-ancho-celular": anchoCelularGrilla(variante, anchoCelular) };
    return (_jsx("div", { className: `grilla-celda${className ? ` ${className}` : ""}`, "data-relleno": relleno ? undefined : "no", style: { ...vars, ...style }, ...datos, children: children }));
}
