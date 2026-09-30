/**
 * Luz difusa que sigue al puntero.
 * Usa `transform` + requestAnimationFrame: se mueve en la GPU y como máximo 1 vez por frame.
 *
 * @param {HTMLElement | null} element
 */
export function initCursorLight(element) {
    if (!element) return;

    let frame = 0;

    document.addEventListener(
        "mousemove",
        (event) => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                // Centra el círculo en el puntero (el tamaño se define en CSS).
                const offsetX = element.offsetWidth / 2;
                const offsetY = element.offsetHeight / 2;
                element.style.transform = `translate3d(${event.clientX - offsetX}px, ${event.clientY - offsetY}px, 0)`;
            });
        },
        { passive: true }
    );
}
