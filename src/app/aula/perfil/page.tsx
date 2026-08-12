import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { ROLE_LABEL } from "@/lib/constants";
import { Avatar, SectionTitle, StatusBadge } from "@/components/ui";
import { IconLock, IconBuilding } from "@/components/Icons";

export const metadata: Metadata = { title: "Mi perfil" };
export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const user = await requireUser();
  const member = user.companyId
    ? await prisma.companyMember.findFirst({
        where: { userId: user.id, companyId: user.companyId },
        include: { area: true, position: true, location: true },
      })
    : null;

  return (
    <div className="mx-auto max-w-4xl">
      <SectionTitle eyebrow="Cuenta" title="Mi perfil" description="Datos personales y laborales registrados en KG Academy." />

      <div className="card overflow-hidden">
        <div className="relative h-28 bg-kg-gradient">
          <div className="absolute inset-0 bg-kg-mesh opacity-80" />
          <div className="absolute inset-0 bg-grid bg-[size:24px_24px] opacity-40" />
        </div>
        <div className="px-7 pb-7">
          <div className="-mt-10 flex flex-wrap items-end gap-5">
            <Avatar first={user.firstName} last={user.lastName} size={84} className="ring-4 ring-white" />
            <div className="mb-1 min-w-0 flex-1">
              <h2 className="font-display text-2xl font-extrabold text-navy-700">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-navy-400">{user.email}</p>
            </div>
            <div className="mb-2 flex gap-2">
              <span className="badge-blue">{ROLE_LABEL[user.role.code]}</span>
              <StatusBadge status={user.status} />
            </div>
          </div>

          <form className="mt-8 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label">Nombres</label>
              <input className="input" defaultValue={user.firstName} readOnly />
            </div>
            <div>
              <label className="label">Apellidos</label>
              <input className="input" defaultValue={user.lastName} readOnly />
            </div>
            <div>
              <label className="label">Tipo de documento</label>
              <input className="input" defaultValue={user.documentType ?? "—"} readOnly />
            </div>
            <div>
              <label className="label">Numero de documento</label>
              <input className="input" defaultValue={user.documentNumber ?? "—"} readOnly />
            </div>
            <div>
              <label className="label">Telefono</label>
              <input className="input" defaultValue={user.phone ?? "—"} readOnly />
            </div>
            <div>
              <label className="label">Ciudad</label>
              <input className="input" defaultValue={user.city ?? "—"} readOnly />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Cargo</label>
              <input className="input" defaultValue={user.jobTitle ?? "—"} readOnly />
            </div>
          </form>

          <p className="mt-3 text-xs text-navy-300">
            La edicion del perfil se habilita en la Fase 1 del backlog. Los campos exactos quedaron como
            &quot;Por definir&quot; en el punto 5 del esqueleto funcional.
          </p>
        </div>
      </div>

      {user.company && (
        <div className="card mt-6 p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
              <IconBuilding width={20} height={20} />
            </span>
            <div>
              <p className="font-display text-base font-bold text-navy-700">Vinculacion laboral</p>
              <p className="text-xs text-navy-400">{user.company.legalName}</p>
            </div>
          </div>
          <dl className="mt-6 grid gap-5 sm:grid-cols-4">
            {[
              ["Empresa", user.company.tradeName ?? user.company.legalName],
              ["Area", member?.area?.name ?? "—"],
              ["Cargo", member?.position?.name ?? "—"],
              ["Sede", member?.location?.name ?? "—"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-navy-400">{k}</dt>
                <dd className="mt-1 text-sm font-semibold text-navy-700">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <div className="card mt-6 p-7">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
            <IconLock width={20} height={20} />
          </span>
          <div>
            <p className="font-display text-base font-bold text-navy-700">Seguridad y actividad</p>
            <p className="text-xs text-navy-400">Trazabilidad de acceso a su cuenta</p>
          </div>
        </div>
        <dl className="mt-6 grid gap-5 sm:grid-cols-3">
          {[
            ["Ultimo acceso", formatDateTime(user.lastLoginAt)],
            ["Total de ingresos", String(user.loginCount)],
            ["Cuenta creada", formatDateTime(user.createdAt)],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[10px] font-bold uppercase tracking-wider text-navy-400">{k}</dt>
              <dd className="mt-1 text-sm font-semibold text-navy-700">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
