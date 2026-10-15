export type EstiloSilueta = "neon" | "cromo" | "holograma";
export type DatosSilueta = {
    /** Trazos cerrados (atributo d de SVG): se rellenan con volumen y llevan contorno. */
    formas: string[];
    /** Trazos abiertos: solo contorno (antenas, detalles, circuitos). */
    lineas?: string[];
    /** Puntos [x, y, radio] que se dibujan como esferas del color del trazo. */
    nodos?: [number, number, number][];
    /** Índices de `formas` que aletean (alas): giran sobre el eje vertical del centro, cada lado hacia su lado. */
    aletean?: number[];
    /** Índices de `formas` que se mecen como cintas: cuelgan de su borde superior y oscilan. */
    ondean?: number[];
    /** Lado del cuadro de dibujo (viewBox cuadrado), por defecto 100. */
    lado?: number;
};
/**
 * Silueta en 3D a partir de trazos SVG: un logo o ícono con volumen, contorno que se dibuja al aparecer (y otra vez
 * al tocarlo), alas que aletean, cintas que se mecen y giro hacia el cursor. Tres estilos:
 *  - "neon":      relleno oscuro y contorno de neón con halo.
 *  - "cromo":     metal oscuro iridiscente con reflejos, iluminado por dos luces de color que giran.
 *  - "holograma": cuerpo translúcido con bordes que brillan, líneas de barrido y cortes de glitch.
 * Por defecto usa la tinta y el destello de la paleta (y el acento como segundo color); acepta colores propios.
 */
export declare function Silueta3D({ datos, estilo, colorTrazo, colorRelleno, colorSecundario, profundidad, grosor, aleteo, className, etiqueta }: {
    datos: DatosSilueta;
    estilo?: EstiloSilueta;
    colorTrazo?: string;
    colorRelleno?: string;
    colorSecundario?: string;
    profundidad?: number;
    grosor?: number; /** Amplitud del aleteo (1 = normal, 0.3 = suave). */
    aleteo?: number;
    className?: string;
    etiqueta?: string;
}): import("react").JSX.Element;
