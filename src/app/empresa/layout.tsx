import Link from "next/link";
import { AppShell, type NavGroup } from "@/components/AppShell";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { resolveCompany } from "@/lib/empresa";
import { ROLE_LABEL, ROLES } from "@/lib/constants";
import {
  IconHome,
  IconUsers,
  IconClipboard,
  IconChart,
  IconFile,
  IconBook,
  IconGraduation,
  IconSettings,
  IconPlay,
} from "@/components/Icons";

export default async function EmpresaLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(ROLES.ADMIN_EMPRESA, ROLES.SUPERVISOR, ROLES.SUPERADMIN, ROLES.ADMIN_KG);
  const unread = await prisma.notification.count({ where: { userId: user.id, isRead: false } });

  const esSupervisor = user.role.code === ROLES.SUPERVISOR;
  // El equipo de KG entra al panel de una empresa desde Administración → Empresas.
  const esKG = user.role.code === ROLES.SUPERADMIN || user.role.code === ROLES.ADMIN_KG;
  const vista = esKG ? await resolveCompany(user) : null;

  const groups: NavGroup[] = [
    ...(esKG
      ? [{ title: "KG", items: [{ href: "/admin/empresas", label: "Volver a Administración", icon: <IconSettings width={18} height={18} /> }] }]
      : []),
    {
      title: "Capacitación",
      items: [
        { href: "/empresa", label: "Inicio", icon: <IconHome width={18} height={18} />, exact: true },
        { href: "/empresa/seguimiento", label: "Seguimiento", icon: <IconChart width={18} height={18} /> },
        { href: "/empresa/trabajadores", label: "Trabajadores", icon: <IconUsers width={18} height={18} /> },
        ...(esSupervisor
          ? []
          : [{ href: "/empresa/asignar", label: "Asignar cursos", icon: <IconClipboard width={18} height={18} /> }]),
        { href: "/empresa/encuentros", label: "Clases y reuniones", icon: <IconPlay width={18} height={18} /> },
      ],
    },
    {
      title: "Informes",
      items: [
        { href: "/empresa/reportes", label: "Reportes", icon: <IconFile width={18} height={18} /> },
        { href: "/empresa/cursos", label: "Cursos de su plan", icon: <IconBook width={18} height={18} /> },
      ],
    },
    // Quien también toma cursos (el supervisor, o el administrador si se los asignan) llega a su aula desde aquí.
    ...(esKG
      ? []
      : [{ title: "Mi aprendizaje", items: [{ href: "/aula", label: "Mis cursos", icon: <IconGraduation width={18} height={18} /> }] }]),
  ];

  return (
    <AppShell
      groups={groups}
      area={vista ? (vista.tradeName ?? vista.legalName) : (user.company?.tradeName ?? "Panel empresarial")}
      notifications={unread}
      user={{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleLabel: ROLE_LABEL[user.role.code] ?? user.role.name,
      }}
    >
      {vista && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <span>
            Está viendo el panel de <strong>{vista.tradeName ?? vista.legalName}</strong> como equipo KG. Lo que haga aquí queda en
            esa empresa.
          </span>
          <Link href="/admin/empresas" className="text-xs font-bold underline underline-offset-2">
            Cambiar de empresa
          </Link>
        </div>
      )}
      {children}
    </AppShell>
  );
}
