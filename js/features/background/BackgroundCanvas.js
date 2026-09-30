import { prefersReducedMotion } from "../../utils/dom.js";
import { readPalette } from "./palette.js";

/**
 * @typedef {Object} EffectEnv   Lo que recibe el efecto para dibujar.
 * @property {CanvasRenderingContext2D} ctx
 * @property {number} width        Ancho en píxeles CSS.
 * @property {number} height       Alto en píxeles CSS.
 * @property {number} scrollY      Scroll vertical actual de la página.
 * @property {import("./palette.js").Palette} palette  Colores del tema actual.
 * @property {{ x: number, y: number, active: boolean, lastMove: number }} pointer
 *           Posición del mouse; lastMove = segundo en que se movió por última vez.
 *
 * @typedef {Object} BackgroundEffect
 * @property {string} id
 * @property {string} name
 * @property {(env: EffectEnv) => void} setup                          Crea el estado (al iniciar o cambiar el ancho).
 * @property {(env: EffectEnv, dt: number, time: number) => void} render  Dibuja un cuadro. dt/time en segundos.
 * @property {(env: EffectEnv, x: number, y: number) => void} [onPointerDown]  Clic/toque sobre el fondo.
 */

/** Evita saltos gigantes si la pestaña estuvo en segundo plano. */
const MAX_DT = 0.05;
/** En pantallas muy densas (celulares 3x) dibujamos a 2x: se ve igual y cuesta menos. */
const MAX_DPR = 2;
/** Clics sobre estos elementos no cuentan como clic en el fondo. */
const INTERACTIVE = "a, button, input, textarea, select, label, [role='button'], [data-carousel-track]";

/**
 * Motor del fondo: maneja el <canvas>, el tamaño, el bucle de animación, el mouse y el tema.
 * No sabe QUÉ se dibuja: eso lo decide el efecto que le pases con setEffect().
 */
export class BackgroundCanvas {
    /** @type {BackgroundEffect | null} */
    #effect = null;
    #frame = 0;
    #lastTime = 0;
    #running = false;
    #setupWidth = 0;

    /** @param {HTMLCanvasElement} canvas */
    constructor(canvas) {
        this.canvas = canvas;
        /** @type {EffectEnv} */
        this.env = {
            ctx: /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d")),
            width: 0,
            height: 0,
            scrollY: window.scrollY,
            palette: readPalette(),
            pointer: { x: 0, y: 0, active: false, lastMove: 0 },
        };
        this.reducedMotion = prefersReducedMotion();

        this.#resize();
        this.#bindEvents();
    }

    /** @param {BackgroundEffect} effect */
    setEffect(effect) {
        this.#effect = effect;
        effect.setup(this.env);
        if (!this.#running) this.#drawOnce();
    }

    start() {
        if (this.#running || this.reducedMotion) {
            this.#drawOnce();
            return;
        }
        this.#running = true;
        this.#lastTime = performance.now();
        this.#frame = requestAnimationFrame((t) => this.#loop(t));
    }

    stop() {
        this.#running = false;
        cancelAnimationFrame(this.#frame);
    }

    /* ------------------------------------------------------------------ */

    #loop(now) {
        if (!this.#running) return;
        const dt = Math.min((now - this.#lastTime) / 1000, MAX_DT);
        this.#lastTime = now;
        this.#effect?.render(this.env, dt, now / 1000);
        this.#frame = requestAnimationFrame((t) => this.#loop(t));
    }

    #drawOnce() {
        this.#effect?.render(this.env, 0, performance.now() / 1000);
    }

    #resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.canvas.width = Math.round(width * dpr);
        this.canvas.height = Math.round(height * dpr);
        this.env.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.env.width = width;
        this.env.height = height;

        // En celular la barra del navegador cambia el alto al hacer scroll:
        // solo reiniciamos el efecto si cambió el ancho (rotación o ventana nueva).
        if (this.#effect && width !== this.#setupWidth) this.#effect.setup(this.env);
        this.#setupWidth = width;
        if (!this.#running) this.#drawOnce();
    }

    #bindEvents() {
        let resizeTimer = 0;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => this.#resize(), 120);
        });

        window.addEventListener("scroll", () => (this.env.scrollY = window.scrollY), { passive: true });

        window.addEventListener(
            "pointermove",
            (event) => {
                if (event.pointerType !== "mouse") return;
                Object.assign(this.env.pointer, {
                    x: event.clientX,
                    y: event.clientY,
                    active: true,
                    lastMove: performance.now() / 1000,
                });
            },
            { passive: true }
        );
        document.documentElement.addEventListener("pointerleave", () => (this.env.pointer.active = false));

        // Clic o toque en una zona "vacía" de la página (no en links, botones ni el carrusel).
        window.addEventListener(
            "pointerdown",
            (event) => {
                if (!this.#running || event.button > 0) return;
                if (event.target instanceof Element && event.target.closest(INTERACTIVE)) return;
                this.#effect?.onPointerDown?.(this.env, event.clientX, event.clientY);
            },
            { passive: true }
        );

        // Al cambiar de tema solo se vuelven a leer los colores (la animación sigue igual).
        document.addEventListener("themechange", () => {
            this.env.palette = readPalette();
            if (!this.#running) this.#drawOnce();
        });
    }
}
