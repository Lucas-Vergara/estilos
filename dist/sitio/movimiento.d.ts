/** Activa el movimiento. Devuelve una función para detenerlo. Llamar una vez, en el cliente. */
export declare function iniciarMovimiento(): () => void;
/**
 * El mismo motor como script en línea, para ponerlo al final del <body> (corre apenas llega el HTML, sin esperar a
 * React; evita el destello de contenido antes de animar). En Next: <script dangerouslySetInnerHTML={{ __html: SCRIPT_MOVIMIENTO }} />.
 */
export declare const SCRIPT_MOVIMIENTO: string;
