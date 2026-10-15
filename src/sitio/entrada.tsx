import { useEffect, useState } from "react";

const SALUDOS = ["Hola", "Hello", "Olá", "Bonjour", "Ciao", "Hallo", "Hej", "こんにちは", "Hola"];

/**
 * Pantalla de entrada al sitio (al estilo de Dennis Snellenberg): saludos en varios idiomas que se suceden rápido y
 * luego la pantalla sube con el borde inferior curvo. Por defecto se muestra una vez por sesión del navegador.
 * Con movimiento reducido no aparece.
 */
export function Entrada({ saludos = SALUDOS, ritmo = 160, unaVezPorSesion = true, onFin }: {
  saludos?: string[];
  /** Milisegundos por saludo (el primero y el último se quedan un poco más). */
  ritmo?: number;
  unaVezPorSesion?: boolean;
  onFin?: () => void;
}) {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    if (!unaVezPorSesion) return true;
    try { return sessionStorage.getItem("estilos-entrada") !== "1"; } catch { return true; }
  });
  const [i, setI] = useState(0);
  const [saliendo, setSaliendo] = useState(false);

  useEffect(() => {
    if (!visible) { onFin?.(); return; }
    if (i < saludos.length - 1) {
      const t = setTimeout(() => setI(i + 1), i === 0 ? ritmo * 3 : ritmo);
      return () => clearTimeout(t);
    }
    const t1 = setTimeout(() => setSaliendo(true), ritmo * 2);
    const t2 = setTimeout(() => {
      setVisible(false);
      try { sessionStorage.setItem("estilos-entrada", "1"); } catch { /* sin almacenamiento */ }
    }, ritmo * 2 + 950);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [i, visible]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible) return null;
  return (
    <div className="s-entrada" data-saliendo={saliendo ? "" : undefined} aria-hidden="true">
      <span className="s-entrada-palabra">{saludos[i]}</span>
    </div>
  );
}
