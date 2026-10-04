/**
 * Quién puede abrir un curso en el aula.
 *
 * Un curso publicado lo ve cualquier usuario con sesión. Uno en borrador solo
 * lo ven los roles de KG que lo preparan y revisan (superadministrador,
 * administrador e instructor): así KG puede recorrerlo y validarlo en
 * producción sin que un trabajador llegue por un enlace y se certifique con
 * contenido que todavía no está aprobado.
 */
import { ROLES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

const REVISORES: string[] = [ROLES.SUPERADMIN, ROLES.ADMIN_KG, ROLES.INSTRUCTOR];

/** Superadministrador, administrador o instructor de KG. */
export const esEquipoKG = (rol: string) => REVISORES.includes(rol);

/**
 * Filtro de usuarios para las cifras de la plataforma: deja fuera al equipo de
 * KG, que se matricula al revisar los cursos ("Ver en el aula") y bajaba el
 * avance y la tasa de finalización.
 */
export const fueraDelEquipoKG = { role: { code: { notIn: REVISORES } } };

export function puedeVerCurso(rol: string, estadoCurso: string) {
  return estadoCurso === "publicado" || REVISORES.includes(rol);
}

/**
 * ¿Puede seguir cursándolo? Quien ya estaba matriculado en un curso que KG
 * retiró del catálogo (despublicado) lo puede terminar: se oculta para los
 * nuevos, no se le quita a quien va a mitad. En borrador o revisión (KG lo
 * está corrigiendo) solo lo abre el equipo de KG.
 */
export function puedeCursar(rol: string, estadoCurso: string, matriculado: boolean) {
  return puedeVerCurso(rol, estadoCurso) || (matriculado && estadoCurso === "despublicado");
}

/* ---------------------- Catálogo habilitado por empresa ---------------------- */

/**
 * Qué cursos ve cada empresa. Lo decide KG en dos lugares:
 *
 *   - El curso: "general" (para todas) o "exclusivo" (solo para las empresas
 *     a las que se lo habilitan). Un exclusivo no sale en el catálogo público
 *     ni lo ven los estudiantes independientes.
 *   - La empresa: catálogo "todos" (todos los generales publicados, más los
 *     exclusivos que tenga habilitados) o "seleccion" (solo los habilitados).
 *
 * Lo que una persona ya tiene matriculado lo conserva aunque después se le
 * oculte: no se le quita un curso a medio hacer.
 */
type Catalogo = { todos: boolean; habilitados: Set<string> } | null;

/** Catálogo de una empresa; null para quien no tiene empresa (estudiante independiente). */
async function catalogoDe(companyId: string | null | undefined): Promise<Catalogo> {
  if (!companyId) return null;
  const empresa = await prisma.company.findUnique({
    where: { id: companyId },
    select: { catalogo: true, cursosHabilitados: { select: { courseId: true } } },
  });
  if (!empresa) return null;
  return { todos: empresa.catalogo !== "seleccion", habilitados: new Set(empresa.cursosHabilitados.map((c) => c.courseId)) };
}

function permite(catalogo: Catalogo, curso: { id: string; visibilidad: string }) {
  if (!catalogo) return curso.visibilidad !== "exclusivo";
  if (catalogo.habilitados.has(curso.id)) return true;
  return catalogo.todos && curso.visibilidad !== "exclusivo";
}

/** Filtro de Prisma para listar solo los cursos que ve la empresa (o el independiente). */
export async function filtroCatalogo(companyId: string | null | undefined) {
  const c = await catalogoDe(companyId);
  if (!c) return { visibilidad: { not: "exclusivo" } };
  const habilitados = { id: { in: [...c.habilitados] } };
  return c.todos ? { OR: [{ visibilidad: { not: "exclusivo" } }, habilitados] } : habilitados;
}

/** ¿La empresa puede asignar este curso? */
export async function empresaVeCurso(companyId: string, curso: { id: string; visibilidad: string }) {
  return permite(await catalogoDe(companyId), curso);
}

/**
 * ¿Puede esta persona empezar (matricularse en) este curso? El equipo de KG,
 * siempre; los demás, si su empresa (o el catálogo público) lo incluye.
 */
export async function puedeEmpezarCurso(
  user: { role: { code: string }; companyId: string | null },
  course: { id: string; status: string; visibilidad: string }
) {
  if (!puedeVerCurso(user.role.code, course.status)) return false;
  if (esEquipoKG(user.role.code)) return true;
  return permite(await catalogoDe(user.companyId), course);
}
