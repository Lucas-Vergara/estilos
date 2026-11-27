import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
/** Minúsculas y sin tildes, unidad por unidad (mismo largo que el texto, para resaltar lo que calza). */
const plano = (s) => s.split("").map((c) => { const b = c.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase(); return b.length === 1 ? b : c; }).join("");
/** Calza si cada palabra de la búsqueda aparece en el texto. */
const calza = (texto, busqueda) => {
    const t = plano(texto);
    return plano(busqueda).split(/\s+/).filter(Boolean).every((p) => t.includes(p));
};
function Resaltado({ texto, busqueda }) {
    const q = plano(busqueda.trim());
    const i = q ? plano(texto).indexOf(q) : -1;
    if (i < 0)
        return _jsx(_Fragment, { children: texto });
    return _jsxs(_Fragment, { children: [texto.slice(0, i), _jsx("mark", { children: texto.slice(i, i + q.length) }), texto.slice(i + q.length)] });
}
const flecha = (_jsx("svg", { className: "co-selector-flecha", width: "10", height: "10", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("path", { d: "m6 9 6 6 6-6" }) }));
export function Selector({ valor, opciones, onCambio, etiqueta, icono, tenue, titulo, campo, buscar = true }) {
    const [abierto, setAbierto] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [activo, setActivo] = useState(0);
    const [arriba, setArriba] = useState(true);
    const raiz = useRef(null);
    const boton = useRef(null);
    const entrada = useRef(null);
    const lista = useRef(null);
    const id = useId();
    const elegida = opciones.find((o) => o.valor === valor);
    const visibles = useMemo(() => (buscar && busqueda.trim() ? opciones.filter((o) => calza(o.texto, busqueda)) : opciones), [opciones, busqueda, buscar]);
    const abrir = (inicial = "") => {
        setBusqueda(inicial);
        setActivo(inicial ? 0 : Math.max(0, opciones.findIndex((o) => o.valor === valor)));
        setAbierto(true);
    };
    const cerrar = (devolverFoco = true) => {
        setAbierto(false);
        setBusqueda("");
        // El botón vuelve a existir recién en el siguiente pintado (mientras se busca, en su lugar está el campo).
        if (devolverFoco)
            requestAnimationFrame(() => boton.current?.focus());
    };
    const elegir = (o) => { if (!o)
        return; onCambio(o.valor); cerrar(); };
    // Hacia arriba o hacia abajo, según dónde quepa (medido con la lista completa, al abrir).
    useLayoutEffect(() => {
        if (!abierto || !raiz.current || !lista.current)
            return;
        const r = raiz.current.getBoundingClientRect();
        const alto = lista.current.offsetHeight;
        setArriba(r.top > alto + 12 || r.top > window.innerHeight - r.bottom);
    }, [abierto]);
    useEffect(() => { if (abierto)
        (buscar ? entrada.current : lista.current)?.focus(); }, [abierto, buscar]);
    useEffect(() => { if (abierto)
        lista.current?.querySelector(`[data-i="${activo}"]`)?.scrollIntoView({ block: "nearest" }); }, [abierto, activo]);
    useEffect(() => {
        if (!abierto)
            return;
        const fuera = (e) => { if (!raiz.current?.contains(e.target))
            cerrar(false); };
        document.addEventListener("pointerdown", fuera);
        return () => document.removeEventListener("pointerdown", fuera);
    }, [abierto]); // eslint-disable-line react-hooks/exhaustive-deps
    const teclaBoton = (e) => {
        if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
            e.preventDefault();
            abrir();
        }
        else if (buscar && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            abrir(e.key);
        }
    };
    const teclaLista = (e) => {
        const n = visibles.length;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (n)
                setActivo((a) => (a + 1) % n);
        }
        else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (n)
                setActivo((a) => (a - 1 + n) % n);
        }
        else if (e.key === "Home" && !buscar) {
            e.preventDefault();
            setActivo(0);
        }
        else if (e.key === "End" && !buscar) {
            e.preventDefault();
            setActivo(n - 1);
        }
        else if (e.key === "Enter" || (e.key === " " && !buscar)) {
            e.preventDefault();
            elegir(visibles[activo]);
        }
        else if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            cerrar();
        }
        else if (e.key === "Tab")
            cerrar(false);
        else if (!buscar && e.key.length === 1) {
            const k = e.key.toLowerCase();
            const i = opciones.findIndex((o, j) => j > activo && o.texto.toLowerCase().startsWith(k));
            const j = i >= 0 ? i : opciones.findIndex((o) => o.texto.toLowerCase().startsWith(k));
            if (j >= 0)
                setActivo(j);
        }
    };
    const idOpcion = (i) => `${id}-${i}`;
    const descendiente = abierto && visibles.length ? idOpcion(Math.min(activo, visibles.length - 1)) : undefined;
    // Mientras se busca, un clic en la lista o en el marco no le quita el foco al campo.
    const conservarFoco = (e) => { if (buscar && e.target !== entrada.current)
        e.preventDefault(); };
    return (_jsxs("div", { className: `co-selector${tenue ? " co-selector-tenue" : ""}${campo ? " co-selector-campo" : ""}${abierto ? " abierto" : ""}`, ref: raiz, children: [abierto && buscar ? (_jsxs("div", { className: "co-selector-boton co-selector-buscando", onPointerDown: conservarFoco, onClick: (e) => { if (e.target !== entrada.current)
                    cerrar(); }, children: [icono, _jsx("input", { ref: entrada, className: "co-selector-entrada", type: "text", role: "combobox", "aria-expanded": true, "aria-controls": id, "aria-autocomplete": "list", "aria-activedescendant": descendiente, "aria-label": etiqueta, autoComplete: "off", spellCheck: false, placeholder: elegida?.texto ?? "Buscar", value: busqueda, onChange: (e) => { setBusqueda(e.target.value); setActivo(0); }, onKeyDown: teclaLista }), flecha] })) : (_jsxs("button", { ref: boton, type: "button", className: "co-selector-boton", "aria-haspopup": "listbox", "aria-expanded": abierto, "aria-controls": id, "aria-label": `${etiqueta}: ${elegida?.texto ?? ""}`, title: titulo ?? elegida?.nota, onClick: () => (abierto ? cerrar() : abrir()), onKeyDown: teclaBoton, children: [icono, _jsx("span", { className: "co-selector-texto", children: elegida?.texto ?? "—" }), flecha] })), abierto && (_jsxs("ul", { ref: lista, id: id, role: "listbox", tabIndex: buscar ? undefined : -1, "aria-label": etiqueta, "aria-activedescendant": buscar ? undefined : descendiente, className: `co-menu-opciones${arriba ? " arriba" : ""}`, onKeyDown: buscar ? undefined : teclaLista, onPointerDown: conservarFoco, children: [visibles.map((o, i) => (_jsxs("li", { id: idOpcion(i), "data-i": i, role: "option", "aria-selected": o.valor === valor, className: i === activo ? "activa" : undefined, onPointerEnter: () => setActivo(i), onClick: () => elegir(o), children: [_jsx("span", { className: "co-menu-marca", "aria-hidden": "true", children: o.valor === valor ? "✓" : "" }), _jsxs("span", { className: "co-menu-texto", children: [_jsx("span", { children: _jsx(Resaltado, { texto: o.texto, busqueda: buscar ? busqueda : "" }) }), o.nota && _jsx("small", { children: o.nota })] })] }, o.valor))), !visibles.length && _jsxs("li", { className: "co-menu-vacio", role: "presentation", children: ["Nada calza con \u00AB", busqueda.trim(), "\u00BB. Borra o cambia lo escrito."] })] }))] }));
}
