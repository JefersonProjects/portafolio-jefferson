let lastScroll = 0;
const nav = document.querySelector("nav");
const toggleBtn = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelectorAll('#mobile-menu .nav-link');
const bar1 = document.getElementById('bar1');
const bar2 = document.getElementById('bar2');

window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;

    if (currentScroll > lastScroll) {
        nav.classList.add("opacity-0", "-translate-y-full");

        // cerrar menu movil si esta abierto
        if (menuOpen) {
            mobileMenu.classList.add('hidden');
            menuOpen = false;
            bar1.classList.remove('rotate-45', 'translate-y-[6px]');
            bar2.classList.remove('-rotate-45', '-translate-y-[6px]');
        }
    } else {
        nav.classList.remove("opacity-0", "-translate-y-full");
    }

    lastScroll = currentScroll <= 0 ? 0 : currentScroll;
});

let menuOpen = false;
toggleBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('hidden');

    if (menuOpen) {
        bar1.classList.add('rotate-45', 'translate-y-[6px]');
        bar2.classList.add('-rotate-45', '-translate-y-[6px]');
    } else {
        bar1.classList.remove('rotate-45', 'translate-y-[6px]');
        bar2.classList.remove('-rotate-45', '-translate-y-[6px]');
    }
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuOpen = false;
        bar1.classList.remove('rotate-45', 'translate-y-[6px]');
        bar2.classList.remove('-rotate-45', '-translate-y-[6px]');
    });
});