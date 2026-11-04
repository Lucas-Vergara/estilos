/**
 * Cuántas tarjetas avanza un deslizamiento sobre un carrusel que se detiene en una tarjeta (positivo: la siguiente).
 * `largo` es lo recorrido a lo largo del giro (hacia los lados en un carrusel; hacia arriba o abajo en una rueda),
 * `cruzado` lo recorrido en el otro sentido, ambos en píxeles, `ms` lo que duró el gesto y `tamano` el ancho (o alto)
 * del lienzo en ese sentido.
 *
 * Arrastrando sin más, un ancho de lienzo gira un radián: con 4 tarjetas, pasar a la siguiente pedía deslizar casi un
 * ancho y medio, mucho en un celular. Con esto basta un gesto claro hacia el lado (más de un 15 % del tamaño, al menos
 * 48 px, y más largo que cruzado) para pasar una; cada 80 % del tamaño, o un gesto rápido y largo, suma otra.
 * Hacia la izquierda (o hacia arriba) trae la siguiente. Ajustado en Placa, en el celular (noviembre de 2026).
 */
export function pasosDeslizar(largo, cruzado, ms, tamano) {
    const d = Math.abs(largo);
    if (tamano <= 0 || d < Math.max(48, tamano * 0.15) || d < Math.abs(cruzado))
        return 0;
    const rapido = ms > 0 && d / ms > 1.6 && d > tamano * 0.5 ? 1 : 0;
    return -Math.sign(largo) * (Math.max(1, Math.round(d / (tamano * 0.8))) + rapido);
}
