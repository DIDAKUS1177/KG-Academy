/**
 * KG ACADEMY - Constantes y listas cerradas del dominio.
 * Estas listas son el contrato de los campos String que en PostgreSQL
 * pueden migrarse a ENUM nativo.
 */

export const BRAND = {
  company: "KG GESTION INTEGRAL S.A.S.",
  owner: "Katerine Guanarita",
  product: "KG Academy",
  tagline: "Formacion que protege vidas",
  navy: "#0A2D4D",
  lime: "#8FBF16",
  developer: "Diego Alejandro Hernandez Blanco",
  services: ["Gestion SST", "E-Learning", "Business Analytics"],
} as const;

export const ROLES = {
  SUPERADMIN: "superadmin",
  ADMIN_KG: "admin_kg",
  INSTRUCTOR: "instructor",
  ADMIN_EMPRESA: "admin_empresa",
  SUPERVISOR: "supervisor",
  ESTUDIANTE: "estudiante",
} as const;

export type RoleCode = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABEL: Record<string, string> = {
  superadmin: "SuperAdmin KG",
  admin_kg: "Administrador KG",
  instructor: "Instructor",
  admin_empresa: "Administrador de empresa",
  supervisor: "Supervisor",
  estudiante: "Estudiante / Trabajador",
};

/** Rutas de inicio por rol tras el login */
export const ROLE_HOME: Record<string, string> = {
  superadmin: "/admin",
  admin_kg: "/admin",
  instructor: "/admin/cursos",
  admin_empresa: "/empresa",
  supervisor: "/empresa/seguimiento",
  estudiante: "/aula",
};

export const USER_STATUS = ["activo", "inactivo", "bloqueado", "pendiente_activacion"] as const;
export const COURSE_STATUS = ["borrador", "revision", "publicado", "despublicado", "archivado"] as const;
export const ENROLLMENT_STATUS = ["no_iniciado", "en_progreso", "completado", "vencido", "anulado"] as const;
export const ASSIGNMENT_STATUS = ["asignado", "en_progreso", "completado", "vencido", "cancelado"] as const;
export const CERTIFICATE_STATUS = ["vigente", "vencido", "revocado"] as const;
export const CONTENT_TYPES = [
  "pendiente",
  "video",
  "pdf",
  "texto",
  "enlace",
  "genially",
  "scorm",
  "quiz",
  "actividad",
] as const;

export const STATUS_LABEL: Record<string, string> = {
  no_iniciado: "No iniciado",
  en_progreso: "En progreso",
  completado: "Completado",
  vencido: "Vencido",
  anulado: "Anulado",
  asignado: "Asignado",
  cancelado: "Cancelado",
  borrador: "Borrador",
  revision: "En revision",
  publicado: "Publicado",
  despublicado: "Despublicado",
  archivado: "Archivado",
  activo: "Activo",
  inactivo: "Inactivo",
  bloqueado: "Bloqueado",
  pendiente_activacion: "Pendiente de activacion",
  vigente: "Vigente",
  revocado: "Revocado",
  activa: "Activa",
  suspendida: "Suspendida",
  pendiente: "Pendiente",
};

export const STATUS_TONE: Record<string, "green" | "blue" | "amber" | "red" | "slate"> = {
  completado: "green",
  publicado: "green",
  activo: "green",
  activa: "green",
  vigente: "green",
  en_progreso: "blue",
  revision: "blue",
  asignado: "amber",
  no_iniciado: "slate",
  borrador: "slate",
  pendiente: "amber",
  pendiente_activacion: "amber",
  vencido: "red",
  bloqueado: "red",
  revocado: "red",
  anulado: "red",
  cancelado: "red",
  archivado: "slate",
  despublicado: "slate",
  inactivo: "slate",
  suspendida: "amber",
};

/** Matriz de permisos por rol (punto 4 del esqueleto funcional). */
export const PERMISSION_MATRIX: Record<string, string[]> = {
  superadmin: ["*"],
  admin_kg: [
    "usuarios.ver", "usuarios.crear", "usuarios.editar",
    "empresas.ver", "empresas.crear", "empresas.editar",
    "cursos.ver", "cursos.crear", "cursos.editar", "cursos.publicar",
    "evaluaciones.ver", "evaluaciones.crear", "evaluaciones.editar",
    "certificados.ver", "certificados.emitir",
    "reportes.ver", "reportes.exportar",
    "auditoria.ver",
  ],
  instructor: [
    "cursos.ver", "cursos.crear", "cursos.editar",
    "evaluaciones.ver", "evaluaciones.crear", "evaluaciones.editar",
    "reportes.ver",
  ],
  admin_empresa: [
    "empresa.ver", "empresa.trabajadores.ver", "empresa.trabajadores.crear",
    "empresa.trabajadores.editar", "empresa.asignar", "empresa.reportes.ver",
    "empresa.reportes.exportar", "certificados.ver",
  ],
  supervisor: ["empresa.ver", "empresa.trabajadores.ver", "empresa.reportes.ver"],
  estudiante: ["aula.ver", "perfil.editar", "certificados.propios"],
};

export const MODULES_PERMISOS = [
  "usuarios", "empresas", "cursos", "evaluaciones",
  "certificados", "reportes", "pagos", "configuracion", "auditoria",
];
export const ACCIONES_PERMISOS = ["ver", "crear", "editar", "eliminar", "publicar", "exportar", "revocar", "asignar"];
