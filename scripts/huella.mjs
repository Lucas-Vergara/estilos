// Pone la versión del paquete en la huella --estilos-lv de tokens.css (se corre en `npm version`).
import { readFileSync, writeFileSync } from "node:fs";

const { version } = JSON.parse(readFileSync("package.json", "utf8"));
const ruta = "css/tokens.css";
writeFileSync(ruta, readFileSync(ruta, "utf8").replace(/--estilos-lv: "[^"]*"/, `--estilos-lv: "${version}"`));
console.log(`huella --estilos-lv: "${version}"`);
