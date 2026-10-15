// Formato de fechas en español de Chile, usado por los componentes (tooltips, frescura del dato).
/** "2026-10-15" → "15 oct". */
export const diaCorto = (fecha) => new Date(`${fecha}T12:00:00`).toLocaleDateString("es-CL", { day: "numeric", month: "short" });
/** Horas transcurridas desde una fecha ISO (Infinity si no hay fecha). */
export const horasDesde = (iso) => (iso ? (Date.now() - new Date(iso).getTime()) / 3_600_000 : Infinity);
const relativo = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
/** "hace 5 minutos", "hace 3 horas", "hace 2 días". */
export function haceCuanto(iso) {
    if (!iso)
        return "nunca";
    const min = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
    if (min < 60)
        return relativo.format(-min, "minute");
    const h = Math.round(min / 60);
    if (h < 48)
        return relativo.format(-h, "hour");
    return relativo.format(-Math.round(h / 24), "day");
}
export const fechaHora = (iso) => iso ? new Date(iso).toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Santiago" }) : "—";
