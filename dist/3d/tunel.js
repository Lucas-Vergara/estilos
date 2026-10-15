import { jsx as _jsx } from "react/jsx-runtime";
import { useRef } from "react";
import * as THREE from "three";
import { ESTILO_LIENZO, avanceRecorrido, fuenteDisplay, texturaTexto, usarEscena } from "./escena.js";
/**
 * Túnel de marcos que se recorre con el scroll: la cámara avanza mientras bajas por una sección alta con el lienzo
 * fijo (contenedor con data-recorrido, ver .td-recorrido). Puede llevar etiquetas que aparecen a los lados.
 * Sin data-recorrido avanza solo.
 */
export function Tunel3D({ etiquetas = [], className, etiqueta = "Túnel 3D que avanza con el scroll" }) {
    const ref = useRef(null);
    const clave = etiquetas.join("|");
    usarEscena(ref, (e) => {
        const { scene, camera, colores, lienzo } = e;
        const marcos = 36, paso = 2.2, largo = marcos * paso;
        scene.fog = new THREE.Fog(colores.fondo, 2, 22);
        camera.position.set(0, 0, 4);
        const geoCirculo = new THREE.TorusGeometry(2.4, 0.025, 8, 96);
        const geoCuadro = new THREE.TorusGeometry(2.6, 0.035, 8, 4);
        const mats = [colores.tinta, colores.acento, colores.destello].map((c) => new THREE.MeshBasicMaterial({ color: c }));
        const grupo = new THREE.Group();
        for (let i = 0; i < marcos; i++) {
            const cuadro = i % 3 === 1;
            const m = new THREE.Mesh(cuadro ? geoCuadro : geoCirculo, mats[i % 7 === 3 ? 2 : cuadro ? 1 : 0]);
            m.position.z = -i * paso;
            m.rotation.z = cuadro ? Math.PI / 4 + i * 0.12 : 0;
            grupo.add(m);
        }
        scene.add(grupo);
        // Polvo: puntos sueltos dentro del túnel para dar sensación de velocidad.
        const n = 900, polvo = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) {
            const a = Math.random() * Math.PI * 2, r = 0.6 + Math.random() * 1.7;
            polvo.set([Math.cos(a) * r, Math.sin(a) * r, -Math.random() * largo], i * 3);
        }
        const polvoGeo = new THREE.BufferGeometry();
        polvoGeo.setAttribute("position", new THREE.BufferAttribute(polvo, 3));
        const polvoMat = new THREE.PointsMaterial({ color: colores.acento, size: 0.03, transparent: true, opacity: 0.7 });
        scene.add(new THREE.Points(polvoGeo, polvoMat));
        // Etiquetas: tarjetas a los lados, repartidas a lo largo del recorrido.
        const texturas = [];
        const tarjetaGeo = new THREE.PlaneGeometry(2.2, 1.1);
        const tarjetaMats = [];
        etiquetas.forEach((txt, i) => {
            const tex = texturaTexto((ctx, w, h) => {
                ctx.fillStyle = `#${colores.acento.getHexString()}`;
                ctx.beginPath();
                ctx.roundRect(0, 0, w, h, 48);
                ctx.fill();
                ctx.fillStyle = "#ffffff";
                ctx.textBaseline = "middle";
                ctx.font = `600 64px ${fuenteDisplay(lienzo)}`;
                ctx.fillText(String(i + 1).padStart(2, "0"), 70, h * 0.3);
                ctx.font = `700 120px ${fuenteDisplay(lienzo)}`;
                ctx.fillText(txt, 70, h * 0.64, w - 140);
            }, 1024, 512);
            texturas.push(tex);
            const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
            tarjetaMats.push(mat);
            const m = new THREE.Mesh(tarjetaGeo, mat);
            const lado = i % 2 ? 1 : -1;
            m.position.set(lado * 1.05, (i % 3 - 1) * 0.5, -((i + 1) / (etiquetas.length + 1)) * (largo - 10));
            m.rotation.y = -lado * 0.35;
            grupo.add(m);
        });
        const recorrido = lienzo.closest("[data-recorrido]");
        let z = 4;
        return {
            paso: (t, dt) => {
                const p = recorrido ? avanceRecorrido(recorrido) : (t * 0.03) % 1;
                const destino = 4 - p * (largo - 12);
                z += (destino - z) * (recorrido ? Math.min(1, dt * 6) : 1);
                camera.position.z = z;
                camera.position.x += (e.puntero.x * 0.5 - camera.position.x) * 0.05;
                camera.position.y += (e.puntero.y * 0.35 - camera.position.y) * 0.05;
                camera.lookAt(camera.position.x * 0.3, camera.position.y * 0.3, z - 6);
                grupo.children.forEach((m, i) => { if (i % 3 === 1 && i < marcos)
                    m.rotation.z += dt * 0.15; });
            },
            liberar: () => {
                geoCirculo.dispose();
                geoCuadro.dispose();
                mats.forEach((m) => m.dispose());
                polvoGeo.dispose();
                polvoMat.dispose();
                tarjetaGeo.dispose();
                tarjetaMats.forEach((m) => m.dispose());
                texturas.forEach((t) => t.dispose());
            },
        };
    }, [clave]);
    return _jsx("canvas", { ref: ref, className: className, role: "img", "aria-label": etiqueta, style: ESTILO_LIENZO });
}
