import { useEffect, useState } from "react";
import * as THREE from "three";

/*
 * Base común de las escenas 3D: renderer, tamaño, pausa fuera de pantalla o con la pestaña oculta, puntero, clic,
 * colores de la línea (--s-acento, --s-destello, --s-fondo, --s-tinta, --s-acento-suave; la escena se rearma si
 * cambian) y limpieza. Con movimiento reducido se dibuja un cuadro quieto.
 */

export type Escena = {
  lienzo: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  colores: { acento: THREE.Color; destello: THREE.Color; fondo: THREE.Color; tinta: THREE.Color; suave: THREE.Color };
  puntero: THREE.Vector2; // -1..1 dentro del lienzo
  reducido: boolean;
};

export function leerColor(el: Element, nombre: string, respaldo: string) {
  const v = getComputedStyle(el).getPropertyValue(nombre).trim();
  try { return new THREE.Color(v || respaldo); } catch { return new THREE.Color(respaldo); }
}

const VARIABLES_COLOR = ["--s-acento", "--s-destello", "--s-fondo", "--s-tinta", "--s-acento-suave"];

/** Colores actuales del lienzo como texto; cambia cuando cambia el tema o la paleta (clases en la página). */
function useClaveColores(ref: React.RefObject<HTMLCanvasElement | null>) {
  const [clave, setClave] = useState("");
  useEffect(() => {
    const leer = () => {
      const el = ref.current;
      if (!el) return;
      const cs = getComputedStyle(el);
      // Las fuentes también cuentan: las texturas con texto se redibujan cuando terminan de cargar.
      const fuentes = document.fonts?.status ?? "loaded";
      setClave(VARIABLES_COLOR.map((n) => cs.getPropertyValue(n).trim()).join("|") + "|" + fuentes);
    };
    leer();
    document.fonts?.ready.then(leer);
    const mo = new MutationObserver(leer);
    mo.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ["class", "style", "data-theme"] });
    return () => mo.disconnect();
  }, [ref]);
  return clave;
}

/** Monta una escena en el lienzo: tamaño, pausa fuera de pantalla, puntero y limpieza. `paso` dibuja cada cuadro. */
export function usarEscena(
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
      lienzo, renderer, scene, camera, reducido,
      puntero: new THREE.Vector2(0, 0),
      colores: {
        acento: leerColor(lienzo, "--s-acento", "#3d5afe"),
        destello: leerColor(lienzo, "--s-destello", "#ffd84d"),
        fondo: leerColor(lienzo, "--s-fondo", "#fafafa"),
        tinta: leerColor(lienzo, "--s-tinta", "#15171c"),
        suave: leerColor(lienzo, "--s-acento-suave", "#e8ecff"),
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

/** Avance de 0 a 1 de un elemento que cruza la pantalla (0: asoma abajo, 1: sale arriba). */
export function avanceEnPantalla(el: Element) {
  const r = el.getBoundingClientRect();
  const alto = window.innerHeight || 1;
  return THREE.MathUtils.clamp((alto - r.top) / (alto + r.height), 0, 1);
}

/** Avance de 0 a 1 dentro de una sección alta con contenido fijo (sticky): 0 al entrar, 1 al terminar de recorrerla. */
export function avanceRecorrido(el: Element) {
  const r = el.getBoundingClientRect();
  const recorrido = r.height - (window.innerHeight || 1);
  return recorrido > 0 ? THREE.MathUtils.clamp(-r.top / recorrido, 0, 1) : avanceEnPantalla(el);
}

/** Estilo del lienzo: ocupa su contenedor. */
export const ESTILO_LIENZO = { width: "100%", height: "100%", display: "block" } as const;

/** Textura con texto dibujado en canvas 2D (para etiquetas y fondos de escena). */
export function texturaTexto(dibujar: (ctx: CanvasRenderingContext2D, ancho: number, alto: number) => void, ancho = 1024, alto = 512) {
  const c = document.createElement("canvas");
  c.width = ancho; c.height = alto;
  const ctx = c.getContext("2d")!;
  dibujar(ctx, ancho, alto);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** Fuente display de la línea, para dibujar texto en texturas. */
export function fuenteDisplay(el: Element) {
  return getComputedStyle(el).getPropertyValue("--s-display").trim() || "system-ui, sans-serif";
}
