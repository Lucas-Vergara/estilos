/**
 * Túnel de marcos que se recorre con el scroll: la cámara avanza mientras bajas por una sección alta con el lienzo
 * fijo (contenedor con data-recorrido, ver .td-recorrido). Puede llevar etiquetas que aparecen a los lados.
 * Sin data-recorrido avanza solo.
 */
export declare function Tunel3D({ etiquetas, className, etiqueta }: {
    etiquetas?: string[];
    className?: string;
    etiqueta?: string;
}): import("react").JSX.Element;
