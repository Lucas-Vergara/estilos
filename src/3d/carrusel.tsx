import { useEffect, useRef } from "react";
import * as THREE from "three";
import { sonidos } from "../sitio/sonidos.js";
import { ESTILO_LIENZO, fuenteDisplay, texturaTexto, usarEscena } from "./escena.js";

export type TarjetaCarrusel = { titulo: string; detalle?: string; imagen?: string };
export type EjeCarrusel = "vertical" | "horizontal";

/**
 * Carrusel cilíndrico: tarjetas en círculo que se arrastran con el mouse o el dedo y siguen con inercia.
 * Las tarjetas pueden ser texto (dibujado con la fuente de la línea) o una imagen.
 *
 *  - eje "vertical" (por defecto): el cilindro gira hacia los lados, como un carrusel.
 *  - eje "horizontal": gira hacia arriba y abajo, como una rueda (p. ej. una tienda con la ficha al lado).
 *  - Con `ajustar`, al soltar se detiene con una tarjeta al frente; `onActivo` avisa cuál, y `activo` la lleva al
 *    frente desde afuera (una lista, flechas). `rueda` hace girar con la rueda del mouse sobre el lienzo.
 *    Tocar una tarjeta la trae al frente.
 */
export function Carrusel3D({
  tarjetas, eje = "vertical", proporcion = 0.8, autoGiro = true, ajustar = false, rueda = false, activo, onActivo,
  className, etiqueta = "Carrusel 3D de tarjetas",
}: {
  tarjetas: TarjetaCarrusel[]; eje?: EjeCarrusel; /** ancho / alto de cada tarjeta */ proporcion?: number;
  autoGiro?: boolean; ajustar?: boolean; rueda?: boolean; activo?: number; onActivo?: (i: number) => void;
  className?: string; etiqueta?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const clave = JSON.stringify(tarjetas) + eje + proporcion;
  const pedido = useRef<number | null>(null);
  const aviso = useRef(onActivo);
  aviso.current = onActivo;
  const opciones = useRef({ autoGiro, ajustar, rueda });
  opciones.current = { autoGiro, ajustar, rueda };
  useEffect(() => { if (activo !== undefined) pedido.current = activo; }, [activo]);

  usarEscena(ref, (e) => {
    const { scene, camera, colores, lienzo } = e;
    const n = Math.max(3, tarjetas.length);
    const vertical = eje === "vertical";
    const alto = vertical ? 3 : 2.6, ancho = alto * proporcion;
    // El radio crece con la cantidad de tarjetas para que no se toquen.
    const radio = Math.max(3, ((vertical ? ancho : alto) * 1.25 * n) / (Math.PI * 2));
    camera.position.set(0, 0, radio + (vertical ? 5.2 : 7.5));
    camera.lookAt(0, 0, 0);

    const geo = new THREE.PlaneGeometry(ancho, alto, vertical ? 24 : 1, vertical ? 1 : 24);
    // Curva la tarjeta para que siga el cilindro.
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) { const c = vertical ? pos.getX(i) : pos.getY(i); pos.setZ(i, -(c * c) / (2 * radio)); }
    const grupo = new THREE.Group();
    scene.add(grupo);
    const recursos: { dispose: () => void }[] = [geo];
    const cargador = new THREE.TextureLoader();
    const mallas: THREE.Mesh[] = [];

    tarjetas.forEach((t, i) => {
      const fondo = i % 4 === 1 ? colores.acento : i % 4 === 3 ? colores.destello : colores.suave;
      const tinta = i % 4 === 1 ? new THREE.Color(0xffffff) : colores.tinta;
      const tex = t.imagen ? cargador.load(t.imagen) : texturaTexto((ctx, w, h) => {
        ctx.fillStyle = `#${fondo.getHexString()}`;
        ctx.beginPath(); ctx.roundRect(0, 0, w, h, 56); ctx.fill();
        ctx.fillStyle = `#${tinta.getHexString()}`; ctx.textBaseline = "alphabetic";
        ctx.font = `500 52px ${fuenteDisplay(lienzo)}`;
        ctx.fillText(String(i + 1).padStart(2, "0"), 64, 120);
        ctx.font = `700 110px ${fuenteDisplay(lienzo)}`;
        ctx.fillText(t.titulo, 64, h - (t.detalle ? 170 : 90), w - 128);
        if (t.detalle) { ctx.font = `400 52px ${fuenteDisplay(lienzo)}`; ctx.fillText(t.detalle, 64, h - 80, w - 128); }
      }, 800, 1000);
      if (t.imagen) tex.colorSpace = THREE.SRGBColorSpace;
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
      recursos.push(tex, mat);
      const m = new THREE.Mesh(geo, mat);
      m.userData.indice = i;
      const a = (i / n) * Math.PI * 2;
      if (vertical) { m.position.set(Math.sin(a) * radio, 0, Math.cos(a) * radio); m.rotation.y = a; }
      else { m.position.set(0, -Math.sin(a) * radio, Math.cos(a) * radio); m.rotation.x = a; }
      grupo.add(m);
      mallas.push(m);
    });

    const pasoAng = (Math.PI * 2) / n;
    let giro = 0, vel = autoGiro ? 0.15 : 0, arrastrando = false, ultimo = 0, recorrido = 0, ultimaTarjeta = -1, soltadoEn = 0;
    let destino: number | null = null;
    const mod = (a: number) => ((a % n) + n) % n;
    // Índice "continuo" de la tarjeta al frente: la tarjeta i está al frente cuando su ángulo más el giro es cero.
    const frenteContinuo = () => -giro / pasoAng;
    const irA = (i: number) => {
      // Camino más corto hasta la tarjeta i.
      const actual = Math.round(frenteContinuo());
      let d = i - mod(actual);
      if (d > n / 2) d -= n;
      if (d < -n / 2) d += n;
      const meta = actual + d;
      destino = -meta * pasoAng;
    };
    const coordenada = (ev: PointerEvent) => (vertical ? ev.clientX / lienzo.clientWidth : ev.clientY / lienzo.clientHeight);
    const abajo = (ev: PointerEvent) => { arrastrando = true; destino = null; ultimo = coordenada(ev); recorrido = 0; vel = 0; lienzo.setPointerCapture(ev.pointerId); };
    const mover = (ev: PointerEvent) => {
      if (!arrastrando) return;
      const c = coordenada(ev), d = c - ultimo;
      ultimo = c; recorrido += Math.abs(d);
      vel = d * 60;
    };
    const rayo = new THREE.Raycaster(), punto = new THREE.Vector2();
    const arriba = (ev: PointerEvent) => {
      if (!arrastrando) return;
      arrastrando = false;
      soltadoEn = performance.now();
      // Un toque sin arrastre sobre una tarjeta la trae al frente.
      if (recorrido < 0.01) {
        const r = lienzo.getBoundingClientRect();
        punto.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
        rayo.setFromCamera(punto, camera);
        const tocada = rayo.intersectObjects(mallas)[0];
        if (tocada) { irA(tocada.object.userData.indice); vel = 0; sonidos.clic(); }
      }
    };
    const alRodar = (ev: WheelEvent) => {
      if (!opciones.current.rueda) return;
      ev.preventDefault();
      const d = Math.abs(ev.deltaY) >= Math.abs(ev.deltaX) ? ev.deltaY : ev.deltaX;
      // La rueda mueve el destino directamente (hacia abajo: la siguiente tarjeta); al parar, se ajusta a una tarjeta.
      vel = 0;
      destino = (destino ?? giro) - (ev.deltaMode === 1 ? d * 33 : d) * 0.0065 * pasoAng;
      clearTimeout(esperaRueda);
      esperaRueda = setTimeout(() => { if (opciones.current.ajustar && destino !== null) destino = Math.round(destino / pasoAng) * pasoAng; }, 140);
    };
    let esperaRueda: ReturnType<typeof setTimeout> | undefined;
    lienzo.addEventListener("pointerdown", abajo);
    lienzo.addEventListener("pointermove", mover);
    lienzo.addEventListener("pointerup", arriba);
    lienzo.addEventListener("pointercancel", arriba);
    lienzo.addEventListener("wheel", alRodar, { passive: false });

    return {
      paso: (_t, dt) => {
        const o = opciones.current;
        if (pedido.current !== null) { irA(pedido.current); pedido.current = null; vel = 0; }
        if (destino !== null) {
          giro += (destino - giro) * Math.min(1, dt * 7);
          if (Math.abs(destino - giro) < 0.0005) { giro = destino; destino = null; }
        } else if (!arrastrando) {
          if (o.autoGiro) vel += (0.15 - vel) * Math.min(1, dt * 1.5);
          else vel *= Math.pow(0.04, dt); // frena solo
          giro += vel * dt;
          // Ajuste: cuando ya casi no se mueve, se detiene con una tarjeta al frente.
          if (o.ajustar && !o.autoGiro && Math.abs(vel) < 0.35 && performance.now() - soltadoEn > 120) { irA(mod(Math.round(frenteContinuo()))); vel = 0; }
        } else giro += vel * dt;
        if (vertical) grupo.rotation.y = giro; else grupo.rotation.x = giro;
        // Las tarjetas lejos del frente se oscurecen un poco.
        mallas.forEach((m) => {
          const a = Math.cos(m.userData.indice * pasoAng - frenteContinuo() * pasoAng);
          (m.material as THREE.MeshBasicMaterial).color.setScalar(0.3 + 0.7 * Math.max(0, a));
        });
        const frente = mod(Math.round(frenteContinuo()));
        if (frente !== ultimaTarjeta) {
          if (ultimaTarjeta !== -1 && (Math.abs(vel) > 0.6 || destino !== null)) sonidos.roce();
          ultimaTarjeta = frente;
          aviso.current?.(frente);
        }
      },
      liberar: () => {
        lienzo.removeEventListener("pointerdown", abajo); lienzo.removeEventListener("pointermove", mover);
        lienzo.removeEventListener("pointerup", arriba); lienzo.removeEventListener("pointercancel", arriba);
        lienzo.removeEventListener("wheel", alRodar);
        clearTimeout(esperaRueda);
        recursos.forEach((r) => r.dispose());
      },
    };
  }, [clave]);

  return <canvas ref={ref} className={className} role="img" aria-label={etiqueta} style={{ ...ESTILO_LIENZO, cursor: "grab", touchAction: eje === "vertical" ? "pan-y" : "pan-x" }} />;
}
