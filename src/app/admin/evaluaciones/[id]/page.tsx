import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ROLES, ASSESSMENT_TYPE_LABEL } from "@/lib/constants";
import { Breadcrumb, StatusBadge } from "@/components/ui";
import { EditorEvaluacion } from "./EditorEvaluacion";

export const dynamic = "force-dynamic";

export default async function EvaluacionPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await requireRole(ROLES.SUPERADMIN, ROLES.ADMIN_KG, ROLES.INSTRUCTOR);

  const a = await prisma.assessment.findUnique({
    where: { id: params.id },
    include: {
      course: true,
      questions: {
        orderBy: { order: "asc" },
        include: {
          question: {
            include: { options: { orderBy: { order: "asc" } }, _count: { select: { answers: true } } },
          },
        },
      },
      _count: { select: { attempts: { where: { status: "finalizado" } } } },
    },
  });
  if (!a) notFound();

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Administración", href: "/admin" },
          { label: "Evaluaciones", href: "/admin/evaluaciones" },
          { label: `${a.course.title} · ${a.title}` },
        ]}
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="h-display text-2xl">{a.title}</h1>
            <span className="badge-blue">{ASSESSMENT_TYPE_LABEL[a.type] ?? a.type}</span>
            <StatusBadge status={a.isPublished ? "publicado" : "borrador"} />
          </div>
          <p className="mt-1 text-sm text-navy-400">
            {a.course.code} &middot; {a.course.title} &middot; {a._count.attempts} intento(s) presentados
          </p>
        </div>
        <Link href={`/admin/cursos/${a.courseId}`} className="btn-outline btn-sm">
          Ir al curso
        </Link>
      </div>

      <EditorEvaluacion
        evaluacion={{
          id: a.id,
          title: a.title,
          description: a.description,
          type: a.type,
          minScore: a.minScore,
          maxAttempts: a.maxAttempts,
          timeLimitMin: a.timeLimitMin,
          shuffleQuestions: a.shuffleQuestions,
          shuffleOptions: a.shuffleOptions,
          showFeedback: a.showFeedback,
          showCorrectAnswers: a.showCorrectAnswers,
          isPublished: a.isPublished,
        }}
        preguntas={a.questions.map((aq) => ({
          id: aq.question.id,
          statement: aq.question.statement,
          explanation: aq.question.explanation,
          type: aq.question.type,
          respondida: aq.question._count.answers > 0,
          options: aq.question.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect })),
        }))}
      />
    </div>
  );
}
