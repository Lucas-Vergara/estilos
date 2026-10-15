# Cambios

## v0.6.0 — 2026-10-15

- Línea sitio: **paletas** `s-paleta-indigo` (por defecto), `grafito`, `ciruela`, `coral`, `bosque`, `oceano` y `arena`. Todas claras; cada una trae su acento para el modo noche. Se ponen en `<body>` o en un contenedor y las secciones `.sitio` de adentro las heredan (los colores salen de variables `--p-…`).
- `Objeto3D` y `Grilla3D` toman los colores nuevos al cambiar de paleta o de modo noche (antes los leían una sola vez).
- Vitrina de la línea sitio: selector de paleta abajo a la izquierda; se recuerda en el navegador.

## v0.5.0 — 2026-10-15

- Línea sitio: se quita el cursor propio (punto que sigue al puntero en toda la página; clase `s-cursor`). `Cursor` queda solo para sitio diseñadora y su prefijo por defecto pasa a `"sd"`. `Proyecto` ya no marca su medio con `data-cursor`.
- Vitrina de la línea sitio: contenido genérico, sin nombres de personas ni referencias; ya no parece un portafolio personal.

## v0.4.0 — 2026-10-15

**Cambio que rompe:** la línea "sitio" anterior pasa a llamarse **"sitio diseñadora"** (creada junto con Franservice, https://franservice.cl): archivo `lineas/sitio-disenadora.css`, alcance `.sitio-disenadora`, clases `sd-…`, variables `--sd-…`, variante `sd-claro`. Quien la usaba debe renombrar clases (`s-` → `sd-`) o quedarse en v0.3.0. Ningún proyecto la usaba.

**Nueva línea "sitio" oficial**, clara por defecto, a partir de la revisión de 20 portafolios (ver PREFERENCIAS.md):
- `lineas/sitio.css`: paleta de día (índigo + amarillo de destello) y variantes `s-oscuro` y `s-simple`; tipografía Bricolage Grotesque + Geist; cabecera que se esconde al bajar; navegación en píldora; avatar; hero con fondo vivo; entrada al sitio; telón entre páginas; proyectos en marco de navegador; scroll horizontal; barra de progreso; tarjetas inclinables; botones magnéticos; y lo rescatado de sitio diseñadora (marquesina, galería editorial, lista de servicios, flotante, aviso, cursor).
- `@lucas-vergara/estilos/sitio`: `Entrada`, `Telon` + `irCon`, `NavPildora` + `useSeccionActiva`, `Avatar`, `FondoAnimado` (manchas, malla, ondas), `MarcoNavegador`, `Proyecto`, `Ola`, `sonidos` + `BotonSonido` (Web Audio, apagados por defecto), `iniciarInteracciones`. `iniciarMovimiento` suma scroll horizontal, progreso y cabecera ocultable. `Palabras`, `Acento` y `Cursor` aceptan `prefijo` ("s" o "sd").
- `@lucas-vergara/estilos/3d` (requiere `three`, dependencia opcional): `Objeto3D` (burbuja, nudo, anillos; rebota al tocarlo) y `Grilla3D`.
- `Palabras`: la puntuación pegada a una palabra destacada ya no se separa.
- Vitrina: `sitio.html` (línea nueva) y `sitio-disenadora.html` (la anterior).

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
