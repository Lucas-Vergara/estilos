import { useEffect, useRef, type ReactNode } from "react";

/**
 * Marco de navegador para mostrar una captura o un video de una web (al estilo de Maxime Heckel). Los videos se
 * reproducen en silencio y en bucle solo mientras están en pantalla; con movimiento reducido quedan quietos en el
 * primer cuadro (o el póster). Sin `src`, muestra `children` (útil para maquetas) o un aviso de captura pendiente.
 */
export function MarcoNavegador({ url, src, tipo = "imagen", poster, alt = "", proporcion = "16 / 10", children }: {
  url: string;
  src?: string;
  tipo?: "imagen" | "video";
  poster?: string;
  alt?: string;
  /** Proporción del área de contenido, p. ej. "16 / 10" o "4 / 3". */
  proporcion?: string;
  children?: ReactNode;
}) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducido) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) void v.play().catch(() => {}); else v.pause(); }, { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  return (
    <figure className="s-marco-navegador">
      <div className="s-marco-barra" aria-hidden="true">
        <span className="s-marco-puntos"><i /><i /><i /></span>
        <span className="s-marco-url">{url.replace(/^https?:\/\//, "")}</span>
      </div>
      <div className="s-marco-contenido" style={{ ["--proporcion" as string]: proporcion }}>
        {src && tipo === "video" && <video ref={video} src={src} poster={poster} muted loop playsInline preload="metadata" aria-label={alt} />}
        {src && tipo === "imagen" && <img src={src} alt={alt} loading="lazy" />}
        {!src && (children ?? <div className="s-marco-vacio">Captura pendiente</div>)}
      </div>
    </figure>
  );
}

export interface DatosProyecto {
  titulo: string;
  /** Una o dos frases: qué es y qué hiciste tú. */
  descripcion: string;
  rol?: string;
  anio?: string | number;
  cliente?: string;
  etiquetas?: string[];
  url?: string;
  medio: { url: string; src?: string; tipo?: "imagen" | "video"; poster?: string; alt?: string; proporcion?: string; maqueta?: ReactNode };
}

/** Un proyecto: texto a un lado y su web en un marco de navegador al otro (se alternan en la lista .s-proyectos). */
export function Proyecto({ p, indice }: { p: DatosProyecto; indice?: number }) {
  return (
    <article className="s-proyecto">
      <div className="s-proyecto-texto" data-reveal="">
        {indice != null && <span className="s-indice">{String(indice).padStart(2, "0")}</span>}
        <h3 className="s-subtitulo">{p.titulo}</h3>
        <p className="s-texto">{p.descripcion}</p>
        <div className="s-proyecto-datos">
          {p.cliente && <span>{p.cliente}</span>}
          {p.rol && <span>{p.rol}</span>}
          {p.anio && <span>{p.anio}</span>}
        </div>
        {p.etiquetas?.length ? <div className="s-chips">{p.etiquetas.map((e) => <span className="s-chip" key={e}>{e}</span>)}</div> : null}
        {p.url && (
          <a className="s-enlace" href={p.url} target="_blank" rel="noopener">
            Ver el sitio <span className="s-flecha" aria-hidden="true">→</span>
          </a>
        )}
      </div>
      <div data-reveal="escala" data-cursor={p.url ? "Ver" : undefined}>
        <MarcoNavegador url={p.medio.url} src={p.medio.src} tipo={p.medio.tipo} poster={p.medio.poster} alt={p.medio.alt ?? p.titulo} proporcion={p.medio.proporcion}>
          {p.medio.maqueta}
        </MarcoNavegador>
      </div>
    </article>
  );
}

/** Ola SVG para separar secciones (variante simple, al estilo de Rafa Conde). Toma el color del texto (currentColor). */
export function Ola({ invertida, className }: { invertida?: boolean; className?: string }) {
  return (
    <svg className={className ? `s-ola ${className}` : "s-ola"} viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true" style={invertida ? { transform: "scaleY(-1)" } : undefined}>
      <path fill="currentColor" d="M0 52c120-26 240-38 360-30s240 34 360 38 240-22 360-34 240-6 360 8v56H0z" />
    </svg>
  );
}
