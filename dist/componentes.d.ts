import { type CSSProperties, type ReactNode } from "react";
import type { Direccion, Orden } from "./orden.js";
/** Estado sí/no/sin dato: siempre ícono + texto, nunca solo color. */
export declare function Estado({ valor, si, no, na }: {
    valor: boolean | null | undefined;
    si?: string;
    no?: string;
    na?: string;
}): import("react").JSX.Element;
/** Indicador: etiqueta con ícono, número grande, variación en chip y tendencia a todo el ancho abajo. */
export declare function Indicador({ etiqueta, icono, valor, variacion, detalle, tendencia }: {
    etiqueta: ReactNode;
    icono?: ReactNode;
    valor: ReactNode;
    /** Cambio contra el inicio del período (ver <Variacion>). */
    variacion?: ReactNode;
    detalle?: ReactNode;
    /** Mini gráfico al pie (ver <Sparkline fluido>). */
    tendencia?: ReactNode;
}): import("react").JSX.Element;
/**
 * Ayuda (i) junto a un título: la definición o la metodología aparece al pasar el cursor o al enfocarla.
 * Reemplaza las notas largas bajo los títulos; el subtítulo queda libre para decir el hallazgo.
 */
export declare function Ayuda({ texto }: {
    texto: string;
}): import("react").JSX.Element;
/** Línea de tiempo: cambios agrupados por día, con la fecha a la izquierda. `contenido` suele ser una lista. */
export declare function LineaTiempo({ dias }: {
    dias: {
        id: string;
        dia: ReactNode;
        contenido: ReactNode;
    }[];
}): import("react").JSX.Element;
/**
 * Cambio entre dos valores: "▼ $2.000 (−11%) vs. hace 30 días".
 * Verde si el cambio es bueno y rojo si es malo, según `subirEsBueno`; siempre con flecha, no solo color.
 */
export declare function Variacion({ actual, anterior, formato, texto, subirEsBueno, compacta, chipPorcentaje }: {
    actual: number | null | undefined;
    anterior: number | null | undefined;
    formato: (n: number) => string;
    /** Contra qué se compara, p. ej. "vs. hace 30 días". */
    texto?: string;
    subirEsBueno: boolean;
    /** Sin el texto de referencia (para tablas); sin datos muestra "—". */
    compacta?: boolean;
    /** El chip lleva solo el porcentaje ("▲ 10,1%") y el monto pasa al texto ("+$670 vs. 28 sept"). Para indicadores. */
    chipPorcentaje?: boolean;
}): import("react").JSX.Element | null;
/**
 * Qué tan reciente es el dato: verde, ámbar o rojo según `umbrales` (horas). El predeterminado [26, 72] sirve para
 * datos que se actualizan una vez al día: verde si es de la última corrida, ámbar hasta 3 días, rojo después.
 */
export declare function Frescura({ fecha, prefijo, chip, umbrales }: {
    fecha: string | undefined;
    prefijo?: string;
    chip?: boolean;
    umbrales?: [fresco: number, atrasado: number];
}): import("react").JSX.Element;
/** Estado vacío con ícono, título y (opcional) explicación o acción. */
export declare function Vacio({ icono, titulo, texto, children, alto }: {
    icono?: ReactNode;
    titulo: string;
    texto?: ReactNode;
    children?: ReactNode;
    alto?: number;
}): import("react").JSX.Element;
/** Ícono para descargar los datos de una tabla. */
export declare function BotonDescarga({ onClick, titulo }: {
    onClick: () => void;
    titulo?: string;
}): import("react").JSX.Element;
/** Botón de encabezado que ordena. La columna activa va en negrita con una flecha (↑ ascendente, ↓ descendente). */
export declare function BotonOrden<K extends string>({ orden, clave, onOrden, dirInicial, children }: {
    orden: Orden<K>;
    clave: K;
    onOrden: (clave: K, dirInicial?: Direccion) => void;
    dirInicial?: Direccion;
    children: ReactNode;
}): import("react").JSX.Element;
export declare function ThOrden<K extends string>({ num, ...props }: {
    orden: Orden<K>;
    clave: K;
    onOrden: (clave: K, dirInicial?: Direccion) => void;
    dirInicial?: Direccion;
    num?: boolean;
    children: ReactNode;
}): import("react").JSX.Element;
export declare function Esqueleto({ ancho, alto, estilo }: {
    ancho?: number | string;
    alto?: number;
    estilo?: CSSProperties;
}): import("react").JSX.Element;
export declare function EsqueletoTabla({ filas, columnas }: {
    filas?: number;
    columnas?: number;
}): import("react").JSX.Element;
export declare function EsqueletoGrafico({ alto }: {
    alto?: number;
}): import("react").JSX.Element;
/** Tarjeta completa cargando: título, nota y tabla. */
export declare function EsqueletoTarjeta({ filas, columnas }: {
    filas?: number;
    columnas?: number;
}): import("react").JSX.Element;
export declare function Segmentado<T extends string | number>({ opciones, valor, onChange, etiqueta, chico }: {
    opciones: {
        valor: T;
        texto: string;
    }[];
    valor: T;
    onChange: (v: T) => void;
    etiqueta: string;
    /** Versión compacta sin etiqueta visible (la etiqueta queda para lectores de pantalla). */
    chico?: boolean;
}): import("react").JSX.Element;
export interface Pestana<T extends string> {
    id: T;
    texto: string;
    icono?: ReactNode;
}
/**
 * Pestañas reales (cambian el contenido): role="tablist" con flechas, Inicio y Fin para moverse.
 * El contenido va en <PanelPestana> con el mismo id.
 */
export declare function Pestanas<T extends string>({ pestanas, activa, onCambio, etiqueta, children }: {
    pestanas: Pestana<T>[];
    activa: T;
    onCambio: (id: T) => void;
    etiqueta: string;
    /** Controles a la derecha de las pestañas (p. ej. filtros). */
    children?: ReactNode;
}): import("react").JSX.Element;
export declare function PanelPestana({ id, children }: {
    id: string;
    children: ReactNode;
}): import("react").JSX.Element;
/** Si un archivo calza con un `accept` («.xls,.csv,text/plain»): por extensión o por tipo. */
export declare function aceptaArchivo(archivo: File, accept?: string): boolean;
/**
 * Para subir un archivo: una zona donde arrastrarlo y un botón que abre el selector del sistema (el input nativo queda
 * oculto pero accesible: se enfoca con el teclado y lo leen los lectores de pantalla). Con `archivo` muestra el que se
 * eligió; con `error`, por qué no sirvió. Los que no calzan con `accept` van a `onRechazados` (o se ignoran).
 */
export declare function ElegirArchivo({ onArchivos, onRechazados, accept, multiple, deshabilitado, ocupado, titulo, detalle, textoBoton, icono, archivo, error, id, etiqueta, }: {
    onArchivos: (archivos: File[]) => void;
    onRechazados?: (archivos: File[]) => void;
    /** Igual que en el input: «.xls,.csv,text/plain». */
    accept?: string;
    multiple?: boolean;
    deshabilitado?: boolean;
    /** Mientras se lee o se sube: muestra el texto en el botón y no deja elegir otro. */
    ocupado?: string | false;
    titulo?: ReactNode;
    /** Qué archivo se espera (de dónde sale, formato). */
    detalle?: ReactNode;
    textoBoton?: string;
    icono?: ReactNode;
    /** El archivo elegido: nombre y, opcionalmente, un detalle («1.284 pesajes · 1 al 31 de octubre»). */
    archivo?: {
        nombre: string;
        detalle?: ReactNode;
    } | null;
    error?: ReactNode;
    id?: string;
    /** Nombre accesible del selector (si el título no lo dice). */
    etiqueta?: string;
}): import("react").JSX.Element;
