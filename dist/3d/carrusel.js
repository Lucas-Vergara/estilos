import { jsx as _jsx } from "react/jsx-runtime";
import { useRef } from "react";
import * as THREE from "three";
import { sonidos } from "../sitio/sonidos.js";
import { ESTILO_LIENZO, fuenteDisplay, texturaTexto, usarEscena } from "./escena.js";
/**
 * Carrusel cilíndrico: tarjetas en círculo que giran solas, se arrastran con el mouse o el dedo y siguen con
 * inercia. Las tarjetas pueden ser texto (dibujado con la fuente de la línea) o una imagen.
 */
export function Carrusel3D({ tarjetas, className, etiqueta = "Carrusel 3D de tarjetas" }) {
    const ref = useRef(null);
    const clave = JSON.stringify(tarjetas);
    usarEscena(ref, (e) => {
        const { scene, camera, colores, lienzo } = e;
        const n = Math.max(3, tarjetas.length), radio = Math.max(3, n * 0.55);
        camera.position.set(0, 0, radio + 5.2);
        camera.lookAt(0, 0, 0);
        const geo = new THREE.PlaneGeometry(2.4, 3, 24, 1);
        // Curva la tarjeta para que siga el cilindro.
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            pos.setZ(i, -(x * x) / (2 * radio));
        }
        const grupo = new THREE.Group();
        scene.add(grupo);
        const recursos = [geo];
        const cargador = new THREE.TextureLoader();
        tarjetas.forEach((t, i) => {
            const fondo = i % 4 === 1 ? colores.acento : i % 4 === 3 ? colores.destello : colores.suave;
            const tinta = i % 4 === 1 ? new THREE.Color(0xffffff) : colores.tinta;
            const tex = t.imagen ? cargador.load(t.imagen, (x) => { x.colorSpace = THREE.SRGBColorSpace; }) : texturaTexto((ctx, w, h) => {
                ctx.fillStyle = `#${fondo.getHexString()}`;
                ctx.beginPath();
                ctx.roundRect(0, 0, w, h, 56);
                ctx.fill();
                ctx.fillStyle = `#${tinta.getHexString()}`;
                ctx.textBaseline = "alphabetic";
                ctx.font = `500 52px ${fuenteDisplay(lienzo)}`;
                ctx.fillText(String(i + 1).padStart(2, "0"), 64, 120);
                ctx.font = `700 110px ${fuenteDisplay(lienzo)}`;
                ctx.fillText(t.titulo, 64, h - (t.detalle ? 170 : 90), w - 128);
                if (t.detalle) {
                    ctx.font = `400 52px ${fuenteDisplay(lienzo)}`;
                    ctx.fillText(t.detalle, 64, h - 80, w - 128);
                }
            }, 800, 1000);
            const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
            recursos.push(tex, mat);
            const m = new THREE.Mesh(geo, mat);
            const a = (i / n) * Math.PI * 2;
            m.position.set(Math.sin(a) * radio, 0, Math.cos(a) * radio);
            m.rotation.y = a;
            grupo.add(m);
        });
        let giro = 0, vel = 0.15, arrastrando = false, ultimoX = 0, ultimaTarjeta = -1;
        const abajo = (ev) => { arrastrando = true; ultimoX = ev.clientX; lienzo.setPointerCapture(ev.pointerId); };
        const mover = (ev) => {
            if (!arrastrando)
                return;
            const dx = (ev.clientX - ultimoX) / lienzo.clientWidth;
            ultimoX = ev.clientX;
            vel = dx * 60;
        };
        const arriba = () => { arrastrando = false; };
        lienzo.addEventListener("pointerdown", abajo);
        lienzo.addEventListener("pointermove", mover);
        lienzo.addEventListener("pointerup", arriba);
        lienzo.addEventListener("pointercancel", arriba);
        return {
            paso: (_t, dt) => {
                if (!arrastrando)
                    vel += (0.15 - vel) * Math.min(1, dt * 1.5);
                giro += vel * dt;
                grupo.rotation.y = giro;
                // Un roce suave cada vez que una tarjeta pasa por delante (si el sonido está activado).
                const delante = ((Math.round(-giro / ((Math.PI * 2) / n)) % n) + n) % n;
                if (delante !== ultimaTarjeta) {
                    if (ultimaTarjeta !== -1 && Math.abs(vel) > 0.6)
                        sonidos.roce();
                    ultimaTarjeta = delante;
                }
            },
            liberar: () => {
                lienzo.removeEventListener("pointerdown", abajo);
                lienzo.removeEventListener("pointermove", mover);
                lienzo.removeEventListener("pointerup", arriba);
                lienzo.removeEventListener("pointercancel", arriba);
                recursos.forEach((r) => r.dispose());
            },
        };
    }, [clave]);
    return _jsx("canvas", { ref: ref, className: className, role: "img", "aria-label": etiqueta, style: { ...ESTILO_LIENZO, cursor: "grab", touchAction: "pan-y" } });
}
