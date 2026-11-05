// El único momento de movimiento de la línea club: palabras que entran desenfocadas al aparecer en pantalla.
// Parte el texto de cada [data-c-palabras] en <span class="c-palabra"> (los elementos hijos, como un .c-degrade, entran
// enteros como una sola pieza, .c-palabra-grupo, que sí puede partirse en líneas) y pone .c-visible a [data-c-palabras] y [data-c-revelar] cuando entran en pantalla.
// El CSS solo esconde si <html> tiene la clase "js", así que sin script todo se ve.

/** Parte un elemento en palabras animables. Devuelve cuántas piezas quedaron. */
export function partirPalabras(el: HTMLElement): number {
  if (el.dataset.cPartido) return Number(el.dataset.cPartido);
  let i = 0;
  for (const nodo of Array.from(el.childNodes)) {
    if (nodo.nodeType === Node.TEXT_NODE) {
      const partes = (nodo.textContent ?? "").split(/(\s+)/);
      const frag = document.createDocumentFragment();
      for (const parte of partes) {
        if (!parte) continue;
        if (/^\s+$/.test(parte)) { frag.append(parte); continue; }
        const s = document.createElement("span");
        s.className = "c-palabra";
        s.style.setProperty("--i", String(i++));
        s.textContent = parte;
        frag.append(s);
      }
      nodo.replaceWith(frag);
    } else if (nodo instanceof HTMLElement && nodo.tagName !== "BR") {
      nodo.classList.add("c-palabra-grupo");
      nodo.style.setProperty("--i", String(i++));
    }
  }
  el.dataset.cPartido = String(i);
  return i;
}

/** Activa el movimiento de la página. Devuelve una función para detenerlo. Con "reducir movimiento", muestra todo de una. */
export function iniciarClub(raiz: ParentNode = document): () => void {
  document.documentElement.classList.add("js");
  const palabras = Array.from(raiz.querySelectorAll<HTMLElement>("[data-c-palabras]"));
  palabras.forEach(partirPalabras);
  const todos = [...palabras, ...Array.from(raiz.querySelectorAll<HTMLElement>("[data-c-revelar]"))];
  const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (quieto || !("IntersectionObserver" in window)) {
    todos.forEach((el) => el.classList.add("c-visible"));
    return () => {};
  }
  const obs = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) if (e.isIntersecting) { e.target.classList.add("c-visible"); obs.unobserve(e.target); }
    },
    { threshold: 0.25, rootMargin: "0px 0px -8% 0px" },
  );
  todos.forEach((el) => obs.observe(el));
  return () => obs.disconnect();
}
