import type { CSSProperties, ReactNode } from "react";
/**
 * Módulo grilla (css: `@lucas-vergara/estilos/grilla.css`): 12 columnas en dos estilos.
 * - `editorial` (A): separación fija; el aire se arma dejando columnas vacías.
 * - `celdas` (B): sin separación, cada columna es una celda con línea fina y relleno, y una cabecera mono opcional.
 * Diseñado en Figma para franservice («Sistema de grillas y secciones»). Sin estado ni efectos: sirve en el servidor.
 */
export type VarianteGrilla = "editorial" | "celdas";
export type AlineacionGrilla = "start" | "center" | "end" | "stretch";
export declare const VARIANTES_GRILLA: readonly VarianteGrilla[];
export declare const NOMBRES_VARIANTE_GRILLA: Record<VarianteGrilla, string>;
export declare const NOTAS_VARIANTE_GRILLA: Record<VarianteGrilla, string>;
/** Columnas en celular: A cae a 4 y B a 2. */
export declare const COLUMNAS_CELULAR_GRILLA: Record<VarianteGrilla, number>;
/**
 * Ancho de celular (en 12avos) redondeado a lo que calza con la grilla de celular de la variante:
 * cuartos en A (3, 6, 9, 12) y mitades en B (6, 12). Sin valor, la celda ocupa todo el ancho.
 */
export declare function anchoCelularGrilla(variante: VarianteGrilla, ancho?: number): number;
export interface PropsGrilla {
    variante?: VarianteGrilla;
    /** A: alineación vertical de las columnas. B: dónde queda el contenido dentro de cada celda (siempre se estiran). */
    alinear?: AlineacionGrilla;
    /** Solo en B: texto mono arriba de las celdas. Con dos piezas, la segunda va a la derecha (ej. «03 / Texto + foto», «Bloque · textImage»). */
    cabecera?: ReactNode | [ReactNode, ReactNode];
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
    /** Atributos extra (p. ej. data-* de un editor visual). */
    [dato: `data-${string}`]: string | undefined;
}
export declare function Grilla({ variante, alinear, cabecera, className, style, children, ...datos }: PropsGrilla): import("react").JSX.Element;
export interface PropsCelda {
    /** Ancho en escritorio, en 12avos (por defecto 12). */
    ancho?: number;
    /** Ancho en celular, en 12avos: se redondea según la variante (ver `anchoCelularGrilla`). Por defecto, todo el ancho. */
    anchoCelular?: number;
    /** Debe ser la misma variante de su `Grilla` (para redondear el ancho de celular). */
    variante?: VarianteGrilla;
    /** En B: `false` quita el relleno, para que una foto o un video llene la celda. */
    relleno?: boolean;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
    [dato: `data-${string}`]: string | undefined;
}
export declare function Celda({ ancho, anchoCelular, variante, relleno, className, style, children, ...datos }: PropsCelda): import("react").JSX.Element;
