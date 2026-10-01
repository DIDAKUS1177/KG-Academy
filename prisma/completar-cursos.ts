/**
 * Completa los cursos de primeros auxilios del catálogo:
 *
 *   - KG-PA-001: agrega los módulos 4 a 7 (lecciones interactivas) a los tres
 *     de Genially y suma sus preguntas a la evaluación final existente.
 *   - KG-PA-002 y KG-PA-003: retira la estructura de espera (un módulo con la
 *     lección "pendiente" y, en la demo, el banco de ejemplo) y carga el curso
 *     completo con su evaluación final.
 *
 * Es idempotente: un módulo o una pregunta que ya existen no se repiten, y un
 * curso que ya tiene contenido interactivo o avance de estudiantes no se toca.
 * La usan la semilla de demostración y la carga de producción
 * (scripts/completar-cursos-produccion.ps1).
 *
 * El contenido nuevo lo redactó Claude a pedido de Diego y queda pendiente de
 * validación técnica por los profesionales de KG.
 */
import type { Prisma, PrismaClient } from "@prisma/client";
import type { CursoInteractivo, Pregunta } from "./cursos-interactivos";
import { crearContenidoInteractivo, crearCursoInteractivo } from "./crear-curso-interactivo";
import { MODULOS_PA001, PREGUNTAS_PA001 } from "./contenido/pa001-modulos";
import { PEDIATRICOS } from "./contenido/pa002-pediatricos";
import { PSICOLOGICOS } from "./contenido/pa003-psicologicos";

type Db = PrismaClient | Prisma.TransactionClient;
type Resultado = { curso: string; estado: string };

/** Minutos que se suman por la evaluación final al calcular la intensidad. */
const MINUTOS_EXAMEN = 30;

/** Intensidad horaria real: lecciones publicadas más la evaluación final. */
async function horasDelCurso(db: Db, courseId: string) {
  const r = await db.lesson.aggregate({
    where: { module: { courseId }, isPublished: true },
    _sum: { durationMin: true },
  });
  return Math.max(1, Math.round(((r._sum.durationMin ?? 0) + MINUTOS_EXAMEN) / 60));
}

/** Reparte el peso del avance por igual entre módulos y, dentro, entre lecciones. */
async function repartirPesos(db: Db, courseId: string) {
  const modulos = await db.module.findMany({ where: { courseId }, include: { _count: { select: { lessons: true } } } });
  const peso = 100 / Math.max(1, modulos.length);
  for (const m of modulos) {
    await db.module.update({ where: { id: m.id }, data: { weight: peso } });
    await db.lesson.updateMany({ where: { moduleId: m.id }, data: { weight: peso / Math.max(1, m._count.lessons) } });
  }
}

/** Suma a la evaluación las preguntas cuyo enunciado aún no tiene. Devuelve cuántas agregó. */
async function sumarPreguntas(db: Db, assessmentId: string, bankId: string, preguntas: Pregunta[]) {
  const actuales = await db.assessmentQuestion.findMany({
    where: { assessmentId },
    include: { question: { select: { statement: true } } },
  });
  const enunciados = new Set(actuales.map((a) => a.question.statement));
  let orden = actuales.reduce((m, a) => Math.max(m, a.order), 0);
  let nuevas = 0;
  for (const q of preguntas) {
    if (enunciados.has(q.statement)) continue;
    orden += 1;
    nuevas += 1;
    await db.question.create({
      data: {
        bankId,
        type: q.type ?? "unica",
        statement: q.statement,
        explanation: q.explanation,
        difficulty: "media",
        points: 1,
        options: { create: q.options.map((o, j) => ({ text: o.text, isCorrect: o.ok, order: j + 1 })) },
        inQuizzes: { create: { assessmentId, order: orden, points: 1 } },
      },
    });
  }
  return nuevas;
}

/* ------------------------------ KG-PA-001 ------------------------------ */

async function completarBasico(db: Db): Promise<Resultado> {
  const nombre = "KG-PA-001 Curso Básico de Primeros Auxilios";
  const course = await db.course.findUnique({
    where: { code: "KG-PA-001" },
    include: { modules: true, assessments: { where: { type: "final" }, orderBy: { createdAt: "asc" } } },
  });
  if (!course) return { curso: nombre, estado: "no existe; corra primero la carga de cursos" };

  let orden = course.modules.reduce((m, x) => Math.max(m, x.order), 0);
  let modulosNuevos = 0;
  for (const m of MODULOS_PA001) {
    if (course.modules.some((x) => x.title === m.title)) continue;
    orden += 1;
    modulosNuevos += 1;
    await db.module.create({
      data: {
        courseId: course.id,
        title: m.title,
        description: m.description,
        order: orden,
        isRequired: true,
        isPublished: true,
        lessons: {
          create: m.lessons.map((l, li) => ({
            title: l.title,
            description: l.description,
            order: li + 1,
            contentType: "interactivo",
            contentBody: JSON.stringify(l.contenido),
            durationMin: l.durationMin,
            isRequired: true,
            isPreview: false,
            completionRule: "manual",
            isPublished: true,
          })),
        },
      },
    });
  }
  await repartirPesos(db, course.id);

  const final = course.assessments[0];
  let preguntasNuevas = 0;
  if (final) {
    const una = await db.assessmentQuestion.findFirst({ where: { assessmentId: final.id }, include: { question: true } });
    const bankId =
      una?.question.bankId ??
      (await db.questionBank.create({ data: { name: `Banco de preguntas - ${course.title}`, courseId: course.id } })).id;
    preguntasNuevas = await sumarPreguntas(db, final.id, bankId, PREGUNTAS_PA001);
    const total = await db.assessmentQuestion.count({ where: { assessmentId: final.id } });
    await db.assessment.update({
      where: { id: final.id },
      data: {
        timeLimitMin: 40,
        description: `${total} preguntas sobre los siete módulos del curso. Nota mínima aprobatoria: ${final.minScore}/100. Tiene ${final.maxAttempts} intentos y 40 minutos por intento.`,
      },
    });
  }

  await db.course.update({
    where: { id: course.id },
    data: {
      durationHours: await horasDelCurso(db, course.id),
      methodology:
        "100% virtual asincrónico. Los módulos 1 a 3 se desarrollan en presentaciones interactivas de Genially y los módulos 4 a 7 en lecciones interactivas de la plataforma, con práctica calificada en cada lección y evaluación final.",
    },
  });

  if (!modulosNuevos && !preguntasNuevas) return { curso: nombre, estado: "ya estaba completo, sin cambios" };
  return { curso: nombre, estado: `${modulosNuevos} módulos y ${preguntasNuevas} preguntas agregados` };
}

/* ------------------------- KG-PA-002 y KG-PA-003 ------------------------ */

async function completarInteractivo(db: Db, c: CursoInteractivo, publicar: boolean): Promise<Resultado> {
  const nombre = `${c.code} ${c.title}`;
  const course = await db.course.findFirst({
    where: { OR: [{ code: c.code }, { slug: c.slug }] },
    include: { modules: { include: { lessons: { select: { contentType: true } } } } },
  });

  if (!course) {
    const categoria = await db.category.findUnique({ where: { slug: c.categoria } });
    if (!categoria) return { curso: nombre, estado: `falta la categoría "${c.categoria}"` };
    await crearCursoInteractivo(db, c, {
      categoryId: categoria.id,
      instructorId: null,
      status: publicar ? "publicado" : "borrador",
    });
    return { curso: nombre, estado: `creado ${publicar ? "y publicado" : "en borrador"}` };
  }

  if (course.modules.some((m) => m.lessons.some((l) => l.contentType === "interactivo"))) {
    return { curso: nombre, estado: "ya estaba completo, sin cambios" };
  }
  const avance = await db.lessonProgress.count({ where: { lesson: { module: { courseId: course.id } } } });
  const intentos = await db.assessmentAttempt.count({ where: { assessment: { courseId: course.id } } });
  if (avance || intentos) {
    return { curso: nombre, estado: "tiene avance de estudiantes; no se reemplaza su estructura" };
  }

  // Se retira la estructura de espera: nadie la ha usado (comprobado arriba).
  await db.assessment.deleteMany({ where: { courseId: course.id } });
  await db.questionBank.deleteMany({ where: { courseId: course.id } });
  await db.module.deleteMany({ where: { courseId: course.id } });

  await db.course.update({
    where: { id: course.id },
    data: {
      title: c.title,
      subtitle: c.subtitle,
      description: `${c.objective}\n\nContenido pendiente de validación técnica por KG.`,
      objective: c.objective,
      targetAudience: c.targetAudience,
      requirements: c.requirements,
      methodology: c.methodology,
      level: c.level,
      minPassingScore: c.examen.minScore,
      maxAttempts: c.examen.maxAttempts,
      requiresFinalExam: true,
      requiresAllLessons: true,
      ...(publicar ? { status: "publicado", publishedAt: new Date() } : {}),
    },
  });
  await crearContenidoInteractivo(db, course, c);
  await db.course.update({ where: { id: course.id }, data: { durationHours: await horasDelCurso(db, course.id) } });

  const lecciones = c.modules.reduce((n, m) => n + m.lessons.length, 0);
  return {
    curso: nombre,
    estado: `completado ${publicar ? "y publicado" : "(sigue en borrador)"}: ${c.modules.length} módulos, ${lecciones} lecciones, ${c.examen.preguntas.length} preguntas`,
  };
}

/**
 * Completa los tres cursos. Con `publicar`, KG-PA-002 y KG-PA-003 quedan
 * publicados; sin él conservan su estado (borrador) para que KG los revise.
 * Cada curso va en su propia transacción: si uno falla, no deja nada a medias.
 */
export async function completarCursos(prisma: PrismaClient, opciones: { publicar: boolean }) {
  // Neon responde a varios milisegundos por consulta: 5 s (por defecto) no alcanza.
  const tx = { timeout: 180_000, maxWait: 20_000 };
  const resultado: Resultado[] = [];
  resultado.push(await prisma.$transaction((db) => completarBasico(db), tx));
  for (const c of [PEDIATRICOS, PSICOLOGICOS]) {
    resultado.push(await prisma.$transaction((db) => completarInteractivo(db, c, opciones.publicar), tx));
  }
  return resultado;
}
