/**
 * Interacciones con el puntero de la línea "sitio" (solo mouse; con movimiento reducido no hace nada):
 *  - data-magnetico="0.3"   el elemento se acerca al cursor cuando pasa cerca (botones, íconos). El número es la fuerza.
 *  - data-inclinar="8"      tarjeta .s-inclinable que se inclina en 3D hacia el cursor (grados máximos), con brillo
 *                           si contiene un <span class="s-brillo">.
 * Devuelve una función para detenerlo.
 */
export declare function iniciarInteracciones(): () => void;
