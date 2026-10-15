/**
 * Avatar circular con anillo y una burbuja de saludo que se mueve al pasar el cursor (al estilo de Josh Comeau y
 * Robb Owen). Sin foto muestra las iniciales sobre un degradado del acento.
 */
export function Avatar({ src, alt = "", iniciales, tamano = 96, saludo = "Hola" }: {
  src?: string;
  alt?: string;
  iniciales?: string;
  tamano?: number;
  /** Texto corto de la burbuja (2 a 4 letras); vacío para ocultarla. */
  saludo?: string;
}) {
  return (
    <span className="s-avatar" style={{ ["--tamano" as string]: `${tamano}px` }}>
      {src ? <img src={src} alt={alt} /> : <span className="s-avatar-iniciales" aria-hidden={!alt}>{iniciales}</span>}
      {saludo && <span className="s-avatar-saludo" aria-hidden="true">{saludo}</span>}
    </span>
  );
}
