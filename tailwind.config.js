/**
 * Configuración de Tailwind CSS.
 *
 * Tailwind lee estos archivos, detecta las clases que usas y genera css/tailwind.css
 * solo con esas clases. Si agregas clases nuevas, vuelve a generar el CSS:
 *   npm run dev    → lo regenera solo cada vez que guardas (mientras trabajas)
 *   npm run build  → lo genera una vez, minificado (deploy.bat lo hace por ti)
 *
 * Los colores NO se escriben aquí: se leen de las variables de css/base.css,
 * que cambian según el tema (oscuro/claro). Por eso usa nombres por función:
 *   bg-page · text-fg · text-fg-soft · text-fg-muted · text-fg-subtle
 *   bg-card · border-line · border-line-strong · bg-chip · text-accent-400 ...
 *
 * @type {import('tailwindcss').Config}
 */

/** Convierte el nombre de una variable CSS "R G B" en un color de Tailwind con soporte de transparencia. */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
    content: ["./index.html", "./js/**/*.js"],
    theme: {
        extend: {
            fontFamily: {
                inter: ["Inter", "sans-serif"],
            },
            colors: {
                page: token("c-page"),
                fg: {
                    DEFAULT: token("c-fg"),
                    soft: token("c-fg-soft"),
                    muted: token("c-fg-muted"),
                    subtle: token("c-fg-subtle"),
                },
                card: token("c-card"),
                line: {
                    DEFAULT: token("c-line"),
                    strong: token("c-line-strong"),
                },
                chip: token("c-chip"),
                accent: {
                    300: token("accent-300"),
                    400: token("accent-400"),
                    500: token("accent-500"),
                    600: token("accent-600"),
                },
            },
        },
    },
};
