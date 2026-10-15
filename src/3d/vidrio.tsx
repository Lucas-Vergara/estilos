import { useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { ESTILO_LIENZO, fuenteDisplay, texturaTexto, usarEscena } from "./escena.js";

export type FormaVidrio = "prisma" | "lente" | "nudo";

/**
 * Pieza de vidrio que refracta un texto grande puesto detrás (dentro de la escena), con un leve arcoíris en los bordes.
 * Gira despacio y se inclina hacia el cursor.
 */
export function Vidrio3D({ texto = "Vidrio", forma = "prisma", className, etiqueta = "Pieza de vidrio sobre un texto" }: {
  texto?: string; forma?: FormaVidrio; className?: string; etiqueta?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  usarEscena(ref, (e) => {
    const { scene, camera, colores, renderer, lienzo } = e;
    camera.position.set(0, 0, 8);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const entorno = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = entorno;

    // Fondo con el texto: un plano opaco, para que el vidrio tenga algo que refractar.
    const fondo = texturaTexto((ctx, w, h) => {
      ctx.fillStyle = `#${colores.fondo.getHexString()}`;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = `#${colores.tinta.getHexString()}`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      let tam = h * 0.62;
      ctx.font = `700 ${tam}px ${fuenteDisplay(lienzo)}`;
      while (ctx.measureText(texto).width > w * 0.92 && tam > 20) { tam -= 8; ctx.font = `700 ${tam}px ${fuenteDisplay(lienzo)}`; }
      ctx.fillText(texto, w / 2, h / 2);
      ctx.fillStyle = `#${colores.acento.getHexString()}`;
      ctx.fillRect(w * 0.08, h * 0.82, w * 0.84, h * 0.02);
    }, 2048, 1024);
    const planoGeo = new THREE.PlaneGeometry(16, 8);
    const planoMat = new THREE.MeshBasicMaterial({ map: fondo });
    const plano = new THREE.Mesh(planoGeo, planoMat);
    plano.position.z = -2.5;
    scene.add(plano);

    const geo = forma === "lente" ? new THREE.SphereGeometry(1.7, 96, 64).scale(1, 1, 0.45)
      : forma === "nudo" ? new THREE.TorusKnotGeometry(1.1, 0.42, 240, 40)
      : new THREE.CylinderGeometry(1.5, 1.5, 2.6, 3, 1); // prisma triangular
    const mat = new THREE.MeshPhysicalMaterial({
      transmission: 1, thickness: 1.4, roughness: 0.04, ior: 1.5, dispersion: 4, metalness: 0,
      color: 0xffffff, attenuationColor: colores.suave, attenuationDistance: 6, envMapIntensity: 1.2, clearcoat: 1,
    });
    const pieza = new THREE.Mesh(geo, mat);
    scene.add(pieza);

    return {
      paso: (t, dt) => {
        pieza.rotation.y += dt * 0.3;
        pieza.rotation.x += (e.puntero.y * -0.6 + Math.sin(t * 0.5) * 0.2 - pieza.rotation.x) * 0.05;
        pieza.position.x += (e.puntero.x * 1.2 - pieza.position.x) * 0.04;
        pieza.position.y = Math.sin(t * 0.9) * 0.12;
      },
      liberar: () => { geo.dispose(); mat.dispose(); planoGeo.dispose(); planoMat.dispose(); fondo.dispose(); entorno.dispose(); pmrem.dispose(); },
    };
  }, [texto, forma]);

  return <canvas ref={ref} className={className} role="img" aria-label={etiqueta} style={ESTILO_LIENZO} />;
}
