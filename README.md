# estilos

Mi biblioteca de estilos: una sola fuente para el look and feel de mis proyectos.
Cuando un estilo mejora en un proyecto, se sube aquí y los demás proyectos lo reciben **cuando yo decida**.

**Vitrina:** [línea panel y panel2](https://lucas-vergara.github.io/estilos/) · [línea sitio](https://lucas-vergara.github.io/estilos/sitio.html) · [línea 3d](https://lucas-vergara.github.io/estilos/3d.html) · [línea sitio diseñadora](https://lucas-vergara.github.io/estilos/sitio-disenadora.html) · [línea luz](https://lucas-vergara.github.io/estilos/luz.html) · [línea club](https://lucas-vergara.github.io/estilos/club.html) · local: `npm install && npm run vitrina`

## Líneas

Una **línea** es un lenguaje visual completo para un tipo de proyecto. Todas comparten `tokens.css`.

| Línea | Archivo | Para qué | Cómo se ve |
|---|---|---|---|
| **panel** | `base.css` (o `lineas/panel.css`) | Paneles de datos: monitores, dashboards, herramientas | Fondo gris claro, tarjetas blancas, densidad compacta, Inter |
| **panel2** | `base.css` + `lineas/panel2.css`, `<body class="panel2">` | Paneles de datos que piden más jerarquía y calma | La línea panel con la navegación fundida en el fondo y el contenido en una sola hoja blanca, sin caja por bloque. Grises con tinte del acento, cifras con la unidad en chico, barras de proporción, zona de carga. Inter |
| **sitio** | `lineas/sitio.css` | Webs de presentación y portafolio | Clara y limpia, con personalidad: avatar, fondos vivos, paletas, entrada, telón entre páginas, scroll con movimiento. Bricolage Grotesque + Geist |
| **3d** | `lineas/3d.css` (sobre sitio) | Secciones y heros con escenas 3D | Escenarios para las escenas de `@lucas-vergara/estilos/3d` (Three.js): objetos, orbe, vidrio, partículas, paisaje, bloques, carrusel y túnel con scroll. Usa la tipografía y las paletas de sitio |
| **sitio diseñadora** | `lineas/sitio-disenadora.css` | Webs de estudio o marca, oscuras | Creada junto con Franservice ([franservice.cl](https://franservice.cl)): oscura, títulos enormes, mono en mayúscula, acento menta. Geist |
| **luz** | `lineas/luz.css` | Pantallas de tocar y encender: hábitos, rutinas, registros diarios | Papel claro de día y casi negro en reposo; luces de colores con halo que se encienden con un destello. Inter |
| **club** | `lineas/club.css` | Servicios con membresía o suscripción: clubes, gimnasios, academias, estudios | Nacida de [stridechile.cl](https://www.stridechile.cl/): papel cálido con módulos casi negros, titulares redondos con una frase en degradé, cifras condensadas, planes, tienda de pago único y la app de miembros en un teléfono. Outfit + Instrument Sans |

Las líneas se pueden **mezclar**: cada una vive bajo su propia clase y prefijo (`.sitio` con `s-…`, `.sitio-disenadora` con `sd-…`). Dentro de ellas, los tokens comunes toman los colores de la línea, así que una `.tarjeta`, un `Indicador` o un `GraficoLinea` de la línea panel se ven coherentes (ver "Proyectos" en la vitrina de sitio). Para una línea nueva: `css/lineas/<nombre>.css`, con alcance propio (`.<nombre>`) y prefijo de clases propio.

## Qué trae

| Capa | Archivo | Para qué |
|---|---|---|
| Tokens | `tokens.css` | Superficies, bordes, estados, sombras, radios, escalas de texto y espaciado, duraciones y curva de movimiento, modo oscuro |
| Acento | `acentos/verde.css`, `acentos/azul.css`, `acentos/petroleo.css` | Lo que distingue a cada proyecto: acento, tinte del texto, superficies oscuras, paletas de gráficos |
| Base | `base.css` | Reset y clases de la línea **panel**: `.barra`, `.tarjeta`, `.boton`, `.campo`, `.segmentado`, tablas, pestañas, chips, avisos… |
| Línea panel2 | `lineas/panel2.css` | Sobre las clases de `base.css`, todo bajo `.panel2`: la hoja (`.con-lateral-principal` o `.contenido`), bloques sin caja (`.tarjeta-caja` vuelve a la caja), `.unidad`, `.proporcion`, `.encabezado`, `.zona-carga` |
| Línea sitio | `lineas/sitio.css` | Tipografía, cabecera que se esconde, navegación en píldora, avatar, hero con fondo vivo, entrada, telón, proyectos en marco de navegador, scroll horizontal, tarjetas inclinables, marquesina, galería, variantes noche y simple |
| Línea 3d | `lineas/3d.css` | Escenarios para escenas 3D (clases `td-`): `td-escenario`, `td-escenario-pleno`, `td-recorrido` (con scroll), `td-dueto`, `td-sobre` + `td-panel`, `td-selector` |
| Línea sitio diseñadora | `lineas/sitio-disenadora.css` | La línea oscura creada con Franservice (clases `sd-`) |
| Línea luz | `lineas/luz.css` | Luces que se encienden, calendario de puntos, filas por hábito, modo reposo, capa de fondo y tablero con forma (clases `l-`) |
| Línea club | `lineas/club.css` | Cabecera, módulos oscuros, hero con nombre gigante, datos y pasos, evento con inscripción por pasos, planes, agenda del mes, convenios, tienda, app de miembros, preguntas, cierre, pie, diálogo (clases `c-`) |
| Tailwind | `tailwind.css` | Puente para proyectos con Tailwind v4 (`bg-superficie`, `text-acento`…) sobre las mismas variables |
| Componentes | `@lucas-vergara/estilos` | `Indicador`, `Variacion`, `Estado`, `Frescura`, `Vacio`, `ElegirArchivo`, `Segmentado`, `Pestanas`, `NavegacionLateral`, `ThOrden`, esqueletos, `BotonTema`, `useOrden`… |
| Gráficos | `@lucas-vergara/estilos/graficos` | `GraficoLinea`, `GraficoBarras`, `GraficoBanda`, `Sparkline` (requiere `recharts`) |
| Sitio (React) | `@lucas-vergara/estilos/sitio` | `Entrada`, `Telon` + `irCon`, `NavPildora` + `useSeccionActiva`, `Avatar`, `FondoAnimado`, `MarcoNavegador`, `Proyecto`, `Ola`, `BotonSonido` + `sonidos`, `Palabras`, `Acento`, `Cursor` (solo sitio diseñadora), `iniciarMovimiento`, `iniciarInteracciones`, `SCRIPT_MOVIMIENTO`, `conTransicion` |
| Luz (React) | `@lucas-vergara/estilos/luz` | `Luz`, `CapaFondo` (14 fondos: agua, gradientes, madera, arena, washi), `acomodarLuces` / `useAcomodoLuces` + `lugarDeLuz` (equilibrio, figuras, círculo, piedras, sendero), y las listas `FONDOS_LUZ` y `ORDENES_LUZ` con sus nombres |
| Club (React) | `@lucas-vergara/estilos/club` | `iniciarClub` (palabras que entran desenfocadas), `IndicadorPasos`, `Telefono`, `useProgresoFijo` (sección fija que avanza con el scroll) |
| 3D (React) | `@lucas-vergara/estilos/3d` | `Objeto3D` (burbuja, nudo, anillos), `Orbe3D`, `Vidrio3D`, `Particulas3D`, `Terreno3D`, `Bloques3D`, `Carrusel3D`, `Tunel3D`, `Silueta3D` (trazos SVG con volumen: neón, cromo u holograma), `Grilla3D`, y `usarEscena` para escenas propias (requiere `three`) |

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

En `index.html`: la fuente Inter (pesos 400..700 y tamaño óptico 14..32: la línea panel usa pesos intermedios como 650 y el corte de pantalla en cifras y títulos grandes) y el script que aplica el tema antes de pintar (evita un destello):

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..700&display=swap" rel="stylesheet" />
<script>try { if (localStorage.getItem("tema") === "dark") document.documentElement.dataset.theme = "dark"; } catch {}</script>
```

### Línea sitio

```html
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />
<script>document.documentElement.classList.add("js");</script>
<body class="sitio">…</body>   <!-- noche: class="sitio s-oscuro" · sin movimiento: class="sitio s-simple" -->
<body class="sitio s-paleta-coral">…</body>   <!-- paletas: indigo (por defecto), grafito, ciruela, coral, bosque, oceano, arena -->
```

```tsx
import "@lucas-vergara/estilos/tokens.css";
import "@lucas-vergara/estilos/lineas/sitio.css";   // para mezclar con panel: acentos/<acento>.css y base.css ANTES
import { Entrada, Telon, irCon, NavPildora, useSeccionActiva, Avatar, FondoAnimado, Proyecto, BotonSonido,
  iniciarMovimiento, iniciarInteracciones } from "@lucas-vergara/estilos/sitio";
import { Grilla3D } from "@lucas-vergara/estilos/3d";  // solo si instalas three

useEffect(() => { const p = [iniciarMovimiento(), iniciarInteracciones()]; return () => p.forEach((f) => f()); }, []);
```

```tsx
<Entrada />  <Telon />
<header className="s-cabecera" data-ocultable=""> … <NavPildora enlaces={…} activo={…} onIr={(e) => irCon(e.texto, () => …)} /> <BotonSonido /></header>
<section className="s-hero"><FondoAnimado modo="manchas" desvanecer /> … <Avatar iniciales="AB" /></section>
<div className="s-proyectos">{proyectos.map((p, i) => <Proyecto key={p.titulo} p={p} indice={i + 1} />)}</div>
<a className="s-boton" data-magnetico="0.25">Ver proyectos <span className="s-flecha">→</span></a>
```

Atributos de movimiento: `data-reveal` (`""`, `escala`, `izquierda`, `derecha`), `data-words="stagger|scroll"`, `data-marquee`, `data-px`, `data-horizontal` (sección `.s-horizontal`), `data-progreso-scroll` (barra `.s-progreso`), `data-magnetico`, `data-inclinar` (tarjeta `.s-inclinable`).
Variables para ajustar por proyecto (en `.sitio`): `--s-acento`, `--s-destello`, `--s-fondo`, `--s-tinta`, `--s-display`, `--s-escala-titulos`.
Sonidos: generados con Web Audio, **apagados por defecto**; el visitante los activa con `BotonSonido`.

### Línea 3d

```tsx
import "@lucas-vergara/estilos/tokens.css";
import "@lucas-vergara/estilos/lineas/sitio.css";
import "@lucas-vergara/estilos/lineas/3d.css";
import { Orbe3D, Vidrio3D, Tunel3D } from "@lucas-vergara/estilos/3d";   // npm install three

<div className="td-escenario" style={{ "--td-proporcion": "1" }}><Orbe3D /></div>
<div className="td-escenario"><Vidrio3D texto="Hola" forma="lente" /></div>
<section className="td-recorrido" data-recorrido=""><div className="td-recorrido-fijo"><Tunel3D etiquetas={["Uno", "Dos"]} /></div></section>
```

Cada escena ocupa su contenedor, toma los colores de la paleta (y se rearma si cambian), se pausa fuera de pantalla y queda quieta con movimiento reducido.

### Navegación lateral (línea panel)

Al estilo del "mini variant drawer" de MUI: expandida o compacta (solo íconos), con grupos que se despliegan. No
depende de un enrutador: recibe la ruta actual y un componente `Enlace` (por defecto, un `<a>`).

```tsx
import { NavegacionLateral, useLateralCompacta, usePantallaAngosta, type GrupoLateral } from "@lucas-vergara/estilos";

const [compacta, setCompacta] = useLateralCompacta();          // recordado en el navegador
const angosta = usePantallaAngosta();                           // < 900 px: panel que se abre
const [abierta, setAbierta] = useState(false);
const Enlace = ({ href, ...p }: PropsEnlaceLateral) => <Link to={href} {...p} />;   // react-router, opcional

<header className="barra barra-app">
  <div className="barra-izquierda">
    <button className="boton-menu" onClick={() => (angosta ? setAbierta(!abierta) : setCompacta(!compacta))}>☰</button>
    <a className="marca" href="/">Mi app</a>
  </div>
</header>
<div className={`con-lateral${compacta ? " compacta" : ""}`}>
  <NavegacionLateral grupos={grupos} rutaActual={pathname} compacta={compacta} onExpandir={() => setCompacta(false)}
    abierta={abierta} onCerrar={() => setAbierta(false)} Enlace={Enlace} />
  <div className="con-lateral-principal"><main className="contenido">…</main></div>
</div>
```

Variables: `--ancho-lateral` (240 px), `--ancho-lateral-compacta` (64 px) y `--fondo-app` (fondo de la barra y la lateral).

### Elegir archivo (línea panel y panel2)

Una zona para arrastrar el archivo y un botón que abre el selector del sistema (el input nativo queda oculto, pero se
enfoca con el teclado). Muestra el archivo elegido o por qué no sirvió; los que no calzan con `accept` van a
`onRechazados`.

```tsx
import { ElegirArchivo } from "@lucas-vergara/estilos";

<ElegirArchivo
  accept=".xls,.csv,.txt"
  titulo="Arrastra el informe de pesajes"
  detalle="El archivo que exporta la romana, en .xls."
  ocupado={leyendo && "Leyendo…"}
  archivo={elegido && { nombre: elegido.name, detalle: "1.284 pesajes" }}
  error={error}
  onArchivos={([f]) => leer(f)}
  onRechazados={([f]) => setError(`«${f.name}» no es un .xls.`)}
/>
```

### Línea panel2

La línea panel con otra jerarquía, nacida de la exploración de Datos Reciclaje (referencia: el refresco de Linear).
Usa las mismas clases y componentes que panel; solo cambia lo que está bajo `.panel2`, así que un proyecto en la línea
panel no se entera.

```tsx
import "@lucas-vergara/estilos/tokens.css";
import "@lucas-vergara/estilos/acentos/verde.css";
import "@lucas-vergara/estilos/base.css";
import "@lucas-vergara/estilos/lineas/panel2.css";
// index.html: <body class="panel2">

<div className="encabezado">
  <div><h1>Resumen</h1><p className="nota">En octubre entraron 712,9 t…</p></div>
  <Segmentado … />
</div>
<Indicador etiqueta="Recibido" valor={<>712,9<span className="unidad">t</span></>} />
<td><span className="proporcion"><i style={{ width: "61%" }} /></span></td>
<div className="zona-carga"><span className="zona-carga-icono">…</span><b>Sube el archivo</b><span className="nota">…</span></div>
```

- **La hoja**: con navegación lateral, `.con-lateral-principal`; sin ella, `.contenido`. Barra y lateral toman el fondo
  (`--plano`, con un 5 % del acento) y pierden sus bordes. Dentro de la hoja `--plano` vale lo mismo que la superficie,
  así las pestañas fijas y lo que se pinta "del color de la página" calzan solos.
- **Sin caja por bloque**: `.tarjeta` queda como una sección separada por aire y una línea tenue. Para una caja dentro
  de la hoja (un bloque anidado, un diálogo): `.tarjeta.tarjeta-caja`.
- **La página actual** en la lateral es una píldora blanca con sombra mínima; el segmentado elegido va en tinta.
- Variables: `--radio-hoja` (14 px), `--margen-hoja` (8 px), `--sombra-hoja`.

### Línea sitio diseñadora

La misma idea con clases `sd-…` bajo `.sitio-disenadora` (variante clara: `sd-claro`). Componentes compartidos con `prefijo="sd"`: `<Palabras prefijo="sd" …>`, `<Acento prefijo="sd" …>`, `<Cursor />` (solo existe en esta línea).

### Línea luz

```tsx
import "@lucas-vergara/estilos/tokens.css";
import "@lucas-vergara/estilos/lineas/luz.css";
```

```html
<body class="luz">   <!-- dormida: class="luz l-reposo" -->
  <div class="l-tablero">
    <div class="l-casilla l-color-menta">
      <button class="l-luz" aria-pressed="true"><svg class="l-marca">…</svg></button>
      <span class="l-nombre">Caminar</span><span class="l-detalle">30 min</span>
    </div>
  </div>
  <div class="l-calendario l-color-menta"><span class="l-punto l-encendido"></span><span class="l-punto l-hoy"></span>…</div>
</body>
```

Al encender, poner `.l-destellando` en la luz y quitarla en `animationend`. Variables por proyecto: `--l-color`, `--l-tam-luz`, `--l-tam-punto`, `--l-columnas`, `--l-brillo`.

### Línea club

```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wdth,wght@75..100,400..700&family=Outfit:wght@600..900&display=swap" rel="stylesheet" />
<body class="club">   <!-- paletas: c-paleta-brasa · c-paleta-lima · c-paleta-marea (neón por defecto) -->
```

```tsx
import "@lucas-vergara/estilos/tokens.css";
import "@lucas-vergara/estilos/lineas/club.css";
import { iniciarClub, IndicadorPasos, Telefono, useProgresoFijo } from "@lucas-vergara/estilos/club";

useEffect(() => iniciarClub(), []);
<h2 className="c-titulo" data-c-palabras="">Elige <span className="c-degrade">tu plan.</span></h2>
<section className="c-modulo c-modulo-pad">…</section>          {/* bloque oscuro de esquinas grandes */}
<a className="c-boton c-boton-acento">Elegir plan <span className="c-flecha">→</span></a>
```

Cada paleta trae un degradé vivo (`--c-degrade-vivo`, sobre el asfalto) y uno hondo (`--c-degrade`, sobre el papel, 3:1 o más para títulos grandes); `.c-degrade` elige solo según dónde esté. Dentro de un módulo, `.c-claro` vuelve a los colores del papel. Variables por proyecto: `--c-papel`, `--c-tinta`, `--c-acento`, `--c-radio-modulo`, `--c-escala-titulos`.

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
# 2. Si cambió algún color: npm run contraste
# 3. Anotar el cambio en CHANGELOG.md
# 4. Crear la versión: compila dist/, hace el commit y la etiqueta
npm version minor   # o patch / major
git push --follow-tags
```

`dist/` va en el repo a propósito: así instalar desde GitHub no requiere compilar nada.

## Revisar una pantalla antes de darla por terminada

- **Contraste**: `npm run contraste` revisa los pares de tokens de la línea panel con cada acento y en ambos temas (texto 4,5:1; foco y controles 3:1).
- **Tres anchos de una vez**: mirar el resultado a 390, 768 y 1440 px en un solo pase, corregir todo lo que se vio y recién ahí volver a mirar.
- **Casos extremos**: un nombre de más de 100 caracteres, emoji en los campos, sin red, más de 1.000 filas, diez clics seguidos en enviar, errores forzados de la API, todo vacío, un arrastre cortado a la mitad (soltar fuera, cambiar de ventana).

