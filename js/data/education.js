/**
 * Formación: estudios, certificaciones e idiomas.
 * Las fechas van en formato "AAAA-MM".
 *
 * @typedef {Object} Education
 * @property {string}   id
 * @property {string}   institution
 * @property {string}   degree
 * @property {string}   [location]
 * @property {string}   start
 * @property {string}   end
 * @property {boolean}  [expected]   true si la fecha de fin es estimada.
 * @property {string}   [note]       Dato corto, p. ej. el ciclo actual.
 * @property {string[]} [courses]    Cursos relevantes.
 *
 * @typedef {Object} Certification
 * @property {string}   issuer
 * @property {string}   [icon]   Clase de Font Awesome.
 * @property {string[]} items    Nombres de los certificados.
 *
 * @typedef {Object} Language
 * @property {string} name
 * @property {string} level
 */

/** @type {Education[]} */
export const education = [
    {
        id: "utp",
        institution: "Universidad Tecnológica del Perú",
        degree: "Ingeniería de Sistemas e Informática",
        location: "Ica, Perú",
        start: "2022-03",
        end: "2026-12",
        expected: true,
        note: "IX ciclo",
        courses: [
            "Bases de Datos",
            "Análisis de Sistemas",
            "Inteligencia de Negocios (Power BI)",
            "Gestión de Proyectos TI",
            "Arquitectura de Software",
            "Ingeniería de Software",
        ],
    },
];

/** @type {Certification[]} */
export const certifications = [
    {
        issuer: "Cisco Networking Academy",
        icon: "fa-solid fa-network-wired",
        items: ["CCNAv7", "Cyber Threat Management", "Endpoint Security", "Introducción a la Ciberseguridad"],
    },
    {
        issuer: "Udemy",
        icon: "fa-solid fa-graduation-cap",
        items: ["Máster Completo de Java"],
    },
];

/** @type {Language[]} */
export const languages = [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Intermedio" },
];
