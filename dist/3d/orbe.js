import { jsx as _jsx } from "react/jsx-runtime";
import { useRef } from "react";
import * as THREE from "three";
import { sonidos } from "../sitio/sonidos.js";
import { ESTILO_LIENZO, usarEscena } from "./escena.js";
// Ruido simplex 3D (Ashima Arts / Stefan Gustavson, licencia MIT).
const RUIDO = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;
const VERTICE = /* glsl */ `
uniform float uTiempo; uniform float uFuerza;
varying float vRuido; varying vec3 vNormal; varying vec3 vVista;
${RUIDO}
void main(){
  float n = snoise(normal * 0.9 + uTiempo * 0.3);
  float n2 = snoise(normal * 2.0 - uTiempo * 0.18) * 0.25;
  vRuido = n + n2;
  vec3 pos = position + normal * (n + n2) * uFuerza;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vVista = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;
const FRAGMENTO = /* glsl */ `
uniform vec3 uA; uniform vec3 uB; uniform vec3 uC;
varying float vRuido; varying vec3 vNormal; varying vec3 vVista;
void main(){
  float t = smoothstep(-0.9, 0.9, vRuido);
  vec3 col = mix(uC, uA, t);
  col = mix(col, uB, smoothstep(0.55, 1.0, t) * 0.85);
  float borde = pow(1.0 - max(dot(vNormal, vVista), 0.0), 2.5);
  col += borde * 0.35;
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;
/**
 * Orbe de degradado: una esfera que se deforma con ruido y mezcla acento, destello y acento suave, con un borde
 * luminoso. Se agita más cuando el cursor pasa cerca y al tocarlo.
 */
export function Orbe3D({ className, etiqueta = "Orbe de color decorativo" }) {
    const ref = useRef(null);
    usarEscena(ref, (e) => {
        const { scene, camera, colores } = e;
        camera.position.set(0, 0, 6.4);
        const geo = new THREE.IcosahedronGeometry(1.45, 96);
        const uniformes = {
            uTiempo: { value: 0 }, uFuerza: { value: 0.18 },
            uA: { value: colores.acento.clone() }, uB: { value: colores.destello.clone() }, uC: { value: colores.suave.clone() },
        };
        const mat = new THREE.ShaderMaterial({ vertexShader: VERTICE, fragmentShader: FRAGMENTO, uniforms: uniformes });
        const orbe = new THREE.Mesh(geo, mat);
        scene.add(orbe);
        let agitacion = 0;
        return {
            tocar: () => { agitacion = 1; sonidos.rebote(); },
            paso: (t, dt) => {
                const cerca = Math.max(0, 1 - e.puntero.length());
                agitacion = Math.max(0, agitacion - dt * 0.8);
                uniformes.uTiempo.value = t * (1 + agitacion * 2);
                uniformes.uFuerza.value += (0.16 + cerca * 0.1 + agitacion * 0.25 - uniformes.uFuerza.value) * 0.06;
                orbe.rotation.y += dt * 0.15;
                orbe.rotation.x += (e.puntero.y * 0.4 - orbe.rotation.x) * 0.04;
            },
            liberar: () => { geo.dispose(); mat.dispose(); },
        };
    }, []);
    return _jsx("canvas", { ref: ref, className: className, role: "img", "aria-label": etiqueta, style: { ...ESTILO_LIENZO, cursor: "pointer", touchAction: "pan-y" } });
}
