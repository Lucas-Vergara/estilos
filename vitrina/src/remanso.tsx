import { StrictMode, useEffect, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "../../css/tokens.css";
import "../../css/lineas/remanso.css";
import "./vitrina-remanso.css";

// Vitrina de la línea "remanso" con una app de bienestar inventada («Orilla», un diario de
// autocuidado), para mostrar que sirve más allá de Bitácora, donde nació. Todo es marcado de la línea: no trae JS propio.

const T: Record<string, ReactNode> = {
  hoy: <><circle cx="12" cy="12" r="4" /><path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4" /></>,
  practicas: <><rect x="3.5" y="3.5" width="7" height="7" rx="2.2" /><rect x="13.5" y="3.5" width="7" height="7" rx="3.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="3.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="2.2" /></>,
  avisos: <><path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z" /><path d="M10 20.5a2.2 2.2 0 0 0 4 0" /></>,
  tu: <><circle cx="12" cy="8.5" r="3.8" /><path d="M4.5 20c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4" /></>,
  diario: <><path d="M14.5 4.5l5 5L9 20H4v-5z" /><path d="M12.5 6.5l5 5" /></>,
  respirar: <><path d="M3.5 9h10a3 3 0 1 0-3-3" /><path d="M3.5 14h14a3 3 0 1 1-3 3" /><path d="M3.5 11.5h6" /></>,
  animo: <><path d="M3 9c2.2-2 4.3-2 6.5 0s4.3 2 6.5 0 3.5-1.7 5 0" /><path d="M3 15c2.2-2 4.3-2 6.5 0s4.3 2 6.5 0 3.5-1.7 5 0" /></>,
  habitos: <><circle cx="7" cy="7" r="2.6" /><circle cx="17" cy="7" r="2.6" /><circle cx="7" cy="17" r="2.6" /><circle cx="17" cy="17" r="2.6" /></>,
  sueno: <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z" />,
  gratitud: <path d="M12 20.5s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.8a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10-7.5 10z" />,
  metas: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /></>,
  lecturas: <><path d="M4 5.5c3-1 5.5-.6 8 1.2 2.5-1.8 5-2.2 8-1.2V19c-3-1-5.5-.6-8 1.2-2.5-1.8-5-2.2-8-1.2z" /><path d="M12 6.7v13.5" /></>,
  reloj: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  candado: <><rect x="5" y="10.5" width="14" height="10" rx="3" /><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" /></>,
  chevron: <path d="M9 5l7 7-7 7" />,
  volver: <path d="M15 5l-7 7 7 7" />,
  flecha: <path d="M5 12h14M13 6l6 6-6 6" />,
  mas: <path d="M12 5v14M5 12h14" />,
};
const Icono = ({ n, className }: { n: string; className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{T[n]}</svg>
);

const PRACTICAS = [
  { id: "diario", nombre: "Diario", lema: "Tres líneas antes de dormir", tono: "durazno" },
  { id: "respirar", nombre: "Respirar", lema: "Cuatro, siete, ocho", tono: "cielo" },
  { id: "animo", nombre: "Ánimo", lema: "Cómo va tu semana", tono: "marea" },
  { id: "habitos", nombre: "Hábitos", lema: "Lo pequeño, cada día", tono: "salvia" },
  { id: "sueno", nombre: "Sueño", lema: "A qué hora y cómo", tono: "lavanda" },
  { id: "gratitud", nombre: "Gratitud", lema: "Una cosa buena de hoy", tono: "rosa" },
  { id: "metas", nombre: "Metas", lema: "El paso de esta semana", tono: "miel" },
  { id: "lecturas", nombre: "Lecturas", lema: "Cinco minutos para ti", tono: "coral" },
];
const PALETAS = [
  { id: "bosque", nombre: "Bosque" },
  { id: "marea", nombre: "Marea" },
  { id: "arcilla", nombre: "Arcilla" },
];
const TONOS = ["miel", "marea", "coral", "lavanda", "salvia", "cielo", "durazno", "rosa"];

function Vitrina() {
  const [paleta, setPaleta] = useState("bosque");
  const [animo, setAnimo] = useState("Tranquila");
  useEffect(() => {
    document.body.classList.remove(...PALETAS.map((p) => `r-paleta-${p.id}`));
    if (paleta !== "bosque") document.body.classList.add(`r-paleta-${paleta}`);
  }, [paleta]);
  const nav = [["hoy", "Hoy"], ["practicas", "Prácticas"], ["avisos", "Avisos"], ["tu", "Tú"]];

  return (
    <div className="r-app">
      <aside className="r-lateral" aria-label="Navegación">
        <a className="r-marca" href="#"><span className="vr-sello" aria-hidden="true" />Orilla</a>
        <nav className="r-lateral-nav">
          {nav.map(([id, nombre], i) => (
            <a key={id} className="r-lateral-item" href="#" aria-current={i === 0 ? "page" : undefined}>
              <Icono n={id} />{nombre}{id === "avisos" && <span className="r-insignia">2</span>}
            </a>
          ))}
        </nav>
        <div className="r-lateral-pie">
          <Paletas paleta={paleta} setPaleta={setPaleta} />
          <p className="r-privado"><Icono n="candado" />Tus datos, solo tuyos</p>
        </div>
      </aside>

      <div className="r-contenido">
        <main className="r-pagina r-pagina-ancha r-con-aura">
          <div className="r-aura" aria-hidden="true"><i /><i /><i /></div>
          <div className="r-cabeza-movil">
            <a className="r-marca" href="#"><span className="vr-sello" aria-hidden="true" />Orilla</a>
            <Paletas paleta={paleta} setPaleta={setPaleta} chico />
          </div>

          <header className="r-cabecera vr-saludo">
            <p className="r-antetitulo">Línea remanso · apps de bienestar</p>
            <h1 className="r-titulo">Buenas tardes,<br /><em>¿cómo llegas hoy?</em></h1>
            <p className="r-bajada">Papel crema, un verde hondo de confianza, títulos con serifa suave y una tesela de color para cada práctica. Pensada para el teléfono: achica la ventana y la barra lateral pasa a pestañas abajo.</p>
          </header>

          <div className="vr-grilla">
            <div className="vr-columna">
              <section className="r-destacada vr-destacada">
                <p className="r-antetitulo">Tu práctica de esta semana</p>
                <h2 className="vr-destacada-titulo">Escribir tres líneas antes de dormir</h2>
                <p className="vr-destacada-nota">4 de 7 noches · la última, ayer</p>
                <a className="r-boton r-boton-claro" href="#">Escribir ahora<Icono n="flecha" /></a>
              </section>

              <section className="r-seccion">
                <div className="r-seccion-cabeza"><h2 className="r-h2">Tus <em>prácticas</em></h2><a href="#">Ver todas</a></div>
                <ul className="r-teselas">
                  {PRACTICAS.map((p) => (
                    <li key={p.id}>
                      <a className={`r-tesela r-tono-${p.tono}`} href="#">
                        <span className="r-icono-circulo"><Icono n={p.id} /></span>
                        <span className="r-tesela-texto"><strong>{p.nombre}</strong><small>{p.lema}</small></span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="r-seccion">
                <h2 className="r-h2">Controles</h2>
                <div className="r-tarjeta vr-controles">
                  <div className="vr-fila">
                    <button className="r-boton r-boton-primario">Guardar la entrada</button>
                    <button className="r-boton r-boton-suave">Dictar</button>
                    <button className="r-boton">Ahora no</button>
                    <button className="r-boton r-boton-icono" aria-label="Agregar"><Icono n="mas" /></button>
                  </div>
                  <label className="vr-campo"><span>¿Qué tienes en mente?</span><input className="r-entrada" placeholder="Hoy me di cuenta de que…" /></label>
                  <div className="vr-fila" role="radiogroup" aria-label="Ánimo">
                    {["Tranquila", "Cansada", "Inquieta", "Contenta", "Triste"].map((a) => (
                      <button key={a} type="button" role="radio" className="r-chip" aria-checked={animo === a} onClick={() => setAnimo(a)}>{a}</button>
                    ))}
                  </div>
                  <div className="vr-fila"><span className="r-etiqueta">3 novedades</span><span className="r-insignia">2</span><span className="r-nota">Notas chicas en el tono tenue (5:1).</span></div>
                </div>
              </section>
            </div>

            <aside className="vr-columna">
              <section className="r-seccion">
                <h2 className="r-antetitulo">Para este momento</h2>
                <ul className="r-acciones">
                  <li><a className="r-accion r-tono-cielo" href="#"><span className="r-icono-circulo"><Icono n="respirar" /></span><span>Necesito respirar<small>Un minuto guiado</small></span></a></li>
                  <li><a className="r-accion r-tono-rosa" href="#"><span className="r-icono-circulo"><Icono n="gratitud" /></span><span>Algo bueno de hoy<small>para no olvidarlo</small></span></a></li>
                  <li><a className="r-accion r-tono-salvia" href="#"><span className="r-icono-circulo"><Icono n="habitos" /></span><span>Mis hábitos<small>2 de 4 hoy</small></span></a></li>
                </ul>
              </section>
              <ul className="r-lista">
                <li><a className="r-fila" href="#"><span className="r-icono-circulo r-tono-cielo"><Icono n="reloj" /></span><span className="r-fila-texto"><strong>Recordatorios</strong><small>Todos los días a las 22:00</small></span><Icono n="chevron" className="r-chevron" /></a></li>
                <li><a className="r-fila" href="#"><span className="r-icono-circulo r-tono-salvia"><Icono n="candado" /></span><span className="r-fila-texto"><strong>Privacidad</strong><small>Cifrado en tu teléfono</small></span><Icono n="chevron" className="r-chevron" /></a></li>
              </ul>
              <div className="r-vacio">Todavía no hay entradas en tu diario. La primera puede ser una sola línea.<a className="r-boton r-boton-primario r-boton-chico" href="#">Escribir la primera</a></div>
              <section className="r-seccion">
                <h2 className="r-antetitulo">Tonos (r-tono-…)</h2>
                <ul className="vr-tonos">{TONOS.map((t) => <li key={t} className={`r-tono-${t}`}><span>{t}</span></li>)}</ul>
              </section>
              <nav className="vr-otras" aria-label="Otras líneas">
                <a href="./">Panel</a><a href="sitio.html">Sitio</a><a href="luz.html">Luz</a><a href="club.html">Club</a><a href="consola.html">Consola</a>
              </nav>
            </aside>
          </div>
        </main>
      </div>

      <nav className="r-tabs" aria-label="Navegación">
        {nav.map(([id, nombre], i) => (
          <a key={id} className="r-tab" href="#" aria-current={i === 0 ? "page" : undefined}>
            <Icono n={id} />{nombre}{id === "avisos" && <span className="r-insignia">2</span>}
          </a>
        ))}
      </nav>
    </div>
  );
}

function Paletas({ paleta, setPaleta, chico }: { paleta: string; setPaleta: (p: string) => void; chico?: boolean }) {
  return (
    <div className={`vr-paletas${chico ? " vr-paletas-chico" : ""}`} role="radiogroup" aria-label="Paleta">
      {PALETAS.map((p) => (
        <button key={p.id} type="button" role="radio" aria-checked={paleta === p.id} className={`vr-paleta vr-paleta-${p.id}`} onClick={() => setPaleta(p.id)} title={p.nombre}>
          <span className="sr">{p.nombre}</span>
        </button>
      ))}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><Vitrina /></StrictMode>);
