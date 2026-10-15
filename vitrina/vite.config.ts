import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// La vitrina usa el código fuente directo (../src, ../css): lo que ves aquí es lo que se publicará.
export default defineConfig({
  root: "vitrina",
  base: "/estilos/",
  plugins: [react()],
});
