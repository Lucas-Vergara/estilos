export type TarjetaCarrusel = {
    titulo: string;
    detalle?: string;
    imagen?: string;
};
/**
 * Carrusel cilíndrico: tarjetas en círculo que giran solas, se arrastran con el mouse o el dedo y siguen con
 * inercia. Las tarjetas pueden ser texto (dibujado con la fuente de la línea) o una imagen.
 */
export declare function Carrusel3D({ tarjetas, className, etiqueta }: {
    tarjetas: TarjetaCarrusel[];
    className?: string;
    etiqueta?: string;
}): import("react").JSX.Element;
