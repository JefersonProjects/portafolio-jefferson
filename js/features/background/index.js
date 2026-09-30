import { BackgroundCanvas } from "./BackgroundCanvas.js";
import { createNetworkEffect } from "./effects/network.js";

/**
 * Efectos disponibles. Para agregar uno nuevo en el futuro: crea un archivo en effects/
 * que devuelva { id, name, setup, render } y regístralo aquí.
 */
const EFFECTS = {
    network: createNetworkEffect,
};

/**
 * Inicia el fondo animado.
 * @param {HTMLCanvasElement | null} canvas
 * @param {{ effect?: keyof typeof EFFECTS | "none" }} [options]
 */
export function initBackground(canvas, { effect = "network" } = {}) {
    if (!canvas) return;
    if (effect === "none") {
        canvas.remove();
        return;
    }

    const create = EFFECTS[effect] ?? EFFECTS.network;
    const background = new BackgroundCanvas(canvas);
    background.setEffect(create());
    background.start();
}
