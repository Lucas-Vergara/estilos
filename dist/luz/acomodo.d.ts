export declare const ORDENES_LUZ: readonly ["filas", "equilibrio", "figuras", "circulo", "piedras", "sendero"];
export type OrdenLuz = (typeof ORDENES_LUZ)[number];
export declare const NOMBRES_ORDEN_LUZ: Record<OrdenLuz, string>;
export declare const NOTAS_ORDEN_LUZ: Record<OrdenLuz, string>;
/** Cuántas luces sabe acomodar: con más, se acomodan las primeras. */
export declare const MAX_LUCES = 10;
type Punto = [number, number];
export interface AcomodoLuz {
    /** Diámetro de las luces, en px */
    d: number;
    /** Centro de cada luz, en px desde la esquina del tablero */
    centros: Punto[];
}
/**
 * Dónde va cada luz en un tablero de W × H px. `etiqueta`: alto del nombre (y detalle) bajo la luz.
 * Devuelve null para "filas", que acomoda el CSS.
 */
export declare function acomodarLuces(orden: OrdenLuz, n: number, W: number, H: number, { etiqueta, maximo }?: {
    etiqueta?: number;
    maximo?: number;
}): AcomodoLuz | null;
export {};
