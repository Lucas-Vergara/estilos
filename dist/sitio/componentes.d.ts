type Prefijo = "s" | "sd";
/** Texto con las palabras entre *asteriscos* destacadas con la clase acento de la línea (.s-acento / .sd-acento). */
export declare function Acento({ texto, prefijo }: {
    texto: string;
    prefijo?: Prefijo;
}): import("react").JSX.Element;
/**
 * Divide un texto en palabras animables ([data-w]) para el movimiento de scroll: "stagger" entran escalonadas al
 * aparecer; "scroll" se encienden con el avance. "*con carácter*" va en itálica acento como un solo bloque.
 */
export declare function Palabras({ texto, modo, como: Etiqueta, className, prefijo }: {
    texto: string;
    modo: "stagger" | "scroll";
    como?: "h1" | "h2" | "h3" | "p";
    className?: string;
    prefijo?: Prefijo;
}): import("react").JSX.Element;
/**
 * Cursor propio (solo escritorio con mouse): un punto acento que sigue al puntero y se agranda con una etiqueta sobre
 * los elementos con data-cursor="Ver". No reemplaza el cursor del sistema, así nada deja de funcionar.
 */
export declare function Cursor({ prefijo }: {
    prefijo?: Prefijo;
}): import("react").JSX.Element;
/**
 * Navega con una transición de página (View Transitions) si el navegador la soporta y el usuario no pidió menos
 * movimiento. El estilo lo elige <html data-transicion="fundido|telon">.
 */
export declare function conTransicion(cambiar: () => void): void;
export {};
