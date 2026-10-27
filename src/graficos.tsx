import { useId, useState, type ReactNode } from "react";
import { Area, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Line, LineChart, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { EsqueletoGrafico, Vacio } from "./componentes.js";
import { diaCorto } from "./fechas.js";

// Gráficos con Recharts, coloreados con las variables CSS (--serie-1, --grilla, --eje…): siguen el acento y el modo oscuro.

const IconoLinea = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="m19 9-5 5-4-4-3 3" />
  </svg>
);
const IconoBarras = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
  </svg>
);

/** Mini gráfico de línea sin ejes, para mostrar la tendencia junto a un número. */
export function Sparkline({ valores, color = "var(--serie-1)", escalonado, ancho = 96, alto = 32, etiqueta, fluido }: {
  valores: (number | null)[];
  color?: string;
  escalonado?: boolean;
  ancho?: number;
  alto?: number;
  /** Texto para lectores de pantalla. */
  etiqueta?: string;
  /** Ocupa todo el ancho disponible, con un relleno suave bajo la línea (indicadores). */
  fluido?: boolean;
}) {
  const id = useId();
  const datos = valores.map((v, i) => ({ i, v }));
  const ultimo = datos.findLast((d) => d.v != null);
  if (valores.filter((v) => v != null).length < 2)
    return fluido ? <div style={{ height: alto }} /> : <span className="muted" style={{ display: "inline-block", width: ancho }}>—</span>;
  if (fluido)
    return (
      <div style={{ height: alto }} role="img" aria-label={etiqueta}>
        <ResponsiveContainer width="100%" height={alto}>
          <ComposedChart data={datos} margin={{ top: 5, right: 5, bottom: 1, left: 1 }}>
            {/* Relleno en degradado y punto en el último valor: la cifra de hoy queda anclada a su historia */}
            <defs>
              <linearGradient id={`spark${id}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor={color} stopOpacity={0.18} />
                <stop offset="1" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis hide domain={["dataMin", "dataMax"]} />
            <XAxis hide dataKey="i" type="number" domain={["dataMin", "dataMax"]} />
            <Area dataKey="v" type={escalonado ? "stepAfter" : "monotone"} fill={`url(#spark${id})`} stroke="none" connectNulls isAnimationActive={false} />
            <Line dataKey="v" type={escalonado ? "stepAfter" : "monotone"} stroke={color} strokeWidth={2} dot={false} connectNulls isAnimationActive={false} />
            {ultimo && <ReferenceDot x={ultimo.i} y={ultimo.v!} r={3.5} fill={color} stroke="var(--superficie)" strokeWidth={1.5} />}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  return (
    <div style={{ width: ancho, height: alto }} role="img" aria-label={etiqueta}>
      <LineChart width={ancho} height={alto} data={datos} margin={{ top: 3, right: 2, bottom: 3, left: 2 }}>
        <YAxis hide domain={["dataMin", "dataMax"]} />
        <Line dataKey="v" type={escalonado ? "stepAfter" : "monotone"} stroke={color} strokeWidth={1.6} dot={false} connectNulls isAnimationActive={false} />
      </LineChart>
    </div>
  );
}

// ---------- Gráfico de líneas ----------

export interface Serie {
  clave: string;
  nombre: string;
  color: string; // variable CSS, p. ej. "var(--serie-1)"
  /** Línea de referencia (p. ej. el promedio de la región): delgada y discontinua, detrás de las demás. */
  referencia?: boolean;
}

/** En los datos, `${clave}${SIN_RESPALDO}: true` marca un punto sin respaldo (p. ej. un precio antiguo); el tooltip lo indica. */
export const SIN_RESPALDO = "__sinRespaldo";

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
  tope?: { valor: number; etiqueta: string };
  /** Relleno en degradado bajo la primera serie (para una sola serie). */
  area?: boolean;
  /** Punto y valor al final de cada serie (no de las referencias), en vez de buscarlo en el eje. */
  etiquetaFinal?: boolean;
  /** Cantidad de marcas del eje Y (por defecto 5). */
  marcas?: number;
}

function TooltipLinea({ active, payload, label, series, formato, textoSinRespaldo }: {
  active?: boolean;
  payload?: { dataKey: string; value: number | null; payload?: Record<string, unknown> }[];
  label?: string;
  series: Serie[];
  formato: (n: number) => string;
  textoSinRespaldo: string;
}) {
  if (!active || !payload?.length || !label) return null;
  return (
    <div className="tooltip">
      <div className="t-fecha">{diaCorto(label)}</div>
      {series.map((s) => {
        const v = payload.find((p) => p.dataKey === s.clave)?.value;
        const sinRespaldo = payload[0]?.payload?.[`${s.clave}${SIN_RESPALDO}`] === true;
        return (
          <div className="t-fila" key={s.clave}>
            <span><i style={{ background: s.color, opacity: s.referencia ? 0.6 : 1 }} />{s.nombre}</span>
            <b className={sinRespaldo ? "sin-respaldo" : undefined} title={sinRespaldo ? textoSinRespaldo : undefined}>{v == null ? "—" : formato(v)}</b>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Eje Y "redondo" que no parte en 0: margen arriba y abajo (ninguna línea queda pegada a un borde) y marcas en
 * múltiplos de 1, 2, 2,5 o 5 × 10^n, p. ej. $10.000 · $10.500 · $11.000.
 */
function escalaRedonda(datos: Record<string, unknown>[], claves: string[], marcas = 5) {
  const valores = datos.flatMap((d) => claves.map((k) => d[k])).filter((v): v is number => typeof v === "number");
  if (!valores.length) return undefined;
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const rango = max - min || Math.abs(max) * 0.05 || 1;
  const crudo = (rango * 1.3) / (marcas - 1);
  const potencia = 10 ** Math.floor(Math.log10(crudo));
  const paso = ([1, 2, 2.5, 5, 10].find((m) => m * potencia >= crudo) ?? 10) * potencia;
  const desde = Math.floor((min - rango * 0.15) / paso) * paso;
  const hasta = Math.ceil((max + rango * 0.15) / paso) * paso;
  const ticks: number[] = [];
  for (let v = desde; v <= hasta + paso / 2; v += paso) ticks.push(Math.round(v));
  return { ticks };
}

export function GraficoLinea({ titulo, nota, acciones, alto = 200, datos, series, formato, formatoEje, cargando, desdeCero, escalonado, textoSinRespaldo = "Dato sin respaldo", cifra, tope, area, etiquetaFinal, marcas = 5 }: PropsLinea) {
  const id = useId();
  const unSoloPunto = datos.length === 1;
  const escala = desdeCero ? undefined : escalaRedonda(datos, series.map((s) => s.clave), marcas);
  const ultimoIndice = (clave: string) => datos.findLastIndex((d) => typeof d[clave] === "number");
  return (
    <figure className={`grafico ${cifra != null ? "con-cifra" : ""} ${cargando && datos.length ? "cargando-suave" : ""}`} style={{ margin: 0 }}>
      <div className="grafico-cabecera"><h3>{titulo}</h3>{acciones}</div>
      {cifra != null && <div className="grafico-cifra">{cifra}</div>}
      {nota && <div className="nota">{nota}</div>}
      {series.length > 1 && (
        <div className="leyenda">
          {series.map((s) => (
            <span key={s.clave}><i className={s.referencia ? "leyenda-referencia" : undefined} style={{ background: s.referencia ? undefined : s.color, color: s.color }} />{s.nombre}</span>
          ))}
        </div>
      )}
      {datos.length === 0 ? (
        cargando ? <EsqueletoGrafico /> : <Vacio icono={<IconoLinea />} titulo="Sin datos en este período" texto="Prueba con un período más largo." />
      ) : (
        <ResponsiveContainer width="100%" height={alto}>
          <ComposedChart data={datos} margin={{ top: 8, right: etiquetaFinal || tope ? 64 : 12, bottom: 0, left: 0 }}>
            {area && (
              <defs>
                <linearGradient id={`area${id}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor={series[0]?.color} stopOpacity={0.16} />
                  <stop offset="1" stopColor={series[0]?.color} stopOpacity={0} />
                </linearGradient>
              </defs>
            )}
            {/* Grilla punteada y liviana: guía sin competir con las líneas */}
            <CartesianGrid stroke="var(--grilla)" strokeDasharray="2 4" vertical={false} />
            <XAxis
              dataKey="fecha"
              tickFormatter={diaCorto}
              stroke="var(--eje)"
              tick={{ fill: "var(--tinta-3)", fontSize: 12 }}
              tickLine={false}
              minTickGap={24}
            />
            <YAxis
              tickFormatter={formatoEje ?? formato}
              stroke="var(--eje)"
              tick={{ fill: "var(--tinta-3)", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={72}
              domain={escala ? [escala.ticks[0], escala.ticks.at(-1)!] : [0, tope ? (max: number) => Math.max(max, tope.valor) : "auto"]}
              ticks={escala?.ticks}
              tickCount={escala ? undefined : marcas}
              allowDecimals={false}
            />
            {tope && (
              <ReferenceLine
                y={tope.valor}
                stroke="var(--eje)"
                strokeDasharray="4 4"
                label={{ value: tope.etiqueta, position: "right", fill: "var(--tinta-3)", fontSize: 11 }}
              />
            )}
            {area && series[0] && (
              <Area dataKey={series[0].clave} type={escalonado ? "stepAfter" : "monotone"} fill={`url(#area${id})`} stroke="none" connectNulls isAnimationActive={false} tooltipType="none" activeDot={false} />
            )}
            <Tooltip
              cursor={{ stroke: "var(--eje)", strokeWidth: 1 }}
              content={<TooltipLinea series={series} formato={formato} textoSinRespaldo={textoSinRespaldo} />}
              isAnimationActive={false}
            />
            {/* Las referencias se dibujan primero, para que queden detrás */}
            {[...series].sort((a, b) => Number(!!b.referencia) - Number(!!a.referencia)).map((s) => (
              <Line
                key={s.clave}
                type={escalonado ? "stepAfter" : "monotone"}
                dataKey={s.clave}
                name={s.nombre}
                stroke={s.color}
                strokeWidth={s.referencia ? 1.5 : 2}
                strokeDasharray={s.referencia ? "5 4" : undefined}
                strokeLinecap="round"
                strokeLinejoin="round"
                // Con pocos puntos se muestran marcadores; con muchos, solo al pasar el cursor (y el último, con etiquetaFinal).
                dot={
                  !s.referencia && (unSoloPunto || datos.length < 8)
                    ? { r: 4, fill: s.color, stroke: "var(--superficie)", strokeWidth: 2 }
                    : etiquetaFinal && !s.referencia
                      ? (p: { cx?: number; cy?: number; index?: number; value?: number }) =>
                          p.index === ultimoIndice(s.clave) && p.cx != null && p.cy != null ? (
                            <g key={`fin-${s.clave}`}>
                              <circle cx={p.cx} cy={p.cy} r={7} fill={s.color} opacity={0.18} />
                              <circle cx={p.cx} cy={p.cy} r={3.5} fill={s.color} stroke="var(--superficie)" strokeWidth={1.5} />
                              <text x={p.cx + 10} y={p.cy + 4} fill="var(--tinta)" fontSize={12} fontWeight={650} style={{ fontVariantNumeric: "tabular-nums" }}>
                                {typeof p.value === "number" ? formato(p.value) : ""}
                              </text>
                            </g>
                          ) : <g key={`p-${s.clave}-${p.index}`} />
                      : false
                }
                activeDot={s.referencia ? { r: 3, fill: s.color, stroke: "none" } : { r: 5, fill: s.color, stroke: "var(--superficie)", strokeWidth: 2 }}
                connectNulls
                isAnimationActive={false}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </figure>
  );
}

// ---------- Gráfico de barras ----------

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

function TooltipBarras({ active, payload, nombreValor, formato, pista }: {
  active?: boolean;
  payload?: { payload: BarraDato }[];
  nombreValor: string;
  formato: (n: number) => string;
  pista?: string;
}) {
  const d = payload?.[0]?.payload;
  if (!active || !d) return null;
  return (
    <div className="tooltip">
      <div className="t-fecha">{d.nombre ?? d.etiqueta}</div>
      <div className="t-fila"><span><i style={{ background: "var(--serie-1)" }} />{nombreValor}</span><b>{formato(d.valor)}</b></div>
      {d.detalle?.map((l) => <div className="t-fila" key={l}><span>{l}</span></div>)}
      {pista && <div className="t-pista">{pista}</div>}
    </div>
  );
}

export function GraficoBarras({ titulo, nota, datos, nombreValor, formato, resaltado, onClickBarra, acciones, pista, cargando, alto = 200, textoVacio = "No hay datos para mostrar.", destacarMaximo }: PropsBarras) {
  const maximo = Math.max(...datos.map((d) => d.valor));
  // Barra bajo el cursor y altura del cursor: el tooltip va siempre debajo del puntero, sin tapar las barras.
  const [hover, setHover] = useState<{ indice: number; y: number } | null>(null);
  // Si las barras quedan angostas, las etiquetas alternan en dos alturas para no pisarse
  const [ancho, setAncho] = useState(0);
  const escalonar = ancho > 0 && (ancho - 84) / Math.max(1, datos.length) < 26;
  return (
    <figure className={`grafico ${cargando && datos.length ? "cargando-suave" : ""}`} style={{ margin: 0 }}>
      <div className="grafico-cabecera"><h3>{titulo}</h3>{acciones}</div>
      {nota && <div className="nota">{nota}</div>}
      {datos.length === 0 ? (
        cargando ? <EsqueletoGrafico alto={alto} /> : <Vacio icono={<IconoBarras />} titulo="Sin datos" texto={textoVacio} />
      ) : (
        <ResponsiveContainer width="100%" height={alto} onResize={(w) => setAncho(w)}>
          <BarChart
            data={datos}
            margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
            barCategoryGap="28%"
            onMouseMove={(estado, evento) => {
              const indice = Number(estado.activeTooltipIndex);
              const caja = (evento.currentTarget as Element | null)?.getBoundingClientRect();
              setHover(Number.isInteger(indice) && caja ? { indice, y: evento.clientY - caja.top } : null);
            }}
            onMouseLeave={() => setHover(null)}
          >
            <CartesianGrid stroke="var(--grilla)" vertical={false} />
            <XAxis
              dataKey="etiqueta"
              stroke="var(--eje)"
              tick={({ x, y, payload, index }) => (
                <text x={x} y={Number(y) + (escalonar && index % 2 ? 13 : 0)} dy={12} textAnchor="middle" fill="var(--tinta-3)" fontSize={11}>
                  {payload.value}
                </text>
              )}
              tickLine={false}
              interval={0}
              height={escalonar ? 42 : 30}
            />
            <YAxis
              tickFormatter={formato}
              stroke="var(--eje)"
              tick={{ fill: "var(--tinta-3)", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={72}
              domain={[0, "auto"]}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: "var(--grilla)", opacity: 0.5 }}
              content={<TooltipBarras nombreValor={nombreValor} formato={formato} pista={pista} />}
              position={hover ? { y: hover.y + 18 } : undefined}
              allowEscapeViewBox={{ x: false, y: true }}
              wrapperStyle={{ zIndex: 10 }}
              isAnimationActive={false}
            />
            <Bar
              dataKey="valor"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
              style={onClickBarra ? { cursor: "pointer" } : undefined}
              onClick={(d) => onClickBarra?.((d as unknown as BarraDato).id)}
            >
              {datos.map((d, i) => (
                <Cell
                  key={d.id}
                  fill="var(--serie-1)"
                  fillOpacity={resaltado ? (resaltado === d.id ? 1 : 0.35) : destacarMaximo && d.valor < maximo ? 0.6 : 1}
                  className={`barra ${hover?.indice === i ? "activa" : ""}`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </figure>
  );
}

// ---------- Gráfico de banda (rango mín–máx + línea + marcas) ----------

export interface PuntoBanda {
  fecha: string;
  min: number | null;
  max: number | null;
  /** Valor de la línea (p. ej. precio típico). */
  linea: number | null;
  /** Si en este punto cambió la línea: cuánto (con signo). Se dibuja una marca. */
  cambio?: number | null;
}

function TooltipBanda({ active, payload, label, nombres, formato }: {
  active?: boolean;
  payload?: { payload: PuntoBanda }[];
  label?: string;
  nombres: { min: string; max: string; linea: string };
  formato: (n: number) => string;
}) {
  const d = payload?.[0]?.payload;
  if (!active || !d || !label) return null;
  const fila = (nombre: string, v: number | null, marca?: ReactNode) => (
    <div className="t-fila"><span>{marca}{nombre}</span><b>{v == null ? "—" : formato(v)}</b></div>
  );
  return (
    <div className="tooltip">
      <div className="t-fecha">{diaCorto(label)}</div>
      {fila(nombres.max, d.max, <i style={{ background: "var(--serie-1)", opacity: 0.3 }} />)}
      {fila(nombres.linea, d.linea, <i style={{ background: "var(--serie-1)" }} />)}
      {fila(nombres.min, d.min, <i style={{ background: "var(--serie-1)", opacity: 0.3 }} />)}
      {d.cambio != null && (
        <div className="t-fila t-cambio"><span><i style={{ background: "var(--serie-2)", height: 8, width: 8, borderRadius: 4 }} />Cambio</span><b>{d.cambio > 0 ? "+" : "−"}{formato(Math.abs(d.cambio))}</b></div>
      )}
    </div>
  );
}

/** Evolución de un rango (banda mín–máx) con una línea dentro y marcas donde la línea cambia. */
export function GraficoBanda({ titulo, nota, acciones, datos, nombres, formato, cargando, alto = 200 }: {
  titulo: ReactNode;
  nota?: ReactNode;
  /** Controles a la derecha del título. */
  acciones?: ReactNode;
  datos: PuntoBanda[];
  nombres: { min: string; max: string; linea: string };
  formato: (n: number) => string;
  cargando?: boolean;
  alto?: number;
}) {
  const conBanda = datos.map((d) => ({ ...d, banda: d.min != null && d.max != null ? [d.min, d.max] : null }));
  const marcas = datos.filter((d) => d.cambio != null && d.linea != null);
  return (
    <figure className={`grafico ${cargando && datos.length ? "cargando-suave" : ""}`} style={{ margin: 0 }}>
      <div className="grafico-cabecera"><h3>{titulo}</h3>{acciones}</div>
      {nota && <div className="nota">{nota}</div>}
      <div className="leyenda">
        <span><i style={{ background: "var(--serie-1)", opacity: 0.25, height: 8 }} />{nombres.min} – {nombres.max.toLowerCase()}</span>
        <span><i style={{ background: "var(--serie-1)" }} />{nombres.linea}</span>
        {marcas.length > 0 && <span><i style={{ background: "var(--serie-2)", width: 8, height: 8, borderRadius: 4 }} />Cambio</span>}
      </div>
      {datos.length === 0 ? (
        cargando ? <EsqueletoGrafico alto={alto} /> : <Vacio icono={<IconoLinea />} titulo="Sin datos en este período" texto="Prueba con un período más largo." />
      ) : (
        <ResponsiveContainer width="100%" height={alto}>
          <ComposedChart data={conBanda} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="var(--grilla)" vertical={false} />
            <XAxis dataKey="fecha" tickFormatter={diaCorto} stroke="var(--eje)" tick={{ fill: "var(--tinta-3)", fontSize: 12 }} tickLine={false} minTickGap={24} />
            <YAxis tickFormatter={formato} stroke="var(--eje)" tick={{ fill: "var(--tinta-3)", fontSize: 12 }} tickLine={false} axisLine={false} width={72} domain={["auto", "auto"]} allowDecimals={false} />
            <Tooltip cursor={{ stroke: "var(--eje)", strokeWidth: 1 }} content={<TooltipBanda nombres={nombres} formato={formato} />} isAnimationActive={false} />
            <Area dataKey="banda" type="stepAfter" fill="var(--serie-1)" fillOpacity={0.15} stroke="none" connectNulls isAnimationActive={false} activeDot={false} />
            <Line
              dataKey="linea"
              type="stepAfter"
              stroke="var(--serie-1)"
              strokeWidth={2}
              dot={datos.length < 8 ? { r: 3, fill: "var(--serie-1)", stroke: "var(--superficie)", strokeWidth: 2 } : false}
              activeDot={{ r: 5, fill: "var(--serie-1)", stroke: "var(--superficie)", strokeWidth: 2 }}
              connectNulls
              isAnimationActive={false}
            />
            {marcas.map((m) => (
              <ReferenceDot key={m.fecha} x={m.fecha} y={m.linea!} r={4.5} fill="var(--serie-2)" stroke="var(--superficie)" strokeWidth={2} />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </figure>
  );
}

