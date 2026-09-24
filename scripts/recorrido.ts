/* eslint-disable no-console */
/**
 * RECORRIDO DE VERIFICACIÓN (solo base de demostración local)
 *
 * Entra con cada cuenta de la demostración, abre todas las páginas que su rol
 * debería ver y confirma que ninguna falle, y que las que no le corresponden
 * lo redirijan. Sirve para revisar la plataforma completa antes de desplegar.
 *
 *   1. npm run dev          (en otra terminal)
 *   2. npm run verificar
 *
 * Usa las cuentas y la contraseña pública de prisma/seed.ts: nunca apunte este
 * script a producción.
 */
import { PrismaClient } from "@prisma/client";

const BASE = process.env.RECORRIDO_URL ?? "http://localhost:3000";
const CLAVE_DEMO = "KgAcademy2026*";
if (!/localhost|127\.0\.0\.1/.test(BASE)) {
  console.error("El recorrido solo se corre contra la demostración local.");
  process.exit(1);
}

const prisma = new PrismaClient();

type Esperado = "ok" | "redirige";
type Caso = { ruta: string; espera: Esperado };

async function entrar(correo: string) {
  const r = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: correo, password: CLAVE_DEMO }),
  });
  const cookie = (r.headers.get("set-cookie") ?? "").split(";")[0];
  if (!r.ok || !cookie) throw new Error(`No se pudo entrar como ${correo} (${r.status})`);
  return cookie;
}

async function abrir(ruta: string, cookie?: string) {
  const r = await fetch(`${BASE}${ruta}`, { headers: cookie ? { cookie } : {}, redirect: "manual" });
  const cuerpo = r.status === 200 ? await r.text() : "";
  // Next responde 200 con la página de error si un componente revienta al dibujar.
  const roto = /Application error|Unhandled Runtime Error|Internal Server Error/.test(cuerpo);
  return { status: r.status, roto, destino: r.headers.get("location") ?? "" };
}

async function main() {
  const [curso, cursoJuego, evaluacion, certificado, miembro] = await Promise.all([
    prisma.course.findFirst({ where: { status: "publicado", modules: { some: { lessons: { some: { contentType: "genially" } } } } } }),
    prisma.course.findFirst({ where: { status: "publicado", modules: { some: { lessons: { some: { contentType: "interactivo" } } } } } }),
    prisma.assessment.findFirst({ where: { type: "final", isPublished: true, course: { status: "publicado" } } }),
    prisma.certificate.findFirst({ include: { user: true } }),
    prisma.companyMember.findFirst({ include: { user: { include: { role: true } } }, where: { user: { role: { code: "estudiante" } } } }),
  ]);
  if (!curso || !cursoJuego || !evaluacion || !certificado || !miembro) {
    throw new Error("Faltan datos de demostración. Corra npm run db:seed.");
  }

  const publicas = ["/", "/catalogo", `/curso/${curso.slug}`, `/curso/${cursoJuego.slug}`, "/verificar", `/verificar/${certificado.code}`, "/ingresar", "/registro", "/recuperar"];
  const aula = ["/aula", "/aula/cursos", `/aula/curso/${curso.slug}`, `/aula/curso/${cursoJuego.slug}`, "/aula/certificados", "/aula/logros", "/aula/notificaciones", "/aula/perfil"];
  const empresa = ["/empresa", "/empresa/trabajadores", `/empresa/trabajadores/${miembro.userId}`, "/empresa/asignar", "/empresa/seguimiento", "/empresa/reportes"];
  const admin = ["/admin", "/admin/usuarios", "/admin/empresas", "/admin/cursos", `/admin/cursos/${curso.id}`, `/admin/cursos/${cursoJuego.id}`, "/admin/evaluaciones", `/admin/evaluaciones/${evaluacion.id}`, "/admin/certificados", "/admin/reportes", "/admin/auditoria", "/admin/permisos", "/admin/configuracion"];

  const ok = (rs: string[]): Caso[] => rs.map((ruta) => ({ ruta, espera: "ok" }));
  const no = (rs: string[]): Caso[] => rs.map((ruta) => ({ ruta, espera: "redirige" }));

  const perfiles: { nombre: string; correo?: string; casos: Caso[] }[] = [
    { nombre: "Visitante", casos: [...ok(publicas), ...no(["/aula", "/empresa", "/admin"])] },
    { nombre: "SuperAdmin KG", correo: "admin@kggestionintegral.com", casos: ok([...admin, ...aula, `/aula/evaluacion/${evaluacion.id}`]) },
    { nombre: "Instructor", correo: "instructor@kggestionintegral.com", casos: [...ok(["/admin/cursos", `/admin/cursos/${curso.id}`, "/admin/evaluaciones"]), ...no(["/admin/usuarios", "/empresa"])] },
    { nombre: "Admin empresa", correo: "rrhh@constructoraandina.com", casos: [...ok(empresa), ...no(["/admin"])] },
    { nombre: "Supervisor", correo: "diana.suarez@constructoraandina.com", casos: [...ok(["/empresa/seguimiento"]), ...no(["/admin"])] },
    { nombre: "Estudiante", correo: "laura.cardenas@constructoraandina.com", casos: [...ok([...aula, `/aula/evaluacion/${evaluacion.id}`]), ...no(["/admin", "/empresa"])] },
  ];

  let fallos = 0;
  for (const p of perfiles) {
    const cookie = p.correo ? await entrar(p.correo) : undefined;
    const malos: string[] = [];
    for (const c of p.casos) {
      const r = await abrir(c.ruta, cookie);
      const bien =
        c.espera === "ok" ? r.status === 200 && !r.roto : r.status >= 300 && r.status < 400;
      if (!bien) malos.push(`${c.ruta} → ${r.status}${r.roto ? " (página de error)" : ""}${r.destino ? ` → ${r.destino}` : ""}`);
    }
    fallos += malos.length;
    console.log(`${malos.length ? "✗" : "✓"} ${p.nombre}: ${p.casos.length - malos.length}/${p.casos.length}`);
    for (const m of malos) console.log(`    ${m}`);
  }

  fallos += await acciones(cursoJuego.id);
  await limpiar();

  await prisma.$disconnect();
  console.log(fallos ? `\n${fallos} problema(s).` : "\nTodo en orden.");
  process.exit(fallos ? 1 : 0);
}

/* ------------------------------------------------------------------------ */
/*  Acciones de punta a punta                                                */
/* ------------------------------------------------------------------------ */

async function llamar(metodo: string, ruta: string, cookie?: string, cuerpo?: unknown) {
  const r = await fetch(`${BASE}${ruta}`, {
    method: metodo,
    headers: { ...(cookie ? { cookie } : {}), ...(cuerpo ? { "Content-Type": "application/json" } : {}) },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    redirect: "manual",
  });
  const texto = await r.text();
  let data: Record<string, unknown> = {};
  try {
    data = JSON.parse(texto);
  } catch {
    /* No es JSON: se conserva el texto. */
  }
  return { status: r.status, data, texto, destino: r.headers.get("location") ?? "" };
}

async function entrarCon(correo: string, clave: string) {
  const r = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: correo, password: clave }),
  });
  const data = (await r.json().catch(() => ({}))) as { redirect?: string; error?: string };
  return { cookie: (r.headers.get("set-cookie") ?? "").split(";")[0], redirect: data.redirect, status: r.status, error: data.error };
}

type Paso = { nombre: string; ok: boolean; detalle?: string };
const lotesCreados: string[] = [];

async function acciones(cursoId: string) {
  const sufijo = Date.now().toString(36);
  const pasos: Paso[] = [];
  const paso = (nombre: string, ok: boolean, detalle?: string) => pasos.push({ nombre, ok, detalle: ok ? undefined : detalle });

  const curso = await prisma.course.findUniqueOrThrow({ where: { id: cursoId } });
  const rrhh = await prisma.user.findUniqueOrThrow({ where: { email: "rrhh@constructoraandina.com" } });
  const companyId = rrhh.companyId!;
  const empresa = await entrar("rrhh@constructoraandina.com");
  const admin = await entrar("admin@kggestionintegral.com");

  // 1. La empresa crea un trabajador con contraseña temporal propia.
  const correo = `recorrido.${sufijo}@demo.test`;
  const alta = await llamar("POST", "/api/empresa/trabajadores", empresa, {
    companyId,
    modo: "individual",
    trabajador: { firstName: "Prueba", lastName: "Recorrido", documentNumber: `RC${sufijo}`, email: correo },
  });
  const cred = (alta.data.credenciales as { clave: string }[] | undefined)?.[0];
  paso("Empresa crea trabajador con clave temporal", alta.status === 200 && !!cred, `${alta.status} ${alta.texto.slice(0, 120)}`);
  if (!cred) return reportar(pasos);
  const trabajador = await prisma.user.findUniqueOrThrow({ where: { email: correo } });

  // 2. Asigna un curso publicado; un borrador se rechaza.
  const asignar = await llamar("POST", "/api/empresa/asignar", empresa, { companyId, courseId: curso.id, userIds: [trabajador.id] });
  paso("Empresa asigna curso publicado", asignar.status === 200 && asignar.data.creadas === 1, `${asignar.status} ${asignar.texto.slice(0, 120)}`);
  if (typeof asignar.data.batchId === "string") lotesCreados.push(asignar.data.batchId);
  const borrador = await prisma.course.findFirst({ where: { status: "borrador" } });
  if (borrador) {
    const r = await llamar("POST", "/api/empresa/asignar", empresa, { companyId, courseId: borrador.id, userIds: [trabajador.id] });
    paso("Empresa no puede asignar un borrador", r.status === 409, `${r.status}`);
  }

  // 3. Primer ingreso: queda encerrado en /cambiar-clave hasta cambiarla.
  const primero = await entrarCon(correo, cred.clave);
  paso("Primer ingreso lleva a cambiar la contraseña", primero.redirect === "/cambiar-clave", `${primero.status} ${primero.redirect}`);
  const bloqueado = await llamar("GET", "/aula", primero.cookie);
  paso("Con clave temporal no puede entrar al aula", bloqueado.status >= 300 && bloqueado.destino.includes("/cambiar-clave"), `${bloqueado.status} ${bloqueado.destino}`);
  const nuevaClave = `Recorrido-${sufijo}-Nueva`;
  const cambio = await llamar("POST", "/api/auth/clave", primero.cookie, { actual: cred.clave, nueva: nuevaClave });
  paso("Cambia la clave y la cuenta queda activa", cambio.status === 200 && cambio.data.activada === true && cambio.data.destino === "/aula", `${cambio.status} ${cambio.texto.slice(0, 120)}`);
  const reingreso = await entrarCon(correo, nuevaClave);
  const sesion = reingreso.cookie;
  paso("Entra con la contraseña nueva", !!sesion && reingreso.status === 200, `${reingreso.status} ${reingreso.error ?? ""}`);
  const misCursos = await llamar("GET", "/aula/cursos", sesion);
  paso("Ve el curso asignado en Mis cursos", misCursos.status === 200 && misCursos.texto.includes(curso.title), `${misCursos.status} ${misCursos.destino} cookie=${sesion ? "sí" : "no"}`);

  // 4. Estudia, presenta la evaluación final y recibe certificado.
  const enrollment = await prisma.enrollment.findUniqueOrThrow({ where: { userId_courseId: { userId: trabajador.id, courseId: curso.id } } });
  const lecciones = await prisma.lesson.findMany({ where: { module: { courseId: curso.id } } });
  const final = await prisma.assessment.findFirstOrThrow({
    where: { courseId: curso.id, type: "final" },
    include: { questions: { include: { question: { include: { options: true } } } } },
  });
  const respuestas = final.questions.map((q) => ({ questionId: q.questionId, optionId: q.question.options.find((o) => o.isCorrect)!.id }));
  const temprano = await llamar("POST", "/api/aula/evaluacion", sesion, { assessmentId: final.id, answers: respuestas });
  paso("La evaluación final no se abre antes de terminar las lecciones", temprano.status === 409, `${temprano.status}`);
  let leccionesOk = true;
  for (const l of lecciones) {
    const r = await llamar("POST", "/api/aula/leccion", sesion, { enrollmentId: enrollment.id, lessonId: l.id, completed: true, addSeconds: 60 });
    leccionesOk &&= r.status === 200;
  }
  paso(`Completa las ${lecciones.length} lecciones`, leccionesOk);
  const examen = await llamar("POST", "/api/aula/evaluacion", sesion, { assessmentId: final.id, answers: respuestas });
  paso("Aprueba la evaluación final", examen.status === 200 && examen.data.passed === true, `${examen.status} ${examen.texto.slice(0, 120)}`);
  const cert = await prisma.certificate.findUnique({ where: { enrollmentId: enrollment.id } });
  paso("Al completar lecciones y examen recibe certificado", !!cert);
  if (cert) {
    const v = await llamar("GET", `/verificar/${cert.code}`);
    paso("El certificado se verifica públicamente", v.status === 200 && v.texto.includes("Recorrido"), `${v.status}`);
    const rev = await llamar("PATCH", "/api/admin/certificado", admin, { certificateId: cert.id, accion: "revocar", motivo: "Prueba del recorrido" });
    const v2 = await llamar("GET", `/verificar/${cert.code}`);
    paso("KG revoca el certificado y la verificación lo muestra", rev.status === 200 && v2.texto.includes("Certificado revocado"), `${rev.status} ${rev.texto.slice(0, 80)}`);
  }

  // 4b. El trabajador edita su perfil; la empresa le restablece la contraseña.
  const perfil = await llamar("PATCH", "/api/aula/perfil", sesion, { phone: "3000000000", city: "Tunja" });
  const editado = await prisma.user.findUniqueOrThrow({ where: { id: trabajador.id } });
  paso("El trabajador edita sus datos de contacto", perfil.status === 200 && editado.phone === "3000000000" && editado.city === "Tunja", `${perfil.status}`);
  const reset = await llamar("POST", "/api/empresa/trabajadores/clave", empresa, { userId: trabajador.id });
  const temporal = reset.data.claveTemporal as string | undefined;
  const tras = temporal ? await entrarCon(correo, temporal) : null;
  paso("La empresa restablece la contraseña y obliga a cambiarla", reset.status === 200 && tras?.redirect === "/cambiar-clave", `${reset.status} ${tras?.redirect ?? ""}`);
  const ajeno = await prisma.user.findFirstOrThrow({ where: { role: { code: "admin_empresa" } } });
  const prohibido = await llamar("POST", "/api/empresa/trabajadores/clave", empresa, { userId: ajeno.id });
  paso("La empresa no puede restablecer la de un administrador", prohibido.status === 400 || prohibido.status === 403, `${prohibido.status}`);

  // 5. Reporte de la empresa en CSV.
  const rep = await fetch(`${BASE}/api/empresa/reporte?tipo=seguimiento`, { headers: { cookie: empresa } });
  const csv = await rep.text();
  paso("Empresa descarga el reporte de seguimiento", rep.status === 200 && csv.includes(correo), `${rep.status} ${rep.headers.get("content-type")}`);

  // 6. KG crea un usuario con clave temporal.
  const u = await llamar("POST", "/api/admin/usuario", admin, { firstName: "Usuario", lastName: "Recorrido", email: `usuario.${sufijo}@demo.test`, roleCode: "estudiante" });
  paso("KG crea un usuario con clave temporal", u.status === 200 && typeof u.data.claveTemporal === "string", `${u.status} ${u.texto.slice(0, 120)}`);
  if (typeof u.data.userId === "string") {
    await prisma.user.update({ where: { id: u.data.userId }, data: { status: "activo" } });
    const r = await llamar("PATCH", "/api/admin/usuario", admin, { userId: u.data.userId, accion: "restablecer_clave" });
    const tras = await prisma.user.findUniqueOrThrow({ where: { id: u.data.userId } });
    paso("KG restablece una contraseña y la cuenta queda obligada a cambiarla", r.status === 200 && tras.status === "pendiente_activacion", `${r.status} ${tras.status}`);
  }

  // 7. No se publica un curso que exige evaluación final sin tenerla.
  const cat = await prisma.category.findFirstOrThrow();
  const nuevo = await llamar("POST", "/api/admin/cursos", admin, { code: `KG-RC-${sufijo.toUpperCase().slice(-5)}`, title: `Curso recorrido ${sufijo}`, categoryId: cat.id, durationHours: 1 });
  const nuevoId = nuevo.data.courseId as string | undefined;
  if (nuevoId) {
    const pub = await llamar("POST", "/api/admin/curso", admin, { courseId: nuevoId, status: "publicado" });
    paso("No deja publicar un curso sin evaluación final", pub.status === 400, `${pub.status}`);
  } else paso("KG crea un curso", false, `${nuevo.status} ${nuevo.texto.slice(0, 120)}`);

  // 8. Registro propio (estudiante independiente).
  const reg = await llamar("POST", "/api/auth/register", undefined, {
    firstName: "Registro",
    lastName: "Recorrido",
    email: `registro.${sufijo}@demo.test`,
    password: `Registro-${sufijo}-Clave`,
    acceptedTerms: true,
  });
  paso("Registro propio de estudiante", reg.status === 200, `${reg.status} ${reg.texto.slice(0, 120)}`);

  return reportar(pasos);
}

/** Borra lo que creó el recorrido, para que la demostración quede como estaba. */
async function limpiar() {
  const usuarios = await prisma.user.findMany({ where: { email: { endsWith: "@demo.test" } }, select: { id: true } });
  const ids = usuarios.map((u) => u.id);
  const cursos = await prisma.course.findMany({ where: { code: { startsWith: "KG-RC-" } }, select: { id: true } });
  const idsCursos = cursos.map((c) => c.id);
  await prisma.$transaction([
    prisma.auditLog.deleteMany({ where: { OR: [{ userId: { in: ids } }, { entityId: { in: [...ids, ...idsCursos] } }, { actorEmail: { endsWith: "@demo.test" } }] } }),
    prisma.attemptAnswer.deleteMany({ where: { attempt: { userId: { in: ids } } } }),
    prisma.certificate.deleteMany({ where: { userId: { in: ids } } }),
    prisma.pointsLedger.deleteMany({ where: { userId: { in: ids } } }),
    prisma.user.deleteMany({ where: { id: { in: ids } } }),
    prisma.assignmentBatch.deleteMany({ where: { id: { in: lotesCreados } } }),
    prisma.course.deleteMany({ where: { id: { in: idsCursos } } }),
  ]);
}

function reportar(pasos: Paso[]) {
  const malos = pasos.filter((p) => !p.ok);
  console.log(`${malos.length ? "✗" : "✓"} Acciones de punta a punta: ${pasos.length - malos.length}/${pasos.length}`);
  for (const p of pasos) console.log(`    ${p.ok ? "✓" : "✗"} ${p.nombre}${p.detalle ? ` — ${p.detalle}` : ""}`);
  return malos.length;
}

main().catch(async (e) => {
  console.error(e instanceof Error ? e.message : e);
  await prisma.$disconnect();
  process.exit(1);
});
