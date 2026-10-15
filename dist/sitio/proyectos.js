import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
/**
 * Marco de navegador para mostrar una captura o un video de una web (al estilo de Maxime Heckel). Los videos se
 * reproducen en silencio y en bucle solo mientras están en pantalla; con movimiento reducido quedan quietos en el
 * primer cuadro (o el póster). Sin `src`, muestra `children` (útil para maquetas) o un aviso de captura pendiente.
 */
export function MarcoNavegador({ url, src, tipo = "imagen", poster, alt = "", proporcion = "16 / 10", children }) {
    const video = useRef(null);
    useEffect(() => {
        const v = video.current;
        if (!v)
            return;
        const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reducido)
            return;
        const io = new IntersectionObserver(([e]) => { if (e.isIntersecting)
            void v.play().catch(() => { });
        else
            v.pause(); }, { threshold: 0.25 });
        io.observe(v);
        return () => io.disconnect();
    }, [src]);
    return (_jsxs("figure", { className: "s-marco-navegador", children: [_jsxs("div", { className: "s-marco-barra", "aria-hidden": "true", children: [_jsxs("span", { className: "s-marco-puntos", children: [_jsx("i", {}), _jsx("i", {}), _jsx("i", {})] }), _jsx("span", { className: "s-marco-url", children: url.replace(/^https?:\/\//, "") })] }), _jsxs("div", { className: "s-marco-contenido", style: { ["--proporcion"]: proporcion }, children: [src && tipo === "video" && _jsx("video", { ref: video, src: src, poster: poster, muted: true, loop: true, playsInline: true, preload: "metadata", "aria-label": alt }), src && tipo === "imagen" && _jsx("img", { src: src, alt: alt, loading: "lazy" }), !src && (children ?? _jsx("div", { className: "s-marco-vacio", children: "Captura pendiente" }))] })] }));
}
/** Un proyecto: texto a un lado y su web en un marco de navegador al otro (se alternan en la lista .s-proyectos). */
export function Proyecto({ p, indice }) {
    return (_jsxs("article", { className: "s-proyecto", children: [_jsxs("div", { className: "s-proyecto-texto", "data-reveal": "", children: [indice != null && _jsx("span", { className: "s-indice", children: String(indice).padStart(2, "0") }), _jsx("h3", { className: "s-subtitulo", children: p.titulo }), _jsx("p", { className: "s-texto", children: p.descripcion }), _jsxs("div", { className: "s-proyecto-datos", children: [p.cliente && _jsx("span", { children: p.cliente }), p.rol && _jsx("span", { children: p.rol }), p.anio && _jsx("span", { children: p.anio })] }), p.etiquetas?.length ? _jsx("div", { className: "s-chips", children: p.etiquetas.map((e) => _jsx("span", { className: "s-chip", children: e }, e)) }) : null, p.url && (_jsxs("a", { className: "s-enlace", href: p.url, target: "_blank", rel: "noopener", children: ["Ver el sitio ", _jsx("span", { className: "s-flecha", "aria-hidden": "true", children: "\u2192" })] }))] }), _jsx("div", { "data-reveal": "escala", "data-cursor": p.url ? "Ver" : undefined, children: _jsx(MarcoNavegador, { url: p.medio.url, src: p.medio.src, tipo: p.medio.tipo, poster: p.medio.poster, alt: p.medio.alt ?? p.titulo, proporcion: p.medio.proporcion, children: p.medio.maqueta }) })] }));
}
/** Ola SVG para separar secciones (variante simple, al estilo de Rafa Conde). Toma el color del texto (currentColor). */
export function Ola({ invertida, className }) {
    return (_jsx("svg", { className: className ? `s-ola ${className}` : "s-ola", viewBox: "0 0 1440 90", preserveAspectRatio: "none", "aria-hidden": "true", style: invertida ? { transform: "scaleY(-1)" } : undefined, children: _jsx("path", { fill: "currentColor", d: "M0 52c120-26 240-38 360-30s240 34 360 38 240-22 360-34 240-6 360 8v56H0z" }) }));
}
