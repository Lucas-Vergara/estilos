export type Direccion = "asc" | "desc";
export interface Orden<K extends string> {
    clave: K;
    dir: Direccion;
}
/** Estado de orden: clic en la misma columna invierte la dirección; en otra, parte con la dirección propia de esa columna. */
export declare function useOrden<K extends string>(inicial: Orden<K>): readonly [Orden<K>, (clave: K, dirInicial?: Direccion) => void];
/** Ordena por un valor; los vacíos (null) van siempre al final. Desempata por `respaldo` si se da. */
export declare function ordenar<T>(filas: T[], valor: (f: T) => number | string | null | undefined, dir: Direccion, respaldo?: (a: T, b: T) => number): T[];
