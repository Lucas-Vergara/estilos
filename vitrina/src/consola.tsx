import { StrictMode, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { BotonTema, CreditoEstilos, Segmentado } from "../../src";
import "../../css/tokens.css";
import "../../css/acentos/azul.css";
import "../../css/base.css";
import "../../css/lineas/consola.css";

// Vitrina de la línea consola: la estructura (lateral, barra), una sesión con un agente y las clases de panel vestidas.

const i = (d: ReactNode) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);
const nueva = i(<><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></>);
const reloj = i(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>);
const carpeta = i(<path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4l2 2h9A1.5 1.5 0 0 1 21 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5Z" />);
const menu = i(<path d="M4 7h16M4 12h16M4 17h16" />);
const enviar = i(<path d="M12 19V5M6 11l6-6 6 6" />);
const mas = i(<path d="M12 5v14M5 12h14" />);

type Vista = "sesion" | "datos";

function Vitrina() {
  const [vista, setVista] = useState<Vista>("sesion");
  const [abierta, setAbierta] = useState(false);
  const [filtro, setFiltro] = useState("todas");
  return (
    <div className="co-app">
      <aside id="co-lateral" className={`co-lateral${abierta ? " abierta" : ""}`} aria-label="Navegación">
        <div className="co-lateral-interior">
        <a href="./consola.html" className="co-marca"><span>consola</span><span className="co-sello">ESTILOS</span></a>
        <button type="button" className={`co-nueva${vista === "sesion" ? " active" : ""}`} onClick={() => setVista("sesion")}>{nueva}Nueva sesión</button>
        <nav className="co-nav" aria-label="Herramientas">
          <button type="button" className={`co-item${vista === "datos" ? " active" : ""}`} style={{ border: 0, background: vista === "datos" ? undefined : "none", font: "inherit", textAlign: "left" }} onClick={() => setVista("datos")}>{reloj}<span>Automatización</span></button>
        </nav>
        <div className="co-grupo">
          <div className="co-grupo-cabecera"><span className="co-grupo-titulo">Espacios de trabajo</span></div>
          <ul className="co-lista">
            <li className="co-espacio">
              <div className="co-espacio-fila">
                <button type="button" className="co-item co-boton-item" aria-expanded="true">{carpeta}<span>panel-proyectos</span></button>
                <a href="#" className="co-icono co-icono-chico co-espacio-nueva" aria-label="Nueva sesión en panel-proyectos">{mas}</a>
              </div>
              <ul className="co-lista">
                <li><a href="#" className="co-item co-item-sub co-sesion-item active"><span>¿En qué quedó la fase 4?</span></a></li>
                <li><a href="#" className="co-item co-item-sub co-sesion-item"><span>Revisar el diseño de Tareas, con un título largo que se corta</span><i className="co-marca-sesion espera" aria-label="Espera tu permiso" /></a></li>
                <li className="co-vacio co-vacio-sub">y 3 más antiguas</li>
              </ul>
            </li>
            {["habitos", "franservice"].map((n) => (
              <li key={n}><a href="#" className="co-item">{carpeta}<span>{n}</span></a></li>
            ))}
          </ul>
        </div>
        <div className="co-grupo">
          <div className="co-grupo-cabecera"><span className="co-grupo-titulo">Otras líneas</span></div>
          <ul className="co-lista">
            {[["./", "Panel"], ["sitio.html", "Sitio"], ["luz.html", "Luz"], ["club.html", "Club"]].map(([h, n]) => (
              <li key={h}><a href={h} className="co-item co-item-sub"><span>{n}</span></a></li>
            ))}
          </ul>
        </div>
        <div className="co-pie-lateral">
          <span className="co-avatar" aria-hidden="true">L</span>
          <span className="co-cuenta">Lucas</span>
          <BotonTema predeterminado="dark" clave="consola:tema" className="co-icono" tamano={16} />
        </div>
        </div>
      </aside>
      <div className={`co-fondo${abierta ? " visible" : ""}`} onClick={() => setAbierta(false)} aria-hidden="true" />

      <div className="co-principal">
        <header className="co-barra">
          <button type="button" className="co-icono co-menu" aria-label="Abrir la navegación" aria-expanded={abierta} onClick={() => setAbierta(true)}>{menu}</button>
          <span className="co-ruta"><a href="#">panel-proyectos</a><i aria-hidden="true">›</i><b>{vista === "sesion" ? "¿En qué quedó la fase 4?" : "Automatización"}</b></span>
        </header>
        <main className="contenido">
          {vista === "sesion" ? (
            <div className="co-sesion">
              <div className="co-hilo">
                <div className="co-turno-usuario"><p>¿En qué quedó la fase 4 y qué falta?</p></div>
                <div className="co-turno-claude">
                  <details className="co-pensamiento" open>
                    <summary><span className="co-resumen-trabajo">Pensó y usó 2 herramientas</span></summary>
                    <div className="co-pasos">
                      <p className="co-paso-pensamiento">Reviso la cola, el informe de la última corrida y el log de la rama.</p>
                      <span className="co-herramienta"><b>Read</b>tareas/cola.md</span>
                      <span className="co-herramienta"><b>Bash</b>Ver los últimos commits</span>
                    </div>
                  </details>
                  <div className="co-md">
                    <p>Las fases F0 a F3 están listas. De la <b>F4</b> falta terminar la pantalla de resultados y elegir la biblioteca del mapa:</p>
                    <div className="co-tabla"><table><thead><tr><th>Opción</th><th>Peso</th><th>Nota</th></tr></thead>
                      <tbody><tr><td>Leaflet</td><td>42 kB</td><td>simple, teselas raster</td></tr><tr><td>MapLibre</td><td>210 kB</td><td>vectorial, estilos propios</td></tr></tbody></table></div>
                    <pre className="co-codigo"><code>npm install maplibre-gl</code></pre>
                  </div>
                  <details className="co-pensamiento"><summary><span className="co-latido" aria-hidden="true" /><span className="co-resumen-trabajo">Bash · Correr los tests</span></summary></details>
                  <details className="co-diff co-cambios" open>
                    <summary className="co-diff-cabecera"><span>Cambios · pedido 1</span><span className="co-cambios-cuenta">2 archivos</span><span className="co-diff-suma">+3</span><span className="co-diff-resta">−1</span></summary>
                    <details className="co-cambio" open>
                      <summary className="co-cambio-fila"><span className="co-diff-archivo">src/resultados.tsx</span><span className="co-cambio-cuentas"><span className="co-diff-suma">+2</span> <span className="co-diff-resta">−1</span></span></summary>
                      <pre><span className="co-trozo-separador">⋯ línea 12</span><span className="co-diff-ctx">  const filas = useResultados(filtro);</span><span className="co-diff-menos">- return &lt;Tabla filas={"{filas}"} /&gt;;</span><span className="co-diff-mas">+ if (!filas.length) return &lt;Vacio /&gt;;</span><span className="co-diff-mas">+ return &lt;Tabla filas={"{filas}"} /&gt;;</span></pre>
                    </details>
                    <details className="co-cambio">
                      <summary className="co-cambio-fila"><span className="co-diff-archivo">src/vacio.tsx</span><span className="chip chip-neutro">nuevo</span><span className="co-cambio-cuentas"><span className="co-diff-suma">+1</span> <span className="co-diff-resta">−0</span></span></summary>
                      <pre><span className="co-diff-mas">+export const Vacio = () =&gt; &lt;p&gt;Sin resultados&lt;/p&gt;;</span></pre>
                    </details>
                  </details>
                </div>
              </div>
              <section className="co-permiso" role="alertdialog" aria-label="Claude quiere usar Bash">
                <header><b>Claude quiere usar Bash</b><span className="nota-chica">Correr los tests</span></header>
                <pre className="co-codigo co-permiso-vista">npm test -- --run resultados</pre>
                <div className="co-permiso-acciones">
                  <button type="button" className="boton boton-primario">Permitir</button>
                  <button type="button" className="boton">Permitir siempre en esta sesión</button>
                  <button type="button" className="boton">Negar…</button>
                </div>
              </section>
              <form className="co-compositor" onSubmit={(e) => e.preventDefault()}>
                <label className="sr-only" htmlFor="m">Mensaje</label>
                <textarea id="m" rows={2} placeholder="Describe lo que quieres hacer; / para comandos, @ para archivos" />
                <div className="co-compositor-fila">
                  <label className="co-selector"><span className="sr-only">Permisos</span><select><option>Solo lectura</option><option>Planificar</option><option>Editar el espacio</option></select></label>
                  <span className="co-espaciador" />
                  <label className="co-selector"><span className="sr-only">Modelo</span><select><option>Opus 5.5</option><option>Sonnet 5.5</option></select></label>
                  <button type="submit" className="co-enviar" aria-label="Enviar">{enviar}</button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <header className="cabecera-pagina"><h1>Automatización</h1><p className="nota">8 tareas pendientes en 2 encargos · la semana va en 38 %</p></header>
              <section className="tarjeta">
                <div className="tarjeta-cabecera con-acciones">
                  <h2>Cola</h2><span className="nota">Las tareas corren solas, una tras otra.</span>
                  <div className="tarjeta-acciones"><button type="button" className="boton">Volver a medir</button><button type="button" className="boton boton-primario">Agregar tarea</button></div>
                </div>
                <Segmentado etiqueta="Filtro" valor={filtro} onChange={setFiltro} opciones={[{ valor: "todas", texto: "Todas (8)" }, { valor: "pendientes", texto: "Pendientes (6)" }, { valor: "hechas", texto: "Hechas (2)" }]} />
                <div className="tabla-envoltura">
                  <table>
                    <thead><tr><th>Tarea</th><th>Estado</th><th className="num">Costo</th></tr></thead>
                    <tbody>
                      <tr><td>[F4] Pantalla de resultados</td><td><span className="chip">En curso</span></td><td className="num">US$ 3,2</td></tr>
                      <tr><td>[M3] Procesos de matrícula</td><td><span className="chip chip-neutro">Pendiente</span></td><td className="num">—</td></tr>
                      <tr><td>Revisar contraste de la línea</td><td><span className="chip chip-neutro">✓ Hecha</span></td><td className="num">US$ 0,8</td></tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </main>
        <footer className="pie"><CreditoEstilos /></footer>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><Vitrina /></StrictMode>);
