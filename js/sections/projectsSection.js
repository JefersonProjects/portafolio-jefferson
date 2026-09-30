import { projects } from "../data/projects.js";
import { createProjectCard } from "../components/ProjectCard.js";
import { Carousel } from "../components/Carousel.js";

/**
 * Sección "Proyectos": pinta las tarjetas dentro del carrusel.
 * Para agregar proyectos edita únicamente js/data/projects.js.
 */
export function initProjectsSection() {
    const root = document.querySelector('[data-carousel="projects"]');
    if (!root) return;

    const carousel = new Carousel(root, { itemLabel: "Proyecto" });
    carousel.setSlides(projects.map(createProjectCard));
}
