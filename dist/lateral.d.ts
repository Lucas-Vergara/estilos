import { type ComponentType, type ReactNode } from "react";
/**
 * Navegación lateral al estilo del "mini variant drawer" de MUI (línea panel): expandida (ícono y texto) o compacta
 * (solo íconos), con las secciones de cada grupo plegadas hasta que se abre el grupo. Un grupo de una sola sección es
 * un enlace directo, y el grupo de la página actual se marca aunque esté plegado.
 *
 * No depende de ningún enrutador: recibe la ruta actual y, si se quiere navegar sin recargar, un componente `Enlace`
 * (p. ej. un envoltorio del Link de react-router). Va dentro de `.con-lateral`, junto a `.barra.barra-app` (ver README).
 * Bajo 900 px es un panel sobre el contenido que se abre desde la barra (`abierta`).
 */
export interface SeccionLateral {
    ruta: string;
    nombre: string;
    /** Activa solo con la ruta exacta (para la primera sección de un grupo, cuya ruta es prefijo de las demás). */
    exacta?: boolean;
}
export interface GrupoLateral {
    id: string;
    nombre: string;
    icono: ReactNode;
    secciones: SeccionLateral[];
}
export interface PropsEnlaceLateral {
    href: string;
    className?: string;
    title?: string;
    "aria-label"?: string;
    "aria-current"?: "page";
    children: ReactNode;
}
/** Si la pantalla es angosta (la lateral pasa a panel), siguiendo los cambios de tamaño. */
export declare function usePantallaAngosta(): boolean;
/** Expandida o compacta, recordado en el navegador (por proyecto, con `clave`). */
export declare function useLateralCompacta(clave?: string): readonly [boolean, (v: boolean) => void];
/** El grupo que contiene la ruta actual (el de la ruta más larga que calza), o null. */
export declare function grupoDe(grupos: GrupoLateral[], actual: string): GrupoLateral | null;
export declare function NavegacionLateral({ grupos, rutaActual, compacta, onExpandir, abierta, onCerrar, Enlace, etiqueta, }: {
    grupos: GrupoLateral[];
    rutaActual: string;
    compacta: boolean;
    /** Pide pasar a expandida (al abrir un grupo desde el modo compacto). */
    onExpandir: () => void;
    /** Panel abierto en pantallas angostas. */
    abierta?: boolean;
    onCerrar?: () => void;
    Enlace?: ComponentType<PropsEnlaceLateral>;
    etiqueta?: string;
}): import("react").JSX.Element;
