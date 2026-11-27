import { type ReactNode } from "react";
/**
 * Selector de la línea consola (cuadro para escribir y formularios), en reemplazo del <select> nativo, cuya lista abierta dibuja el
 * sistema y no toma el look. Botón con ícono y texto; al abrirlo, el texto pasa a ser un campo para escribir (combobox) y
 * la lista se filtra con lo escrito, sin distinguir mayúsculas ni tildes, con la parte que calza resaltada. La opción
 * elegida va marcada y cada opción puede llevar una nota. Se abre hacia arriba si abajo no cabe.
 * Teclado: flechas, Enter, Escape y Tab; escribir con el botón enfocado lo abre ya filtrando.
 * `buscar={false}` vuelve a la lista sin campo (Inicio/Fin, espacio y saltar por letra).
 */
export interface OpcionSelector<T extends string> {
    valor: T;
    texto: string;
    nota?: string;
}
export declare function Selector<T extends string>({ valor, opciones, onCambio, etiqueta, icono, tenue, titulo, campo, buscar }: {
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
    /** Campo para escribir y filtrar al abrir (por defecto sí). */
    buscar?: boolean;
}): import("react").JSX.Element;
