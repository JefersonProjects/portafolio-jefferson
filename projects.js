const projects = [
    {
        title: "Intranet Educativa – Colegio Peruano Japonés",
        description: "Desarrollé una plataforma que centraliza la gestión académica, mejorando la comunicación y eficiencia entre docentes y estudiantes. La plataforma incluye tres roles: Estudiante, Profesor y Administrador, cada uno con sus propias funcionalidades específicas para optimizar la experiencia y gestión académica.",
        technologies: ["CSS", "JavaScript", "Java", "React", "SpringBoot", "SQL Server", "AWS"],
        image: "assets/imgprojects/Intranet.png",
        link: "https://github.com/JefersonProjects/Intranet-Educativa_Deploy_AWS.git"
    },
    {
        title: "E-commerce para Supermercado Luciana",
        description: "Diseñé una tienda en línea para el Supermercado Luciana, optimizando la gestión de ventas, productos y usuarios mediante la implementación de control de roles (cliente/admin), con módulos de inventario y generación de reportes mensuales.",
        technologies: ["React", "SpringBoot", "JavaScript", "Java", "CSS", "MySQL"],
        image: "assets/imgprojects/LucianaEcomerce.png",
        link: "https://github.com/JefersonProjects/Supermercado-Luciana.git"
    },
    {
        title: "Sitio Web para la empresa ZirconBiker",
        description: "Desarrollé un sitio web intuitivo para ZirconBiker, permitiendo a los usuarios explorar y comprar motos y accesorios. Implementé un sistema de filtrado y proporcioné información detallada sobre cada producto.",
        technologies: ["PHP", "CSS", "JavaScript", "MySQL", "HTML"],
        image: "assets/imgprojects/ZirconBiker.png",
        link: "https://github.com/JefersonProjects"
    },
    {
        title: "Sistema desktop de Boletas de Pago - ICATOM S.A.",
        description: "Realicé el análisis, diseño e implementación de un sistema desktop para la entrega y almacenamiento de boletas de pago de la empresa ICATOM S.A. Incluye una interfaz gráfica intuitiva y posibilidad de migración futura a plataforma web.",
        technologies: ["Java", "SQL Server", "Swing(java)"],
        image: "assets/imgprojects/Icatom.png",
        link: "https://github.com/JefersonProjects/SistemaAutomatizacionBoletasPagoIcatom2023.git"
    }
];

function createProjectCard(project) {
    const techHTML = project.technologies.map(tech => `
    <span class="bg-gray-800 px-3 py-1 rounded-lg text-sm text-white border border-gray-600 transition duration-300 transform hover:-translate-y-1 hover:scale-105 hover:border-gray-400">
    ${tech}
    </span>
  `).join("");

    return `
    <div class="group relative bg-black border border-gray-600 rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-6 transition duration-300 ease-in-out transform hover:-translate-y-2 hover:border-gray-400">
      <a href="${project.link}" target="_blank" class="absolute top-4 right-4 text-gray-400 hover:text-purple-400 transition transform group-hover:scale-110 cursor-pointer">
        <i class="fa-sharp fa-solid fa-arrow-up-right-from-square text-2xl icon-hover-animate"></i>
      </a>
      <img src="${project.image}" alt="${project.title}" class="rounded-lg md:w-1/2 object-contain max-h-72" />
      <div>
        <h3 class="text-xl md:text-2xl font-semibold text-white">${project.title}</h3>
        <p class="text-gray-300 mt-2">${project.description}</p>
        <div class="flex flex-wrap gap-2 mt-4">${techHTML}</div>
      </div>
    </div>
  `;
}
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("project-container");
    container.innerHTML = projects.map(createProjectCard).join("");
});