import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { LogoFull } from "@/components/Logo";
import { SectionTitle } from "@/components/ui";
import { CreditoDesarrollo } from "@/components/Contacto";
import { IconSettings, IconShield, IconAward, IconBell, IconPhone } from "@/components/Icons";

export const metadata: Metadata = { title: "Configuración" };
export const dynamic = "force-dynamic";

const GRUPO_ICON: Record<string, JSX.Element> = {
  marca: <IconSettings width={18} height={18} />,
  certificados: <IconAward width={18} height={18} />,
  seguridad: <IconShield width={18} height={18} />,
  general: <IconSettings width={18} height={18} />,
  correo: <IconBell width={18} height={18} />,
  contacto: <IconPhone width={18} height={18} />,
};

export default async function ConfiguracionPage() {
  await requireRole(ROLES.SUPERADMIN, ROLES.ADMIN_KG);

  const [settings, templates, notifTemplates] = await Promise.all([
    prisma.systemSetting.findMany({ orderBy: [{ group: "asc" }, { key: "asc" }] }),
    prisma.certificateTemplate.findMany(),
    prisma.notificationTemplate.findMany({ orderBy: { code: "asc" } }),
  ]);

  const grupos = new Map<string, typeof settings>();
  for (const s of settings) grupos.set(s.group, [...(grupos.get(s.group) ?? []), s]);

  return (
    <div>
      <SectionTitle
        eyebrow="Sistema"
        title="Configuración general"
        description="Parametros de marca, certificados, seguridad y plantillas de notificación."
      />

      {/* Identidad de marca */}
      <div className="card mb-6 overflow-hidden">
        <div className="grid gap-8 p-7 lg:grid-cols-[auto_1fr]">
          <div className="flex items-center justify-center rounded-2xl border border-navy-100 bg-white p-6">
            <LogoFull width={230} />
          </div>
          <div>
            <p className="eyebrow">Identidad visual</p>
            <h3 className="mt-1 font-display text-xl font-extrabold text-navy-700">
              KATERINE GUAÑARITA &middot; KG Gestión Integral S.A.S.
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-navy-400">
              El logotipo oficial se usa en la plataforma, en los certificados y en la página pública de
              verificación. Los colores del sistema se extrajeron directamente del logo.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {[
                { n: "Navy KG", c: "#0A2D4D" },
                { n: "Lime KG", c: "#8FBF16" },
                { n: "Navy claro", c: "#1B4A73" },
                { n: "Lime oscuro", c: "#759F11" },
              ].map((c) => (
                <div key={c.c} className="flex items-center gap-2.5 rounded-xl border border-navy-100 bg-white px-3 py-2">
                  <span className="h-7 w-7 rounded-lg" style={{ background: c.c }} />
                  <div>
                    <p className="text-[11px] font-bold text-navy-700">{c.n}</p>
                    <p className="font-mono text-[10px] text-navy-400">{c.c}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Parametros */}
      <div className="grid gap-5 md:grid-cols-2">
        {[...grupos.entries()].map(([grupo, items]) => (
          <div key={grupo} className="card overflow-hidden">
            <div className="flex items-center gap-3 border-b border-navy-50 bg-navy-50/50 px-5 py-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-700 text-lime-400">
                {GRUPO_ICON[grupo] ?? GRUPO_ICON.general}
              </span>
              <p className="font-display text-sm font-bold capitalize text-navy-700">{grupo}</p>
            </div>
            <dl className="divide-y divide-navy-50">
              {items.map((s) => (
                <div key={s.id} className="flex items-start justify-between gap-4 px-5 py-3">
                  <dt className="min-w-0">
                    <span className="block text-xs font-semibold text-navy-600">{s.label ?? s.key}</span>
                    <span className="block font-mono text-[10px] text-navy-300">{s.key}</span>
                  </dt>
                  <dd className="shrink-0 text-right text-xs font-bold text-navy-700">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      {/* Plantillas */}
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <p className="border-b border-navy-50 px-5 py-4 font-display text-sm font-bold text-navy-700">
            Plantillas de certificado
          </p>
          <ul className="divide-y divide-navy-50">
            {templates.map((t) => (
              <li key={t.id} className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-navy-700">{t.name}</p>
                  {t.isDefault && <span className="badge-green">Por defecto</span>}
                </div>
                <p className="mt-1 text-xs text-navy-400">{t.description}</p>
                <p className="mt-2 text-[11px] text-navy-400">
                  Firma: <strong className="text-navy-600">{t.signerName}</strong> &middot; {t.signerTitle}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="card overflow-hidden">
          <p className="border-b border-navy-50 px-5 py-4 font-display text-sm font-bold text-navy-700">
            Plantillas de notificación
          </p>
          <table className="table-kg">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Canal</th>
              </tr>
            </thead>
            <tbody>
              {notifTemplates.map((t) => (
                <tr key={t.id}>
                  <td className="font-mono text-[11px] text-navy-500">{t.code}</td>
                  <td className="text-xs font-semibold text-navy-700">{t.name}</td>
                  <td>
                    <span className="badge-slate capitalize">{t.channel}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-navy-200 bg-white/60 p-6 text-center">
        <p className="text-sm font-semibold text-navy-600">
          Plataforma KG Academy v1.0 &middot; Next.js 14 + TypeScript + Prisma
        </p>
        <p className="mt-1 text-xs text-navy-400">
          Diseñada y desarrollada por <CreditoDesarrollo /> para KG Gestión Integral S.A.S.
        </p>
      </div>
    </div>
  );
}
