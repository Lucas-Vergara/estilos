/**
 * Avatar circular con anillo y una burbuja de saludo que se mueve al pasar el cursor (al estilo de Josh Comeau y
 * Robb Owen). Sin foto muestra las iniciales sobre un degradado del acento.
 */
export declare function Avatar({ src, alt, iniciales, tamano, saludo }: {
    src?: string;
    alt?: string;
    iniciales?: string;
    tamano?: number;
    /** Texto corto de la burbuja (2 a 4 letras); vacío para ocultarla. */
    saludo?: string;
}): import("react").JSX.Element;
