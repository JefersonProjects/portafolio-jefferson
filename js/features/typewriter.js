import { prefersReducedMotion } from "../utils/dom.js";

/**
 * Efecto "máquina de escribir" en bucle: escribe una frase, la borra y pasa a la siguiente.
 *
 * Usa tres capas dentro del elemento:
 *  - texto para lectores de pantalla (todas las frases, sin animación),
 *  - una copia invisible de la frase más larga (reserva el espacio → nada "salta"),
 *  - el texto animado que se ve.
 *
 * @param {HTMLElement | null} element
 * @param {string[]} phrases
 * @param {{ typeSpeed?: number, deleteSpeed?: number, holdMs?: number, gapMs?: number }} [options]
 *        typeSpeed / deleteSpeed = ms por letra · holdMs = pausa con la frase completa · gapMs = pausa antes de la siguiente
 */
export function initTypewriter(
    element,
    phrases,
    { typeSpeed = 70, deleteSpeed = 35, holdMs = 1800, gapMs = 400 } = {}
) {
    if (!element || !phrases?.length) return;

    const longest = phrases.reduce((a, b) => (b.length > a.length ? b : a));

    const screenReaderText = document.createElement("span");
    screenReaderText.className = "sr-only";
    screenReaderText.textContent = phrases.join(", ");

    const ghost = document.createElement("span");
    ghost.className = "typewriter__ghost";
    ghost.setAttribute("aria-hidden", "true");
    ghost.textContent = longest;

    const typed = document.createElement("span");
    typed.className = "typewriter__typed typewriter";
    typed.setAttribute("aria-hidden", "true");

    element.classList.add("typewriter-stack");
    element.replaceChildren(screenReaderText, ghost, typed);

    // Sin animación: muestra la primera frase fija.
    if (prefersReducedMotion()) {
        typed.textContent = phrases[0];
        typed.classList.remove("typewriter");
        return;
    }

    const loops = phrases.length > 1;
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
        const phrase = phrases[phraseIndex];

        if (!deleting) {
            typed.textContent = phrase.slice(0, ++charIndex);
            if (charIndex < phrase.length) return setTimeout(tick, typeSpeed);
            if (!loops) return; // una sola frase: se queda escrita
            deleting = true;
            return setTimeout(tick, holdMs);
        }

        typed.textContent = phrase.slice(0, --charIndex);
        if (charIndex > 0) return setTimeout(tick, deleteSpeed);

        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, gapMs);
    };

    tick();
}
