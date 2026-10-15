export type ModoFondo = "manchas" | "malla" | "ondas";
/**
 * Fondo animado en un <canvas> detrás de una sección con position: relative (clase .s-fondo-vivo):
 *  - "manchas": manchas de color difusas que flotan despacio (al estilo de Cassie Evans).
 *  - "malla":   grilla de puntos que se agrandan y toman color cerca del cursor.
 *  - "ondas":   líneas horizontales que ondulan como un campo (al estilo de Keita Yamada).
 * Toma los colores de la línea (--s-acento, --s-destello, --s-tinta). Se pausa fuera de pantalla o con la pestaña
 * oculta; con movimiento reducido dibuja un solo cuadro quieto.
 */
export declare function FondoAnimado({ modo, desvanecer, className }: {
    modo?: ModoFondo;
    desvanecer?: boolean;
    className?: string;
}): import("react").JSX.Element;
