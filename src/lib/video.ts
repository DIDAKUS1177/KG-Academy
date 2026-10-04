/**
 * Dirección para incrustar un video.
 *
 * Quien carga la lección pega el enlace tal como lo copia del navegador
 * (youtube.com/watch?v=..., youtu.be/..., un Short o vimeo.com/...), pero esas
 * páginas no se pueden mostrar dentro de la plataforma: hay que usar la
 * dirección "embed". Cualquier otra dirección se deja igual.
 */
export function urlDeVideo(url: string) {
  let u: URL;
  try {
    u = new URL(url.trim());
  } catch {
    return url;
  }
  const host = u.hostname.replace(/^www\.|^m\./, "");
  const inicio = Number.parseInt(u.searchParams.get("t") ?? u.searchParams.get("start") ?? "", 10);
  const conInicio = (base: string) => (Number.isFinite(inicio) && inicio > 0 ? `${base}?start=${inicio}` : base);

  if (host === "youtu.be") {
    const id = u.pathname.slice(1).split("/")[0];
    if (id) return conInicio(`https://www.youtube-nocookie.com/embed/${id}`);
  }
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (u.pathname === "/watch" && u.searchParams.get("v")) {
      return conInicio(`https://www.youtube-nocookie.com/embed/${u.searchParams.get("v")}`);
    }
    const corto = u.pathname.match(/^\/(?:shorts|live)\/([\w-]+)/);
    if (corto) return conInicio(`https://www.youtube-nocookie.com/embed/${corto[1]}`);
  }
  if (host === "vimeo.com") {
    const id = u.pathname.match(/^\/(\d+)/)?.[1];
    if (id) return `https://player.vimeo.com/video/${id}`;
  }
  return url;
}
