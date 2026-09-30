import { escapeHTML, createElementFromHTML } from "../utils/dom.js";
import { formatPeriod } from "../utils/date.js";
import { chip } from "./Chip.js";

/** @typedef {import("../data/education.js").Education} Education */

/**
 * Tarjeta de estudios.
 * @param {Education} item
 * @returns {HTMLElement}
 */
export function createEducationCard(item) {
    const { institution, degree, location, start, end, expected, note, courses = [] } = item;

    const meta = [formatPeriod(start, end, { expected }), note, location].filter(Boolean).map(escapeHTML);

    return createElementFromHTML(`
        <article class="h-full rounded-xl border border-line bg-card/70 p-6 md:p-8 transition-colors duration-200 hover:border-line-strong">
            <div class="flex items-start gap-4">
                <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent-500/10 text-accent-400" aria-hidden="true">
                    <i class="fa-solid fa-graduation-cap"></i>
                </span>
                <div>
                    <h3 class="text-xl font-semibold text-fg">${escapeHTML(degree)}</h3>
                    <p class="text-accent-300 font-medium mt-1">${escapeHTML(institution)}</p>
                    <p class="text-sm text-fg-muted mt-1">${meta.join(" · ")}</p>
                </div>
            </div>

            ${courses.length
                ? `<h4 class="mt-6 mb-3 text-sm font-medium text-fg-muted">Cursos relevantes</h4>
                   <ul class="flex flex-wrap gap-2">${courses.map((course) => chip(course)).join("")}</ul>`
                : ""}
        </article>
    `);
}
