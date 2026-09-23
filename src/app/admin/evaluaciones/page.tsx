import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ROLES, ASSESSMENT_TYPE_LABEL } from "@/lib/constants";
import { SectionTitle, StatCard, StatusBadge } from "@/components/ui";
import { IconClipboard, IconCheck, IconChart, IconLayers, IconAlert } from "@/components/Icons";
import { CrearFinal } from "./CrearFinal";

export const metadata: Metadata = { title: "Evaluaciones" };
export const dynamic = "force-dynamic";

export default async function AdminEvaluaciones() {
  await requireRole(ROLES.SUPERADMIN, ROLES.ADMIN_KG, ROLES.INSTRUCTOR);

  const [assessments, banks, attempts, sinFinal] = await Promise.all([
    prisma.assessment.findMany({
      include: { course: true, questions: true, attempts: true },
      orderBy: [{ courseId: "asc" }, { order: "asc" }],
    }),
    prisma.questionBank.findMany({ include: { questions: true, course: true } }),
    prisma.assessmentAttempt.findMany({ where: { status: "finalizado" } }),
    // Cursos que exigen evaluación final y todavía no la tienen: no pueden
    // certificar a nadie hasta que se cree.
    prisma.course.findMany({
      where: { requiresFinalExam: true, assessments: { none: { type: "final" } } },
      orderBy: { title: "asc" },
    }),
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

      {sinFinal.length > 0 && (
        <div className="card mb-6 overflow-x-auto border-amber-200">
          <div className="flex items-start gap-3 border-b border-amber-100 bg-amber-50 px-6 py-4">
            <IconAlert width={18} height={18} className="mt-0.5 shrink-0 text-amber-600" />
            <div>
              <p className="font-display text-sm font-bold text-amber-900">Cursos sin evaluación final</p>
              <p className="text-xs text-amber-800">
                Exigen evaluación final para aprobar, así que nadie puede completarlos ni certificarse hasta
                que se cree y se publique.
              </p>
            </div>
          </div>
          <table className="table-kg">
            <tbody>
              {sinFinal.map((c) => (
                <tr key={c.id}>
                  <td className="font-semibold text-navy-700">{c.title}</td>
                  <td className="text-xs text-navy-400">{c.code}</td>
                  <td>
                    <StatusBadge status={c.status} />
                  </td>
                  <td>
                    <CrearFinal courseId={c.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
              <th />
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
                <td className="text-right">
                  <Link href={`/admin/evaluaciones/${a.id}`} className="btn-outline btn-sm">
                    Preguntas
                  </Link>
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
          Las preguntas se administran desde cada evaluación (botón <strong>Preguntas</strong>): una a una o
          con carga masiva desde Excel. Los bancos marcados como de ejemplo deben reemplazarse por el banco
          oficial de KG antes de certificar.
        </p>
      </div>
    </div>
  );
}
