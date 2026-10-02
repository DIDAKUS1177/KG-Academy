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
import { readdir, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { leccionInteractivaSchema } from "../src/lib/leccion-interactiva";

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
    // Curso de juego: todas sus lecciones son interactivas (el Básico mezcla Genially e interactivas).
    prisma.course.findFirst({
      where: {
        status: "publicado",
        modules: { some: { lessons: { some: { contentType: "interactivo" } } } },
        NOT: { modules: { some: { lessons: { some: { contentType: { not: "interactivo" } } } } } },
      },
    }),
    prisma.assessment.findFirst({ where: { type: "final", isPublished: true, course: { status: "publicado" } } }),
    prisma.certificate.findFirst({ include: { user: true } }),
    prisma.companyMember.findFirst({ include: { user: { include: { role: true } } }, where: { user: { role: { code: "estudiante" } } } }),
  ]);
  if (!curso || !cursoJuego || !evaluacion || !certificado || !miembro) {
    throw new Error("Faltan datos de demostración. Corra npm run db:seed.");
  }

  const publicas = ["/", "/catalogo", `/curso/${curso.slug}`, `/curso/${cursoJuego.slug}`, "/verificar", `/verificar/${certificado.code}`, "/ingresar", "/registro", "/recuperar"];
  const aula = ["/aula", "/aula/cursos", `/aula/curso/${curso.slug}`, `/aula/curso/${cursoJuego.slug}`, "/aula/certificados", "/aula/logros", "/aula/notificaciones", "/aula/perfil"];
  const empresa = ["/empresa", "/empresa/trabajadores", `/empresa/trabajadores/${miembro.userId}`, "/empresa/asignar", "/empresa/seguimiento", "/empresa/reportes", "/empresa/reportes/informe"];
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

  fallos += await catalogo();

  // El ciclo completo con un curso de juego y con uno de Genially.
  fallos += await acciones(cursoJuego.id);
  fallos += await acciones(curso.id);
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

type Paso = { nombre: string; ok: boolean; detalle?: string; curso?: string };
const lotesCreados: string[] = [];
const INICIO = new Date();

async function acciones(cursoId: string) {
  const sufijo = Date.now().toString(36);
  const pasos: Paso[] = [];
  const paso = (nombre: string, ok: boolean, detalle?: string) => pasos.push({ nombre, ok, detalle: ok ? undefined : detalle });

  const curso = await prisma.course.findUniqueOrThrow({ where: { id: cursoId } });
  pasos.push({ nombre: `Curso: ${curso.title}`, ok: true, curso: curso.code });
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
  const vieja = await llamar("GET", "/aula", primero.cookie);
  paso("Cambiar la contraseña anula las sesiones anteriores", vieja.status >= 300 && vieja.destino.includes("/ingresar"), `${vieja.status} ${vieja.destino}`);
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

  // Lección de otro curso y tiempo inflado.
  const otra = await prisma.lesson.findFirstOrThrow({ where: { module: { courseId: { not: curso.id } }, isPublished: true } });
  const ajena = await llamar("POST", "/api/aula/leccion", sesion, { enrollmentId: enrollment.id, lessonId: otra.id, completed: true });
  paso("No registra lecciones de otro curso", ajena.status === 404, `${ajena.status}`);
  const antesT = await prisma.lessonProgress.findFirstOrThrow({ where: { enrollmentId: enrollment.id, lessonId: lecciones[0].id } });
  await llamar("POST", "/api/aula/leccion", sesion, { enrollmentId: enrollment.id, lessonId: lecciones[0].id, addSeconds: 999999 });
  const despuesT = await prisma.lessonProgress.findFirstOrThrow({ where: { enrollmentId: enrollment.id, lessonId: lecciones[0].id } });
  paso("El tiempo de estudio no se puede inflar", despuesT.timeSpentSec - antesT.timeSpentSec <= 7200, `${despuesT.timeSpentSec - antesT.timeSpentSec} s`);

  // Tiempo límite controlado por el servidor.
  const sinAbrir = await llamar("POST", "/api/aula/evaluacion", sesion, { assessmentId: final.id, answers: respuestas });
  paso("No se entrega una evaluación con tiempo límite sin abrirla", !final.timeLimitMin || sinAbrir.status === 409, `${sinAbrir.status}`);
  const abierto = await llamar("POST", "/api/aula/evaluacion/iniciar", sesion, { assessmentId: final.id });
  if (final.timeLimitMin && typeof abierto.data.attemptId === "string") {
    await prisma.assessmentAttempt.update({ where: { id: abierto.data.attemptId }, data: { startedAt: new Date(Date.now() - (final.timeLimitMin + 10) * 60_000) } });
    const tarde = await llamar("POST", "/api/aula/evaluacion", sesion, { assessmentId: final.id, answers: respuestas });
    const gastados = await prisma.assessmentAttempt.count({ where: { enrollmentId: enrollment.id, status: "finalizado" } });
    paso("Una entrega fuera de tiempo no se califica ni gasta intento", tarde.status === 409 && gastados === 0, `${tarde.status} intentos=${gastados}`);
  }
  const reabierto = await llamar("POST", "/api/aula/evaluacion/iniciar", sesion, { assessmentId: final.id });
  paso("Abre el intento de la evaluación final", reabierto.status === 200, `${reabierto.status} ${reabierto.data.error ?? ""}`);
  const examen = await llamar("POST", "/api/aula/evaluacion", sesion, { assessmentId: final.id, answers: respuestas });
  paso("Aprueba la evaluación final", examen.status === 200 && examen.data.passed === true, `${examen.status} ${examen.texto.slice(0, 120)}`);
  const puntosAntes = await prisma.pointsLedger.count({ where: { userId: trabajador.id } });
  const otraVez = await llamar("POST", "/api/aula/evaluacion/iniciar", sesion, { assessmentId: final.id });
  const reenvio = await llamar("POST", "/api/aula/evaluacion", sesion, { assessmentId: final.id, answers: respuestas });
  const puntosDespues = await prisma.pointsLedger.count({ where: { userId: trabajador.id } });
  paso("Después de aprobar no se puede volver a presentar ni sumar puntos", otraVez.status === 409 && reenvio.status === 409 && puntosAntes === puntosDespues, `${otraVez.status} ${reenvio.status}`);
  const cert = await prisma.certificate.findUnique({ where: { enrollmentId: enrollment.id } });
  paso("Al completar lecciones y examen recibe certificado", !!cert);
  if (cert) paso("El certificado lleva las horas del curso", cert.hours === curso.durationHours, `${cert.hours} vs ${curso.durationHours}`);
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
  const descargas: [string, string][] = [["indicadores", "Cobertura de capacitación"], ["evaluaciones", "Nota"], ["lecciones", "Leccion"], ["cursos", curso.code], ["trabajadores", correo], ["certificados", "Codigo"]];
  const malas: string[] = [];
  for (const [tipo, debeTener] of descargas) {
    const d = await fetch(`${BASE}/api/empresa/reporte?tipo=${tipo}`, { headers: { cookie: empresa } });
    const texto = await d.text();
    if (d.status !== 200 || !texto.includes(debeTener)) malas.push(`${tipo} ${d.status}`);
  }
  paso("Empresa descarga indicadores, evaluaciones, avance por lección, programa, nómina y certificados", malas.length === 0, malas.join(", "));
  const informe = await llamar("GET", "/empresa/reportes/informe", empresa);
  paso("Empresa abre el informe imprimible de capacitación", informe.status === 200 && informe.texto.includes("Informe de capacitación") && informe.texto.includes(curso.title) && informe.texto.includes("Indicadores de gestión"), `${informe.status}`);
  const panel = await llamar("GET", "/empresa", empresa);
  paso("El panel de la empresa muestra los indicadores con semáforo", panel.status === 200 && panel.texto.includes("Indicadores de gestión") && panel.texto.includes("Cumplimiento dentro del plazo"), `${panel.status}`);

  // 5b. Cupos: sin cupo libre no se crean ni vinculan trabajadores.
  const suscripcion = await prisma.companySubscription.findFirstOrThrow({ where: { companyId, status: "activa" }, orderBy: { startsAt: "desc" } });
  const ocupados = await prisma.companyMember.count({ where: { companyId, status: { not: "retirado" }, user: { role: { code: { in: ["estudiante", "supervisor"] } } } } });
  await prisma.companySubscription.update({ where: { id: suscripcion.id }, data: { seats: ocupados } });
  try {
    const lleno = await llamar("POST", "/api/empresa/trabajadores", empresa, {
      companyId,
      modo: "individual",
      trabajador: { firstName: "Sin", lastName: "Cupo", documentNumber: `SC${sufijo}`, email: `sincupo.${sufijo}@demo.test` },
    });
    const masivo = await llamar("POST", "/api/empresa/trabajadores", empresa, {
      companyId,
      modo: "masivo",
      csv: `Sin;Cupo;SM${sufijo};sincupo2.${sufijo}@demo.test`,
    });
    const creadoIgual = await prisma.user.count({ where: { email: { in: [`sincupo.${sufijo}@demo.test`, `sincupo2.${sufijo}@demo.test`] } } });
    paso("Sin cupos no se crean trabajadores (ni de a uno ni en carga masiva)", lleno.status === 409 && masivo.data.sinCupo === 1 && creadoIgual === 0, `${lleno.status} ${masivo.texto.slice(0, 80)}`);
  } finally {
    await prisma.companySubscription.update({ where: { id: suscripcion.id }, data: { seats: suscripcion.seats } });
  }

  // 5c. Alta versátil: sin correo, área/cargo/sede nuevas, supervisor, fila inválida y cursos en el mismo paso.
  const docSinCorreo = `RCDOC${sufijo}`.toUpperCase();
  const lote = await llamar("POST", "/api/empresa/trabajadores", empresa, {
    companyId,
    modo: "masivo",
    cursos: [curso.id],
    filas: [
      { firstName: "Sin", lastName: "Correo", documentNumber: docSinCorreo, area: `Recorrido área ${sufijo}`, cargo: `Recorrido cargo ${sufijo}`, sede: `Recorrido sede ${sufijo}` },
      { firstName: "Super", lastName: "Visor", email: `supervisor.${sufijo}@demo.test`, rol: "supervisor" },
      { firstName: "Mal", lastName: "Correo", email: "no-es-un-correo" },
    ],
  });
  const sinCorreo = await prisma.user.findUnique({
    where: { documentNumber: docSinCorreo },
    include: { memberships: { include: { area: true, position: true, location: true } }, enrollments: true },
  });
  const supervisor = await prisma.user.findUnique({ where: { email: `supervisor.${sufijo}@demo.test` }, include: { role: true, enrollments: true } });
  const vinculo = sinCorreo?.memberships[0];
  paso(
    "Carga masiva con persona sin correo, área/cargo/sede nuevas, supervisor y una fila inválida",
    lote.status === 200 && lote.data.creados === 2 && (lote.data.errores as unknown[]).length === 1 &&
      vinculo?.area?.name === `Recorrido área ${sufijo}` && vinculo?.position?.name === `Recorrido cargo ${sufijo}` &&
      vinculo?.location?.name === `Recorrido sede ${sufijo}` && supervisor?.role.code === "supervisor",
    `${lote.status} ${lote.texto.slice(0, 160)}`
  );
  paso(
    "Los cursos elegidos se asignan en el mismo paso",
    !!sinCorreo?.enrollments.some((e) => e.courseId === curso.id) && !!supervisor?.enrollments.some((e) => e.courseId === curso.id),
    `${lote.data.asignadas}`
  );
  const credencial = (lote.data.credenciales as { usuario: string; clave: string }[] | undefined)?.find((c) => c.usuario === docSinCorreo);
  const porDocumento = credencial ? await entrarCon(docSinCorreo, credencial.clave) : null;
  paso("Quien no tiene correo ingresa con su número de documento", porDocumento?.redirect === "/cambiar-clave", `${porDocumento?.status ?? "sin credencial"}`);

  // 5d. Correcciones de la revisión previa al despliegue.
  if (sinCorreo) {
    await prisma.companyMember.updateMany({ where: { companyId, userId: sinCorreo.id }, data: { status: "retirado" } });
    const retirado = await llamar("POST", "/api/empresa/trabajadores", empresa, {
      companyId,
      modo: "masivo",
      cursos: [curso.id],
      filas: [{ firstName: "Sin", lastName: "Correo", documentNumber: docSinCorreo }],
    });
    const errorRetirado = (retirado.data.errores as { motivo: string }[] | undefined)?.[0]?.motivo ?? "";
    paso("A una persona retirada no la reactiva la empresa por su cuenta", retirado.status === 200 && errorRetirado.includes("retirada"), errorRetirado || retirado.texto.slice(0, 100));
  }
  const formula = await llamar("POST", "/api/empresa/trabajadores", empresa, {
    companyId,
    modo: "individual",
    cursos: [curso.id],
    dueDate: "2030-01-15",
    trabajador: { firstName: "=HYPERLINK(1)", lastName: "Formula", documentNumber: `RF${sufijo}`, email: `formula.${sufijo}@demo.test` },
  });
  const nomina = await (await fetch(`${BASE}/api/empresa/reporte?tipo=trabajadores`, { headers: { cookie: empresa } })).text();
  paso("Los CSV neutralizan fórmulas de Excel en los nombres", formula.status === 200 && nomina.includes("'=HYPERLINK(1)") && !nomina.includes(";=HYPERLINK"), `${formula.status}`);
  const asignacionFecha = await prisma.courseAssignment.findFirst({ where: { user: { email: `formula.${sufijo}@demo.test` }, courseId: curso.id } });
  paso("La fecha límite vale hasta el final del día en Colombia", asignacionFecha?.dueDate?.toISOString() === "2030-01-16T04:59:59.999Z", asignacionFecha?.dueDate?.toISOString() ?? "sin asignación");
  const interno = await llamar("POST", "/api/auth/register", undefined, {
    firstName: "Intruso",
    lastName: "Interno",
    email: `doc.${sufijo}@sin-correo.invalid`,
    password: `Registro-${sufijo}-Clave`,
    acceptedTerms: true,
  });
  paso("Nadie se registra con un correo interno de las cuentas sin correo", interno.status === 400, `${interno.status}`);

  // 6. KG crea un usuario con clave temporal.
  const u = await llamar("POST", "/api/admin/usuario", admin, { firstName: "Usuario", lastName: "Recorrido", email: `usuario.${sufijo}@demo.test`, roleCode: "estudiante" });
  paso("KG crea un usuario con clave temporal", u.status === 200 && typeof u.data.claveTemporal === "string", `${u.status} ${u.texto.slice(0, 120)}`);
  if (typeof u.data.userId === "string") {
    await prisma.user.update({ where: { id: u.data.userId }, data: { status: "activo" } });
    const r = await llamar("PATCH", "/api/admin/usuario", admin, { userId: u.data.userId, accion: "restablecer_clave" });
    const tras = await prisma.user.findUniqueOrThrow({ where: { id: u.data.userId } });
    paso("KG restablece una contraseña y la cuenta queda obligada a cambiarla", r.status === 200 && tras.status === "pendiente_activacion", `${r.status} ${tras.status}`);
    // Ya entró una vez (sesión y auditoría) y tiene un curso matriculado sin empezar.
    const nuevaTemporal = r.data.claveTemporal as string | undefined;
    if (nuevaTemporal) await entrarCon(`usuario.${sufijo}@demo.test`, nuevaTemporal);
    await prisma.enrollment.create({ data: { userId: u.data.userId, courseId: cursoId } });
    const borrar = await llamar("DELETE", "/api/admin/usuario", admin, { userId: u.data.userId });
    const sigue = await prisma.user.findUnique({ where: { id: u.data.userId } });
    const huellas = await prisma.auditLog.count({ where: { entity: "users", entityId: u.data.userId, action: "eliminar" } });
    paso("KG elimina una cuenta sin historial (queda en la auditoría)", borrar.status === 200 && !sigue && huellas === 1, `${borrar.status} ${borrar.texto.slice(0, 80)}`);
  }
  const conHistorial = await llamar("DELETE", "/api/admin/usuario", admin, { userId: trabajador.id });
  paso("No se elimina una cuenta con evaluaciones o certificados", conHistorial.status === 409, `${conHistorial.status}`);
  const yo = await prisma.user.findUniqueOrThrow({ where: { email: "admin@kggestionintegral.com" } });
  const propia = await llamar("DELETE", "/api/admin/usuario", admin, { userId: yo.id });
  paso("KG no puede eliminar su propia cuenta", propia.status === 400, `${propia.status}`);

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
  const empresaDemo = await prisma.company.findUniqueOrThrow({ where: { id: companyId } });
  const conNit = await llamar("POST", "/api/auth/register", undefined, {
    firstName: "Intruso",
    lastName: "Recorrido",
    email: `intruso.${sufijo}@demo.test`,
    password: `Intruso-${sufijo}-Clave`,
    companyNit: empresaDemo.nit,
    acceptedTerms: true,
  });
  const intruso = await prisma.user.findUnique({ where: { email: `intruso.${sufijo}@demo.test` } });
  paso("Registrarse con el NIT de una empresa no lo vincula a ella", conNit.status === 200 && intruso?.companyId === null, `${conNit.status} ${intruso?.companyId}`);
  const debil = await llamar("POST", "/api/auth/register", undefined, { firstName: "Debil", lastName: "Recorrido", email: `debil.${sufijo}@demo.test`, password: "12345678", acceptedTerms: true });
  paso("El registro rechaza contraseñas débiles", debil.status === 400, `${debil.status}`);
  if (intruso) {
    const ajenoAsig = await llamar("POST", "/api/empresa/asignar", empresa, { companyId, courseId: curso.id, userIds: [intruso.id] });
    paso("La empresa no puede asignar cursos a personas de fuera", ajenoAsig.status === 403, `${ajenoAsig.status}`);
  }
  const kgAdmin = await prisma.user.findUniqueOrThrow({ where: { email: "admin@kggestionintegral.com" } });
  const robo = await llamar("POST", "/api/empresa/trabajadores", empresa, { companyId, modo: "individual", trabajador: { firstName: "Otra", lastName: "Persona", documentNumber: "", email: kgAdmin.email } });
  const kgAdminDespues = await prisma.user.findUniqueOrThrow({ where: { id: kgAdmin.id } });
  paso("La empresa no puede apropiarse de una cuenta ajena", robo.status === 409 && kgAdminDespues.companyId === kgAdmin.companyId, `${robo.status}`);

  // 9b. La empresa elimina trabajadores suyos sin historial, y nada más.
  const correoBorrar = `borrar.${sufijo}@demo.test`;
  await llamar("POST", "/api/empresa/trabajadores", empresa, {
    companyId,
    modo: "individual",
    trabajador: { firstName: "Borrar", lastName: "Recorrido", documentNumber: `RB${sufijo}`, email: correoBorrar },
  });
  const aBorrar = await prisma.user.findUnique({ where: { email: correoBorrar } });
  if (aBorrar) {
    const ficha = await llamar("GET", `/empresa/trabajadores/${aBorrar.id}`, empresa);
    const baja = await llamar("DELETE", "/api/empresa/trabajadores/cuenta", empresa, { userId: aBorrar.id });
    const queda = await prisma.user.findUnique({ where: { id: aBorrar.id } });
    paso("La empresa elimina un trabajador sin historial", ficha.texto.includes("Eliminar cuenta") && baja.status === 200 && !queda, `${baja.status} ${baja.texto.slice(0, 80)}`);
  } else paso("La empresa elimina un trabajador sin historial", false, "no se creó el trabajador");
  const fichaConHistorial = await llamar("GET", `/empresa/trabajadores/${trabajador.id}`, empresa);
  const bajaConHistorial = await llamar("DELETE", "/api/empresa/trabajadores/cuenta", empresa, { userId: trabajador.id });
  paso("La empresa no elimina un trabajador con historial", !fichaConHistorial.texto.includes("Eliminar cuenta") && bajaConHistorial.status === 409, `${bajaConHistorial.status}`);
  const bajaAdmin = await llamar("DELETE", "/api/empresa/trabajadores/cuenta", empresa, { userId: kgAdmin.id });
  const bajaAjeno = intruso ? await llamar("DELETE", "/api/empresa/trabajadores/cuenta", empresa, { userId: intruso.id }) : null;
  paso("La empresa no elimina a KG ni a personas de fuera", bajaAdmin.status === 403 && (!bajaAjeno || bajaAjeno.status === 403), `${bajaAdmin.status} ${bajaAjeno?.status ?? ""}`);

  // 8b. Recuperación de contraseña con código enviado al correo.
  const correoReg = `registro.${sufijo}@demo.test`;
  let claveReg = `Registro-${sufijo}-Clave`;
  const pedir = () => llamar("POST", "/api/auth/recuperar", undefined, { email: correoReg });
  const p1 = await pedir();
  const codigo = await ultimoCodigo(correoReg);
  paso("Recuperación: llega un código de 6 dígitos al correo", p1.status === 200 && !!codigo, `${p1.status} correos=${await contarCorreos(correoReg)} buzón=${BUZON}`);
  const inexistente = await llamar("POST", "/api/auth/recuperar", undefined, { email: `nadie.${sufijo}@demo.test` });
  paso("Recuperación: no revela si el correo existe", inexistente.status === 200 && inexistente.data.mensaje === p1.data.mensaje, `${inexistente.status}`);
  if (codigo) {
    const malo = await llamar("POST", "/api/auth/recuperar/confirmar", undefined, { email: correoReg, codigo: codigo === "000000" ? "111111" : "000000", nueva: `Otra-${sufijo}-Clave` });
    paso("Recuperación: un código errado se rechaza y descuenta intentos", malo.status === 400 && /quedan/i.test(String(malo.data.error)), `${malo.status} ${malo.data.error}`);
    const nueva = `Recuperada-${sufijo}-Clave`;
    const bien = await llamar("POST", "/api/auth/recuperar/confirmar", undefined, { email: correoReg, codigo, nueva });
    const entra = await entrarCon(correoReg, nueva);
    paso("Recuperación: con el código define la contraseña nueva y entra", bien.status === 200 && entra.status === 200 && !!entra.cookie, `${bien.status} ${bien.data.error ?? ""} / login ${entra.status}`);
    if (entra.status === 200) claveReg = nueva;
    const reuso = await llamar("POST", "/api/auth/recuperar/confirmar", undefined, { email: correoReg, codigo, nueva: `Tercera-${sufijo}-Clave` });
    paso("Recuperación: el código no sirve dos veces", reuso.status === 400, `${reuso.status}`);
    for (let i = 0; i < 3; i++) await pedir();
    const antes = await contarCorreos(correoReg);
    await pedir();
    paso("Recuperación: limita cuántos códigos se piden seguidos", (await contarCorreos(correoReg)) === antes, `${antes}`);
  }

  // 9. Sin inscribirse en nada, el aula le muestra qué puede empezar; los
  //    borradores solo los ve el equipo de KG, que además los abre como estudiante.
  const b2c = (await entrarCon(correoReg, claveReg)).cookie;
  const publicado = await prisma.course.findFirstOrThrow({ where: { status: "publicado" } });
  const enBorrador = await prisma.course.findFirst({ where: { status: "borrador", code: { not: { startsWith: "KG-RC-" } } } });
  const vistaB2c = await llamar("GET", "/aula/cursos", b2c);
  paso("Un estudiante nuevo ve los cursos disponibles", vistaB2c.status === 200 && vistaB2c.texto.includes("Cursos disponibles") && vistaB2c.texto.includes(publicado.title), `${vistaB2c.status}`);
  if (enBorrador) {
    paso("Un estudiante no ve los borradores", !vistaB2c.texto.includes(enBorrador.title));
    const vistaAdmin = await llamar("GET", "/aula/cursos", admin);
    paso("KG ve los borradores en el aula para revisarlos", vistaAdmin.texto.includes(enBorrador.title) && vistaAdmin.texto.includes("Borrador · solo KG"));
    const abrir = await llamar("GET", `/aula/curso/${enBorrador.slug}`, admin);
    paso("KG abre un borrador como estudiante", abrir.status === 200, `${abrir.status}`);
  }
  const menu = await llamar("GET", "/admin", admin);
  paso("El panel de KG tiene acceso al aula", menu.texto.includes('href="/aula/cursos"'));

  // 10. Cerrar sesión la anula de verdad, y se frena la fuerza bruta.
  const s2 = (await entrarCon(correoReg, claveReg)).cookie;
  await llamar("POST", "/api/auth/logout", s2);
  const trasSalir = await llamar("GET", "/aula", s2);
  paso("Cerrar sesión anula la sesión aunque se conserve la cookie", trasSalir.status >= 300 && trasSalir.destino.includes("/ingresar"), `${trasSalir.status} ${trasSalir.destino}`);
  const victima = `usuario.${sufijo}@demo.test`;
  for (let i = 0; i < 8; i++) await entrarCon(victima, `mala-${i}-${sufijo}`);
  const bloqueo = await entrarCon(victima, `mala-final-${sufijo}`);
  paso("Tras varios intentos fallidos se bloquea el ingreso", bloqueo.status === 429, `${bloqueo.status} ${bloqueo.error ?? ""}`);

  return reportar(pasos);
}

/* ---- Buzón de correos de desarrollo (src/lib/correo.ts escribe ahí) ---- */
const BUZON = path.join(process.cwd(), ".correos-dev");
async function correosPara(correo: string) {
  const archivos = await readdir(BUZON).catch(() => [] as string[]);
  return archivos.filter((a) => a.endsWith(`-${correo}.json`)).sort();
}
async function contarCorreos(correo: string) {
  return (await correosPara(correo)).length;
}
async function ultimoCodigo(correo: string) {
  // La carpeta del proyecto está en OneDrive: el archivo puede tardar un
  // instante en aparecer para otro proceso.
  let lista = await correosPara(correo);
  for (let i = 0; i < 15 && !lista.length; i++) {
    await new Promise((r) => setTimeout(r, 200));
    lista = await correosPara(correo);
  }
  if (!lista.length) return null;
  const c = JSON.parse(await readFile(path.join(BUZON, lista[lista.length - 1]), "utf8")) as { asunto: string };
  return c.asunto.match(/\b(\d{6})\b/)?.[1] ?? null;
}

/** Borra lo que creó el recorrido, para que la demostración quede como estaba. */
/** Cada curso tiene su examen final y todas sus lecciones interactivas se pueden abrir. */
async function catalogo() {
  const cursos = await prisma.course.findMany({
    where: { code: { not: { startsWith: "KG-RC-" } } },
    include: {
      modules: { include: { lessons: true } },
      assessments: { where: { type: "final", isPublished: true }, include: { _count: { select: { questions: true } } } },
    },
    orderBy: { code: "asc" },
  });
  const pasos: { nombre: string; ok: boolean; detalle?: string }[] = [];
  const sinExamen = cursos.filter((c) => !c.assessments.some((a) => a._count.questions >= 10));
  pasos.push({ nombre: "Todos los cursos tienen evaluación final (10 preguntas o más)", ok: sinExamen.length === 0, detalle: sinExamen.map((c) => c.code).join(", ") });
  const pendientes = cursos.filter((c) => c.modules.some((m) => m.lessons.some((l) => l.contentType === "pendiente")));
  pasos.push({ nombre: "Ningún curso tiene lecciones sin contenido", ok: pendientes.length === 0, detalle: pendientes.map((c) => c.code).join(", ") });
  const basico = cursos.find((c) => c.code === "KG-PA-001");
  pasos.push({ nombre: "El Curso Básico tiene sus 7 módulos", ok: basico?.modules.length === 7, detalle: `${basico?.modules.length ?? 0} módulos` });
  const rotas: string[] = [];
  for (const c of cursos) {
    for (const m of c.modules) {
      for (const l of m.lessons) {
        if (l.contentType !== "interactivo") continue;
        let json: unknown = null;
        try {
          json = JSON.parse(l.contentBody ?? "");
        } catch {
          /* se reporta abajo */
        }
        if (!leccionInteractivaSchema.safeParse(json).success) rotas.push(`${c.code} · ${l.title}`);
      }
    }
  }
  pasos.push({ nombre: "Todas las lecciones interactivas son válidas", ok: rotas.length === 0, detalle: rotas.join("; ") });

  const malos = pasos.filter((p) => !p.ok);
  console.log(`${malos.length ? "✗" : "✓"} Catálogo: ${pasos.length - malos.length}/${pasos.length}`);
  for (const p of pasos) console.log(`    ${p.ok ? "✓" : "✗"} ${p.nombre}${p.ok || !p.detalle ? "" : ` (${p.detalle})`}`);
  return malos.length;
}

async function limpiar() {
  const usuarios = await prisma.user.findMany({
    where: { OR: [{ email: { endsWith: "@demo.test" } }, { email: { endsWith: "@sin-correo.invalid" }, documentNumber: { startsWith: "RCDOC" } }] },
    select: { id: true },
  });
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
    prisma.assignmentBatch.deleteMany({ where: { name: { startsWith: "Alta de trabajadores" }, createdAt: { gte: INICIO } } }),
    prisma.area.deleteMany({ where: { name: { startsWith: "Recorrido " } } }),
    prisma.position.deleteMany({ where: { name: { startsWith: "Recorrido " } } }),
    prisma.companyLocation.deleteMany({ where: { name: { startsWith: "Recorrido " } } }),
  ]);
  for (const a of await readdir(BUZON).catch(() => [] as string[])) {
    if (a.includes("@demo.test")) await rm(path.join(BUZON, a), { force: true });
  }
}

function reportar(pasos: Paso[]) {
  const malos = pasos.filter((p) => !p.ok);
  console.log(`${malos.length ? "✗" : "✓"} Acciones de punta a punta (${pasos[0]?.curso ?? ""}): ${pasos.length - malos.length}/${pasos.length}`);
  for (const p of pasos) console.log(`    ${p.ok ? "✓" : "✗"} ${p.nombre}${p.detalle ? ` — ${p.detalle}` : ""}`);
  return malos.length;
}

main().catch(async (e) => {
  console.error(e instanceof Error ? e.message : e);
  await prisma.$disconnect();
  process.exit(1);
});
