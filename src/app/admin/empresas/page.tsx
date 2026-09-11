import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { SectionTitle } from "@/components/ui";
import { PanelEmpresas } from "./PanelEmpresas";

export const metadata: Metadata = { title: "Empresas y planes" };
export const dynamic = "force-dynamic";

export default async function AdminEmpresas() {
  await requireRole(ROLES.SUPERADMIN, ROLES.ADMIN_KG);

  const [companies, plans] = await Promise.all([
    prisma.company.findMany({
      include: {
        _count: { select: { members: true } },
        assignments: { select: { status: true, enrollment: { select: { progress: true } } } },
        subscriptions: {
          where: { status: "activa" },
          include: { plan: true },
          orderBy: { startsAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.plan.findMany({ orderBy: { pricePerMonth: "asc" } }),
  ]);

  const leerLista = (json: string | null): string[] => {
    try {
      const v = json ? JSON.parse(json) : [];
      return Array.isArray(v) ? v.map(String) : [];
    } catch {
      return [];
    }
  };

  return (
    <div>
      <SectionTitle
        eyebrow="Administración"
        title="Empresas y planes"
        description="Clientes B2B, su plan contratado y su nivel de cumplimiento en capacitación."
      />

      <PanelEmpresas
        planes={plans.map((p) => ({
          id: p.id,
          code: p.code,
          name: p.name,
          description: p.description,
          maxUsers: p.maxUsers,
          maxCourses: p.maxCourses,
          pricePerMonth: p.pricePerMonth,
          pricePerUser: p.pricePerUser,
          features: leerLista(p.features),
          isActive: p.isActive,
        }))}
        empresas={companies.map((c) => {
          const total = c.assignments.length;
          const sub = c.subscriptions[0];
          return {
            id: c.id,
            nit: c.nit,
            legalName: c.legalName,
            tradeName: c.tradeName,
            economicSector: c.economicSector,
            arl: c.arl,
            riskLevel: c.riskLevel,
            contactName: c.contactName,
            contactEmail: c.contactEmail,
            contactPhone: c.contactPhone,
            address: c.address,
            city: c.city,
            status: c.status,
            planCode: sub?.plan.code ?? null,
            planNombre: sub?.plan.name ?? null,
            planValor: sub?.plan.pricePerMonth ?? null,
            seats: sub?.seats ?? 0,
            trabajadores: c._count.members,
            asignaciones: total,
            completadas: c.assignments.filter((a) => a.status === "completado").length,
            avance: total
              ? c.assignments.reduce((s, a) => s + (a.enrollment?.progress ?? 0), 0) / total
              : 0,
          };
        })}
      />
    </div>
  );
}
