import { experience } from "../data/experience.js";
import { createExperienceCard } from "../components/ExperienceCard.js";

/**
 * Sección "Experiencia": línea de tiempo de puestos.
 * Para agregar o editar puestos edita únicamente js/data/experience.js.
 */
export function initExperienceSection() {
    const list = document.getElementById("experience-list");
    if (!list) return;

    list.replaceChildren(...experience.map(createExperienceCard));
}
