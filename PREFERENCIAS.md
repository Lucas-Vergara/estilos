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

## Me gusta — línea sitio

Tomado del rediseño de Franservice (con su diseñadora), octubre 2026:

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

## Descartado

- **MUI**: trae su propio look y pelea con el mío (solo se usó en etexScrapF, antiguo).

## Pendiente de decidir

- Fondo animado de la Store de Franservice (glitter/glitch en canvas): es código de la diseñadora (`design_handoff_store_fx/bg-fx.js`); no se copió a esta biblioteca pública. Si ella está de acuerdo, se puede sumar como efecto de la línea sitio.
- Acento de la línea sitio para proyectos propios (el menta es de Franservice): ¿mantenerlo o usar uno propio en el portafolio?

- Paletas de gráficos del acento azul: no están validadas con el validador de dataviz.
- Servir Inter desde la app (`@fontsource-variable/inter`) en vez de Google Fonts.
- Radix UI o Base UI para diálogos, menús y tooltips, cuando un proyecto los necesite.
- Si los acentos deberían teñir también `--plano` y los bordes en modo claro.

## Ideas por venir

- **Portafolio propio**: línea sitio para la presentación + casos de estudio con la línea panel adentro (ver "Mezcla" en la vitrina de sitio).

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
