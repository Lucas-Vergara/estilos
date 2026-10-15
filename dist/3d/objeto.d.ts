export type FormaObjeto = "nudo" | "burbuja" | "anillos";
/**
 * Objeto 3D brillante que flota, gira despacio, mira hacia el cursor y rebota al tocarlo (con sonido si está
 * activado). Pensado para el hero, al lado del texto. El contenedor define el tamaño (p. ej. aspect-ratio: 1).
 */
export declare function Objeto3D({ forma, className, etiqueta }: {
    forma?: FormaObjeto;
    className?: string;
    etiqueta?: string;
}): import("react").JSX.Element;
