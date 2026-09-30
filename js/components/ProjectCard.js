import { escapeHTML, createElementFromHTML } from "../utils/dom.js";
import { formatPeriod } from "../utils/date.js";
import { chip } from "./Chip.js";
import { highlightList } from "./HighlightList.js";

/** @typedef {import("../data/projects.js").Project} Project */

/**
 * Botón de enlace externo (repositorio o demo).
 * @param {string} href
 * @param {string} label
 * @param {string} icon   Clases de Font Awesome.
 * @param {boolean} primary
 */
const linkButton = (href, label, icon, primary = false) => `
    <a href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer"
       class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
              ${primary
                  ? "bg-fg text-page hover:bg-accent-600 hover:text-white"
                  : "border border-line-strong/60 text-fg-soft hover:border-accent-400/60 hover:text-accent-300"}">
        <i class="${icon}" aria-hidden="true"></i>
        ${escapeHTML(label)}
    </a>`;

/** @param {string} text */
const badge = (text) => `
    <li class="rounded-full border border-white/10 bg-black/70 px-3 py-1 text-xs font-medium text-zinc-100 backdrop-blur">
        ${escapeHTML(text)}
    </li>`;

/**
 * Portada: la captura del proyecto o, si aún no hay, una portada con su nombre.
 * @param {Project} project
 */
function cover({ title, image, badges = [] }) {
    const shortName = title.split(/\s[–-]\s/)[0];

    const media = image
        ? `<img src="${escapeHTML(image)}" alt="Captura del proyecto ${escapeHTML(title)}"
                loading="lazy" decoding="async" draggable="false"
                class="w-full h-full object-cover object-top" />`
        : `<div class="project-cover w-full h-full flex items-center justify-center" aria-hidden="true">
               <span class="text-3xl md:text-4xl font-bold tracking-tight text-white">${escapeHTML(shortName)}<span class="text-accent-400">.</span></span>
           </div>`;

    return `
        <div class="relative aspect-[2/1] md:aspect-[16/7] overflow-hidden bg-zinc-900 border-b border-line">
            ${media}
            ${badges.length ? `<ul class="absolute top-3 left-3 flex flex-wrap gap-2">${badges.map(badge).join("")}</ul>` : ""}
        </div>`;
}

/**
 * Crea la tarjeta de un proyecto.
 * Es una función pura: recibe datos y devuelve un elemento, sin tocar el resto de la página.
 *
 * @param {Project} project
 * @returns {HTMLElement}
 */
export function createProjectCard(project) {
    const { title, description, highlights = [], technologies = [], start, end, links = {} } = project;

    const buttons = [
        links.repo && linkButton(links.repo, links.repoLabel ?? "Código", "fab fa-github", !links.demo),
        links.demo &&
            linkButton(links.demo, links.demoLabel ?? "Ver demo", "fa-solid fa-arrow-up-right-from-square", true),
    ]
        .filter(Boolean)
        .join("");

    const period = start
        ? `<p class="mt-1 inline-flex items-center gap-2 text-sm text-fg-subtle">
               <i class="fa-regular fa-calendar" aria-hidden="true"></i>${formatPeriod(start, end)}
           </p>`
        : "";

    return createElementFromHTML(`
        <article class="h-full flex flex-col rounded-xl border border-line bg-card/70 overflow-hidden
                        transition-colors duration-200 hover:border-line-strong">
            ${cover(project)}

            <div class="flex flex-col flex-1 p-6">
                <h3 class="text-xl md:text-2xl font-semibold text-fg">${escapeHTML(title)}</h3>
                ${period}
                <p class="text-fg-muted mt-3 text-sm md:text-base leading-relaxed">${escapeHTML(description)}</p>

                ${highlightList(highlights, "mt-4 text-sm")}

                <ul class="flex flex-wrap gap-2 mt-5" aria-label="Tecnologías usadas">
                    ${technologies.map((tech) => chip(tech)).join("")}
                </ul>

                ${buttons ? `<div class="flex flex-wrap gap-3 mt-auto pt-6">${buttons}</div>` : ""}
            </div>
        </article>
    `);
}
