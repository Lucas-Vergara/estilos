# Cambios

## v0.15.0 — 2026-10-27

Navegación lateral para la línea panel, a partir de la app de inteligencia de datos de reciclaje (radar), tomando como referencia el "mini variant drawer" de MUI.

- **`NavegacionLateral`**: grupos con ícono y secciones anidadas, plegados hasta que se abren. El grupo de la página actual se marca aunque esté plegado, y uno de una sola sección es un enlace directo. Funciona sin enrutador: recibe `rutaActual` y, opcionalmente, un componente `Enlace`. También se exportan `useLateralCompacta`, `usePantallaAngosta` y `grupoDe`.
- **Expandida o compacta**: `.con-lateral` y `.con-lateral.compacta`, de 240 a 64 px con transición. En modo compacto solo se ven los íconos, y abrir un grupo expande la lateral.
- **Una sola pieza con la barra**: `.barra.barra-app` comparte fondo (`--fondo-app`) y borde con la lateral, y `.boton-menu` y el logo quedan sobre la columna de íconos.
- **Bajo 900 px** la lateral es un panel que se abre desde la barra y se cierra con Escape o tocando fuera (`.lateral-fondo`).
- Solo clases nuevas: los proyectos que no usan la navegación lateral se ven igual.

## v0.14.0 — 2026-10-27

Menos ruido y un look más actual en la línea panel, a partir de la exploración del monitor Sodimac (referencias: Stripe, Linear, Plausible, Our World in Data, FT Visual Vocabulary, Tufte y Few).

- **Inter con tamaño óptico**: el enlace de la fuente pasa a `Inter:opsz,wght@14..32,400..700`; las cifras grandes y los títulos usan el corte de pantalla (ver README).
- **`Ayuda`**: ícono (i) junto a un título, con la definición o la metodología en un tooltip (cursor o foco). Reemplaza las notas largas bajo los títulos, que quedan para el hallazgo.
- **`LineaTiempo`** y `.linea-tiempo`: cambios agrupados por día, con la fecha a la izquierda.
- **Indicadores unidos** (`.indicadores.indicadores-unidos`): una sola tarjeta con divisores finos en lugar de una caja por cifra. `Indicador` acepta un `ReactNode` como etiqueta (p. ej. con `Ayuda`).
- `Variacion` con `chipPorcentaje`: el chip lleva solo el porcentaje ("▲ 10,1%") y el monto pasa al texto ("+$670 vs. el 28 sept").
- `Sparkline fluido`: relleno en degradado y punto en el último valor.
- `GraficoLinea`: grilla punteada y nuevas opciones `cifra` (la cifra de hoy bajo el título, que pasa a etiqueta), `etiquetaFinal` (punto y valor al final de cada serie), `area` (degradado bajo la serie), `tope` (línea con el máximo real, p. ej. 72 tiendas) y `marcas` (cantidad de marcas del eje Y). `titulo` acepta un `ReactNode` en los tres gráficos.
- **Mapa de calor** en la biblioteca (`.calor`, `.calor-celda`, `.calor-fila-titulo`, `.calor-final`, `.calor-leyenda`): celdas con aire y esquinas redondeadas, y al final de cada fila cómo quedó. La paleta divergente clara (`--div-*`) baja un tono: lo "igual" casi desaparece y el rojo más fuerte deja de dominar.
- Tablas: encabezados con línea más suave, `.tenue` para columnas secundarias, `tr.grupo` para filas de grupo con subtotal y `.boton-marca` (estrella de favorito que aparece al pasar el cursor y queda fija si está marcada).

## v0.13.0 — 2026-10-27

Pulido de la línea panel en escritorio, a partir del monitor Sodimac.

- **Página más ancha y alineada**: `.contenido` pasa de 1200 px a `--ancho-pagina` (1440 px) con un margen lateral fluido `--margen-pagina` (16–40 px). La barra superior usa la misma columna, así el logo queda alineado con el contenido (antes iba pegado al borde). Las dos variables se pueden sobrescribir en `:root` desde el proyecto.
- La línea de `.barra-pestanas` queda del ancho de las tarjetas; antes sobresalía 16 px por lado.
- **Cifras más firmes**: el h1 y `.indicador-valor` pasan a peso 650 con un interletrado más cerrado (−0,022em y −0,03em). Requiere Inter en rango variable (`wght@400..700`); el README ya lo indica.
- **Títulos de tarjeta con más jerarquía**: `.tarjeta-cabecera h2` a peso 650, con más aire entre la cabecera y el contenido.
- `.chip.chip-contorno`: chip liviano, solo con borde fino, para listas largas de nombres. Si es enlace, toma el acento al pasar el cursor.
- Tablas: todas las filas se iluminan levemente al pasar el cursor; las clicables, como antes.
- Modo oscuro: las tarjetas llevan un brillo interior de 1 px arriba.
- `GraficoBarras`: barras con radio de 4 px y nueva opción `destacarMaximo`, que deja solo la barra más alta en color pleno y el resto al 60 %.

## v0.12.1 — 2026-10-27

- Línea panel: la leyenda de los gráficos (`.leyenda`) pasa a varias líneas cuando no cabe y cada serie queda en una sola línea. Con 3 o 4 series se salía de la pantalla en el celular (visto en el monitor Sodimac).

## v0.12.0 — 2026-10-24

- **Nueva línea "luz"** (`lineas/luz.css`, clases `l-` bajo `.luz`): interfaces de tocar y encender, inspiradas en la sensación del Every Day Calendar de Simone Giertz. Papel claro y cálido de día; **reposo** (`.l-reposo`) casi negro, con las luces tenues, para pantallas que pasan el día dormidas. Luces grandes (`.l-luz` con `aria-pressed`) con halo de su color, ✓ de cumplido (`.l-marca`) y destello corto al encender (`.l-destellando`); calendario de puntos (`.l-calendario`, `.l-punto`) para la semana, el mes o el año; filas por hábito (`.l-fila`); ocho colores (`.l-color-ambar` … `.l-color-lima`) o `--l-color` desde los datos. Nació con el proyecto de hábitos.
- Vitrina: página `luz.html`, con control de día, reposo y "dormir a los 8 s".

## v0.11.0 — 2026-10-23

Reglas adoptadas tras revisar dos skills de diseño externas (Impeccable y Taste); ver PREFERENCIAS.md.

- Tokens de movimiento: `--dur-rapida` (150 ms), `--dur` (200 ms), `--dur-lenta` (400 ms) y `--curva` (desaceleración, sin rebote). La línea panel los usa en todas sus transiciones (antes 120–180 ms sueltos).
- Línea panel: la selección de texto, el cursor de texto y las barras de desplazamiento toman la paleta; títulos con `text-wrap: balance` y notas y estados vacíos con `text-wrap: pretty`.
- Línea sitio: interletrado de `.s-display` y de la marquesina de −0,045em a −0,04em.
- Acento verde: `--tinta-3` claro de `#6a746e` a `#67716b` (sobre `--plano` quedaba en 4,44:1; ahora 4,64:1).
- `npm run contraste`: revisa los pares de tokens con cada acento y en ambos temas.
- README: cómo revisar una pantalla (contraste, tres anchos, casos extremos).

## v0.10.0 — 2026-10-15

- `Carrusel3D`: eje `horizontal` (gira como rueda, arriba y abajo), `proporcion` de las tarjetas (p. ej. 2/3 para fotos de producto), `ajustar` (se detiene con una tarjeta al frente), `rueda` (rueda del mouse sobre el lienzo, una tarjeta por paso), `activo` y `onActivo` para sincronizarlo con una ficha o una lista, y tocar una tarjeta la trae al frente. Las tarjetas lejos del frente se oscurecen.

## v0.9.0 — 2026-10-15

- `Silueta3D`: estilos `cromo` (metal oscuro iridiscente con dos luces de color que giran) y `holograma` (translúcido con bordes que brillan, barrido y cortes de glitch; tocar provoca uno), además de `neon`. Nuevos: `ondean` (formas que cuelgan y se mecen como cintas), `aleteo` (amplitud) y `colorSecundario`. Bisel en los bordes para cromo y holograma.
- Vitrina 3d: selector de estilo en la escena Silueta.

## v0.8.0 — 2026-10-15

- `@lucas-vergara/estilos/3d`: `Silueta3D`, que convierte trazos SVG (formas, líneas y nodos) en un objeto con volumen y contorno de neón que se dibuja al aparecer y al tocarlo; las formas indicadas en `aletean` se mueven como alas. Por defecto usa la tinta y el destello de la paleta; acepta colores propios (p. ej. los de una marca).
- Vitrina 3d: escena "Silueta" con una mariposa genérica.

## v0.7.0 — 2026-10-15

- **Nueva línea "3d"** (`lineas/3d.css`, clases `td-`, sobre la línea sitio): escenarios en caja, a todo el ancho y con recorrido por scroll; escena y texto lado a lado; panel translúcido para texto sobre la escena; selector de opciones.
- `@lucas-vergara/estilos/3d`: escenas nuevas `Orbe3D` (degradado con ruido en shader), `Vidrio3D` (vidrio con refracción y dispersión sobre un texto), `Particulas3D` (nube que se transforma entre esfera, cubo, toro, ola y espiral), `Terreno3D` (paisaje de puntos o malla), `Bloques3D` (piso de columnas), `Carrusel3D` (tarjetas en cilindro que se arrastran) y `Tunel3D` (túnel que avanza con el scroll). Se exportan `usarEscena`, `avanceEnPantalla`, `avanceRecorrido` y `texturaTexto` para escenas propias. Las texturas con texto se redibujan cuando cargan las fuentes.
- Vitrina: página `3d.html`. En `sitio.html` el hero ya no lleva el objeto 3D (ahora vive en la línea 3d); la paleta por defecto de la vitrina es grafito y va primera en el selector.

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
