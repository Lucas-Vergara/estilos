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

## Descartado

- **MUI**: trae su propio look y pelea con el mío (solo se usó en etexScrapF, antiguo).

## Pendiente de decidir

- Fondo animado de la Store de Franservice (glitter/glitch en canvas): es código de la diseñadora (`design_handoff_store_fx/bg-fx.js`); no se copió a esta biblioteca pública. Si ella está de acuerdo, se puede sumar como efecto de la línea sitio.
- Acento de la línea sitio oficial: hoy índigo (#3d5afe) con amarillo de destello (#ffd84d), elegido a partir de las referencias (Rauno, Robb, Josh). Confirmar o cambiar al revisar la vitrina.

- Paletas de gráficos del acento azul: no están validadas con el validador de dataviz.
- Servir Inter desde la app (`@fontsource-variable/inter`) en vez de Google Fonts.
- Radix UI o Base UI para diálogos, menús y tooltips, cuando un proyecto los necesite.
- Si los acentos deberían teñir también `--plano` y los bordes en modo claro.

## Ideas por venir

- **Portafolio propio**: línea sitio (oficial) para la presentación + casos de estudio con la línea panel adentro. Pendiente: avatar o foto, capturas de los sitios de demo de ozmo (con credenciales de admin), textos y proyectos reales.

## Proyectos y su versión

| Proyecto | Acento | Versión | Notas |
|---|---|---|---|
| monitor Sodimac (meyer/scrap2.0/web) | verde | v0.1.0 | origen de la biblioteca |
| radar de reciclaje | verde | v0.1.0 | componentes propios de una generación anterior (Tarjeta, Segmentado, Frescura); usa el Indicador de la biblioteca |
| monitor de proyectos | azul | v0.1.0 | ídem |
| oportunidades | azul | v0.1.0 | ídem |

### Fuera de la biblioteca (por decidir)

| Proyecto | Por qué no se migró |
|---|---|
| trote-app | Diseño propio (violeta, CSS modules) de una app de entrenamiento: adoptar la biblioteca sería un rediseño. |
| franservice (web) | Sitio de un cliente: es la fuente de la línea sitio, pero se deja tal cual (no carga la biblioteca). |
| meyer/calculadora-termica | Calculadora con la marca Gyplac (cliente), en Tailwind; además tiene cambios sin commitear. |
| Liss/axis, Liss/axis-2, fases, semillas | Tailwind con estilos propios; se podrían migrar con `tailwind.css` si se quiere la misma línea. |
| etexScrapF | Antiguo, en MUI. |
| ozmo | De trabajo: excluido. |

## Pendiente: unificar componentes

Radar, monitor de proyectos y oportunidades aún tienen su propio `Segmentado` (prop `onCambio`, opciones con `etiqueta`) y su propia `Frescura` (prop `iso`), con otra API que la de la biblioteca. Cuando se toquen, conviene migrarlos a los componentes de la biblioteca.
