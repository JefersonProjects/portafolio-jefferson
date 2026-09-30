import { rgba } from "../palette.js";
import { random, clamp, pick } from "../../../utils/math.js";

/**
 * "Red de nodos": puntos que flotan y se conectan cuando están cerca, como equipos en una red.
 *
 *  - Profundidad: nodos lejanos (pequeños y tenues) y cercanos (más grandes y brillantes).
 *  - Paquetes de datos: viajan por los enlaces y saltan de nodo en nodo, como en un enrutamiento.
 *  - Mouse: se conecta a los nodos cercanos y los atrae suavemente. Las líneas se
 *    desvanecen justo antes de llegar al puntero, así no se forma un punto en la punta.
 *  - Clic / toque: hace un "ping": una onda sale del puntero, los nodos que alcanza destellan
 *    y se envían paquetes a los nodos conectados.
 *  - Scroll: la red se desplaza un poco (más los nodos cercanos) para dar sensación de profundidad.
 */

/** Ajustes del efecto: puedes jugar con estos números. */
const SETTINGS = {
    density: 14000, // px² de pantalla por nodo (menor = más nodos)
    minNodes: 28,
    maxNodes: 120,
    hubChance: 0.18, // probabilidad de que un nodo cercano sea "servidor" (color de acento)
    linkDistance: 140, // px: a menos de esto dos nodos se conectan
    linkOpacity: 0.3, // opacidad máxima de los enlaces
    maxSpeed: 75, // px/s: velocidad máxima de un nodo

    pointerRadius: 190, // px: alcance del mouse
    pointerPull: 55, // fuerza con que el mouse atrae a los nodos cercanos
    pointerMinDistance: 34, // px: los nodos no se pegan al puntero
    pointerIdleRelease: 1.5, // s: si el mouse se queda quieto, deja de atraer y los nodos se sueltan
    pointerGap: 16, // px: las líneas se desvanecen antes de tocar el puntero (sin punto en la punta)

    packetSpeed: 170, // px/s
    packetsPerNode: 1 / 7, // cantidad de paquetes viajando según el número de nodos

    pingSpeed: 520, // px/s: velocidad de la onda del clic
    pingRadius: 420, // px: hasta dónde llega la onda
    pingPackets: 8, // paquetes que salen del puntero en cada ping
    pingHops: 3, // saltos que da cada paquete del ping antes de desaparecer
};

/** Capas de profundidad: [0] lejana, [1] cercana. */
const LAYERS = [
    { share: 0.55, radius: [0.7, 1.3], alpha: 0.3, speed: 0.55, parallax: 0.05 },
    { share: 0.45, radius: [1.3, 2.2], alpha: 0.6, speed: 1, parallax: 0.14 },
];

/** Niveles de opacidad para dibujar los enlaces por lotes (mucho más rápido que uno por uno). */
const LINK_LEVELS = 6;

/**
 * @typedef {{ x: number, y: number, vx: number, vy: number, baseVx: number, baseVy: number,
 *             r: number, layer: number, hub: boolean, phase: number, flash: number }} Node
 * @typedef {{ to: number, progress: number, from?: number, origin?: { x: number, y: number }, hops?: number }} Packet
 *   origin: punto del clic (paquetes de un ping) · hops: saltos restantes (solo paquetes de un ping)
 * @typedef {{ x: number, y: number, radius: number }} Ping
 */

/** @returns {import("../BackgroundCanvas.js").BackgroundEffect} */
export function createNetworkEffect() {
    /** @type {Node[]} */ let nodes = [];
    /** @type {Packet[]} */ let packets = [];
    /** @type {Ping[]} */ let pings = [];
    /** @type {number[][]} */ let neighbors = [];
    let lastScrollY = 0;

    const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

    /** Punto de inicio de un paquete (un nodo, o el lugar del clic). */
    const packetStart = (p) => (p.origin ? p.origin : nodes[p.from ?? 0]);

    /** Nodos dentro de un radio, del más cercano al más lejano. */
    const nodesNear = (x, y, radius) =>
        nodes
            .map((node, index) => ({ index, d: Math.hypot(node.x - x, node.y - y) }))
            .filter((n) => n.d < radius)
            .sort((a, b) => a.d - b.d);

    /* ------------------------------ Actualización ------------------------------ */

    function moveNodes(env, dt, time) {
        const { width, height, pointer } = env;
        // la atracción se apaga poco a poco si el mouse lleva un rato quieto
        const idle = time - pointer.lastMove;
        const pullFactor = clamp(1 - (idle - SETTINGS.pointerIdleRelease), 0, 1);
        const scrollDelta = env.scrollY - lastScrollY;
        lastScrollY = env.scrollY;
        const margin = 30;

        for (const node of nodes) {
            // atracción suave hacia el mouse
            if (pointer.active && pullFactor > 0) {
                const dx = pointer.x - node.x;
                const dy = pointer.y - node.y;
                const d = Math.hypot(dx, dy);
                if (d < SETTINGS.pointerRadius && d > SETTINGS.pointerMinDistance) {
                    const pull = SETTINGS.pointerPull * (1 - d / SETTINGS.pointerRadius) * pullFactor;
                    node.vx += (dx / d) * pull * dt;
                    node.vy += (dy / d) * pull * dt;
                }
            }

            // vuelve poco a poco a su deriva natural
            const relax = Math.min(1, 0.8 * dt);
            node.vx += (node.baseVx - node.vx) * relax;
            node.vy += (node.baseVy - node.vy) * relax;

            const speed = Math.hypot(node.vx, node.vy);
            if (speed > SETTINGS.maxSpeed) {
                node.vx *= SETTINGS.maxSpeed / speed;
                node.vy *= SETTINGS.maxSpeed / speed;
            }

            node.x += node.vx * dt;
            node.y += node.vy * dt - scrollDelta * LAYERS[node.layer].parallax;

            // al salir por un borde, entra por el opuesto
            if (node.x < -margin) node.x = width + margin;
            else if (node.x > width + margin) node.x = -margin;
            if (node.y < -margin) node.y = height + margin;
            else if (node.y > height + margin) node.y = -margin;

            node.flash = Math.max(0, node.flash - dt * 1.5);
        }
    }

    function updatePings(dt) {
        for (const ping of pings) {
            const previous = ping.radius;
            ping.radius += SETTINGS.pingSpeed * dt;
            // los nodos que la onda cruza en este cuadro destellan
            for (const node of nodes) {
                const d = Math.hypot(node.x - ping.x, node.y - ping.y);
                if (d >= previous && d < ping.radius) node.flash = 1;
            }
        }
        pings = pings.filter((ping) => ping.radius < SETTINGS.pingRadius);
    }

    /* -------------------------------- Dibujo -------------------------------- */

    function drawLinks(ctx, palette) {
        const { fg, strength } = palette;
        const buckets = Array.from({ length: LINK_LEVELS }, () => /** @type {number[]} */ ([]));
        neighbors = nodes.map(() => []);

        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];
            for (let j = i + 1; j < nodes.length; j++) {
                const b = nodes[j];
                const d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d > SETTINGS.linkDistance) continue;

                neighbors[i].push(j);
                neighbors[j].push(i);

                // más opaco si están cerca y si ambos nodos son de la capa cercana
                const depth = (LAYERS[a.layer].alpha + LAYERS[b.layer].alpha) / 1.2;
                const level = Math.floor((1 - d / SETTINGS.linkDistance) * depth * LINK_LEVELS);
                buckets[clamp(level, 0, LINK_LEVELS - 1)].push(a.x, a.y, b.x, b.y);
            }
        }

        ctx.lineWidth = 1;
        buckets.forEach((segments, level) => {
            if (!segments.length) return;
            ctx.strokeStyle = rgba(fg, ((level + 1) / LINK_LEVELS) * SETTINGS.linkOpacity * strength);
            ctx.beginPath();
            for (let k = 0; k < segments.length; k += 4) {
                ctx.moveTo(segments[k], segments[k + 1]);
                ctx.lineTo(segments[k + 2], segments[k + 3]);
            }
            ctx.stroke();
        });
    }

    /**
     * Líneas del puntero hacia los nodos cercanos.
     * Cada línea va del nodo hacia el mouse y se desvanece antes de tocarlo, así las
     * conexiones "apuntan" al cursor sin dibujar ningún punto o círculo en la punta.
     */
    function drawPointer(ctx, palette, pointer) {
        if (!pointer.active) return;
        const { accent, strength } = palette;

        for (const node of nodes) {
            const dx = pointer.x - node.x;
            const dy = pointer.y - node.y;
            const d = Math.hypot(dx, dy);
            if (d > SETTINGS.pointerRadius || d <= SETTINGS.pointerGap) continue;

            const closeness = 1 - d / SETTINGS.pointerRadius;
            // termina a `pointerGap` px del puntero
            const endX = pointer.x - (dx / d) * SETTINGS.pointerGap;
            const endY = pointer.y - (dy / d) * SETTINGS.pointerGap;

            const gradient = ctx.createLinearGradient(node.x, node.y, endX, endY);
            gradient.addColorStop(0, rgba(accent, closeness * 0.55 * strength));
            gradient.addColorStop(1, rgba(accent, 0));
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.6 + closeness;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }

    function drawNodes(ctx, palette, pointer, time) {
        const { fg, accent, strength } = palette;

        for (const node of nodes) {
            const layer = LAYERS[node.layer];
            const pulse = node.hub ? 1 + 0.2 * Math.sin(time * 2 + node.phase) : 1;

            // más brillo cerca del mouse
            let boost = 0;
            if (pointer.active) {
                const d = Math.hypot(node.x - pointer.x, node.y - pointer.y);
                if (d < SETTINGS.pointerRadius) boost = (1 - d / SETTINGS.pointerRadius) * 0.35;
            }

            // destello (ping o paquete que llega)
            if (node.flash > 0) {
                ctx.fillStyle = rgba(accent, node.flash * 0.3 * strength);
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.r * pulse + 7 * node.flash, 0, Math.PI * 2);
                ctx.fill();
            }

            const useAccent = node.hub || node.flash > 0.3;
            ctx.fillStyle = useAccent
                ? rgba(accent, (0.85 + boost) * strength)
                : rgba(fg, (layer.alpha + boost) * strength);
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.r * pulse + node.flash * 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawPings(ctx, palette) {
        const { accent, strength } = palette;
        ctx.lineWidth = 1.5;
        for (const ping of pings) {
            const life = 1 - ping.radius / SETTINGS.pingRadius;
            ctx.strokeStyle = rgba(accent, life * 0.5 * strength);
            ctx.beginPath();
            ctx.arc(ping.x, ping.y, ping.radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    /** Mueve y dibuja los paquetes; al llegar a un nodo saltan a un vecino (como un router). */
    function updateAndDrawPackets(ctx, palette, dt) {
        const { accent, strength } = palette;
        const target = clamp(Math.round(nodes.length * SETTINGS.packetsPerNode), 4, 16);

        // mantener siempre algunos paquetes circulando
        let attempts = 0;
        while (packets.filter((p) => p.hops === undefined).length < target && attempts++ < 20) {
            const from = Math.floor(Math.random() * nodes.length);
            if (neighbors[from]?.length) packets.push({ from, to: pick(neighbors[from]), progress: 0 });
        }

        packets = packets.flatMap((packet) => {
            const a = packetStart(packet);
            const b = nodes[packet.to];
            const length = distance(a, b);
            // si el enlace se rompió (los nodos se alejaron), el paquete se pierde
            if (!packet.origin && length > SETTINGS.linkDistance * 1.25) return [];

            packet.progress += (SETTINGS.packetSpeed * dt) / Math.max(length, 1);

            if (packet.progress >= 1) {
                b.flash = Math.max(b.flash, 0.5);
                if (packet.hops !== undefined && packet.hops <= 0) return [];
                const next = (neighbors[packet.to] ?? []).filter((n) => n !== packet.from);
                if (!next.length) return [];
                const hops = packet.hops === undefined ? undefined : packet.hops - 1;
                return [{ from: packet.to, to: pick(next), progress: 0, hops }];
            }

            const x = a.x + (b.x - a.x) * packet.progress;
            const y = a.y + (b.y - a.y) * packet.progress;
            const ux = (b.x - a.x) / (length || 1);
            const uy = (b.y - a.y) / (length || 1);

            // enlace activo
            ctx.lineWidth = 1;
            ctx.strokeStyle = rgba(accent, 0.28 * strength);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();

            // estela
            const tail = Math.min(18, length * packet.progress);
            const gradient = ctx.createLinearGradient(x - ux * tail, y - uy * tail, x, y);
            gradient.addColorStop(0, rgba(accent, 0));
            gradient.addColorStop(1, rgba(accent, 0.9 * strength));
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x - ux * tail, y - uy * tail);
            ctx.lineTo(x, y);
            ctx.stroke();

            // brillo + núcleo
            ctx.fillStyle = rgba(accent, 0.2 * strength);
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = rgba(accent, 1);
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();

            return [packet];
        });
    }

    /* ------------------------------- Efecto -------------------------------- */

    return {
        id: "network",
        name: "Red de nodos",

        setup({ width, height, scrollY }) {
            const count = clamp(Math.round((width * height) / SETTINGS.density), SETTINGS.minNodes, SETTINGS.maxNodes);
            nodes = Array.from({ length: count }, (_, i) => {
                const layer = i < count * LAYERS[0].share ? 0 : 1;
                const { speed, radius } = LAYERS[layer];
                const baseVx = random(-18, 18) * speed;
                const baseVy = random(-18, 18) * speed;
                return {
                    x: random(0, width),
                    y: random(0, height),
                    vx: baseVx,
                    vy: baseVy,
                    baseVx,
                    baseVy,
                    r: random(radius[0], radius[1]),
                    layer,
                    hub: layer === 1 && Math.random() < SETTINGS.hubChance,
                    phase: random(0, Math.PI * 2),
                    flash: 0,
                };
            });
            packets = [];
            pings = [];
            neighbors = nodes.map(() => []);
            lastScrollY = scrollY;
        },

        render(env, dt, time) {
            const { ctx, width, height, palette, pointer } = env;
            ctx.clearRect(0, 0, width, height);

            moveNodes(env, dt, time);
            updatePings(dt);

            drawLinks(ctx, palette);
            drawPointer(ctx, palette, pointer);
            updateAndDrawPackets(ctx, palette, dt);
            drawPings(ctx, palette);
            drawNodes(ctx, palette, pointer, time);
        },

        /** Clic/toque: "ping" desde el puntero hacia los nodos cercanos. */
        onPointerDown(_env, x, y) {
            pings.push({ x, y, radius: 0 });
            const origin = { x, y };
            nodesNear(x, y, SETTINGS.pointerRadius * 1.3)
                .slice(0, SETTINGS.pingPackets)
                .forEach(({ index }) => packets.push({ origin, to: index, progress: 0, hops: SETTINGS.pingHops }));
        },
    };
}
