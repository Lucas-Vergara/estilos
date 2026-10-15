/**
 * Cambia de página detrás de un telón (al estilo de Dennis Snellenberg): el telón sube cubriendo la pantalla con el
 * nombre de la página de destino, se hace el cambio y el telón sigue de largo hacia arriba.
 * Requiere <Telon /> montado una vez. Sin <Telon /> o con movimiento reducido, cambia de inmediato.
 */
export declare function irCon(etiqueta: string, cambiar: () => void): void;
export declare function Telon(): import("react").JSX.Element;
