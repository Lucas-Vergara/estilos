import { StrictMode, useEffect, useState, type CSSProperties } from "react";
import { createRoot } from "react-dom/client";
import { CreditoEstilos, Indicador, Variacion } from "../../src";
import { GraficoLinea } from "../../src/graficos";
import { Acento, Cursor, Palabras, iniciarMovimiento } from "../../src/sitio";
import "../../css/tokens.css";
import "../../css/acentos/verde.css";
import "../../css/base.css";
import "../../css/lineas/sitio-disenadora.css";
import "./vitrina-sitio-disenadora.css";

// Vitrina de la línea "sitio diseñadora" (creada con Franservice) con contenido de ejemplo. Al final, una sección mezcla la línea panel dentro del sitio.

const OBRAS = [
  { titulo: "Identidad para una cafetería", categoria: "Branding", span: 7, proporcion: "4 / 3", tono: 150 },
  { titulo: "Campaña de temporada", categoria: "Dirección de arte", span: 5, proporcion: "3 / 4", tono: 200, desfase: "120px" },
  { titulo: "Panel de precios", categoria: "Producto digital", span: 5, proporcion: "1 / 1", tono: 95 },
  { titulo: "Documental corto", categoria: "Audiovisual", span: 7, proporcion: "16 / 9", tono: 260, desfase: "60px" },
];

const SERVICIOS = [
  ["Identidad", "Marca, logo y sistema"],
  ["Producto digital", "Webs, paneles y apps"],
  ["Datos", "Scraping, análisis y visualización"],
  ["Audiovisual", "Dirección y edición"],
];

const precios = Array.from({ length: 30 }, (_, i) => ({
  fecha: new Date(2026, 8, 16 + i).toISOString().slice(0, 10),
  a: 12990 - Math.floor(i / 9) * 500,
}));
const clp = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

function Hora() {
  const ahora = () => new Date().toLocaleTimeString("es-CL", { timeZone: "America/Santiago", hour: "2-digit", minute: "2-digit", hour12: false });
  const [hora, setHora] = useState(ahora);
  useEffect(() => {
    const id = setInterval(() => setHora(ahora()), 20000);
    return () => clearInterval(id);
  }, []);
  return <span>{hora}</span>;
}

function Hero() {
  const [diapo, setDiapo] = useState(0);
  const [progreso, setProgreso] = useState(0);
  useEffect(() => {
    let inicio = performance.now(), raf = 0;
    const paso = (t: number) => {
      const p = (t - inicio) / 5000;
      if (p >= 1) { inicio = t; setDiapo((d) => (d + 1) % 3); setProgreso(0); }
      else setProgreso(p);
      raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, []);
  const nombres = ["Identidad para una cafetería", "Campaña de temporada", "Documental corto"];
  return (
    <section className="sd-hero">
      <div className={`sd-hero-medio demo-medio demo-medio-${diapo}`} />
      <div className="sd-hero-sombra" />
      <div className="demo-hero-logo" data-px-hero="0.25"><span className="sd-wordmark">Estudio<span className="sd-acento">.</span></span></div>
      <div className="sd-hero-pie">
        <div className="sd-hero-fila">
          <div style={{ display: "grid", gap: 6, minWidth: 0 }}>
            <span className="sd-mono sd-rec">REC · 0{diapo + 1} / 03</span>
            <span className="sd-hero-titulo">{nombres[diapo]}</span>
          </div>
          <span className="sd-mono" style={{ color: "var(--sd-tinta-2)" }}>Scroll ↓</span>
        </div>
        <div className="sd-segmentos">
          {nombres.map((_, i) => <span key={i} style={{ "--progreso": i < diapo ? 1 : i === diapo ? progreso : 0 } as CSSProperties} />)}
        </div>
      </div>
    </section>
  );
}

function Sitio() {
  const [aviso, setAviso] = useState(false);
  useEffect(() => iniciarMovimiento(), []);

  return (
    <>
      <Cursor prefijo="sd" />
      <header className="sd-cabecera sd-cabecera-sobre">
        <a className="sd-marca" href="#">ESTUDIO®</a>
        <nav className="sd-nav">
          <a href="#trabajos" aria-current="page">Trabajos</a>
          <a href="#servicios">Servicios</a>
          <a href="#mezcla">Mezcla</a>
          <a href="./" className="sd-nav-destacado">Otras líneas →</a>
        </nav>
      </header>

      <Hero />

      <section className="sd-seccion sd-angosta">
        <span className="sd-etiqueta" data-reveal="">(00) Manifiesto</span>
        <Palabras
          prefijo="sd"
          modo="scroll"
          como="p"
          className="sd-manifiesto demo-manifiesto"
          texto="Diseño y datos para proyectos que necesitan una imagen con *carácter* — sistemas claros, pensados para durar y para crecer contigo."
        />
      </section>

      <section className="sd-seccion" id="trabajos" style={{ paddingTop: 0 }}>
        <div className="sd-seccion-cabecera">
          <h2 className="sd-titulo" data-reveal="">Trabajos<span className="sd-contador">04</span></h2>
          <p className="sd-nota-lateral" data-reveal="" style={{ "--delay": "120ms" } as CSSProperties}>
            Galería en 12 columnas: cada obra elige su ancho y un desfase vertical. Pasa el cursor sobre una imagen.
          </p>
        </div>
        <div className="sd-galeria">
          {OBRAS.map((o, i) => (
            <a
              key={o.titulo}
              href="#trabajos"
              className="sd-obra"
              data-reveal=""
              data-cursor="Ver"
              style={{ "--span": o.span, "--desfase": o.desfase ?? "0px" } as CSSProperties}
            >
              <div className="sd-marco" style={{ "--proporcion": o.proporcion } as CSSProperties}>
                <div className="demo-imagen" style={{ "--tono": o.tono } as CSSProperties} />
              </div>
              <div className="sd-leyenda">
                <span><span className="sd-indice">0{i + 1}</span>{o.titulo}</span>
                <span className="sd-categoria">{o.categoria}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="sd-marquesina" aria-hidden="true">
        <div className="sd-marquesina-linea" data-marquee="left">
          Identidad · <span className="sd-contorno">Producto</span> · Datos · <span className="sd-acento">Audiovisual</span> · Identidad · <span className="sd-contorno">Producto</span>
        </div>
      </section>

      <section className="sd-seccion" id="servicios">
        <div className="sd-seccion-cabecera" style={{ borderTop: 0, paddingTop: 0 }}>
          <Palabras prefijo="sd" modo="stagger" className="sd-titulo" texto="Qué *hago*" />
          <p className="sd-lead" style={{ maxWidth: 520 }} data-reveal="">Listas con número, título enorme y categoría, separadas por líneas finas.</p>
        </div>
        <div className="sd-lista">
          {SERVICIOS.map(([t, c], i) => (
            <div className="sd-fila" key={t} data-reveal="" style={{ "--delay": `${i * 80}ms` } as CSSProperties}>
              <span className="sd-indice">0{i + 1}</span>
              <span className="sd-subtitulo" data-sx="">{t}</span>
              <span className="sd-categoria">{c}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="sd-seccion" id="mezcla">
        <div className="sd-seccion-cabecera">
          <h2 className="sd-titulo">Mezcla<span className="sd-contador">panel</span></h2>
          <p className="sd-nota-lateral">
            Componentes de la línea panel dentro de .sitio: toman la paleta del sitio sin cambiar nada. Así se ve un caso
            de estudio con datos en un portafolio.
          </p>
        </div>
        <div className="indicadores" style={{ marginBottom: 16 }}>
          <Indicador etiqueta="Precio típico" valor={clp.format(11490)} variacion={<Variacion actual={11490} anterior={12990} formato={clp.format} texto="vs. hace 30 días" subirEsBueno={false} />} />
          <Indicador etiqueta="Tiendas monitoreadas" valor="45" detalle="Todo Chile, cada día" />
          <Indicador etiqueta="Datos desde" valor="2025" detalle="Historial completo" />
        </div>
        <div className="tarjeta">
          <GraficoLinea titulo="Evolución del precio" nota="Línea escalonada, colores del sitio." datos={precios} series={[{ clave: "a", nombre: "Producto", color: "var(--acento)" }]} formato={clp.format} escalonado />
        </div>
      </section>

      <section className="sitio-disenadora sd-claro sd-seccion" id="contacto">
        <div className="sd-seccion-cabecera" style={{ borderTop: 0, paddingTop: 0 }}>
          <h2 className="sd-titulo">¿Hablamos<Acento prefijo="sd" texto="*?*" /></h2>
          <p className="sd-nota-lateral">Variante clara (.sitio-claro) para invertir una sección. Campos con solo línea inferior.</p>
        </div>
        <form className="demo-formulario" onSubmit={(e) => { e.preventDefault(); setAviso(true); setTimeout(() => setAviso(false), 3000); }}>
          <label className="sd-campo"><span>Nombre</span><input placeholder="Tu nombre" /></label>
          <label className="sd-campo"><span>Correo</span><input type="email" placeholder="tu@correo.cl" /></label>
          <label className="sd-campo demo-ancho"><span>Mensaje</span><textarea rows={3} placeholder="Cuéntame del proyecto" /></label>
          <div className="demo-ancho" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="sd-pildora sd-solida">Enviar</button>
            <button type="button" className="sd-pildora">Botón píldora</button>
            <a className="sd-subrayado sd-mono" href="#contacto" style={{ alignSelf: "center" }}>Enlace subrayado</a>
          </div>
        </form>
      </section>

      <footer className="sd-pie">
        <div className="sd-wordmark demo-wordmark" data-px="0.08">Estudio®</div>
        <div className="sd-pie-fila">
          <span>Biobío, Chile · <Hora /></span>
          <a href="#">Instagram</a>
          <a href="./">Línea panel</a>
          <span>© 2026 · <CreditoEstilos /></span>
        </div>
      </footer>

      <a className="sd-flotante" href="#contacto" aria-label="Escríbeme">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        <span>Escríbeme</span>
      </a>
      {aviso && <div className="sd-aviso" role="status">Mensaje de ejemplo enviado <a href="#trabajos">Ver trabajos</a></div>}
    </>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><Sitio /></StrictMode>);
