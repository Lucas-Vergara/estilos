import { type ReactNode } from "react";
/**
 * Marco de navegador para mostrar una captura o un video de una web (al estilo de Maxime Heckel). Los videos se
 * reproducen en silencio y en bucle solo mientras están en pantalla; con movimiento reducido quedan quietos en el
 * primer cuadro (o el póster). Sin `src`, muestra `children` (útil para maquetas) o un aviso de captura pendiente.
 */
export declare function MarcoNavegador({ url, src, tipo, poster, alt, proporcion, children }: {
    url: string;
    src?: string;
    tipo?: "imagen" | "video";
    poster?: string;
    alt?: string;
    /** Proporción del área de contenido, p. ej. "16 / 10" o "4 / 3". */
    proporcion?: string;
    children?: ReactNode;
}): import("react").JSX.Element;
export interface DatosProyecto {
    titulo: string;
    /** Una o dos frases: qué es y qué hiciste tú. */
    descripcion: string;
    rol?: string;
    anio?: string | number;
    cliente?: string;
    etiquetas?: string[];
    url?: string;
    medio: {
        url: string;
        src?: string;
        tipo?: "imagen" | "video";
        poster?: string;
        alt?: string;
        proporcion?: string;
        maqueta?: ReactNode;
    };
}
/** Un proyecto: texto a un lado y su web en un marco de navegador al otro (se alternan en la lista .s-proyectos). */
export declare function Proyecto({ p, indice }: {
    p: DatosProyecto;
    indice?: number;
}): import("react").JSX.Element;
/** Ola SVG para separar secciones (variante simple, al estilo de Rafa Conde). Toma el color del texto (currentColor). */
export declare function Ola({ invertida, className }: {
    invertida?: boolean;
    className?: string;
}): import("react").JSX.Element;
