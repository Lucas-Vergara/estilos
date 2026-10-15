export interface EnlaceNav {
    id: string;
    texto: string;
    href?: string;
}
/**
 * Navegación en píldora (al estilo de Josh Comeau): una píldora blanca marca la página actual y se desliza hacia el
 * enlace bajo el cursor; al salir vuelve a la actual. `onIr` permite cambiar de página con irCon (telón).
 */
export declare function NavPildora({ enlaces, activo, onIr, etiqueta }: {
    enlaces: EnlaceNav[];
    activo: string;
    onIr?: (enlace: EnlaceNav) => void;
    etiqueta?: string;
}): import("react").JSX.Element;
/**
 * Id de la sección que se está leyendo (la que cruza la franja central de la pantalla), para marcar el menú al hacer
 * scroll en una página de una sola pieza. Devuelve el primero de la lista mientras no hay ninguna a la vista.
 */
export declare function useSeccionActiva(ids: string[]): string;
