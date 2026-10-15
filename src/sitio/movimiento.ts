/**
 * Movimiento ligado al scroll de la línea "sitio". Atributos:
 *  - data-reveal            entra con fundido y desplazamiento al cruzar el 90% de la pantalla (una vez). Retraso con --delay.
 *  - data-words="stagger"   las palabras [data-w] entran escalonadas al aparecer (ver <Palabras>).
 *  - data-words="scroll"    las palabras [data-w] se encienden según el avance del scroll.
 *  - data-marquee="left|right"  la línea recorre todo su ancho mientras su sección cruza la pantalla.
 *  - data-px="0.15"         parallax horizontal según la distancia al centro de la pantalla.
 *  - data-px-hero="0.25"    sube con el scroll y se desvanece (logo sobre un hero).
 *  - data-sx                se desliza desde la izquierda al entrar.
 *  - .s-cabecera-sobre / .sd-cabecera-sobre  reciben data-solida al pasar el hero (fondo sólido).
 *  - .s-cabecera[data-ocultable]  se esconde al bajar y vuelve al subir; recibe data-con-borde al dejar el inicio.
 *  - data-horizontal        en una sección .s-horizontal: queda fija y su .s-horizontal-pista avanza hacia el lado.
 *  - data-progreso-scroll   barra (.s-progreso) que se llena según el avance de la página.
 * Respeta prefers-reduced-motion (todo visible, sin desplazamientos).
 */
function movimiento() {
  document.documentElement.classList.add("js");
  const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const limitar = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const todos = (sel: string) => document.querySelectorAll<HTMLElement>(sel);
  let raf = 0;
  let ultimoY = window.scrollY;

  const actualizar = () => {
    raf = 0;
    const vh = window.innerHeight;
    const vw = document.documentElement.clientWidth;

    // Cabecera transparente sobre un hero: sólida una vez que el hero quedó atrás.
    const y = window.scrollY;
    todos(".s-cabecera-sobre, .sd-cabecera-sobre").forEach((el) => el.toggleAttribute("data-solida", y > vh * 0.85));
    // Cabecera que se esconde al bajar y vuelve al subir (con un margen para no temblar).
    const cambio = Math.abs(y - ultimoY) > 6;
    todos(".s-cabecera[data-ocultable]").forEach((el) => {
      el.toggleAttribute("data-con-borde", y > 8);
      if (cambio) el.toggleAttribute("data-oculta", y > ultimoY && y > 120 && !el.contains(document.activeElement));
    });
    if (cambio) ultimoY = y;
    // Progreso de lectura de la página.
    todos("[data-progreso-scroll]").forEach((el) => {
      const max = document.documentElement.scrollHeight - vh;
      el.style.transform = `scaleX(${max > 0 ? limitar(y / max) : 0})`;
    });

    todos("[data-reveal]:not([data-shown]), [data-words='stagger']:not([data-shown])").forEach((el) => {
      if (reducido || el.getBoundingClientRect().top < vh * 0.9) {
        // Dos cuadros de espera para que la transición se vea; con la pestaña oculta no hay cuadros: se muestra ya.
        if (document.hidden) el.setAttribute("data-shown", "");
        else requestAnimationFrame(() => requestAnimationFrame(() => el.setAttribute("data-shown", "")));
      }
    });
    if (reducido) return;

    // Sección fija con pista horizontal: la altura de la sección es el recorrido de la pista.
    todos("[data-horizontal]").forEach((el) => {
      const pista = el.querySelector<HTMLElement>(".s-horizontal-pista");
      if (!pista) return;
      const recorrido = Math.max(0, pista.scrollWidth - vw);
      const alto = `${vh + recorrido}px`;
      if (el.style.height !== alto) el.style.height = alto;
      const p = limitar(-el.getBoundingClientRect().top / (recorrido || 1));
      pista.style.transform = `translate3d(${-p * recorrido}px,0,0)`;
    });

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
    if (document.hidden) { actualizar(); return; }
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
