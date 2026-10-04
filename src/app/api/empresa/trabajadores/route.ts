import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { empresaVeCurso } from "@/lib/acceso-cursos";
import { requireUser, audit, hashPassword } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { claveTemporal } from "@/lib/admin-api";
import { cuposEmpresa, mensajeSinCupo } from "@/lib/cupos";
import { asignarCurso } from "@/lib/asignaciones";
import { correoInterno, esCorreoValido, normalizarDocumento, usuarioDeIngreso } from "@/lib/identidad";
import { finDelDia } from "@/lib/utils";
import { problemaClaveNueva } from "@/lib/claves";

/**
 * Alta de trabajadores de una empresa: de a uno o en lote (filas leídas de un
 * Excel/CSV o pegadas desde Excel).
 *
 *   - Trabajador o supervisor. Los dos ocupan cupo del plan.
 *   - Sin correo se puede: la persona ingresa con su número de documento.
 *   - Área, cargo y sede llegan por id (formulario) o por nombre (lote); un
 *     nombre que la empresa aún no tiene se crea.
 *   - Opcionalmente, en el mismo paso se les asignan cursos publicados.
 *
 * Cada persona nueva recibe su propia contraseña temporal, que se muestra una
 * sola vez y debe cambiar al primer ingreso. De a uno, la empresa puede
 * escribir la contraseña ella misma. Alguien que la empresa retiró y vuelve se
 * reincorpora con su historial.
 */

// Cada contraseña se cifra por separado; un lote grande tarda. 60 s es el
// máximo del plan gratuito de Vercel y alcanza para el tope de filas de abajo.
export const maxDuration = 60;

/** Filas por lote. Con más, se divide la nómina en varias cargas. */
const MAX_FILAS = 200;

const schema = z.object({
  companyId: z.string(),
  modo: z.enum(["individual", "masivo"]),
  trabajador: z.record(z.string()).optional(),
  filas: z.array(z.record(z.string())).optional(),
  /** Formato anterior del lote: texto con una fila por línea. */
  csv: z.string().optional(),
  cursos: z.array(z.string()).max(10).optional(),
  dueDate: z.string().nullable().optional(),
});

const filaSchema = z.object({
  firstName: z.string().trim().min(1, "Faltan los nombres").max(80),
  lastName: z.string().trim().min(1, "Faltan los apellidos").max(80),
  documentNumber: z.string().trim().max(30).optional().default(""),
  email: z.string().trim().max(200).optional().default(""),
  employeeCode: z.string().trim().max(40).optional().default(""),
  areaId: z.string().optional(),
  positionId: z.string().optional(),
  locationId: z.string().optional(),
  area: z.string().trim().max(80).optional(),
  cargo: z.string().trim().max(80).optional(),
  sede: z.string().trim().max(80).optional(),
  rol: z.string().trim().optional(),
  /** Solo de a uno: contraseña que escribe la empresa (en lote siempre se genera una por persona). */
  clave: z.string().max(200).optional(),
  /** "no" para no pedir el cambio al entrar (el formulario manda texto). */
  pedirCambio: z.string().optional(),
});
type Fila = z.infer<typeof filaSchema>;

const PERMITIDOS: string[] = [ROLES.ADMIN_EMPRESA, ROLES.SUPERADMIN, ROLES.ADMIN_KG];

type Resultado =
  | { tipo: "creado"; userId: string; nombre: string; usuario: string; clave: string | null }
  | { tipo: "vinculado" | "reincorporado" | "ya_estaba"; userId: string }
  | { tipo: "sin_cupo" }
  | { tipo: "error"; motivo: string };

export async function POST(req: Request) {
  const user = await requireUser();
  if (!PERMITIDOS.includes(user.role.code)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  const { companyId, modo } = parsed.data;

  // Un admin de empresa solo puede tocar SU empresa
  if (user.role.code === ROLES.ADMIN_EMPRESA && user.companyId !== companyId) {
    return NextResponse.json({ error: "No autorizado sobre esta empresa" }, { status: 403 });
  }

  if (!(await prisma.company.findUnique({ where: { id: companyId }, select: { id: true } }))) {
    return NextResponse.json({ error: "Empresa no encontrada" }, { status: 404 });
  }

  const [rolEstudiante, rolSupervisor] = await Promise.all([
    prisma.role.findUnique({ where: { code: ROLES.ESTUDIANTE } }),
    prisma.role.findUnique({ where: { code: ROLES.SUPERVISOR } }),
  ]);
  if (!rolEstudiante || !rolSupervisor) return NextResponse.json({ error: "Roles no inicializados" }, { status: 500 });

  // Cursos a asignar en el mismo paso: solo publicados.
  const idsCursos = [...new Set(parsed.data.cursos ?? [])];
  const cursos = idsCursos.length
    ? await prisma.course.findMany({ where: { id: { in: idsCursos }, status: "publicado" } })
    : [];
  if (cursos.length !== idsCursos.length) {
    return NextResponse.json({ error: "Solo se pueden asignar cursos publicados" }, { status: 409 });
  }
  const vistos = await Promise.all(cursos.map((c) => empresaVeCurso(companyId, c)));
  if (vistos.includes(false)) {
    return NextResponse.json({ error: "Alguno de los cursos no está habilitado para su empresa. Pídale a KG que lo active." }, { status: 403 });
  }
  const dueDate = parsed.data.dueDate ? finDelDia(parsed.data.dueDate) : null;
  if (dueDate && Number.isNaN(dueDate.getTime())) {
    return NextResponse.json({ error: "La fecha límite no es válida" }, { status: 400 });
  }

  // Cada trabajador nuevo o vinculado ocupa un cupo del plan contratado.
  const cupos = await cuposEmpresa(companyId);
  let disponibles = cupos.disponibles;

  // Área, cargo y sede de la empresa, por nombre (sin distinguir mayúsculas).
  const [areas, cargos, sedes] = await Promise.all([
    prisma.area.findMany({ where: { companyId } }),
    prisma.position.findMany({ where: { companyId } }),
    prisma.companyLocation.findMany({ where: { companyId } }),
  ]);
  const clave = (s: string) => s.trim().toLowerCase();
  const porNombre = {
    area: new Map(areas.map((a) => [clave(a.name), a.id])),
    cargo: new Map(cargos.map((c) => [clave(c.name), c.id])),
    sede: new Map(sedes.map((s) => [clave(s.name), s.id])),
  };
  const ids = {
    area: new Set(areas.map((a) => a.id)),
    cargo: new Set(cargos.map((c) => c.id)),
    sede: new Set(sedes.map((s) => s.id)),
  };
  async function idPorNombre(tipo: "area" | "cargo" | "sede", nombre?: string) {
    if (!nombre?.trim()) return null;
    const existente = porNombre[tipo].get(clave(nombre));
    if (existente) return existente;
    const name = nombre.trim();
    const creado =
      tipo === "area"
        ? await prisma.area.create({ data: { companyId, name } })
        : tipo === "cargo"
          ? await prisma.position.create({ data: { companyId, name } })
          : await prisma.companyLocation.create({ data: { companyId, name } });
    porNombre[tipo].set(clave(name), creado.id);
    return creado.id;
  }

  async function crear(f: Fila): Promise<Resultado> {
    const documento = f.documentNumber ? normalizarDocumento(f.documentNumber) : "";
    const correo = f.email.toLowerCase();
    if (correo && !esCorreoValido(correo)) return { tipo: "error", motivo: "El correo no es válido" };
    if (!correo && !documento) return { tipo: "error", motivo: "Sin correo, el documento es obligatorio: con él ingresará" };
    const email = correo || correoInterno(documento);
    const esSupervisor = clave(f.rol ?? "") === "supervisor";

    // Por id (formulario) deben ser de esta empresa; por nombre se buscan o se crean.
    if ((f.areaId && !ids.area.has(f.areaId)) || (f.positionId && !ids.cargo.has(f.positionId)) || (f.locationId && !ids.sede.has(f.locationId))) {
      return { tipo: "error", motivo: "El área, el cargo o la sede no pertenecen a la empresa" };
    }
    const areaId = f.areaId || (await idPorNombre("area", f.area));
    const positionId = f.positionId || (await idPorNombre("cargo", f.cargo));
    const locationId = f.locationId || (await idPorNombre("sede", f.sede));
    const vinculo = { areaId, positionId, locationId, employeeCode: f.employeeCode || null };

    const yaExiste = await prisma.user.findFirst({
      where: { OR: [{ email }, ...(documento ? [{ documentNumber: documento }] : [])] },
      include: { role: true },
    });
    if (yaExiste) {
      const miembro = await prisma.companyMember.findUnique({
        where: { companyId_userId: { companyId, userId: yaExiste.id } },
      });
      if (miembro?.status === "activo") return { tipo: "ya_estaba", userId: yaExiste.id };
      // Vuelve alguien que la empresa retiró: se reincorpora con su historial,
      // salvo que KG haya bloqueado la cuenta o que hoy esté en otra empresa.
      if (miembro) {
        const reincorporable =
          miembro.status === "retirado" &&
          [ROLES.ESTUDIANTE, ROLES.SUPERVISOR].includes(yaExiste.role.code as never) &&
          yaExiste.status !== "bloqueado" &&
          (!yaExiste.companyId || yaExiste.companyId === companyId);
        if (!reincorporable) {
          return { tipo: "error", motivo: "Esa persona no se puede reincorporar desde aquí (su cuenta está bloqueada o en otra empresa). Pídale a KG que la revise." };
        }
        if (disponibles <= 0) return { tipo: "sin_cupo" };
        disponibles--;
        await prisma.companyMember.update({
          where: { id: miembro.id },
          data: { status: "activo", ...(areaId ? { areaId } : {}), ...(positionId ? { positionId } : {}), ...(locationId ? { locationId } : {}), ...(f.employeeCode ? { employeeCode: f.employeeCode } : {}) },
        });
        // Entra con su contraseña de siempre y debe cambiarla al volver.
        await prisma.user.update({ where: { id: yaExiste.id }, data: { companyId, status: "pendiente_activacion" } });
        return { tipo: "reincorporado", userId: yaExiste.id };
      }
      // Solo se vincula a un estudiante independiente. Una cuenta de otra
      // empresa o del equipo de KG no se puede "traer": se la quitaría a quien
      // corresponde.
      if (yaExiste.role.code !== ROLES.ESTUDIANTE || yaExiste.companyId) {
        return { tipo: "error", motivo: "Ese correo o documento ya pertenece a otra cuenta. Si es el mismo trabajador, pídale a KG que lo traslade." };
      }
      if (disponibles <= 0) return { tipo: "sin_cupo" };
      disponibles--;
      await prisma.companyMember.create({ data: { companyId, userId: yaExiste.id, ...vinculo } });
      await prisma.user.update({ where: { id: yaExiste.id }, data: { companyId } });
      return { tipo: "vinculado", userId: yaExiste.id };
    }

    const elegida = f.clave?.trim() ? f.clave : null;
    if (elegida) {
      const problema = await problemaClaveNueva(elegida);
      if (problema) return { tipo: "error", motivo: problema };
    }
    if (disponibles <= 0) return { tipo: "sin_cupo" };
    disponibles--;
    const temporal = elegida ? null : claveTemporal();
    const nuevo = await prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(elegida ?? temporal!),
        firstName: f.firstName,
        lastName: f.lastName,
        documentType: documento ? "CC" : null,
        documentNumber: documento || null,
        roleId: esSupervisor ? rolSupervisor!.id : rolEstudiante!.id,
        companyId,
        // Con la contraseña escrita por la empresa puede entrar sin cambiarla, si así lo eligió.
        status: elegida && f.pedirCambio === "no" ? "activo" : "pendiente_activacion",
      },
    });
    await prisma.companyMember.create({ data: { companyId, userId: nuevo.id, isSupervisor: esSupervisor, ...vinculo } });
    await prisma.notification.create({
      data: {
        userId: nuevo.id,
        title: "Bienvenido a KG Academy",
        message: "Su empresa creó su cuenta. Ingrese con la contraseña temporal que le entregaron; el sistema le pedirá cambiarla.",
        linkUrl: "/aula",
        type: "info",
      },
    });
    return {
      tipo: "creado",
      userId: nuevo.id,
      nombre: `${f.firstName} ${f.lastName}`,
      usuario: usuarioDeIngreso({ email, documentNumber: documento }),
      clave: temporal,
    };
  }

  /** Asigna los cursos elegidos a quienes quedaron en la empresa con este alta. */
  async function asignar(userIds: string[]) {
    let asignadas = 0;
    if (!cursos.length || !userIds.length) return asignadas;
    for (const course of cursos) {
      const r = await asignarCurso({ companyId, course, userIds, actorId: user.id, dueDate, batchName: `Alta de trabajadores · ${course.code}` });
      asignadas += r.creadas;
    }
    return asignadas;
  }

  /* ------------------------------ De a uno ------------------------------ */
  if (modo === "individual") {
    const fila = filaSchema.safeParse(parsed.data.trabajador ?? {});
    if (!fila.success) return NextResponse.json({ error: fila.error.issues[0].message }, { status: 400 });
    const r = await crear(fila.data);
    if (r.tipo === "sin_cupo") return NextResponse.json({ error: mensajeSinCupo(cupos) }, { status: 409 });
    if (r.tipo === "error") return NextResponse.json({ error: r.motivo }, { status: 409 });
    if (r.tipo === "ya_estaba" && !cursos.length) {
      return NextResponse.json({ error: "Ese trabajador ya está registrado en la empresa" }, { status: 409 });
    }
    const asignadas = await asignar([r.userId]);
    await audit({
      userId: user.id,
      actorEmail: user.email,
      action: "crear",
      entity: "company_members",
      entityId: companyId,
      summary: `Alta de ${fila.data.firstName} ${fila.data.lastName}${asignadas ? ` con ${asignadas} curso(s)` : ""}`,
    });
    return NextResponse.json({
      ok: true,
      creados: r.tipo === "creado" ? 1 : 0,
      vinculado: r.tipo === "vinculado",
      reincorporado: r.tipo === "reincorporado",
      asignadas,
      // Si la contraseña la escribió la empresa, no se devuelve: ya la conoce.
      claveElegida: r.tipo === "creado" && !r.clave,
      usuario: r.tipo === "creado" ? r.usuario : undefined,
      credenciales: r.tipo === "creado" && r.clave ? [{ nombre: r.nombre, usuario: r.usuario, email: r.usuario, clave: r.clave }] : [],
    });
  }

  /* -------------------------------- Lote -------------------------------- */
  const crudas: Record<string, string>[] =
    parsed.data.filas ??
    (parsed.data.csv ?? "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const [firstName, lastName, documentNumber, email, employeeCode] = l.split(/[;,\t]/).map((s) => s?.trim() ?? "");
        return { firstName, lastName, documentNumber, email, employeeCode };
      });

  if (crudas.length > MAX_FILAS) {
    return NextResponse.json({ error: `Máximo ${MAX_FILAS} trabajadores por carga. Divida el listado en varias partes.` }, { status: 400 });
  }

  let creados = 0;
  let vinculados = 0;
  let omitidos = 0;
  let sinCupo = 0;
  const errores: { fila: number; motivo: string }[] = [];
  const credenciales: { nombre: string; usuario: string; email: string; clave: string }[] = [];
  const enLaEmpresa: string[] = [];

  for (const [i, cruda] of crudas.entries()) {
    // En lote no se aceptan contraseñas escritas: cada persona recibe la suya generada.
    const fila = filaSchema.safeParse({ ...cruda, clave: undefined, pedirCambio: undefined });
    if (!fila.success) {
      omitidos++;
      errores.push({ fila: i + 1, motivo: fila.error.issues[0].message });
      continue;
    }
    // Una fila que falla no detiene el lote: las cuentas ya creadas deben
    // llegar con su contraseña temporal.
    let r: Resultado;
    try {
      r = await crear(fila.data);
    } catch {
      r = { tipo: "error", motivo: "No se pudo procesar esta fila; inténtelo de nuevo" };
    }
    if (r.tipo === "creado") {
      creados++;
      if (r.clave) credenciales.push({ nombre: r.nombre, usuario: r.usuario, email: r.usuario, clave: r.clave });
      enLaEmpresa.push(r.userId);
    } else if (r.tipo === "vinculado" || r.tipo === "reincorporado") {
      vinculados++;
      enLaEmpresa.push(r.userId);
    } else if (r.tipo === "ya_estaba") {
      omitidos++;
      enLaEmpresa.push(r.userId);
    } else if (r.tipo === "sin_cupo") {
      sinCupo++;
      errores.push({ fila: i + 1, motivo: "Sin cupo disponible en el plan" });
    }
    else if (r.tipo === "error") {
      omitidos++;
      errores.push({ fila: i + 1, motivo: r.motivo });
    }
  }

  const asignadas = await asignar(enLaEmpresa);

  await audit({
    userId: user.id,
    actorEmail: user.email,
    action: "crear",
    entity: "company_members",
    entityId: companyId,
    summary: `Carga masiva: ${creados} creados, ${vinculados} vinculados, ${omitidos} omitidos${sinCupo ? `, ${sinCupo} sin cupo` : ""}${asignadas ? `, ${asignadas} cursos asignados` : ""}`,
  });

  return NextResponse.json({
    ok: true,
    creados,
    vinculados,
    omitidos,
    sinCupo,
    asignadas,
    errores,
    ...(sinCupo ? { aviso: `${sinCupo === 1 ? "1 trabajador no se creó" : `${sinCupo} trabajadores no se crearon`} por falta de cupo. ${mensajeSinCupo(cupos)}` } : {}),
    credenciales,
  });
}
