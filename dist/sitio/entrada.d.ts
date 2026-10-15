/**
 * Pantalla de entrada al sitio (al estilo de Dennis Snellenberg): saludos en varios idiomas que se suceden rápido y
 * luego la pantalla sube con el borde inferior curvo. Por defecto se muestra una vez por sesión del navegador.
 * Con movimiento reducido no aparece.
 */
export declare function Entrada({ saludos, ritmo, unaVezPorSesion, onFin }: {
    saludos?: string[];
    /** Milisegundos por saludo (el primero y el último se quedan un poco más). */
    ritmo?: number;
    unaVezPorSesion?: boolean;
    onFin?: () => void;
}): import("react").JSX.Element | null;
