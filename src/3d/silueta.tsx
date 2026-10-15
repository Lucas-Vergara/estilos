import { useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { sonidos } from "../sitio/sonidos.js";
import { ESTILO_LIENZO, usarEscena } from "./escena.js";

export type EstiloSilueta = "neon" | "cromo" | "holograma";

// Holograma: bordes que brillan (fresnel), líneas de barrido y cortes de glitch que desplazan franjas.
const HOLO_VERTICE = /* glsl */ `
uniform float uTiempo; uniform float uGlitch;
varying vec3 vNormal; varying vec3 vVista; varying float vAlto;
float azar(float x){ return fract(sin(x * 91.17) * 43758.5453); }
void main(){
  vec3 pos = position;
  float franja = floor(pos.y * 9.0 + floor(uTiempo * 14.0));
  pos.x += (azar(franja) - 0.5) * 0.5 * uGlitch * step(0.7, azar(franja + 3.1));
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vVista = normalize(-mv.xyz);
  vAlto = (modelMatrix * vec4(pos, 1.0)).y;
  gl_Position = projectionMatrix * mv;
}`;
const HOLO_FRAGMENTO = /* glsl */ `
uniform vec3 uA; uniform vec3 uB; uniform float uTiempo;
varying vec3 vNormal; varying vec3 vVista; varying float vAlto;
void main(){
  float borde = pow(1.0 - abs(dot(vNormal, vVista)), 2.0);
  float barrido = 0.5 + 0.5 * sin(vAlto * 90.0 - uTiempo * 6.0);
  vec3 col = mix(uA, uB, smoothstep(-2.5, 2.5, vAlto + sin(uTiempo * 0.7) * 0.8));
  float alfa = clamp(borde * 0.95 + 0.1 + barrido * 0.08, 0.0, 1.0);
  gl_FragColor = vec4(col * (0.35 + borde * 1.4), alfa);
  #include <colorspace_fragment>
}`;

export type DatosSilueta = {
  /** Trazos cerrados (atributo d de SVG): se rellenan con volumen y llevan contorno. */
  formas: string[];
  /** Trazos abiertos: solo contorno (antenas, detalles, circuitos). */
  lineas?: string[];
  /** Puntos [x, y, radio] que se dibujan como esferas del color del trazo. */
  nodos?: [number, number, number][];
  /** Índices de `formas` que aletean (alas): giran sobre el eje vertical del centro, cada lado hacia su lado. */
  aletean?: number[];
  /** Índices de `formas` que se mecen como cintas: cuelgan de su borde superior y oscilan. */
  ondean?: number[];
  /** Lado del cuadro de dibujo (viewBox cuadrado), por defecto 100. */
  lado?: number;
};

/**
 * Silueta en 3D a partir de trazos SVG: un logo o ícono con volumen, contorno que se dibuja al aparecer (y otra vez
 * al tocarlo), alas que aletean, cintas que se mecen y giro hacia el cursor. Tres estilos:
 *  - "neon":      relleno oscuro y contorno de neón con halo.
 *  - "cromo":     metal oscuro iridiscente con reflejos, iluminado por dos luces de color que giran.
 *  - "holograma": cuerpo translúcido con bordes que brillan, líneas de barrido y cortes de glitch.
 * Por defecto usa la tinta y el destello de la paleta (y el acento como segundo color); acepta colores propios.
 */
export function Silueta3D({ datos, estilo = "neon", colorTrazo, colorRelleno, colorSecundario, profundidad = 4, grosor = 0.9, aleteo = 1, className, etiqueta = "Silueta 3D" }: {
  datos: DatosSilueta; estilo?: EstiloSilueta; colorTrazo?: string; colorRelleno?: string; colorSecundario?: string;
  profundidad?: number; grosor?: number; /** Amplitud del aleteo (1 = normal, 0.3 = suave). */ aleteo?: number; className?: string; etiqueta?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const clave = JSON.stringify(datos) + [estilo, colorTrazo, colorRelleno, colorSecundario, profundidad, grosor, aleteo].join("|");

  usarEscena(ref, (e) => {
    const { scene, camera, colores, renderer } = e;
    const lado = datos.lado ?? 100, escala = 6 / lado;
    camera.position.set(0, 0, 11);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x222222, 1.4));
    const luz = new THREE.DirectionalLight(0xffffff, 1.6);
    luz.position.set(3, 5, 6);
    scene.add(luz);

    const trazo = colorTrazo ? new THREE.Color(colorTrazo) : colores.destello.clone(); // neón sobre relleno oscuro
    const relleno = colorRelleno ? new THREE.Color(colorRelleno) : colores.tinta.clone();
    const segundo = colorSecundario ? new THREE.Color(colorSecundario) : colores.acento.clone();
    const recursos: { dispose: () => void }[] = [];
    const holo = { uTiempo: { value: 0 }, uGlitch: { value: 0 }, uA: { value: trazo.clone() }, uB: { value: segundo.clone() } };
    let matRelleno: THREE.Material;
    const luces: THREE.PointLight[] = [];
    if (estilo === "cromo") {
      const pmrem = new THREE.PMREMGenerator(renderer);
      const entorno = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = entorno;
      recursos.push(pmrem, entorno);
      matRelleno = new THREE.MeshPhysicalMaterial({ color: relleno.clone().lerp(new THREE.Color(0x888888), 0.12), metalness: 1, roughness: 0.24, clearcoat: 1, clearcoatRoughness: 0.1, iridescence: 0.7, iridescenceIOR: 1.6, envMapIntensity: 0.55 });
      [trazo, segundo].forEach((c) => { const l = new THREE.PointLight(c, 40, 30); scene.add(l); luces.push(l); });
    } else if (estilo === "holograma") {
      matRelleno = new THREE.ShaderMaterial({ vertexShader: HOLO_VERTICE, fragmentShader: HOLO_FRAGMENTO, uniforms: holo, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    } else {
      matRelleno = new THREE.MeshStandardMaterial({ color: relleno, roughness: 0.45, metalness: 0.2, emissive: trazo, emissiveIntensity: 0.04 });
    }
    const matTrazo = new THREE.MeshBasicMaterial({ color: trazo, transparent: estilo === "holograma", opacity: estilo === "holograma" ? 0.85 : 1 });
    const matHalo = new THREE.MeshBasicMaterial({ color: trazo, transparent: true, opacity: estilo === "neon" ? 0.16 : 0.08, depthWrite: false });
    recursos.push(matRelleno, matTrazo, matHalo);
    const tubos: THREE.BufferGeometry[] = [];
    const prof = profundidad * escala, radio = grosor * escala * (estilo === "cromo" ? 0.3 : 0.5);

    const raiz = new THREE.Group();
    scene.add(raiz);
    const a3d = (p: THREE.Vector2, z: number) => new THREE.Vector3((p.x - lado / 2) * escala, -(p.y - lado / 2) * escala, z);

    // Contorno: un tubo por subtrazo en la cara frontal y otro en la trasera, más un halo ancho y suave.
    const contornear = (camino: THREE.ShapePath, grupo: THREE.Object3D, cerrado: boolean) => {
      camino.subPaths.forEach((sp) => {
        const puntos = sp.getPoints(48);
        if (puntos.length < 2) return;
        [prof / 2 + radio * 0.6, -prof / 2 - radio * 0.6].forEach((z, cara) => {
          const curva = new THREE.CatmullRomCurve3(puntos.map((p) => a3d(p, z)), cerrado, "catmullrom", 0.1);
          const segmentos = Math.min(400, puntos.length * 3);
          const tubo = new THREE.TubeGeometry(curva, segmentos, radio, 8, cerrado);
          tubos.push(tubo); recursos.push(tubo);
          grupo.add(new THREE.Mesh(tubo, matTrazo));
          if (cara === 0) {
            const halo = new THREE.TubeGeometry(curva, segmentos, radio * 4, 8, cerrado);
            tubos.push(halo); recursos.push(halo);
            grupo.add(new THREE.Mesh(halo, matHalo));
          }
        });
      });
    };
    const parsear = (d: string) => new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`).paths[0];

    const alas: { grupo: THREE.Group; lado: number }[] = [];
    const cintas: { grupo: THREE.Group; lado: number; fase: number }[] = [];
    datos.formas.forEach((d, i) => {
      const camino = parsear(d);
      if (!camino) return;
      const grupo = new THREE.Group();
      const formas = SVGLoader.createShapes(camino).map((s) => {
        // Las coordenadas de SVG bajan hacia abajo: se invierten y se centran.
        const pts = s.getPoints(48).map((p) => new THREE.Vector2((p.x - lado / 2) * escala, -(p.y - lado / 2) * escala));
        return new THREE.Shape(pts);
      });
      // Bisel suave para que el volumen tome luz en los bordes.
      const bisel = estilo === "neon" ? 0 : escala * 0.5;
      const geo = new THREE.ExtrudeGeometry(formas, { depth: prof, bevelEnabled: bisel > 0, bevelThickness: bisel, bevelSize: bisel * 0.6, bevelSegments: 3, curveSegments: 24 }).translate(0, 0, -prof / 2);
      recursos.push(geo);
      grupo.add(new THREE.Mesh(geo, matRelleno));
      contornear(camino, grupo, true);
      geo.computeBoundingBox();
      const caja = geo.boundingBox!;
      const centro = (caja.min.x + caja.max.x) / 2;
      if (datos.aletean?.includes(i)) {
        const pivote = new THREE.Group();
        pivote.position.z = -prof * 1.1; // las alas van detrás del cuerpo
        pivote.add(grupo);
        raiz.add(pivote);
        alas.push({ grupo: pivote, lado: centro < 0 ? -1 : 1 });
      } else if (datos.ondean?.includes(i)) {
        // Cuelga del borde superior: el pivote queda arriba y el grupo se corre para que no cambie de lugar.
        const pivote = new THREE.Group();
        pivote.position.set(centro, caja.max.y, 0);
        grupo.position.set(-centro, -caja.max.y, 0);
        pivote.add(grupo);
        raiz.add(pivote);
        cintas.push({ grupo: pivote, lado: centro < 0 ? -1 : 1, fase: cintas.length * 1.7 });
      } else raiz.add(grupo);
    });
    (datos.lineas ?? []).forEach((d) => { const c = parsear(d); if (c) contornear(c, raiz, false); });
    const esfera = new THREE.SphereGeometry(1, 16, 12);
    recursos.push(esfera);
    (datos.nodos ?? []).forEach(([x, y, r]) => {
      const m = new THREE.Mesh(esfera, matTrazo);
      m.position.copy(a3d(new THREE.Vector2(x, y), prof / 2 + radio));
      m.scale.setScalar(r * escala);
      raiz.add(m);
    });

    // Dibujo del contorno: cada tubo crece desde su inicio hasta completarse.
    let inicio = 0, reiniciar = true, proximoGlitch = 2;
    const totales = tubos.map((g) => g.index ? g.index.count : g.attributes.position.count);

    return {
      tocar: () => { reiniciar = true; holo.uGlitch.value = 1; sonidos.barrido(); },
      paso: (t) => {
        if (reiniciar) { inicio = t; reiniciar = false; }
        const p = e.reducido ? 1 : THREE.MathUtils.smoothstep((t - inicio) / 1.6, 0, 1);
        tubos.forEach((g, i) => g.setDrawRange(0, Math.ceil(totales[i] * p / 6) * 6));
        const giro = e.reducido ? 0.25 * aleteo : (0.25 + Math.sin(t * 5.5) * 0.3) * aleteo;
        alas.forEach((a) => { a.grupo.rotation.y = -a.lado * giro; });
        cintas.forEach((c) => { c.grupo.rotation.z = e.reducido ? 0 : c.lado * Math.sin(t * 1.8 + c.fase) * 0.09; c.grupo.rotation.x = e.reducido ? 0 : Math.sin(t * 1.3 + c.fase) * 0.25; });
        luces.forEach((l, i) => { const a = t * 0.8 + i * Math.PI; l.position.set(Math.cos(a) * 5, Math.sin(a * 0.7) * 3, 4 + Math.sin(a) * 2); });
        holo.uTiempo.value = t;
        // Glitch: ráfagas cortas cada pocos segundos.
        if (t > proximoGlitch) { holo.uGlitch.value = 1; proximoGlitch = t + 2 + Math.random() * 3; }
        holo.uGlitch.value *= 0.88;
        raiz.position.y = Math.sin(t * 1.3) * 0.12;
        raiz.rotation.y += (e.puntero.x * 0.7 + Math.sin(t * 0.4) * 0.15 - raiz.rotation.y) * 0.05;
        raiz.rotation.x += (e.puntero.y * -0.35 - raiz.rotation.x) * 0.05;
      },
      liberar: () => recursos.forEach((r) => r.dispose()),
    };
  }, [clave]);

  return <canvas ref={ref} className={className} role="img" aria-label={etiqueta} style={{ ...ESTILO_LIENZO, cursor: "pointer", touchAction: "pan-y" }} />;
}
