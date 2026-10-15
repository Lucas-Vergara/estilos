/** "2026-10-15" → "15 oct". */
export declare const diaCorto: (fecha: string) => string;
/** Horas transcurridas desde una fecha ISO (Infinity si no hay fecha). */
export declare const horasDesde: (iso: string | undefined) => number;
/** "hace 5 minutos", "hace 3 horas", "hace 2 días". */
export declare function haceCuanto(iso: string | undefined): string;
export declare const fechaHora: (iso: string | undefined) => string;
