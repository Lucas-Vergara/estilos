/**
 * Interacciones con el puntero de la línea "sitio" (solo mouse; con movimiento reducido no hace nada):
 *  - data-magnetico="0.3"   el elemento se acerca al cursor cuando pasa cerca (botones, íconos). El número es la fuerza.
 *  - data-inclinar="8"      tarjeta .s-inclinable que se inclina en 3D hacia el cursor (grados máximos), con brillo
 *                           si contiene un <span class="s-brillo">.
 * Devuelve una función para detenerlo.
 */
export function iniciarInteracciones() {
    const fino = window.matchMedia("(pointer: fine)").matches;
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fino || reducido)
        return () => { };
    const mover = (e) => {
        if (e.pointerType !== "mouse")
            return;
        const destino = e.target;
        const magnetico = destino?.closest?.("[data-magnetico]");
        if (magnetico) {
            const r = magnetico.getBoundingClientRect();
            const fuerza = parseFloat(magnetico.dataset.magnetico || "0.3");
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            magnetico.style.transform = `translate(${dx * fuerza}px, ${dy * fuerza}px)`;
        }
        const tarjeta = destino?.closest?.("[data-inclinar]");
        if (tarjeta) {
            const r = tarjeta.getBoundingClientRect();
            const max = parseFloat(tarjeta.dataset.inclinar || "8");
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            tarjeta.dataset.activo = "";
            tarjeta.style.transform = `perspective(900px) rotateX(${(0.5 - py) * max * 2}deg) rotateY(${(px - 0.5) * max * 2}deg)`;
            tarjeta.style.setProperty("--brillo-x", `${px * 100}%`);
            tarjeta.style.setProperty("--brillo-y", `${py * 100}%`);
        }
    };
    // Al salir, el elemento vuelve a su lugar con la transición del CSS.
    const salir = (e) => {
        const el = e.target;
        if (el.matches?.("[data-magnetico]"))
            el.style.transform = "";
        if (el.matches?.("[data-inclinar]")) {
            el.style.transform = "";
            delete el.dataset.activo;
        }
    };
    document.addEventListener("pointermove", mover, { passive: true });
    document.addEventListener("pointerout", salir, { passive: true });
    return () => {
        document.removeEventListener("pointermove", mover);
        document.removeEventListener("pointerout", salir);
    };
}
