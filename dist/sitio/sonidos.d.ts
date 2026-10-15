export declare const sonidos: {
    /** Clic corto y suave (botones, enlaces). */
    clic: () => void;
    /** Toque muy breve para pasar el cursor (úsalo con moderación). */
    roce: () => void;
    /** Dos notas que suben: activar, abrir, confirmar. */
    activar: () => void;
    /** Dos notas que bajan: desactivar, cerrar. */
    desactivar: () => void;
    /** Barrido suave: cambio de página, telón. */
    barrido: () => void;
    /** Rebote: un objeto 3D que se toca. */
    rebote: () => void;
    readonly activo: boolean;
    /** Enciende o apaga los sonidos (y recuerda la elección). */
    encender: (v: boolean) => void;
};
/** Estado de sonido para componentes React. */
export declare function useSonido(): boolean;
/** Botón redondo para activar o silenciar los sonidos, con ondas que se mueven cuando están activos. */
export declare function BotonSonido({ className }: {
    className?: string;
}): import("react").JSX.Element;
