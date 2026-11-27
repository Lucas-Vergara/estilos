import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent as EventoPuntero, type ReactNode } from "react";

/**
 * Selector de la línea consola (cuadro para escribir y formularios), en reemplazo del <select> nativo, cuya lista abierta dibuja el
 * sistema y no toma el look. Botón con ícono y texto; al abrirlo, el texto pasa a ser un campo para escribir (combobox) y
 * la lista se filtra con lo escrito, sin distinguir mayúsculas ni tildes, con la parte que calza resaltada. La opción
 * elegida va marcada y cada opción puede llevar una nota. Se abre hacia arriba si abajo no cabe.
 * Teclado: flechas, Enter, Escape y Tab; escribir con el botón enfocado lo abre ya filtrando.
 * `buscar={false}` vuelve a la lista sin campo (Inicio/Fin, espacio y saltar por letra).
 */
export interface OpcionSelector<T extends string> { valor: T; texto: string; nota?: string }

/** Minúsculas y sin tildes, unidad por unidad (mismo largo que el texto, para resaltar lo que calza). */
const plano = (s: string) =>
  s.split("").map((c) => { const b = c.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase(); return b.length === 1 ? b : c; }).join("");

/** Calza si cada palabra de la búsqueda aparece en el texto. */
const calza = (texto: string, busqueda: string) => {
  const t = plano(texto);
  return plano(busqueda).split(/\s+/).filter(Boolean).every((p) => t.includes(p));
};

function Resaltado({ texto, busqueda }: { texto: string; busqueda: string }) {
  const q = plano(busqueda.trim());
  const i = q ? plano(texto).indexOf(q) : -1;
  if (i < 0) return <>{texto}</>;
  return <>{texto.slice(0, i)}<mark>{texto.slice(i, i + q.length)}</mark>{texto.slice(i + q.length)}</>;
}

const flecha = (
  <svg className="co-selector-flecha" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
);

export function Selector<T extends string>({ valor, opciones, onCambio, etiqueta, icono, tenue, titulo, campo, buscar = true }: {
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
  /** Campo para escribir y filtrar al abrir (por defecto sí). */
  buscar?: boolean;
}) {
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [activo, setActivo] = useState(0);
  const [arriba, setArriba] = useState(true);
  const raiz = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);
  const entrada = useRef<HTMLInputElement>(null);
  const lista = useRef<HTMLUListElement>(null);
  const id = useId();
  const elegida = opciones.find((o) => o.valor === valor);
  const visibles = useMemo(
    () => (buscar && busqueda.trim() ? opciones.filter((o) => calza(o.texto, busqueda)) : opciones),
    [opciones, busqueda, buscar],
  );

  const abrir = (inicial = "") => {
    setBusqueda(inicial);
    setActivo(inicial ? 0 : Math.max(0, opciones.findIndex((o) => o.valor === valor)));
    setAbierto(true);
  };
  const cerrar = (devolverFoco = true) => {
    setAbierto(false);
    setBusqueda("");
    // El botón vuelve a existir recién en el siguiente pintado (mientras se busca, en su lugar está el campo).
    if (devolverFoco) requestAnimationFrame(() => boton.current?.focus());
  };
  const elegir = (o: OpcionSelector<T> | undefined) => { if (!o) return; onCambio(o.valor); cerrar(); };

  // Hacia arriba o hacia abajo, según dónde quepa (medido con la lista completa, al abrir).
  useLayoutEffect(() => {
    if (!abierto || !raiz.current || !lista.current) return;
    const r = raiz.current.getBoundingClientRect();
    const alto = lista.current.offsetHeight;
    setArriba(r.top > alto + 12 || r.top > window.innerHeight - r.bottom);
  }, [abierto]);
  useEffect(() => { if (abierto) (buscar ? entrada.current : lista.current)?.focus(); }, [abierto, buscar]);
  useEffect(() => { if (abierto) lista.current?.querySelector<HTMLElement>(`[data-i="${activo}"]`)?.scrollIntoView({ block: "nearest" }); }, [abierto, activo]);
  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: PointerEvent) => { if (!raiz.current?.contains(e.target as Node)) cerrar(false); };
    document.addEventListener("pointerdown", fuera);
    return () => document.removeEventListener("pointerdown", fuera);
  }, [abierto]); // eslint-disable-line react-hooks/exhaustive-deps

  const teclaBoton = (e: KeyboardEvent) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) { e.preventDefault(); abrir(); }
    else if (buscar && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); abrir(e.key); }
  };
  const teclaLista = (e: KeyboardEvent) => {
    const n = visibles.length;
    if (e.key === "ArrowDown") { e.preventDefault(); if (n) setActivo((a) => (a + 1) % n); }
    else if (e.key === "ArrowUp") { e.preventDefault(); if (n) setActivo((a) => (a - 1 + n) % n); }
    else if (e.key === "Home" && !buscar) { e.preventDefault(); setActivo(0); }
    else if (e.key === "End" && !buscar) { e.preventDefault(); setActivo(n - 1); }
    else if (e.key === "Enter" || (e.key === " " && !buscar)) { e.preventDefault(); elegir(visibles[activo]); }
    else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); cerrar(); }
    else if (e.key === "Tab") cerrar(false);
    else if (!buscar && e.key.length === 1) {
      const k = e.key.toLowerCase();
      const i = opciones.findIndex((o, j) => j > activo && o.texto.toLowerCase().startsWith(k));
      const j = i >= 0 ? i : opciones.findIndex((o) => o.texto.toLowerCase().startsWith(k));
      if (j >= 0) setActivo(j);
    }
  };
  const idOpcion = (i: number) => `${id}-${i}`;
  const descendiente = abierto && visibles.length ? idOpcion(Math.min(activo, visibles.length - 1)) : undefined;
  // Mientras se busca, un clic en la lista o en el marco no le quita el foco al campo.
  const conservarFoco = (e: EventoPuntero) => { if (buscar && e.target !== entrada.current) e.preventDefault(); };

  return (
    <div className={`co-selector${tenue ? " co-selector-tenue" : ""}${campo ? " co-selector-campo" : ""}${abierto ? " abierto" : ""}`} ref={raiz}>
      {abierto && buscar ? (
        <div className="co-selector-boton co-selector-buscando" onPointerDown={conservarFoco} onClick={(e) => { if (e.target !== entrada.current) cerrar(); }}>
          {icono}
          <input ref={entrada} className="co-selector-entrada" type="text" role="combobox" aria-expanded aria-controls={id}
            aria-autocomplete="list" aria-activedescendant={descendiente} aria-label={etiqueta} autoComplete="off" spellCheck={false}
            placeholder={elegida?.texto ?? "Buscar"} value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setActivo(0); }} onKeyDown={teclaLista} />
          {flecha}
        </div>
      ) : (
        <button ref={boton} type="button" className="co-selector-boton" aria-haspopup="listbox" aria-expanded={abierto} aria-controls={id}
          aria-label={`${etiqueta}: ${elegida?.texto ?? ""}`} title={titulo ?? elegida?.nota} onClick={() => (abierto ? cerrar() : abrir())} onKeyDown={teclaBoton}>
          {icono}
          <span className="co-selector-texto">{elegida?.texto ?? "—"}</span>
          {flecha}
        </button>
      )}
      {abierto && (
        <ul ref={lista} id={id} role="listbox" tabIndex={buscar ? undefined : -1} aria-label={etiqueta} aria-activedescendant={buscar ? undefined : descendiente}
          className={`co-menu-opciones${arriba ? " arriba" : ""}`} onKeyDown={buscar ? undefined : teclaLista} onPointerDown={conservarFoco}>
          {visibles.map((o, i) => (
            <li key={o.valor} id={idOpcion(i)} data-i={i} role="option" aria-selected={o.valor === valor}
              className={i === activo ? "activa" : undefined} onPointerEnter={() => setActivo(i)} onClick={() => elegir(o)}>
              <span className="co-menu-marca" aria-hidden="true">{o.valor === valor ? "✓" : ""}</span>
              <span className="co-menu-texto"><span><Resaltado texto={o.texto} busqueda={buscar ? busqueda : ""} /></span>{o.nota && <small>{o.nota}</small>}</span>
            </li>
          ))}
          {!visibles.length && <li className="co-menu-vacio" role="presentation">Nada calza con «{busqueda.trim()}». Borra o cambia lo escrito.</li>}
        </ul>
      )}
    </div>
  );
}
