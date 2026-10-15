import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
const CLAVE = "estilos-sonido";
let contexto = null;
let activo = leer();
const oyentes = new Set();
function leer() {
    try {
        return localStorage.getItem(CLAVE) === "1";
    }
    catch {
        return false;
    }
}
function audio() {
    if (!contexto) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx)
            return null;
        contexto = new Ctx();
    }
    if (contexto.state === "suspended")
        void contexto.resume();
    return contexto;
}
function tocar(tonos) {
    if (!activo)
        return;
    const ctx = audio();
    if (!ctx)
        return;
    const ahora = ctx.currentTime;
    for (const t of tonos) {
        const inicio = ahora + (t.retraso ?? 0);
        const osc = ctx.createOscillator();
        const vol = ctx.createGain();
        osc.type = t.tipo ?? "sine";
        osc.frequency.setValueAtTime(t.frecuencia, inicio);
        if (t.hasta)
            osc.frequency.exponentialRampToValueAtTime(t.hasta, inicio + t.duracion);
        vol.gain.setValueAtTime(0.0001, inicio);
        vol.gain.exponentialRampToValueAtTime(t.volumen ?? 0.08, inicio + 0.012);
        vol.gain.exponentialRampToValueAtTime(0.0001, inicio + t.duracion);
        osc.connect(vol).connect(ctx.destination);
        osc.start(inicio);
        osc.stop(inicio + t.duracion + 0.02);
    }
}
export const sonidos = {
    /** Clic corto y suave (botones, enlaces). */
    clic: () => tocar([{ frecuencia: 660, hasta: 520, duracion: 0.07, tipo: "triangle", volumen: 0.06 }]),
    /** Toque muy breve para pasar el cursor (úsalo con moderación). */
    roce: () => tocar([{ frecuencia: 1200, duracion: 0.03, volumen: 0.025 }]),
    /** Dos notas que suben: activar, abrir, confirmar. */
    activar: () => tocar([{ frecuencia: 523, duracion: 0.09, tipo: "triangle" }, { frecuencia: 784, duracion: 0.14, tipo: "triangle", retraso: 0.07 }]),
    /** Dos notas que bajan: desactivar, cerrar. */
    desactivar: () => tocar([{ frecuencia: 784, duracion: 0.09, tipo: "triangle" }, { frecuencia: 523, duracion: 0.14, tipo: "triangle", retraso: 0.07 }]),
    /** Barrido suave: cambio de página, telón. */
    barrido: () => tocar([{ frecuencia: 220, hasta: 880, duracion: 0.35, tipo: "sine", volumen: 0.05 }]),
    /** Rebote: un objeto 3D que se toca. */
    rebote: () => tocar([{ frecuencia: 300, hasta: 600, duracion: 0.12, tipo: "sine", volumen: 0.09 }, { frecuencia: 600, hasta: 450, duracion: 0.1, tipo: "sine", volumen: 0.05, retraso: 0.1 }]),
    get activo() { return activo; },
    /** Enciende o apaga los sonidos (y recuerda la elección). */
    encender: (v) => {
        activo = v;
        try {
            localStorage.setItem(CLAVE, v ? "1" : "0");
        }
        catch { /* sin almacenamiento */ }
        oyentes.forEach((f) => f(v));
    },
};
/** Estado de sonido para componentes React. */
export function useSonido() {
    const [v, setV] = useState(activo);
    useEffect(() => {
        oyentes.add(setV);
        return () => { oyentes.delete(setV); };
    }, []);
    return v;
}
/** Botón redondo para activar o silenciar los sonidos, con ondas que se mueven cuando están activos. */
export function BotonSonido({ className }) {
    const on = useSonido();
    const etiqueta = on ? "Silenciar sonidos" : "Activar sonidos";
    return (_jsx("button", { type: "button", className: className ? `s-boton-icono ${className}` : "s-boton-icono", "aria-pressed": on, "aria-label": etiqueta, title: etiqueta, onClick: () => {
            if (on) {
                sonidos.desactivar();
                sonidos.encender(false);
            }
            else {
                sonidos.encender(true);
                sonidos.activar();
            }
        }, children: _jsxs("span", { className: "s-ondas", "aria-hidden": "true", children: [_jsx("i", {}), _jsx("i", {}), _jsx("i", {}), _jsx("i", {})] }) }));
}
