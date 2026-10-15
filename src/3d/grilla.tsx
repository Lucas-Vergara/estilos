import { useRef } from "react";
import * as THREE from "three";
import { usarEscena } from "./escena.js";

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
