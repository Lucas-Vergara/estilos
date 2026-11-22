type Tema = "light" | "dark";
/**
 * Botón claro/oscuro, independiente del sistema. El claro es el predeterminado; la línea consola usa
 * `predeterminado="dark"` con su propia `clave` (y el script de index.html que aplica el tema antes de pintar).
 */
export declare function BotonTema({ predeterminado, clave, className, tamano }?: {
    predeterminado?: Tema;
    /** Clave en localStorage. */
    clave?: string;
    className?: string;
    tamano?: number;
}): import("react").JSX.Element;
export {};
