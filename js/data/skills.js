/**
 * Habilidades agrupadas por categoría (mismo orden que el CV).
 *
 * `icon` acepta clases de Devicon (https://devicon.dev) o de Font Awesome
 * (https://fontawesome.com/icons). Si no hay ícono, omite el campo.
 *
 * @typedef {Object} Skill
 * @property {string} name
 * @property {string} [icon]
 *
 * @typedef {Object} SkillGroup
 * @property {string}  category
 * @property {Skill[]} items
 */

/** @type {SkillGroup[]} */
export const skills = [
    {
        category: "Lenguajes",
        items: [
            { name: "Java", icon: "devicon-java-plain" },
            { name: "JavaScript", icon: "devicon-javascript-plain" },
            { name: "TypeScript", icon: "devicon-typescript-plain" },
            { name: "PHP", icon: "devicon-php-plain" },
            { name: "SQL", icon: "fa-solid fa-database" },
            { name: "HTML", icon: "devicon-html5-plain" },
            { name: "CSS", icon: "devicon-css3-plain" },
        ],
    },
    {
        category: "Backend",
        items: [
            { name: "Spring Boot", icon: "devicon-spring-original" },
            { name: "Spring Security", icon: "fa-solid fa-shield-halved" },
            { name: "Node.js", icon: "devicon-nodejs-plain" },
            { name: "NestJS", icon: "devicon-nestjs-original" },
            { name: "REST APIs", icon: "fa-solid fa-plug" },
            { name: "JWT", icon: "fa-solid fa-key" },
        ],
    },
    {
        category: "Frontend",
        items: [
            { name: "React", icon: "devicon-react-original" },
            { name: "Angular", icon: "devicon-angular-plain" },
            { name: "Next.js", icon: "devicon-nextjs-plain" },
            { name: "Nuxt", icon: "devicon-nuxt-plain" },
            { name: "Tailwind CSS", icon: "devicon-tailwindcss-original" },
        ],
    },
    {
        category: "Bases de datos",
        items: [
            { name: "SQL Server", icon: "devicon-microsoftsqlserver-plain" },
            { name: "PostgreSQL", icon: "devicon-postgresql-plain" },
            { name: "MySQL", icon: "devicon-mysql-plain" },
            { name: "Oracle", icon: "devicon-oracle-plain" },
        ],
    },
    {
        category: "Cloud y herramientas",
        items: [
            { name: "AWS", icon: "devicon-amazonwebservices-plain-wordmark" },
            { name: "Docker", icon: "devicon-docker-plain" },
            { name: "Git", icon: "devicon-git-plain" },
            { name: "GitHub", icon: "devicon-github-original" },
            { name: "Postman", icon: "devicon-postman-plain" },
            { name: "Swagger", icon: "devicon-swagger-plain" },
            { name: "VS Code", icon: "devicon-vscode-plain" },
            { name: "IntelliJ", icon: "devicon-intellij-plain" },
            { name: "NetBeans", icon: "devicon-netbeans-plain" },
        ],
    },
    {
        category: "Datos y metodologías",
        items: [
            { name: "Power BI", icon: "fa-solid fa-chart-column" },
            { name: "Excel", icon: "fa-solid fa-table" },
            { name: "Scrum", icon: "fa-solid fa-arrows-spin" },
            { name: "Kanban", icon: "fa-solid fa-table-columns" },
            { name: "Git Flow", icon: "fa-solid fa-code-branch" },
        ],
    },
];
