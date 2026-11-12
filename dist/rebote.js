import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
export const COLORES_REBOTE = ["#e11d48", "#2563eb", "#16a34a", "#d97706", "#7c3aed", "#0891b2", "#db2777"];
const temaOscuro = () => document.documentElement.dataset.theme === "dark";
function leer(clave) {
    try {
        return localStorage.getItem(clave) === "1";
    }
    catch {
        return false;
    }
}
export function AvisoRebote({ texto, clave = "aviso-rebote-visto", quitarCon = "tema", velocidad = 140, colores = COLORES_REBOTE, estilo }) {
    const [visible, setVisible] = useState(() => !leer(clave));
    const [color, setColor] = useState(0);
    const caja = useRef(null);
    const quieto = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    // El truco para quitarlo: oscuro y luego claro
    useEffect(() => {
        if (!visible || quitarCon !== "tema")
            return;
        let pasoPorOscuro = temaOscuro();
        const observador = new MutationObserver(() => {
            if (temaOscuro())
                pasoPorOscuro = true;
            else if (pasoPorOscuro) {
                try {
                    localStorage.setItem(clave, "1");
                }
                catch {
                    /* sin almacenamiento: solo por esta visita */
                }
                setVisible(false);
            }
        });
        observador.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        return () => observador.disconnect();
    }, [visible, quitarCon, clave]);
    // El rebote
    useEffect(() => {
        const el = caja.current;
        if (!visible || !el || quieto)
            return;
        let x = Math.random() * Math.max(0, window.innerWidth - el.offsetWidth);
        let y = Math.random() * Math.max(0, window.innerHeight - el.offsetHeight);
        // Un ángulo algo distinto de 45° para que la esquina «casi» llegue y nunca llegue
        const angulo = (37 + Math.random() * 10) * (Math.PI / 180);
        let vx = Math.cos(angulo) * velocidad * (Math.random() < 0.5 ? -1 : 1);
        let vy = Math.sin(angulo) * velocidad * (Math.random() < 0.5 ? -1 : 1);
        let antes = performance.now();
        let cuadro = 0;
        const mover = (ahora) => {
            const dt = Math.min(0.05, (ahora - antes) / 1000);
            antes = ahora;
            const maxX = Math.max(0, window.innerWidth - el.offsetWidth);
            const maxY = Math.max(0, window.innerHeight - el.offsetHeight);
            x += vx * dt;
            y += vy * dt;
            let choco = false;
            if (x <= 0 || x >= maxX) {
                vx = x <= 0 ? Math.abs(vx) : -Math.abs(vx);
                x = Math.min(Math.max(x, 0), maxX);
                choco = true;
            }
            if (y <= 0 || y >= maxY) {
                vy = y <= 0 ? Math.abs(vy) : -Math.abs(vy);
                y = Math.min(Math.max(y, 0), maxY);
                choco = true;
            }
            if (choco)
                setColor((c) => (c + 1) % colores.length);
            el.style.transform = `translate(${x}px, ${y}px)`;
            cuadro = requestAnimationFrame(mover);
        };
        cuadro = requestAnimationFrame(mover);
        return () => cancelAnimationFrame(cuadro);
    }, [visible, quieto, velocidad, colores.length]);
    if (!visible)
        return null;
    return (_jsx("div", { ref: caja, className: "aviso-rebote", "aria-hidden": "true", style: {
            position: "fixed",
            top: quieto ? "auto" : 0,
            bottom: quieto ? 16 : "auto",
            left: quieto ? 16 : 0,
            zIndex: 10000,
            padding: "12px 20px",
            borderRadius: 12,
            background: colores[color % colores.length],
            color: "#fff",
            fontSize: 22,
            fontWeight: 750,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            userSelect: "none",
            boxShadow: "0 8px 24px rgb(0 0 0 / 0.2)",
            transition: "background-color 0.2s",
            ...estilo,
        }, children: texto }));
}
