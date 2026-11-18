export declare const ENCENDIDOS_LUZ: readonly ["destello", "pulsos", "carga", "completa"];
export type EncendidoLuz = (typeof ENCENDIDOS_LUZ)[number];
export declare const NOMBRES_ENCENDIDO_LUZ: Record<EncendidoLuz, string>;
export declare const NOTAS_ENCENDIDO_LUZ: Record<EncendidoLuz, string>;
/** Cuánto dura cada encendido, en ms: lo que la luz queda con .l-destellando. */
export declare const DURACION_ENCENDIDO_LUZ: Record<EncendidoLuz, number>;
