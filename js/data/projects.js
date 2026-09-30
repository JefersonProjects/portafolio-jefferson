/**
 * Proyectos del carrusel, del más reciente al más antiguo.
 *
 * Para agregar uno nuevo solo añade un objeto a este arreglo:
 * las tarjetas, los puntos de navegación y las flechas se actualizan solos.
 * Todos los campos marcados con [ ] son opcionales.
 *
 * @typedef {Object} ProjectLinks
 * @property {string} [repo]       URL del repositorio.
 * @property {string} [repoLabel]  Texto del botón del repo (por defecto "Código").
 * @property {string} [demo]       URL del proyecto publicado.
 * @property {string} [demoLabel]  Texto del botón de la demo (por defecto "Ver demo").
 *
 * @typedef {Object} Project
 * @property {string}        id            Identificador único, sin espacios.
 * @property {string}        title         "Nombre – descripción corta".
 * @property {string}        description   Resumen de 1–2 líneas.
 * @property {string[]}      [highlights]  Logros concretos (máximo 3 para que las tarjetas no crezcan demasiado).
 * @property {string[]}      technologies  Tecnologías (se muestran como chips).
 * @property {string}        [image]       Captura en assets/imgprojects/. Sin captura se muestra una portada con el nombre.
 * @property {string}        [start]       Inicio "AAAA-MM".
 * @property {string|null}   [end]         Fin "AAAA-MM" (null = en curso).
 * @property {string[]}      [badges]      Etiquetas sobre la imagen, p. ej. "Proyecto en equipo".
 * @property {ProjectLinks}  links
 */

/** @type {Project[]} */
export const projects = [
    {
        id: "kantus",
        title: "Kantus – Sistema de gestión para restaurante",
        description:
            "Sistema para gestionar caja, mesas, inventario, ventas, promociones y comprobantes de pago de un restaurante.",
        highlights: [
            "Desarrollé módulos del backend con Spring Boot (Java 17) y PostgreSQL, con arquitectura por capas, DTOs y MapStruct.",
            "Implementé autenticación JWT y control de accesos para 5 roles (admin, cajero, mozo, cocinero y delivery) con Spring Security.",
            "Integré notificaciones de pedidos por WhatsApp, colaboré en el frontend (Nuxt 4) y preparé el despliegue con Docker y Swagger.",
        ],
        technologies: ["Java 17", "Spring Boot", "Spring Security", "JWT", "PostgreSQL", "Docker", "Swagger", "Nuxt 4"],
        image: "assets/imgprojects/Kantus.webp", 
        start: "2026-03",
        end: "2026-08",
        badges: ["Proyecto en equipo"],
        links: {
            repo: "https://github.com/Oswaldo-Alberto-Cabrejos-Ronceros/backend-kantus",
            repoLabel: "Repositorio del equipo",
        },
    },
    {
        id: "nexsora",
        title: "NEXSORA – Plataforma educativa inclusiva",
        description:
            "Colaboro en el desarrollo del sitio web de NEXSORA: educación gratuita, inclusiva y personalizada para estudiantes de todo el Perú, con lectura fácil, narración por voz, modo sin conexión y lengua de señas.",
        technologies: ["Next.js", "React", "PostgreSQL", "Prisma", "AWS S3", "Vercel"],
        image: "assets/imgprojects/Nexsora.webp", 
        badges: ["Proyecto en equipo", "En desarrollo"],
        links: {
            demo: "https://nexsora.org.pe/es",
            demoLabel: "Ver sitio",
        },
    },
    {
        id: "intranet-cpj",
        title: "Intranet Educativa – Colegio Peruano Japonés",
        description:
            "Plataforma que centraliza la gestión académica del colegio, con roles de Estudiante, Profesor y Administrador.",
        highlights: [
            "Desarrollé la plataforma con Spring Boot y React, con seguridad basada en Spring Security y JWT para la gestión de roles.",
            "Diseñé y optimicé la base de datos en SQL Server, asegurando la integridad de la información académica.",
            "Desplegué en AWS (EC2, S3 y RDS) con monitoreo en CloudWatch e implementé un chatbot que automatiza procesos.",
        ],
        technologies: ["Java", "Spring Boot", "Spring Security", "JWT", "React", "SQL Server", "AWS"],
        image: "assets/imgprojects/Intranet.webp",
        start: "2024-09",
        end: "2025-02",
        links: {
            repo: "https://github.com/JefersonProjects/Intranet-Educativa_Deploy_AWS.git",
        },
    },
    {
        id: "ecommerce-luciana",
        title: "E-commerce – Supermercado Luciana",
        description:
            "Tienda online con panel administrativo, control de inventario, gestión de ventas en tiempo real y reportes mensuales.",
        highlights: [
            "Construí la arquitectura con React en el frontend y Spring Boot exponiendo APIs REST.",
            "Implementé seguridad con Spring Security y JWT, con roles de Administrador y Cliente.",
        ],
        technologies: ["React", "Spring Boot", "Spring Security", "JWT", "MySQL", "JavaScript"],
        image: "assets/imgprojects/LucianaEcomerce.webp",
        start: "2024-03",
        end: "2024-07",
        links: {
            repo: "https://github.com/JefersonProjects/Supermercado-Luciana.git",
        },
    },
    {
        id: "zirconbiker",
        title: "Zircon Biker – E-commerce y financiamiento",
        description:
            "Tienda online de motos y accesorios con catálogo, filtros, información detallada de cada producto y carrito dinámico.",
        highlights: [
            "Desarrollé un simulador de financiamiento con múltiples planes crediticios para que el usuario evalúe sus opciones de pago.",
            "Diseñé la base de datos en MySQL y usé PHP como lenguaje principal.",
        ],
        technologies: ["PHP", "MySQL", "JavaScript", "HTML", "CSS"],
        image: "assets/imgprojects/ZirconBiker.webp",
        start: "2023-09",
        end: "2023-12",
        links: {
            repo: "https://github.com/JefersonProjects/Zircon-Biker-motorcycle-shop.git",
        },
    },
    {
        id: "boletas-icatom",
        title: "Boletas de Pago – ICATOM S.A.",
        description:
            "Sistema desktop para la entrega y almacenamiento de boletas de pago de la empresa, con interfaz gráfica intuitiva y preparado para migrar a web.",
        highlights: ["Realicé el análisis, diseño e implementación completa del sistema."],
        technologies: ["Java", "Java Swing", "SQL Server"],
        image: "assets/imgprojects/Icatom.webp",
        links: {
            repo: "https://github.com/JefersonProjects/SistemaAutomatizacionBoletasPagoIcatom2023.git",
        },
    },
];
