import { useRef, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { fechaHora, haceCuanto, horasDesde } from "./fechas.js";
import type { Direccion, Orden } from "./orden.js";

// Componentes de la línea "panel". Las clases que usan están en css/base.css. Los gráficos (Recharts) están en graficos.tsx.

/** Estado sí/no/sin dato: siempre ícono + texto, nunca solo color. */
export function Estado({ valor, si = "Sí", no = "No", na = "Sin dato" }: { valor: boolean | null | undefined; si?: string; no?: string; na?: string }) {
  if (valor == null)
    return (
      <span className="estado na">
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        {na}
      </span>
    );
  return valor ? (
    <span className="estado si">
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.5l2.5 2.5 4.5-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      {si}
    </span>
  ) : (
    <span className="estado no">
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      {no}
    </span>
  );
}


/** Indicador: etiqueta con ícono, número grande, variación en chip y tendencia a todo el ancho abajo. */
export function Indicador({ etiqueta, icono, valor, variacion, detalle, tendencia }: {
  etiqueta: string;
  icono?: ReactNode;
  valor: ReactNode;
  /** Cambio contra el inicio del período (ver <Variacion>). */
  variacion?: ReactNode;
  detalle?: ReactNode;
  /** Mini gráfico al pie (ver <Sparkline fluido>). */
  tendencia?: ReactNode;
}) {
  return (
    <div className="tarjeta indicador">
      <div className="indicador-cabecera">{icono}<span>{etiqueta}</span></div>
      <div className="indicador-valor">{valor}</div>
      {(variacion || detalle) && (
        <div className="indicador-pie">
          {variacion}
          {detalle && <span className="detalle">{detalle}</span>}
        </div>
      )}
      {tendencia && <div className="indicador-tendencia">{tendencia}</div>}
    </div>
  );
}

/**
 * Cambio entre dos valores: "▼ $2.000 (−11%) vs. hace 30 días".
 * Verde si el cambio es bueno y rojo si es malo, según `subirEsBueno`; siempre con flecha, no solo color.
 */
export function Variacion({ actual, anterior, formato, texto, subirEsBueno, compacta }: {
  actual: number | null | undefined;
  anterior: number | null | undefined;
  formato: (n: number) => string;
  /** Contra qué se compara, p. ej. "vs. hace 30 días". */
  texto?: string;
  subirEsBueno: boolean;
  /** Sin el texto de referencia (para tablas); sin datos muestra "—". */
  compacta?: boolean;
}) {
  if (actual == null || anterior == null) return compacta ? <span className="muted">—</span> : null;
  const d = actual - anterior;
  const ref = !compacta && texto && <span className="variacion-ref">{texto}</span>;
  if (d === 0)
    return compacta ? <span className="variacion igual">Sin cambios</span> : <><span className="variacion igual variacion-chip">Sin cambios</span>{ref}</>;
  const rel = anterior ? Math.round((Math.abs(d) / anterior) * 1000) / 10 : null;
  const bueno = d > 0 === subirEsBueno;
  const cambio = (
    <span className={`variacion ${bueno ? "buena" : "mala"} ${compacta ? "" : "variacion-chip"}`}>
      {d > 0 ? "▲" : "▼"} {formato(Math.abs(d))}
      {rel != null && ` (${d > 0 ? "+" : "−"}${rel.toLocaleString("es-CL")}%)`}
    </span>
  );
  return compacta ? cambio : <>{cambio}{ref}</>;
}

/**
 * Qué tan reciente es el dato: verde, ámbar o rojo según `umbrales` (horas). El predeterminado [26, 72] sirve para
 * datos que se actualizan una vez al día: verde si es de la última corrida, ámbar hasta 3 días, rojo después.
 */
export function Frescura({ fecha, prefijo, chip, umbrales = [26, 72] }: {
  fecha: string | undefined;
  prefijo?: string;
  chip?: boolean;
  umbrales?: [fresco: number, atrasado: number];
}) {
  const horas = horasDesde(fecha);
  const nivel = horas < umbrales[0] ? "fresco" : horas < umbrales[1] ? "atrasado" : "viejo";
  const texto = `${prefijo ? `${prefijo} ` : ""}${haceCuanto(fecha)}`;
  return (
    <span className={`frescura ${nivel} ${chip ? "frescura-chip" : ""}`} title={fecha ? fechaHora(fecha) : undefined}>
      <i aria-hidden="true" />
      {texto}
    </span>
  );
}

/** Estado vacío con ícono, título y (opcional) explicación o acción. */
export function Vacio({ icono, titulo, texto, children, alto = 180 }: {
  icono?: ReactNode;
  titulo: string;
  texto?: ReactNode;
  children?: ReactNode;
  alto?: number;
}) {
  return (
    <div className="vacio" style={{ minHeight: alto }}>
      {icono && <span className="vacio-icono" aria-hidden="true">{icono}</span>}
      <b>{titulo}</b>
      {texto && <span className="vacio-texto">{texto}</span>}
      {children}
    </div>
  );
}

/** Ícono para descargar los datos de una tabla. */
export function BotonDescarga({ onClick, titulo = "Descargar CSV" }: { onClick: () => void; titulo?: string }) {
  return (
    <button type="button" className="boton boton-icono boton-chico" title={titulo} aria-label={titulo} onClick={onClick}>
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 2v8M4.5 6.5 8 10l3.5-3.5M2.5 13.5h11" />
      </svg>
    </button>
  );
}

// ---------- Orden de tablas ----------

/** Botón de encabezado que ordena. La columna activa va en negrita con una flecha (↑ ascendente, ↓ descendente). */
export function BotonOrden<K extends string>({ orden, clave, onOrden, dirInicial = "asc", children }: {
  orden: Orden<K>;
  clave: K;
  onOrden: (clave: K, dirInicial?: Direccion) => void;
  dirInicial?: Direccion;
  children: ReactNode;
}) {
  const activo = orden.clave === clave;
  const dir = activo ? orden.dir : dirInicial;
  return (
    <button type="button" className={`th-orden ${activo ? "activo" : ""}`} onClick={() => onOrden(clave, dirInicial)} title="Ordenar por esta columna">
      {children}
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" style={{ transform: dir === "asc" ? "rotate(180deg)" : undefined }}>
        <path d="M5 2v6M2.5 5.5L5 8l2.5-2.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function ThOrden<K extends string>({ num, ...props }: {
  orden: Orden<K>;
  clave: K;
  onOrden: (clave: K, dirInicial?: Direccion) => void;
  dirInicial?: Direccion;
  num?: boolean;
  children: ReactNode;
}) {
  const activo = props.orden.clave === props.clave;
  return (
    <th className={num ? "num" : undefined} aria-sort={activo ? (props.orden.dir === "asc" ? "ascending" : "descending") : undefined}>
      <BotonOrden {...props} />
    </th>
  );
}

// ---------- Esqueletos de carga ----------
// Bloques grises con la forma del contenido: la página no salta cuando llegan los datos.

export function Esqueleto({ ancho = "100%", alto = 12, estilo }: { ancho?: number | string; alto?: number; estilo?: CSSProperties }) {
  return <span className="esqueleto" style={{ width: ancho, height: alto, ...estilo }} aria-hidden="true" />;
}

export function EsqueletoTabla({ filas = 6, columnas = 5 }: { filas?: number; columnas?: number }) {
  const anchos = ["85%", "60%", "70%", "50%", "75%", "55%", "65%"];
  return (
    <div className="esqueleto-tabla" role="status" aria-label="Cargando">
      {Array.from({ length: filas }, (_, f) => (
        <div key={f} className="esqueleto-fila" style={{ gridTemplateColumns: `2fr repeat(${columnas - 1}, 1fr)` }}>
          {Array.from({ length: columnas }, (_, c) => <Esqueleto key={c} ancho={anchos[(f + c) % anchos.length]} />)}
        </div>
      ))}
    </div>
  );
}

export function EsqueletoGrafico({ alto = 200 }: { alto?: number }) {
  return (
    <div className="esqueleto-grafico" style={{ height: alto }} role="status" aria-label="Cargando">
      {[62, 48, 70, 55, 80, 66, 74, 58].map((h, i) => <Esqueleto key={i} alto={(alto - 24) * (h / 100)} ancho="100%" />)}
    </div>
  );
}

/** Tarjeta completa cargando: título, nota y tabla. */
export function EsqueletoTarjeta({ filas, columnas }: { filas?: number; columnas?: number }) {
  return (
    <section className="tarjeta">
      <div className="tarjeta-cabecera"><Esqueleto ancho={180} alto={18} /><Esqueleto ancho={320} alto={10} /></div>
      <EsqueletoTabla filas={filas} columnas={columnas} />
    </section>
  );
}

export function Segmentado<T extends string | number>({ opciones, valor, onChange, etiqueta, chico }: {
  opciones: { valor: T; texto: string }[];
  valor: T;
  onChange: (v: T) => void;
  etiqueta: string;
  /** Versión compacta sin etiqueta visible (la etiqueta queda para lectores de pantalla). */
  chico?: boolean;
}) {
  if (chico)
    return (
      <div className="segmentado segmentado-chico" role="group" aria-label={etiqueta}>
        {opciones.map((o) => (
          <button key={o.valor} type="button" aria-pressed={o.valor === valor} onClick={() => onChange(o.valor)}>
            {o.texto}
          </button>
        ))}
      </div>
    );
  return (
    <div className="campo">
      {etiqueta}
      <div className="segmentado" role="group" aria-label={etiqueta}>
        {opciones.map((o) => (
          <button key={o.valor} type="button" aria-pressed={o.valor === valor} onClick={() => onChange(o.valor)}>
            {o.texto}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- Pestañas ----------

export interface Pestana<T extends string> {
  id: T;
  texto: string;
  icono?: ReactNode;
}

/**
 * Pestañas reales (cambian el contenido): role="tablist" con flechas, Inicio y Fin para moverse.
 * El contenido va en <PanelPestana> con el mismo id.
 */
export function Pestanas<T extends string>({ pestanas, activa, onCambio, etiqueta, children }: {
  pestanas: Pestana<T>[];
  activa: T;
  onCambio: (id: T) => void;
  etiqueta: string;
  /** Controles a la derecha de las pestañas (p. ej. filtros). */
  children?: ReactNode;
}) {
  const refs = useRef(new Map<T, HTMLButtonElement>());
  const mover = (e: KeyboardEvent, i: number) => {
    const destino = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: pestanas.length - 1 }[e.key];
    if (destino == null) return;
    e.preventDefault();
    const p = pestanas[(destino + pestanas.length) % pestanas.length];
    onCambio(p.id);
    refs.current.get(p.id)?.focus();
  };
  return (
    <div className="barra-pestanas">
      <div className="pestanas" role="tablist" aria-label={etiqueta}>
        {pestanas.map((p, i) => (
          <button
            key={p.id}
            ref={(el) => { if (el) refs.current.set(p.id, el); }}
            type="button"
            role="tab"
            id={`pestana-${p.id}`}
            aria-selected={p.id === activa}
            aria-controls={`panel-${p.id}`}
            tabIndex={p.id === activa ? 0 : -1}
            onClick={() => onCambio(p.id)}
            onKeyDown={(e) => mover(e, i)}
          >
            {p.icono}
            {p.texto}
          </button>
        ))}
      </div>
      {children && <div className="barra-pestanas-controles">{children}</div>}
    </div>
  );
}

export function PanelPestana({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div role="tabpanel" id={`panel-${id}`} aria-labelledby={`pestana-${id}`} className="panel-pestana" key={id}>
      {children}
    </div>
  );
}
