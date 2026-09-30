/**
 * Navbar: se oculta al bajar, reaparece al subir y maneja el menú móvil (hamburguesa).
 */

const HIDDEN_NAV_CLASSES = ["opacity-0", "-translate-y-full"];
const BAR1_OPEN_CLASSES = ["rotate-45", "translate-y-[6px]"];
const BAR2_OPEN_CLASSES = ["-rotate-45", "-translate-y-[6px]"];

export function initNavbar() {
    const nav = document.querySelector("[data-navbar]");
    const toggleButton = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const bar1 = document.getElementById("bar1");
    const bar2 = document.getElementById("bar2");

    if (!nav || !toggleButton || !mobileMenu) return;

    let isMenuOpen = false;
    let lastScroll = 0;

    /** @param {boolean} open */
    const setMenuOpen = (open) => {
        isMenuOpen = open;
        mobileMenu.classList.toggle("hidden", !open);
        toggleButton.setAttribute("aria-expanded", String(open));
        toggleButton.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
        BAR1_OPEN_CLASSES.forEach((cls) => bar1?.classList.toggle(cls, open));
        BAR2_OPEN_CLASSES.forEach((cls) => bar2?.classList.toggle(cls, open));
    };

    toggleButton.addEventListener("click", () => setMenuOpen(!isMenuOpen));

    // Cierra el menú al elegir una opción o al presionar Escape.
    mobileMenu.querySelectorAll("a").forEach((link) =>
        link.addEventListener("click", () => setMenuOpen(false))
    );
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && isMenuOpen) {
            setMenuOpen(false);
            toggleButton.focus();
        }
    });

    // Oculta la navbar al hacer scroll hacia abajo y la muestra al subir.
    window.addEventListener(
        "scroll",
        () => {
            const currentScroll = Math.max(window.scrollY, 0);
            const scrollingDown = currentScroll > lastScroll;

            HIDDEN_NAV_CLASSES.forEach((cls) => nav.classList.toggle(cls, scrollingDown));
            if (scrollingDown && isMenuOpen) setMenuOpen(false);

            lastScroll = currentScroll;
        },
        { passive: true }
    );
}
