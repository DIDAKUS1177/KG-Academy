import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { Breadcrumb, ProgressRing, StatusBadge } from "@/components/ui";
import { QuizForm } from "./QuizForm";
import { IconCheck, IconX, IconClipboard, IconAward, IconAlert, IconArrowRight } from "@/components/Icons";

export const dynamic = "force-dynamic";

export default async function EvaluacionPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { intento?: string };
}) {
  const user = await requireUser();

  const assessment = await prisma.assessment.findUnique({
    where: { id: params.id },
    include: {
      course: true,
      questions: {
        include: { question: { include: { options: { orderBy: { order: "asc" } } } } },
        orderBy: { order: "asc" },
      },
    },
  });
  if (!assessment) notFound();

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: assessment.courseId } },
  });
  if (!enrollment) notFound();

  const attempts = await prisma.assessmentAttempt.findMany({
    where: { assessmentId: assessment.id, enrollmentId: enrollment.id },
    orderBy: { startedAt: "desc" },
  });

  const shown = searchParams.intento
    ? await prisma.assessmentAttempt.findUnique({
        where: { id: searchParams.intento },
        include: {
          answers: {
            include: {
              question: { include: { options: true } },
              option: true,
            },
          },
        },
      })
    : null;

  const passed = attempts.some((a) => a.passed);
  const sinIntentos = attempts.length >= assessment.maxAttempts && !passed;

  const crumbs = (
    <Breadcrumb
      items={[
        { label: "Aula", href: "/aula" },
        { label: assessment.course.title, href: `/aula/curso/${assessment.course.slug}` },
        { label: assessment.title },
      ]}
    />
  );

  /* ------------------------- Vista de RESULTADO ------------------------- */
  if (shown && shown.userId === user.id) {
    return (
      <div className="mx-auto max-w-3xl">
        {crumbs}
        <div className="card overflow-hidden">
          <div className={`flex flex-wrap items-center gap-6 p-8 ${shown.passed ? "bg-lime-500" : "bg-amber-500"}`}>
            <div className="rounded-2xl bg-white/20 p-3">
              <ProgressRing value={shown.score} size={110} label={`${Math.round(shown.score)}`} sub="de 100" />
            </div>
            <div className="min-w-[220px] flex-1 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/80">
                Intento {shown.attemptNo} &middot; {assessment.title}
              </p>
              <p className="mt-2 font-display text-3xl font-extrabold">
                {shown.passed ? "Evaluacion aprobada" : "No alcanzo la nota minima"}
              </p>
              <p className="mt-1 text-sm text-white/85">
                {shown.correctCount} de {shown.totalCount} respuestas correctas &middot; minimo{" "}
                {assessment.minScore}/100
              </p>
            </div>
          </div>

          {assessment.showFeedback && (
            <div className="divide-y divide-navy-50">
              {shown.answers.map((a, i) => {
                const correcta = a.question.options.find((o) => o.isCorrect);
                return (
                  <div key={a.id} className="p-6">
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                          a.isCorrect ? "bg-lime-500 text-white" : "bg-red-500 text-white"
                        }`}
                      >
                        {a.isCorrect ? (
                          <IconCheck width={13} height={13} strokeWidth={3.5} />
                        ) : (
                          <IconX width={13} height={13} strokeWidth={3} />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-navy-700">
                          {i + 1}. {a.question.statement}
                        </p>
                        <p className="mt-2 text-xs text-navy-500">
                          Su respuesta:{" "}
                          <span className={a.isCorrect ? "font-bold text-lime-700" : "font-bold text-red-600"}>
                            {a.option?.text ?? "Sin responder"}
                          </span>
                        </p>
                        {!a.isCorrect && assessment.showCorrectAnswers && correcta && (
                          <p className="mt-1 text-xs text-navy-500">
                            Respuesta correcta:{" "}
                            <span className="font-bold text-lime-700">{correcta.text}</span>
                          </p>
                        )}
                        {a.question.explanation && (
                          <p className="mt-2 rounded-lg bg-navy-50/70 p-3 text-xs leading-relaxed text-navy-500">
                            {a.question.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-wrap gap-3 border-t border-navy-50 bg-navy-50/40 p-6">
            <Link href={`/aula/curso/${assessment.course.slug}`} className="btn-primary">
              Volver al curso <IconArrowRight width={16} height={16} />
            </Link>
            {!shown.passed && attempts.length < assessment.maxAttempts && (
              <Link href={`/aula/evaluacion/${assessment.id}`} className="btn-outline">
                Intentar de nuevo ({attempts.length}/{assessment.maxAttempts})
              </Link>
            )}
            {shown.passed && assessment.type === "final" && (
              <Link href="/aula/certificados" className="btn-lime">
                <IconAward width={16} height={16} /> Ver mi certificado
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* --------------------------- Vista de INICIO --------------------------- */
  return (
    <div className="mx-auto max-w-3xl">
      {crumbs}

      <div className="card mb-6 overflow-hidden">
        <div className="flex items-center gap-4 border-b border-navy-50 bg-navy-50/50 px-7 py-6">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-700 text-lime-400">
            <IconClipboard width={22} height={22} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="eyebrow">{assessment.type === "final" ? "Evaluacion final" : "Evaluacion"}</p>
            <h1 className="font-display text-2xl font-extrabold text-navy-700">{assessment.title}</h1>
          </div>
          {passed && <StatusBadge status="completado" label="Aprobada" />}
        </div>

        <div className="p-7">
          <p className="text-sm leading-relaxed text-navy-500">{assessment.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ["Preguntas", String(assessment.questions.length)],
              ["Nota minima", `${assessment.minScore}/100`],
              ["Intentos", `${attempts.length}/${assessment.maxAttempts}`],
              ["Tiempo", assessment.timeLimitMin ? `${assessment.timeLimitMin} min` : "Sin limite"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-navy-50/70 p-3">
                <dt className="text-[10px] font-bold uppercase tracking-wide text-navy-400">{k}</dt>
                <dd className="mt-0.5 font-display text-lg font-extrabold text-navy-700">{v}</dd>
              </div>
            ))}
          </dl>

          {assessment.questions.length === 0 && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <IconAlert width={18} height={18} className="mt-0.5 shrink-0" />
              <span>
                Esta evaluacion aun no tiene preguntas cargadas. KG puede administrarlas desde el banco
                de preguntas del panel administrativo.
              </span>
            </div>
          )}

          {sinIntentos && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <IconAlert width={18} height={18} className="mt-0.5 shrink-0" />
              <span>
                Agoto los {assessment.maxAttempts} intentos permitidos. Comuniquese con el administrador
                de KG Academy para habilitar un nuevo intento.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Historial de intentos */}
      {attempts.length > 0 && (
        <div className="card mb-6 overflow-hidden">
          <p className="border-b border-navy-50 px-6 py-4 font-display text-sm font-bold text-navy-700">
            Historial de intentos
          </p>
          <table className="table-kg">
            <thead>
              <tr>
                <th>Intento</th>
                <th>Fecha</th>
                <th>Nota</th>
                <th>Resultado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {attempts.map((a) => (
                <tr key={a.id}>
                  <td className="font-semibold">#{a.attemptNo}</td>
                  <td className="text-xs text-navy-400">{formatDateTime(a.submittedAt ?? a.startedAt)}</td>
                  <td className="font-display font-extrabold">{Math.round(a.score)}</td>
                  <td>
                    <StatusBadge
                      status={a.passed ? "completado" : "vencido"}
                      label={a.passed ? "Aprobado" : "No aprobado"}
                    />
                  </td>
                  <td className="text-right">
                    <Link href={`/aula/evaluacion/${assessment.id}?intento=${a.id}`} className="btn-outline btn-sm">
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!passed && !sinIntentos && assessment.questions.length > 0 && (
        <QuizForm
          assessmentId={assessment.id}
          shuffle={assessment.shuffleQuestions}
          timeLimitMin={assessment.timeLimitMin}
          questions={assessment.questions.map((aq) => ({
            id: aq.question.id,
            statement: aq.question.statement,
            type: aq.question.type,
            options: aq.question.options.map((o) => ({ id: o.id, text: o.text })),
          }))}
        />
      )}
    </div>
  );
}
