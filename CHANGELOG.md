# Cambios

## v0.3.0 — 2026-10-15

- **Licencia nueva: MIT con atribución visible.** Quien use la biblioteca en una web o app pública debe mostrar "Estilos: Lucas Vergara" enlazado al repo (pie de página o página de créditos). Rige desde esta versión.
- `<CreditoEstilos />` y la clase `.credito-estilos` (en `tokens.css`, sirve en todas las líneas; en la línea sitio va en mono mayúscula).
- Huella: comentario `/*! … */` y variable `--estilos-lv` con la versión, que sobreviven a la minificación.
- Sin cambios visuales en las líneas panel y sitio.

## v0.2.1 — 2026-10-15

- Los imports internos llevan extensión `.js`: el paquete también funciona en Node ESM estricto (SSR, pruebas), no solo con Vite o Next. Sin cambios visuales.

## v0.2.0 — 2026-10-15

Nueva **línea sitio** (webs de presentación), con ideas del rediseño de Franservice. Sin cambios en la línea panel.

- `lineas/sitio.css`: paleta oscura (y variante `.sitio-claro`), tipografía display (`s-display`, `s-titulo`, `s-manifiesto`, `s-wordmark`, `s-etiqueta`, `s-acento`), cabecera con desenfoque, píldoras, campos con línea inferior, hero con segmentos de progreso y REC, galería editorial de 12 columnas, lista de servicios, marquesina, botón flotante, aviso, menú móvil, cursor propio, trazo que se dibuja, movimiento con el scroll y transiciones de página.
- `@lucas-vergara/estilos/sitio`: `Palabras`, `Acento`, `Cursor`, `iniciarMovimiento` / `SCRIPT_MOVIMIENTO`, `conTransicion`.
- Dentro de `.sitio`, los tokens comunes toman los colores del sitio: se puede mezclar con la línea panel.
- `lineas/panel.css`: alias de `base.css` con nombre de línea.
- Vitrina: página nueva `sitio.html`.

## v0.1.0 — 2026-10-15

Primera versión, extraída de monitor Sodimac (meyer/scrap2.0/web) sin cambios visuales.

- Tokens comunes (`tokens.css`) y acentos `verde` (Sodimac, radar de reciclaje) y `azul` (monitor de proyectos, oportunidades).
- Clases de la línea panel (`base.css`).
- Componentes React y gráficos con Recharts.
- Puente para Tailwind v4 (`tailwind.css`).
- Respecto de Sodimac: `Frescura` acepta `umbrales`; `GraficoBarras` acepta `textoVacio`; `GraficoLinea` acepta `textoSinRespaldo`; los íconos de los gráficos son SVG propios (sin lucide).
