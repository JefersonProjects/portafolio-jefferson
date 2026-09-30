import { prefersReducedMotion } from "../utils/dom.js";

/**
 * Carrusel horizontal reutilizable, sin librerías.
 *
 * Se apoya en el scroll nativo del navegador (CSS scroll-snap), así que:
 *  - En celular funciona con swipe de forma natural.
 *  - En PC se controla con flechas, puntos, teclado (← →) o arrastrando con el mouse.
 *
 * Marcado mínimo esperado dentro del elemento raíz:
 *   <ul data-carousel-track></ul>        → contenedor que hace scroll (obligatorio)
 *   <button data-carousel-prev>          → opcional
 *   <button data-carousel-next>          → opcional
 *   <div data-carousel-dots></div>       → opcional, los puntos se generan solos
 *   <p data-carousel-status></p>         → opcional, texto para lectores de pantalla
 *
 * Uso:
 *   const carousel = new Carousel(rootElement, { itemLabel: "Proyecto" });
 *   carousel.setSlides(arrayDeElementos);
 */

const SELECTORS = Object.freeze({
    track: "[data-carousel-track]",
    prev: "[data-carousel-prev]",
    next: "[data-carousel-next]",
    dots: "[data-carousel-dots]",
    status: "[data-carousel-status]",
});

const CLASSES = Object.freeze({
    slide: "carousel__slide",
    dot: "carousel__dot",
    dragging: "is-dragging",
    static: "is-static",
});

/** Píxeles que debe moverse el mouse antes de considerarlo un arrastre (y no un clic). */
const DRAG_THRESHOLD_PX = 6;
/** Fracción de tarjeta que hay que arrastrar para pasar a la siguiente. */
const DRAG_SWITCH_RATIO = 0.15;

export class Carousel {
    /** @type {AbortController} */
    #events = new AbortController();
    /** @type {ResizeObserver | null} */
    #resizeObserver = null;
    #pageCount = 0;
    #currentIndex = -1;
    #frame = 0;
    #drag = { active: false, pointerId: -1, startX: 0, startScroll: 0, startIndex: 0 };
    #suppressNextClick = false;

    /**
     * @param {HTMLElement} root
     * @param {{ itemLabel?: string }} [options]
     */
    constructor(root, { itemLabel = "Elemento" } = {}) {
        this.root = root;
        this.itemLabel = itemLabel;
        this.track = root.querySelector(SELECTORS.track);
        this.prevButton = root.querySelector(SELECTORS.prev);
        this.nextButton = root.querySelector(SELECTORS.next);
        this.dotsContainer = root.querySelector(SELECTORS.dots);
        this.status = root.querySelector(SELECTORS.status);

        if (!this.track) {
            throw new Error(`Carousel: no se encontró ${SELECTORS.track} dentro del elemento raíz.`);
        }

        this.#bindEvents();
        this.refresh();
    }

    /* ------------------------------------------------------------------ */
    /*  API pública                                                        */
    /* ------------------------------------------------------------------ */

    /** @returns {HTMLElement[]} */
    get slides() {
        return /** @type {HTMLElement[]} */ (Array.from(this.track.children));
    }

    /** Índice de la primera tarjeta visible. */
    get currentIndex() {
        return Math.max(this.#currentIndex, 0);
    }

    /**
     * Reemplaza el contenido del carrusel. Cada elemento se envuelve en un <li> (slide).
     * @param {HTMLElement[]} elements
     */
    setSlides(elements) {
        const slides = elements.map((element) => {
            const slide = document.createElement("li");
            slide.className = CLASSES.slide;
            slide.append(element);
            return slide;
        });
        this.track.replaceChildren(...slides);
        this.track.scrollLeft = 0;
        this.refresh();
    }

    /** Recalcula páginas y puntos (se llama sola al cambiar el tamaño de la ventana). */
    refresh() {
        const pageCount = Math.max(this.slides.length - this.#getVisibleCount() + 1, 1);

        if (pageCount !== this.#pageCount) {
            this.#pageCount = pageCount;
            this.#renderDots();
        }

        this.root.classList.toggle(CLASSES.static, pageCount <= 1);
        this.#currentIndex = -1; // fuerza a refrescar el estado visual
        this.#update();
    }

    /** @param {number} index */
    goTo(index) {
        const target = this.#clamp(index);
        const slide = this.slides[target];
        if (!slide) return;

        this.track.scrollTo({
            left: slide.offsetLeft - this.slides[0].offsetLeft,
            behavior: prefersReducedMotion() ? "auto" : "smooth",
        });
    }

    next() {
        this.goTo(this.currentIndex + 1);
    }

    prev() {
        this.goTo(this.currentIndex - 1);
    }

    /** Quita todos los listeners (útil si el carrusel se elimina de la página). */
    destroy() {
        this.#events.abort();
        this.#resizeObserver?.disconnect();
        cancelAnimationFrame(this.#frame);
    }

    /* ------------------------------------------------------------------ */
    /*  Eventos                                                            */
    /* ------------------------------------------------------------------ */

    #bindEvents() {
        const { signal } = this.#events;

        this.prevButton?.addEventListener("click", () => this.prev(), { signal });
        this.nextButton?.addEventListener("click", () => this.next(), { signal });

        // Actualiza flechas/puntos mientras se hace scroll (1 vez por frame como máximo).
        this.track.addEventListener("scroll", () => this.#scheduleUpdate(), { passive: true, signal });

        this.track.addEventListener("keydown", (event) => this.#onKeyDown(event), { signal });

        // Arrastre con mouse (en táctil se usa el scroll nativo).
        this.track.addEventListener("pointerdown", (event) => this.#onPointerDown(event), { signal });
        this.track.addEventListener("pointermove", (event) => this.#onPointerMove(event), { signal });
        this.track.addEventListener("pointerup", (event) => this.#onPointerUp(event), { signal });
        this.track.addEventListener("pointercancel", (event) => this.#onPointerUp(event), { signal });
        this.track.addEventListener("dragstart", (event) => event.preventDefault(), { signal });
        this.track.addEventListener("click", (event) => this.#onClickCapture(event), { capture: true, signal });

        this.#resizeObserver = new ResizeObserver(() => this.refresh());
        this.#resizeObserver.observe(this.track);
    }

    /** @param {KeyboardEvent} event */
    #onKeyDown(event) {
        const actions = {
            ArrowLeft: () => this.prev(),
            ArrowRight: () => this.next(),
            Home: () => this.goTo(0),
            End: () => this.goTo(this.#pageCount - 1),
        };
        const action = actions[event.key];
        if (!action) return;

        event.preventDefault();
        action();
    }

    /** @param {PointerEvent} event */
    #onPointerDown(event) {
        if (event.pointerType !== "mouse" || event.button !== 0) return;

        this.#drag = {
            active: false,
            pointerId: event.pointerId,
            startX: event.clientX,
            startScroll: this.track.scrollLeft,
            startIndex: this.currentIndex,
        };
    }

    /** @param {PointerEvent} event */
    #onPointerMove(event) {
        const drag = this.#drag;
        if (drag.pointerId !== event.pointerId) return;

        const deltaX = event.clientX - drag.startX;

        // Empieza a arrastrar solo si el mouse se movió lo suficiente (si no, es un clic normal).
        if (!drag.active) {
            if (Math.abs(deltaX) < DRAG_THRESHOLD_PX) return;
            drag.active = true;
            this.track.setPointerCapture(event.pointerId);
            this.track.classList.add(CLASSES.dragging);
        }

        this.track.scrollLeft = drag.startScroll - deltaX;
    }

    /** @param {PointerEvent} event */
    #onPointerUp(event) {
        const drag = this.#drag;
        if (drag.pointerId !== event.pointerId) return;

        this.#drag = { ...drag, pointerId: -1 };
        if (!drag.active) return;

        this.track.classList.remove(CLASSES.dragging);
        if (this.track.hasPointerCapture(event.pointerId)) {
            this.track.releasePointerCapture(event.pointerId);
        }

        // Decide a qué tarjeta ir según la dirección y distancia del arrastre.
        const deltaX = event.clientX - drag.startX;
        const movedSlides = Math.abs(deltaX) / (this.#getStep() || 1);
        const direction = deltaX < 0 ? 1 : -1;
        const jump = movedSlides < DRAG_SWITCH_RATIO ? 0 : Math.max(1, Math.round(movedSlides));
        this.goTo(drag.startIndex + direction * jump);

        // Evita que soltar el mouse sobre un enlace lo abra.
        this.#suppressNextClick = true;
        setTimeout(() => (this.#suppressNextClick = false), 0);
    }

    /** @param {MouseEvent} event */
    #onClickCapture(event) {
        if (!this.#suppressNextClick) return;
        event.preventDefault();
        event.stopPropagation();
        this.#suppressNextClick = false;
    }

    /* ------------------------------------------------------------------ */
    /*  Estado y renderizado                                               */
    /* ------------------------------------------------------------------ */

    #scheduleUpdate() {
        cancelAnimationFrame(this.#frame);
        this.#frame = requestAnimationFrame(() => this.#update());
    }

    #update() {
        const maxScroll = this.track.scrollWidth - this.track.clientWidth;
        const scrollLeft = this.track.scrollLeft;

        if (this.prevButton) this.prevButton.disabled = scrollLeft <= 1;
        if (this.nextButton) this.nextButton.disabled = scrollLeft >= maxScroll - 1;

        const index = this.#getIndexFromScroll(scrollLeft, maxScroll);
        if (index === this.#currentIndex) return;
        this.#currentIndex = index;

        this.dotsContainer?.querySelectorAll(`.${CLASSES.dot}`).forEach((dot, i) => {
            dot.setAttribute("aria-current", String(i === index));
        });

        this.#announce(index);
    }

    #renderDots() {
        if (!this.dotsContainer) return;

        const dots = Array.from({ length: this.#pageCount }, (_, i) => {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = CLASSES.dot;
            dot.setAttribute("aria-label", `Ir a ${this.itemLabel.toLowerCase()} ${i + 1}`);
            dot.setAttribute("aria-current", "false");
            dot.addEventListener("click", () => this.goTo(i), { signal: this.#events.signal });
            return dot;
        });

        this.dotsContainer.replaceChildren(...dots);
    }

    /** Texto para lectores de pantalla, p. ej. "Proyectos 1 a 2 de 4". */
    #announce(index) {
        if (!this.status) return;

        const total = this.slides.length;
        const first = index + 1;
        const last = Math.min(index + this.#getVisibleCount(), total);

        this.status.textContent =
            first === last
                ? `${this.itemLabel} ${first} de ${total}`
                : `${this.itemLabel}s ${first} a ${last} de ${total}`;
    }

    /* ------------------------------------------------------------------ */
    /*  Medidas                                                            */
    /* ------------------------------------------------------------------ */

    /** Distancia entre el inicio de una tarjeta y la siguiente (ancho + separación). */
    #getStep() {
        const [first, second] = this.slides;
        if (!first) return 0;
        return second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
    }

    /** Cuántas tarjetas completas caben a la vez en pantalla. */
    #getVisibleCount() {
        const step = this.#getStep();
        if (!step) return 1;

        const gap = parseFloat(getComputedStyle(this.track).columnGap) || 0;
        return Math.max(Math.floor((this.track.clientWidth + gap + 1) / step), 1);
    }

    #getIndexFromScroll(scrollLeft, maxScroll) {
        if (scrollLeft >= maxScroll - 1) return this.#pageCount - 1;
        const step = this.#getStep();
        return step ? this.#clamp(Math.round(scrollLeft / step)) : 0;
    }

    /** @param {number} index */
    #clamp(index) {
        return Math.min(Math.max(index, 0), this.#pageCount - 1);
    }
}
