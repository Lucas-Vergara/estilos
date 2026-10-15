import * as THREE from "three";
export type Escena = {
    lienzo: HTMLCanvasElement;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    colores: {
        acento: THREE.Color;
        destello: THREE.Color;
        fondo: THREE.Color;
        tinta: THREE.Color;
        suave: THREE.Color;
    };
    puntero: THREE.Vector2;
    reducido: boolean;
};
export declare function leerColor(el: Element, nombre: string, respaldo: string): THREE.Color;
/** Monta una escena en el lienzo: tamaño, pausa fuera de pantalla, puntero y limpieza. `paso` dibuja cada cuadro. */
export declare function usarEscena(ref: React.RefObject<HTMLCanvasElement | null>, preparar: (e: Escena) => {
    paso: (t: number, dt: number) => void;
    tocar?: () => void;
    liberar: () => void;
}, deps: unknown[]): void;
/** Avance de 0 a 1 de un elemento que cruza la pantalla (0: asoma abajo, 1: sale arriba). */
export declare function avanceEnPantalla(el: Element): number;
/** Avance de 0 a 1 dentro de una sección alta con contenido fijo (sticky): 0 al entrar, 1 al terminar de recorrerla. */
export declare function avanceRecorrido(el: Element): number;
/** Estilo del lienzo: ocupa su contenedor. */
export declare const ESTILO_LIENZO: {
    readonly width: "100%";
    readonly height: "100%";
    readonly display: "block";
};
/** Textura con texto dibujado en canvas 2D (para etiquetas y fondos de escena). */
export declare function texturaTexto(dibujar: (ctx: CanvasRenderingContext2D, ancho: number, alto: number) => void, ancho?: number, alto?: number): THREE.CanvasTexture<HTMLCanvasElement>;
/** Fuente display de la línea, para dibujar texto en texturas. */
export declare function fuenteDisplay(el: Element): string;
