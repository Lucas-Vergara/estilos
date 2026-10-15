import { StrictMode, useEffect, useState, type CSSProperties } from "react";
import { createRoot } from "react-dom/client";
import { CreditoEstilos, Indicador, Variacion } from "../../src";
import { Sparkline } from "../../src/graficos";
import {
  Avatar, BotonSonido, Cursor, Entrada, FondoAnimado, NavPildora, Ola, Palabras, Proyecto, Telon,
  iniciarInteracciones, iniciarMovimiento, irCon, sonidos, useSeccionActiva, type DatosProyecto, type ModoFondo,
} from "../../src/sitio";
import { Grilla3D, Objeto3D, type FormaObjeto } from "../../src/3d";
import "../../css/tokens.css";
import "../../css/acentos/azul.css";
import "../../css/base.css";
import "../../css/lineas/sitio.css";
import "./vitrina-sitio.css";

// Vitrina de la línea "sitio": un portafolio de ejemplo que usa todos los módulos. Contenido de muestra.

const ENLACES = [
  { id: "inicio", texto: "Inicio" },
  { id: "proyectos", texto: "Proyectos" },
  { id: "laboratorio", texto: "Laboratorio" },
  { id: "contacto", texto: "Contacto" },
];

const clp = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

// Maquetas hechas con la propia biblioteca, mientras no haya capturas reales.
function MaquetaPanel() {
  const precios = [12990, 12990, 12490, 12490, 12490, 11990, 11990, 11490];
  return (
    <div className="maqueta-panel">
      <div className="maqueta-barra"><b>Monitor de precios</b><span>Hoy, 06:00</span></div>
      <div className="indicadores">
        <Indicador etiqueta="Precio típico" valor={clp.format(11490)} variacion={<Variacion actual={11490} anterior={12990} formato={clp.format} subirEsBueno={false} />} tendencia={<Sparkline valores={precios} escalonado fluido alto={28} />} />
        <Indicador etiqueta="Tiendas con stock" valor="38" detalle="de 45" />
      </div>
      <div className="maqueta-filas">
        {[["Concepción", 42, 100], ["Los Ángeles", 18, 43], ["Chillán", 7, 17], ["Talcahuano", 0, 0]].map(([t, n, p]) => (
          <div key={t as string}><span>{t}</span><span className="barra-pista"><span className="barra-relleno" style={{ display: "block", width: `${p}%` }} /></span><b>{n}</b></div>
        ))}
      </div>
    </div>
  );
}

function MaquetaLanding() {
  return (
    <div className="maqueta-landing">
      <span className="s-etiqueta">Reciclaje · Biobío</span>
      <b>Precios de compra, en un solo lugar.</b>
      <span className="maqueta-boton">Ver precios →</span>
    </div>
  );
}

const PROYECTOS: DatosProyecto[] = [
  {
    titulo: "Monitor de precios",
    descripcion: "Panel que sigue precios y stock de un catálogo en todas las tiendas del país, con historial y alertas. Diseño, datos y desarrollo.",
    cliente: "Proyecto de ejemplo", rol: "Diseño y desarrollo", anio: 2026, etiquetas: ["React", "Firebase", "BigQuery", "Scraping"],
    medio: { url: "monitor.ejemplo.cl", proporcion: "16 / 10", maqueta: <MaquetaPanel /> },
  },
  {
    titulo: "Radar de reciclaje",
    descripcion: "Sitio que reúne precios de compra de material reciclable, actores y normativa de una región, actualizado solo cada día.",
    cliente: "Proyecto de ejemplo", rol: "Producto y desarrollo", anio: 2026, etiquetas: ["Vite", "Mapas", "Automatización"],
    medio: { url: "radar.ejemplo.cl", proporcion: "16 / 10", maqueta: <MaquetaLanding /> },
  },
  {
    titulo: "Sitios de demo para clientes",
    descripcion: "Espacio para trabajos hechos para clientes: aquí irá la captura o el video del sitio de demo.",
    cliente: "Cliente", rol: "Frontend", anio: 2025, etiquetas: ["Captura pendiente"],
    medio: { url: "demo.cliente.com", proporcion: "16 / 10" },
  },
];

function Hero({ modo, setModo }: { modo: ModoFondo; setModo: (m: ModoFondo) => void }) {
  const [forma, setForma] = useState<FormaObjeto>("burbuja");
  return (
    <section className="s-hero" id="inicio">
      <FondoAnimado modo={modo} desvanecer />
      <div className="s-ancho s-hero-grid">
        <div className="s-hero-texto">
          <span className="s-estado" data-reveal="">Disponible para proyectos · Biobío, Chile</span>
          <div className="hero-quien" data-reveal="" style={{ "--delay": "80ms" } as CSSProperties}>
            <Avatar iniciales="LV" tamano={84} saludo="Hola" />
            <h1 className="s-display s-nombre"><span>Lucas </span><span>Vergara</span></h1>
          </div>
          <Palabras modo="stagger" como="p" className="s-subtitulo" texto="Diseño y desarrollo de productos web *claros*, con datos que se entienden." />
          <div className="s-hero-acciones" data-reveal="" style={{ "--delay": "300ms" } as CSSProperties}>
            <a className="s-boton" href="#proyectos" data-magnetico="0.25" onClick={() => sonidos.clic()}>Ver proyectos <span className="s-flecha" aria-hidden="true">→</span></a>
            <a className="s-boton-borde" href="#contacto" data-magnetico="0.25" onClick={() => sonidos.clic()}>Escríbeme</a>
          </div>
        </div>
        <div className="hero-objeto" data-reveal="escala" style={{ "--delay": "200ms" } as CSSProperties}>
          <Objeto3D forma={forma} />
          <div className="selector" role="group" aria-label="Forma del objeto 3D">
            {(["burbuja", "nudo", "anillos"] as FormaObjeto[]).map((f) => (
              <button key={f} type="button" aria-pressed={forma === f} onClick={() => { setForma(f); sonidos.clic(); }}>{f}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="selector selector-fondo" role="group" aria-label="Fondo animado">
        {(["manchas", "malla", "ondas"] as ModoFondo[]).map((m) => (
          <button key={m} type="button" aria-pressed={modo === m} onClick={() => { setModo(m); sonidos.clic(); }}>Fondo: {m}</button>
        ))}
      </div>
    </section>
  );
}

const PANELES = [
  { t: "Entrada al sitio", d: "Saludos en varios idiomas y una pantalla que sube con borde curvo. Una vez por visita.", ref: "Dennis Snellenberg" },
  { t: "Telón entre páginas", d: "El menú cambia de página detrás de un telón con el nombre del destino.", ref: "Dennis Snellenberg" },
  { t: "Scroll horizontal", d: "Esta misma sección: queda fija y avanza hacia el lado mientras bajas.", ref: "Rauno" },
  { t: "Navegación viva", d: "La píldora del menú se desliza hacia donde está el cursor y vuelve a la página actual.", ref: "Josh Comeau" },
  { t: "Fondos vivos", d: "Manchas, malla de puntos y ondas en canvas. Se pausan fuera de pantalla.", ref: "Cassie Evans, Keita Yamada" },
  { t: "3D y sonido", d: "Un objeto que rebota al tocarlo y una grilla infinita. Sonidos generados, apagados por defecto.", ref: "Bruno Simon, Henry Heffernan" },
];

function Sitio() {
  const activo = useSeccionActiva(ENLACES.map((e) => e.id));
  const [modo, setModo] = useState<ModoFondo>("manchas");
  const [noche, setNoche] = useState(false);
  const [aviso, setAviso] = useState("");
  const [entrada, setEntrada] = useState(0);

  useEffect(() => {
    const parar = [iniciarMovimiento(), iniciarInteracciones()];
    return () => parar.forEach((f) => f());
  }, []);
  useEffect(() => { document.body.classList.toggle("s-oscuro", noche); }, [noche]);

  const ir = (id: string, texto: string) => irCon(texto, () => {
    document.getElementById(id)?.scrollIntoView({ behavior: "instant" as ScrollBehavior });
  });

  return (
    <>
      <Entrada key={entrada} unaVezPorSesion={entrada === 0} />
      <Telon />
      <Cursor />
      <div className="s-progreso" data-progreso-scroll="" aria-hidden="true" />

      <header className="s-cabecera" data-ocultable="">
        <a className="s-marca" href="#inicio" onClick={(e) => { e.preventDefault(); ir("inicio", "Inicio"); }}>
          <span className="marca-punto" aria-hidden="true" />Lucas Vergara
        </a>
        <NavPildora enlaces={ENLACES} activo={activo} onIr={(e) => ir(e.id, e.texto)} />
        <div className="s-cabecera-acciones">
          <BotonSonido />
          <button type="button" className="s-boton-icono" aria-pressed={noche} aria-label={noche ? "Volver al día" : "Modo noche"} title={noche ? "Volver al día" : "Modo noche"} onClick={() => { setNoche(!noche); sonidos.clic(); }}>
            {noche ? "☀" : "☾"}
          </button>
        </div>
      </header>

      <main>
        <Hero modo={modo} setModo={setModo} />

        <section className="s-seccion">
          <div className="s-ancho s-pila">
            <span className="s-etiqueta" data-reveal="">Manifiesto</span>
            <Palabras modo="scroll" como="p" className="s-manifiesto" texto="Me gusta hacer herramientas que se entienden a la primera: datos claros, interfaces limpias y un poco de *movimiento* donde ayuda." />
          </div>
        </section>

        <section className="s-seccion" id="proyectos">
          <div className="s-ancho">
            <div className="s-seccion-cabecera">
              <div>
                <span className="s-etiqueta">Proyectos seleccionados</span>
                <h2 className="s-titulo" data-reveal="">Trabajos<span className="s-contador">03</span></h2>
              </div>
              <p className="s-nota-lateral" data-reveal="">Texto a un lado y la web en un marco de navegador al otro, alternados. Las capturas pueden ser imágenes o videos.</p>
            </div>
            <div className="s-proyectos">
              {PROYECTOS.map((p, i) => <Proyecto key={p.titulo} p={p} indice={i + 1} />)}
            </div>
          </div>
        </section>

        <section className="s-horizontal" data-horizontal="" id="laboratorio">
          <div className="s-horizontal-fijo">
            <div className="s-ancho" style={{ paddingInline: "var(--s-pad-x)" }}>
              <span className="s-etiqueta">Laboratorio</span>
              <h2 className="s-titulo">Lo que trae la línea</h2>
            </div>
            <div className="s-horizontal-pista">
              {PANELES.map((p, i) => (
                <article className="s-panel s-inclinable" data-inclinar="6" key={p.t}>
                  <span className="s-brillo" aria-hidden="true" />
                  <span className="s-indice">{String(i + 1).padStart(2, "0")}</span>
                  <div className="s-pila" style={{ gap: 10 }}>
                    <h3 className="s-subtitulo">{p.t}</h3>
                    <p className="s-texto">{p.d}</p>
                    <span className="s-chico">Referencia: {p.ref}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grilla-seccion">
          <Grilla3D />
          <div className="grilla-texto s-ancho">
            <span className="s-etiqueta">3D</span>
            <h2 className="s-titulo">Explorar, <span className="s-acento">sin complicarse</span>.</h2>
            <p className="s-lead">Una grilla infinita y un punto de luz que sigue al cursor. Recurso para una sección, no un sitio-juego.</p>
          </div>
        </section>

        <section className="s-seccion">
          <div className="s-ancho">
            <div className="s-seccion-cabecera">
              <div><span className="s-etiqueta">Servicios</span><h2 className="s-titulo" data-reveal="">Qué hago</h2></div>
            </div>
            <div className="tarjetas">
              {[
                ["Paneles de datos", "Monitores y tableros que cualquiera entiende en segundos."],
                ["Sitios y portafolios", "Webs claras, rápidas y con movimiento donde suma."],
                ["Automatización", "Recolección de datos y tareas que corren solas cada día."],
              ].map(([t, d], i) => (
                <article className="s-tarjeta s-inclinable" data-inclinar="5" data-reveal="" style={{ "--delay": `${i * 90}ms` } as CSSProperties} key={t}>
                  <span className="s-brillo" aria-hidden="true" />
                  <span className="s-indice">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="s-subtitulo">{t}</h3>
                  <p className="s-texto">{d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="s-marquesina" aria-hidden="true">
          <div className="s-marquesina-linea" data-marquee="left">
            Datos · <span className="s-contorno">Producto</span> · Diseño · <span className="s-acento">Automatización</span> · Datos · <span className="s-contorno">Producto</span>
          </div>
        </section>

        <section className="sitio s-simple s-seccion" aria-labelledby="titulo-simple">
          <div className="s-ancho s-pila">
            <span className="s-etiqueta">Variante simple</span>
            <h2 className="s-display s-nombre" id="titulo-simple"><span>Simple</span><span>mente</span></h2>
            <p className="s-lead">Con la clase <code>s-simple</code> no hay movimiento ni fondos vivos: más aire y una ola como separador.</p>
          </div>
        </section>
        <div className="ola-envoltura"><Ola /></div>

        <section className="sitio s-oscuro s-seccion" id="contacto">
          <div className="s-ancho">
            <div className="s-seccion-cabecera">
              <div><span className="s-etiqueta">Contacto</span><h2 className="s-titulo">¿Conversamos?</h2></div>
              <p className="s-nota-lateral">Sección en modo noche (<code>s-oscuro</code>) dentro de una página de día.</p>
            </div>
            <form className="formulario" onSubmit={(e) => { e.preventDefault(); sonidos.activar(); setAviso("Mensaje de ejemplo: no se envió nada"); setTimeout(() => setAviso(""), 3200); }}>
              <label className="s-campo"><span>Nombre</span><input id="nombre" placeholder="Tu nombre" /></label>
              <label className="s-campo"><span>Correo</span><input id="correo" type="email" placeholder="tu@correo.cl" /></label>
              <label className="s-campo ancho"><span>Mensaje</span><textarea id="mensaje" rows={3} placeholder="Cuéntame del proyecto" /></label>
              <div className="ancho"><button className="s-boton" data-magnetico="0.2">Enviar <span className="s-flecha" aria-hidden="true">→</span></button></div>
            </form>
          </div>
        </section>
      </main>

      <footer className="s-pie">
        <div className="s-wordmark" data-px="0.06">Lucas Vergara</div>
        <div className="s-pie-fila">
          <span>Biobío, Chile · <CreditoEstilos /></span>
          <nav aria-label="Otras líneas">
            <a href="./">Línea panel</a>
            <a href="sitio-disenadora.html">Línea sitio diseñadora</a>
            <button type="button" className="boton-texto" onClick={() => { try { sessionStorage.removeItem("estilos-entrada"); } catch { /* */ } setEntrada((n) => n + 1); }}>Ver la entrada otra vez</button>
          </nav>
        </div>
      </footer>

      <a className="s-flotante" href="#contacto" aria-label="Escríbeme" data-magnetico="0.15">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        <span>Escríbeme</span>
      </a>
      {aviso && <div className="s-aviso" role="status">{aviso}</div>}
    </>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><Sitio /></StrictMode>);
