/**
 * Limpia el HTML de las lecciones de texto antes de mostrarlo. Quien carga el
 * contenido (KG o un instructor) no debe poder, ni por error, meter scripts que
 * se ejecuten en el navegador de cada estudiante. Se conserva el formato
 * habitual de un documento: títulos, listas, tablas, enlaces e imágenes.
 */
import sanitizeHtml from "sanitize-html";

export function htmlSeguro(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      "img", "figure", "figcaption", "h1", "h2", "h3", "h4", "span", "u", "s", "mark",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      "*": ["class"],
    },
    allowedSchemes: ["https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["https", "data"] },
    transformTags: {
      // Los enlaces externos se abren aparte y sin dar acceso a esta pestaña.
      a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer" }),
    },
  });
}
