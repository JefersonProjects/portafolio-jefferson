/**
 * Utilidades de fechas en formato "AAAA-MM".
 */

/** Abreviaturas fijas (Intl en es-PE usa "Set" para septiembre; así queda igual que en el CV). */
const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

/** @param {string} yearMonth "AAAA-MM" */
function parseYearMonth(yearMonth) {
    const [year, month] = yearMonth.split("-").map(Number);
    return { year, month };
}

/**
 * "2026-01" → "Ene 2026"
 * @param {string} yearMonth
 */
export function formatMonthYear(yearMonth) {
    const { year, month } = parseYearMonth(yearMonth);
    return `${MONTHS[month - 1]} ${year}`;
}

/**
 * Rango legible: ("2026-04", "2026-08") → "Abr 2026 – Ago 2026" · ("2026-04", null) → "Abr 2026 – Actualidad"
 * @param {string} start
 * @param {string | null | undefined} end
 * @param {{ expected?: boolean }} [options]  expected = la fecha de fin es estimada.
 */
export function formatPeriod(start, end, { expected = false } = {}) {
    const endLabel = end ? `${formatMonthYear(end)}${expected ? " (esperado)" : ""}` : "Actualidad";
    return `${formatMonthYear(start)} – ${endLabel}`;
}

/**
 * Meses entre dos fechas, contando ambos meses. ("2026-01", "2026-05") → 5
 * @param {string} start
 * @param {string | null} end  null = mes actual
 */
export function monthsBetween(start, end) {
    const from = parseYearMonth(start);
    const now = new Date();
    const to = end ? parseYearMonth(end) : { year: now.getFullYear(), month: now.getMonth() + 1 };
    return (to.year - from.year) * 12 + (to.month - from.month) + 1;
}

/** 5 → "5 meses", 14 → "1 año 2 meses" */
export function formatDuration(totalMonths) {
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    const parts = [];
    if (years) parts.push(`${years} ${years === 1 ? "año" : "años"}`);
    if (months) parts.push(`${months} ${months === 1 ? "mes" : "meses"}`);
    return parts.join(" ");
}
