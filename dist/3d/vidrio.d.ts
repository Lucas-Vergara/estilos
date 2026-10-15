export type FormaVidrio = "prisma" | "lente" | "nudo";
/**
 * Pieza de vidrio que refracta un texto grande puesto detrás (dentro de la escena), con un leve arcoíris en los bordes.
 * Gira despacio y se inclina hacia el cursor.
 */
export declare function Vidrio3D({ texto, forma, className, etiqueta }: {
    texto?: string;
    forma?: FormaVidrio;
    className?: string;
    etiqueta?: string;
}): import("react").JSX.Element;
