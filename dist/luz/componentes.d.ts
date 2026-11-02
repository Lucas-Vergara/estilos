import { type CSSProperties, type RefObject } from "react";
import { type AcomodoLuz, type OrdenLuz } from "./acomodo.js";
import { type FondoLuz } from "./fondos.js";
/**
 * Una luz: botón redondo que se enciende despacio, con un destello. Encendida basta: no lleva ✓ (el estado queda en
 * aria-pressed para los lectores de pantalla). `color` es uno de los de la línea (ambar, coral…). `tam` cambia el
 * diámetro (p. ej. "96px") y `estilo` posiciona la casilla dentro de un tablero con forma.
 */
export declare function Luz({ nombre, detalle, color, hecho, onCambiar, tam, estilo }: {
    nombre: string;
    detalle?: string;
    color: string;
    hecho: boolean;
    onCambiar: (hecho: boolean) => void;
    tam?: string;
    estilo?: CSSProperties;
}): import("react").JSX.Element;
/**
 * El fondo detrás de las luces: una capa .l-fondo (absoluta; con `fijo`, ocupa la ventana). En reposo se apaga sola.
 * `luces` dice dónde buscar las luces (la arena las rodea con surcos).
 */
export declare function CapaFondo({ fondo, fijo, luces, className }: {
    fondo: FondoLuz;
    fijo?: boolean;
    luces?: () => ParentNode | null;
    className?: string;
}): import("react").JSX.Element;
/**
 * Mide el tablero y calcula dónde va cada luz para un orden con forma. Devuelve null con "filas" (lo hace el CSS).
 * Al tablero se le pone .l-forma, y a cada casilla, `estiloDeLuz(acomodo, i)`.
 */
export declare function useAcomodoLuces(tablero: RefObject<HTMLElement | null>, orden: OrdenLuz, cantidad: number, opciones?: {
    etiqueta?: number;
    maximo?: number;
}): AcomodoLuz | null;
/** Posición y tamaño de la luz `i` dentro de un tablero .l-forma (para `tam` y `estilo` de `Luz`). */
export declare function lugarDeLuz(acomodo: AcomodoLuz | null, i: number): {
    tam?: string;
    estilo?: CSSProperties;
};
