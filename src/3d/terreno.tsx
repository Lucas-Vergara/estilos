import { useRef } from "react";
import * as THREE from "three";
import { ESTILO_LIENZO, usarEscena } from "./escena.js";

export type EstiloTerreno = "puntos" | "malla";

/**
 * Paisaje que avanza hacia la cámara: colinas suaves hechas de puntos o de malla, que se levantan bajo el cursor.
 * Para el fondo de una sección o un hero.
 */
export function Terreno3D({ estilo = "puntos", className, etiqueta = "Paisaje 3D decorativo" }: { estilo?: EstiloTerreno; className?: string; etiqueta?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  usarEscena(ref, (e) => {
    const { scene, camera, colores } = e;
    scene.fog = new THREE.Fog(colores.fondo, 4, 20);
    camera.position.set(0, 1.6, 6);
    camera.lookAt(0, 0, -2);

    const lados = estilo === "puntos" ? 140 : 70;
    const geo = new THREE.PlaneGeometry(26, 26, lados, lados);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const base = Float32Array.from(pos.array as Float32Array);
    const color = new Float32Array(pos.count * 3);
    geo.setAttribute("color", new THREE.BufferAttribute(color, 3));
    const objeto = estilo === "puntos"
      ? new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.045, vertexColors: true, sizeAttenuation: true }))
      : new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, wireframe: true, transparent: true, opacity: 0.55 }));
    scene.add(objeto);

    const plano = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const rayo = new THREE.Raycaster();
    const cursor = new THREE.Vector3(0, 0, 100);
    const sobre = new THREE.Vector3(0, 0, 100);
    const c = new THREE.Color();

    return {
      paso: (t) => {
        rayo.setFromCamera(e.puntero, camera);
        if (rayo.ray.intersectPlane(plano, cursor)) sobre.lerp(cursor, 0.1);
        const avance = t * 0.9;
        for (let i = 0; i < pos.count; i++) {
          const x = base[i * 3], z = base[i * 3 + 2];
          const zm = z - avance;
          let y = Math.sin(x * 0.45 + zm * 0.3) * 0.45 + Math.cos(zm * 0.55 - x * 0.2) * 0.35 + Math.sin(x * 1.3 + zm * 1.1) * 0.08;
          const dx = x - sobre.x, dz = z - sobre.z;
          y += Math.exp(-(dx * dx + dz * dz) * 0.35) * 1.1;
          pos.setY(i, y);
          const k = THREE.MathUtils.clamp((y + 0.6) / 1.9, 0, 1);
          c.copy(colores.tinta).lerp(colores.acento, k);
          if (k > 0.85) c.lerp(colores.destello, (k - 0.85) * 5);
          color[i * 3] = c.r; color[i * 3 + 1] = c.g; color[i * 3 + 2] = c.b;
        }
        pos.needsUpdate = true;
        geo.attributes.color.needsUpdate = true;
        camera.position.x += (e.puntero.x * 0.8 - camera.position.x) * 0.03;
        camera.lookAt(0, 0, -2);
      },
      liberar: () => { geo.dispose(); (objeto.material as THREE.Material).dispose(); },
    };
  }, [estilo]);

  return <canvas ref={ref} className={className} role="img" aria-label={etiqueta} style={ESTILO_LIENZO} />;
}
