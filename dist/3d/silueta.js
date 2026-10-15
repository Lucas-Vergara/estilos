import { jsx as _jsx } from "react/jsx-runtime";
import { useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { sonidos } from "../sitio/sonidos.js";
import { ESTILO_LIENZO, usarEscena } from "./escena.js";
/**
 * Silueta en 3D a partir de trazos SVG: un logo o ícono con volumen, contorno de neón que se dibuja al aparecer
 * (y otra vez al tocarlo), alas que aletean y giro hacia el cursor. Por defecto: relleno en la tinta y contorno en el
 * destello de la paleta; se pueden indicar otros (p. ej. los de una marca).
 */
export function Silueta3D({ datos, colorTrazo, colorRelleno, profundidad = 4, grosor = 0.9, className, etiqueta = "Silueta 3D" }) {
    const ref = useRef(null);
    const clave = JSON.stringify(datos) + colorTrazo + colorRelleno + profundidad + grosor;
    usarEscena(ref, (e) => {
        const { scene, camera, colores } = e;
        const lado = datos.lado ?? 100, escala = 6 / lado;
        camera.position.set(0, 0, 11);
        scene.add(new THREE.HemisphereLight(0xffffff, 0x222222, 1.4));
        const luz = new THREE.DirectionalLight(0xffffff, 1.6);
        luz.position.set(3, 5, 6);
        scene.add(luz);
        const trazo = colorTrazo ? new THREE.Color(colorTrazo) : colores.destello.clone(); // neón sobre relleno oscuro
        const relleno = colorRelleno ? new THREE.Color(colorRelleno) : colores.tinta.clone();
        const matRelleno = new THREE.MeshStandardMaterial({ color: relleno, roughness: 0.45, metalness: 0.2, emissive: trazo, emissiveIntensity: 0.04 });
        const matTrazo = new THREE.MeshBasicMaterial({ color: trazo });
        const matHalo = new THREE.MeshBasicMaterial({ color: trazo, transparent: true, opacity: 0.16, depthWrite: false });
        const recursos = [matRelleno, matTrazo, matHalo];
        const tubos = [];
        const prof = profundidad * escala, radio = grosor * escala * 0.5;
        const raiz = new THREE.Group();
        scene.add(raiz);
        const a3d = (p, z) => new THREE.Vector3((p.x - lado / 2) * escala, -(p.y - lado / 2) * escala, z);
        // Contorno: un tubo por subtrazo en la cara frontal y otro en la trasera, más un halo ancho y suave.
        const contornear = (camino, grupo, cerrado) => {
            camino.subPaths.forEach((sp) => {
                const puntos = sp.getPoints(48);
                if (puntos.length < 2)
                    return;
                [prof / 2 + radio * 0.6, -prof / 2 - radio * 0.6].forEach((z, cara) => {
                    const curva = new THREE.CatmullRomCurve3(puntos.map((p) => a3d(p, z)), cerrado, "catmullrom", 0.1);
                    const segmentos = Math.min(400, puntos.length * 3);
                    const tubo = new THREE.TubeGeometry(curva, segmentos, radio, 8, cerrado);
                    tubos.push(tubo);
                    recursos.push(tubo);
                    grupo.add(new THREE.Mesh(tubo, matTrazo));
                    if (cara === 0) {
                        const halo = new THREE.TubeGeometry(curva, segmentos, radio * 4, 8, cerrado);
                        tubos.push(halo);
                        recursos.push(halo);
                        grupo.add(new THREE.Mesh(halo, matHalo));
                    }
                });
            });
        };
        const parsear = (d) => new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`).paths[0];
        const alas = [];
        datos.formas.forEach((d, i) => {
            const camino = parsear(d);
            if (!camino)
                return;
            const grupo = new THREE.Group();
            const formas = SVGLoader.createShapes(camino).map((s) => {
                // Las coordenadas de SVG bajan hacia abajo: se invierten y se centran.
                const pts = s.getPoints(48).map((p) => new THREE.Vector2((p.x - lado / 2) * escala, -(p.y - lado / 2) * escala));
                return new THREE.Shape(pts);
            });
            const geo = new THREE.ExtrudeGeometry(formas, { depth: prof, bevelEnabled: false, curveSegments: 24 }).translate(0, 0, -prof / 2);
            recursos.push(geo);
            grupo.add(new THREE.Mesh(geo, matRelleno));
            contornear(camino, grupo, true);
            if (datos.aletean?.includes(i)) {
                geo.computeBoundingBox();
                const centro = ((geo.boundingBox.min.x + geo.boundingBox.max.x) / 2);
                const pivote = new THREE.Group();
                pivote.position.z = -prof * 1.1; // las alas van detrás del cuerpo
                pivote.add(grupo);
                raiz.add(pivote);
                alas.push({ grupo: pivote, lado: centro < 0 ? -1 : 1 });
            }
            else
                raiz.add(grupo);
        });
        (datos.lineas ?? []).forEach((d) => { const c = parsear(d); if (c)
            contornear(c, raiz, false); });
        const esfera = new THREE.SphereGeometry(1, 16, 12);
        recursos.push(esfera);
        (datos.nodos ?? []).forEach(([x, y, r]) => {
            const m = new THREE.Mesh(esfera, matTrazo);
            m.position.copy(a3d(new THREE.Vector2(x, y), prof / 2 + radio));
            m.scale.setScalar(r * escala);
            raiz.add(m);
        });
        // Dibujo del contorno: cada tubo crece desde su inicio hasta completarse.
        let inicio = 0, reiniciar = true;
        const totales = tubos.map((g) => g.index ? g.index.count : g.attributes.position.count);
        return {
            tocar: () => { reiniciar = true; sonidos.barrido(); },
            paso: (t) => {
                if (reiniciar) {
                    inicio = t;
                    reiniciar = false;
                }
                const p = e.reducido ? 1 : THREE.MathUtils.smoothstep((t - inicio) / 1.6, 0, 1);
                tubos.forEach((g, i) => g.setDrawRange(0, Math.ceil(totales[i] * p / 6) * 6));
                const aleteo = e.reducido ? 0.25 : 0.25 + Math.sin(t * 5.5) * 0.3;
                alas.forEach((a) => { a.grupo.rotation.y = -a.lado * aleteo; });
                raiz.position.y = Math.sin(t * 1.3) * 0.12;
                raiz.rotation.y += (e.puntero.x * 0.7 + Math.sin(t * 0.4) * 0.15 - raiz.rotation.y) * 0.05;
                raiz.rotation.x += (e.puntero.y * -0.35 - raiz.rotation.x) * 0.05;
            },
            liberar: () => recursos.forEach((r) => r.dispose()),
        };
    }, [clave]);
    return _jsx("canvas", { ref: ref, className: className, role: "img", "aria-label": etiqueta, style: { ...ESTILO_LIENZO, cursor: "pointer", touchAction: "pan-y" } });
}
