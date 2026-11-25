import { StrictMode, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "../../css/tokens.css";
import "../../css/acentos/azul.css";
import "../../css/base.css";
import "../../css/lineas/mascota.css";
import "./vitrina-mascota.css";

// Vitrina de la línea "mascota" con una app inventada («Collar»: el registro de las mascotas y los servicios para
// ellas), para mostrar que sirve más allá de Placa, donde nació. Las tres direcciones usan el mismo marcado: solo cambia
// la clase del <body>. La línea no trae JS: los íconos y las ilustraciones van en el proyecto (aquí, en este archivo).

// ── Íconos de trazo (24 px, currentColor) ────────────────────
const T: Record<string, ReactNode> = {
  inicio: <path d="M4 10.4 12 4l8 6.4V19a1 1 0 0 1-1 1h-4.4v-5.6H9.4V20H5a1 1 0 0 1-1-1z" />,
  servicios: <><rect x="4" y="4" width="7" height="7" rx="2.2" /><rect x="13" y="4" width="7" height="7" rx="2.2" /><rect x="4" y="13" width="7" height="7" rx="2.2" /><rect x="13" y="13" width="7" height="7" rx="2.2" /></>,
  actividad: <><circle cx="12" cy="12" r="8.2" /><path d="M12 7.6V12l3 2" /></>,
  cuenta: <><circle cx="12" cy="8.4" r="3.6" /><path d="M4.8 20c1.2-3.7 3.9-5.6 7.2-5.6s6 1.9 7.2 5.6" /></>,
  derecha: <path d="m9.5 6 6 6-6 6" />,
  mas: <path d="M12 5.5v13M5.5 12h13" />,
  vacuna: <><path d="m16.6 3.6 3.8 3.8M18.5 5.5 15.6 8.4" /><path d="m14.2 5.6 4.2 4.2-8.6 8.6H5.6v-4.2z" /><path d="m9.6 10.2 1.6 1.6M11.8 8l1.6 1.6M5.6 18.4 3.4 20.6" /></>,
  antiparasitario: <><path d="M12 3.4 19 6v5.6c0 4.3-2.9 7.6-7 9-4.1-1.4-7-4.7-7-9V6z" /><path d="M12 8.6c1.4 1.7 2.2 2.9 2.2 3.9a2.2 2.2 0 0 1-4.4 0c0-1 .8-2.2 2.2-3.9z" /></>,
  remedio: <><rect x="2.6" y="8.6" width="18.8" height="6.8" rx="3.4" transform="rotate(-45 12 12)" /><path d="m9.6 9.6 4.8 4.8" /></>,
  veterinario: <><path d="M6 3.6v4.8a4 4 0 0 0 8 0V3.6" /><path d="M10 12.4V15a4.4 4.4 0 0 0 8.8 0v-1.6" /><circle cx="18.8" cy="11.2" r="2.1" /></>,
  peso: <><rect x="3.6" y="4" width="16.8" height="16" rx="4" /><path d="M8.2 10.4a4.6 4.6 0 0 1 7.6 0M12 11.6l1.6-2.6" /></>,
};
const Icono = ({ n, t = 22 }: { n: string; t?: number }) => (
  <svg className="m-icono" width={t} height={t} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{T[n]}</svg>
);
const Cat = ({ tipo, t = 26 }: { tipo: string; t?: number }) => (
  <span className={`m-cat m-cat-${tipo}`} style={{ width: t, height: t }} aria-hidden="true"><Icono n={tipo} t={Math.round(t * 0.55)} /></span>
);

// ── Ilustraciones de los servicios (colores fijos, con luz arriba y sombra abajo) ──
const sombra = <ellipse cx="32" cy="56" rx="20" ry="3.2" fill="#000" opacity="0.12" />;
const DIBUJOS: Record<string, ReactNode> = {
  paseo: <>
    <defs><linearGradient id="v-paseo-c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7ad39b" /><stop offset="1" stopColor="#2f9a62" /></linearGradient>
      <radialGradient id="v-paseo-s" cx="0.35" cy="0.35" r="0.7"><stop offset="0" stopColor="#ffe58a" /><stop offset="1" stopColor="#f5b52e" /></radialGradient></defs>
    {sombra}<circle cx="45" cy="17" r="8.5" fill="url(#v-paseo-s)" /><path d="M6 52c4-12 14-19 26-19s22 7 26 19z" fill="url(#v-paseo-c)" />
    <path d="M33 52c-1-5 1-9 6-12 3-2 5-4 5-7" fill="none" stroke="#fff6dc" strokeWidth="3.2" strokeLinecap="round" />
    <rect x="15.4" y="33" width="3.2" height="9" rx="1.4" fill="#8a5a33" /><circle cx="17" cy="28" r="7.6" fill="#3aa56c" />
  </>,
  visita: <>
    <defs><linearGradient id="v-visita-t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff9a6b" /><stop offset="1" stopColor="#d9562e" /></linearGradient></defs>
    {sombra}<path d="M14 30h36v22a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2z" fill="#f7ead9" />
    <path d="M8.5 31.5 32 12l23.5 19.5a2 2 0 0 1-2.6 3L32 17.6 11.1 34.5a2 2 0 0 1-2.6-3z" fill="url(#v-visita-t)" />
    <rect x="26" y="38" width="12" height="16" rx="2.5" fill="#2a87a6" /><circle cx="35" cy="46.5" r="1.2" fill="#ffd66b" />
    <path d="M46 9.5c1.8-2.6 6-1.8 6 1.6 0 2.8-3.6 5.2-6 7-2.4-1.8-6-4.2-6-7 0-3.4 4.2-4.2 6-1.6z" fill="#ff5f7a" />
  </>,
  alojamiento: <>
    <defs><linearGradient id="v-aloja-t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8c8cf5" /><stop offset="1" stopColor="#5148c9" /></linearGradient></defs>
    {sombra}<path d="M12 30h40v22a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2z" fill="#e6e3fa" />
    <path d="M7 31.5 32 13l25 18.5a2 2 0 0 1-2.4 3.2L32 18 9.4 34.7A2 2 0 0 1 7 31.5z" fill="url(#v-aloja-t)" />
    <rect x="19" y="36" width="10" height="9" rx="2" fill="#f7c23c" /><rect x="35" y="36" width="10" height="9" rx="2" fill="#f7c23c" />
    <path d="M50.5 6.5a7 7 0 1 0 6.2 10.4 5.6 5.6 0 0 1-6.2-10.4z" fill="#ffd25e" />
  </>,
  vacuna: <>
    {sombra}
    <g transform="rotate(45 30 30)">
      <rect x="24" y="2" width="12" height="4" rx="2" fill="#7d8aa0" /><rect x="28.5" y="5" width="3" height="8" fill="#9aa6ba" />
      <rect x="22" y="12" width="16" height="4" rx="2" fill="#7d8aa0" /><rect x="24" y="15" width="12" height="27" rx="3" fill="#cfe8fa" />
      <rect x="24" y="26" width="12" height="16" rx="3" fill="#3f8ef0" /><path d="M27 42h6l-1.6 6h-2.8z" fill="#9aa6ba" />
      <rect x="29.3" y="47" width="1.4" height="9" rx="0.7" fill="#7d8aa0" />
    </g>
    <path d="M48 32.5 56 35.6v6.2c0 4.8-3.3 8.4-8 10-4.7-1.6-8-5.2-8-10v-6.2z" fill="#2fb06a" />
    <path d="m44.6 42 2.4 2.4 4.6-4.8" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </>,
};
const Ilustracion = ({ id }: { id: string }) => <svg className="m-ilustracion" viewBox="0 0 64 64" aria-hidden="true">{DIBUJOS[id]}</svg>;

// ── Las mascotas de muestra: cabeza de gato o de perro en el color de cada una ──
const C = { fondo: "color-mix(in srgb, var(--m-color) 16%, var(--m-superficie))", cuerpo: "var(--m-color)", sombra: "color-mix(in srgb, var(--m-color) 70%, #000)", claro: "color-mix(in srgb, var(--m-color) 28%, #fff)", tinta: "color-mix(in srgb, var(--m-color) 18%, #1a120d)" };
const Gato = () => (
  <svg viewBox="0 0 200 200" aria-hidden="true"><rect width="200" height="200" style={{ fill: C.fondo }} />
    <path d="M46 104 L56 30 L100 66 Z M154 104 L144 30 L100 66 Z" style={{ fill: C.cuerpo }} /><path d="M60 78 L64 46 L86 66 Z M140 78 L136 46 L114 66 Z" style={{ fill: C.claro }} />
    <ellipse cx="100" cy="118" rx="62" ry="54" style={{ fill: C.cuerpo }} />
    <path d="M66 110 Q78 98 90 110 Q78 120 66 110 Z M110 110 Q122 98 134 110 Q122 120 110 110 Z M92 128 H108 L100 137 Z" style={{ fill: C.tinta }} />
    <path d="M100 137 Q100 147 89 148 M100 137 Q100 147 111 148 M72 132 L36 126 M128 132 L164 126" style={{ fill: "none", stroke: C.tinta, strokeWidth: 3, strokeLinecap: "round", opacity: 0.75 }} /></svg>
);
const Perro = () => (
  <svg viewBox="0 0 200 200" aria-hidden="true"><rect width="200" height="200" style={{ fill: C.fondo }} />
    <ellipse cx="100" cy="112" rx="54" ry="60" style={{ fill: C.cuerpo }} /><ellipse cx="100" cy="142" rx="34" ry="27" style={{ fill: C.claro }} />
    <path d="M60 64 C34 60 20 96 28 134 C32 150 52 150 56 134 C60 112 62 92 74 70 Z M140 64 C166 60 180 96 172 134 C168 150 148 150 144 134 C140 112 138 92 126 70 Z" style={{ fill: C.sombra }} />
    <circle cx="80" cy="106" r="7" style={{ fill: C.tinta }} /><circle cx="120" cy="106" r="7" style={{ fill: C.tinta }} /><ellipse cx="100" cy="128" rx="12" ry="8.5" style={{ fill: C.tinta }} /></svg>
);
const MASCOTAS = [
  { nombre: "Luna", detalle: "Gata · 3 años", tipo: "gato", estado: "m-vencido", texto: "Atrasado" },
  { nombre: "Rocco", detalle: "Perro · 6 años", tipo: "perro", estado: "m-pronto", texto: "En 4 días" },
  { nombre: "Pimienta", detalle: "Gata · 1 año", tipo: "gato", estado: "m-bien", texto: "Al día" },
];
const Foto = ({ tipo, t }: { tipo: string; t?: number }) => (
  <span className="m-foto" style={t ? ({ "--m-tam-foto": `${t}px` } as CSSProperties) : undefined} aria-hidden="true">{tipo === "gato" ? <Gato /> : <Perro />}</span>
);

const DIRECCIONES = [
  { id: "paseo", nombre: "Paseo 2.0", idea: "Uber + Apple Salud + Flighty" },
  { id: "album", nombre: "Álbum", idea: "Airbnb + Apple Wallet" },
  { id: "agenda", nombre: "Agenda", idea: "Flighty + Things" },
];

function Vitrina() {
  const [direccion, setDireccion] = useState("paseo");
  const [oscuro, setOscuro] = useState(false);
  const [esterilizada, setEsterilizada] = useState(true);
  useEffect(() => {
    document.body.className = `mascota m-direccion-${direccion}`;
  }, [direccion]);
  useEffect(() => {
    if (oscuro) document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
  }, [oscuro]);

  return (
    <>
      <div className="vm-elegir">
        <span className="vm-elegir-titulo">Línea mascota</span>
        <div className="segmentado" role="group" aria-label="Dirección">
          {DIRECCIONES.map((d) => (
            <button key={d.id} type="button" aria-pressed={direccion === d.id} onClick={() => setDireccion(d.id)} title={d.idea}>{d.nombre}</button>
          ))}
        </div>
        <div className="segmentado" role="group" aria-label="Tema">
          <button type="button" aria-pressed={!oscuro} onClick={() => setOscuro(false)}>Claro</button>
          <button type="button" aria-pressed={oscuro} onClick={() => setOscuro(true)}>Oscuro</button>
        </div>
        <span className="vm-idea">{DIRECCIONES.find((d) => d.id === direccion)!.idea}</span>
        <a className="vm-volver" href="./">Otras líneas →</a>
      </div>

      <header className="barra vm-barra">
        <a className="marca" href="#"><span className="vm-logo" aria-hidden="true" />Collar</a>
        <nav className="m-pestanas" aria-label="Principal">
          {[["inicio", "Inicio"], ["servicios", "Servicios"], ["actividad", "Actividad"], ["cuenta", "Cuenta"]].map(([id, nombre], i) => (
            <a key={id} className={`m-pestana${id === "cuenta" ? " m-solo-telefono" : ""}`} href="#" aria-current={i === 0 ? "page" : undefined}><Icono n={id!} />{nombre}</a>
          ))}
        </nav>
        <a className="vm-cuenta" href="#"><span>Sofía</span><span className="vm-avatar">SR</span></a>
      </header>

      <main className="contenido vm-pagina">
        <header className="vm-saludo">
          <h1>Hola, Sofía</h1>
          <p className="nota">Atrasado: la pipeta de Luna (hace 2 días).</p>
        </header>

        <div className="vm-dos">
          <div className="vm-columna">
            <section className="m-ahora m-color-2" aria-label="Ahora">
              <span className="m-ahora-etiqueta"><span className="m-ahora-punto" aria-hidden="true" />En curso desde las 9:30</span>
              <p className="m-ahora-titulo">Martina pasea a Rocco</p>
              <p className="m-ahora-detalle">Paseo de 1 hora · termina cerca de las 10:30</p>
              <div className="m-ahora-progreso" aria-hidden="true"><span style={{ "--m-avance": "62%" } as CSSProperties} /></div>
              <div className="m-ahora-pie">
                <span className="m-ahora-quien"><span className="vm-avatar vm-avatar-claro">MP</span><span><b>Martina Pérez</b>Cuida a Rocco</span></span>
                <a className="boton" href="#">Ver el paseo</a>
              </div>
              <ul className="m-ahora-siguientes">
                <li><a href="#"><span>Triple felina de Pimienta <span className="tenue">· viernes, 11:00</span></span><span className="m-estado m-listo">Agendada</span></a></li>
              </ul>
            </section>

            <section>
              <div className="m-seccion-cabeza"><h2>Tus mascotas</h2></div>
              <ul className="m-mascotas-fila">
                {MASCOTAS.map((m, i) => (
                  <li key={m.nombre}>
                    <a className={`m-mini m-color-${i + 1}`} href="#">
                      <Foto tipo={m.tipo} />
                      <span className="m-mini-nombre">{m.nombre}</span>
                      <span className="m-mini-detalle">{m.detalle}</span>
                      <span className={`m-estado ${m.estado}`}>{m.texto}</span>
                    </a>
                  </li>
                ))}
                <li><a className="m-mini m-mini-nueva" href="#"><span className="m-mini-mas"><Icono n="mas" /></span><span className="m-mini-nombre">Nueva mascota</span></a></li>
              </ul>
            </section>

            <section>
              <div className="m-seccion-cabeza"><h2>Pide un servicio</h2><a className="m-ver-todo" href="#">Ver todo<Icono n="derecha" /></a></div>
              <ul className="m-servicios">
                {[["paseo", "Paseo"], ["visita", "Visita"], ["alojamiento", "Alojamiento"], ["vacuna", "Vacuna"]].map(([id, nombre]) => (
                  <li key={id}><a className="m-servicio" href="#"><Ilustracion id={id!} /><span className="m-servicio-nombre">{nombre}</span></a></li>
                ))}
              </ul>
            </section>
          </div>

          <section className="tarjeta vm-proximos">
            <div className="m-seccion-cabeza"><h2>Próximos</h2></div>
            <ul className="m-vencimientos">
              <li className="m-vencimiento m-vencido m-color-1"><span className="m-vencimiento-marca">2<small>atraso</small></span><span className="m-vencimiento-titulo">Pipeta · <a href="#">Luna</a></span><span className="m-estado">Atrasada: hace 2 días</span><span className="m-vencimiento-fecha">23 nov</span></li>
              <li className="m-vencimiento m-hoy m-color-3"><span className="m-vencimiento-marca">Hoy</span><span className="m-vencimiento-titulo">Termina el antibiótico · <a href="#">Pimienta</a></span><span className="m-estado">Hoy</span><span className="m-vencimiento-fecha">25 nov</span></li>
              <li className="m-vencimiento m-pronto m-color-2"><span className="m-vencimiento-marca">4<small>días</small></span><span className="m-vencimiento-titulo">Control veterinario · <a href="#">Rocco</a></span><span className="m-estado">En 4 días</span><span className="m-vencimiento-fecha">29 nov<a href="#">Agendar</a></span></li>
              <li className="m-vencimiento m-programado m-color-1"><span className="m-vencimiento-marca">5<small>meses</small></span><span className="m-vencimiento-titulo">Vacuna antirrábica · <a href="#">Luna</a></span><span className="m-estado">En 150 días</span><span className="m-vencimiento-fecha">24 abr</span></li>
            </ul>
          </section>
        </div>

        <section className="vm-ficha m-color-2" aria-label="Ficha de Rocco">
          <div className="vm-ficha-cabeza">
            <Foto tipo="perro" t={96} />
            <div>
              <h2 className="vm-ficha-nombre">Rocco</h2>
              <p className="nota">Perro · 6 años · Mestizo</p>
              <p className="m-estado m-pronto">Lo próximo: control veterinario, en 4 días.</p>
            </div>
          </div>
          <div className="m-seccion-cabeza"><h2>Resumen</h2></div>
          <ul className="m-resumen">
            <li><div className="m-dato"><span className="m-dato-cabeza m-cat-veterinario"><Cat tipo="veterinario" /><span className="m-cat-texto">Lo próximo</span></span><p className="m-dato-cifra">4<small>días</small></p><p className="m-dato-nota">Control veterinario</p><span className="m-estado m-pronto">En 4 días</span></div></li>
            <li><div className="m-dato"><span className="m-dato-cabeza m-cat-peso"><Cat tipo="peso" /><span className="m-cat-texto">Peso</span></span><p className="m-dato-cifra">21,4<small>kg</small></p><p className="m-dato-nota">▼ 0,6 kg desde el 2 oct</p></div></li>
            <li><div className="m-dato"><span className="m-dato-cabeza m-cat-vacuna"><Cat tipo="vacuna" /><span className="m-cat-texto">Vacunas</span></span><p className="m-dato-cifra m-dato-texto">Al día</p><p className="m-dato-nota">Última: óctuple, 12 mar</p><span className="m-estado m-bien">Al día</span></div></li>
            <li><div className="m-dato"><span className="m-dato-cabeza m-cat-remedio"><Cat tipo="remedio" /><span className="m-cat-texto">Remedio</span></span><p className="m-dato-cifra m-dato-texto">Condroprotector</p><p className="m-dato-nota">1 comprimido al día</p></div></li>
          </ul>

          <div className="vm-dos vm-dos-parejo">
            <section className="tarjeta">
              <div className="m-seccion-cabeza"><h2>Actividad</h2></div>
              <ul className="m-filas">
                <li><a className="m-fila" href="#"><span className="vm-avatar vm-avatar-claro">MP</span><span className="m-fila-que"><b>Paseo de 1 hora · Rocco con Martina</b><span className="tenue">hoy, 9:30</span></span><span className="m-fila-estado"><span className="m-estado m-hoy">En curso</span><span className="tenue">$11.000</span></span></a></li>
                <li><a className="m-fila" href="#"><span className="vm-avatar vm-avatar-claro">CA</span><span className="m-fila-que"><b>Triple felina · Pimienta</b><span className="tenue">viernes, 11:00 · Clínica Los Aromos</span></span><span className="m-fila-estado"><span className="m-estado m-listo">Agendada</span><span className="tenue">$18.000</span></span></a></li>
                <li><a className="m-fila" href="#"><span className="vm-avatar vm-avatar-claro">JS</span><span className="m-fila-que"><b>Visita · Luna con Javier</b><span className="tenue">martes, 18:00</span></span><span className="m-fila-estado"><span className="m-estado m-programado">Cerrada</span><span className="tenue">$9.000</span></span></a></li>
              </ul>
            </section>

            <form className="tarjeta vm-controles" onSubmit={(e) => e.preventDefault()}>
              <div className="m-seccion-cabeza"><h2>Registrar</h2></div>
              <div className="vm-fila">
                <button type="submit" className="boton boton-primario">Guardar vacuna</button>
                <button type="button" className="boton m-boton-suave">Le di la pipeta hoy</button>
                <button type="button" className="boton">Cancelar</button>
                <button type="button" className="boton m-boton-peligro">Borrar</button>
              </div>
              <div className="vm-campos">
                <label className="campo">Vacuna<input defaultValue="Antirrábica" /></label>
                <label className="campo">Próxima dosis<input type="date" defaultValue="2027-11-25" /></label>
                <div className="campo" role="group" aria-label="Esterilizado"><span>Esterilizado</span>
                  <span className="segmentado"><button type="button" aria-pressed={esterilizada} onClick={() => setEsterilizada(true)}>Sí</button><button type="button" aria-pressed={!esterilizada} onClick={() => setEsterilizada(false)}>No</button></span>
                </div>
              </div>
              <div className="vm-fila">
                {["vacuna", "antiparasitario", "remedio", "veterinario", "peso"].map((t) => <Cat key={t} tipo={t} t={40} />)}
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><Vitrina /></StrictMode>);
