/**
 * Experiencia laboral / prácticas, de la más reciente a la más antigua.
 * Para agregar un puesto nuevo, añade un objeto AL INICIO del arreglo.
 *
 * Las fechas van en formato "AAAA-MM" (el texto "Ene 2026" se genera solo).
 * Si sigues trabajando ahí, usa `end: null` y se mostrará "Actualidad".
 *
 * @typedef {Object} Experience
 * @property {string}      id
 * @property {string}      role          Puesto.
 * @property {string}      company       Empresa.
 * @property {string}      [type]        Modalidad, p. ej. "Prácticas pre-profesionales".
 * @property {string}      start         Inicio "AAAA-MM".
 * @property {string|null} end           Fin "AAAA-MM" o null si es el puesto actual.
 * @property {string[]}    highlights    Logros / responsabilidades (1 idea por línea).
 * @property {string[]}    technologies  Tecnologías usadas.
 */

/** @type {Experience[]} */
export const experience = [
    {
        id: "divcal",
        role: "Full Stack Developer Trainee",
        company: "Divcal BPO & Contact Center",
        type: "Prácticas pre-profesionales",
        start: "2026-01",
        end: "2026-05",
        highlights: [
            "Desarrollo de soluciones digitales internas con Node.js, TypeScript y PostgreSQL bajo Scrum, participando en el análisis de requerimientos y la mejora de procesos tecnológicos.",
            "Diseño y optimización de bases de datos relacionales, implementación de lógica backend e integración de servicios REST.",
            "Soporte técnico a sistemas críticos: gestión de usuarios, resolución de incidencias y continuidad operativa.",
            "Desarrollo de nuevos módulos internos, aportando en la arquitectura del servidor y en nuevas funcionalidades.",
        ],
        technologies: ["Node.js", "TypeScript", "PostgreSQL", "REST APIs", "Scrum"],
    },
];
