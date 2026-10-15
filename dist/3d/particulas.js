import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { sonidos } from "../sitio/sonidos.js";
import { ESTILO_LIENZO, usarEscena } from "./escena.js";
export const FORMAS_PARTICULAS = ["esfera", "cubo", "toro", "ola", "espiral"];
/** Puntos repartidos sobre cada forma (misma cantidad, así se puede pasar de una a otra punto a punto). */
function puntosDe(forma, n) {
    const p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
        const u = Math.random(), v = Math.random();
        let x = 0, y = 0, z = 0;
        if (forma === "esfera") {
            const th = u * Math.PI * 2, ph = Math.acos(2 * v - 1), r = 1.9;
            x = r * Math.sin(ph) * Math.cos(th);
            y = r * Math.cos(ph);
            z = r * Math.sin(ph) * Math.sin(th);
        }
        else if (forma === "cubo") {
            const cara = Math.floor(Math.random() * 6), a = u * 3 - 1.5, b = v * 3 - 1.5, s = cara % 2 ? 1.5 : -1.5;
            [x, y, z] = cara < 2 ? [s, a, b] : cara < 4 ? [a, s, b] : [a, b, s];
        }
        else if (forma === "toro") {
            const th = u * Math.PI * 2, ph = v * Math.PI * 2, R = 1.6, r = 0.55;
            x = (R + r * Math.cos(ph)) * Math.cos(th);
            y = r * Math.sin(ph);
            z = (R + r * Math.cos(ph)) * Math.sin(th);
        }
        else if (forma === "ola") {
            x = u * 6 - 3;
            z = v * 6 - 3;
            y = Math.sin(x * 1.4) * 0.35 + Math.cos(z * 1.2) * 0.35;
        }
        else {
            const t = i / n, ang = t * Math.PI * 16, r = 0.3 + t * 1.8;
            x = Math.cos(ang) * r + (u - 0.5) * 0.18;
            y = (t - 0.5) * 3.6;
            z = Math.sin(ang) * r + (v - 0.5) * 0.18;
        }
        p[i * 3] = x;
        p[i * 3 + 1] = y;
        p[i * 3 + 2] = z;
    }
    return p;
}
/**
 * Nube de partículas que se transforma entre formas (esfera, cubo, toro, ola, espiral) y se aparta del cursor.
 * Controlada con `forma`; sin ella cambia sola cada pocos segundos y con cada clic.
 */
export function Particulas3D({ forma, cantidad = 6000, className, etiqueta = "Nube de partículas decorativa" }) {
    const ref = useRef(null);
    const destino = useRef(forma ?? "esfera");
    const cambio = useRef(0); // contador: la escena compara para saber si cambió la forma
    useEffect(() => { if (forma) {
        destino.current = forma;
        cambio.current++;
    } }, [forma]);
    usarEscena(ref, (e) => {
        const { scene, camera, colores } = e;
        camera.position.set(0, 0, 7.5);
        const objetivos = Object.fromEntries(FORMAS_PARTICULAS.map((f) => [f, puntosDe(f, cantidad)]));
        const actual = Float32Array.from(objetivos[destino.current]);
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(actual, 3));
        const color = new Float32Array(cantidad * 3);
        const c = new THREE.Color();
        for (let i = 0; i < cantidad; i++) {
            c.copy(colores.acento).lerp(colores.destello, Math.random() < 0.12 ? 1 : Math.random() * 0.25);
            color.set([c.r, c.g, c.b], i * 3);
        }
        geo.setAttribute("color", new THREE.BufferAttribute(color, 3));
        const mat = new THREE.PointsMaterial({ size: 0.045, vertexColors: true, sizeAttenuation: true, transparent: true, opacity: 0.95, depthWrite: false });
        const puntos = new THREE.Points(geo, mat);
        scene.add(puntos);
        let visto = cambio.current, ultimoCambio = 0;
        const plano = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const rayo = new THREE.Raycaster();
        const cursor = new THREE.Vector3(99, 99, 0);
        const local = new THREE.Vector3();
        const avanzar = () => {
            const i = FORMAS_PARTICULAS.indexOf(destino.current);
            destino.current = FORMAS_PARTICULAS[(i + 1) % FORMAS_PARTICULAS.length];
            cambio.current++;
        };
        return {
            tocar: () => { if (!forma)
                avanzar(); sonidos.barrido(); },
            paso: (t, dt) => {
                if (!forma && t - ultimoCambio > 5) {
                    avanzar();
                }
                if (visto !== cambio.current) {
                    visto = cambio.current;
                    ultimoCambio = t;
                }
                puntos.rotation.y += dt * 0.12;
                puntos.rotation.x += (e.puntero.y * 0.3 - puntos.rotation.x) * 0.04;
                rayo.setFromCamera(e.puntero, camera);
                if (rayo.ray.intersectPlane(plano, cursor))
                    local.copy(cursor).applyMatrix4(new THREE.Matrix4().copy(puntos.matrixWorld).invert());
                const obj = objetivos[destino.current];
                const k = e.reducido ? 1 : Math.min(1, dt * 3.2);
                for (let i = 0; i < cantidad * 3; i += 3) {
                    let x = actual[i] + (obj[i] - actual[i]) * k;
                    let y = actual[i + 1] + (obj[i + 1] - actual[i + 1]) * k;
                    let z = actual[i + 2] + (obj[i + 2] - actual[i + 2]) * k;
                    // Se apartan del cursor como si soplara.
                    const dx = x - local.x, dy = y - local.y, dz = z - local.z;
                    const d2 = dx * dx + dy * dy + dz * dz;
                    if (d2 < 0.8) {
                        const f = (0.8 - d2) * 0.12;
                        x += dx * f;
                        y += dy * f;
                        z += dz * f;
                    }
                    actual[i] = x;
                    actual[i + 1] = y;
                    actual[i + 2] = z;
                }
                geo.attributes.position.needsUpdate = true;
            },
            liberar: () => { geo.dispose(); mat.dispose(); },
        };
    }, [cantidad, !!forma]);
    return _jsx("canvas", { ref: ref, className: className, role: "img", "aria-label": etiqueta, style: { ...ESTILO_LIENZO, cursor: forma ? "default" : "pointer", touchAction: "pan-y" } });
}
