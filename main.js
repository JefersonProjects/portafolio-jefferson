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

const typewriterElement = document.getElementById("typewriter");
const text = "Soy desarrollador full stack con experiencia en aplicaciones web y de escritorio,así como en la gestión de bases de datos. Actualmente curso la carrera de Ingeniería de Sistemas e Informática en la Universidad Tecnológica del Perú."
let i = 0;

function typeEffect() {
    if (i < text.length) {
        typewriterElement.textContent += text.charAt(i);
        i++;
        setTimeout(typeEffect, 80); 
    } else {
        // Quita el cursor al terminar
        typewriterElement.classList.remove("typewriter");
    }
}

window.addEventListener("load", () => {
    typewriterElement.textContent = "";
    typewriterElement.classList.add("typewriter");
    typeEffect();
});