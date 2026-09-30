import { escapeHTML } from "../utils/dom.js";

/**
 * Lista de logros con viñeta del color de acento.
 * Se usa en experiencia y proyectos para que ambos se vean igual.
 *
 * @param {string[]} items
 * @param {string} [className]  Clases extra para el <ul>.
 * @returns {string} HTML (vacío si no hay items)
 */
export function highlightList(items = [], className = "") {
    if (!items.length) return "";

    const rows = items
        .map(
            (text) => `
            <li class="flex gap-3">
                <span class="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" aria-hidden="true"></span>
                <span>${escapeHTML(text)}</span>
            </li>`
        )
        .join("");

    return `<ul class="space-y-2 text-fg-soft leading-relaxed ${className}">${rows}</ul>`;
}
