import { escapeHTML, createElementFromHTML } from "../utils/dom.js";

/** @typedef {import("../data/education.js").Certification} Certification */
/** @typedef {import("../data/education.js").Language} Language */

/** @param {Certification} cert */
const issuerBlock = ({ issuer, icon = "fa-solid fa-certificate", items }) => `
    <li class="flex items-start gap-4">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent-500/10 text-accent-400" aria-hidden="true">
            <i class="${escapeHTML(icon)}"></i>
        </span>
        <div>
            <h4 class="font-semibold text-fg">${escapeHTML(issuer)}</h4>
            <p class="text-sm text-fg-muted mt-1 leading-relaxed">${items.map(escapeHTML).join(" · ")}</p>
        </div>
    </li>`;

/** @param {Language} lang */
const languageRow = ({ name, level }) => `
    <li class="flex items-center justify-between gap-4 py-2">
        <span class="text-fg-soft">${escapeHTML(name)}</span>
        <span class="text-sm text-fg-muted">${escapeHTML(level)}</span>
    </li>`;

/**
 * Tarjeta de certificaciones e idiomas.
 * @param {Certification[]} certifications
 * @param {Language[]} languages
 * @returns {HTMLElement}
 */
export function createCertificationsCard(certifications, languages = []) {
    return createElementFromHTML(`
        <article class="h-full rounded-xl border border-line bg-card/70 p-6 md:p-8 transition-colors duration-200 hover:border-line-strong">
            <h3 class="text-xl font-semibold text-fg mb-5">Certificaciones</h3>
            <ul class="space-y-5">${certifications.map(issuerBlock).join("")}</ul>

            ${languages.length
                ? `<h3 class="text-xl font-semibold text-fg mt-8 mb-2">Idiomas</h3>
                   <ul class="divide-y divide-line">${languages.map(languageRow).join("")}</ul>`
                : ""}
        </article>
    `);
}
