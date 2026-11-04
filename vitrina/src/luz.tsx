import { StrictMode, useEffect, useRef, useState, type CSSProperties } from "react";
import { createRoot } from "react-dom/client";
import "../../css/tokens.css";
import "../../css/lineas/luz.css";
import "./vitrina-luz.css";
import { CapaFondo, FONDOS_LUZ, Luz, NOMBRES_FONDO_LUZ, NOMBRES_ORDEN_LUZ, ORDENES_LUZ, lugarDeLuz, useAcomodoLuces, type FondoLuz, type OrdenLuz } from "../../src/luz/index.js";

// Vitrina de la línea "luz" con datos de ejemplo: el tablero del día, el año de un hábito y las últimas semanas.

const COLORES = ["ambar", "coral", "rosa", "violeta", "azul", "cian", "menta", "lima"] as const;
type Color = (typeof COLORES)[number];

const HABITOS: { nombre: string; color: Color; detalle: string }[] = [
  { nombre: "Leer", color: "ambar", detalle: "20 min" },
  { nombre: "Caminar", color: "menta", detalle: "30 min" },
  { nombre: "Agua", color: "cian", detalle: "2 litros" },
  { nombre: "Meditar", color: "violeta", detalle: "10 min" },
  { nombre: "Dormir antes de las 12", color: "coral", detalle: "" },
];

// Datos de ejemplo estables entre recargas (no aleatorios de verdad)
const hecho = (semilla: number, dia: number) => ((Math.sin(semilla * 97.3 + dia * 12.9898) * 43758.5453) % 1 + 1) % 1 < 0.62;

const HOY = new Date(2026, 9, 24);
const fechaLarga = (d: Date) => d.toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" });

function Tablero() {
  const [hechos, setHechos] = useState<boolean[]>([true, false, true, false, false]);
  const [destello, setDestello] = useState<number | null>(null);
  const cuenta = hechos.filter(Boolean).length;

  const tocar = (i: number) => {
    setHechos((h) => h.map((v, j) => (j === i ? !v : v)));
    if (!hechos[i]) setDestello(i);
  };

  return (
    <section className="vl-tablero" aria-labelledby="vl-hoy">
      <header className="l-encabezado">
        <h1 id="vl-hoy" className="l-fecha">{fechaLarga(HOY)}</h1>
        <p className="l-titulo">
          {cuenta === HABITOS.length ? "Todo encendido hoy" : `${cuenta} de ${HABITOS.length} encendidos`}
        </p>
      </header>
      <div className="l-tablero">
        {HABITOS.map((h, i) => (
          <div key={h.nombre} className={`l-casilla l-color-${h.color}`}>
            <button
              type="button"
              className={`l-luz${destello === i ? " l-destellando" : ""}`}
              aria-pressed={hechos[i]}
              aria-label={`${h.nombre}: ${hechos[i] ? "hecho, tocar para apagar" : "pendiente, tocar para encender"}`}
              onClick={() => tocar(i)}
              onAnimationEnd={() => setDestello(null)}
            />
            <span className="l-nombre">{h.nombre}</span>
            {h.detalle && <span className="l-detalle">{h.detalle}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}

// Fondo y orden: la pantalla de hoy con cualquiera de los fondos y de las formas, y de 1 a 10 luces
function FondoYOrden() {
  const [fondo, setFondo] = useState<FondoLuz>("piscina");
  const [orden, setOrden] = useState<OrdenLuz>("equilibrio");
  const [cantidad, setCantidad] = useState(5);
  const [hechos, setHechos] = useState<boolean[]>([true, false, true, false, false, true, false, false]);
  const tablero = useRef<HTMLDivElement>(null);
  const acomodo = useAcomodoLuces(tablero, orden, cantidad, { etiqueta: 30, maximo: 110 });
  const nombres = ["Leer", "Caminar", "Agua", "Meditar", "Dormir", "Estirar", "Escribir", "Sin pantalla", "Cocinar", "Llamar"];
  const colores = ["ambar", "menta", "cian", "violeta", "azul", "coral", "rosa", "lima"];
  return (
    <section className="vl-seccion" aria-labelledby="vl-fondo">
      <div className="vl-texto">
        <h2 id="vl-fondo">Fondo y orden</h2>
        <p>Catorce fondos zen detrás de las luces (<code>CapaFondo</code>; el agua y las gotas se mueven muy despacio) y seis formas de acomodarlas según cuántas haya (<code>acomodarLuces</code> o <code>useAcomodoLuces</code>, con <code>.l-tablero.l-forma</code>). En reposo, el fondo se apaga.</p>
      </div>
      <div className="vl-selectores">
        <label>Fondo
          <select value={fondo} onChange={(e) => setFondo(e.target.value as FondoLuz)}>
            {FONDOS_LUZ.map((f) => <option key={f} value={f}>{NOMBRES_FONDO_LUZ[f]}</option>)}
          </select>
        </label>
        <label>Orden
          <select value={orden} onChange={(e) => setOrden(e.target.value as OrdenLuz)}>
            {ORDENES_LUZ.map((o) => <option key={o} value={o}>{NOMBRES_ORDEN_LUZ[o]}</option>)}
          </select>
        </label>
        <label>Luces
          <input type="range" min={1} max={10} value={cantidad} onChange={(e) => setCantidad(+e.target.value)} />
          <output>{cantidad}</output>
        </label>
      </div>
      <div className={`vl-pantalla${fondo !== "papel" ? " l-con-fondo" : ""}`}>
        <CapaFondo fondo={fondo} luces={() => tablero.current} />
        <div ref={tablero} className={`l-tablero${orden !== "filas" ? " l-forma" : ""}`}>
          {nombres.slice(0, cantidad).map((n, i) => (
            <Luz key={n} nombre={n} color={colores[i]} hecho={hechos[i]} {...lugarDeLuz(acomodo, i)}
              onCambiar={(v) => setHechos((h) => h.map((x, j) => (j === i ? v : x)))} />
          ))}
        </div>
      </div>
    </section>
  );
}

// El año de un hábito como el calendario original: una columna por mes, una fila por día
function Anio() {
  const meses = Array.from({ length: 12 }, (_, m) => new Date(2026, m + 1, 0).getDate());
  return (
    <section className="vl-seccion" aria-labelledby="vl-anio">
      <div className="vl-texto">
        <h2 id="vl-anio">El año de un hábito</h2>
        <p>Una columna por mes y una fila por día, como el calendario de pared. <code>.l-calendario</code> con <code>--l-columnas: 12</code>; cada día es un <code>.l-punto</code>.</p>
      </div>
      <div className="vl-anio l-color-ambar">
        <div className="vl-meses" aria-hidden="true">{["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"].map((m, i) => <span key={i}>{m}</span>)}</div>
        <div className="l-calendario" style={{ "--l-columnas": 12, gridAutoFlow: "column", gridTemplateRows: "repeat(31, var(--l-tam-punto))" } as CSSProperties}>
          {meses.flatMap((dias, m) =>
            Array.from({ length: 31 }, (_, d) => {
              const fecha = new Date(2026, m, d + 1);
              const fuera = d >= dias;
              const futuro = fecha > HOY;
              const esHoy = fecha.getTime() === HOY.getTime();
              const clase = ["l-punto", fuera && "l-fuera", !fuera && !futuro && hecho(1, m * 31 + d) && "l-encendido", esHoy && "l-hoy"].filter(Boolean).join(" ");
              return <span key={`${m}-${d}`} className={clase} />;
            }),
          )}
        </div>
      </div>
    </section>
  );
}

function Semanas() {
  const dias = 28;
  return (
    <section className="vl-seccion" aria-labelledby="vl-semanas">
      <div className="vl-texto">
        <h2 id="vl-semanas">Las últimas cuatro semanas</h2>
        <p>Una <code>.l-fila</code> por hábito: el nombre y sus puntos, el de hoy con contorno.</p>
      </div>
      <div className="l-filas">
        {HABITOS.map((h, i) => (
          <div key={h.nombre} className={`l-fila l-color-${h.color}`}>
            <span className="l-nombre">{h.nombre}</span>
            <div className="l-calendario">
              {Array.from({ length: dias }, (_, d) => (
                <span key={d} className={["l-punto", hecho(i + 2, d) && "l-encendido", d === dias - 1 && "l-hoy"].filter(Boolean).join(" ")} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Colores() {
  return (
    <section className="vl-seccion" aria-labelledby="vl-colores">
      <div className="vl-texto">
        <h2 id="vl-colores">Colores de las luces</h2>
        <p>Ocho colores vivos que se leen encendidos sobre el papel y sobre el negro del reposo. <code>.l-color-&lt;nombre&gt;</code>, o <code>style="--l-color: #…"</code> si el color viene de los datos.</p>
      </div>
      <div className="vl-colores">
        {COLORES.map((c) => (
          <div key={c} className={`l-casilla l-color-${c}`} style={{ "--l-tam-luz": "56px" } as CSSProperties}>
            <span className="l-luz l-encendida" aria-hidden="true" />
            <span className="l-detalle">{c}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Vitrina() {
  const [reposo, setReposo] = useState(false);
  const temporizador = useRef<number>(0);
  const [auto, setAuto] = useState(false);

  // Con "reposo automático", la pantalla se duerme a los 8 s sin tocar y despierta con cualquier toque
  useEffect(() => {
    document.body.classList.toggle("l-reposo", reposo);
  }, [reposo]);
  useEffect(() => {
    if (!auto) return;
    const despertar = () => {
      setReposo(false);
      clearTimeout(temporizador.current);
      temporizador.current = window.setTimeout(() => setReposo(true), 8000);
    };
    despertar();
    window.addEventListener("pointerdown", despertar);
    return () => { window.removeEventListener("pointerdown", despertar); clearTimeout(temporizador.current); };
  }, [auto]);

  return (
    <>
      <main className="vl-pagina">
        <Tablero />
        <FondoYOrden />
        <Anio />
        <Semanas />
        <Colores />
        <section className="vl-seccion" aria-labelledby="vl-uso">
          <div className="vl-texto">
            <h2 id="vl-uso">Uso</h2>
            <p>Para pantallas que se tocan y se miran de lejos. De día, papel claro; en reposo (<code>.l-reposo</code>), casi negro con las luces tenues. El destello al encender es el único momento con movimiento: <code>.l-destellando</code> mientras dura.</p>
          </div>
          <pre className="vl-codigo">{`import "@lucas-vergara/estilos/tokens.css";
import "@lucas-vergara/estilos/lineas/luz.css";

<body class="luz">   <!-- dormida: class="luz l-reposo" -->
  <div class="l-tablero">
    <div class="l-casilla l-color-menta">
      <button class="l-luz" aria-pressed="true"></button>
      <span class="l-nombre">Caminar</span>
    </div>
  </div>

// React: la luz, el fondo y el orden con forma
import { Luz, CapaFondo, useAcomodoLuces, lugarDeLuz } from "@lucas-vergara/estilos/luz";`}</pre>
        </section>
      </main>
      <footer className="vl-pie">
        <span>Línea luz · datos de ejemplo</span>
        <nav aria-label="Otras líneas">
          <a href="./">Línea panel</a>
          <a href="sitio.html">Línea sitio</a>
          <a href="3d.html">Línea 3d</a>
          <a href="sitio-disenadora.html">Línea sitio diseñadora</a>
        </nav>
      </footer>
      <div className="vl-controles" role="group" aria-label="Estado de la pantalla">
        <button type="button" aria-pressed={!reposo && !auto} onClick={() => { setAuto(false); setReposo(false); }}>De día</button>
        <button type="button" aria-pressed={reposo && !auto} onClick={() => { setAuto(false); setReposo(true); }}>Reposo</button>
        <button type="button" aria-pressed={auto} onClick={() => setAuto(true)}>Dormir a los 8 s</button>
      </div>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Vitrina />
  </StrictMode>,
);
