/**
 * Utilidades pequeñas y reutilizables para trabajar con el DOM.
 */

const HTML_ESCAPES = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
};

/**
 * Escapa texto antes de insertarlo en una plantilla HTML.
 * Evita que un carácter como "<" o "&" rompa el marcado.
 * @param {unknown} value
 * @returns {string}
 */
export function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

/**
 * Convierte un string HTML en un elemento del DOM.
 * @param {string} html  Marcado con un único elemento raíz.
 * @returns {HTMLElement}
 */
export function createElementFromHTML(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return /** @type {HTMLElement} */ (template.content.firstElementChild);
}

/** @returns {boolean} true si el usuario pidió reducir animaciones en su sistema. */
export function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
