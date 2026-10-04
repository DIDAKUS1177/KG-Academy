import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { usuarioDeIngreso } from "@/lib/identidad";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { ROLE_LABEL } from "@/lib/constants";
import { Avatar, SectionTitle, StatusBadge } from "@/components/ui";
import { IconLock, IconBuilding } from "@/components/Icons";
import { CambiarClave } from "./CambiarClave";
import { minimoClave } from "@/lib/claves";
import { EditarPerfil } from "./EditarPerfil";

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
      <SectionTitle eyebrow="Cuenta" title="Mi perfil" description="Sus datos, su vinculación laboral y la seguridad de su cuenta." />

      <div className="card overflow-hidden">
        <div className="relative h-28 bg-kg-gradient">
          <div className="absolute inset-0 bg-kg-mesh opacity-80" />
          <div className="absolute inset-0 bg-grid bg-[size:24px_24px] opacity-40" />
        </div>
        <div className="px-7 pb-7">
          {/* El avatar va por encima de la franja y el texto empieza debajo de ella. */}
          <div className="relative z-[1] -mt-10 flex items-start gap-4 sm:gap-5">
            <Avatar first={user.firstName} last={user.lastName} size={84} className="shrink-0 ring-4 ring-white" />
            <div className="min-w-0 flex-1 pt-11">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="mr-1 font-display text-2xl font-extrabold text-navy-700">
                  {user.firstName} {user.lastName}
                </h2>
                <span className="badge-blue">{ROLE_LABEL[user.role.code]}</span>
                <StatusBadge status={user.status} />
              </div>
              <p className="mt-1 break-words text-sm text-navy-400">
                Entra con: <span className="font-semibold text-navy-600">{usuarioDeIngreso(user)}</span>
              </p>
            </div>
          </div>

          <EditarPerfil
            datos={{
              firstName: user.firstName,
              lastName: user.lastName,
              documentType: user.documentType,
              documentNumber: user.documentNumber,
              phone: user.phone,
              city: user.city,
              jobTitle: user.jobTitle,
            }}
          />
        </div>
      </div>

      {user.company && (
        <div className="card mt-6 p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
              <IconBuilding width={20} height={20} />
            </span>
            <div>
              <p className="font-display text-base font-bold text-navy-700">Vinculación laboral</p>
              <p className="text-xs text-navy-400">{user.company.legalName}</p>
            </div>
          </div>
          <dl className="mt-6 grid gap-5 sm:grid-cols-4">
            {[
              ["Empresa", user.company.tradeName ?? user.company.legalName],
              ["Área", member?.area?.name ?? "—"],
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
            ["Último acceso", formatDateTime(user.lastLoginAt)],
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

      <CambiarClave temporal={user.status === "pendiente_activacion"} minimo={await minimoClave()} />
    </div>
  );
}
