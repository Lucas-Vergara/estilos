/**
 * Movimiento ligado al scroll de la línea "sitio". Atributos:
 *  - data-reveal            entra con fundido y desplazamiento al cruzar el 90% de la pantalla (una vez). Retraso con --delay.
 *  - data-words="stagger"   las palabras [data-w] entran escalonadas al aparecer (ver <Palabras>).
 *  - data-words="scroll"    las palabras [data-w] se encienden según el avance del scroll.
 *  - data-marquee="left|right"  la línea recorre todo su ancho mientras su sección cruza la pantalla.
 *  - data-px="0.15"         parallax horizontal según la distancia al centro de la pantalla.
 *  - data-px-hero="0.25"    sube con el scroll y se desvanece (logo sobre un hero).
 *  - data-sx                se desliza desde la izquierda al entrar.
 *  - .s-cabecera-sobre      recibe data-solida al pasar el hero (fondo sólido).
 * Respeta prefers-reduced-motion (todo visible, sin desplazamientos).
 */
function movimiento() {
  document.documentElement.classList.add("js");
  const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const limitar = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const todos = (sel: string) => document.querySelectorAll<HTMLElement>(sel);
  let raf = 0;

  const actualizar = () => {
    raf = 0;
    const vh = window.innerHeight;
    const vw = document.documentElement.clientWidth;

    // Cabecera transparente sobre un hero: sólida una vez que el hero quedó atrás.
    todos(".s-cabecera-sobre").forEach((el) => el.toggleAttribute("data-solida", window.scrollY > vh * 0.85));

    todos("[data-reveal]:not([data-shown]), [data-words='stagger']:not([data-shown])").forEach((el) => {
      if (reducido || el.getBoundingClientRect().top < vh * 0.9) {
        requestAnimationFrame(() => requestAnimationFrame(() => el.setAttribute("data-shown", "")));
      }
    });
    if (reducido) return;

    todos("[data-words='scroll']").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) return;
      const p = limitar((vh * 0.85 - r.top) / (r.height + vh * 0.35));
      const palabras = el.querySelectorAll<HTMLElement>("[data-w]");
      palabras.forEach((w, i) => {
        const t = limitar(p * (palabras.length + 2) - i);
        w.style.opacity = String(0.14 + 0.86 * t);
        w.style.transform = `translateY(${(1 - t) * 0.18}em)`;
      });
    });

    todos("[data-marquee]").forEach((el) => {
      const caja = el.parentElement!.getBoundingClientRect();
      if (caja.bottom < 0 || caja.top > vh) return;
      // 0 cuando la banda entra por abajo, 1 cuando sale por arriba; con margen para ver los extremos.
      const p = limitar(((vh - caja.top) / (vh + caja.height) - 0.1) / 0.8);
      const sobra = Math.max(0, el.scrollWidth - vw);
      const x = el.dataset.marquee === "right" ? -(1 - p) * sobra : -p * sobra;
      el.style.transform = `translate3d(${x}px,0,0)`;
    });

    todos("[data-px]").forEach((el) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translateX(${(r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.px || "0")}px)`;
    });

    todos("[data-px-hero]").forEach((el) => {
      const y = window.scrollY;
      el.style.transform = `translateY(${-y * parseFloat(el.dataset.pxHero || "0")}px)`;
      el.style.opacity = String(limitar(1 - y / (vh * 0.8)));
    });

    todos("[data-sx]").forEach((el) => {
      const p = limitar((vh - el.getBoundingClientRect().top) / (vh * 0.6));
      el.style.transform = `translateX(${(p - 1) * 12}vw)`;
    });
  };

  const programar = () => {
    if (!raf) raf = requestAnimationFrame(actualizar);
  };

  // Contenido que aparece después (navegación del lado del cliente, filtros).
  const observador = new MutationObserver(programar);
  observador.observe(document.body, { childList: true, subtree: true });
  window.addEventListener("scroll", programar, { passive: true });
  window.addEventListener("resize", programar);
  window.addEventListener("load", programar);
  actualizar();
  return () => {
    observador.disconnect();
    cancelAnimationFrame(raf);
    window.removeEventListener("scroll", programar);
    window.removeEventListener("resize", programar);
    window.removeEventListener("load", programar);
  };
}

/** Activa el movimiento. Devuelve una función para detenerlo. Llamar una vez, en el cliente. */
export function iniciarMovimiento(): () => void {
  return movimiento();
}

/**
 * El mismo motor como script en línea, para ponerlo al final del <body> (corre apenas llega el HTML, sin esperar a
 * React; evita el destello de contenido antes de animar). En Next: <script dangerouslySetInnerHTML={{ __html: SCRIPT_MOVIMIENTO }} />.
 */
export const SCRIPT_MOVIMIENTO = `(${movimiento.toString()})()`;
