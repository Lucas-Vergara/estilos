import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { sonidos } from "../sitio/sonidos.js";

/*
 * Escenas 3D de la línea "sitio" con Three.js (dependencia opcional: instala `three` solo si usas este módulo).
 * Recursos, no un sitio-juego: un objeto que da personalidad al hero (Objeto3D) y un piso de grilla para una sección
 * (Grilla3D), al estilo de Bruno Simon y Henry Heffernan. Toman los colores de la línea (--s-acento, --s-destello,
 * --s-fondo, --s-tinta) y se rearman si cambian; se pausan fuera de pantalla; con movimiento reducido muestran un cuadro quieto.
 */

type Escena = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  colores: { acento: THREE.Color; destello: THREE.Color; fondo: THREE.Color; tinta: THREE.Color };
  puntero: THREE.Vector2; // -1..1 dentro del lienzo
  reducido: boolean;
};

function leerColor(el: Element, nombre: string, respaldo: string) {
  const v = getComputedStyle(el).getPropertyValue(nombre).trim();
  try { return new THREE.Color(v || respaldo); } catch { return new THREE.Color(respaldo); }
}

const VARIABLES_COLOR = ["--s-acento", "--s-destello", "--s-fondo", "--s-tinta"];

/** Colores actuales del lienzo como texto; cambia cuando cambia el tema o la paleta (clases en la página). */
function useClaveColores(ref: React.RefObject<HTMLCanvasElement | null>) {
  const [clave, setClave] = useState("");
  useEffect(() => {
    const leer = () => {
      const el = ref.current;
      if (!el) return;
      const cs = getComputedStyle(el);
      setClave(VARIABLES_COLOR.map((n) => cs.getPropertyValue(n).trim()).join("|"));
    };
    leer();
    const mo = new MutationObserver(leer);
    mo.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ["class", "style", "data-theme"] });
    return () => mo.disconnect();
  }, [ref]);
  return clave;
}

/** Monta una escena en el lienzo: tamaño, pausa fuera de pantalla, puntero y limpieza. `paso` dibuja cada cuadro. */
function usarEscena(
  ref: React.RefObject<HTMLCanvasElement | null>,
  preparar: (e: Escena) => { paso: (t: number, dt: number) => void; tocar?: () => void; liberar: () => void },
  deps: unknown[],
) {
  // Al cambiar los colores (modo noche, paleta) la escena se vuelve a armar con los nuevos.
  const clave = useClaveColores(ref);
  useEffect(() => {
    const lienzo = ref.current;
    if (!lienzo || !clave) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: lienzo, antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      return; // sin WebGL: el lienzo queda vacío y la sección sigue funcionando
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 200);
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const e: Escena = {
      renderer, scene, camera, reducido,
      puntero: new THREE.Vector2(0, 0),
      colores: {
        acento: leerColor(lienzo, "--s-acento", "#3d5afe"),
        destello: leerColor(lienzo, "--s-destello", "#ffd84d"),
        fondo: leerColor(lienzo, "--s-fondo", "#fafafa"),
        tinta: leerColor(lienzo, "--s-tinta", "#15171c"),
      },
    };
    const { paso, tocar, liberar } = preparar(e);

    let raf = 0, visible = true, ultimo = performance.now();
    const t0 = ultimo;
    const dibujar = (ahora: number) => {
      raf = 0;
      const dt = Math.min(0.05, (ahora - ultimo) / 1000);
      ultimo = ahora;
      paso((ahora - t0) / 1000, dt);
      renderer.render(scene, camera);
      if (!reducido && visible && !document.hidden) raf = requestAnimationFrame(dibujar);
    };
    const reanudar = () => { if (!raf && !reducido && visible && !document.hidden) { ultimo = performance.now(); raf = requestAnimationFrame(dibujar); } };
    const ajustar = () => {
      const r = lienzo.getBoundingClientRect();
      renderer.setSize(Math.max(1, r.width), Math.max(1, r.height), false);
      camera.aspect = r.width / Math.max(1, r.height);
      camera.updateProjectionMatrix();
      // Cambiar el tamaño borra el lienzo: se dibuja de nuevo aunque la animación esté en pausa.
      paso(reducido ? 1.5 : (performance.now() - t0) / 1000, 0);
      renderer.render(scene, camera);
    };

    ajustar();
    paso(0, 0);
    renderer.render(scene, camera);
    reanudar();

    const ro = new ResizeObserver(ajustar);
    ro.observe(lienzo);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; reanudar(); });
    io.observe(lienzo);
    const alCambiarPestana = () => reanudar();
    document.addEventListener("visibilitychange", alCambiarPestana);
    const mover = (ev: PointerEvent) => {
      const r = lienzo.getBoundingClientRect();
      e.puntero.set(((ev.clientX - r.left) / r.width) * 2 - 1, -(((ev.clientY - r.top) / r.height) * 2 - 1));
    };
    window.addEventListener("pointermove", mover, { passive: true });
    const clic = () => tocar?.();
    lienzo.addEventListener("click", clic);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      document.removeEventListener("visibilitychange", alCambiarPestana);
      window.removeEventListener("pointermove", mover);
      lienzo.removeEventListener("click", clic);
      liberar();
      renderer.dispose();
    };
  }, [...deps, clave]); // eslint-disable-line react-hooks/exhaustive-deps
}

export type FormaObjeto = "nudo" | "burbuja" | "anillos";

/**
 * Objeto 3D brillante que flota, gira despacio, mira hacia el cursor y rebota al tocarlo (con sonido si está
 * activado). Pensado para el hero, al lado del texto. El contenedor define el tamaño (p. ej. aspect-ratio: 1).
 */
export function Objeto3D({ forma = "burbuja", className, etiqueta = "Objeto 3D decorativo" }: { forma?: FormaObjeto; className?: string; etiqueta?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

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
    const geometrias: THREE.BufferGeometry[] = [];
    let base: Float32Array | null = null;
    let malla: THREE.Mesh | null = null;

    if (forma === "nudo") {
      const g = new THREE.TorusKnotGeometry(1.15, 0.38, 220, 32);
      geometrias.push(g);
      grupo.add(new THREE.Mesh(g, material));
    } else if (forma === "anillos") {
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
    } else {
      const g = new THREE.IcosahedronGeometry(1.5, 48);
      geometrias.push(g);
      base = Float32Array.from(g.attributes.position.array as Float32Array);
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
          const pos = malla.geometry.attributes.position as THREE.BufferAttribute;
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

  return <canvas ref={ref} className={className} role="img" aria-label={etiqueta} style={{ width: "100%", height: "100%", display: "block", cursor: "pointer", touchAction: "pan-y" }} />;
}

/**
 * Piso de grilla infinito con niebla y un punto de luz que sigue al cursor (al estilo de Bruno Simon), para el fondo
 * de una sección. La cámara deriva despacio hacia el puntero.
 */
export function Grilla3D({ className, etiqueta = "Piso de grilla 3D decorativo" }: { className?: string; etiqueta?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  usarEscena(ref, (e) => {
    const { scene, camera, colores } = e;
    scene.fog = new THREE.Fog(colores.fondo, 6, 26);
    camera.position.set(0, 2.2, 8);
    camera.lookAt(0, 0, 0);

    const grilla = new THREE.GridHelper(80, 80, colores.acento, colores.tinta);
    const materiales = (Array.isArray(grilla.material) ? grilla.material : [grilla.material]) as THREE.LineBasicMaterial[];
    materiales.forEach((m) => { m.transparent = true; m.opacity = 0.22; });
    scene.add(grilla);

    const esferaGeo = new THREE.SphereGeometry(0.28, 32, 16);
    const esferaMat = new THREE.MeshBasicMaterial({ color: colores.acento });
    const esfera = new THREE.Mesh(esferaGeo, esferaMat);
    scene.add(esfera);
    const haloGeo = new THREE.RingGeometry(0.45, 0.5, 64);
    const haloMat = new THREE.MeshBasicMaterial({ color: colores.destello, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = -Math.PI / 2;
    scene.add(halo);

    const plano = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const rayo = new THREE.Raycaster();
    const objetivo = new THREE.Vector3();

    return {
      paso: (t) => {
        rayo.setFromCamera(e.puntero, camera);
        if (rayo.ray.intersectPlane(plano, objetivo)) {
          objetivo.x = THREE.MathUtils.clamp(objetivo.x, -8, 8);
          objetivo.z = THREE.MathUtils.clamp(objetivo.z, -10, 4);
          esfera.position.lerp(new THREE.Vector3(objetivo.x, 0.28 + Math.abs(Math.sin(t * 3)) * 0.25, objetivo.z), 0.08);
        }
        halo.position.set(esfera.position.x, 0.01, esfera.position.z);
        halo.scale.setScalar(1 + (Math.sin(t * 3) * 0.5 + 0.5) * 0.6);
        haloMat.opacity = 0.9 - (Math.sin(t * 3) * 0.5 + 0.5) * 0.6;
        grilla.position.z = (t * 0.6) % 1;
        camera.position.x += (e.puntero.x * 1.2 - camera.position.x) * 0.03;
        camera.lookAt(0, 0, -2);
      },
      liberar: () => { grilla.geometry.dispose(); materiales.forEach((m) => m.dispose()); esferaGeo.dispose(); esferaMat.dispose(); haloGeo.dispose(); haloMat.dispose(); },
    };
  }, []);

  return <canvas ref={ref} className={className} role="img" aria-label={etiqueta} style={{ width: "100%", height: "100%", display: "block" }} />;
}
