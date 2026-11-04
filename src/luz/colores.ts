// Los colores de las luces (lineas/luz.css): ocho vivos y, de cada uno, un tono claro y uno hondo, en el mismo orden.

export const COLORES_VIVOS_LUZ = ["ambar", "coral", "rosa", "violeta", "azul", "cian", "menta", "lima"] as const;
export const COLORES_CLAROS_LUZ = ["maiz", "durazno", "chicle", "lavanda", "cielo", "agua", "aguamarina", "pistacho"] as const;
export const COLORES_HONDOS_LUZ = ["ocre", "tomate", "frambuesa", "uva", "anil", "petroleo", "esmeralda", "oliva"] as const;

/** Los 24, con los vivos primero (los que conviene repartir por defecto). Cada uno es una clase `.l-color-<nombre>`. */
export const COLORES_LUZ = [...COLORES_VIVOS_LUZ, ...COLORES_CLAROS_LUZ, ...COLORES_HONDOS_LUZ] as const;
export type ColorLuz = (typeof COLORES_LUZ)[number];

/** Cómo se leen (el nombre de la clase va sin tildes). */
export const NOMBRES_COLOR_LUZ: Record<ColorLuz, string> = {
  ambar: "ámbar", coral: "coral", rosa: "rosa", violeta: "violeta", azul: "azul", cian: "cian", menta: "menta", lima: "lima",
  maiz: "maíz", durazno: "durazno", chicle: "chicle", lavanda: "lavanda", cielo: "cielo", agua: "agua", aguamarina: "aguamarina", pistacho: "pistacho",
  ocre: "ocre", tomate: "tomate", frambuesa: "frambuesa", uva: "uva", anil: "añil", petroleo: "petróleo", esmeralda: "esmeralda", oliva: "oliva",
};
