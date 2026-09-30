/**
 * Colores del fondo animado, leídos de las variables CSS del tema (css/base.css).
 * Así el fondo cambia solo cuando cambias de modo claro/oscuro o el color de acento.
 *
 * @typedef {[number, number, number]} RGB
 *
 * @typedef {Object} Palette
 * @property {"dark" | "light"} theme
 * @property {RGB} fg        Color base (líneas, estrellas).
 * @property {RGB} accent    Color de acento (paquetes, pulsos).
 * @property {number} strength  Multiplicador de opacidad (en modo claro todo va más suave).
 */

/** @returns {Palette} */
export function readPalette() {
    const styles = getComputedStyle(document.documentElement);
    /** @param {string} name @returns {RGB} */
    const rgb = (name) => /** @type {RGB} */ (styles.getPropertyValue(name).trim().split(/\s+/).map(Number));
    const theme = document.documentElement.dataset.theme === "light" ? "light" : "dark";

    return {
        theme,
        fg: rgb("--c-fg"),
        accent: rgb(theme === "light" ? "--accent-500" : "--accent-400"),
        strength: theme === "light" ? 0.75 : 1,
    };
}

/**
 * Color con transparencia para el canvas.
 * @param {RGB} color
 * @param {number} alpha
 */
export function rgba([r, g, b], alpha) {
    return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha)).toFixed(3)})`;
}
