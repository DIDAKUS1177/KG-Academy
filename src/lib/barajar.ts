/**
 * Barajado determinista: con la misma clave da el mismo orden en el servidor y
 * en el navegador, así React no encuentra diferencias al hidratar la página.
 * Cambiando la clave (por ejemplo, el número de intento) cambia el orden.
 */
export function semilla(texto: string) {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) h = Math.imul(h ^ texto.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export function barajar<T>(lista: T[], clave: string): T[] {
  const azar = semilla(clave);
  const r = [...lista];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}
