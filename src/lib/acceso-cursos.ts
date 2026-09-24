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

const REVISORES: string[] = [ROLES.SUPERADMIN, ROLES.ADMIN_KG, ROLES.INSTRUCTOR];

export function puedeVerCurso(rol: string, estadoCurso: string) {
  return estadoCurso === "publicado" || REVISORES.includes(rol);
}
