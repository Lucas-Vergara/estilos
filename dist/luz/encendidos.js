// Maneras de encender una luz. "destello" es la de siempre; las otras nacieron en la app de hábitos (18-11-2026),
// inspiradas en la pantalla de carga de los Xiaomi: pulsos suaves, un arco que da la vuelta y la mezcla de ambos.
export const ENCENDIDOS_LUZ = ["destello", "pulsos", "carga", "completa"];
export const NOMBRES_ENCENDIDO_LUZ = {
    destello: "Destello",
    pulsos: "Pulsos",
    carga: "Carga",
    completa: "Carga completa",
};
export const NOTAS_ENCENDIDO_LUZ = {
    destello: "El color entra despacio y un aro sale una vez.",
    pulsos: "Tres ondas suaves y el color que entra a latidos.",
    carga: "Un arco brillante da la vuelta mientras el color sube.",
    completa: "La carga y, al cerrar el círculo, dos pulsos.",
};
/** Cuánto dura cada encendido, en ms: lo que la luz queda con .l-destellando. */
export const DURACION_ENCENDIDO_LUZ = {
    destello: 1400,
    pulsos: 2800,
    carga: 2450,
    completa: 3600,
};
