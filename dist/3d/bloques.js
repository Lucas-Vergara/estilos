import { jsx as _jsx } from "react/jsx-runtime";
import { useRef } from "react";
import * as THREE from "three";
import { ESTILO_LIENZO, usarEscena } from "./escena.js";
/**
 * Piso de bloques: una grilla de columnas que respiran como una ola y se levantan bajo el cursor, tomando el color
 * del acento (y del destello las más altas). Vista isométrica.
 */
export function Bloques3D({ lado = 20, className, etiqueta = "Piso de bloques 3D decorativo" }) {
    const ref = useRef(null);
    usarEscena(ref, (e) => {
        const { scene, camera, colores } = e;
        camera.fov = 26;
        camera.position.set(16, 17, 16);
        camera.lookAt(0, 0, 0);
        scene.add(new THREE.HemisphereLight(0xffffff, colores.tinta.clone().lerp(new THREE.Color(0xffffff), 0.5), 2.2));
        const sol = new THREE.DirectionalLight(0xffffff, 1.6);
        sol.position.set(5, 10, 3);
        scene.add(sol);
        const n = lado * lado, tam = 0.42, sep = 0.48;
        const geo = new THREE.BoxGeometry(tam, 1, tam).translate(0, 0.5, 0);
        const mat = new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0 });
        const bloques = new THREE.InstancedMesh(geo, mat, n);
        scene.add(bloques);
        const alturas = new Float32Array(n).fill(0.2);
        const m = new THREE.Matrix4(), c = new THREE.Color(), base = colores.fondo.clone().lerp(colores.tinta, 0.08);
        const plano = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const rayo = new THREE.Raycaster();
        const cursor = new THREE.Vector3(99, 0, 99);
        const offset = ((lado - 1) * sep) / 2;
        return {
            paso: (t) => {
                rayo.setFromCamera(e.puntero, camera);
                rayo.ray.intersectPlane(plano, cursor);
                for (let ix = 0; ix < lado; ix++) {
                    for (let iz = 0; iz < lado; iz++) {
                        const i = ix * lado + iz, x = ix * sep - offset, z = iz * sep - offset;
                        const ola = 0.18 + (Math.sin(x * 0.8 + t * 1.2) + Math.cos(z * 0.7 + t)) * 0.08;
                        const dx = x - cursor.x, dz = z - cursor.z;
                        const meta = ola + Math.exp(-(dx * dx + dz * dz) * 0.9) * 1.6;
                        alturas[i] += (meta - alturas[i]) * 0.12;
                        const h = Math.max(0.05, alturas[i]);
                        m.makeScale(1, h, 1).setPosition(x, 0, z);
                        bloques.setMatrixAt(i, m);
                        const k = THREE.MathUtils.clamp((h - 0.25) / 1.2, 0, 1);
                        c.copy(base).lerp(colores.acento, k);
                        if (k > 0.8)
                            c.lerp(colores.destello, (k - 0.8) * 4);
                        bloques.setColorAt(i, c);
                    }
                }
                bloques.instanceMatrix.needsUpdate = true;
                if (bloques.instanceColor)
                    bloques.instanceColor.needsUpdate = true;
            },
            liberar: () => { geo.dispose(); mat.dispose(); bloques.dispose(); },
        };
    }, [lado]);
    return _jsx("canvas", { ref: ref, className: className, role: "img", "aria-label": etiqueta, style: ESTILO_LIENZO });
}
