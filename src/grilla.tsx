import type { CSSProperties, ReactNode } from "react";

/**
 * Módulo grilla (css: `@lucas-vergara/estilos/grilla.css`): 12 columnas en dos estilos.
 * - `editorial` (A): separación fija; el aire se arma dejando columnas vacías.
 * - `celdas` (B): sin separación, cada columna es una celda con línea fina y relleno, y una cabecera mono opcional.
 * Diseñado en Figma para franservice («Sistema de grillas y secciones»). Sin estado ni efectos: sirve en el servidor.
 */
export type VarianteGrilla = "editorial" | "celdas";
export type AlineacionGrilla = "start" | "center" | "end" | "stretch";

export const VARIANTES_GRILLA: readonly VarianteGrilla[] = ["editorial", "celdas"];
export const NOMBRES_VARIANTE_GRILLA: Record<VarianteGrilla, string> = { editorial: "A · Editorial", celdas: "B · Celdas" };
export const NOTAS_VARIANTE_GRILLA: Record<VarianteGrilla, string> = {
  editorial: "Columnas con separación fija y mucho aire, como una revista.",
  celdas: "Celdas con línea fina y relleno, como una ficha técnica.",
};

/** Columnas en celular: A cae a 4 y B a 2. */
export const COLUMNAS_CELULAR_GRILLA: Record<VarianteGrilla, number> = { editorial: 4, celdas: 2 };

/**
 * Ancho de celular (en 12avos) redondeado a lo que calza con la grilla de celular de la variante:
 * cuartos en A (3, 6, 9, 12) y mitades en B (6, 12). Sin valor, la celda ocupa todo el ancho.
 */
export function anchoCelularGrilla(variante: VarianteGrilla, ancho?: number): number {
  if (!ancho) return 12;
  const paso = 12 / COLUMNAS_CELULAR_GRILLA[variante];
  return Math.min(12, Math.max(paso, Math.round(ancho / paso) * paso));
}

export interface PropsGrilla {
  variante?: VarianteGrilla;
  /** A: alineación vertical de las columnas. B: dónde queda el contenido dentro de cada celda (siempre se estiran). */
  alinear?: AlineacionGrilla;
  /** Solo en B: texto mono arriba de las celdas. Con dos piezas, la segunda va a la derecha (ej. «03 / Texto + foto», «Bloque · textImage»). */
  cabecera?: ReactNode | [ReactNode, ReactNode];
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  /** Atributos extra (p. ej. data-* de un editor visual). */
  [dato: `data-${string}`]: string | undefined;
}

export function Grilla({ variante = "editorial", alinear, cabecera, className, style, children, ...datos }: PropsGrilla) {
  const partes = Array.isArray(cabecera) ? cabecera : cabecera != null ? [cabecera] : [];
  return (
    <div className={`grilla grilla-${variante}${className ? ` ${className}` : ""}`} data-variante={variante} data-alinear={alinear} style={style} {...datos}>
      {variante === "celdas" && partes.length > 0 && (
        <div className="grilla-cabecera">
          {partes.map((p, i) => <span key={i}>{p}</span>)}
        </div>
      )}
      {children}
    </div>
  );
}

export interface PropsCelda {
  /** Ancho en escritorio, en 12avos (por defecto 12). */
  ancho?: number;
  /** Ancho en celular, en 12avos: se redondea según la variante (ver `anchoCelularGrilla`). Por defecto, todo el ancho. */
  anchoCelular?: number;
  /** Debe ser la misma variante de su `Grilla` (para redondear el ancho de celular). */
  variante?: VarianteGrilla;
  /** En B: `false` quita el relleno, para que una foto o un video llene la celda. */
  relleno?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  [dato: `data-${string}`]: string | undefined;
}

export function Celda({ ancho = 12, anchoCelular, variante = "editorial", relleno = true, className, style, children, ...datos }: PropsCelda) {
  const vars = { "--grilla-ancho": Math.min(12, Math.max(1, ancho)), "--grilla-ancho-celular": anchoCelularGrilla(variante, anchoCelular) } as CSSProperties;
  return (
    <div className={`grilla-celda${className ? ` ${className}` : ""}`} data-relleno={relleno ? undefined : "no"} style={{ ...vars, ...style }} {...datos}>
      {children}
    </div>
  );
}
