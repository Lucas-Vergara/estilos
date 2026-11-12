import { type CSSProperties } from "react";
/**
 * Aviso que rebota por la pantalla como el logo del DVD, cambiando de color en cada choque. Pensado como broma o
 * recordatorio imposible de ignorar (nació como «Contacta a Lucas» en el monitor de precios, nov. 2026).
 *
 * - No bloquea nada: va sobre todo con `pointer-events: none` y `aria-hidden`.
 * - Se quita pasando al tema oscuro y volviendo al claro (el truco que hay que descubrir), o con `quitarCon="nunca"`
 *   se queda hasta que el proyecto lo saque. Al quitarse queda guardado en el navegador (`clave`).
 * - Con «reducir movimiento» no rebota: queda quieto abajo a la izquierda.
 * - Trae sus estilos en línea: sirve en cualquier línea (panel, sitio, luz…) sin importar CSS.
 */
export interface PropsAvisoRebote {
    /** El texto del aviso, p. ej. «Contacta a Lucas». */
    texto: string;
    /** Clave de localStorage donde queda guardado que ya se quitó. Cámbiala para volver a mostrarlo. */
    clave?: string;
    /** Cómo se quita: con el tema (oscuro y luego claro) o nunca. */
    quitarCon?: "tema" | "nunca";
    /** Velocidad en px por segundo. */
    velocidad?: number;
    /** Colores de fondo, uno por choque (texto blanco). */
    colores?: string[];
    /** Estilos extra del cuadro (tamaño de letra, radio…). */
    estilo?: CSSProperties;
}
export declare const COLORES_REBOTE: string[];
export declare function AvisoRebote({ texto, clave, quitarCon, velocidad, colores, estilo }: PropsAvisoRebote): import("react").JSX.Element | null;
