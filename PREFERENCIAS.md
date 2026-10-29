# Preferencias

Lo que me gusta, lo que descarté y por qué. Claude lo lee antes de diseñar algo nuevo; lo actualizamos cada vez que decido algo.

## Me gusta — línea panel

- **Fondo gris neutro con tarjetas blancas** de borde fino (sin sombras marcadas): las tarjetas se separan solas.
- **Densidad compacta**: tablas y controles de 36 px, cuerpo de 14 px.
- **Inter** con números de ancho fijo (`tabular-nums`) en tablas, ejes e indicadores.
- **Un solo acento por proyecto**, que también tiñe levemente el texto y el modo oscuro.
- **Texto casi negro con tinte**, no negro puro.
- **Modo claro por defecto**, el oscuro solo si lo elijo (no sigue al sistema).
- **Estados con ícono o texto**, nunca solo color (✓ Online, ✗ Sin stock, ▲/▼ en variaciones).
- **Esqueletos de carga** con la forma del contenido, para que la página no salte.
- **Gráficos sin caja propia** dentro de la tarjeta; líneas escalonadas para precios; eje Y con valores redondos.
- **Pestañas fijas** bajo la barra, con los filtros a la derecha.
- Escala tipográfica cerrada (7 tamaños) y espaciado en múltiplos de 4.
- **Página ancha en escritorio** (1440 px, desde v0.13.0) con la barra superior alineada al contenido: 1200 px dejaba demasiado margen a los lados en un panel con gráficos.
- **Cifras y títulos con peso 650** e interletrado cerrado; chips de contorno para listas largas de nombres; en los gráficos de barras, solo el máximo en color pleno cuando ayuda a leer el hallazgo.
- **Menos ruido (v0.14.0)**: la nota bajo un título dice el hallazgo y la metodología va en (i); los indicadores en una sola tarjeta; los cambios como línea de tiempo con la fecha a la izquierda; la cifra de hoy al final de la línea; tablas agrupadas en vez de repetir la región; columnas que no discriminan, fuera. Revisado en https://claude.ai/artifact/7SYf3ziNuwaW2ta9jPCyLn.
- **Navegación lateral al estilo MUI (v0.15.0)** cuando hay varias áreas con secciones: expandible o compacta (solo íconos), con submenús plegados al inicio, y la misma pieza que la barra superior (mismo fondo y borde). Reemplazó las dos filas de pestañas (áreas y secciones), que se veían raras.
- **Las propuestas se muestran en modo día**: los clientes usan el claro; el oscuro se revisa después.

## Me gusta — línea sitio diseñadora

Creada junto con Franservice (https://franservice.cl), a partir del rediseño hecho con su diseñadora, octubre 2026:

- **Oscuro casi negro con tinte verde** (`#0b0c0b`) y **un solo acento menta** (`#9df7c0`); nada más de color.
- **Títulos enormes y apretados** (interletrado muy negativo, interlineado < 1), con **una palabra en itálica liviana** en el acento ("imagen con *carácter*").
- **Mono en mayúscula** para todo lo secundario: navegación, etiquetas "(01) Trabajos", categorías, botones, pie.
- **Botones píldora** de borde fino que se llenan con el acento al pasar el cursor.
- **Manifiesto que se enciende palabra por palabra** con el scroll; títulos que entran escalonados.
- **Galería editorial**: grilla de 12 columnas con anchos y desfases distintos; zoom lento al pasar el cursor.
- **Marquesina** de una línea gigante que avanza con el scroll, con palabras en contorno.
- **Hero a pantalla completa** con segmentos de progreso y un "REC ●" que late.
- Detalles: cursor-punto que se agranda con "Ver", botón flotante que se abre con su etiqueta, wordmark gigante en el pie, transiciones de página suaves.
- Todo el movimiento respeta "reducir movimiento".

## Me gusta — línea sitio (oficial, desde v0.4.0)

Síntesis de la revisión de 20 portafolios (15-10-2026; marcas y notas en https://claude.ai/artifact/Eq4Be2PjdZQQe1xbjVVHEM).
**Me gusta:** Dennis Snellenberg, Rauno, Josh Comeau, Robb Owen, Bruno Simon, Henry Heffernan.
**Tal vez:** Maxime Heckel, Rafa, Matt Farley, Adham Dannaway, Cassie, Keita Yamada.
**No:** Emil Kowalski, Paco, Linus Rogge, Brian Lovin, Brittany Chiang, Lee Robinson, Anthony Fu, Jhey.

1. **Claridad, limpieza y tonos de día.** Aparece en casi todos los "me gusta". Descartados los oscuros y densos y lo "cargado" (incluida la fuente de Josh).
2. **Movimiento con intención.** Entrada al sitio y transiciones entre páginas (Dennis), movimiento con el scroll (Rauno), interacciones de la barra de navegación (Josh), efectos y transiciones (Robb).
3. **No al minimalismo de solo texto.** Los cuatro del grupo descartados: hace falta algo de personalidad (avatar, animación, fondo vivo).
4. **Efectos sí, complejidad no.** Animaciones 3D, audios y fondos generativos como recursos (Bruno, Henry, Cassie, Keita); no un sitio-juego ni la metáfora del computador 3D.

Ideas pedidas para la biblioteca:
- Sección de **3D y animación** (Bruno, Henry), con sonidos de interfaz.
- **Fondos animados** (Cassie, Keita).
- **Vitrina de proyectos** con capturas o videos hacia abajo (Maxime), también para trabajos de clientes (ozmo: el contrato lo permite; capturas de los sitios de demo, pendientes).
- **Opción de estilo simple** (Rafa).
- **Avatar** como toque personal (Josh, Robb, Matt).
- Rendimiento: que cargue rápido (Adham tarda demasiado).

## Paletas de la línea sitio (para probar)

Desde v0.6.0 hay siete, todas claras y limpias, con selector en la vitrina: índigo (por defecto), grafito (blanco y negro con lima, en la línea de Rauno), ciruela (violeta con rosado, en la línea de Josh Comeau), coral (cálida, en la línea de Robb Owen), bosque, océano y arena (papel cálido, editorial). Le gustan todas: se mantienen como opciones. La vitrina parte en grafito.

## Línea 3d (desde v0.7.0)

Lucas quiere los objetos 3D en su propia línea, no en el hero de sitio. Referencias revisadas: galerías de sitios con Three.js (Awwwards, mesh3d), Bruno Simon y Henry Heffernan (de su revisión), y técnicas comunes en sitios premiados: morphing de partículas sincronizado con scroll, vidrio con transmisión y refracción sobre texto, orbes con shader de ruido, paisajes de puntos, túneles por scroll y carruseles cilíndricos. Todo sin modelos externos, con los colores de la paleta.

Le gustan todas las escenas de la línea 3d: se mantienen para ir probando.

## Línea luz (desde v0.12.0)

Creada para la app de hábitos (24-10-2026), con la **sensación** del Every Day Calendar de Simone Giertz (no su look): tocar algo cumplido y que se prenda una luz, como un premio chico y físico.

- **Claro de día, oscuro solo en reposo.** Respeta que prefiero tonos claros: el negro aparece cuando la pantalla está "dormida" y no se lee, solo se mira de pasada.
- **Luces de colores vivos con halo** y un ✓ (el estado no queda solo en el color); lo pendiente es un hueco hundido en el papel.
- **Un solo momento de movimiento**: el destello al encender.
- **Sin ✓ y encendido lento (29-10-2026, en habitos):** encendida basta para decir "cumplido", así que el ✓ sobra (el estado sigue en `aria-pressed` para lectores de pantalla). El color entra despacio (~0,75 s) y el halo después (~1,3 s), para un efecto más zen; apagar sigue siendo rápido. La vista principal no muestra fecha, cuenta ni navegación: se cambia de vista deslizando el dedo. Por ahora vive en el `estilos.css` del proyecto; si otra app usa la línea luz, subirlo a la biblioteca.
- Pensada para pantallas táctiles vistas de lejos (pantalla en la sala, celular): blancos grandes, poco texto.

## Reglas adoptadas de Impeccable y Taste (23-10-2026)

Revisé dos skills de diseño populares, [Impeccable](https://github.com/pbakaus/impeccable) y [Taste](https://github.com/Leonxlnx/taste-skill), contra estas preferencias. No las instalamos: traen su propia dirección estética y pelearían con la biblioteca. Me quedé con estas reglas, que se suman a lo que ya tenía:

**Todas las líneas**
- **Lo que dibuja el navegador también lleva la paleta**: selección de texto, cursor de texto, barras de desplazamiento, foco (desde v0.11.0 en panel; sitio y diseñadora ya lo hacían).
- **Títulos con `text-wrap: balance`, párrafos con `pretty`.**
- **Movimiento de interfaz con los tokens** `--dur-rapida`, `--dur`, `--dur-lenta` y `--curva`: la salida, más rápida que la entrada; nunca rebote. Los momentos con autoría de cada línea (entrada, telón, manifiesto) conservan sus propios tiempos.
- **Un momento de movimiento por página**, no el mismo fade-up en cada sección. Las vitrinas muestran todas las variantes a propósito; en un proyecto real se elige una.
- **Botones que nombran su acción** ("Descargar CSV", no "Aceptar"); **errores que dicen qué pasó y cómo salir**. Nada de "Comenzar", "Saber más", "potencia", "sin fricción", "todo en uno" ni "no es solo X, es Y".
- **Contraste verificado, no a ojo**: `npm run contraste` (texto 4,5:1; foco y controles 3:1; ambos temas).
- **Interletrado de títulos hasta −0,04em.** Excepciones: los wordmarks gigantes y la línea diseñadora (interletrado muy negativo, elegido con la diseñadora).

**Línea panel**
- **Un dato repetido es una sola variable**; los totales se suman con los valores redondeados que se muestran, para que la pantalla cuadre a mano.
- **Un h1 sustantivo** ("Precios", el nombre del objeto), no un saludo, y debajo **una línea con el hallazgo** ("12 productos bajaron esta semana"), no una descripción de la pantalla.
- **Lo que más se hace, a un clic**, y la evidencia al lado de la respuesta (la cifra con su tendencia).

**Línea sitio (y sitios de clientes)**
- **Inventario del cliente antes de diseñar**: 8 a 12 cosas que son solo suyas (nombre y lo que significa, lugar, números, materiales, rituales). **Prueba del competidor**: si la idea sirve igual para el de al lado, es de la categoría, no del cliente.
- **Una cosa que el visitante pueda hacer**, hecha con el contenido del cliente: funciona con el pulgar, tiene alternativa sin script y es una sola.

**Al revisar**
- **Mirar a tres anchos de una vez** (390, 768, 1440 px), corregir todo y recién ahí volver a mirar.
- **Casos extremos** (lista en el README): nombres larguísimos, sin red, mil filas, doble envío, todo vacío.

**Revisado y se mantiene lo mío** (las skills lo marcan, pero es una decisión): mono en mayúscula, "(01) Trabajos" y bordes finos en la línea diseñadora; la palabra en itálica del título; fondo gris con un acento en el panel; Inter; cuerpo de 14 px en el panel; radio de 12 px.

## Descartado

- **Objeto 3D en el hero de la línea sitio**: se movió a la línea 3d.
- **Punto que sigue al cursor en toda la página** (línea sitio): no me gusta. Sí me gustan los efectos de cursor dentro de una sección (p. ej. la grilla 3D con la bola que sigue al puntero).
- **MUI**: trae su propio look y pelea con el mío (solo se usó en etexScrapF, antiguo).

## Pendiente de decidir

- Fondo animado de la Store de Franservice (glitter/glitch en canvas): es código de la diseñadora (`design_handoff_store_fx/bg-fx.js`); no se copió a esta biblioteca pública. Si ella está de acuerdo, se puede sumar como efecto de la línea sitio.
- Acento de la línea sitio oficial: hoy índigo (#3d5afe) con amarillo de destello (#ffd84d), elegido a partir de las referencias (Rauno, Robb, Josh). Confirmar o cambiar al revisar la vitrina.

- Paletas de gráficos del acento azul: no están validadas con el validador de dataviz.
- Servir Inter desde la app (`@fontsource-variable/inter`) en vez de Google Fonts.
- Radix UI o Base UI para diálogos, menús y tooltips, cuando un proyecto los necesite.
- Si los acentos deberían teñir también `--plano` y los bordes en modo claro.
- **Toda cifra relativa dice contra qué** ("+12 % vs. la semana pasada"): hacer obligatoria la referencia de `Variacion`, o dejarlo como regla.
- **Borde de los campos**: `--borde-campo` sobre blanco da 1,4:1 y la norma pide 3:1 para identificar un control. Subirlo oscurece todos los bordes de campos; decidir si se cambia o si basta con el fondo y la etiqueta.

## Ideas por venir

- **Línea para leer** (documentación, artículos, CV): la que falta junto a panel (operar), sitio (persuadir) y 3d/diseñadora (experiencia). Medida de 65ch, interlineado según el ancho, impresión. Puede ser la línea "documento" del CV.
- **Portafolio propio**: línea sitio (oficial) para la presentación + casos de estudio con la línea panel adentro. Pendiente: avatar o foto, capturas de los sitios de demo de ozmo (con credenciales de admin), textos y proyectos reales.

## Proyectos y su versión

| Proyecto | Acento | Versión | Notas |
|---|---|---|---|
| monitor Sodimac (meyer/scrap2.0/web) | verde | v0.15.0 | origen de la biblioteca; de aquí salieron el arreglo de leyendas (v0.12.1), el pulido de escritorio (v0.13.0) y el de menos ruido (v0.14.0) |
| radar de reciclaje (app de inteligencia de datos) | verde | v0.15.0 | de aquí salió la navegación lateral (v0.15.0), en la rama `unificada`; componentes propios de una generación anterior (Tarjeta, Segmentado, Frescura) |
| monitor de proyectos | azul | v0.15.0 | componentes propios de una generación anterior (Tarjeta, Segmentado, Frescura) |
| oportunidades | azul | v0.15.0 | componentes propios de una generación anterior (Tarjeta, Segmentado, Frescura) |
| finanzas | verde | v0.15.0 | app de finanzas personales (Firebase); estilos propios mínimos en `src/estilos.css` |
| habitos (web) | — (línea luz) | v0.15.0 | app de hábitos; la pantalla ESP32 replica la línea en su firmware |
| cv (PDF del currículum) | azul | v0.15.0 | solo tokens, copiados en `cv/estilos/`; hoja de impresión propia (`cv.css`) mientras se decide si va una línea "documento" |

### Fuera de la biblioteca (por decidir)

| Proyecto | Por qué no se migró |
|---|---|
| trote-app | Diseño propio (violeta, CSS modules) de una app de entrenamiento: adoptar la biblioteca sería un rediseño. |
| franservice (web) | Sitio de un cliente: es la fuente de la línea sitio, pero se deja tal cual (no carga la biblioteca). |
| meyer/calculadora-termica | Calculadora con la marca Gyplac (cliente), en Tailwind; además tiene cambios sin commitear. |
| Liss/axis, Liss/axis-2, fases | Tailwind con estilos propios; se podrían migrar con `tailwind.css` si se quiere la misma línea. |
| etexScrapF | Antiguo, en MUI. |
| ozmo | De trabajo: excluido. |

## Pendiente: unificar componentes

Radar, monitor de proyectos y oportunidades aún tienen su propio `Segmentado` (prop `onCambio`, opciones con `etiqueta`) y su propia `Frescura` (prop `iso`), con otra API que la de la biblioteca. Cuando se toquen, conviene migrarlos a los componentes de la biblioteca.
