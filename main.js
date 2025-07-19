// Referencia única a todos los elementos necesarios
const elements = {
    nav: document.querySelector("nav"),
    toggleBtn: document.getElementById("menu-toggle"),
    mobileMenu: document.getElementById("mobile-menu"),
    navLinks: document.querySelectorAll("#mobile-menu .nav-link"),
    bar1: document.getElementById("bar1"),
    bar2: document.getElementById("bar2"),
    typewriter: document.getElementById("typewriter"),
    skillsContainer: document.getElementById("skills-container"),
};

let lastScroll = 0;
let menuOpen = false;
// Ocultar navbar al hacer scroll hacia abajo
window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;

    if (currentScroll > lastScroll) {
        elements.nav.classList.add("opacity-0", "-translate-y-full");

        // Cerrar menú móvil si está abierto
        if (menuOpen) {
            closeMobileMenu();
        }
    } else {
        elements.nav.classList.remove("opacity-0", "-translate-y-full");
    }

    lastScroll = Math.max(currentScroll, 0);
});

// Alternar el menú móvil (hamburguesa)
elements.toggleBtn.addEventListener("click", () => {
    menuOpen = !menuOpen;
    elements.mobileMenu.classList.toggle("hidden");

    // Animar líneas del botón hamburguesa
    elements.bar1.classList.toggle("rotate-45");
    elements.bar1.classList.toggle("translate-y-[6px]");
    elements.bar2.classList.toggle("-rotate-45");
    elements.bar2.classList.toggle("-translate-y-[6px]");
});

// Cerrar menú al hacer clic en cualquier enlace del menú móvil
elements.navLinks.forEach((link) =>
    link.addEventListener("click", closeMobileMenu)
);

// Función reutilizable para cerrar el menú móvil
function closeMobileMenu() {
    menuOpen = false;
    elements.mobileMenu.classList.add("hidden");
    elements.bar1.classList.remove("rotate-45", "translate-y-[6px]");
    elements.bar2.classList.remove("-rotate-45", "-translate-y-[6px]");
}

// Animación de máquina de escribir en la descripción
const fullText = `Soy estudiante de la carrera de  Ingeniería de Sistemas e Informática en la Universidad Tecnológica del Perú .
 Mi experiencia práctica se centra en el desarrollo de software full-stack y la gestión de bases de datos, la cual se complementa con una 
 sólida formación académica en administración de infraestructura TI, redes y metodologías ágiles. Busco aplicar este conocimiento combinado
  para construir y mantener soluciones tecnológicas eficientes y escalables`;
let i = 0;
const TYPING_SPEED = 80;

function typeEffect() {
    if (i < fullText.length) {
        elements.typewriter.textContent += fullText.charAt(i);
        i++;
        setTimeout(typeEffect, TYPING_SPEED);
    } else {
        elements.typewriter.classList.remove("typewriter"); // Quita el cursor
    }
}

// Inicia animación de texto al cargar
window.addEventListener("load", () => {
    elements.typewriter.textContent = "";
    elements.typewriter.classList.add("typewriter");
    typeEffect();
});

// Render dinámico de las habilidades (skillsData viene de skills.js)
skillsData.forEach((skillGroup) => {
    const box = document.createElement("div");
    box.className = "bg-zinc-900 rounded-xl p-6 border border-gray-600 transition-transform duration-200 ease-out transform hover:-translate-y-3 hover:scale-105 hover:shadow-xl hover:border-gray-400";

    box.innerHTML = `
        <h3 class="text-lg font-semibold mb-4">${skillGroup.category}</h3>
        <div class="flex flex-wrap gap-3">
            ${skillGroup.items
                .map((item) => `
                <span class="bg-zinc-800 px-4 py-1 rounded-md text-sm text-white flex items-center gap-2 border border-gray-600 shake-hover">
                    ${item.icon ? `<i class="${item.icon}"></i>` : ""}
                    ${item.name}
                </span>
            `)
                .join("")}
        </div>
    `;

    elements.skillsContainer.appendChild(box);
});

const cursorLight = document.getElementById("cursor-light");
document.addEventListener("mousemove", (e) => {
    // Centramos el círculo según el tamaño
    const offset = 500; // mitad del ancho/alto
    cursorLight.style.left = `${e.clientX - offset}px`;
    cursorLight.style.top = `${e.clientY - offset}px`;
});
