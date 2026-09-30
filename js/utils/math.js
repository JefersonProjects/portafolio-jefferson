/**
 * Utilidades numéricas pequeñas.
 */

/** Número aleatorio entre min y max. */
export const random = (min, max) => min + Math.random() * (max - min);

/** Elemento aleatorio de un arreglo. */
export const pick = (items) => items[Math.floor(Math.random() * items.length)];

/** Limita un valor entre min y max. */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
