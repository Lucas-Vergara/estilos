import { useEffect, useState, type ComponentType, type ReactNode } from "react";

/**
 * Navegación lateral al estilo del "mini variant drawer" de MUI (línea panel): expandida (ícono y texto) o compacta
 * (solo íconos), con las secciones de cada grupo plegadas hasta que se abre el grupo. Un grupo de una sola sección es
 * un enlace directo, y el grupo de la página actual se marca aunque esté plegado.
 *
 * No depende de ningún enrutador: recibe la ruta actual y, si se quiere navegar sin recargar, un componente `Enlace`
 * (p. ej. un envoltorio del Link de react-router). Va dentro de `.con-lateral`, junto a `.barra.barra-app` (ver README).
 * Bajo 900 px es un panel sobre el contenido que se abre desde la barra (`abierta`).
 */
export interface SeccionLateral {
  ruta: string;
  nombre: string;
  /** Activa solo con la ruta exacta (para la primera sección de un grupo, cuya ruta es prefijo de las demás). */
  exacta?: boolean;
}

export interface GrupoLateral {
  id: string;
  nombre: string;
  icono: ReactNode;
  secciones: SeccionLateral[];
}

export interface PropsEnlaceLateral {
  href: string;
  className?: string;
  title?: string;
  "aria-label"?: string;
  "aria-current"?: "page";
  children: ReactNode;
}

const EnlaceSimple = ({ href, ...props }: PropsEnlaceLateral) => <a href={href} {...props} />;

const ANGOSTA = "(max-width: 900px)";
const esAngosta = () => typeof window !== "undefined" && window.matchMedia(ANGOSTA).matches;

/** Si la pantalla es angosta (la lateral pasa a panel), siguiendo los cambios de tamaño. */
export function usePantallaAngosta() {
  const [angosta, setAngosta] = useState(esAngosta);
  useEffect(() => {
    const mq = window.matchMedia(ANGOSTA);
    const cambio = () => setAngosta(mq.matches);
    mq.addEventListener("change", cambio);
    return () => mq.removeEventListener("change", cambio);
  }, []);
  return angosta;
}

/** Expandida o compacta, recordado en el navegador (por proyecto, con `clave`). */
export function useLateralCompacta(clave = "lateral:compacta") {
  const [compacta, setCompacta] = useState(() => {
    try {
      return localStorage.getItem(clave) === "1";
    } catch {
      return false;
    }
  });
  const cambiar = (v: boolean) => {
    setCompacta(v);
    try {
      localStorage.setItem(clave, v ? "1" : "0");
    } catch {
      /* sin almacenamiento: vale solo para esta visita */
    }
  };
  return [compacta, cambiar] as const;
}

// La raíz "/" solo calza consigo misma; las demás rutas también con sus subrutas.
const coincide = (actual: string, s: SeccionLateral) =>
  s.exacta || s.ruta === "/" ? actual === s.ruta : actual === s.ruta || actual.startsWith(`${s.ruta}/`);

/** El grupo que contiene la ruta actual (el de la ruta más larga que calza), o null. */
export function grupoDe(grupos: GrupoLateral[], actual: string): GrupoLateral | null {
  let mejor: { g: GrupoLateral; largo: number } | null = null;
  for (const g of grupos)
    for (const s of g.secciones)
      if (coincide(actual, s) && (!mejor || s.ruta.length > mejor.largo)) mejor = { g, largo: s.ruta.length };
  return mejor?.g ?? null;
}

const Flecha = () => (
  <svg className="lateral-flecha" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export function NavegacionLateral({
  grupos,
  rutaActual,
  compacta,
  onExpandir,
  abierta = false,
  onCerrar,
  Enlace = EnlaceSimple,
  etiqueta = "Secciones",
}: {
  grupos: GrupoLateral[];
  rutaActual: string;
  compacta: boolean;
  /** Pide pasar a expandida (al abrir un grupo desde el modo compacto). */
  onExpandir: () => void;
  /** Panel abierto en pantallas angostas. */
  abierta?: boolean;
  onCerrar?: () => void;
  Enlace?: ComponentType<PropsEnlaceLateral>;
  etiqueta?: string;
}) {
  const [abiertos, setAbiertos] = useState<Set<string>>(() => new Set());
  const activo = grupoDe(grupos, rutaActual);
  const alternar = (id: string) =>
    setAbiertos((a) => {
      const n = new Set(a);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  useEffect(() => {
    if (!abierta || !onCerrar) return;
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [abierta, onCerrar]);

  // En el panel de pantallas angostas siempre se ve el texto.
  const soloIconos = compacta && !abierta;

  return (
    <>
      <nav id="navegacion-lateral" className={`lateral${soloIconos ? " compacta" : ""}${abierta ? " abierta" : ""}`} aria-label={etiqueta}>
        <ul className="lateral-lista">
          {grupos.map((g) => {
            const esActivo = g === activo;
            const nombreSiCompacta = soloIconos ? g.nombre : undefined;
            if (g.secciones.length === 1) {
              const actual = coincide(rutaActual, g.secciones[0]);
              return (
                <li key={g.id} className="lateral-grupo">
                  <Enlace
                    href={g.secciones[0].ruta}
                    className={`lateral-titulo${actual ? " actual" : ""}`}
                    title={nombreSiCompacta}
                    aria-label={nombreSiCompacta}
                    aria-current={actual ? "page" : undefined}
                  >
                    {g.icono}
                    <span className="lateral-texto">{g.nombre}</span>
                  </Enlace>
                </li>
              );
            }
            const desplegado = abiertos.has(g.id) && !soloIconos;
            return (
              <li key={g.id} className={`lateral-grupo${esActivo ? " activo" : ""}`}>
                <button
                  type="button"
                  className={`lateral-titulo${esActivo && !desplegado ? " actual" : ""}`}
                  aria-expanded={desplegado}
                  aria-controls={`lateral-${g.id}`}
                  title={nombreSiCompacta}
                  aria-label={nombreSiCompacta}
                  onClick={() => {
                    if (soloIconos) {
                      onExpandir();
                      setAbiertos((a) => new Set(a).add(g.id));
                    } else alternar(g.id);
                  }}
                >
                  {g.icono}
                  <span className="lateral-texto">{g.nombre}</span>
                  <Flecha />
                </button>
                <ul id={`lateral-${g.id}`} className="lateral-sub" hidden={!desplegado}>
                  {g.secciones.map((s) => (
                    <li key={s.ruta}>
                      <Enlace href={s.ruta} aria-current={esActivo && seccionActual(g, rutaActual) === s ? "page" : undefined}>
                        {s.nombre}
                      </Enlace>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </nav>
      {onCerrar && <div className={`lateral-fondo${abierta ? " visible" : ""}`} onClick={onCerrar} aria-hidden="true" />}
    </>
  );
}

/** La sección de un grupo que corresponde a la ruta actual (la más específica). */
function seccionActual(g: GrupoLateral, actual: string): SeccionLateral | null {
  let mejor: SeccionLateral | null = null;
  for (const s of g.secciones) if (coincide(actual, s) && (!mejor || s.ruta.length > mejor.ruta.length)) mejor = s;
  return mejor;
}
