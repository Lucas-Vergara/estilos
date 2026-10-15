export type DatosSilueta = {
    /** Trazos cerrados (atributo d de SVG): se rellenan con volumen y llevan contorno. */
    formas: string[];
    /** Trazos abiertos: solo contorno (antenas, detalles, circuitos). */
    lineas?: string[];
    /** Puntos [x, y, radio] que se dibujan como esferas del color del trazo. */
    nodos?: [number, number, number][];
    /** Índices de `formas` que aletean (alas): giran sobre el eje vertical del centro, cada lado hacia su lado. */
    aletean?: number[];
    /** Lado del cuadro de dibujo (viewBox cuadrado), por defecto 100. */
    lado?: number;
};
/**
 * Silueta en 3D a partir de trazos SVG: un logo o ícono con volumen, contorno de neón que se dibuja al aparecer
 * (y otra vez al tocarlo), alas que aletean y giro hacia el cursor. Por defecto: relleno en la tinta y contorno en el
 * destello de la paleta; se pueden indicar otros (p. ej. los de una marca).
 */
export declare function Silueta3D({ datos, colorTrazo, colorRelleno, profundidad, grosor, className, etiqueta }: {
    datos: DatosSilueta;
    colorTrazo?: string;
    colorRelleno?: string;
    profundidad?: number;
    grosor?: number;
    className?: string;
    etiqueta?: string;
}): import("react").JSX.Element;
