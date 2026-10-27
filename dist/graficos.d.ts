import { type ReactNode } from "react";
/** Mini gráfico de línea sin ejes, para mostrar la tendencia junto a un número. */
export declare function Sparkline({ valores, color, escalonado, ancho, alto, etiqueta, fluido }: {
    valores: (number | null)[];
    color?: string;
    escalonado?: boolean;
    ancho?: number;
    alto?: number;
    /** Texto para lectores de pantalla. */
    etiqueta?: string;
    /** Ocupa todo el ancho disponible, con un relleno suave bajo la línea (indicadores). */
    fluido?: boolean;
}): import("react").JSX.Element;
export interface Serie {
    clave: string;
    nombre: string;
    color: string;
    /** Línea de referencia (p. ej. el promedio de la región): delgada y discontinua, detrás de las demás. */
    referencia?: boolean;
}
/** En los datos, `${clave}${SIN_RESPALDO}: true` marca un punto sin respaldo (p. ej. un precio antiguo); el tooltip lo indica. */
export declare const SIN_RESPALDO = "__sinRespaldo";
interface PropsLinea {
    titulo: ReactNode;
    nota?: ReactNode;
    /** Controles a la derecha del título. */
    acciones?: ReactNode;
    alto?: number;
    datos: Record<string, unknown>[];
    series: Serie[];
    formato: (n: number) => string;
    formatoEje?: (n: number) => string;
    cargando?: boolean;
    /** Para conteos: el eje parte en 0 (evita exagerar variaciones pequeñas). */
    desdeCero?: boolean;
    /** Para valores que cambian de golpe (precios): línea escalonada en vez de curva. */
    escalonado?: boolean;
    /** Title de los valores marcados con SIN_RESPALDO. */
    textoSinRespaldo?: string;
    /** La cifra de hoy bajo el título (que pasa a etiqueta), p. ej. "36.806" con su variación. */
    cifra?: ReactNode;
    /** Tope real del valor (p. ej. 72 tiendas): línea discontinua con su etiqueta; el eje llega al menos hasta ahí. */
    tope?: {
        valor: number;
        etiqueta: string;
    };
    /** Relleno en degradado bajo la primera serie (para una sola serie). */
    area?: boolean;
    /** Punto y valor al final de cada serie (no de las referencias), en vez de buscarlo en el eje. */
    etiquetaFinal?: boolean;
    /** Cantidad de marcas del eje Y (por defecto 5). */
    marcas?: number;
}
export declare function GraficoLinea({ titulo, nota, acciones, alto, datos, series, formato, formatoEje, cargando, desdeCero, escalonado, textoSinRespaldo, cifra, tope, area, etiquetaFinal, marcas }: PropsLinea): import("react").JSX.Element;
export interface BarraDato {
    /** Identificador estable (p. ej. el nombre completo de la región). */
    id: string;
    /** Texto corto bajo la barra. */
    etiqueta: string;
    valor: number;
    /** Líneas extra del tooltip, p. ej. "Mín – máx: …". */
    detalle?: string[];
    /** Nombre completo para el tooltip (por defecto, la etiqueta). */
    nombre?: string;
}
interface PropsBarras {
    titulo: ReactNode;
    nota?: string;
    /** En el orden en que se dibujan, de izquierda a derecha. */
    datos: BarraDato[];
    nombreValor: string;
    formato: (n: number) => string;
    /** Barra resaltada (el resto se atenúa). */
    resaltado?: string;
    onClickBarra?: (id: string) => void;
    /** Controles a la derecha del título. */
    acciones?: ReactNode;
    /** Texto de ayuda al pie del tooltip, p. ej. qué hace el clic. */
    pista?: string;
    cargando?: boolean;
    alto?: number;
    /** Explicación cuando no hay datos. */
    textoVacio?: string;
    /** Solo la barra más alta va en el color pleno; el resto, más suave. Se ignora si hay `resaltado`. */
    destacarMaximo?: boolean;
}
export declare function GraficoBarras({ titulo, nota, datos, nombreValor, formato, resaltado, onClickBarra, acciones, pista, cargando, alto, textoVacio, destacarMaximo }: PropsBarras): import("react").JSX.Element;
export interface PuntoBanda {
    fecha: string;
    min: number | null;
    max: number | null;
    /** Valor de la línea (p. ej. precio típico). */
    linea: number | null;
    /** Si en este punto cambió la línea: cuánto (con signo). Se dibuja una marca. */
    cambio?: number | null;
}
/** Evolución de un rango (banda mín–máx) con una línea dentro y marcas donde la línea cambia. */
export declare function GraficoBanda({ titulo, nota, acciones, datos, nombres, formato, cargando, alto }: {
    titulo: ReactNode;
    nota?: ReactNode;
    /** Controles a la derecha del título. */
    acciones?: ReactNode;
    datos: PuntoBanda[];
    nombres: {
        min: string;
        max: string;
        linea: string;
    };
    formato: (n: number) => string;
    cargando?: boolean;
    alto?: number;
}): import("react").JSX.Element;
export {};
