import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
/**
 * Fondo animado en un <canvas> detrás de una sección con position: relative (clase .s-fondo-vivo):
 *  - "manchas": manchas de color difusas que flotan despacio (al estilo de Cassie Evans).
 *  - "malla":   grilla de puntos que se agrandan y toman color cerca del cursor.
 *  - "ondas":   líneas horizontales que ondulan como un campo (al estilo de Keita Yamada).
 * Toma los colores de la línea (--s-acento, --s-destello, --s-tinta). Se pausa fuera de pantalla o con la pestaña
 * oculta; con movimiento reducido dibuja un solo cuadro quieto.
 */
export function FondoAnimado({ modo = "manchas", desvanecer, className }) {
    const ref = useRef(null);
    useEffect(() => {
        const lienzo = ref.current;
        const ctx = lienzo.getContext("2d");
        if (!ctx)
            return;
        const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let ancho = 0, alto = 0, raf = 0, visible = true, t0 = performance.now();
        const puntero = { x: -9999, y: -9999 };
        const color = (nombre, respaldo) => getComputedStyle(lienzo).getPropertyValue(nombre).trim() || respaldo;
        // El mismo color con otra opacidad: un degradado hacia "transparent" (negro transparente) ensucia los bordes de gris.
        const conAlfa = (c, a) => {
            ctx.fillStyle = "#000";
            ctx.fillStyle = c;
            const n = String(ctx.fillStyle);
            if (n.startsWith("#")) {
                const v = parseInt(n.slice(1), 16);
                return `rgba(${(v >> 16) & 255}, ${(v >> 8) & 255}, ${v & 255}, ${a})`;
            }
            return n.replace(/rgba?\(([^)]+)\)/, (_m, partes) => `rgba(${partes.split(",").slice(0, 3).join(",")}, ${a})`);
        };
        let colores = { acento: "#3d5afe", destello: "#ffd84d", tinta: "#15171c", suave: "#e8ecff" };
        const leerColores = () => {
            colores = { acento: color("--s-acento", colores.acento), destello: color("--s-destello", colores.destello), tinta: color("--s-tinta", colores.tinta), suave: color("--s-acento-suave", colores.suave) };
        };
        const ajustar = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            const r = lienzo.getBoundingClientRect();
            ancho = r.width;
            alto = r.height;
            lienzo.width = Math.max(1, Math.round(ancho * dpr));
            lienzo.height = Math.max(1, Math.round(alto * dpr));
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            leerColores();
        };
        const manchas = (t) => {
            ctx.clearRect(0, 0, ancho, alto);
            const lista = [
                { c: colores.acento, r: 0.42, fx: 0.11, fy: 0.07, ox: 0.25, oy: 0.35, a: 0.22 },
                { c: colores.destello, r: 0.34, fx: 0.08, fy: 0.12, ox: 0.72, oy: 0.3, a: 0.32 },
                { c: colores.suave, r: 0.5, fx: 0.05, fy: 0.09, ox: 0.55, oy: 0.75, a: 0.9 },
                { c: colores.acento, r: 0.26, fx: 0.13, fy: 0.06, ox: 0.85, oy: 0.8, a: 0.14 },
            ];
            const base = Math.max(ancho, alto);
            for (const m of lista) {
                const x = (m.ox + Math.sin(t * m.fx) * 0.12) * ancho;
                const y = (m.oy + Math.cos(t * m.fy) * 0.12) * alto;
                const r = m.r * base;
                const g = ctx.createRadialGradient(x, y, 0, x, y, r);
                g.addColorStop(0, m.c);
                g.addColorStop(1, conAlfa(m.c, 0));
                ctx.globalAlpha = m.a;
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, ancho, alto);
            }
            ctx.globalAlpha = 1;
        };
        const malla = (t) => {
            ctx.clearRect(0, 0, ancho, alto);
            const paso = 26;
            for (let y = paso / 2; y < alto; y += paso) {
                for (let x = paso / 2; x < ancho; x += paso) {
                    const d = Math.hypot(x - puntero.x, y - puntero.y);
                    const cerca = Math.max(0, 1 - d / 160);
                    const ola = (Math.sin(x * 0.02 + t * 0.9) + Math.cos(y * 0.025 + t * 0.7)) * 0.25 + 0.5;
                    const r = 1 + ola * 0.8 + cerca * 3.2;
                    ctx.globalAlpha = 0.16 + cerca * 0.7;
                    ctx.fillStyle = cerca > 0.05 ? colores.acento : colores.tinta;
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.globalAlpha = 1;
        };
        const ondas = (t) => {
            ctx.clearRect(0, 0, ancho, alto);
            const lineas = 26;
            ctx.lineWidth = 1;
            for (let i = 0; i < lineas; i++) {
                const base = (i + 0.5) * (alto / lineas);
                ctx.beginPath();
                for (let x = 0; x <= ancho; x += 8) {
                    const y = base
                        + Math.sin(x * 0.006 + t * 0.6 + i * 0.35) * 14
                        + Math.sin(x * 0.013 - t * 0.4 + i * 0.6) * 8
                        + Math.max(0, 1 - Math.hypot(x - puntero.x, base - puntero.y) / 200) * -24;
                    if (x === 0)
                        ctx.moveTo(x, y);
                    else
                        ctx.lineTo(x, y);
                }
                ctx.globalAlpha = 0.1 + (i % 6 === 0 ? 0.25 : 0);
                ctx.strokeStyle = i % 6 === 0 ? colores.acento : colores.tinta;
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        };
        const dibujar = { manchas, malla, ondas }[modo];
        const cuadro = (ahora) => {
            raf = 0;
            dibujar((ahora - t0) / 1000);
            if (!reducido && visible && !document.hidden)
                raf = requestAnimationFrame(cuadro);
        };
        const reanudar = () => { if (!raf && !reducido && visible && !document.hidden)
            raf = requestAnimationFrame(cuadro); };
        ajustar();
        dibujar(reducido ? 2 : 0);
        reanudar();
        const ro = new ResizeObserver(() => { ajustar(); dibujar((performance.now() - t0) / 1000); });
        ro.observe(lienzo);
        const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; reanudar(); });
        io.observe(lienzo);
        const alCambiarPestana = () => reanudar();
        document.addEventListener("visibilitychange", alCambiarPestana);
        // El lienzo no recibe eventos (pointer-events: none): se escucha en la página y se traduce a coordenadas locales.
        const mover = (e) => {
            const r = lienzo.getBoundingClientRect();
            puntero.x = e.clientX - r.left;
            puntero.y = e.clientY - r.top;
            if (reducido)
                dibujar(2);
        };
        window.addEventListener("pointermove", mover, { passive: true });
        // Si cambia el tema (clase s-oscuro), relee los colores.
        const mo = new MutationObserver(leerColores);
        mo.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ["class", "data-theme"] });
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            mo.disconnect();
            document.removeEventListener("visibilitychange", alCambiarPestana);
            window.removeEventListener("pointermove", mover);
        };
    }, [modo]);
    const clases = ["s-fondo-vivo", desvanecer ? "s-desvanecido" : "", className ?? ""].filter(Boolean).join(" ");
    return _jsx("canvas", { ref: ref, className: clases, "aria-hidden": "true" });
}
