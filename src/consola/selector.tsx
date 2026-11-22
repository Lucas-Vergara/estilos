import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

/**
 * Selector de la línea consola (cuadro para escribir y formularios), en reemplazo del <select> nativo, cuya lista abierta dibuja el
 * sistema y no toma el look. Botón con ícono y texto; al abrirlo, un menú con la opción elegida marcada y una nota
 * opcional por opción. Se abre hacia arriba si abajo no cabe. Teclado: flechas, Inicio/Fin, Enter o espacio y Escape;
 * escribir una letra salta a la opción que empieza con ella.
 */
export interface OpcionSelector<T extends string> { valor: T; texto: string; nota?: string }

export function Selector<T extends string>({ valor, opciones, onCambio, etiqueta, icono, tenue, titulo, campo }: {
  valor: T;
  opciones: readonly OpcionSelector<T>[];
  onCambio: (v: T) => void;
  /** Para lectores de pantalla («Modelo», «Permisos»…). */
  etiqueta: string;
  icono?: ReactNode;
  tenue?: boolean;
  titulo?: string;
  /** Con forma de campo de formulario (ancho completo, 36 px), en vez de botón chico del cuadro para escribir. */
  campo?: boolean;
}) {
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(0);
  const [arriba, setArriba] = useState(true);
  const raiz = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);
  const lista = useRef<HTMLUListElement>(null);
  const id = useId();
  const elegida = opciones.find((o) => o.valor === valor);

  const abrir = () => {
    setActivo(Math.max(0, opciones.findIndex((o) => o.valor === valor)));
    setAbierto(true);
  };
  const cerrar = (devolverFoco = true) => { setAbierto(false); if (devolverFoco) boton.current?.focus(); };
  const elegir = (i: number) => { onCambio(opciones[i].valor); cerrar(); };

  // Hacia arriba o hacia abajo, según dónde quepa.
  useLayoutEffect(() => {
    if (!abierto || !raiz.current || !lista.current) return;
    const r = raiz.current.getBoundingClientRect();
    const alto = lista.current.offsetHeight;
    setArriba(r.top > alto + 12 || r.top > window.innerHeight - r.bottom);
  }, [abierto]);
  useEffect(() => { if (abierto) lista.current?.focus(); }, [abierto]);
  useEffect(() => { if (abierto) lista.current?.querySelector<HTMLElement>(`[data-i="${activo}"]`)?.scrollIntoView({ block: "nearest" }); }, [abierto, activo]);
  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: PointerEvent) => { if (!raiz.current?.contains(e.target as Node)) cerrar(false); };
    document.addEventListener("pointerdown", fuera);
    return () => document.removeEventListener("pointerdown", fuera);
  }, [abierto]); // eslint-disable-line react-hooks/exhaustive-deps

  const teclaBoton = (e: KeyboardEvent) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) { e.preventDefault(); abrir(); }
  };
  const teclaLista = (e: KeyboardEvent) => {
    const n = opciones.length;
    if (e.key === "ArrowDown") { e.preventDefault(); setActivo((a) => (a + 1) % n); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActivo((a) => (a - 1 + n) % n); }
    else if (e.key === "Home") { e.preventDefault(); setActivo(0); }
    else if (e.key === "End") { e.preventDefault(); setActivo(n - 1); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); elegir(activo); }
    else if (e.key === "Escape") { e.preventDefault(); cerrar(); }
    else if (e.key === "Tab") cerrar(false);
    else if (e.key.length === 1) {
      const i = opciones.findIndex((o, j) => j > activo && o.texto.toLowerCase().startsWith(e.key.toLowerCase()));
      const k = i >= 0 ? i : opciones.findIndex((o) => o.texto.toLowerCase().startsWith(e.key.toLowerCase()));
      if (k >= 0) setActivo(k);
    }
  };

  return (
    <div className={`co-selector${tenue ? " co-selector-tenue" : ""}${campo ? " co-selector-campo" : ""}${abierto ? " abierto" : ""}`} ref={raiz}>
      <button ref={boton} type="button" className="co-selector-boton" aria-haspopup="listbox" aria-expanded={abierto} aria-controls={id}
        aria-label={`${etiqueta}: ${elegida?.texto ?? ""}`} title={titulo ?? elegida?.nota} onClick={() => (abierto ? cerrar() : abrir())} onKeyDown={teclaBoton}>
        {icono}
        <span className="co-selector-texto">{elegida?.texto ?? "—"}</span>
        <svg className="co-selector-flecha" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {abierto && (
        <ul ref={lista} id={id} role="listbox" tabIndex={-1} aria-label={etiqueta} aria-activedescendant={`${id}-${activo}`}
          className={`co-menu-opciones${arriba ? " arriba" : ""}`} onKeyDown={teclaLista}>
          {opciones.map((o, i) => (
            <li key={o.valor} id={`${id}-${i}`} data-i={i} role="option" aria-selected={o.valor === valor}
              className={i === activo ? "activa" : undefined} onPointerEnter={() => setActivo(i)} onClick={() => elegir(i)}>
              <span className="co-menu-marca" aria-hidden="true">{o.valor === valor ? "✓" : ""}</span>
              <span className="co-menu-texto">{o.texto}{o.nota && <small>{o.nota}</small>}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
