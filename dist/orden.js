import { useState } from "react";
/** Estado de orden: clic en la misma columna invierte la dirección; en otra, parte con la dirección propia de esa columna. */
export function useOrden(inicial) {
    const [orden, setOrden] = useState(inicial);
    const ordenarPor = (clave, dirInicial = "asc") => setOrden((o) => (o.clave === clave ? { clave, dir: o.dir === "asc" ? "desc" : "asc" } : { clave, dir: dirInicial }));
    return [orden, ordenarPor];
}
/** Ordena por un valor; los vacíos (null) van siempre al final. Desempata por `respaldo` si se da. */
export function ordenar(filas, valor, dir, respaldo) {
    const signo = dir === "asc" ? 1 : -1;
    return [...filas].sort((a, b) => {
        const va = valor(a), vb = valor(b);
        if (va == null || vb == null)
            return va == null && vb == null ? (respaldo?.(a, b) ?? 0) : va == null ? 1 : -1;
        const c = typeof va === "string" ? va.localeCompare(String(vb), "es") : va - vb;
        return c * signo || (respaldo?.(a, b) ?? 0);
    });
}
