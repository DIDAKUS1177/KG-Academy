import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { resolveCompany } from "@/lib/empresa";
import { filtroCatalogo } from "@/lib/acceso-cursos";
import { ROLES } from "@/lib/constants";
import { CourseCard } from "@/components/CourseCard";
import { EmptyState, SectionTitle } from "@/components/ui";
import { IconBook, IconClipboard } from "@/components/Icons";

export const metadata: Metadata = { title: "Cursos de su plan" };
export const dynamic = "force-dynamic";

/** Los cursos que KG tiene habilitados para esta empresa. */
export default async function CursosEmpresaPage(props: { searchParams: Promise<{ empresa?: string }> }) {
  const searchParams = await props.searchParams;
  const user = await requireRole(ROLES.ADMIN_EMPRESA, ROLES.SUPERVISOR, ROLES.SUPERADMIN, ROLES.ADMIN_KG);
  const company = await resolveCompany(user, searchParams.empresa);
  if (!company) return <EmptyState title="Sin empresa asociada" />;

  const cursos = await prisma.course.findMany({
    where: { status: "publicado", ...(await filtroCatalogo(company.id)) },
    include: { category: true, modules: { include: { lessons: { select: { id: true } } } } },
    orderBy: { code: "asc" },
  });
  const seleccion = company.catalogo === "seleccion";

  return (
    <div>
      <SectionTitle
        eyebrow={company.tradeName ?? company.legalName}
        title="Cursos de su plan"
        description={
          seleccion
            ? "Los cursos que KG habilitó para su empresa. Para sumar otros, comuníquese con KG."
            : "Todo el catálogo publicado de KG Academy está disponible para su empresa."
        }
        action={
          user.role.code !== ROLES.SUPERVISOR && cursos.length > 0 ? (
            <Link href="/empresa/asignar" className="btn-lime btn-sm">
              <IconClipboard width={14} height={14} /> Asignar cursos
            </Link>
          ) : undefined
        }
      />
      {cursos.length === 0 ? (
        <EmptyState
          icon={<IconBook width={30} height={30} />}
          title="Aún no hay cursos habilitados"
          description="KG todavía no activó cursos para su empresa. Comuníquese con KG para habilitarlos."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cursos.map((c) => (
            <CourseCard
              key={c.id}
              course={{
                slug: c.slug,
                code: c.code,
                title: c.title,
                subtitle: c.subtitle,
                level: c.level,
                durationHours: c.durationHours,
                accessType: c.accessType,
                price: c.price,
                status: c.status,
                modulesCount: c.modules.length,
                lessonsCount: c.modules.reduce((s, m) => s + m.lessons.length, 0),
                categoryName: c.category.name,
                categoryColor: c.category.color,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
