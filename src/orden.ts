import { useState } from "react";

// Orden de tablas: estado (columna + dirección) y función para ordenar filas. Los encabezados (BotonOrden, ThOrden) están en componentes.tsx.

export type Direccion = "asc" | "desc";
export interface Orden<K extends string> { clave: K; dir: Direccion }

/** Estado de orden: clic en la misma columna invierte la dirección; en otra, parte con la dirección propia de esa columna. */
export function useOrden<K extends string>(inicial: Orden<K>) {
  const [orden, setOrden] = useState(inicial);
  const ordenarPor = (clave: K, dirInicial: Direccion = "asc") =>
    setOrden((o) => (o.clave === clave ? { clave, dir: o.dir === "asc" ? "desc" : "asc" } : { clave, dir: dirInicial }));
  return [orden, ordenarPor] as const;
}

/** Ordena por un valor; los vacíos (null) van siempre al final. Desempata por `respaldo` si se da. */
export function ordenar<T>(filas: T[], valor: (f: T) => number | string | null | undefined, dir: Direccion, respaldo?: (a: T, b: T) => number) {
  const signo = dir === "asc" ? 1 : -1;
  return [...filas].sort((a, b) => {
    const va = valor(a), vb = valor(b);
    if (va == null || vb == null) return va == null && vb == null ? (respaldo?.(a, b) ?? 0) : va == null ? 1 : -1;
    const c = typeof va === "string" ? va.localeCompare(String(vb), "es") : va - (vb as number);
    return c * signo || (respaldo?.(a, b) ?? 0);
  });
}
