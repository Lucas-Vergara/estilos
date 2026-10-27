import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Fragment, useRef } from "react";
import { fechaHora, haceCuanto, horasDesde } from "./fechas.js";
// Componentes de la línea "panel". Las clases que usan están en css/base.css. Los gráficos (Recharts) están en graficos.tsx.
/** Estado sí/no/sin dato: siempre ícono + texto, nunca solo color. */
export function Estado({ valor, si = "Sí", no = "No", na = "Sin dato" }) {
    if (valor == null)
        return (_jsxs("span", { className: "estado na", children: [_jsx("svg", { width: "12", height: "12", viewBox: "0 0 12 12", "aria-hidden": "true", children: _jsx("path", { d: "M3 6h6", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) }), na] }));
    return valor ? (_jsxs("span", { className: "estado si", children: [_jsx("svg", { width: "12", height: "12", viewBox: "0 0 12 12", "aria-hidden": "true", children: _jsx("path", { d: "M2.5 6.5l2.5 2.5 4.5-6", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }), si] })) : (_jsxs("span", { className: "estado no", children: [_jsx("svg", { width: "12", height: "12", viewBox: "0 0 12 12", "aria-hidden": "true", children: _jsx("path", { d: "M3 3l6 6M9 3l-6 6", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) }), no] }));
}
/** Indicador: etiqueta con ícono, número grande, variación en chip y tendencia a todo el ancho abajo. */
export function Indicador({ etiqueta, icono, valor, variacion, detalle, tendencia }) {
    return (_jsxs("div", { className: "tarjeta indicador", children: [_jsxs("div", { className: "indicador-cabecera", children: [icono, _jsx("span", { children: etiqueta })] }), _jsx("div", { className: "indicador-valor", children: valor }), (variacion || detalle) && (_jsxs("div", { className: "indicador-pie", children: [variacion, detalle && _jsx("span", { className: "detalle", children: detalle })] })), tendencia && _jsx("div", { className: "indicador-tendencia", children: tendencia })] }));
}
/**
 * Ayuda (i) junto a un título: la definición o la metodología aparece al pasar el cursor o al enfocarla.
 * Reemplaza las notas largas bajo los títulos; el subtítulo queda libre para decir el hallazgo.
 */
export function Ayuda({ texto }) {
    return _jsx("span", { className: "ayuda", tabIndex: 0, role: "img", "aria-label": texto, "data-texto": texto, children: "i" });
}
/** Línea de tiempo: cambios agrupados por día, con la fecha a la izquierda. `contenido` suele ser una lista. */
export function LineaTiempo({ dias }) {
    return (_jsx("div", { className: "linea-tiempo", children: dias.map((d) => (_jsxs(Fragment, { children: [_jsx("div", { className: "linea-tiempo-dia", children: d.dia }), _jsx("div", { className: "linea-tiempo-items", children: d.contenido })] }, d.id))) }));
}
/**
 * Cambio entre dos valores: "▼ $2.000 (−11%) vs. hace 30 días".
 * Verde si el cambio es bueno y rojo si es malo, según `subirEsBueno`; siempre con flecha, no solo color.
 */
export function Variacion({ actual, anterior, formato, texto, subirEsBueno, compacta, chipPorcentaje }) {
    if (actual == null || anterior == null)
        return compacta ? _jsx("span", { className: "muted", children: "\u2014" }) : null;
    const d = actual - anterior;
    const ref = !compacta && texto && _jsx("span", { className: "variacion-ref", children: texto });
    if (d === 0)
        return compacta ? _jsx("span", { className: "variacion igual", children: "Sin cambios" }) : _jsxs(_Fragment, { children: [_jsx("span", { className: "variacion igual variacion-chip", children: "Sin cambios" }), ref] });
    const rel = anterior ? Math.round((Math.abs(d) / anterior) * 1000) / 10 : null;
    const bueno = d > 0 === subirEsBueno;
    if (chipPorcentaje && !compacta && rel != null)
        return (_jsxs(_Fragment, { children: [_jsxs("span", { className: `variacion ${bueno ? "buena" : "mala"} variacion-chip`, children: [d > 0 ? "▲" : "▼", " ", rel.toLocaleString("es-CL"), "%"] }), _jsxs("span", { className: "variacion-ref", children: [d > 0 ? "+" : "−", formato(Math.abs(d)), texto && ` ${texto}`] })] }));
    const cambio = (_jsxs("span", { className: `variacion ${bueno ? "buena" : "mala"} ${compacta ? "" : "variacion-chip"}`, children: [d > 0 ? "▲" : "▼", " ", formato(Math.abs(d)), rel != null && ` (${d > 0 ? "+" : "−"}${rel.toLocaleString("es-CL")}%)`] }));
    return compacta ? cambio : _jsxs(_Fragment, { children: [cambio, ref] });
}
/**
 * Qué tan reciente es el dato: verde, ámbar o rojo según `umbrales` (horas). El predeterminado [26, 72] sirve para
 * datos que se actualizan una vez al día: verde si es de la última corrida, ámbar hasta 3 días, rojo después.
 */
export function Frescura({ fecha, prefijo, chip, umbrales = [26, 72] }) {
    const horas = horasDesde(fecha);
    const nivel = horas < umbrales[0] ? "fresco" : horas < umbrales[1] ? "atrasado" : "viejo";
    const texto = `${prefijo ? `${prefijo} ` : ""}${haceCuanto(fecha)}`;
    return (_jsxs("span", { className: `frescura ${nivel} ${chip ? "frescura-chip" : ""}`, title: fecha ? fechaHora(fecha) : undefined, children: [_jsx("i", { "aria-hidden": "true" }), texto] }));
}
/** Estado vacío con ícono, título y (opcional) explicación o acción. */
export function Vacio({ icono, titulo, texto, children, alto = 180 }) {
    return (_jsxs("div", { className: "vacio", style: { minHeight: alto }, children: [icono && _jsx("span", { className: "vacio-icono", "aria-hidden": "true", children: icono }), _jsx("b", { children: titulo }), texto && _jsx("span", { className: "vacio-texto", children: texto }), children] }));
}
/** Ícono para descargar los datos de una tabla. */
export function BotonDescarga({ onClick, titulo = "Descargar CSV" }) {
    return (_jsx("button", { type: "button", className: "boton boton-icono boton-chico", title: titulo, "aria-label": titulo, onClick: onClick, children: _jsx("svg", { width: "15", height: "15", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("path", { d: "M8 2v8M4.5 6.5 8 10l3.5-3.5M2.5 13.5h11" }) }) }));
}
// ---------- Orden de tablas ----------
/** Botón de encabezado que ordena. La columna activa va en negrita con una flecha (↑ ascendente, ↓ descendente). */
export function BotonOrden({ orden, clave, onOrden, dirInicial = "asc", children }) {
    const activo = orden.clave === clave;
    const dir = activo ? orden.dir : dirInicial;
    return (_jsxs("button", { type: "button", className: `th-orden ${activo ? "activo" : ""}`, onClick: () => onOrden(clave, dirInicial), title: "Ordenar por esta columna", children: [children, _jsx("svg", { width: "10", height: "10", viewBox: "0 0 10 10", "aria-hidden": "true", style: { transform: dir === "asc" ? "rotate(180deg)" : undefined }, children: _jsx("path", { d: "M5 2v6M2.5 5.5L5 8l2.5-2.5", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) })] }));
}
export function ThOrden({ num, ...props }) {
    const activo = props.orden.clave === props.clave;
    return (_jsx("th", { className: num ? "num" : undefined, "aria-sort": activo ? (props.orden.dir === "asc" ? "ascending" : "descending") : undefined, children: _jsx(BotonOrden, { ...props }) }));
}
// ---------- Esqueletos de carga ----------
// Bloques grises con la forma del contenido: la página no salta cuando llegan los datos.
export function Esqueleto({ ancho = "100%", alto = 12, estilo }) {
    return _jsx("span", { className: "esqueleto", style: { width: ancho, height: alto, ...estilo }, "aria-hidden": "true" });
}
export function EsqueletoTabla({ filas = 6, columnas = 5 }) {
    const anchos = ["85%", "60%", "70%", "50%", "75%", "55%", "65%"];
    return (_jsx("div", { className: "esqueleto-tabla", role: "status", "aria-label": "Cargando", children: Array.from({ length: filas }, (_, f) => (_jsx("div", { className: "esqueleto-fila", style: { gridTemplateColumns: `2fr repeat(${columnas - 1}, 1fr)` }, children: Array.from({ length: columnas }, (_, c) => _jsx(Esqueleto, { ancho: anchos[(f + c) % anchos.length] }, c)) }, f))) }));
}
export function EsqueletoGrafico({ alto = 200 }) {
    return (_jsx("div", { className: "esqueleto-grafico", style: { height: alto }, role: "status", "aria-label": "Cargando", children: [62, 48, 70, 55, 80, 66, 74, 58].map((h, i) => _jsx(Esqueleto, { alto: (alto - 24) * (h / 100), ancho: "100%" }, i)) }));
}
/** Tarjeta completa cargando: título, nota y tabla. */
export function EsqueletoTarjeta({ filas, columnas }) {
    return (_jsxs("section", { className: "tarjeta", children: [_jsxs("div", { className: "tarjeta-cabecera", children: [_jsx(Esqueleto, { ancho: 180, alto: 18 }), _jsx(Esqueleto, { ancho: 320, alto: 10 })] }), _jsx(EsqueletoTabla, { filas: filas, columnas: columnas })] }));
}
export function Segmentado({ opciones, valor, onChange, etiqueta, chico }) {
    if (chico)
        return (_jsx("div", { className: "segmentado segmentado-chico", role: "group", "aria-label": etiqueta, children: opciones.map((o) => (_jsx("button", { type: "button", "aria-pressed": o.valor === valor, onClick: () => onChange(o.valor), children: o.texto }, o.valor))) }));
    return (_jsxs("div", { className: "campo", children: [etiqueta, _jsx("div", { className: "segmentado", role: "group", "aria-label": etiqueta, children: opciones.map((o) => (_jsx("button", { type: "button", "aria-pressed": o.valor === valor, onClick: () => onChange(o.valor), children: o.texto }, o.valor))) })] }));
}
/**
 * Pestañas reales (cambian el contenido): role="tablist" con flechas, Inicio y Fin para moverse.
 * El contenido va en <PanelPestana> con el mismo id.
 */
export function Pestanas({ pestanas, activa, onCambio, etiqueta, children }) {
    const refs = useRef(new Map());
    const mover = (e, i) => {
        const destino = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: pestanas.length - 1 }[e.key];
        if (destino == null)
            return;
        e.preventDefault();
        const p = pestanas[(destino + pestanas.length) % pestanas.length];
        onCambio(p.id);
        refs.current.get(p.id)?.focus();
    };
    return (_jsxs("div", { className: "barra-pestanas", children: [_jsx("div", { className: "pestanas", role: "tablist", "aria-label": etiqueta, children: pestanas.map((p, i) => (_jsxs("button", { ref: (el) => { if (el)
                        refs.current.set(p.id, el); }, type: "button", role: "tab", id: `pestana-${p.id}`, "aria-selected": p.id === activa, "aria-controls": `panel-${p.id}`, tabIndex: p.id === activa ? 0 : -1, onClick: () => onCambio(p.id), onKeyDown: (e) => mover(e, i), children: [p.icono, p.texto] }, p.id))) }), children && _jsx("div", { className: "barra-pestanas-controles", children: children })] }));
}
export function PanelPestana({ id, children }) {
    return (_jsx("div", { role: "tabpanel", id: `panel-${id}`, "aria-labelledby": `pestana-${id}`, className: "panel-pestana", children: children }, id));
}
