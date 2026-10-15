export type TarjetaCarrusel = {
    titulo: string;
    detalle?: string;
    imagen?: string;
};
export type EjeCarrusel = "vertical" | "horizontal";
/**
 * Carrusel cilíndrico: tarjetas en círculo que se arrastran con el mouse o el dedo y siguen con inercia.
 * Las tarjetas pueden ser texto (dibujado con la fuente de la línea) o una imagen.
 *
 *  - eje "vertical" (por defecto): el cilindro gira hacia los lados, como un carrusel.
 *  - eje "horizontal": gira hacia arriba y abajo, como una rueda (p. ej. una tienda con la ficha al lado).
 *  - Con `ajustar`, al soltar se detiene con una tarjeta al frente; `onActivo` avisa cuál, y `activo` la lleva al
 *    frente desde afuera (una lista, flechas). `rueda` hace girar con la rueda del mouse sobre el lienzo.
 *    Tocar una tarjeta la trae al frente.
 */
export declare function Carrusel3D({ tarjetas, eje, proporcion, autoGiro, ajustar, rueda, activo, onActivo, className, etiqueta, }: {
    tarjetas: TarjetaCarrusel[];
    eje?: EjeCarrusel; /** ancho / alto de cada tarjeta */
    proporcion?: number;
    autoGiro?: boolean;
    ajustar?: boolean;
    rueda?: boolean;
    activo?: number;
    onActivo?: (i: number) => void;
    className?: string;
    etiqueta?: string;
}): import("react").JSX.Element;
