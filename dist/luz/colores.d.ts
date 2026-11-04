export declare const COLORES_VIVOS_LUZ: readonly ["ambar", "coral", "rosa", "violeta", "azul", "cian", "menta", "lima"];
export declare const COLORES_CLAROS_LUZ: readonly ["maiz", "durazno", "chicle", "lavanda", "cielo", "agua", "aguamarina", "pistacho"];
export declare const COLORES_HONDOS_LUZ: readonly ["ocre", "tomate", "frambuesa", "uva", "anil", "petroleo", "esmeralda", "oliva"];
/** Los 24, con los vivos primero (los que conviene repartir por defecto). Cada uno es una clase `.l-color-<nombre>`. */
export declare const COLORES_LUZ: readonly ["ambar", "coral", "rosa", "violeta", "azul", "cian", "menta", "lima", "maiz", "durazno", "chicle", "lavanda", "cielo", "agua", "aguamarina", "pistacho", "ocre", "tomate", "frambuesa", "uva", "anil", "petroleo", "esmeralda", "oliva"];
export type ColorLuz = (typeof COLORES_LUZ)[number];
/** Cómo se leen (el nombre de la clase va sin tildes). */
export declare const NOMBRES_COLOR_LUZ: Record<ColorLuz, string>;
