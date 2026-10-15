# estilos

Mi biblioteca de estilos: una sola fuente para el look and feel de mis proyectos.
Cuando un estilo mejora en un proyecto, se sube aquí y los demás proyectos lo reciben **cuando yo decida**.

**Vitrina:** [línea panel](https://lucas-vergara.github.io/estilos/) · [línea sitio](https://lucas-vergara.github.io/estilos/sitio.html) · local: `npm install && npm run vitrina`

## Líneas

Una **línea** es un lenguaje visual completo para un tipo de proyecto. Todas comparten `tokens.css`.

| Línea | Archivo | Para qué | Cómo se ve |
|---|---|---|---|
| **panel** | `base.css` (o `lineas/panel.css`) | Paneles de datos: monitores, dashboards, herramientas | Fondo gris claro, tarjetas blancas, densidad compacta, Inter |
| **sitio** | `lineas/sitio.css` | Webs de presentación: estudio, portafolio, marca | Oscura, títulos enormes, mono en mayúscula, movimiento con el scroll, Geist |

Las líneas se pueden **mezclar**: la línea sitio vive bajo la clase `.sitio` con clases `s-…`. Dentro de `.sitio`, los tokens comunes toman los colores del sitio, así que una `.tarjeta`, un `Indicador` o un `GraficoLinea` de la línea panel se ven coherentes (ver la sección "Mezcla" de la vitrina). Para una línea nueva: `css/lineas/<nombre>.css`, con alcance propio (`.<nombre>`) y prefijo de clases propio.

## Qué trae

| Capa | Archivo | Para qué |
|---|---|---|
| Tokens | `tokens.css` | Superficies, bordes, estados, sombras, radios, escalas de texto y espaciado, modo oscuro |
| Acento | `acentos/verde.css`, `acentos/azul.css` | Lo que distingue a cada proyecto: acento, tinte del texto, superficies oscuras, paletas de gráficos |
| Base | `base.css` | Reset y clases de la línea **panel**: `.barra`, `.tarjeta`, `.boton`, `.campo`, `.segmentado`, tablas, pestañas, chips, avisos… |
| Línea sitio | `lineas/sitio.css` | Tipografía display, píldoras, hero, galería editorial, marquesina, cursor, flotantes, transiciones de página |
| Tailwind | `tailwind.css` | Puente para proyectos con Tailwind v4 (`bg-superficie`, `text-acento`…) sobre las mismas variables |
| Componentes | `@lucas-vergara/estilos` | `Indicador`, `Variacion`, `Estado`, `Frescura`, `Vacio`, `Segmentado`, `Pestanas`, `ThOrden`, esqueletos, `BotonTema`, `useOrden`… |
| Gráficos | `@lucas-vergara/estilos/graficos` | `GraficoLinea`, `GraficoBarras`, `GraficoBanda`, `Sparkline` (requiere `recharts`) |
| Sitio (React) | `@lucas-vergara/estilos/sitio` | `Palabras`, `Acento`, `Cursor`, `iniciarMovimiento`, `SCRIPT_MOVIMIENTO`, `conTransicion` |

## Usarlo en un proyecto

```bash
npm install https://github.com/Lucas-Vergara/estilos/archive/refs/tags/v0.1.0.tar.gz
```

Se instala desde el tarball HTTPS de la etiqueta (no con `github:…`): así `npm ci` funciona en GitHub Actions sin llaves SSH, y el lockfile guarda un hash de integridad.

```ts
// main.tsx — el orden importa: tokens → acento → base → estilos propios del proyecto
import "@lucas-vergara/estilos/tokens.css";
import "@lucas-vergara/estilos/acentos/verde.css";
import "@lucas-vergara/estilos/base.css";
import "./estilos.css"; // solo lo propio de este proyecto

import { Indicador, Variacion, BotonTema } from "@lucas-vergara/estilos";
import { GraficoLinea } from "@lucas-vergara/estilos/graficos";
```

En `index.html`: la fuente Inter y el script que aplica el tema antes de pintar (evita un destello):

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<script>try { if (localStorage.getItem("tema") === "dark") document.documentElement.dataset.theme = "dark"; } catch {}</script>
```

### Línea sitio

```html
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />
<script>document.documentElement.classList.add("js");</script>
<body class="sitio" data-transicion="fundido">…</body>
```

```ts
import "@lucas-vergara/estilos/tokens.css";
import "@lucas-vergara/estilos/lineas/sitio.css";
// Para mezclar con la línea panel: agrega acentos/<acento>.css y base.css ANTES de sitio.css
import { Palabras, Cursor, iniciarMovimiento } from "@lucas-vergara/estilos/sitio";

useEffect(() => iniciarMovimiento(), []); // data-reveal, data-words, data-marquee, data-px, data-sx
```

```tsx
<h2 className="s-titulo" data-reveal="">Trabajos<span className="s-contador">12</span></h2>
<Palabras modo="scroll" como="p" className="s-manifiesto" texto="Una imagen con *carácter*." />
<a className="s-pildora s-solida" href="/contacto">Escríbeme</a>
```

Variables para ajustar por proyecto (en `.sitio`): `--s-acento`, `--s-fondo`, `--s-tinta`, `--s-fuente`, `--s-escala-titulos` (multiplica todos los títulos grandes). Variante clara: `class="sitio sitio-claro"` (también en una sola sección).

**Regla:** el `estilos.css` del proyecto solo tiene lo que es de ese proyecto. Si algo sirve para otros, se sube aquí.

## Uso por terceros: crédito obligatorio

La biblioteca se puede usar libremente con una condición ([LICENSE](LICENSE)): toda web o app pública que la use
debe mostrar un crédito pequeño, **"Estilos: Lucas Vergara"**, enlazado a este repo, en el pie de página o en una
página de créditos. La forma más simple:

```tsx
import { CreditoEstilos } from "@lucas-vergara/estilos";

<footer>… <CreditoEstilos /></footer>   // en inglés: <CreditoEstilos texto="Styles: Lucas Vergara" />
```

Sin React: `<a class="credito-estilos" href="https://github.com/Lucas-Vergara/estilos">Estilos: Lucas Vergara</a>`.

Las versiones v0.1.0 a v0.2.1 se publicaron con MIT sin esta condición. Los proyectos del autor no la necesitan.

**Revisión mensual:** el workflow [Revisar uso](.github/workflows/revisar-uso.yml) busca cada mes en GitHub repos ajenos
con señales de la biblioteca (la huella `--estilos-lv`, el nombre del paquete, el enlace al repo o clases propias) y
revisa si dan el crédito. Si encuentra algo, abre o comenta un issue con la etiqueta `uso-detectado`. Para correrlo a
mano: pestaña Actions → Revisar uso → Run workflow, o `GITHUB_TOKEN=$(gh auth token) node scripts/revisar-uso.mjs --seco`.

## Versiones: actualizar, no actualizar o volver atrás

Cada proyecto fija una versión exacta (el `v0.1.0.tar.gz` del `package.json`). **Nada cambia en un proyecto hasta que tú cambies ese número.**

| Quiero… | Hago… |
|---|---|
| Ver qué cambió | Leer [CHANGELOG.md](CHANGELOG.md) y mirar la vitrina |
| Actualizar un proyecto | `npm install https://github.com/Lucas-Vergara/estilos/archive/refs/tags/v0.2.0.tar.gz` |
| **No** actualizarlo | Nada: se queda en su versión para siempre |
| Volver a una versión anterior | `npm install https://github.com/Lucas-Vergara/estilos/archive/refs/tags/v0.1.0.tar.gz` |
| Quedarme con lo nuevo salvo un detalle | Sobrescribir esa variable o clase en el `estilos.css` del proyecto (p. ej. `:root { --radio: 8px; }`) |

Números de versión (semver):

- **Parche** `0.1.0 → 0.1.1`: arreglos que no deberían notarse.
- **Menor** `0.1.0 → 0.2.0`: cosas nuevas o ajustes visuales chicos.
- **Mayor** `0.x → 1.0.0`: cambios que pueden romper o cambiar mucho el look (renombrar clases o variables). Revisar cada proyecto al subir.

## Publicar una versión nueva

```bash
# 1. Cambiar css/ o src/, revisar en la vitrina (npm run vitrina)
# 2. Anotar el cambio en CHANGELOG.md
# 3. Crear la versión: compila dist/, hace el commit y la etiqueta
npm version minor   # o patch / major
git push --follow-tags
```

`dist/` va en el repo a propósito: así instalar desde GitHub no requiere compilar nada.

