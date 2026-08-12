/* eslint-disable no-console */
/**
 * KG ACADEMY - Semilla de la base de datos
 * Crea: roles, permisos, configuracion, plantilla de certificado, categorias,
 * los TRES primeros cursos (estructura lista / contenido pendiente),
 * banco de preguntas de ejemplo, una empresa demo con trabajadores,
 * asignaciones y avances para poder revisar todos los paneles.
 *
 * Autor del desarrollo: Diego Alejandro Hernandez Blanco
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import QRCode from "qrcode";

const prisma = new PrismaClient();
const PASS = "KgAcademy2026*";

const MODULES_PERMISOS = [
  "usuarios", "empresas", "cursos", "evaluaciones",
  "certificados", "reportes", "pagos", "configuracion", "auditoria",
];
const ACCIONES = ["ver", "crear", "editar", "eliminar", "publicar", "exportar", "revocar", "asignar"];

const ROLES = [
  { code: "superadmin", name: "SuperAdmin KG", scope: "plataforma", description: "Acceso total a la plataforma." },
  { code: "admin_kg", name: "Administrador KG", scope: "plataforma", description: "Gestion operativa segun permisos asignados." },
  { code: "instructor", name: "Instructor", scope: "plataforma", description: "Crea y edita sus cursos y contenidos." },
  { code: "admin_empresa", name: "Administrador de empresa", scope: "empresa", description: "Gestiona trabajadores, asigna cursos y consulta cumplimiento." },
  { code: "supervisor", name: "Supervisor", scope: "empresa", description: "Consulta trabajadores y areas autorizadas." },
  { code: "estudiante", name: "Estudiante / Trabajador", scope: "empresa", description: "Realiza cursos, evaluaciones y descarga certificados." },
];

/* ------------------------------------------------------------------ */
/*  ESTRUCTURA DE LOS TRES PRIMEROS CURSOS                             */
/*  El contenido (video / PDF / Genially) queda PENDIENTE a proposito. */
/* ------------------------------------------------------------------ */
const CURSOS = [
  {
    code: "KG-PA-001",
    slug: "primeros-auxilios-basicos",
    title: "Primeros Auxilios Basicos",
    subtitle: "Actue con criterio en el primer minuto: valoracion de la escena, RCP, hemorragias y traslado seguro.",
    objective:
      "Formar al participante para identificar una emergencia, activar la cadena de supervivencia y aplicar tecnicas basicas de primeros auxilios de forma segura para la victima y para si mismo.",
    targetAudience:
      "Trabajadores de cualquier sector, brigadistas, integrantes del COPASST y publico general.",
    requirements: "No requiere conocimientos previos. Se recomienda computador o celular con internet.",
    methodology:
      "100% virtual asincronico. Lecciones cortas, recursos descargables, evaluacion diagnostica, evaluaciones por modulo y evaluacion final.",
    level: "basico",
    durationHours: 20,
    price: 149000,
    status: "publicado",
    accessType: "pago",
    launch: "22 de agosto de 2026",
    modules: [
      {
        title: "Modulo 1. Fundamentos y bioseguridad",
        description: "Marco normativo, principios de actuacion y proteccion del auxiliador.",
        lessons: [
          "Bienvenida al curso y como estudiar en KG Academy",
          "Que son los primeros auxilios y hasta donde llega mi actuacion",
          "Marco legal en Colombia y responsabilidad del auxiliador",
          "Bioseguridad y elementos de proteccion personal",
        ],
      },
      {
        title: "Modulo 2. Valoracion de la escena y de la victima",
        description: "Seguridad de la escena, valoracion primaria y secundaria, activacion del SEM.",
        lessons: [
          "Seguridad de la escena: primero yo, luego la victima",
          "Valoracion primaria: consciencia, via aerea, respiracion y circulacion",
          "Valoracion secundaria y toma de signos vitales",
          "Como activar el sistema de emergencias medicas",
        ],
      },
      {
        title: "Modulo 3. Reanimacion cardiopulmonar (RCP) y OVACE",
        description: "Cadena de supervivencia, RCP en adultos y manejo de la obstruccion de via aerea.",
        lessons: [
          "Cadena de supervivencia",
          "RCP de alta calidad en el adulto",
          "Uso del DEA paso a paso",
          "Obstruccion de la via aerea por cuerpo extrano (OVACE)",
        ],
      },
      {
        title: "Modulo 4. Urgencias frecuentes en el trabajo",
        description: "Hemorragias, quemaduras, fracturas, convulsiones y movilizacion de lesionados.",
        lessons: [
          "Control de hemorragias y manejo del shock",
          "Quemaduras y lesiones por calor o electricidad",
          "Fracturas, esguinces e inmovilizacion",
          "Convulsiones, desmayos y emergencias medicas comunes",
          "Movilizacion y traslado seguro del lesionado",
        ],
      },
    ],
  },
  {
    code: "KG-PA-002",
    slug: "primeros-auxilios-pediatricos",
    title: "Primeros Auxilios Pediatricos",
    subtitle: "Lactantes y ninos: valoracion, RCP pediatrica, atragantamiento, fiebre y accidentes en el hogar.",
    objective:
      "Capacitar al participante en la atencion inicial de emergencias en lactantes y ninos, reconociendo las diferencias anatomicas y fisiologicas frente al adulto.",
    targetAudience:
      "Padres, cuidadores, docentes, personal de jardines infantiles y trabajadores con poblacion infantil a cargo.",
    requirements: "Se recomienda haber cursado Primeros Auxilios Basicos.",
    methodology: "100% virtual asincronico con casos clinicos guiados y evaluacion final.",
    level: "intermedio",
    durationHours: 16,
    price: 169000,
    status: "borrador",
    accessType: "pago",
    launch: "Finales de agosto de 2026",
    modules: [
      {
        title: "Modulo 1. El paciente pediatrico es diferente",
        description: "Diferencias anatomicas y fisiologicas, triangulo de evaluacion pediatrica.",
        lessons: [
          "Lactante, nino y adolescente: por que cambia la atencion",
          "Triangulo de evaluacion pediatrica",
          "Signos de alarma que exigen traslado inmediato",
        ],
      },
      {
        title: "Modulo 2. RCP y OVACE pediatrico",
        description: "Reanimacion en lactantes y ninos, desobstruccion de via aerea.",
        lessons: [
          "RCP en el lactante",
          "RCP en el nino",
          "Atragantamiento en menores de 1 ano",
          "Atragantamiento en mayores de 1 ano",
        ],
      },
      {
        title: "Modulo 3. Urgencias frecuentes en la infancia",
        description: "Fiebre, convulsion febril, intoxicaciones, quemaduras y caidas.",
        lessons: [
          "Fiebre y convulsion febril",
          "Intoxicaciones y consumo accidental de sustancias",
          "Quemaduras y caidas en el hogar",
          "Crisis respiratoria y alergias",
        ],
      },
      {
        title: "Modulo 4. Prevencion de accidentes",
        description: "Entorno seguro en casa, colegio y jardin infantil.",
        lessons: [
          "Mapa de riesgos en el hogar",
          "Entorno seguro en instituciones educativas",
          "Botiquin pediatrico y plan familiar de emergencia",
        ],
      },
    ],
  },
  {
    code: "KG-PA-003",
    slug: "primeros-auxilios-psicologicos",
    title: "Primeros Auxilios Psicologicos",
    subtitle: "Contencion emocional en crisis: escucha activa, modelo ABCDE y cuidado de quien ayuda.",
    objective:
      "Entregar herramientas practicas de contencion emocional para acompanar a una persona en crisis dentro del entorno laboral, respetando sus limites y los del auxiliador.",
    targetAudience:
      "Lideres de equipo, talento humano, brigadistas, COPASST y responsables del SG-SST.",
    requirements: "No requiere formacion previa en salud mental.",
    methodology: "100% virtual asincronico con simulaciones de dialogo y evaluacion final.",
    level: "basico",
    durationHours: 12,
    price: 139000,
    status: "borrador",
    accessType: "pago",
    launch: "Finales de agosto de 2026",
    modules: [
      {
        title: "Modulo 1. Crisis y reaccion humana",
        description: "Que es una crisis, respuestas normales ante eventos anormales.",
        lessons: [
          "Que son los primeros auxilios psicologicos",
          "Reacciones esperadas ante un evento critico",
          "Cuando derivar a un profesional de salud mental",
        ],
      },
      {
        title: "Modulo 2. Modelo ABCDE de intervencion",
        description: "Escucha activa, ventilacion emocional, categorizacion de necesidades y derivacion.",
        lessons: [
          "A y B: escucha activa y ventilacion emocional",
          "C y D: categorizacion de necesidades y derivacion",
          "E: psicoeducacion y cierre del acompanamiento",
        ],
      },
      {
        title: "Modulo 3. Comunicacion en situaciones dificiles",
        description: "Que decir, que no decir, comunicacion de malas noticias.",
        lessons: [
          "Frases que ayudan y frases que danan",
          "Comunicacion de malas noticias en el entorno laboral",
          "Acompanamiento a companeros tras un accidente de trabajo",
        ],
      },
      {
        title: "Modulo 4. Cuidado del que cuida",
        description: "Fatiga por compasion, autocuidado y riesgo psicosocial.",
        lessons: [
          "Fatiga por compasion y desgaste emocional",
          "Estrategias de autocuidado del auxiliador",
          "Articulacion con el sistema de riesgo psicosocial de la empresa",
        ],
      },
    ],
  },
];

/** Banco de preguntas de EJEMPLO. KG debe reemplazarlo por el oficial de cada curso. */
const PREGUNTAS_EJEMPLO = [
  {
    statement: "Cual es la PRIMERA accion al llegar al lugar de una emergencia?",
    explanation: "Antes de atender se debe garantizar que la escena sea segura para el auxiliador.",
    options: [
      { text: "Verificar que la escena sea segura", ok: true },
      { text: "Iniciar compresiones toracicas de inmediato", ok: false },
      { text: "Buscar el botiquin", ok: false },
      { text: "Mover a la victima a otro lugar", ok: false },
    ],
  },
  {
    statement: "Cual es la frecuencia recomendada de compresiones en la RCP del adulto?",
    explanation: "La recomendacion internacional es de 100 a 120 compresiones por minuto.",
    options: [
      { text: "60 a 80 por minuto", ok: false },
      { text: "100 a 120 por minuto", ok: true },
      { text: "140 a 160 por minuto", ok: false },
      { text: "Segun la fuerza del auxiliador", ok: false },
    ],
  },
  {
    statement: "Ante una hemorragia externa abundante, la medida inicial es:",
    explanation: "La presion directa sobre la herida es la primera medida de control.",
    options: [
      { text: "Aplicar torniquete de inmediato", ok: false },
      { text: "Lavar la herida con abundante agua", ok: false },
      { text: "Presion directa sobre la herida", ok: true },
      { text: "Aplicar hielo directamente", ok: false },
    ],
  },
  {
    statement: "El uso de guantes durante la atencion corresponde a:",
    explanation: "Es una medida de bioseguridad que protege al auxiliador y a la victima.",
    options: [
      { text: "Una recomendacion opcional", ok: false },
      { text: "Una medida de bioseguridad obligatoria", ok: true },
      { text: "Solo aplica en centros medicos", ok: false },
      { text: "Solo si hay sangre visible", ok: false },
    ],
  },
  {
    statement: "El auxiliador debe realizar procedimientos medicos avanzados si sabe hacerlos.",
    type: "verdadero_falso",
    explanation: "El auxiliador actua dentro de sus competencias y activa el sistema de emergencias.",
    options: [
      { text: "Verdadero", ok: false },
      { text: "Falso", ok: true },
    ],
  },
  {
    statement: "Cual de los siguientes es un signo de alarma que exige traslado inmediato?",
    explanation: "La alteracion del estado de conciencia siempre es un signo de alarma.",
    options: [
      { text: "Alteracion del estado de conciencia", ok: true },
      { text: "Rubor leve en la piel", ok: false },
      { text: "Sudoracion despues de ejercicio", ok: false },
      { text: "Sed", ok: false },
    ],
  },
];

async function main() {
  console.log("Limpiando base de datos...");
  // Orden inverso de dependencias
  await prisma.$transaction([
    prisma.attemptAnswer.deleteMany(),
    prisma.assessmentAttempt.deleteMany(),
    prisma.assessmentQuestion.deleteMany(),
    prisma.questionOption.deleteMany(),
    prisma.question.deleteMany(),
    prisma.questionBank.deleteMany(),
    prisma.assessment.deleteMany(),
    prisma.certificate.deleteMany(),
    prisma.lessonProgress.deleteMany(),
    prisma.moduleProgress.deleteMany(),
    prisma.enrollment.deleteMany(),
    prisma.courseAssignment.deleteMany(),
    prisma.assignmentBatch.deleteMany(),
    prisma.lessonResource.deleteMany(),
    prisma.lesson.deleteMany(),
    prisma.module.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.coupon.deleteMany(),
    prisma.course.deleteMany(),
    prisma.category.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.notificationTemplate.deleteMany(),
    prisma.userBadge.deleteMany(),
    prisma.badge.deleteMany(),
    prisma.pointsLedger.deleteMany(),
    prisma.streak.deleteMany(),
    prisma.auditLog.deleteMany(),
    prisma.session.deleteMany(),
    prisma.passwordResetToken.deleteMany(),
    prisma.companyMember.deleteMany(),
    prisma.companySubscription.deleteMany(),
    prisma.area.deleteMany(),
    prisma.position.deleteMany(),
    prisma.companyLocation.deleteMany(),
    prisma.user.deleteMany(),
    prisma.company.deleteMany(),
    prisma.plan.deleteMany(),
    prisma.rolePermission.deleteMany(),
    prisma.permission.deleteMany(),
    prisma.role.deleteMany(),
    prisma.certificateTemplate.deleteMany(),
    prisma.systemSetting.deleteMany(),
  ]);

  /* ----------------------------- ROLES Y PERMISOS ---------------------------- */
  console.log("Creando roles y permisos...");
  const roles: Record<string, string> = {};
  for (const r of ROLES) {
    const created = await prisma.role.create({ data: r });
    roles[r.code] = created.id;
  }

  const permIds: string[] = [];
  for (const m of MODULES_PERMISOS) {
    for (const a of ACCIONES) {
      const p = await prisma.permission.create({
        data: { code: `${m}.${a}`, module: m, action: a, description: `${a} en ${m}` },
      });
      permIds.push(p.id);
    }
  }
  // SuperAdmin: todos los permisos
  await prisma.rolePermission.createMany({
    data: permIds.map((permissionId) => ({ roleId: roles.superadmin, permissionId })),
  });

  /* --------------------------- CONFIGURACION GENERAL -------------------------- */
  console.log("Creando configuracion y plantillas...");
  await prisma.systemSetting.createMany({
    data: [
      { key: "marca.nombre", value: "KG Academy", group: "marca", label: "Nombre de la plataforma" },
      { key: "marca.empresa", value: "KG GESTION INTEGRAL S.A.S.", group: "marca", label: "Razon social" },
      { key: "marca.color_primario", value: "#0A2D4D", group: "marca", label: "Color primario" },
      { key: "marca.color_secundario", value: "#8FBF16", group: "marca", label: "Color secundario" },
      { key: "certificados.prefijo", value: "KG", group: "certificados", label: "Prefijo del codigo" },
      { key: "certificados.firmante", value: "Katerine Guanarita", group: "certificados", label: "Firma autorizada" },
      { key: "certificados.cargo_firmante", value: "Directora - KG Gestion Integral S.A.S.", group: "certificados", label: "Cargo del firmante" },
      { key: "seguridad.min_password", value: "8", type: "number", group: "seguridad", label: "Longitud minima de contrasena" },
      { key: "seguridad.sesion_horas", value: "8", type: "number", group: "seguridad", label: "Duracion de la sesion (horas)" },
      { key: "general.desarrollador", value: "Diego Alejandro Hernandez Blanco", group: "general", label: "Desarrollado por" },
    ],
  });

  const template = await prisma.certificateTemplate.create({
    data: {
      name: "Plantilla oficial KG",
      description: "Diseno horizontal con identidad KG Gestion Integral S.A.S.",
      orientation: "horizontal",
      signerName: "Katerine Guanarita",
      signerTitle: "Directora - KG Gestion Integral S.A.S.",
      bodyTemplate:
        "Certifica que {{estudiante}} identificado(a) con documento {{documento}} curso y aprobo satisfactoriamente el programa {{curso}}, con una intensidad de {{horas}} horas.",
      isDefault: true,
    },
  });

  await prisma.notificationTemplate.createMany({
    data: [
      { code: "bienvenida", name: "Bienvenida", channel: "email", subject: "Bienvenido a KG Academy", body: "Hola {{nombre}}, su cuenta fue creada." },
      { code: "curso_asignado", name: "Curso asignado", channel: "email", subject: "Le asignaron un curso", body: "Su empresa le asigno el curso {{curso}}. Fecha limite: {{fecha}}." },
      { code: "recordatorio", name: "Recordatorio de curso pendiente", channel: "email", subject: "Tiene un curso pendiente", body: "Recuerde completar {{curso}}." },
      { code: "por_vencer", name: "Curso proximo a vencer", channel: "email", subject: "Su curso esta por vencer", body: "Le quedan {{dias}} dias para completar {{curso}}." },
      { code: "curso_completado", name: "Curso completado", channel: "interna", subject: "Curso completado", body: "Felicitaciones, completo {{curso}}." },
      { code: "certificado_listo", name: "Certificado disponible", channel: "email", subject: "Su certificado esta listo", body: "Descargue su certificado {{codigo}}." },
      { code: "reset_password", name: "Recuperacion de contrasena", channel: "email", subject: "Restablecer contrasena", body: "Use este enlace: {{enlace}}" },
    ],
  });

  await prisma.badge.createMany({
    data: [
      { code: "primer_paso", name: "Primer paso", description: "Completo su primera leccion", criteria: "1 leccion completada", points: 10 },
      { code: "constante", name: "Constante", description: "Racha de 3 dias seguidos", criteria: "Racha >= 3 dias", points: 30 },
      { code: "certificado_1", name: "Certificado obtenido", description: "Obtuvo su primer certificado", criteria: "1 certificado emitido", points: 100 },
      { code: "brigadista", name: "Brigadista KG", description: "Completo los tres cursos de primeros auxilios", criteria: "3 cursos completados", points: 300 },
      { code: "evaluador", name: "Nota perfecta", description: "Obtuvo 100 en una evaluacion final", criteria: "score = 100", points: 50 },
    ],
  });

  /* ------------------------------- CATEGORIAS ------------------------------- */
  const catPA = await prisma.category.create({
    data: {
      slug: "primeros-auxilios",
      name: "Primeros Auxilios",
      description: "Atencion inicial de emergencias en el entorno laboral, familiar y comunitario.",
      icon: "heart",
      color: "#8FBF16",
      order: 1,
    },
  });
  await prisma.category.createMany({
    data: [
      { slug: "sst", name: "Seguridad y Salud en el Trabajo", description: "SG-SST, riesgos, COPASST y normatividad.", icon: "shield", color: "#0A2D4D", order: 2 },
      { slug: "riesgo-psicosocial", name: "Riesgo Psicosocial", description: "Bienestar mental y clima laboral.", icon: "spark", color: "#1B4A73", order: 3 },
      { slug: "analitica", name: "Business Analytics", description: "Indicadores y analitica aplicada a la gestion.", icon: "chart", color: "#759F11", order: 4 },
    ],
  });

  /* -------------------------------- USUARIOS -------------------------------- */
  console.log("Creando usuarios...");
  const hash = await bcrypt.hash(PASS, 10);

  const superadmin = await prisma.user.create({
    data: {
      email: "admin@kggestionintegral.com",
      passwordHash: hash,
      firstName: "Katerine",
      lastName: "Guanarita",
      documentType: "CC",
      documentNumber: "1010101010",
      jobTitle: "Directora General",
      city: "Bogota D.C.",
      roleId: roles.superadmin,
      status: "activo",
      emailVerified: true,
      acceptedTerms: true,
      acceptedDataAt: new Date(),
    },
  });

  const instructor = await prisma.user.create({
    data: {
      email: "instructor@kggestionintegral.com",
      passwordHash: hash,
      firstName: "Diego Alejandro",
      lastName: "Hernandez Blanco",
      documentType: "CC",
      documentNumber: "1020304050",
      jobTitle: "Instructor y desarrollador de la plataforma",
      city: "Bogota D.C.",
      roleId: roles.instructor,
      status: "activo",
      emailVerified: true,
      acceptedTerms: true,
      acceptedDataAt: new Date(),
    },
  });

  /* ------------------------------ PLAN Y EMPRESA ----------------------------- */
  const planPro = await prisma.plan.create({
    data: {
      code: "empresarial_pro",
      name: "Empresarial Pro",
      description: "Hasta 100 trabajadores, catalogo completo y reportes exportables.",
      maxUsers: 100,
      pricePerMonth: 890000,
      pricePerUser: 0,
      features: JSON.stringify(["Catalogo completo", "Asignacion masiva", "Reportes Excel/CSV", "Certificados ilimitados"]),
    },
  });
  await prisma.plan.createMany({
    data: [
      { code: "empresarial_basico", name: "Empresarial Basico", description: "Hasta 25 trabajadores.", maxUsers: 25, pricePerMonth: 320000 },
      { code: "personalizado", name: "Plan personalizado", description: "Cotizacion a la medida segun numero de sedes y cursos.", pricePerMonth: 0 },
    ],
  });

  const empresa = await prisma.company.create({
    data: {
      nit: "901234567-1",
      legalName: "CONSTRUCTORA ANDINA S.A.S.",
      tradeName: "Constructora Andina",
      economicSector: "Construccion",
      arl: "ARL Positiva",
      riskLevel: "V",
      contactName: "Marcela Ruiz",
      contactEmail: "rrhh@constructoraandina.com",
      contactPhone: "3001234567",
      city: "Bogota D.C.",
      address: "Calle 100 # 15-20",
      status: "activa",
    },
  });

  await prisma.companySubscription.create({
    data: { companyId: empresa.id, planId: planPro.id, seats: 100, status: "activa" },
  });

  const sedes = await Promise.all([
    prisma.companyLocation.create({ data: { companyId: empresa.id, name: "Sede Principal Bogota", city: "Bogota D.C." } }),
    prisma.companyLocation.create({ data: { companyId: empresa.id, name: "Obra Chia", city: "Chia" } }),
  ]);
  const areas = await Promise.all([
    prisma.area.create({ data: { companyId: empresa.id, name: "Operaciones", code: "OPE" } }),
    prisma.area.create({ data: { companyId: empresa.id, name: "Mantenimiento", code: "MTO" } }),
    prisma.area.create({ data: { companyId: empresa.id, name: "Administrativa", code: "ADM" } }),
  ]);
  const cargos = await Promise.all([
    prisma.position.create({ data: { companyId: empresa.id, name: "Oficial de obra", riskLevel: "V" } }),
    prisma.position.create({ data: { companyId: empresa.id, name: "Tecnico de mantenimiento", riskLevel: "IV" } }),
    prisma.position.create({ data: { companyId: empresa.id, name: "Analista administrativo", riskLevel: "I" } }),
    prisma.position.create({ data: { companyId: empresa.id, name: "Supervisor HSE", riskLevel: "III" } }),
  ]);

  const adminEmpresa = await prisma.user.create({
    data: {
      email: "rrhh@constructoraandina.com",
      passwordHash: hash,
      firstName: "Marcela",
      lastName: "Ruiz Osorio",
      documentType: "CC",
      documentNumber: "52987654",
      jobTitle: "Jefe de Talento Humano",
      roleId: roles.admin_empresa,
      companyId: empresa.id,
      status: "activo",
      emailVerified: true,
      acceptedTerms: true,
      acceptedDataAt: new Date(),
    },
  });
  await prisma.companyMember.create({
    data: { companyId: empresa.id, userId: adminEmpresa.id, areaId: areas[2].id, positionId: cargos[2].id, locationId: sedes[0].id, employeeCode: "ADM-001" },
  });

  const TRABAJADORES = [
    { first: "Laura Sofia", last: "Cardenas Rojas", doc: "1023456789", area: 0, cargo: 0, sede: 0, code: "OPE-101" },
    { first: "Jhon Fredy", last: "Ramirez Peña", doc: "1023456790", area: 1, cargo: 1, sede: 1, code: "MTO-102" },
    { first: "Sandra Milena", last: "Molina Vargas", doc: "1023456791", area: 2, cargo: 2, sede: 0, code: "ADM-103" },
    { first: "Carlos Andres", last: "Pineda Gomez", doc: "1023456792", area: 0, cargo: 0, sede: 1, code: "OPE-104" },
    { first: "Diana Patricia", last: "Suarez Leon", doc: "1023456793", area: 1, cargo: 3, sede: 0, code: "HSE-105", supervisor: true },
    { first: "Julian Esteban", last: "Torres Mora", doc: "1023456794", area: 0, cargo: 0, sede: 1, code: "OPE-106" },
    { first: "Angela Maria", last: "Beltran Nino", doc: "1023456795", area: 2, cargo: 2, sede: 0, code: "ADM-107" },
    { first: "Oscar Ivan", last: "Castillo Ruiz", doc: "1023456796", area: 1, cargo: 1, sede: 1, code: "MTO-108" },
  ];

  const trabajadores = [];
  for (const t of TRABAJADORES) {
    const email = `${t.first.split(" ")[0].toLowerCase()}.${t.last.split(" ")[0].toLowerCase()}@constructoraandina.com`
      .replace(/ñ/g, "n")
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");
    const u = await prisma.user.create({
      data: {
        email,
        passwordHash: hash,
        firstName: t.first,
        lastName: t.last,
        documentType: "CC",
        documentNumber: t.doc,
        jobTitle: cargos[t.cargo].name,
        roleId: t.supervisor ? roles.supervisor : roles.estudiante,
        companyId: empresa.id,
        status: "activo",
        emailVerified: true,
        acceptedTerms: true,
        acceptedDataAt: new Date(),
      },
    });
    await prisma.companyMember.create({
      data: {
        companyId: empresa.id,
        userId: u.id,
        areaId: areas[t.area].id,
        positionId: cargos[t.cargo].id,
        locationId: sedes[t.sede].id,
        employeeCode: t.code,
        isSupervisor: !!t.supervisor,
      },
    });
    trabajadores.push(u);
  }

  // Estudiante B2C independiente
  await prisma.user.create({
    data: {
      email: "estudiante@correo.com",
      passwordHash: hash,
      firstName: "Andres",
      lastName: "Gomez Silva",
      documentType: "CC",
      documentNumber: "80123456",
      jobTitle: "Independiente",
      roleId: roles.estudiante,
      status: "activo",
      emailVerified: true,
      acceptedTerms: true,
      acceptedDataAt: new Date(),
    },
  });

  /* --------------------------------- CURSOS --------------------------------- */
  console.log("Creando los tres cursos...");
  const cursosCreados = [];

  for (const c of CURSOS) {
    const course = await prisma.course.create({
      data: {
        code: c.code,
        slug: c.slug,
        title: c.title,
        subtitle: c.subtitle,
        description: `${c.objective}\n\nLanzamiento previsto: ${c.launch}.`,
        objective: c.objective,
        targetAudience: c.targetAudience,
        requirements: c.requirements,
        methodology: c.methodology,
        level: c.level,
        modality: "virtual",
        durationHours: c.durationHours,
        categoryId: catPA.id,
        instructorId: instructor.id,
        status: c.status,
        // Modelo comercial: la plataforma se vende como servicio (suscripcion por
        // empresa), no curso por curso. Los campos price/discountPrice se conservan
        // en el modelo por si KG habilita venta B2C directa en la Fase 2.
        accessType: "plan_empresarial",
        price: 0,
        progressRule: "obligatorios",
        minPassingScore: 80,
        maxAttempts: 3,
        requiresFinalExam: true,
        requiresAllLessons: true,
        certificateEnabled: true,
        certificateValidityMonths: 24,
        publishedAt: c.status === "publicado" ? new Date() : null,
      },
    });

    const pesoModulo = 100 / c.modules.length;
    for (const [mi, m] of c.modules.entries()) {
      const mod = await prisma.module.create({
        data: {
          courseId: course.id,
          title: m.title,
          description: m.description,
          order: mi + 1,
          weight: pesoModulo,
          isRequired: true,
          isPublished: c.status === "publicado",
        },
      });
      const pesoLeccion = pesoModulo / m.lessons.length;
      for (const [li, title] of m.lessons.entries()) {
        await prisma.lesson.create({
          data: {
            moduleId: mod.id,
            title,
            description: null,
            order: li + 1,
            contentType: "pendiente", // <- ESPACIO RESERVADO PARA EL CONTENIDO DE KG
            contentUrl: null,
            durationMin: 12,
            isRequired: true,
            isPreview: mi === 0 && li === 0,
            weight: pesoLeccion,
            completionRule: "manual",
            isPublished: c.status === "publicado",
          },
        });
      }
    }

    /* --------------------- Banco de preguntas y evaluaciones ------------------- */
    const bank = await prisma.questionBank.create({
      data: {
        name: `Banco de preguntas - ${c.title}`,
        description: "Banco de EJEMPLO. Debe ser reemplazado por el banco oficial de KG.",
        courseId: course.id,
        topic: "primeros auxilios",
      },
    });

    const questionIds: string[] = [];
    for (const q of PREGUNTAS_EJEMPLO) {
      const created = await prisma.question.create({
        data: {
          bankId: bank.id,
          type: q.type ?? "unica",
          statement: q.statement,
          explanation: q.explanation,
          difficulty: "media",
          points: 1,
          options: {
            create: q.options.map((o, i) => ({ text: o.text, isCorrect: o.ok, order: i + 1 })),
          },
        },
      });
      questionIds.push(created.id);
    }

    const diagnostica = await prisma.assessment.create({
      data: {
        courseId: course.id,
        title: "Evaluacion diagnostica",
        description: "Mide su conocimiento previo. No afecta la aprobacion del curso.",
        type: "diagnostica",
        minScore: 0,
        maxAttempts: 1,
        isRequired: false,
        isPublished: true,
        order: 0,
        showFeedback: true,
      },
    });
    const finalEval = await prisma.assessment.create({
      data: {
        courseId: course.id,
        title: "Evaluacion final",
        description: "Evaluacion de cierre. Nota minima aprobatoria 80/100.",
        type: "final",
        minScore: 80,
        maxAttempts: 3,
        timeLimitMin: 30,
        isRequired: true,
        isPublished: true,
        order: 99,
        showFeedback: true,
        showCorrectAnswers: true,
      },
    });

    for (const [i, qid] of questionIds.entries()) {
      await prisma.assessmentQuestion.create({
        data: { assessmentId: diagnostica.id, questionId: qid, order: i + 1, points: 1 },
      });
      await prisma.assessmentQuestion.create({
        data: { assessmentId: finalEval.id, questionId: qid, order: i + 1, points: 1 },
      });
    }

    cursosCreados.push({ course, finalEval });
  }

  /* --------------------- ASIGNACIONES, AVANCE Y CERTIFICADO ------------------- */
  console.log("Creando asignaciones y avances demo...");
  const cursoBasico = cursosCreados[0];
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 21);

  const batch = await prisma.assignmentBatch.create({
    data: {
      companyId: empresa.id,
      courseId: cursoBasico.course.id,
      createdById: adminEmpresa.id,
      name: "Capacitacion obligatoria brigada 2026",
      dueDate,
      totalTargets: trabajadores.length,
      notes: "Asignacion masiva inicial para la brigada de emergencias.",
    },
  });

  const lessons = await prisma.lesson.findMany({
    where: { module: { courseId: cursoBasico.course.id } },
    orderBy: [{ module: { order: "asc" } }, { order: "asc" }],
  });

  // Distribucion de avance: 0%, 100%, 35%, 0%, 70%, 100%, 15%, 0%
  const AVANCES = [0, 1, 0.35, 0, 0.7, 1, 0.15, 0];

  for (const [i, t] of trabajadores.entries()) {
    const assignment = await prisma.courseAssignment.create({
      data: {
        companyId: empresa.id,
        courseId: cursoBasico.course.id,
        userId: t.id,
        batchId: batch.id,
        assignedById: adminEmpresa.id,
        isMandatory: true,
        dueDate,
        notifiedAt: new Date(),
        status: "asignado",
      },
    });

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: t.id,
        courseId: cursoBasico.course.id,
        origin: "asignacion_empresa",
        assignmentId: assignment.id,
        status: "no_iniciado",
      },
    });

    await prisma.notification.create({
      data: {
        userId: t.id,
        title: "Nuevo curso asignado",
        message: `Su empresa le asigno el curso "${cursoBasico.course.title}". Fecha limite: ${dueDate.toLocaleDateString("es-CO")}.`,
        linkUrl: `/aula/curso/${cursoBasico.course.slug}`,
        type: "info",
      },
    });

    const ratio = AVANCES[i] ?? 0;
    if (ratio === 0) continue;

    const hasta = Math.max(1, Math.round(lessons.length * ratio));
    for (let li = 0; li < hasta; li++) {
      await prisma.lessonProgress.create({
        data: {
          enrollmentId: enrollment.id,
          lessonId: lessons[li].id,
          userId: t.id,
          status: "completado",
          percent: 100,
          timeSpentSec: 600 + li * 30,
          views: 1,
          startedAt: new Date(),
          completedAt: new Date(),
        },
      });
      await prisma.pointsLedger.create({
        data: { userId: t.id, points: 10, reason: "leccion_completada", refType: "leccion", refId: lessons[li].id },
      });
    }

    const progress = Math.round((hasta / lessons.length) * 1000) / 10;
    const completo = ratio === 1;

    // Intento de evaluacion final para quienes terminaron
    if (completo) {
      const preguntas = await prisma.assessmentQuestion.findMany({
        where: { assessmentId: cursoBasico.finalEval.id },
        include: { question: { include: { options: true } } },
        orderBy: { order: "asc" },
      });
      const attempt = await prisma.assessmentAttempt.create({
        data: {
          assessmentId: cursoBasico.finalEval.id,
          enrollmentId: enrollment.id,
          userId: t.id,
          attemptNo: 1,
          totalCount: preguntas.length,
          correctCount: preguntas.length,
          score: 100,
          passed: true,
          status: "finalizado",
          submittedAt: new Date(),
          durationSec: 640,
        },
      });
      for (const aq of preguntas) {
        const correcta = aq.question.options.find((o) => o.isCorrect);
        await prisma.attemptAnswer.create({
          data: {
            attemptId: attempt.id,
            questionId: aq.questionId,
            optionId: correcta?.id,
            isCorrect: true,
            points: 1,
          },
        });
      }
    }

    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progress,
        status: completo ? "completado" : "en_progreso",
        startedAt: new Date(),
        lastAccessAt: new Date(),
        completedAt: completo ? new Date() : null,
        finalScore: completo ? 100 : null,
        timeSpentSec: hasta * 620,
      },
    });
    await prisma.courseAssignment.update({
      where: { id: assignment.id },
      data: { status: completo ? "completado" : "en_progreso" },
    });

    // Estado de modulos
    const mods = await prisma.module.findMany({
      where: { courseId: cursoBasico.course.id },
      include: { lessons: true },
      orderBy: { order: "asc" },
    });
    const completadas = new Set(lessons.slice(0, hasta).map((l) => l.id));
    for (const m of mods) {
      const done = m.lessons.filter((l) => completadas.has(l.id)).length;
      await prisma.moduleProgress.create({
        data: {
          enrollmentId: enrollment.id,
          moduleId: m.id,
          userId: t.id,
          status: done === m.lessons.length ? "completado" : done > 0 ? "en_progreso" : "no_iniciado",
          progress: (done / m.lessons.length) * 100,
          startedAt: done > 0 ? new Date() : null,
          completedAt: done === m.lessons.length ? new Date() : null,
        },
      });
    }

    // Certificado para quienes completaron
    if (completo) {
      const code = `KG-${new Date().getFullYear()}-${(100000 + i * 7331).toString(36).toUpperCase().padStart(6, "0").slice(0, 6)}`;
      const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/verificar/${code}`;
      const qr = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 320, color: { dark: "#0A2D4DFF", light: "#FFFFFFFF" } });
      const expira = new Date();
      expira.setMonth(expira.getMonth() + 24);

      await prisma.certificate.create({
        data: {
          code,
          userId: t.id,
          courseId: cursoBasico.course.id,
          enrollmentId: enrollment.id,
          templateId: template.id,
          studentName: `${t.firstName} ${t.lastName}`,
          studentDocument: t.documentNumber,
          courseTitle: cursoBasico.course.title,
          hours: cursoBasico.course.durationHours,
          finalScore: 100,
          verifyUrl,
          qrDataUrl: qr,
          expiresAt: expira,
          status: "vigente",
        },
      });
      await prisma.pointsLedger.create({
        data: { userId: t.id, points: 100, reason: "curso_completado", refType: "curso", refId: cursoBasico.course.id },
      });
      await prisma.notification.create({
        data: {
          userId: t.id,
          title: "Su certificado esta listo",
          message: `Completo "${cursoBasico.course.title}". Ya puede descargar su certificado.`,
          linkUrl: "/aula/certificados",
          type: "exito",
        },
      });
    }

    await prisma.streak.create({
      data: { userId: t.id, currentDays: completo ? 5 : 2, longestDays: completo ? 7 : 3, lastActiveAt: new Date() },
    });
  }

  await prisma.auditLog.createMany({
    data: [
      { userId: superadmin.id, actorEmail: superadmin.email, action: "crear", entity: "courses", summary: "Creacion de los tres primeros cursos" },
      { userId: adminEmpresa.id, actorEmail: adminEmpresa.email, action: "asignar", entity: "course_assignments", summary: `Asignacion masiva a ${trabajadores.length} trabajadores` },
      { userId: superadmin.id, actorEmail: superadmin.email, action: "publicar", entity: "courses", summary: "Publicacion del curso Primeros Auxilios Basicos" },
    ],
  });

  const counts = {
    roles: await prisma.role.count(),
    permisos: await prisma.permission.count(),
    usuarios: await prisma.user.count(),
    empresas: await prisma.company.count(),
    cursos: await prisma.course.count(),
    modulos: await prisma.module.count(),
    lecciones: await prisma.lesson.count(),
    evaluaciones: await prisma.assessment.count(),
    preguntas: await prisma.question.count(),
    matriculas: await prisma.enrollment.count(),
    certificados: await prisma.certificate.count(),
  };

  console.log("\n=========== KG ACADEMY - BASE DE DATOS LISTA ===========");
  console.table(counts);
  console.log("\nUsuarios de acceso (contrasena para todos: " + PASS + ")");
  console.table([
    { rol: "SuperAdmin KG", correo: "admin@kggestionintegral.com" },
    { rol: "Instructor", correo: "instructor@kggestionintegral.com" },
    { rol: "Admin de empresa", correo: "rrhh@constructoraandina.com" },
    { rol: "Estudiante (empresa)", correo: "laura.cardenas@constructoraandina.com" },
    { rol: "Supervisor", correo: "diana.suarez@constructoraandina.com" },
    { rol: "Estudiante B2C", correo: "estudiante@correo.com" },
  ]);
  console.log("========================================================\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
