/**
 * Punto de entrada de la página.
 * Solo importa e inicia cada módulo; la lógica vive en su propio archivo.
 */
import { siteConfig } from "./config.js";
import { heroRoles } from "./data/profile.js";
import { initThemeToggle } from "./features/theme.js";
import { initBackground } from "./features/background/index.js";
import { initNavbar } from "./features/navbar.js";
import { initTypewriter } from "./features/typewriter.js";
import { initCursorLight } from "./features/cursorLight.js";
import { initExperienceSection } from "./sections/experienceSection.js";
import { initProjectsSection } from "./sections/projectsSection.js";
import { initSkillsSection } from "./sections/skillsSection.js";
import { initEducationSection } from "./sections/educationSection.js";

function setCurrentYear() {
    const year = String(new Date().getFullYear());
    document.querySelectorAll("[data-current-year]").forEach((el) => (el.textContent = year));
}

// Los <script type="module"> se ejecutan cuando el HTML ya está listo (igual que `defer`).
initThemeToggle();
initBackground(document.getElementById("bg-canvas"), { effect: siteConfig.background });
initNavbar();
initCursorLight(document.getElementById("cursor-light"));
initTypewriter(document.querySelector("[data-typewriter]"), heroRoles);
initExperienceSection();
initProjectsSection();
initSkillsSection();
initEducationSection();
setCurrentYear();
