import { StrictMode, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { createRoot } from "react-dom/client";
import { CreditoEstilos } from "../../src";
import { IndicadorPasos, Telefono, iniciarClub, useProgresoFijo } from "../../src/club";
import "../../css/tokens.css";
import "../../css/lineas/club.css";
import "./vitrina-club.css";

// Vitrina de la línea "club" con un club de ejemplo inventado (Roca, escalada en Valdivia). Muestra lo que trae una web
// de servicios con membresía: puerta de entrada gratis con inscripción por pasos, planes, el mes del club, convenios,
// tienda de pago único, la app de miembros y un formulario de contacto.

const PALETAS = [
  { valor: "neon", texto: "Neón" },
  { valor: "brasa", texto: "Brasa" },
  { valor: "lima", texto: "Lima" },
  { valor: "marea", texto: "Marea" },
] as const;
type Paleta = (typeof PALETAS)[number]["valor"];

const clp = (n: number) => "$" + Math.round(n).toLocaleString("es-CL");

// ---------- Fotos de ejemplo: muros con presas, dibujados con la paleta ----------

function azar(semilla: number) {
  let s = semilla;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
}

function Muro({ semilla = 1, presas = 26, inclinado = false, recorte = false }: { semilla?: number; presas?: number; inclinado?: boolean; recorte?: boolean }) {
  const r = azar(semilla);
  const colores = ["var(--c-viva-1)", "var(--c-viva-2)", "var(--c-viva-3)", "var(--c-viva-4)", "#f5f3ee"];
  const lista = Array.from({ length: presas }, () => ({
    x: 30 + r() * 740, y: (recorte ? 360 : 30) + r() * (recorte ? 230 : 540), rx: 6 + r() * 13, ry: 5 + r() * 9, rot: r() * 180, c: colores[Math.floor(r() * colores.length)],
  }));
  const id = `m${semilla}`;
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a2a33" />
          <stop offset="1" stopColor="#0d0d10" />
        </linearGradient>
        <radialGradient id={`${id}l`} cx="0.7" cy="0.2" r="0.8">
          <stop offset="0" stopColor="var(--c-viva-2)" stopOpacity="0.28" />
          <stop offset="1" stopColor="var(--c-viva-2)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {recorte
        ? <polygon points="0,600 0,370 260,330 520,355 800,320 800,600" fill={`url(#${id}g)`} />
        : <rect width="800" height="600" fill={`url(#${id}g)`} />}
      {!recorte && inclinado && <polygon points="0,0 800,0 800,140 0,320" fill="#ffffff" opacity="0.04" />}
      {!recorte && <rect width="800" height="600" fill={`url(#${id}l)`} />}
      {Array.from({ length: 6 }, (_, i) => <line key={i} x1={i * 160} y1={recorte ? 340 : 0} x2={i * 160 + 40} y2="600" stroke="#fff" strokeOpacity="0.05" />)}
      {lista.map((p, i) => (
        <ellipse key={i} cx={p.x} cy={p.y} rx={p.rx} ry={p.ry} transform={`rotate(${p.rot} ${p.x} ${p.y})`} fill={p.c} opacity="0.92" />
      ))}
    </svg>
  );
}

// ---------- Datos del club de ejemplo ----------

const RESENAS = [
  ["«Llegué sin saber hacer un nudo y a los tres meses estaba encadenando mi primer 6a. Lo mejor es la gente.»", "Fernanda", "En Roca desde la primera sesión abierta"],
  ["«El plan de fuerza de dedos me sacó de una meseta de un año. Y la Cata te corrige cada movimiento.»", "Tomás Vidal", "Plan Cordada"],
  ["«Vine por el muro, me quedé por los viernes de bloque.»", "Isidora", "Llegó por un convenio"],
  ["«Ordenado, cercano y con buena onda.»", "Matías Riquelme", "En Roca desde 2025"],
];

const PLANES = [
  { id: "libre", nombre: "Roca Libre", lema: "Escalas a tu hora, con un plan hecho para ti", precio: 34990, boton: "Elegir Libre",
    filas: [["Sesiones", "Muro libre todos los días", false], ["Técnica", "Por video", false], ["Evaluación", "Al entrar", false], ["Seguimiento", "Plan nuevo cada lunes", false], ["Salidas a roca", null, false]] },
  { id: "cordada", nombre: "Roca Cordada", lema: "Escalas en grupo, con tu coach en cada sesión", precio: 47990, boton: "Elegir Cordada", destacado: true,
    filas: [["Sesiones", "2 de fuerza + 1 de muro en grupo", true], ["Técnica", "En grupo, en cada sesión", true], ["Evaluación", "Al entrar y cada 3 meses", false], ["Seguimiento", "Cada semana, por la app", false], ["Salidas a roca", "Una al mes", true]] },
  { id: "pro", nombre: "Roca Pro", lema: "Tu coach contigo, uno a uno, con fisio incluida", precio: 64990, boton: "Elegir Pro",
    filas: [["Sesiones", "Tus 3 sesiones con tu coach al lado", true], ["Técnica", "Uno a uno, en cada sesión", true], ["Evaluación", "Al entrar y cada mes", false], ["Seguimiento", "Tu coach ajusta tu plan cada semana", false], ["Salidas a roca", "Todas, con prioridad", true]] },
] as const;
type IdPlan = (typeof PLANES)[number]["id"];

const AGENDA = [
  ["Semana 1", "Apertura del mes", "Presentamos el reto y armamos las cordadas.", 3],
  ["Semana 1", "Taller de nudos", "Ocho, ballestrinque y autoaseguro, con práctica.", 7],
  ["Semana 2", "Viernes de bloque", "Circuito nuevo, música y premio al más votado.", 11],
  ["Semana 3", "Salida a roca", "Un día en el sector, con transporte y guía.", 19],
  ["Semana 3", "Club de lectura", "Este mes: un libro de montaña, en el café.", 23],
  ["Semana 4", "Cierre y premios", "Contamos encadenes y celebramos el mes.", 29],
] as const;

const CONVENIOS = [
  { nombre: "Tienda de montaña", inicial: "TM", base: 12 },
  { nombre: "Fisio Sur", inicial: "FS", base: 15 },
  { nombre: "Café La Cordada", inicial: "LC", base: 10 },
  { nombre: "Magnesio Andes", inicial: "MA", base: 8 },
  { nombre: "Yoga Río", inicial: "YR", base: 20 },
  { nombre: "Calzado Vertical", inicial: "CV", base: 12 },
];
const EXTRA: Record<IdPlan, number> = { libre: 0, cordada: 4, pro: 8 };

const PRODUCTOS = [
  { titulo: "Plan 12 semanas", portada: "V4", bajada: "Del V2 al V4 sin lesionarte", precio: 14990, sello: "Plan en PDF", etiquetas: "bloque v4 boulder fuerza", grande: true },
  { titulo: "Fuerza de dedos", portada: "Dedos", bajada: "Suspensiones seguras, de cero", precio: 9990, sello: "Manual en PDF", etiquetas: "fuerza dedos regleta", oscuro: true },
  { titulo: "Primera vía", portada: "6a", bajada: "De la cuerda a tu primer encadene", precio: 7990, sello: "Manual en PDF", etiquetas: "vía cuerda deportiva 6a" },
];

const FUNCIONES = [
  ["Tu calendario", "Tus sesiones de la semana, hechas para ti. Cada lunes queda lista la siguiente."],
  ["Tu sesión", "Cada sesión con sus bloques, sus series y lo que tu coach quiere que mires."],
  ["Tu progreso", "El cierre de tu semana en 30 segundos: constancia, molestias y cómo te sentiste."],
  ["Tu club", "El muro del club: encadenes, presentaciones y avisos de la gente con la que escalas."],
  ["Tu coach", "Lo que le escribes a tu coach le llega a su panel, y te responde por aquí."],
] as const;

const PREGUNTAS = [
  ["¿Necesito experiencia para ir a una sesión abierta?", "No. Te prestamos zapatillas y arnés, te enseñamos a asegurar y escalas en el nivel que elijas."],
  ["¿Qué tiene Pro que no tenga Cordada?", "Tu coach está en tus tres sesiones y te sigue uno a uno, te evalúa cada mes, tienes fisio incluida y prioridad en las salidas a roca."],
  ["¿Y si todavía no quiero un plan mensual?", "Empieza con un manual de la tienda: es tuyo, sin suscripción, y trae 30 días gratis en la app del club."],
  ["¿Puedo pausar mi plan?", "Sí, hasta dos meses al año, desde la app y sin llamar a nadie."],
];

// ---------- Secciones con estado ----------

function Inscripcion() {
  const PASOS = ["Tus datos", "Experiencia", "Confirma"];
  const [paso, setPaso] = useState(0);
  const [datos, setDatos] = useState({ nombre: "", apellido: "", correo: "", whatsapp: "", experiencia: "Nunca he escalado", acepto: false });
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [listo, setListo] = useState(false);
  const cambiar = (k: keyof typeof datos) => (e: { target: HTMLInputElement }) => setDatos({ ...datos, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const seguir = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (paso === 0) {
      if (!datos.nombre.trim()) return setError("Falta tu nombre: escríbelo para guardarte un cupo.");
      if (!/^\S+@\S+\.\S+$/.test(datos.correo)) return setError("El correo no parece completo. Revisa que tenga @ y un dominio.");
    }
    if (paso === 2) {
      if (!datos.acepto) return setError("Para inscribirte, marca que leíste las reglas del muro.");
      if (enviando) return;
      setEnviando(true);
      setTimeout(() => { setEnviando(false); setListo(true); }, 900);
      return;
    }
    setPaso(paso + 1);
  };

  if (listo) {
    return (
      <div className="c-ficha" role="status">
        <span className="c-etiqueta">Cupo guardado</span>
        <h3>Nos vemos el sábado, {datos.nombre.trim().split(" ")[0]}.</h3>
        <p>Te escribimos el viernes a {datos.correo} con lo que tienes que traer. Si no puedes ir, avísanos y liberamos tu cupo.</p>
        <button type="button" className="c-boton c-boton-contorno c-boton-chico" onClick={() => { setListo(false); setPaso(0); }}>Inscribir a otra persona</button>
      </div>
    );
  }

  return (
    <form className="c-ficha" onSubmit={seguir} noValidate>
      <div>
        <h3>Sesión abierta · Muro Roca</h3>
        <div className="c-ficha-fecha">Sábado 14 de noviembre</div>
      </div>
      <p>Escalamos en tres niveles, eliges el tuyo, y después nos quedamos a conversar. Vienes solo o con amigos.</p>
      <dl className="c-ficha-datos">
        <div><dt>Lugar</dt><dd>Muro Roca, Valdivia</dd></div>
        <div><dt>Hora</dt><dd className="c-cifra" style={{ fontSize: 18 }}>10:00</dd></div>
        <div><dt>Equipo</dt><dd>Incluido</dd></div>
        <div><dt>Precio</dt><dd>Gratis</dd></div>
      </dl>
      <IndicadorPasos pasos={PASOS} actual={paso} etiqueta="Pasos de la inscripción" />
      {paso === 0 && (
        <div className="c-campos">
          <label className="c-campo"><span>Nombre</span><input value={datos.nombre} onChange={cambiar("nombre")} autoComplete="given-name" /></label>
          <label className="c-campo"><span>Apellido</span><input value={datos.apellido} onChange={cambiar("apellido")} autoComplete="family-name" /></label>
          <label className="c-campo vc-ancho"><span>Correo</span><input type="email" placeholder="tu@correo.com" value={datos.correo} onChange={cambiar("correo")} autoComplete="email" /></label>
          <label className="c-campo vc-ancho"><span>WhatsApp</span><input type="tel" placeholder="+56 9 1234 5678" value={datos.whatsapp} onChange={cambiar("whatsapp")} autoComplete="tel" /></label>
        </div>
      )}
      {paso === 1 && (
        <fieldset className="c-opciones">
          <legend>¿Cuánto has escalado?</legend>
          {["Nunca he escalado", "Un par de veces", "En gimnasio", "En roca"].map((o) => (
            <label key={o} className="c-opcion"><input type="radio" name="experiencia" value={o} checked={datos.experiencia === o} onChange={cambiar("experiencia")} /><span>{o}</span></label>
          ))}
        </fieldset>
      )}
      {paso === 2 && (
        <>
          <p><b>{datos.nombre} {datos.apellido}</b> · {datos.correo}<br />{datos.experiencia}</p>
          <label className="c-check"><input type="checkbox" checked={datos.acepto} onChange={cambiar("acepto")} /> Leí las reglas del muro y sé que el equipo se devuelve al terminar.</label>
        </>
      )}
      {error && <div className="c-campo-error" role="alert">{error}</div>}
      <div className="c-dialogo-botones">
        {paso > 0 && <button type="button" className="c-boton c-boton-contorno" onClick={() => { setError(""); setPaso(paso - 1); }}>Atrás</button>}
        <button className="c-boton c-boton-ancho" disabled={enviando}>{paso < 2 ? "Seguir" : enviando ? "Guardando tu cupo…" : "Guardar mi cupo"}</button>
      </div>
    </form>
  );
}

function Eventos() {
  const [pestana, setPestana] = useState<"proximas" | "fotos">("proximas");
  return (
    <section className="c-modulo c-modulo-pad" id="sesiones" aria-label="Sesiones abiertas">
      <div className="c-pestanas" role="tablist">
        <button className="c-pestana" role="tab" aria-selected={pestana === "proximas"} onClick={() => setPestana("proximas")}>Próximas <span className="c-contador">1</span></button>
        <button className="c-pestana" role="tab" aria-selected={pestana === "fotos"} onClick={() => setPestana("fotos")}>Fotos</button>
      </div>
      {pestana === "proximas" ? (
        <div className="c-evento" role="tabpanel">
          <Inscripcion />
          <div className="c-foto"><Muro semilla={4} presas={34} inclinado /></div>
        </div>
      ) : (
        <div className="vc-fotos" role="tabpanel">
          {[5, 6, 7, 8, 9, 10].map((s) => <div key={s} className="c-foto"><Muro semilla={s} presas={18} /></div>)}
        </div>
      )}
    </section>
  );
}

function Planes() {
  const [trimestral, setTrimestral] = useState(false);
  const DESCUENTO = 0.1;
  return (
    <section className="c-contenedor c-seccion" id="planes">
      <span className="c-etiqueta">Planes · mes a mes, sin permanencia</span>
      <h2 className="c-titulo" data-c-palabras="">Elige <span className="c-degrade">tu plan.</span></h2>
      <div className="vc-fila">
        <p className="c-bajada">Todos parten con una evaluación y te dan acceso a la app del club. Cambias de plan cuando quieras.</p>
        <div className="c-segmento" role="group" aria-label="Forma de pago">
          <button type="button" aria-pressed={!trimestral} onClick={() => setTrimestral(false)}>Mensual</button>
          <button type="button" aria-pressed={trimestral} onClick={() => setTrimestral(true)}>Trimestral <small>−{DESCUENTO * 100}%</small></button>
        </div>
      </div>
      <div className="c-planes">
        {PLANES.map((p) => {
          const precio = trimestral ? p.precio * (1 - DESCUENTO) : p.precio;
          return (
            <article key={p.id} className={`c-plan${"destacado" in p ? " c-plan-destacado" : ""}`}>
              {"destacado" in p && <span className="c-plan-sello">El más elegido</span>}
              <h3 className="c-plan-nombre">{p.nombre}</h3>
              <p className="c-plan-lema">{p.lema}</p>
              <div className="c-precio">
                <span className="c-cifra">{clp(precio)}</span>
                <span className="c-precio-periodo">al mes{trimestral && <><br /><span className="c-precio-antes">{clp(p.precio)}</span></>}</span>
              </div>
              <a href="#contacto" className={`c-boton c-boton-ancho${"destacado" in p ? " c-boton-acento" : ""}`}>{p.boton} <span className="c-flecha" aria-hidden="true">→</span></a>
              <dl className="c-plan-filas">
                {p.filas.map(([t, v, suma]) => (
                  <div key={t}><dt>{t}</dt><dd className={v === null ? "c-no" : suma ? "c-incluye" : undefined}>{v ?? "—"}</dd></div>
                ))}
              </dl>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ElClub() {
  const [plan, setPlan] = useState<IdPlan>("cordada");
  return (
    <section className="c-modulo c-modulo-pad" id="club">
      <span className="c-etiqueta">El club</span>
      <h2 className="c-titulo c-titulo-m" data-c-palabras="">La vía te trae. <br /><span className="c-degrade">Tu club te espera cada mes.</span></h2>
      <p className="c-bajada">Cada mes tiene su apertura, su reto y su cierre. Entre medio, talleres, salidas y un viernes de bloque.</p>
      <div className="c-agenda">
        {AGENDA.map(([semana, titulo, texto, s]) => (
          <article key={titulo} className="c-actividad">
            <div className="c-foto"><Muro semilla={s} presas={14} /></div>
            <div className="c-actividad-texto"><span className="c-etiqueta">{semana}</span><h3>{titulo}</h3><p>{texto}</p></div>
          </article>
        ))}
      </div>
      <div className="vc-fila vc-convenios-cabeza">
        <h3 className="c-titulo-s">Descuentos por ser del club</h3>
        <div className="c-segmento" role="group" aria-label="Ver descuentos del plan">
          {PLANES.map((p) => <button key={p.id} type="button" aria-pressed={plan === p.id} onClick={() => setPlan(p.id)}>{p.nombre.replace("Roca ", "")}</button>)}
        </div>
      </div>
      <div className="c-convenios">
        {CONVENIOS.map((c) => (
          <div key={c.nombre} className="c-convenio">
            <span className="c-convenio-logo">{c.inicial}</span>
            <span className="c-convenio-nombre">{c.nombre}</span>
            <span className="c-cifra">{c.base + EXTRA[plan]}<small>%</small></span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Tienda() {
  const [busqueda, setBusqueda] = useState("");
  const q = busqueda.trim().toLowerCase();
  const lista = useMemo(() => PRODUCTOS.filter((p) => !q || `${p.titulo} ${p.etiquetas} ${p.bajada}`.toLowerCase().includes(q)), [q]);
  return (
    <section className="c-contenedor c-seccion" id="tienda">
      <span className="c-etiqueta">Tienda · pago único</span>
      <h2 className="c-titulo" data-c-palabras="">Empieza con <span className="c-degrade">algo puntual.</span></h2>
      <div className="c-buscador">
        <label htmlFor="buscar">¿Qué quieres encadenar?</label>
        <input id="buscar" type="search" placeholder="Escribe un grado o un tema: V4, dedos, primera vía…" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
      </div>
      {lista.length ? (
        <div className="c-tienda">
          {lista.map((p, i) => (
            <a key={p.titulo} href="#tienda" className={`c-producto${p.grande && lista.length > 1 ? " c-producto-grande" : ""}${p.oscuro ? " c-producto-oscuro" : ""}`}
              style={i === 2 ? { "--c-producto-fondo": "var(--c-viva-2)" } as React.CSSProperties : undefined}>
              <span className="c-producto-sello">{p.sello}</span>
              <div className="c-producto-portada">
                <div className="c-libro" style={p.oscuro ? { "--c-libro-fondo": "var(--c-viva-1)", "--c-libro-tinta": "var(--c-tinta)" } as React.CSSProperties : undefined}>
                  <small>{p.titulo}</small>
                  <strong>{p.portada}</strong>
                  <span style={p.oscuro ? { color: "var(--c-tinta)" } : undefined}>{p.bajada}</span>
                </div>
              </div>
              <span className="c-producto-pie">{p.titulo} <span className="c-precio-chico">{clp(p.precio)}</span></span>
            </a>
          ))}
        </div>
      ) : (
        <p className="c-vacio-tienda">No hay nada para «{busqueda}» todavía. Prueba con «dedos» o «V4», o escríbenos y te armamos un plan.</p>
      )}
      <a className="c-banda" href="#tienda">Ver todo lo de la tienda <span className="c-circulo-degrade" aria-hidden="true">→</span></a>
    </section>
  );
}

function PantallaApp({ i }: { i: number }) {
  if (i === 0) {
    const dias = Array.from({ length: 28 }, (_, d) => d + 9);
    return (
      <>
        <h4>Noviembre <span className="c-degrade">2026</span></h4>
        <div className="c-mini">
          <div className="c-cal">
            {["L", "M", "M", "J", "V", "S", "D"].map((d, k) => <b key={k}>{d}</b>)}
            {dias.map((d) => <span key={d} className={d === 16 ? "c-hoy" : d < 16 && d % 2 ? "c-hecho" : d > 30 ? "c-fuera" : undefined}>{d > 30 ? d - 30 : d}</span>)}
          </div>
        </div>
        <div className="c-mini"><span className="c-etiqueta">Lunes 16 · fuerza</span><b style={{ fontSize: 14 }}>Bloque en 4×4</b><span>45 min · muro principal</span></div>
      </>
    );
  }
  if (i === 1) {
    return (
      <>
        <span className="c-etiqueta" style={{ fontSize: 7.5, margin: 0 }}>Lunes 16 · sesión de fuerza</span>
        <h4>4×4 en bloque</h4>
        <div className="vc-mini-grilla">
          <div className="c-mini"><span className="c-etiqueta">Duración</span><span className="c-cifra" style={{ fontSize: 22 }}>45′</span></div>
          <div className="c-mini"><span className="c-etiqueta">Grado</span><span className="c-cifra" style={{ fontSize: 22 }}>V2–V3</span></div>
        </div>
        <div className="c-mini"><span className="c-etiqueta">Lo que mira tu coach</span><span>Pies silenciosos y cadera pegada al muro en los desplomes.</span></div>
        <div className="c-mini"><span className="c-etiqueta">Series</span><span>4 bloques seguidos, 4 veces, 3′ de descanso.</span></div>
      </>
    );
  }
  if (i === 2) {
    return (
      <>
        <h4>Tu <span className="c-degrade">progreso</span></h4>
        <div className="c-mini"><span className="c-etiqueta">Tu meta</span><b style={{ fontSize: 12 }}>Encadenar un V4</b><span className="c-cifra">38 <small style={{ fontSize: 11 }}>días</small></span></div>
        <div className="c-mini">
          <span className="c-etiqueta">Esta semana</span>
          <span><b className="c-cifra" style={{ fontSize: 22 }}>2</b> de 3 sesiones</span>
          <div className="c-mini-barra" style={{ "--v": "66%" } as React.CSSProperties}><i /></div>
        </div>
        <div className="c-mini"><span className="c-etiqueta">Últimas 6 semanas</span>
          <div className="c-barras">{[60, 100, 66, 100, 100, 66].map((v, k) => <i key={k} className={v === 100 ? "c-hecho" : undefined} style={{ "--v": `${v}%` } as React.CSSProperties} />)}</div>
        </div>
      </>
    );
  }
  if (i === 3) {
    return (
      <>
        <h4>Tu <span className="c-degrade">club</span></h4>
        <span><b>6</b> días para el cierre de noviembre</span>
        <div className="c-mini">
          <b>El muro del club</b>
          <div className="c-post"><span className="c-tel-avatar">FT</span><div><b>Fernanda</b><span className="c-chip">Encadene</span><p>¡Por fin el amarillo del desplome! Gracias al grupo del jueves 💜</p></div></div>
          <div className="c-post"><span className="c-tel-avatar">M</span><div><b>Martín</b><span className="c-chip c-chip-oscuro">Equipo</span><p>El sábado salimos a roca. Quedan 4 cupos en la van.</p></div></div>
        </div>
      </>
    );
  }
  return (
    <>
      <h4>Tu <span className="c-degrade">coach</span></h4>
      <span style={{ color: "var(--c-tinta-2)" }}>Lo que le escribas a Cata le llega a su panel.</span>
      <div className="c-mini" style={{ gap: 6 }}>
        <span className="c-burbuja-autor">Cata · Domingo 19:40</span>
        <div className="c-burbuja">¡Hola! Esta semana partimos suave: el lunes 4×4 cortos, no te apures en el primero.</div>
        <span className="c-burbuja-autor c-mia">Tú · 21:02</span>
        <div className="c-burbuja c-burbuja-mia">¡Gracias! El jueves no puedo ir al muro, ¿lo cambio al viernes?</div>
        <span className="c-burbuja-autor">Cata · Lunes 08:15</span>
        <div className="c-burbuja">Sí, muévelo sin problema. Que no queden dos días duros seguidos.</div>
      </div>
    </>
  );
}

function LaApp() {
  const ref = useRef<HTMLElement>(null);
  const [activo, ir] = useProgresoFijo(ref, FUNCIONES.length);
  const pestanaTel = [0, 0, 1, 2, 3][activo];
  return (
    <section ref={ref} className="c-app" style={{ height: `${FUNCIONES.length * 70 + 30}vh` }} aria-label="La app del club">
      <div className="c-app-fija c-contenedor">
        <div className="c-app-fondo" aria-hidden="true">Tu club,<br />cada día.</div>
        <div>
          <span className="c-etiqueta">Área de miembros</span>
          <h2 className="c-titulo c-titulo-m">Tu mes en el club, <br />en tu celular.</h2>
          <p className="c-bajada">Una app donde ves tus sesiones de la semana, cierras cada semana con tu progreso, conversas con el club y le escribes a tu coach.</p>
          <ul className="c-funciones">
            {FUNCIONES.map(([t, d], i) => (
              <li key={t}>
                <button type="button" aria-current={i === activo} onClick={() => ir(i)}><b>{t}</b><span><span>{d}</span></span></button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Telefono marca="roca" sub="club" inicial="C" pestanas={["Calendario", "Progreso", "Club", "Yo"]} activa={pestanaTel}>
            <div key={activo} className="vc-pantalla"><PantallaApp i={activo} /></div>
          </Telefono>
          <div className="c-puntos" aria-hidden="true">{FUNCIONES.map((_, i) => <i key={i} className={i === activo ? "c-activo" : undefined} />)}</div>
        </div>
      </div>
    </section>
  );
}

function Contacto({ abierto, cerrar, alEnviar }: { abierto: boolean; cerrar: () => void; alEnviar: (nombre: string) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [paso, setPaso] = useState(0);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierto && !d.open) { d.showModal(); setPaso(0); setError(""); }
    if (!abierto && d.open) d.close();
  }, [abierto]);
  const enviar = (e: FormEvent) => {
    e.preventDefault();
    if (paso === 0) {
      if (!nombre.trim() || !/^\S+@\S+\.\S+$/.test(correo)) return setError("Necesitamos tu nombre y un correo completo para responderte.");
      setError(""); setPaso(1); return;
    }
    alEnviar(nombre.trim().split(" ")[0]);
  };
  return (
    <dialog ref={ref} className="c-dialogo" onClose={cerrar} aria-labelledby="contacto-titulo">
      <form className="c-dialogo-cuerpo" onSubmit={enviar} noValidate>
        <button type="button" className="c-dialogo-cerrar" onClick={cerrar} aria-label="Cerrar">✕</button>
        <h2 id="contacto-titulo" className="c-titulo-s" style={{ fontSize: 28 }}>Te contamos todo</h2>
        <p style={{ margin: 0, color: "var(--c-tinta-2)" }}>Déjanos tus datos y te escribimos con la próxima sesión abierta y lo que quieras saber del club.</p>
        <IndicadorPasos pasos={["Tus datos", "Sobre ti"]} actual={paso} />
        {paso === 0 ? (
          <div className="c-campos">
            <label className="c-campo vc-ancho"><span>Nombre</span><input autoFocus value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" /></label>
            <label className="c-campo vc-ancho"><span>Correo</span><input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} autoComplete="email" /></label>
          </div>
        ) : (
          <>
            <fieldset className="c-opciones"><legend>¿Qué te interesa?</legend>
              {["Ir a una sesión abierta", "Entrar al club", "Algo de la tienda"].map((o, i) => <label key={o} className="c-opcion"><input type="checkbox" defaultChecked={i === 0} /><span>{o}</span></label>)}
            </fieldset>
            <label className="c-check"><input type="checkbox" /> También quiero recibir novedades del club. Es opcional.</label>
          </>
        )}
        {error && <div className="c-campo-error" role="alert">{error}</div>}
        <div className="c-dialogo-botones">
          {paso > 0 && <button type="button" className="c-boton c-boton-contorno" onClick={() => setPaso(0)}>Atrás</button>}
          <button className="c-boton c-boton-ancho">{paso === 0 ? "Siguiente" : "Avísenme"}</button>
        </div>
      </form>
    </dialog>
  );
}

// ---------- Página ----------

function Vitrina() {
  const [paleta, setPaleta] = useState<Paleta>(() => {
    try { return (localStorage.getItem("club-paleta") as Paleta) || "neon"; } catch { return "neon"; }
  });
  const [contacto, setContacto] = useState(false);
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    const b = document.body;
    PALETAS.forEach((p) => b.classList.remove(`c-paleta-${p.valor}`));
    if (paleta !== "neon") b.classList.add(`c-paleta-${paleta}`);
    try { localStorage.setItem("club-paleta", paleta); } catch { /* sin almacenamiento */ }
  }, [paleta]);
  useEffect(() => iniciarClub(), []);
  useEffect(() => { if (!aviso) return; const t = setTimeout(() => setAviso(""), 5000); return () => clearTimeout(t); }, [aviso]);

  return (
    <>
      <header className="c-cabecera">
        <a className="c-marca" href="#" aria-label="Roca, club de escalada"><span className="c-marca-nombre">roca</span><span className="c-marca-sub">Club<br />de escalada</span></a>
        <nav className="c-nav" aria-label="Secciones">
          <a href="#sesiones">Sesiones abiertas</a><a href="#coach">Coach</a><a href="#planes">Planes</a><a href="#club">El club</a><a href="#tienda">Tienda</a>
        </nav>
        <div className="c-cabecera-acciones">
          <a className="c-enlace" href="#app">Entrar</a>
          <a className="c-boton c-boton-chico" href="#planes">Ver los planes</a>
        </div>
      </header>

      <main>
        <section className="c-modulo c-hero" aria-label="Portada">
          <div className="c-hero-nombre" aria-hidden="true">roca</div>
          <div className="c-foto c-hero-foto"><Muro semilla={2} presas={40} recorte /></div>
          <div className="c-hero-pie">
            <h1 className="c-hero-titulo" data-c-palabras="">Ven por tu primera vía, <span className="c-degrade">quédate por la cordada.</span></h1>
            <div className="c-hero-lado">
              <p style={{ margin: 0 }}>Tu coach te prepara para tu proyecto y te acompaña cuando lo encadenas. Tu club te espera cada mes.</p>
              <a className="c-boton c-boton-blanco" href="#sesiones">Ven a una sesión abierta <span className="c-flecha" aria-hidden="true">→</span></a>
            </div>
          </div>
        </section>

        <section className="c-contenedor c-seccion">
          <span className="c-etiqueta">Sesión abierta · la puerta de entrada</span>
          <h2 className="c-titulo" data-c-palabras=""><span className="c-degrade">Empieza gratis,</span> en una sesión abierta.</h2>
          <p className="c-bajada c-bajada-fuerte">Todos los sábados, con equipo prestado y tres niveles para elegir.</p>
          <div className="c-datos">
            {[["Gratis", "Abierto a todos. No tienes que ser del club."], ["3 niveles", "De nunca he escalado a ya hago 6a. Eliges el tuyo."], ["Equipo", "Zapatillas, arnés y magnesio, prestados."], ["Puntos", "Cada sesión suma un punto. Los canjeas por clases."]].map(([t, d], i) => (
              <div key={t} className="c-dato" data-c-revelar="" style={{ "--i": i } as React.CSSProperties}><h3>{t}</h3><p>{d}</p></div>
            ))}
          </div>
        </section>

        <Eventos />

        <section className="c-contenedor c-seccion">
          <span className="c-etiqueta">Así entras al club</span>
          <h2 className="c-titulo c-titulo-m" data-c-palabras="">¿Quieres que alguien te prepare <span className="c-degrade">para tu proyecto?</span></h2>
          <p className="c-bajada">Tu primer V3 o tu próximo 7a. Querer es fácil; lo difícil es saber cómo entrenar y no soltarlo a la tercera semana. Para eso está el club.</p>
          <div className="c-datos">
            {[["Al entrar", "Te evaluamos", "Fuerza de dedos, movilidad y técnica. Con eso y tu meta armamos tu plan."], ["Cada semana", "Entrenas con tu plan", "Cada lunes tienes lista tu semana, en tu celular. Dos sesiones de fuerza y una de muro en grupo."], ["Cuando toca", "Vas por tu proyecto", "Estrategia antes y el club abajo asegurando. Después, un reto nuevo."], ["Todo el mes", "Te acompaña el club", "Encuentros cada mes, salidas a roca y gente con quien escalar."]].map(([cuando, t, d], i) => (
              <div key={t} className="c-paso" data-c-revelar="" style={{ "--i": i } as React.CSSProperties}>
                <span className="c-cifra c-paso-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="c-etiqueta">{cuando}</span><h3>{t}</h3><p>{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="c-contenedor c-seccion c-persona" id="coach" style={{ paddingTop: 0 }}>
          <div className="c-foto"><Muro semilla={12} presas={22} inclinado /></div>
          <div>
            <span className="c-etiqueta">Tu coach</span>
            <h2 className="c-persona-nombre" data-c-palabras="">Cata</h2>
            <div className="c-persona-texto">
              <p>Escaladora desde los 14, instructora de la federación y kinesióloga. Arma tu plan, corrige tu técnica en el muro y te frena cuando hace falta.</p>
              <p>Una vez que entras, la conversación es con ella: te escribe, le escribes y van ajustando juntas.</p>
            </div>
          </div>
        </section>

        <section className="c-contenedor" style={{ paddingBottom: "var(--c-seccion)" }}>
          <span className="c-etiqueta">Reseñas</span>
          <h2 className="c-titulo c-titulo-m" data-c-palabras="">Lo que dicen en el club.</h2>
          <div className="c-resenas">
            {RESENAS.map(([t, quien, desde]) => <figure key={quien} className="c-resena"><blockquote>{t}</blockquote><figcaption><b>{quien}</b> · {desde}</figcaption></figure>)}
          </div>
        </section>

        <Planes />
        <ElClub />
        <Tienda />
        <div id="app"><LaApp /></div>

        <section className="c-contenedor c-seccion">
          <span className="c-etiqueta">Preguntas</span>
          <h2 className="c-titulo c-titulo-m" data-c-palabras="">Lo que más nos preguntan.</h2>
          <div className="c-preguntas">
            {PREGUNTAS.map(([p, r], i) => <details key={p} className="c-pregunta" open={i === 0}><summary><span>{p}</span></summary><p>{r}</p></details>)}
          </div>
        </section>

        <section className="c-contenedor" style={{ paddingBottom: "var(--c-seccion)" }}>
          <span className="c-etiqueta">Para usar la línea</span>
          <pre className="vc-codigo">{`<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wdth,wght@75..100,400..700&family=Outfit:wght@600..900&display=swap" rel="stylesheet" />
<body class="club">            <!-- paletas: c-paleta-brasa · c-paleta-lima · c-paleta-marea -->

import "@lucas-vergara/estilos/tokens.css";
import "@lucas-vergara/estilos/lineas/club.css";
import { iniciarClub, IndicadorPasos, Telefono, useProgresoFijo } from "@lucas-vergara/estilos/club";

useEffect(() => iniciarClub(), []);      // palabras que entran desenfocadas: data-c-palabras, data-c-revelar
<h2 className="c-titulo" data-c-palabras="">Elige <span className="c-degrade">tu plan.</span></h2>`}</pre>
        </section>

        <section className="c-modulo c-cierre" id="contacto">
          <div className="c-cierre-texto">
            <h2 className="c-titulo c-titulo-m" data-c-palabras="">¿Cuál es tu próximo proyecto?</h2>
            <p>Cuéntanos y vemos tu plan. Las sesiones abiertas siguen siendo gratis.</p>
            <div className="c-cierre-botones">
              <button type="button" className="c-boton c-boton-blanco" onClick={() => setContacto(true)}>Quiero más información</button>
              <a className="c-boton c-boton-contorno" href="#contacto">Escríbenos por WhatsApp</a>
            </div>
          </div>
          <div className="c-foto c-foto-fundido"><Muro semilla={31} presas={30} inclinado /></div>
        </section>
      </main>

      <footer className="c-pie c-contenedor">
        <div className="c-pie-grilla">
          <div>
            <span className="c-marca"><span className="c-marca-nombre">roca</span><span className="c-marca-sub">Club<br />de escalada</span></span>
            <p>Club de ejemplo para la vitrina de la línea club. De tu primer bloque a tu primer 7a.</p>
          </div>
          <div><h4>El club</h4><ul><li><a href="#coach">Coach</a></li><li><a href="#club">El mes del club</a></li><li><a href="#planes">Planes</a></li></ul></div>
          <div><h4>Otras líneas</h4><ul><li><a href="./">Panel</a></li><li><a href="sitio.html">Sitio</a></li><li><a href="3d.html">3d</a></li><li><a href="sitio-disenadora.html">Sitio diseñadora</a></li><li><a href="luz.html">Luz</a></li></ul></div>
          <div><h4>Miembros</h4><ul><li><a href="#app">Entrar</a></li><li><a href="#">Términos</a></li><li><a href="#">Privacidad</a></li></ul></div>
        </div>
        <div className="c-pie-legal"><span>© 2026 Roca · club de ejemplo</span><CreditoEstilos /></div>
      </footer>

      <div className="vc-controles" role="group" aria-label="Paleta">
        {PALETAS.map((p) => <button key={p.valor} type="button" aria-pressed={paleta === p.valor} onClick={() => setPaleta(p.valor)}><i className={`c-paleta-${p.valor}`} />{p.texto}</button>)}
      </div>
      <button type="button" className="c-flotante" aria-label="Escríbenos" onClick={() => setContacto(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z" /></svg>
      </button>
      <Contacto abierto={contacto} cerrar={() => setContacto(false)} alEnviar={(n) => { setContacto(false); setAviso(`Listo, ${n}: te escribimos esta semana.`); }} />
      {aviso && <div className="c-aviso" role="status">{aviso}</div>}
    </>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><Vitrina /></StrictMode>);
