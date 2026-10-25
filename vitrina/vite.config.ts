import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// La vitrina usa el código fuente directo (../src, ../css): lo que ves aquí es lo que se publicará.
// Una página por línea: index.html (panel), sitio.html (sitio), 3d.html (3d), sitio-disenadora.html (sitio diseñadora) y luz.html (luz).
export default defineConfig({
  root: "vitrina",
  base: "/estilos/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: { panel: resolve(import.meta.dirname, "index.html"), sitio: resolve(import.meta.dirname, "sitio.html"),
        sitioDisenadora: resolve(import.meta.dirname, "sitio-disenadora.html"), tresd: resolve(import.meta.dirname, "3d.html"),
        luz: resolve(import.meta.dirname, "luz.html"),
      },
    },
  },
});
