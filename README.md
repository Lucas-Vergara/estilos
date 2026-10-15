# estilos

Mi biblioteca de estilos: una sola fuente para el look and feel de mis proyectos.
Cuando un estilo mejora en un proyecto, se sube aquí y los demás proyectos lo reciben **cuando yo decida**.

**Vitrina:** https://lucas-vergara.github.io/estilos/ · local: `npm install && npm run vitrina`

## Qué trae

| Capa | Archivo | Para qué |
|---|---|---|
| Tokens | `tokens.css` | Superficies, bordes, estados, sombras, radios, escalas de texto y espaciado, modo oscuro |
| Acento | `acentos/verde.css`, `acentos/azul.css` | Lo que distingue a cada proyecto: acento, tinte del texto, superficies oscuras, paletas de gráficos |
| Base | `base.css` | Reset y clases de la línea **panel**: `.barra`, `.tarjeta`, `.boton`, `.campo`, `.segmentado`, tablas, pestañas, chips, avisos… |
| Tailwind | `tailwind.css` | Puente para proyectos con Tailwind v4 (`bg-superficie`, `text-acento`…) sobre las mismas variables |
| Componentes | `@lucas-vergara/estilos` | `Indicador`, `Variacion`, `Estado`, `Frescura`, `Vacio`, `Segmentado`, `Pestanas`, `ThOrden`, esqueletos, `BotonTema`, `useOrden`… |
| Gráficos | `@lucas-vergara/estilos/graficos` | `GraficoLinea`, `GraficoBarras`, `GraficoBanda`, `Sparkline` (requiere `recharts`) |

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

**Regla:** el `estilos.css` del proyecto solo tiene lo que es de ese proyecto. Si algo sirve para otros, se sube aquí.

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

## Líneas

Hoy hay una: **panel** (paneles de datos densos). Si nace otra (p. ej. una landing más amplia), irá como `css/lineas/<nombre>.css` sobre los mismos tokens. Ver [PREFERENCIAS.md](PREFERENCIAS.md).
