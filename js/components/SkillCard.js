import { escapeHTML, createElementFromHTML } from "../utils/dom.js";
import { chip } from "./Chip.js";

/** @typedef {import("../data/skills.js").SkillGroup} SkillGroup */

/**
 * Crea la tarjeta de una categoría de habilidades.
 * @param {SkillGroup} group
 * @returns {HTMLElement}
 */
export function createSkillCard({ category, items }) {
    return createElementFromHTML(`
        <article class="rounded-xl border border-line bg-card/70 p-6 transition-colors duration-200 hover:border-line-strong">
            <h3 class="text-lg font-semibold mb-4">${escapeHTML(category)}</h3>
            <ul class="flex flex-wrap gap-2.5">
                ${items.map(({ name, icon }) => chip(name, { icon })).join("")}
            </ul>
        </article>
    `);
}
