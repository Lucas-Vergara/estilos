import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Area, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Line, LineChart, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { EsqueletoGrafico, Vacio } from "./componentes";
import { diaCorto } from "./fechas";
// Gráficos con Recharts, coloreados con las variables CSS (--serie-1, --grilla, --eje…): siguen el acento y el modo oscuro.
const IconoLinea = () => (_jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [_jsx("path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }), _jsx("path", { d: "m19 9-5 5-4-4-3 3" })] }));
const IconoBarras = () => (_jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [_jsx("path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }), _jsx("path", { d: "M18 17V9" }), _jsx("path", { d: "M13 17V5" }), _jsx("path", { d: "M8 17v-3" })] }));
/** Mini gráfico de línea sin ejes, para mostrar la tendencia junto a un número. */
export function Sparkline({ valores, color = "var(--serie-1)", escalonado, ancho = 96, alto = 32, etiqueta, fluido }) {
    const datos = valores.map((v, i) => ({ i, v }));
    if (valores.filter((v) => v != null).length < 2)
        return fluido ? _jsx("div", { style: { height: alto } }) : _jsx("span", { className: "muted", style: { display: "inline-block", width: ancho }, children: "\u2014" });
    if (fluido)
        return (_jsx("div", { style: { height: alto }, role: "img", "aria-label": etiqueta, children: _jsx(ResponsiveContainer, { width: "100%", height: alto, children: _jsxs(ComposedChart, { data: datos, margin: { top: 3, right: 1, bottom: 1, left: 1 }, children: [_jsx(YAxis, { hide: true, domain: ["dataMin", "dataMax"] }), _jsx(Area, { dataKey: "v", type: escalonado ? "stepAfter" : "monotone", fill: color, fillOpacity: 0.1, stroke: "none", connectNulls: true, isAnimationActive: false }), _jsx(Line, { dataKey: "v", type: escalonado ? "stepAfter" : "monotone", stroke: color, strokeWidth: 2, dot: false, connectNulls: true, isAnimationActive: false })] }) }) }));
    return (_jsx("div", { style: { width: ancho, height: alto }, role: "img", "aria-label": etiqueta, children: _jsxs(LineChart, { width: ancho, height: alto, data: datos, margin: { top: 3, right: 2, bottom: 3, left: 2 }, children: [_jsx(YAxis, { hide: true, domain: ["dataMin", "dataMax"] }), _jsx(Line, { dataKey: "v", type: escalonado ? "stepAfter" : "monotone", stroke: color, strokeWidth: 1.6, dot: false, connectNulls: true, isAnimationActive: false })] }) }));
}
/** En los datos, `${clave}${SIN_RESPALDO}: true` marca un punto sin respaldo (p. ej. un precio antiguo); el tooltip lo indica. */
export const SIN_RESPALDO = "__sinRespaldo";
function TooltipLinea({ active, payload, label, series, formato, textoSinRespaldo }) {
    if (!active || !payload?.length || !label)
        return null;
    return (_jsxs("div", { className: "tooltip", children: [_jsx("div", { className: "t-fecha", children: diaCorto(label) }), series.map((s) => {
                const v = payload.find((p) => p.dataKey === s.clave)?.value;
                const sinRespaldo = payload[0]?.payload?.[`${s.clave}${SIN_RESPALDO}`] === true;
                return (_jsxs("div", { className: "t-fila", children: [_jsxs("span", { children: [_jsx("i", { style: { background: s.color, opacity: s.referencia ? 0.6 : 1 } }), s.nombre] }), _jsx("b", { className: sinRespaldo ? "sin-respaldo" : undefined, title: sinRespaldo ? textoSinRespaldo : undefined, children: v == null ? "—" : formato(v) })] }, s.clave));
            })] }));
}
/**
 * Eje Y "redondo" que no parte en 0: margen arriba y abajo (ninguna línea queda pegada a un borde) y marcas en
 * múltiplos de 1, 2, 2,5 o 5 × 10^n, p. ej. $10.000 · $10.500 · $11.000.
 */
function escalaRedonda(datos, claves, marcas = 5) {
    const valores = datos.flatMap((d) => claves.map((k) => d[k])).filter((v) => typeof v === "number");
    if (!valores.length)
        return undefined;
    const min = Math.min(...valores);
    const max = Math.max(...valores);
    const rango = max - min || Math.abs(max) * 0.05 || 1;
    const crudo = (rango * 1.3) / (marcas - 1);
    const potencia = 10 ** Math.floor(Math.log10(crudo));
    const paso = ([1, 2, 2.5, 5, 10].find((m) => m * potencia >= crudo) ?? 10) * potencia;
    const desde = Math.floor((min - rango * 0.15) / paso) * paso;
    const hasta = Math.ceil((max + rango * 0.15) / paso) * paso;
    const ticks = [];
    for (let v = desde; v <= hasta + paso / 2; v += paso)
        ticks.push(Math.round(v));
    return { ticks };
}
export function GraficoLinea({ titulo, nota, acciones, alto = 200, datos, series, formato, formatoEje, cargando, desdeCero, escalonado, textoSinRespaldo = "Dato sin respaldo" }) {
    const unSoloPunto = datos.length === 1;
    const escala = desdeCero ? undefined : escalaRedonda(datos, series.map((s) => s.clave));
    return (_jsxs("figure", { className: `grafico ${cargando && datos.length ? "cargando-suave" : ""}`, style: { margin: 0 }, children: [_jsxs("div", { className: "grafico-cabecera", children: [_jsx("h3", { children: titulo }), acciones] }), nota && _jsx("div", { className: "nota", children: nota }), series.length > 1 && (_jsx("div", { className: "leyenda", children: series.map((s) => (_jsxs("span", { children: [_jsx("i", { className: s.referencia ? "leyenda-referencia" : undefined, style: { background: s.referencia ? undefined : s.color, color: s.color } }), s.nombre] }, s.clave))) })), datos.length === 0 ? (cargando ? _jsx(EsqueletoGrafico, {}) : _jsx(Vacio, { icono: _jsx(IconoLinea, {}), titulo: "Sin datos en este per\u00EDodo", texto: "Prueba con un per\u00EDodo m\u00E1s largo." })) : (_jsx(ResponsiveContainer, { width: "100%", height: alto, children: _jsxs(LineChart, { data: datos, margin: { top: 8, right: 12, bottom: 0, left: 0 }, children: [_jsx(CartesianGrid, { stroke: "var(--grilla)", vertical: false }), _jsx(XAxis, { dataKey: "fecha", tickFormatter: diaCorto, stroke: "var(--eje)", tick: { fill: "var(--tinta-3)", fontSize: 12 }, tickLine: false, minTickGap: 24 }), _jsx(YAxis, { tickFormatter: formatoEje ?? formato, stroke: "var(--eje)", tick: { fill: "var(--tinta-3)", fontSize: 12 }, tickLine: false, axisLine: false, width: 72, domain: escala ? [escala.ticks[0], escala.ticks.at(-1)] : [0, "auto"], ticks: escala?.ticks, allowDecimals: false }), _jsx(Tooltip, { cursor: { stroke: "var(--eje)", strokeWidth: 1 }, content: _jsx(TooltipLinea, { series: series, formato: formato, textoSinRespaldo: textoSinRespaldo }), isAnimationActive: false }), [...series].sort((a, b) => Number(!!b.referencia) - Number(!!a.referencia)).map((s) => (_jsx(Line, { type: escalonado ? "stepAfter" : "monotone", dataKey: s.clave, name: s.nombre, stroke: s.color, strokeWidth: s.referencia ? 1.5 : 2, strokeDasharray: s.referencia ? "5 4" : undefined, strokeLinecap: "round", strokeLinejoin: "round", 
                            // Con pocos puntos se muestran marcadores; con muchos, solo al pasar el cursor.
                            dot: !s.referencia && (unSoloPunto || datos.length < 8) ? { r: 4, fill: s.color, stroke: "var(--superficie)", strokeWidth: 2 } : false, activeDot: s.referencia ? { r: 3, fill: s.color, stroke: "none" } : { r: 5, fill: s.color, stroke: "var(--superficie)", strokeWidth: 2 }, connectNulls: true, isAnimationActive: false }, s.clave)))] }) }))] }));
}
function TooltipBarras({ active, payload, nombreValor, formato, pista }) {
    const d = payload?.[0]?.payload;
    if (!active || !d)
        return null;
    return (_jsxs("div", { className: "tooltip", children: [_jsx("div", { className: "t-fecha", children: d.nombre ?? d.etiqueta }), _jsxs("div", { className: "t-fila", children: [_jsxs("span", { children: [_jsx("i", { style: { background: "var(--serie-1)" } }), nombreValor] }), _jsx("b", { children: formato(d.valor) })] }), d.detalle?.map((l) => _jsx("div", { className: "t-fila", children: _jsx("span", { children: l }) }, l)), pista && _jsx("div", { className: "t-pista", children: pista })] }));
}
export function GraficoBarras({ titulo, nota, datos, nombreValor, formato, resaltado, onClickBarra, acciones, pista, cargando, alto = 200, textoVacio = "No hay datos para mostrar." }) {
    // Barra bajo el cursor y altura del cursor: el tooltip va siempre debajo del puntero, sin tapar las barras.
    const [hover, setHover] = useState(null);
    // Si las barras quedan angostas, las etiquetas alternan en dos alturas para no pisarse
    const [ancho, setAncho] = useState(0);
    const escalonar = ancho > 0 && (ancho - 84) / Math.max(1, datos.length) < 26;
    return (_jsxs("figure", { className: `grafico ${cargando && datos.length ? "cargando-suave" : ""}`, style: { margin: 0 }, children: [_jsxs("div", { className: "grafico-cabecera", children: [_jsx("h3", { children: titulo }), acciones] }), nota && _jsx("div", { className: "nota", children: nota }), datos.length === 0 ? (cargando ? _jsx(EsqueletoGrafico, { alto: alto }) : _jsx(Vacio, { icono: _jsx(IconoBarras, {}), titulo: "Sin datos", texto: textoVacio })) : (_jsx(ResponsiveContainer, { width: "100%", height: alto, onResize: (w) => setAncho(w), children: _jsxs(BarChart, { data: datos, margin: { top: 8, right: 12, bottom: 0, left: 0 }, barCategoryGap: "28%", onMouseMove: (estado, evento) => {
                        const indice = Number(estado.activeTooltipIndex);
                        const caja = evento.currentTarget?.getBoundingClientRect();
                        setHover(Number.isInteger(indice) && caja ? { indice, y: evento.clientY - caja.top } : null);
                    }, onMouseLeave: () => setHover(null), children: [_jsx(CartesianGrid, { stroke: "var(--grilla)", vertical: false }), _jsx(XAxis, { dataKey: "etiqueta", stroke: "var(--eje)", tick: ({ x, y, payload, index }) => (_jsx("text", { x: x, y: Number(y) + (escalonar && index % 2 ? 13 : 0), dy: 12, textAnchor: "middle", fill: "var(--tinta-3)", fontSize: 11, children: payload.value })), tickLine: false, interval: 0, height: escalonar ? 42 : 30 }), _jsx(YAxis, { tickFormatter: formato, stroke: "var(--eje)", tick: { fill: "var(--tinta-3)", fontSize: 12 }, tickLine: false, axisLine: false, width: 72, domain: [0, "auto"], allowDecimals: false }), _jsx(Tooltip, { cursor: { fill: "var(--grilla)", opacity: 0.5 }, content: _jsx(TooltipBarras, { nombreValor: nombreValor, formato: formato, pista: pista }), position: hover ? { y: hover.y + 18 } : undefined, allowEscapeViewBox: { x: false, y: true }, wrapperStyle: { zIndex: 10 }, isAnimationActive: false }), _jsx(Bar, { dataKey: "valor", radius: [3, 3, 0, 0], isAnimationActive: false, style: onClickBarra ? { cursor: "pointer" } : undefined, onClick: (d) => onClickBarra?.(d.id), children: datos.map((d, i) => (_jsx(Cell, { fill: "var(--serie-1)", fillOpacity: resaltado && resaltado !== d.id ? 0.35 : 1, className: `barra ${hover?.indice === i ? "activa" : ""}` }, d.id))) })] }) }))] }));
}
function TooltipBanda({ active, payload, label, nombres, formato }) {
    const d = payload?.[0]?.payload;
    if (!active || !d || !label)
        return null;
    const fila = (nombre, v, marca) => (_jsxs("div", { className: "t-fila", children: [_jsxs("span", { children: [marca, nombre] }), _jsx("b", { children: v == null ? "—" : formato(v) })] }));
    return (_jsxs("div", { className: "tooltip", children: [_jsx("div", { className: "t-fecha", children: diaCorto(label) }), fila(nombres.max, d.max, _jsx("i", { style: { background: "var(--serie-1)", opacity: 0.3 } })), fila(nombres.linea, d.linea, _jsx("i", { style: { background: "var(--serie-1)" } })), fila(nombres.min, d.min, _jsx("i", { style: { background: "var(--serie-1)", opacity: 0.3 } })), d.cambio != null && (_jsxs("div", { className: "t-fila t-cambio", children: [_jsxs("span", { children: [_jsx("i", { style: { background: "var(--serie-2)", height: 8, width: 8, borderRadius: 4 } }), "Cambio"] }), _jsxs("b", { children: [d.cambio > 0 ? "+" : "−", formato(Math.abs(d.cambio))] })] }))] }));
}
/** Evolución de un rango (banda mín–máx) con una línea dentro y marcas donde la línea cambia. */
export function GraficoBanda({ titulo, nota, acciones, datos, nombres, formato, cargando, alto = 200 }) {
    const conBanda = datos.map((d) => ({ ...d, banda: d.min != null && d.max != null ? [d.min, d.max] : null }));
    const marcas = datos.filter((d) => d.cambio != null && d.linea != null);
    return (_jsxs("figure", { className: `grafico ${cargando && datos.length ? "cargando-suave" : ""}`, style: { margin: 0 }, children: [_jsxs("div", { className: "grafico-cabecera", children: [_jsx("h3", { children: titulo }), acciones] }), nota && _jsx("div", { className: "nota", children: nota }), _jsxs("div", { className: "leyenda", children: [_jsxs("span", { children: [_jsx("i", { style: { background: "var(--serie-1)", opacity: 0.25, height: 8 } }), nombres.min, " \u2013 ", nombres.max.toLowerCase()] }), _jsxs("span", { children: [_jsx("i", { style: { background: "var(--serie-1)" } }), nombres.linea] }), marcas.length > 0 && _jsxs("span", { children: [_jsx("i", { style: { background: "var(--serie-2)", width: 8, height: 8, borderRadius: 4 } }), "Cambio"] })] }), datos.length === 0 ? (cargando ? _jsx(EsqueletoGrafico, { alto: alto }) : _jsx(Vacio, { icono: _jsx(IconoLinea, {}), titulo: "Sin datos en este per\u00EDodo", texto: "Prueba con un per\u00EDodo m\u00E1s largo." })) : (_jsx(ResponsiveContainer, { width: "100%", height: alto, children: _jsxs(ComposedChart, { data: conBanda, margin: { top: 8, right: 12, bottom: 0, left: 0 }, children: [_jsx(CartesianGrid, { stroke: "var(--grilla)", vertical: false }), _jsx(XAxis, { dataKey: "fecha", tickFormatter: diaCorto, stroke: "var(--eje)", tick: { fill: "var(--tinta-3)", fontSize: 12 }, tickLine: false, minTickGap: 24 }), _jsx(YAxis, { tickFormatter: formato, stroke: "var(--eje)", tick: { fill: "var(--tinta-3)", fontSize: 12 }, tickLine: false, axisLine: false, width: 72, domain: ["auto", "auto"], allowDecimals: false }), _jsx(Tooltip, { cursor: { stroke: "var(--eje)", strokeWidth: 1 }, content: _jsx(TooltipBanda, { nombres: nombres, formato: formato }), isAnimationActive: false }), _jsx(Area, { dataKey: "banda", type: "stepAfter", fill: "var(--serie-1)", fillOpacity: 0.15, stroke: "none", connectNulls: true, isAnimationActive: false, activeDot: false }), _jsx(Line, { dataKey: "linea", type: "stepAfter", stroke: "var(--serie-1)", strokeWidth: 2, dot: datos.length < 8 ? { r: 3, fill: "var(--serie-1)", stroke: "var(--superficie)", strokeWidth: 2 } : false, activeDot: { r: 5, fill: "var(--serie-1)", stroke: "var(--superficie)", strokeWidth: 2 }, connectNulls: true, isAnimationActive: false }), marcas.map((m) => (_jsx(ReferenceDot, { x: m.fecha, y: m.linea, r: 4.5, fill: "var(--serie-2)", stroke: "var(--superficie)", strokeWidth: 2 }, m.fecha)))] }) }))] }));
}
