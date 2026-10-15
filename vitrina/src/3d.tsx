import { StrictMode, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { BotonSonido, NavPildora, Palabras, iniciarMovimiento, sonidos, useSeccionActiva } from "../../src/sitio";
import {
  Bloques3D, Carrusel3D, Silueta3D, FORMAS_PARTICULAS, Grilla3D, Objeto3D, Orbe3D, Particulas3D, Terreno3D, Tunel3D, Vidrio3D,
  type DatosSilueta, type EstiloSilueta, type EstiloTerreno, type FormaObjeto, type FormaParticulas, type FormaVidrio,
} from "../../src/3d";
import { SelectorPaleta, usePaleta } from "./paletas";
import "../../css/tokens.css";
import "../../css/acentos/azul.css";
import "../../css/base.css";
import "../../css/lineas/sitio.css";
import "../../css/lineas/3d.css";
import "./vitrina-3d.css";

// Vitrina de la línea "3d": cada escena de @lucas-vergara/estilos/3d en su escenario. Contenido genérico.

const ENLACES = [
  { id: "inicio", texto: "Inicio" },
  { id: "objetos", texto: "Objetos" },
  { id: "materia", texto: "Materia" },
  { id: "espacios", texto: "Espacios" },
  { id: "recorrido", texto: "Recorrido" },
];

// Mariposa genérica dibujada para la demo (viewBox 100): cuatro alas que aletean, cuerpo y antenas.
const MARIPOSA: DatosSilueta = {
  formas: [
    "M48,44 C40,28 24,16 10,20 C8,32 16,44 30,48 C38,50 44,49 48,48 Z",
    "M52,44 C60,28 76,16 90,20 C92,32 84,44 70,48 C62,50 56,49 52,48 Z",
    "M48,50 C40,52 28,58 24,70 C28,80 40,76 48,56 Z",
    "M52,50 C60,52 72,58 76,70 C72,80 60,76 52,56 Z",
    "M50,36 C53,36 54,40 54,46 L53,70 Q50,76 47,70 L46,46 C46,40 47,36 50,36 Z",
  ],
  lineas: ["M49,37 C47,30 44,26 40,24", "M51,37 C53,30 56,26 60,24", "M16,24 L28,32 L40,40", "M84,24 L72,32 L60,40"],
  nodos: [[40, 24, 1.8], [60, 24, 1.8]],
  aletean: [0, 1, 2, 3],
};

function Selector<T extends string>({ opciones, valor, setValor, etiqueta }: { opciones: readonly T[]; valor: T; setValor: (v: T) => void; etiqueta: string }) {
  return (
    <div className="td-selector" role="group" aria-label={etiqueta}>
      {opciones.map((o) => <button key={o} type="button" aria-pressed={valor === o} onClick={() => { setValor(o); sonidos.clic(); }}>{o}</button>)}
    </div>
  );
}

function Ficha({ indice, titulo, texto, chips, children }: { indice: string; titulo: string; texto: string; chips: string[]; children?: ReactNode }) {
  return (
    <div className="td-ficha" data-reveal="">
      <span className="s-etiqueta">{indice}</span>
      <h3 className="s-titulo">{titulo}</h3>
      <p className="s-lead">{texto}</p>
      <div className="s-chips">{chips.map((c) => <span className="s-chip" key={c}>{c}</span>)}</div>
      {children}
    </div>
  );
}

function Tresd() {
  const activo = useSeccionActiva(ENLACES.map((e) => e.id));
  const [paleta, setPaleta] = usePaleta();
  const [noche, setNoche] = useState(false);
  const [particulas, setParticulas] = useState<FormaParticulas | "auto">("auto");
  const [objeto, setObjeto] = useState<FormaObjeto>("burbuja");
  const [vidrio, setVidrio] = useState<FormaVidrio>("prisma");
  const [terreno, setTerreno] = useState<EstiloTerreno>("puntos");
  const [silueta, setSilueta] = useState<EstiloSilueta>("neon");

  useEffect(() => iniciarMovimiento(), []);
  useEffect(() => { document.body.classList.toggle("s-oscuro", noche); }, [noche]);

  return (
    <>
      <div className="s-progreso" data-progreso-scroll="" aria-hidden="true" />
      <header className="s-cabecera" data-ocultable="">
        <a className="s-marca" href="#inicio"><span className="marca-cubo" aria-hidden="true" />Línea 3d</a>
        <NavPildora enlaces={ENLACES} activo={activo} onIr={(e) => document.getElementById(e.id)?.scrollIntoView({ behavior: "smooth" })} />
        <div className="s-cabecera-acciones">
          <BotonSonido />
          <button type="button" className="s-boton-icono" aria-pressed={noche} aria-label={noche ? "Volver al día" : "Modo noche"} title={noche ? "Volver al día" : "Modo noche"} onClick={() => { setNoche(!noche); sonidos.clic(); }}>
            {noche ? "☀" : "☾"}
          </button>
        </div>
      </header>

      <main>
        <section className="s-hero" id="inicio">
          <div className="s-ancho td-dueto vt-hero">
            <div className="s-hero-texto">
              <span className="s-estado" data-reveal="">Escenas con Three.js</span>
              <h1 className="s-display s-nombre" data-reveal=""><span>Línea </span><span>3d</span></h1>
              <Palabras modo="stagger" como="p" className="s-subtitulo" texto="Objetos, materia y espacios en *3D*, con los colores de la paleta. Livianos y sin modelos externos." />
              <p className="s-lead" data-reveal="">Cada escena se pausa fuera de pantalla y, con movimiento reducido, queda quieta.</p>
            </div>
            <div className="td-escenario vt-sin-caja" style={{ "--td-proporcion": "1" } as CSSProperties} data-reveal="escala">
              <Particulas3D forma={particulas === "auto" ? undefined : particulas} />
              <Selector etiqueta="Forma de las partículas" opciones={["auto", ...FORMAS_PARTICULAS] as const} valor={particulas} setValor={setParticulas} />
            </div>
          </div>
        </section>

        <section className="s-seccion" id="objetos">
          <div className="s-ancho s-pila" style={{ gap: "clamp(56px, 8vw, 120px)" }}>
            <div className="td-dueto">
              <Ficha indice="01 · Objeto" titulo="Burbuja, nudo y anillos" texto="Un objeto brillante que flota, mira hacia el cursor y rebota al tocarlo, con sonido si está activado." chips={["Objeto3D", "Material físico", "Resorte"]} />
              <div className="td-escenario" style={{ "--td-proporcion": "1" } as CSSProperties} data-reveal="escala">
                <Objeto3D forma={objeto} />
                <Selector etiqueta="Forma del objeto" opciones={["burbuja", "nudo", "anillos"] as const} valor={objeto} setValor={setObjeto} />
              </div>
            </div>
            <div className="td-dueto td-dueto-invertido">
              <Ficha indice="02 · Orbe" titulo="Orbe de degradado" texto="Una esfera deformada con ruido en el shader que mezcla acento, destello y acento suave. Se agita al acercarte y al tocarla." chips={["Orbe3D", "Shader", "Ruido simplex"]} />
              <div className="td-escenario" style={{ "--td-proporcion": "1" } as CSSProperties} data-reveal="escala">
                <Orbe3D />
              </div>
            </div>
          </div>
        </section>

        <section className="s-seccion" id="materia">
          <div className="s-ancho s-pila">
            <Ficha indice="03 · Vidrio" titulo="Vidrio sobre texto" texto="Una pieza de vidrio con refracción y un leve arcoíris en los bordes, delante de un texto grande. Se inclina hacia el cursor." chips={["Vidrio3D", "Transmisión", "Dispersión"]} />
            <div className="td-escenario" style={{ "--td-proporcion": "16 / 8" } as CSSProperties} data-reveal="escala">
              <Vidrio3D forma={vidrio} texto="Claro" />
              <Selector etiqueta="Forma del vidrio" opciones={["prisma", "lente", "nudo"] as const} valor={vidrio} setValor={setVidrio} />
            </div>
          </div>
        </section>

        <section id="espacios">
          <div className="td-escenario-pleno">
            <Terreno3D estilo={terreno} />
            <div className="td-sobre">
              <div className="s-ancho"><div className="td-panel s-pila" style={{ gap: 12 }}>
                <span className="s-etiqueta">04 · Paisaje</span>
                <h2 className="s-titulo">Colinas que avanzan</h2>
                <p className="s-lead">Un terreno de puntos o de malla que se levanta bajo el cursor. Para el fondo de un hero o una sección.</p>
              </div></div>
            </div>
            <Selector etiqueta="Estilo del paisaje" opciones={["puntos", "malla"] as const} valor={terreno} setValor={setTerreno} />
          </div>

          <div className="s-seccion">
            <div className="s-ancho s-pila" style={{ gap: "clamp(56px, 8vw, 120px)" }}>
              <div className="td-dueto">
                <Ficha indice="05 · Bloques" titulo="Piso de bloques" texto="Columnas que respiran como una ola y se levantan bajo el cursor, tomando el color del acento." chips={["Bloques3D", "Instancias", "Isométrico"]} />
                <div className="td-escenario" style={{ "--td-proporcion": "1" } as CSSProperties} data-reveal="escala">
                  <Bloques3D />
                </div>
              </div>
              <div className="s-pila">
                <Ficha indice="06 · Carrusel" titulo="Carrusel en cilindro" texto="Tarjetas curvas en círculo que giran solas y se arrastran con inercia. Pueden ser texto o imágenes." chips={["Carrusel3D", "Arrastrar", "Texturas"]}>
                  <span className="td-pista">Arrastra para girar</span>
                </Ficha>
                <div className="td-escenario" style={{ "--td-proporcion": "16 / 8" } as CSSProperties} data-reveal="escala">
                  <Carrusel3D tarjetas={[
                    { titulo: "Primero", detalle: "Texto breve" }, { titulo: "Segundo", detalle: "Texto breve" },
                    { titulo: "Tercero", detalle: "Texto breve" }, { titulo: "Cuarto", detalle: "Texto breve" },
                    { titulo: "Quinto", detalle: "Texto breve" }, { titulo: "Sexto", detalle: "Texto breve" },
                    { titulo: "Séptimo", detalle: "Texto breve" }, { titulo: "Octavo", detalle: "Texto breve" },
                  ]} />
                </div>
              </div>
              <div className="s-pila">
                <Ficha indice="07 · Grilla" titulo="Grilla infinita" texto="Un piso de grilla con niebla y una luz que sigue al cursor. También vive en la línea sitio." chips={["Grilla3D"]} />
                <div className="td-escenario" style={{ "--td-proporcion": "16 / 7" } as CSSProperties} data-reveal="escala">
                  <Grilla3D />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="s-seccion">
          <div className="s-ancho td-dueto">
            <Ficha indice="09 · Silueta" titulo="Un dibujo SVG en 3D" texto="Toma los trazos de un ícono o logo y les da volumen; el contorno se dibuja al aparecer y al tocarlo. Neón, cromo iridiscente u holograma con barrido y glitch. Las alas aletean y las cintas se mecen." chips={["Silueta3D", "SVG", "Neón · cromo · holograma"]} />
            <div className="td-escenario" style={{ "--td-proporcion": "1" } as CSSProperties} data-reveal="escala">
              <Silueta3D datos={MARIPOSA} estilo={silueta} />
              <Selector etiqueta="Material de la silueta" opciones={["neon", "cromo", "holograma"] as const} valor={silueta} setValor={setSilueta} />
            </div>
          </div>
        </section>

        <section className="td-recorrido" data-recorrido="" id="recorrido">
          <div className="td-recorrido-fijo">
            <Tunel3D etiquetas={["Idea", "Boceto", "Diseño", "Código", "Lanzamiento"]} />
            <div className="td-sobre">
              <div className="s-ancho"><div className="td-panel s-pila" style={{ gap: 12 }}>
                <span className="s-etiqueta">10 · Recorrido</span>
                <h2 className="s-titulo">Un túnel que avanza al bajar</h2>
                <p className="s-lead">La sección es alta y el lienzo queda fijo: la cámara avanza con el scroll y pasa junto a las tarjetas.</p>
              </div></div>
            </div>
          </div>
        </section>

        <section className="s-seccion">
          <div className="s-ancho s-pila">
            <span className="s-etiqueta">Uso</span>
            <h2 className="s-titulo">Cómo se arma</h2>
            <p className="s-lead">Importa <code>tokens.css</code>, <code>lineas/sitio.css</code> y <code>lineas/3d.css</code>. Las escenas vienen de <code>@lucas-vergara/estilos/3d</code> y necesitan <code>three</code>. Cada una ocupa su contenedor: <code>td-escenario</code>, <code>td-escenario-pleno</code> o <code>td-recorrido</code>.</p>
          </div>
        </section>
      </main>

      <footer className="s-pie">
        <div className="s-wordmark" data-px="0.06">Línea 3d</div>
        <div className="s-pie-fila">
          <span>Sitio de ejemplo · contenido de muestra</span>
          <nav aria-label="Otras líneas">
            <a href="./">Línea panel</a>
            <a href="sitio.html">Línea sitio</a>
            <a href="sitio-disenadora.html">Línea sitio diseñadora</a>
          </nav>
        </div>
      </footer>
      <SelectorPaleta paleta={paleta} setPaleta={setPaleta} />
    </>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><Tresd /></StrictMode>);
