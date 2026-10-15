/**
 * Crédito que pide la licencia a quien use la biblioteca en una web pública: "Estilos: Lucas Vergara", enlazado al
 * repo. Va en el pie de página; es chico y discreto (clase .credito-estilos, en tokens.css).
 */
export function CreditoEstilos({ texto = "Estilos: Lucas Vergara", className }: { texto?: string; className?: string }) {
  return (
    <a className={className ? `credito-estilos ${className}` : "credito-estilos"} href="https://github.com/Lucas-Vergara/estilos" target="_blank" rel="noopener">
      {texto}
    </a>
  );
}
