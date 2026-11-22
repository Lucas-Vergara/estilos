import { type ReactNode } from "react";
/**
 * Selector de la línea consola (cuadro para escribir y formularios), en reemplazo del <select> nativo, cuya lista abierta dibuja el
 * sistema y no toma el look. Botón con ícono y texto; al abrirlo, un menú con la opción elegida marcada y una nota
 * opcional por opción. Se abre hacia arriba si abajo no cabe. Teclado: flechas, Inicio/Fin, Enter o espacio y Escape;
 * escribir una letra salta a la opción que empieza con ella.
 */
export interface OpcionSelector<T extends string> {
    valor: T;
    texto: string;
    nota?: string;
}
export declare function Selector<T extends string>({ valor, opciones, onCambio, etiqueta, icono, tenue, titulo, campo }: {
    valor: T;
    opciones: readonly OpcionSelector<T>[];
    onCambio: (v: T) => void;
    /** Para lectores de pantalla («Modelo», «Permisos»…). */
    etiqueta: string;
    icono?: ReactNode;
    tenue?: boolean;
    titulo?: string;
    /** Con forma de campo de formulario (ancho completo, 36 px), en vez de botón chico del cuadro para escribir. */
    campo?: boolean;
}): import("react").JSX.Element;
