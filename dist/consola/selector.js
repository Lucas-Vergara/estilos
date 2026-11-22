import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
export function Selector({ valor, opciones, onCambio, etiqueta, icono, tenue, titulo, campo }) {
    const [abierto, setAbierto] = useState(false);
    const [activo, setActivo] = useState(0);
    const [arriba, setArriba] = useState(true);
    const raiz = useRef(null);
    const boton = useRef(null);
    const lista = useRef(null);
    const id = useId();
    const elegida = opciones.find((o) => o.valor === valor);
    const abrir = () => {
        setActivo(Math.max(0, opciones.findIndex((o) => o.valor === valor)));
        setAbierto(true);
    };
    const cerrar = (devolverFoco = true) => { setAbierto(false); if (devolverFoco)
        boton.current?.focus(); };
    const elegir = (i) => { onCambio(opciones[i].valor); cerrar(); };
    // Hacia arriba o hacia abajo, según dónde quepa.
    useLayoutEffect(() => {
        if (!abierto || !raiz.current || !lista.current)
            return;
        const r = raiz.current.getBoundingClientRect();
        const alto = lista.current.offsetHeight;
        setArriba(r.top > alto + 12 || r.top > window.innerHeight - r.bottom);
    }, [abierto]);
    useEffect(() => { if (abierto)
        lista.current?.focus(); }, [abierto]);
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
    };
    const teclaLista = (e) => {
        const n = opciones.length;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActivo((a) => (a + 1) % n);
        }
        else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActivo((a) => (a - 1 + n) % n);
        }
        else if (e.key === "Home") {
            e.preventDefault();
            setActivo(0);
        }
        else if (e.key === "End") {
            e.preventDefault();
            setActivo(n - 1);
        }
        else if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            elegir(activo);
        }
        else if (e.key === "Escape") {
            e.preventDefault();
            cerrar();
        }
        else if (e.key === "Tab")
            cerrar(false);
        else if (e.key.length === 1) {
            const i = opciones.findIndex((o, j) => j > activo && o.texto.toLowerCase().startsWith(e.key.toLowerCase()));
            const k = i >= 0 ? i : opciones.findIndex((o) => o.texto.toLowerCase().startsWith(e.key.toLowerCase()));
            if (k >= 0)
                setActivo(k);
        }
    };
    return (_jsxs("div", { className: `co-selector${tenue ? " co-selector-tenue" : ""}${campo ? " co-selector-campo" : ""}${abierto ? " abierto" : ""}`, ref: raiz, children: [_jsxs("button", { ref: boton, type: "button", className: "co-selector-boton", "aria-haspopup": "listbox", "aria-expanded": abierto, "aria-controls": id, "aria-label": `${etiqueta}: ${elegida?.texto ?? ""}`, title: titulo ?? elegida?.nota, onClick: () => (abierto ? cerrar() : abrir()), onKeyDown: teclaBoton, children: [icono, _jsx("span", { className: "co-selector-texto", children: elegida?.texto ?? "—" }), _jsx("svg", { className: "co-selector-flecha", width: "10", height: "10", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("path", { d: "m6 9 6 6 6-6" }) })] }), abierto && (_jsx("ul", { ref: lista, id: id, role: "listbox", tabIndex: -1, "aria-label": etiqueta, "aria-activedescendant": `${id}-${activo}`, className: `co-menu-opciones${arriba ? " arriba" : ""}`, onKeyDown: teclaLista, children: opciones.map((o, i) => (_jsxs("li", { id: `${id}-${i}`, "data-i": i, role: "option", "aria-selected": o.valor === valor, className: i === activo ? "activa" : undefined, onPointerEnter: () => setActivo(i), onClick: () => elegir(i), children: [_jsx("span", { className: "co-menu-marca", "aria-hidden": "true", children: o.valor === valor ? "✓" : "" }), _jsxs("span", { className: "co-menu-texto", children: [o.texto, o.nota && _jsx("small", { children: o.nota })] })] }, o.valor))) }))] }));
}
