import { escapeHTML } from "../utils/dom.js";

/**
 * Chip/etiqueta pequeña (tecnologías, habilidades).
 * Único lugar donde se define su estilo: se usa en proyectos, experiencia y skills.
 *
 * @param {string} label
 * @param {{ icon?: string }} [options]  icon = clase de Devicon o Font Awesome.
 * @returns {string} HTML de un <li>
 */
export function chip(label, { icon } = {}) {
    return `
        <li class="inline-flex items-center gap-2 rounded-md border border-line-strong/40 bg-chip/60 px-3 py-1
                   text-xs sm:text-sm text-fg-soft">
            ${icon ? `<i class="${escapeHTML(icon)}" aria-hidden="true"></i>` : ""}
            ${escapeHTML(label)}
        </li>`;
}
