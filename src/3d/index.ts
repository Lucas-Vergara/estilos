/*
 * Línea "3d" (y escenas para la línea sitio) con Three.js. Dependencia opcional: instala `three` solo si usas este
 * módulo. Cada escena ocupa su contenedor, toma los colores de la línea y de la paleta (se rearma si cambian), se
 * pausa fuera de pantalla y con movimiento reducido muestra un cuadro quieto. Clases de diseño: lineas/3d.css.
 */
export { Objeto3D, type FormaObjeto } from "./objeto.js";
export { Grilla3D } from "./grilla.js";
export { Particulas3D, FORMAS_PARTICULAS, type FormaParticulas } from "./particulas.js";
export { Orbe3D } from "./orbe.js";
export { Vidrio3D, type FormaVidrio } from "./vidrio.js";
export { Terreno3D, type EstiloTerreno } from "./terreno.js";
export { Tunel3D } from "./tunel.js";
export { Carrusel3D, type EjeCarrusel, type TarjetaCarrusel } from "./carrusel.js";
export { Bloques3D } from "./bloques.js";
export { Silueta3D, type DatosSilueta, type EstiloSilueta } from "./silueta.js";
export { usarEscena, avanceEnPantalla, avanceRecorrido, texturaTexto, type Escena } from "./escena.js";
