import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { Breadcrumb, StatusBadge } from "@/components/ui";
import { CursoConstructor } from "./CursoConstructor";
import { IconEye } from "@/components/Icons";

export const dynamic = "force-dynamic";

export default async function ConstructorPage({ params }: { params: { id: string } }) {
  const actor = await requireRole(ROLES.SUPERADMIN, ROLES.ADMIN_KG, ROLES.INSTRUCTOR);

  const [course, categorias, instructores] = await Promise.all([
    prisma.course.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        modules: {
          include: {
            lessons: {
              orderBy: { order: "asc" },
              include: { _count: { select: { progress: true } } },
            },
          },
          orderBy: { order: "asc" },
        },
        assessments: { include: { questions: true }, orderBy: { order: "asc" } },
      },
    }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.user.findMany({
      where: { role: { code: { in: [ROLES.INSTRUCTOR, ROLES.ADMIN_KG, ROLES.SUPERADMIN] } }, status: "activo" },
      orderBy: { firstName: "asc" },
      select: { id: true, firstName: true, lastName: true },
    }),
  ]);
  if (!course) notFound();

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Administración", href: "/admin" },
          { label: "Cursos", href: "/admin/cursos" },
          { label: course.title },
        ]}
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="h-display text-2xl">{course.title}</h1>
            <StatusBadge status={course.status} />
          </div>
          <p className="mt-1 text-sm text-navy-400">
            {course.code} &middot; {course.category.name} &middot; {course.durationHours} horas
          </p>
        </div>
        <Link href={`/curso/${course.slug}`} target="_blank" className="btn-outline btn-sm">
          <IconEye width={14} height={14} /> Vista pública
        </Link>
      </div>

      <CursoConstructor
        puedePublicar={actor.role.code !== ROLES.INSTRUCTOR}
        categorias={categorias.map((c) => ({ id: c.id, nombre: c.name }))}
        instructores={instructores.map((i) => ({ id: i.id, nombre: `${i.firstName} ${i.lastName}`.trim() }))}
        course={{
          id: course.id,
          status: course.status,
          title: course.title,
          subtitle: course.subtitle,
          description: course.description,
          objective: course.objective,
          targetAudience: course.targetAudience,
          requirements: course.requirements,
          methodology: course.methodology,
          level: course.level,
          modality: course.modality,
          durationHours: course.durationHours,
          categoryId: course.categoryId,
          instructorId: course.instructorId,
          progressRule: course.progressRule,
          minPassingScore: course.minPassingScore,
          maxAttempts: course.maxAttempts,
          requiresFinalExam: course.requiresFinalExam,
          requiresAllLessons: course.requiresAllLessons,
          certificateEnabled: course.certificateEnabled,
          certificateValidityMonths: course.certificateValidityMonths,
          allowRetake: course.allowRetake,
        }}
        modules={course.modules.map((m) => ({
          id: m.id,
          title: m.title,
          description: m.description,
          lessons: m.lessons.map((l) => ({
            id: l.id,
            title: l.title,
            description: l.description,
            contentType: l.contentType,
            contentUrl: l.contentUrl,
            durationMin: l.durationMin,
            isRequired: l.isRequired,
            isPreview: l.isPreview,
            isPublished: l.isPublished,
            conAvance: l._count.progress > 0,
          })),
        }))}
        assessments={course.assessments.map((a) => ({
          id: a.id,
          title: a.title,
          type: a.type,
          minScore: a.minScore,
          maxAttempts: a.maxAttempts,
          questions: a.questions.length,
        }))}
      />
    </div>
  );
}
