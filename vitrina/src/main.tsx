import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BotonDescarga, BotonTema, CreditoEstilos, Esqueleto, EsqueletoTabla, Estado, Frescura, Indicador, PanelPestana, Pestanas, Segmentado,
  ThOrden, Vacio, Variacion, ordenar, useOrden,
} from "../../src";
import { GraficoBanda, GraficoBarras, GraficoLinea, Sparkline } from "../../src/graficos";
import "../../css/tokens.css";
import "../../css/base.css";
import "./vitrina.css";
import verde from "../../css/acentos/verde.css?inline";
import azul from "../../css/acentos/azul.css?inline";

// Vitrina: todo lo que ofrece la biblioteca, con el acento y el modo elegibles, para comparar y decidir.

const ACENTOS = { verde, azul } as const;
type Acento = keyof typeof ACENTOS;

function leerAcento(): Acento {
  try {
    const a = localStorage.getItem("acento");
    return a && a in ACENTOS ? (a as Acento) : "verde";
  } catch {
    return "verde";
  }
}

function useAcento() {
  const [acento, setAcento] = useState<Acento>(leerAcento);
  useEffect(() => {
    let estilo = document.getElementById("acento") as HTMLStyleElement | null;
    if (!estilo) {
      estilo = document.createElement("style");
      estilo.id = "acento";
      document.head.appendChild(estilo);
    }
    estilo.textContent = ACENTOS[acento];
    try { localStorage.setItem("acento", acento); } catch { /* sin almacenamiento */ }
  }, [acento]);
  return [acento, setAcento] as const;
}

const clp = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
const precio = (n: number) => clp.format(n);
const numero = (n: number) => n.toLocaleString("es-CL");

// Datos de ejemplo: 30 días de precios de tres productos
const dias = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 8, 16 + i);
  return d.toISOString().slice(0, 10);
});
const serie = (base: number, paso: number, cada: number) => dias.map((_, i) => base + Math.floor(i / cada) * paso);
const precioA = serie(12990, -500, 9);
const precioB = serie(11490, 300, 11);
const datosLinea = dias.map((fecha, i) => ({ fecha, a: precioA[i], b: precioB[i], prom: 12200 + Math.round(Math.sin(i / 4) * 200) }));
const datosBanda = dias.map((fecha, i) => ({
  fecha, min: precioA[i] - 1500, max: precioA[i] + 900, linea: precioA[i],
  cambio: i > 0 && precioA[i] !== precioA[i - 1] ? precioA[i] - precioA[i - 1] : null,
}));
const regiones = ["Arica", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo", "Valparaíso", "Metropolitana", "O'Higgins", "Maule", "Ñuble", "Biobío", "Araucanía"];
const datosBarras = regiones.map((r, i) => ({ id: r, etiqueta: r.slice(0, 4), nombre: r, valor: 11000 + ((i * 7919) % 2400) }));

interface Fila { tienda: string; stock: number | null; online: boolean | null; actualizado: string; precio: number; min: number; max: number }
const hace = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
const filas: Fila[] = [
  { tienda: "Concepción", stock: 42, online: true, actualizado: hace(3), precio: 12490, min: 11990, max: 12990 },
  { tienda: "Los Ángeles", stock: 7, online: false, actualizado: hace(40), precio: 12990, min: 11990, max: 12990 },
  { tienda: "Talcahuano", stock: 0, online: true, actualizado: hace(100), precio: 11990, min: 11990, max: 12990 },
  { tienda: "Chillán", stock: null, online: null, actualizado: hace(10), precio: 12290, min: 11990, max: 12990 },
];

function Muestra({ nombre, variable }: { nombre?: string; variable: string }) {
  return (
    <div className="muestra">
      <span className="muestra-color" style={{ background: `var(${variable})` }} />
      <code>{nombre ?? variable}</code>
    </div>
  );
}

function Seccion({ id, titulo, nota, children }: { id: string; titulo: string; nota?: string; children: React.ReactNode }) {
  return (
    <section className="tarjeta" id={id}>
      <div className="tarjeta-cabecera"><h2>{titulo}</h2>{nota && <span className="nota">{nota}</span>}</div>
      {children}
    </section>
  );
}

type IdPestana = "resumen" | "precios" | "stock";

function Vitrina() {
  const [acento, setAcento] = useAcento();
  const [periodo, setPeriodo] = useState<7 | 30 | 90>(30);
  const [pestana, setPestana] = useState<IdPestana>("resumen");
  const [region, setRegion] = useState<string | undefined>();
  const [orden, ordenarPor] = useOrden<"tienda" | "stock" | "precio">({ clave: "stock", dir: "desc" });
  const filasOrdenadas = ordenar(filas, (f) => f[orden.clave], orden.dir);

  return (
    <>
      <header className="barra">
        <div className="barra-izquierda">
          <a className="marca" href="#">
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6" fill="var(--acento)" /><path d="M7 15l3-4 3 2 4-6" fill="none" stroke="var(--sobre-acento)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span className="marca-texto">Estilos</span>
          </a>
          <nav className="navegacion">
            <a href="#tokens" className="activo">Tokens</a>
            <a href="#componentes">Componentes</a>
            <a href="#graficos">Gráficos</a>
            <a href="sitio.html">Línea sitio →</a>
            <a href="3d.html">Línea 3d →</a>
            <a href="sitio-disenadora.html">Sitio diseñadora →</a>
          </nav>
        </div>
        <div className="usuario">
          <Segmentado chico etiqueta="Acento" valor={acento} onChange={setAcento} opciones={[{ valor: "verde", texto: "Verde" }, { valor: "azul", texto: "Azul" }]} />
          <BotonTema />
        </div>
      </header>

      <main className="contenido">
        <div>
          <h1>Vitrina de estilos</h1>
          <p className="nota">Línea <b>panel</b> · acento <b>{acento}</b> · extraída de monitor Sodimac. Cambia el acento y el modo arriba a la derecha.</p>
        </div>

        <Seccion id="tokens" titulo="Colores" nota="Superficies, texto, acento y estados. Los nombres son las variables CSS.">
          <div className="muestras">
            {["--plano", "--superficie", "--superficie-2", "--superficie-3", "--borde", "--eje",
              "--tinta", "--tinta-2", "--tinta-3", "--acento", "--acento-suave", "--sobre-acento-suave",
              "--serie-1", "--serie-2", "--bueno", "--critico", "--advertencia", "--critico-suave"].map((v) => <Muestra key={v} variable={v} />)}
          </div>
        </Seccion>

        <Seccion id="paletas" titulo="Paletas de gráficos" nota="Categórica (orden fijo), secuencial (magnitud), ordinal (niveles) y divergente (bajó / igual / subió).">
          <div className="pila">
            {[
              ["Categórica", ["--cat-1", "--cat-2", "--cat-3"]],
              ["Secuencial", ["--sec-1", "--sec-2", "--sec-3", "--sec-4", "--sec-5", "--sec-6", "--sec-7"]],
              ["Ordinal", ["--ord-1", "--ord-2", "--ord-3", "--dato-vacio"]],
              ["Divergente", ["--div-baja-3", "--div-baja-2", "--div-baja-1", "--div-igual", "--div-alza-1", "--div-alza-2", "--div-alza-3"]],
            ].map(([nombre, vars]) => (
              <div key={nombre as string}>
                <div className="campo" style={{ marginBottom: 6 }}>{nombre}</div>
                <div className="paleta">{(vars as string[]).map((v) => <span key={v} title={v} style={{ background: `var(${v})` }} />)}</div>
              </div>
            ))}
          </div>
        </Seccion>

        <Seccion id="tipografia" titulo="Tipografía" nota="Inter, solo estos siete tamaños. Números de ancho fijo en tablas, ejes e indicadores.">
          <div className="pila" style={{ gap: 8 }}>
            {[["--texto-kpi", "$12.490"], ["--texto-xl", "Título de página"], ["--texto-lg", "Título en celular"], ["--texto-md", "Título de tarjeta"],
              ["--texto-base", "Cuerpo, tablas y botones"], ["--texto-sm", "Notas, leyendas y tooltips"], ["--texto-xs", "EJES, CHIPS Y ENCABEZADOS"]].map(([v, t]) => (
              <div key={v} className="fila-tipo"><code>{v}</code><span style={{ fontSize: `var(${v})`, fontWeight: v === "--texto-kpi" || v === "--texto-xl" ? 600 : 400 }}>{t}</span></div>
            ))}
          </div>
        </Seccion>

        <div className="indicadores" id="componentes">
          <Indicador
            etiqueta="Precio típico"
            icono={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
            valor={precio(precioA.at(-1)!)}
            variacion={<Variacion actual={precioA.at(-1)} anterior={precioA[0]} formato={precio} texto="vs. hace 30 días" subirEsBueno={false} />}
            tendencia={<Sparkline valores={precioA} escalonado fluido alto={36} etiqueta="Tendencia del precio" />}
          />
          <Indicador
            etiqueta="Tiendas con stock"
            valor={<>38 <span className="indicador-de">de 45</span></>}
            variacion={<Variacion actual={38} anterior={41} formato={numero} texto="vs. ayer" subirEsBueno />}
            tendencia={<Sparkline valores={[41, 41, 40, 40, 39, 41, 40, 38, 38]} fluido alto={36} color="var(--serie-2)" />}
          />
          <Indicador etiqueta="Última actualización" valor={<span style={{ fontSize: "var(--texto-lg)" }}><Frescura fecha={hace(3)} /></span>} detalle="Corrida diaria a las 06:00" />
        </div>

        <Seccion titulo="Controles" id="controles" nota="Botones, campos, selección segmentada, casillas, chips y buscador.">
          <div className="pila">
            <div className="filtros">
              <button className="boton boton-primario">Primario</button>
              <button className="boton">Secundario</button>
              <button className="boton" disabled>Desactivado</button>
              <button className="boton boton-texto">Botón texto</button>
              <BotonDescarga onClick={() => {}} />
            </div>
            <div className="filtros">
              <label className="campo">Región<select defaultValue="Biobío">{regiones.map((r) => <option key={r}>{r}</option>)}</select></label>
              <label className="campo">Buscar<input placeholder="Nombre o SKU" /></label>
              <Segmentado etiqueta="Período" valor={periodo} onChange={setPeriodo} opciones={[{ valor: 7, texto: "7 días" }, { valor: 30, texto: "30 días" }, { valor: 90, texto: "90 días" }]} />
              <label className="casilla"><input type="checkbox" defaultChecked />Solo con stock</label>
            </div>
            <div className="barra-herramientas">
              <div className="buscador">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
                <input placeholder="Buscar producto" />
              </div>
              <div className="franja-resumen">
                <button className="chip-filtro" aria-pressed="true"><b>12</b> bajaron</button>
                <button className="chip-filtro" aria-pressed="false"><b>4</b> subieron</button>
                <button className="chip-filtro" aria-pressed="false"><b>2</b> sin stock</button>
              </div>
            </div>
            <div className="fila-nota" style={{ fontSize: "var(--texto-sm)" }}>
              <span className="chip">Chip</span>
              <span className="chip chip-neutro">Neutro</span>
              <Frescura fecha={hace(3)} chip prefijo="Actualizado" />
              <Frescura fecha={hace(40)} />
              <Frescura fecha={hace(100)} />
              <Estado valor={true} si="Online" />
              <Estado valor={false} no="Sin stock" />
              <Estado valor={null} />
            </div>
            <div className="aviso">Aviso neutro: algo que conviene saber.</div>
            <div className="aviso error">Error: no se pudo cargar la información.</div>
          </div>
        </Seccion>

        <Pestanas<IdPestana>
          etiqueta="Secciones del producto"
          activa={pestana}
          onCambio={setPestana}
          pestanas={[{ id: "resumen", texto: "Resumen" }, { id: "precios", texto: "Precios" }, { id: "stock", texto: "Stock" }]}
        >
          <select className="select-chico" aria-label="Región"><option>Todas las regiones</option></select>
        </Pestanas>
        <PanelPestana id={pestana}>
          <section className="tarjeta">
            <div className="tarjeta-cabecera con-acciones">
              <h2>Tabla ({pestana})</h2>
              <span className="nota">Encabezados que ordenan, estados con ícono, frescura y rango mín–máx.</span>
              <div className="tarjeta-acciones"><BotonDescarga onClick={() => {}} /></div>
            </div>
            <div className="tabla-envoltura">
              <table>
                <thead>
                  <tr>
                    <ThOrden orden={orden} onOrden={ordenarPor} clave="tienda">Tienda</ThOrden>
                    <ThOrden orden={orden} onOrden={ordenarPor} clave="stock" dirInicial="desc" num>Stock</ThOrden>
                    <th>Online</th>
                    <th>Actualizado</th>
                    <ThOrden orden={orden} onOrden={ordenarPor} clave="precio" num>Precio</ThOrden>
                    <th>Rango</th>
                  </tr>
                </thead>
                <tbody>
                  {filasOrdenadas.map((f) => (
                    <tr key={f.tienda} className={`clicable ${f.stock === 0 ? "apagada" : ""}`}>
                      <td>{f.tienda}</td>
                      <td className="num">
                        <div className="barra-celda">{f.stock ?? "—"}<span className="barra-pista"><span className="barra-relleno" style={{ display: "block", width: `${((f.stock ?? 0) / 42) * 100}%` }} /></span></div>
                      </td>
                      <td><Estado valor={f.online} /></td>
                      <td><Frescura fecha={f.actualizado} /></td>
                      <td className="num">{precio(f.precio)}</td>
                      <td>
                        <div className="rango-pista">
                          <span className="rango-tramo" style={{ left: 0, right: 0 }} />
                          <span className="rango-marca" style={{ left: `${((f.precio - f.min) / (f.max - f.min)) * 100}%` }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </PanelPestana>

        <section className="tarjeta" id="graficos">
          <div className="tarjeta-cabecera"><h2>Gráficos</h2><span className="nota">Recharts con las variables del tema: siguen el acento y el modo oscuro.</span></div>
          <div className="graficos graficos-2-1">
            <GraficoLinea
              titulo="Evolución del precio"
              nota="Línea escalonada: los precios cambian de golpe."
              datos={datosLinea}
              series={[
                { clave: "a", nombre: "Producto A", color: "var(--cat-1)" },
                { clave: "b", nombre: "Producto B", color: "var(--cat-2)" },
                { clave: "prom", nombre: "Promedio", color: "var(--cat-3)", referencia: true },
              ]}
              formato={precio}
              escalonado
            />
            <GraficoBanda titulo="Rango y precio típico" datos={datosBanda} nombres={{ min: "Mínimo", max: "Máximo", linea: "Típico" }} formato={precio} />
          </div>
          <div className="graficos" style={{ marginTop: 24 }}>
            <GraficoBarras
              titulo="Precio por región"
              nota="Clic en una barra para resaltarla."
              datos={datosBarras}
              nombreValor="Precio típico"
              formato={precio}
              resaltado={region}
              onClickBarra={(id) => setRegion((r) => (r === id ? undefined : id))}
              pista="Clic para resaltar"
            />
          </div>
        </section>

        <div className="graficos">
          <Seccion id="vacio" titulo="Estado vacío">
            <Vacio
              icono={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>}
              titulo="Sin resultados"
              texto="Prueba con otra búsqueda o quita los filtros."
            >
              <button className="boton" style={{ marginTop: 8 }}>Quitar filtros</button>
            </Vacio>
          </Seccion>
          <Seccion id="esqueletos" titulo="Cargando">
            <div className="pila" style={{ gap: 8 }}><Esqueleto ancho={180} alto={18} /><Esqueleto ancho="70%" alto={10} /></div>
            <EsqueletoTabla filas={4} columnas={4} />
          </Seccion>
        </div>
      </main>
      <footer className="pie-vitrina"><span>Vitrina de la línea panel</span><CreditoEstilos /></footer>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><Vitrina /></StrictMode>);
