/**
 * EFECTOS DE SONIDO DE LAS LECCIONES INTERACTIVAS
 *
 * Se sintetizan en el navegador con Web Audio: no hay archivos que descargar
 * ni licencias de audio. Solo suenan después de un toque o clic del usuario
 * (así lo exigen los navegadores) y se pueden silenciar; la preferencia se
 * guarda en el navegador.
 */

const CLAVE = "kg-sonido";
let ctx: AudioContext | null = null;

export function sonidoActivo(): boolean {
  try {
    return localStorage.getItem(CLAVE) !== "0";
  } catch {
    return true;
  }
}

export function fijarSonido(activo: boolean) {
  try {
    localStorage.setItem(CLAVE, activo ? "1" : "0");
  } catch {
    /* Sin almacenamiento: vale solo para esta visita. */
  }
}

type Nota = [frecuencia: number, inicio: number, duracion: number];

function tocar(notas: Nota[], forma: OscillatorType = "triangle", volumen = 0.07) {
  if (typeof window === "undefined" || !sonidoActivo()) return;
  try {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    ctx ??= new Ctor();
    if (ctx.state === "suspended") void ctx.resume();
    const ahora = ctx.currentTime;
    for (const [f, t, d] of notas) {
      const osc = ctx.createOscillator();
      const gan = ctx.createGain();
      osc.type = forma;
      osc.frequency.setValueAtTime(f, ahora + t);
      gan.gain.setValueAtTime(0.0001, ahora + t);
      gan.gain.exponentialRampToValueAtTime(volumen, ahora + t + 0.015);
      gan.gain.exponentialRampToValueAtTime(0.0001, ahora + t + d);
      osc.connect(gan).connect(ctx.destination);
      osc.start(ahora + t);
      osc.stop(ahora + t + d + 0.05);
    }
  } catch {
    /* Un navegador sin audio no debe romper la lección. */
  }
}

export const sfx = {
  clic: () => tocar([[520, 0, 0.05]], "sine", 0.04),
  acierto: () => tocar([[660, 0, 0.09], [990, 0.08, 0.16]]),
  error: () => tocar([[220, 0, 0.16], [165, 0.1, 0.22]], "sawtooth", 0.035),
  moneda: () => tocar([[988, 0, 0.07], [1319, 0.06, 0.18]], "square", 0.03),
  racha: () => tocar([[523, 0, 0.08], [659, 0.07, 0.08], [784, 0.14, 0.08], [1047, 0.21, 0.2]], "square", 0.03),
  tic: () => tocar([[1200, 0, 0.03]], "square", 0.02),
  alarma: () => tocar([[880, 0, 0.12], [660, 0.14, 0.12]], "square", 0.03),
  nivel: () =>
    tocar(
      [
        [523, 0, 0.12],
        [659, 0.12, 0.12],
        [784, 0.24, 0.12],
        [1047, 0.36, 0.35],
        [784, 0.5, 0.1],
        [1047, 0.6, 0.45],
      ],
      "square",
      0.035
    ),
  derrota: () => tocar([[392, 0, 0.2], [330, 0.2, 0.2], [262, 0.4, 0.45]], "sawtooth", 0.035),
};
