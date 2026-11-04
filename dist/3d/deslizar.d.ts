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
export declare function pasosDeslizar(largo: number, cruzado: number, ms: number, tamano: number): number;
