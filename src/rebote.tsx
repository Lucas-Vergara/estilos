import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Aviso que rebota por la pantalla como el logo del DVD, cambiando de color en cada choque. Pensado como broma o
 * recordatorio imposible de ignorar (nació como «Contacta a Lucas» en el monitor de precios, nov. 2026).
 *
 * - No bloquea nada: va sobre todo con `pointer-events: none` y `aria-hidden`.
 * - Se quita pasando al tema oscuro y volviendo al claro (el truco que hay que descubrir), o con `quitarCon="nunca"`
 *   se queda hasta que el proyecto lo saque. Al quitarse queda guardado en el navegador (`clave`).
 * - Con «reducir movimiento» no rebota: queda quieto abajo a la izquierda.
 * - Trae sus estilos en línea: sirve en cualquier línea (panel, sitio, luz…) sin importar CSS.
 */

export interface PropsAvisoRebote {
  /** El texto del aviso, p. ej. «Contacta a Lucas». */
  texto: string;
  /** Clave de localStorage donde queda guardado que ya se quitó. Cámbiala para volver a mostrarlo. */
  clave?: string;
  /** Cómo se quita: con el tema (oscuro y luego claro) o nunca. */
  quitarCon?: "tema" | "nunca";
  /** Velocidad en px por segundo. */
  velocidad?: number;
  /** Colores de fondo, uno por choque (texto blanco). */
  colores?: string[];
  /** Estilos extra del cuadro (tamaño de letra, radio…). */
  estilo?: CSSProperties;
}

export const COLORES_REBOTE = ["#e11d48", "#2563eb", "#16a34a", "#d97706", "#7c3aed", "#0891b2", "#db2777"];

const temaOscuro = () => document.documentElement.dataset.theme === "dark";

function leer(clave: string) {
  try {
    return localStorage.getItem(clave) === "1";
  } catch {
    return false;
  }
}

export function AvisoRebote({ texto, clave = "aviso-rebote-visto", quitarCon = "tema", velocidad = 140, colores = COLORES_REBOTE, estilo }: PropsAvisoRebote) {
  const [visible, setVisible] = useState(() => !leer(clave));
  const [color, setColor] = useState(0);
  const caja = useRef<HTMLDivElement>(null);
  const quieto = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // El truco para quitarlo: oscuro y luego claro
  useEffect(() => {
    if (!visible || quitarCon !== "tema") return;
    let pasoPorOscuro = temaOscuro();
    const observador = new MutationObserver(() => {
      if (temaOscuro()) pasoPorOscuro = true;
      else if (pasoPorOscuro) {
        try {
          localStorage.setItem(clave, "1");
        } catch {
          /* sin almacenamiento: solo por esta visita */
        }
        setVisible(false);
      }
    });
    observador.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observador.disconnect();
  }, [visible, quitarCon, clave]);

  // El rebote
  useEffect(() => {
    const el = caja.current;
    if (!visible || !el || quieto) return;
    let x = Math.random() * Math.max(0, window.innerWidth - el.offsetWidth);
    let y = Math.random() * Math.max(0, window.innerHeight - el.offsetHeight);
    // Un ángulo algo distinto de 45° para que la esquina «casi» llegue y nunca llegue
    const angulo = (37 + Math.random() * 10) * (Math.PI / 180);
    let vx = Math.cos(angulo) * velocidad * (Math.random() < 0.5 ? -1 : 1);
    let vy = Math.sin(angulo) * velocidad * (Math.random() < 0.5 ? -1 : 1);
    let antes = performance.now();
    let cuadro = 0;
    const mover = (ahora: number) => {
      const dt = Math.min(0.05, (ahora - antes) / 1000);
      antes = ahora;
      const maxX = Math.max(0, window.innerWidth - el.offsetWidth);
      const maxY = Math.max(0, window.innerHeight - el.offsetHeight);
      x += vx * dt;
      y += vy * dt;
      let choco = false;
      if (x <= 0 || x >= maxX) {
        vx = x <= 0 ? Math.abs(vx) : -Math.abs(vx);
        x = Math.min(Math.max(x, 0), maxX);
        choco = true;
      }
      if (y <= 0 || y >= maxY) {
        vy = y <= 0 ? Math.abs(vy) : -Math.abs(vy);
        y = Math.min(Math.max(y, 0), maxY);
        choco = true;
      }
      if (choco) setColor((c) => (c + 1) % colores.length);
      el.style.transform = `translate(${x}px, ${y}px)`;
      cuadro = requestAnimationFrame(mover);
    };
    cuadro = requestAnimationFrame(mover);
    return () => cancelAnimationFrame(cuadro);
  }, [visible, quieto, velocidad, colores.length]);

  if (!visible) return null;
  return (
    <div
      ref={caja}
      className="aviso-rebote"
      aria-hidden="true"
      style={{
        position: "fixed",
        top: quieto ? "auto" : 0,
        bottom: quieto ? 16 : "auto",
        left: quieto ? 16 : 0,
        zIndex: 10000,
        padding: "12px 20px",
        borderRadius: 12,
        background: colores[color % colores.length],
        color: "#fff",
        fontSize: 22,
        fontWeight: 750,
        letterSpacing: "-0.01em",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        userSelect: "none",
        boxShadow: "0 8px 24px rgb(0 0 0 / 0.2)",
        transition: "background-color 0.2s",
        ...estilo,
      }}
    >
      {texto}
    </div>
  );
}
