// Busca en GitHub repos ajenos que usen o copien la biblioteca (huella --estilos-lv, nombre del paquete, enlace al
// repo, clases propias) y revisa si muestran el crédito. Si encuentra algo, abre o actualiza un issue en este repo.
// Corre una vez al mes en GitHub Actions (.github/workflows/revisar-uso.yml); también a mano: GITHUB_TOKEN=… node scripts/revisar-uso.mjs

const TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPOSITORY ?? "Lucas-Vergara/estilos";
const DUENO = REPO.split("/")[0];
const SECO = process.argv.includes("--seco"); // solo mostrar, sin abrir issues

// Señales de uso: de la más segura (huella y nombre del paquete) a la más débil (nombres de clases o variables propias)
const BUSQUEDAS = [
  '"--estilos-lv"',
  '"@lucas-vergara/estilos"',
  '"Lucas-Vergara/estilos"',
  '"--s-escala-titulos"',
  '"credito-estilos"',
  '"--sobre-acento-suave" "--superficie-3"',
];
const CREDITO = ['"Estilos: Lucas Vergara"', '"Styles: Lucas Vergara"', "CreditoEstilos"];

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function gh(ruta, opciones = {}) {
  for (let intento = 1; ; intento++) {
    const r = await fetch(`https://api.github.com${ruta}`, {
      ...opciones,
      headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${TOKEN}`, "X-GitHub-Api-Version": "2022-11-28", ...opciones.headers },
    });
    if (r.ok) return r.json();
    const texto = await r.text();
    // Límite de búsquedas: esperar lo que pide GitHub (Retry-After o "try again in Ns") y reintentar
    if ((r.status === 429 || r.status === 403) && intento < 15) {
      const segundos = Number(r.headers.get("retry-after")) || Number(texto.match(/try again in ([\d.]+)s/)?.[1]) || 30;
      console.log(`Límite de GitHub (${r.status}); reintento en ${Math.ceil(segundos) + 2} s…`);
      await esperar((Math.ceil(segundos) + 2) * 1000);
      continue;
    }
    throw new Error(`${r.status} ${ruta}: ${texto}`);
  }
}

// La búsqueda de código tiene un límite muy bajo con el token de Actions: espaciar bien las llamadas (corre una vez al mes, no importa que tarde).
async function buscar(q) {
  await esperar(30000);
  const datos = await gh(`/search/code?per_page=100&q=${encodeURIComponent(q)}`);
  return datos.items ?? [];
}

const hallazgos = new Map(); // repo → { señales: Set, archivos: Set }
for (const q of BUSQUEDAS) {
  for (const item of await buscar(q)) {
    const repo = item.repository.full_name;
    if (repo.split("/")[0].toLowerCase() === DUENO.toLowerCase()) continue; // mis propios repos
    const h = hallazgos.get(repo) ?? { señales: new Set(), archivos: new Set() };
    h.señales.add(q);
    h.archivos.add(item.html_url);
    hallazgos.set(repo, h);
  }
}

const filas = [];
for (const [repo, h] of hallazgos) {
  let conCredito = false;
  for (const c of CREDITO) {
    if ((await buscar(`${c} repo:${repo}`)).length) { conCredito = true; break; }
  }
  filas.push({ repo, conCredito, ...h });
}

const hoy = new Date().toISOString().slice(0, 10);
if (!filas.length) {
  console.log(`${hoy}: sin usos detectados fuera de ${DUENO}.`);
  process.exit(0);
}

const cuerpo = [
  `Revisión del ${hoy}: repos públicos de otras cuentas con señales de la biblioteca.`,
  "",
  "| Repo | Crédito visible | Señales | Archivos |",
  "|---|---|---|---|",
  ...filas.map((f) => `| [${f.repo}](https://github.com/${f.repo}) | ${f.conCredito ? "✅ sí" : "❌ no encontrado"} | ${[...f.señales].join(" · ").replaceAll("|", "\\|")} | ${[...f.archivos].slice(0, 3).map((u, i) => `[${i + 1}](${u})`).join(" ")} |`),
  "",
  "La búsqueda de GitHub solo ve repos públicos y puede tardar en indexar. Las señales débiles (nombres de variables) pueden ser coincidencias: revisar antes de reclamar.",
].join("\n");
console.log(cuerpo);
if (SECO) process.exit(0);

// Un solo issue abierto con la etiqueta "uso-detectado": se crea la primera vez y luego se comenta cada mes.
const abiertos = await gh(`/repos/${REPO}/issues?state=open&labels=uso-detectado`);
if (abiertos.length) {
  await gh(`/repos/${REPO}/issues/${abiertos[0].number}/comments`, { method: "POST", body: JSON.stringify({ body: cuerpo }) });
  console.log(`Comentado en el issue #${abiertos[0].number}.`);
} else {
  const issue = await gh(`/repos/${REPO}/issues`, {
    method: "POST",
    body: JSON.stringify({ title: `Uso detectado de la biblioteca (${filas.length} repo${filas.length > 1 ? "s" : ""})`, body: cuerpo, labels: ["uso-detectado"] }),
  });
  console.log(`Issue creado: ${issue.html_url}`);
}
