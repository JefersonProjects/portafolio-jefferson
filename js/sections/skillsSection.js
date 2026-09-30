import { skills } from "../data/skills.js";
import { createSkillCard } from "../components/SkillCard.js";

/**
 * Sección "Skills & Tecnologías".
 * Para agregar o quitar habilidades edita únicamente js/data/skills.js.
 */
export function initSkillsSection() {
    const container = document.getElementById("skills-container");
    if (!container) return;

    container.replaceChildren(...skills.map(createSkillCard));
}
