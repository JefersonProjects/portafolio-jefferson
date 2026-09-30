import { escapeHTML, createElementFromHTML } from "../utils/dom.js";
import { formatMonthYear, monthsBetween, formatDuration } from "../utils/date.js";
import { chip } from "./Chip.js";
import { highlightList } from "./HighlightList.js";

/** @typedef {import("../data/experience.js").Experience} Experience */

/**
 * Crea un elemento de la línea de tiempo de experiencia.
 * @param {Experience} job
 * @returns {HTMLElement}
 */
export function createExperienceCard(job) {
    const { role, company, type, start, end, highlights = [], technologies = [] } = job;

    const endLabel = end ? formatMonthYear(end) : "Actualidad";
    const duration = formatDuration(monthsBetween(start, end));

    return createElementFromHTML(`
        <li class="relative pl-8 md:pl-10">
            <!-- Punto de la línea de tiempo -->
            <span class="absolute -left-[7px] top-8 h-3.5 w-3.5 rounded-full bg-accent-500 ring-4 ring-page" aria-hidden="true"></span>

            <article class="rounded-xl border border-line bg-card/70 p-6 md:p-8 transition-colors duration-200 hover:border-line-strong">
                <header class="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div>
                        <h3 class="text-xl md:text-2xl font-semibold text-fg">${escapeHTML(role)}</h3>
                        <p class="text-accent-300 font-medium mt-1">${escapeHTML(company)}</p>
                    </div>
                    <div class="text-sm text-fg-muted md:text-right shrink-0">
                        <p class="inline-flex items-center gap-2">
                            <i class="fa-regular fa-calendar" aria-hidden="true"></i>
                            <span>
                                <time datetime="${escapeHTML(start)}">${formatMonthYear(start)}</time> –
                                ${end ? `<time datetime="${escapeHTML(end)}">${endLabel}</time>` : endLabel}
                            </span>
                        </p>
                        <p class="mt-1">${type ? `${escapeHTML(type)} · ` : ""}${duration}</p>
                    </div>
                </header>

                ${highlightList(highlights, "mt-5 text-sm md:text-base")}

                ${technologies.length
                    ? `<ul class="flex flex-wrap gap-2 mt-6" aria-label="Tecnologías usadas">${technologies.map((tech) => chip(tech)).join("")}</ul>`
                    : ""}
            </article>
        </li>
    `);
}
