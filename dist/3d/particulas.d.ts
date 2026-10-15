export type FormaParticulas = "esfera" | "cubo" | "toro" | "ola" | "espiral";
export declare const FORMAS_PARTICULAS: FormaParticulas[];
/**
 * Nube de partículas que se transforma entre formas (esfera, cubo, toro, ola, espiral) y se aparta del cursor.
 * Controlada con `forma`; sin ella cambia sola cada pocos segundos y con cada clic.
 */
export declare function Particulas3D({ forma, cantidad, className, etiqueta }: {
    forma?: FormaParticulas;
    cantidad?: number;
    className?: string;
    etiqueta?: string;
}): import("react").JSX.Element;
