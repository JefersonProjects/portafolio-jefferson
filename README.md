# 🚀 My Personal Portfolio

Hello there! 👋 Welcome to the source code of my personal portfolio.

This is a project focused on simplicity and elegance, created to showcase my work and skills in a clean and direct manner. The goal was to build a fluid and pleasant user experience, demonstrating that you don't always need complex tools to achieve a professional and modern result.

## ✨ Core Technologies

This site was built from the ground up with an emphasis on efficiency and best practices. The technologies used are:

* **HTML5:** For a semantic, solid, and accessible structure that forms the skeleton of the project.
* **Tailwind CSS:** For the visual design, using a utility-first approach that allows for creating complex, responsive interfaces in a fast and maintainable way.
* **JavaScript (Vanilla):** To power interactivity and animations, keeping the site lightweight and ensuring optimal performance without relying on external libraries.

This portfolio is a testament to the power of fundamental web technologies when combined with thoughtful design and a focus on code quality.

Hope you enjoy it!


## ---------------------------------------------ESPANISH --------------------

# 🚀 Mi Portafolio Personal

¡Hola! 👋 Bienvenido al código fuente de mi portafolio personal.

Este es un proyecto enfocado en la simplicidad y la elegancia, creado para mostrar mis trabajos y habilidades de una manera limpia y directa. La meta fue construir una experiencia de usuario fluida y agradable, demostrando que no siempre se necesitan herramientas complejas para lograr un resultado profesional y moderno.

## ✨ Tecnologías Principales

Este sitio fue construido desde cero, poniendo énfasis en la eficiencia y las buenas prácticas. Las tecnologías utilizadas son:

* **HTML5:** Para una estructura semántica, sólida y accesible que forma el esqueleto del proyecto.
* **Tailwind CSS:** Para el diseño visual, utilizando un enfoque *utility-first* que permite crear interfaces complejas y responsivas de forma rápida y mantenible.
* **JavaScript (Vanilla):** Para potenciar la interactividad y las animaciones, manteniendo el sitio ligero y con un rendimiento óptimo, sin depender de librerías externas.


¡Espero que lo disfrutes!


## 🗂️ Estructura del proyecto

```
index.html                → Estructura de la página (solo HTML)
tailwind.config.js        → Configuración de Tailwind (fuente y color accent)
package.json              → Scripts para generar el CSS de Tailwind
deploy.bat                → Genera el CSS, hace commit y push
css/
  tailwind.input.css      → Entrada de Tailwind
  tailwind.css            → GENERADO (no editar a mano)
  base.css                → Colores por tema (oscuro/claro), acento y estilos globales
  animations.css          → Keyframes y clases de animación
  components.css          → Navbar, typewriter, carrusel y portada de proyectos
js/
  main.js                 → Punto de entrada: solo importa e inicia módulos
  config.js               → Ajustes del sitio (fondo animado activado o no)
  data/                   → CONTENIDO (lo único que editas en el día a día)
    profile.js            → Frases del typewriter
    experience.js         → Experiencia laboral
    projects.js           → Proyectos del carrusel
    skills.js             → Habilidades por categoría
    education.js          → Estudios, certificaciones e idiomas
  components/             → Piezas reutilizables de UI
    Carousel.js           → Carrusel genérico (flechas, puntos, teclado, arrastre)
    Chip.js               → Etiqueta de tecnología (un solo estilo para todo el sitio)
    HighlightList.js      → Lista de logros con viñetas
    ProjectCard.js, ExperienceCard.js, SkillCard.js, EducationCard.js, CertificationsCard.js
  sections/               → Conectan los datos con cada sección de la página
  features/               → Comportamientos globales
    theme.js              → Modo claro / oscuro
    background/           → Fondo animado: motor (BackgroundCanvas.js) + effects/network.js
    navbar.js, typewriter.js, cursorLight.js
  utils/                  → Helpers compartidos (DOM, fechas, números)
assets/
  favicon/                → Íconos de la pestaña
  og-image.jpg            → Imagen de vista previa al compartir el link
  cv/, imgprojects/, cursors/
```

## 🚀 Primera vez en una PC nueva

```bash
npm install
```

Solo instala Tailwind para generar el CSS. No hace falta repetirlo.

## 💻 Trabajar en local

1. En una terminal: `npm run dev` → regenera `css/tailwind.css` cada vez que guardas (necesario si agregas clases nuevas de Tailwind).
2. Abre el sitio con **Live Server** (VS Code → clic derecho en `index.html` → *Open with Live Server*).

> El proyecto usa **ES Modules** (`import` / `export`), por eso **no funciona abriendo el `index.html` con doble clic**.

## 📤 Publicar

Ejecuta `deploy.bat`: genera el CSS minificado (`npm run build`), hace commit y push a GitHub Pages.

## 🎨 Colores y modo claro / oscuro

Todos los colores están en `css/base.css`, una vez para el modo oscuro y otra para el claro.
En el HTML se usan por su **función**, no por su color, así el mismo código sirve para ambos temas:

| Clase | Para qué |
|---|---|
| `bg-page` / `text-fg` | Fondo de la página / texto principal |
| `text-fg-soft`, `text-fg-muted`, `text-fg-subtle` | Párrafos, texto secundario, fechas |
| `bg-card/70`, `border-line`, `hover:border-line-strong` | Tarjetas y bordes |
| `text-accent-400`, `bg-accent-500`... | Color de acento (morado) |

Para cambiar el morado, edita las variables `--accent-*` de cada tema en `css/base.css`.
El tema elegido por el visitante se guarda en su navegador; por defecto es oscuro.

## ✨ Fondo animado: red de nodos

Nodos que flotan y se conectan como equipos en una red, con paquetes de datos que saltan de nodo en nodo.

- **Mouse:** se conecta a los nodos cercanos y los atrae suavemente (si se queda quieto, los suelta). Las líneas se desvanecen antes de tocar el puntero.
- **Clic o toque en una zona vacía:** hace un *ping*: sale una onda, los nodos que alcanza destellan y se envían paquetes.
- **Scroll:** la red se desplaza con profundidad (los nodos cercanos se mueven más que los lejanos).

Los ajustes (cantidad de nodos, distancias, velocidad, fuerza del mouse...) están en el objeto `SETTINGS`
al inicio de `js/features/background/effects/network.js`. Para desactivar el fondo: `background: "none"` en `js/config.js`.

## ➕ Cómo agregar un proyecto

1. Guarda la captura en `assets/imgprojects/` (ideal: 1200×600 px, `.webp`, menos de 200 KB).
2. Abre `js/data/projects.js` y agrega un objeto al arreglo (los campos con `?` son opcionales):

```js
{
    id: "mi-proyecto",
    title: "Nombre – descripción corta",
    description: "Qué es y qué problema resuelve (1–2 líneas).",
    highlights: ["Logro concreto 1", "Logro concreto 2"],      // ? máx. 3
    technologies: ["React", "Node.js"],
    image: "assets/imgprojects/MiProyecto.webp",                // ? sin imagen se muestra una portada con el nombre
    start: "2026-04", end: "2026-08",                           // ? end: null = en curso
    badges: ["Proyecto en equipo"],                             // ? etiquetas sobre la imagen
    links: { repo: "https://github.com/...", demo: "https://..." }, // repoLabel / demoLabel para cambiar el texto del botón
},
```

El carrusel, los puntos y las flechas se actualizan solos.
