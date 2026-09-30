/**
 * Modo claro / oscuro.
 *
 * El tema vive en el atributo data-theme de <html> ("dark" | "light").
 * Un script pequeño en el <head> lo aplica antes de pintar la página (sin parpadeo);
 * este módulo maneja el botón, guarda la elección y avisa al resto del sitio.
 *
 * Otros módulos pueden reaccionar al cambio con:
 *   document.addEventListener("themechange", (e) => e.detail.theme)
 */

const STORAGE_KEY = "theme";
const DEFAULT_THEME = "dark";

/** Color de la barra del navegador en móviles según el tema. */
const BROWSER_BAR_COLOR = { dark: "#000000", light: "#fafafa" };

/** @returns {"dark" | "light"} */
export function getTheme() {
    return document.documentElement.dataset.theme === "light" ? "light" : DEFAULT_THEME;
}

/** @param {"dark" | "light"} theme */
export function setTheme(theme) {
    document.documentElement.dataset.theme = theme;

    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch {
        // Modo incógnito o almacenamiento bloqueado: el tema funciona igual, solo no se recuerda.
    }

    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", BROWSER_BAR_COLOR[theme]);
    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
}

export function initThemeToggle() {
    const button = document.getElementById("theme-toggle");
    if (!button) return;

    const syncLabel = () => {
        const next = getTheme() === "dark" ? "claro" : "oscuro";
        button.setAttribute("aria-label", `Cambiar a modo ${next}`);
        button.title = `Modo ${next}`;
    };

    button.addEventListener("click", () => {
        setTheme(getTheme() === "dark" ? "light" : "dark");
        syncLabel();
    });

    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", BROWSER_BAR_COLOR[getTheme()]);
    syncLabel();
}
