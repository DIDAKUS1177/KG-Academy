/**
 * Búsquedas por texto que no distinguen mayúsculas.
 *
 * En local la base es SQLite, que ya compara sin mayúsculas; en producción es
 * PostgreSQL, que distingue "julian" de "Julian" si no se le pide lo
 * contrario. Además, cada palabra se busca por separado: "julian perez"
 * encuentra a quien tiene "Julian" en el nombre y "Perez" en el apellido.
 */
import type { Prisma } from "@prisma/client";

const POSTGRES = /^postgres(ql)?:/i.test(process.env.DATABASE_URL ?? "");

/** Filtro "contiene" sin distinguir mayúsculas. */
export function contiene(texto: string) {
  return (POSTGRES ? { contains: texto, mode: "insensitive" } : { contains: texto }) as { contains: string };
}

/** Cada palabra de la búsqueda debe aparecer en alguno de los campos. */
function porPalabras(q: string, campos: string[]) {
  const palabras = q.split(/\s+/).filter(Boolean).slice(0, 6);
  return { AND: palabras.map((p) => ({ OR: campos.map((c) => ({ [c]: contiene(p) })) })) };
}

/** Personas por nombre, apellido, correo o documento. */
export const buscarPersona = (q: string) =>
  porPalabras(q, ["firstName", "lastName", "email", "documentNumber"]) as Prisma.UserWhereInput;

/** Certificados por código, nombre o documento de quien lo recibió. */
export const buscarCertificado = (q: string) =>
  porPalabras(q, ["code", "studentName", "studentDocument"]) as Prisma.CertificateWhereInput;

/** Cursos por título, subtítulo o código. */
export const buscarCurso = (q: string) => porPalabras(q, ["title", "subtitle", "code"]) as Prisma.CourseWhereInput;
