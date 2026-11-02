export declare const FONDOS_LUZ: readonly ["papel", "piscina", "piscina-tarde", "estanque", "reflejo", "gotas", "amanecer", "niebla", "aurora", "respiracion", "hora", "madera", "arena", "washi"];
export type FondoLuz = (typeof FONDOS_LUZ)[number];
export declare const NOMBRES_FONDO_LUZ: Record<FondoLuz, string>;
/** Pinta en `capa`. `luces` devuelve dónde están las luces (la arena las rodea). Devuelve la limpieza. */
export type Pintor = (capa: HTMLElement, luces: () => DOMRect[]) => () => void;
/** Los dos colores (arriba y abajo) del fondo "hora" a una hora del día (0 a 24). */
export declare function coloresDeLaHora(h: number): [string, string];
/** Cómo se pinta cada fondo. "papel" no pinta nada: es el fondo de la línea. */
export declare const PINTORES_FONDO_LUZ: Record<FondoLuz, Pintor | null>;
