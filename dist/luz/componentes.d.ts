import { type CSSProperties, type RefObject } from "react";
import { type AcomodoLuz, type OrdenLuz } from "./acomodo.js";
import { type FondoLuz } from "./fondos.js";
import { type EncendidoLuz } from "./encendidos.js";
/**
 * Una luz: botón redondo que se enciende despacio, con un destello. Encendida basta: no lleva ✓ (el estado queda en
 * aria-pressed para los lectores de pantalla). `color` es uno de COLORES_LUZ (ambar, coral…). `tam` cambia el
 * diámetro (p. ej. "96px") y `estilo` posiciona la casilla dentro de un tablero con forma. `encendido` elige cómo se
 * prende (ENCENDIDOS_LUZ; por defecto, el destello).
 */
export declare function Luz({ nombre, detalle, color, hecho, onCambiar, tam, estilo, encendido }: {
    nombre: string;
    detalle?: string;
    color: string;
    hecho: boolean;
    onCambiar: (hecho: boolean) => void;
    tam?: string;
    estilo?: CSSProperties;
    encendido?: EncendidoLuz;
}): import("react").JSX.Element;
/** Las clases de una .l-luz según cómo se enciende y si está encendiéndose ahora (sirve para muestras sin Luz). */
export declare function claseLuz(encendido?: EncendidoLuz, destellando?: boolean): string;
/** Las capas que necesita cada encendido dentro de la .l-luz (el destello no lleva: usa ::after). */
export declare function CapasEncendido({ encendido }: {
    encendido: EncendidoLuz;
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
