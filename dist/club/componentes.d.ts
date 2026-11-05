import { type ReactNode, type RefObject } from "react";
/** Indicador de pasos de un formulario: 1 Tus datos · 2 … · 3 Confirma. `actual` parte en 0. */
export declare function IndicadorPasos({ pasos, actual, etiqueta }: {
    pasos: string[];
    actual: number;
    etiqueta?: string;
}): import("react").JSX.Element;
/** Marco de celular con la barra de la app de miembros y la barra de pestañas de abajo. */
export declare function Telefono({ marca, sub, inicial, pestanas, activa, children }: {
    marca: string;
    sub?: string;
    inicial?: string;
    pestanas?: string[];
    activa?: number;
    children: ReactNode;
}): import("react").JSX.Element;
/**
 * Sección fija que avanza con el scroll: la sección mide `n` pantallas de alto y su contenido queda pegado (.c-app-fija).
 * Devuelve el índice activo y una función que hace scroll hasta el tramo de un índice (para los botones de la lista).
 */
export declare function useProgresoFijo(ref: RefObject<HTMLElement | null>, n: number): [number, (i: number) => void];
