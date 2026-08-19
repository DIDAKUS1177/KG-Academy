import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ROLES, ASSESSMENT_TYPE_LABEL } from "@/lib/constants";
import { SectionTitle, StatCard, StatusBadge } from "@/components/ui";
import { IconClipboard, IconCheck, IconChart, IconLayers } from "@/components/Icons";

export const metadata: Metadata = { title: "Evaluaciones" };
export const dynamic = "force-dynamic";

export default async function AdminEvaluaciones() {
  await requireRole(ROLES.SUPERADMIN, ROLES.ADMIN_KG, ROLES.INSTRUCTOR);

  const [assessments, banks, attempts] = await Promise.all([
    prisma.assessment.findMany({
      include: { course: true, questions: true, attempts: true },
      orderBy: [{ courseId: "asc" }, { order: "asc" }],
    }),
    prisma.questionBank.findMany({ include: { questions: true, course: true } }),
    prisma.assessmentAttempt.findMany({ where: { status: "finalizado" } }),
  ]);

  const aprobados = attempts.filter((a) => a.passed).length;
  const notaProm = attempts.length
    ? attempts.reduce((s, a) => s + a.score, 0) / attempts.length
    : 0;

  return (
    <div>
      <SectionTitle
        eyebrow="Administración"
        title="Evaluaciones y banco de preguntas"
        description="Configuración de evaluaciones diagnósticas, por módulo y finales."
      />

      <div className="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Evaluaciones" value={assessments.length} icon={<IconClipboard width={20} height={20} />} />
        <StatCard
          label="Preguntas"
          value={banks.reduce((s, b) => s + b.questions.length, 0)}
          icon={<IconLayers width={20} height={20} />}
        />
        <StatCard label="Intentos" value={attempts.length} tone="amber" icon={<IconChart width={20} height={20} />} />
        <StatCard
          label="Tasa de aprobación"
          value={`${attempts.length ? Math.round((aprobados / attempts.length) * 100) : 0}%`}
          hint={`Nota promedio: ${Math.round(notaProm)}`}
          tone="lime"
          icon={<IconCheck width={20} height={20} />}
        />
      </div>

      <div className="card mb-6 overflow-x-auto">
        <p className="border-b border-navy-50 px-6 py-4 font-display text-sm font-bold text-navy-700">
          Evaluaciones configuradas
        </p>
        <table className="table-kg">
          <thead>
            <tr>
              <th>Curso</th>
              <th>Evaluación</th>
              <th>Tipo</th>
              <th>Preguntas</th>
              <th>Nota min.</th>
              <th>Intentos max.</th>
              <th>Presentaciones</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((a) => (
              <tr key={a.id}>
                <td className="text-xs text-navy-500">{a.course.title}</td>
                <td className="font-semibold text-navy-700">{a.title}</td>
                <td>
                  <span className="badge-blue">{ASSESSMENT_TYPE_LABEL[a.type] ?? a.type}</span>
                </td>
                <td className="font-bold">{a.questions.length}</td>
                <td>{a.minScore}</td>
                <td>{a.maxAttempts}</td>
                <td className="font-bold text-navy-600">{a.attempts.length}</td>
                <td>
                  <StatusBadge status={a.isPublished ? "publicado" : "borrador"} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card overflow-x-auto">
        <p className="border-b border-navy-50 px-6 py-4 font-display text-sm font-bold text-navy-700">
          Bancos de preguntas
        </p>
        <table className="table-kg">
          <thead>
            <tr>
              <th>Banco</th>
              <th>Curso</th>
              <th>Tema</th>
              <th>Preguntas</th>
            </tr>
          </thead>
          <tbody>
            {banks.map((b) => (
              <tr key={b.id}>
                <td className="font-semibold text-navy-700">{b.name}</td>
                <td className="text-xs text-navy-500">{b.course?.title ?? "General"}</td>
                <td className="text-xs text-navy-400">{b.topic ?? "—"}</td>
                <td className="font-bold">{b.questions.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="border-t border-navy-50 px-6 py-4 text-[11px] leading-relaxed text-navy-400">
          <strong className="text-amber-600">Importante:</strong> las preguntas cargadas son de EJEMPLO
          para poder probar el motor de calificacion. KG debe reemplazarlas por el banco oficial de cada
          curso. El editor visual de preguntas corresponde a la Fase 1 del backlog; el modelo de datos
          (<code>question_banks</code>, <code>questions</code>, <code>question_options</code>,{" "}
          <code>assessment_questions</code>) ya soporta seleccion única, multiple y verdadero/falso.
        </p>
      </div>
    </div>
  );
}
