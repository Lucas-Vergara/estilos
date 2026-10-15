import { jsx as _jsx } from "react/jsx-runtime";
import { useRef } from "react";
import * as THREE from "three";
import { sonidos } from "../sitio/sonidos.js";
import { usarEscena } from "./escena.js";
/**
 * Objeto 3D brillante que flota, gira despacio, mira hacia el cursor y rebota al tocarlo (con sonido si está
 * activado). Pensado para el hero, al lado del texto. El contenedor define el tamaño (p. ej. aspect-ratio: 1).
 */
export function Objeto3D({ forma = "burbuja", className, etiqueta = "Objeto 3D decorativo" }) {
    const ref = useRef(null);
    usarEscena(ref, (e) => {
        const { scene, camera, colores } = e;
        camera.position.set(0, 0, 7);
        scene.add(new THREE.HemisphereLight(0xffffff, colores.tinta.clone().lerp(new THREE.Color(0xffffff), 0.6), 1.6));
        const luz = new THREE.DirectionalLight(0xffffff, 2.2);
        luz.position.set(3, 4, 5);
        scene.add(luz);
        const luzColor = new THREE.PointLight(colores.destello, 18, 20);
        luzColor.position.set(-3, -2, 3);
        scene.add(luzColor);
        const material = new THREE.MeshPhysicalMaterial({ color: colores.acento, roughness: 0.22, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.15 });
        const grupo = new THREE.Group();
        scene.add(grupo);
        const geometrias = [];
        let base = null;
        let malla = null;
        if (forma === "nudo") {
            const g = new THREE.TorusKnotGeometry(1.15, 0.38, 220, 32);
            geometrias.push(g);
            grupo.add(new THREE.Mesh(g, material));
        }
        else if (forma === "anillos") {
            const g = new THREE.TorusGeometry(1.1, 0.2, 32, 120);
            geometrias.push(g);
            const segundo = material.clone();
            segundo.color = colores.destello;
            [0, 1, 2].forEach((i) => {
                const m = new THREE.Mesh(g, i === 1 ? segundo : material);
                m.rotation.set(i * 1.1, i * 0.7, 0);
                m.scale.setScalar(1 - i * 0.18);
                grupo.add(m);
            });
        }
        else {
            const g = new THREE.IcosahedronGeometry(1.5, 48);
            geometrias.push(g);
            base = Float32Array.from(g.attributes.position.array);
            malla = new THREE.Mesh(g, material);
            grupo.add(malla);
        }
        // Rebote al tocar: un resorte simple sobre la escala.
        let escala = 1, velocidad = 0;
        const v = new THREE.Vector3();
        return {
            tocar: () => { velocidad += 3.2; sonidos.rebote(); },
            paso: (t, dt) => {
                grupo.position.y = Math.sin(t * 1.1) * 0.12;
                grupo.rotation.y += dt * 0.25;
                grupo.rotation.x += (e.puntero.y * -0.5 - grupo.rotation.x) * 0.05;
                grupo.rotation.z += (e.puntero.x * -0.25 - grupo.rotation.z) * 0.05;
                const fuerza = (1 - escala) * 120 - velocidad * 9;
                velocidad += fuerza * dt;
                escala += velocidad * dt;
                grupo.scale.setScalar(escala);
                if (malla && base) {
                    // Burbuja: los vértices se desplazan con ondas suaves para que la forma respire.
                    const pos = malla.geometry.attributes.position;
                    for (let i = 0; i < pos.count; i++) {
                        v.set(base[i * 3], base[i * 3 + 1], base[i * 3 + 2]).normalize();
                        const d = 1.5 + 0.12 * Math.sin(v.x * 3 + t * 1.3) * Math.cos(v.y * 3 + t) + 0.07 * Math.sin(v.z * 5 + t * 1.7);
                        pos.setXYZ(i, v.x * d, v.y * d, v.z * d);
                    }
                    pos.needsUpdate = true;
                    malla.geometry.computeVertexNormals();
                }
            },
            liberar: () => { geometrias.forEach((g) => g.dispose()); material.dispose(); },
        };
    }, [forma]);
    return _jsx("canvas", { ref: ref, className: className, role: "img", "aria-label": etiqueta, style: { width: "100%", height: "100%", display: "block", cursor: "pointer", touchAction: "pan-y" } });
}
