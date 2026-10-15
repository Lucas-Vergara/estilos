import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { sonidos } from "./sonidos.js";
const EVENTO = "estilos:telon";
/**
 * Cambia de página detrás de un telón (al estilo de Dennis Snellenberg): el telón sube cubriendo la pantalla con el
 * nombre de la página de destino, se hace el cambio y el telón sigue de largo hacia arriba.
 * Requiere <Telon /> montado una vez. Sin <Telon /> o con movimiento reducido, cambia de inmediato.
 */
export function irCon(etiqueta, cambiar) {
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducido || !document.querySelector(".s-telon")) {
        cambiar();
        return;
    }
    window.dispatchEvent(new CustomEvent(EVENTO, { detail: { etiqueta, cambiar } }));
}
export function Telon() {
    const [fase, setFase] = useState("quieto");
    const [etiqueta, setEtiqueta] = useState("");
    useEffect(() => {
        let tiempos = [];
        const pedir = (e) => {
            const { etiqueta, cambiar } = e.detail;
            tiempos.forEach(clearTimeout);
            setEtiqueta(etiqueta);
            setFase("entra");
            sonidos.barrido();
            tiempos = [
                setTimeout(() => { cambiar(); setFase("sale"); }, 650),
                setTimeout(() => setFase("quieto"), 1400),
            ];
        };
        window.addEventListener(EVENTO, pedir);
        return () => { window.removeEventListener(EVENTO, pedir); tiempos.forEach(clearTimeout); };
    }, []);
    return (_jsx("div", { className: "s-telon", "data-fase": fase === "quieto" ? undefined : fase, "aria-hidden": "true", children: _jsx("span", { className: "s-telon-texto", children: etiqueta }) }));
}
