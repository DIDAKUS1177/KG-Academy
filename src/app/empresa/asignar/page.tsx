import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { resolveCompany } from "@/lib/empresa";
import { ROLES } from "@/lib/constants";
import { EmptyState, SectionTitle } from "@/components/ui";
import { AsignarForm } from "./AsignarForm";
import { IconBuilding } from "@/components/Icons";

export const metadata: Metadata = { title: "Asignar cursos" };
export const dynamic = "force-dynamic";

export default async function AsignarPage({ searchParams }: { searchParams: { empresa?: string } }) {
  const user = await requireRole(ROLES.ADMIN_EMPRESA, ROLES.SUPERADMIN, ROLES.ADMIN_KG);
  const company = await resolveCompany(user, searchParams.empresa);
  if (!company) {
    return <EmptyState icon={<IconBuilding width={30} height={30} />} title="Sin empresa asociada" />;
  }

  const [courses, members, areas] = await Promise.all([
    prisma.course.findMany({
      where: { status: { in: ["publicado", "borrador", "revision"] } },
      orderBy: { title: "asc" },
      select: { id: true, title: true, code: true, durationHours: true, status: true },
    }),
    prisma.companyMember.findMany({
      where: { companyId: company.id, status: "activo" },
      include: { user: true, area: true, position: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.area.findMany({ where: { companyId: company.id } }),
  ]);

  const existentes = await prisma.courseAssignment.findMany({
    where: { companyId: company.id },
    select: { courseId: true, userId: true },
  });

  return (
    <div>
      <SectionTitle
        eyebrow={company.tradeName ?? company.legalName}
        title="Asignar cursos"
        description="Seleccione el curso, los trabajadores y la fecha límite. Puede asignar de forma individual o masiva."
      />

      <AsignarForm
        companyId={company.id}
        courses={courses}
        areas={areas.map((a) => ({ id: a.id, name: a.name }))}
        members={members.map((m) => ({
          userId: m.userId,
          name: `${m.user.firstName} ${m.user.lastName}`,
          email: m.user.email,
          areaId: m.areaId,
          areaName: m.area?.name ?? "Sin área",
          position: m.position?.name ?? "—",
          employeeCode: m.employeeCode ?? "",
        }))}
        existentes={existentes.map((e) => `${e.courseId}:${e.userId}`)}
      />
    </div>
  );
}
