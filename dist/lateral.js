import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
const EnlaceSimple = ({ href, ...props }) => _jsx("a", { href: href, ...props });
const ANGOSTA = "(max-width: 900px)";
const esAngosta = () => typeof window !== "undefined" && window.matchMedia(ANGOSTA).matches;
/** Si la pantalla es angosta (la lateral pasa a panel), siguiendo los cambios de tamaño. */
export function usePantallaAngosta() {
    const [angosta, setAngosta] = useState(esAngosta);
    useEffect(() => {
        const mq = window.matchMedia(ANGOSTA);
        const cambio = () => setAngosta(mq.matches);
        mq.addEventListener("change", cambio);
        return () => mq.removeEventListener("change", cambio);
    }, []);
    return angosta;
}
/** Expandida o compacta, recordado en el navegador (por proyecto, con `clave`). */
export function useLateralCompacta(clave = "lateral:compacta") {
    const [compacta, setCompacta] = useState(() => {
        try {
            return localStorage.getItem(clave) === "1";
        }
        catch {
            return false;
        }
    });
    const cambiar = (v) => {
        setCompacta(v);
        try {
            localStorage.setItem(clave, v ? "1" : "0");
        }
        catch {
            /* sin almacenamiento: vale solo para esta visita */
        }
    };
    return [compacta, cambiar];
}
// La raíz "/" solo calza consigo misma; las demás rutas también con sus subrutas.
const coincide = (actual, s) => s.exacta || s.ruta === "/" ? actual === s.ruta : actual === s.ruta || actual.startsWith(`${s.ruta}/`);
/** El grupo que contiene la ruta actual (el de la ruta más larga que calza), o null. */
export function grupoDe(grupos, actual) {
    let mejor = null;
    for (const g of grupos)
        for (const s of g.secciones)
            if (coincide(actual, s) && (!mejor || s.ruta.length > mejor.largo))
                mejor = { g, largo: s.ruta.length };
    return mejor?.g ?? null;
}
const Flecha = () => (_jsx("svg", { className: "lateral-flecha", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("path", { d: "m6 9 6 6 6-6" }) }));
export function NavegacionLateral({ grupos, rutaActual, compacta, onExpandir, abierta = false, onCerrar, Enlace = EnlaceSimple, etiqueta = "Secciones", }) {
    const [abiertos, setAbiertos] = useState(() => new Set());
    const activo = grupoDe(grupos, rutaActual);
    const alternar = (id) => setAbiertos((a) => {
        const n = new Set(a);
        if (n.has(id))
            n.delete(id);
        else
            n.add(id);
        return n;
    });
    useEffect(() => {
        if (!abierta || !onCerrar)
            return;
        const tecla = (e) => e.key === "Escape" && onCerrar();
        window.addEventListener("keydown", tecla);
        return () => window.removeEventListener("keydown", tecla);
    }, [abierta, onCerrar]);
    // En el panel de pantallas angostas siempre se ve el texto.
    const soloIconos = compacta && !abierta;
    return (_jsxs(_Fragment, { children: [_jsx("nav", { id: "navegacion-lateral", className: `lateral${soloIconos ? " compacta" : ""}${abierta ? " abierta" : ""}`, "aria-label": etiqueta, children: _jsx("ul", { className: "lateral-lista", children: grupos.map((g) => {
                        const esActivo = g === activo;
                        const nombreSiCompacta = soloIconos ? g.nombre : undefined;
                        if (g.secciones.length === 1) {
                            const actual = coincide(rutaActual, g.secciones[0]);
                            return (_jsx("li", { className: "lateral-grupo", children: _jsxs(Enlace, { href: g.secciones[0].ruta, className: `lateral-titulo${actual ? " actual" : ""}`, title: nombreSiCompacta, "aria-label": nombreSiCompacta, "aria-current": actual ? "page" : undefined, children: [g.icono, _jsx("span", { className: "lateral-texto", children: g.nombre })] }) }, g.id));
                        }
                        const desplegado = abiertos.has(g.id) && !soloIconos;
                        return (_jsxs("li", { className: `lateral-grupo${esActivo ? " activo" : ""}`, children: [_jsxs("button", { type: "button", className: `lateral-titulo${esActivo && !desplegado ? " actual" : ""}`, "aria-expanded": desplegado, "aria-controls": `lateral-${g.id}`, title: nombreSiCompacta, "aria-label": nombreSiCompacta, onClick: () => {
                                        if (soloIconos) {
                                            onExpandir();
                                            setAbiertos((a) => new Set(a).add(g.id));
                                        }
                                        else
                                            alternar(g.id);
                                    }, children: [g.icono, _jsx("span", { className: "lateral-texto", children: g.nombre }), _jsx(Flecha, {})] }), _jsx("ul", { id: `lateral-${g.id}`, className: "lateral-sub", hidden: !desplegado, children: g.secciones.map((s) => (_jsx("li", { children: _jsx(Enlace, { href: s.ruta, "aria-current": esActivo && seccionActual(g, rutaActual) === s ? "page" : undefined, children: s.nombre }) }, s.ruta))) })] }, g.id));
                    }) }) }), onCerrar && _jsx("div", { className: `lateral-fondo${abierta ? " visible" : ""}`, onClick: onCerrar, "aria-hidden": "true" })] }));
}
/** La sección de un grupo que corresponde a la ruta actual (la más específica). */
function seccionActual(g, actual) {
    let mejor = null;
    for (const s of g.secciones)
        if (coincide(actual, s) && (!mejor || s.ruta.length > mejor.ruta.length))
            mejor = s;
    return mejor;
}
