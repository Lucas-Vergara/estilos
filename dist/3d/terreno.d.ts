export type EstiloTerreno = "puntos" | "malla";
/**
 * Paisaje que avanza hacia la cámara: colinas suaves hechas de puntos o de malla, que se levantan bajo el cursor.
 * Para el fondo de una sección o un hero.
 */
export declare function Terreno3D({ estilo, className, etiqueta }: {
    estilo?: EstiloTerreno;
    className?: string;
    etiqueta?: string;
}): import("react").JSX.Element;
