import { AppShell, type NavGroup } from "@/components/AppShell";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ROLE_LABEL, ROLES } from "@/lib/constants";
import {
  IconHome,
  IconUsers,
  IconClipboard,
  IconChart,
  IconFile,
  IconBook,
} from "@/components/Icons";

export default async function EmpresaLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(ROLES.ADMIN_EMPRESA, ROLES.SUPERVISOR, ROLES.SUPERADMIN, ROLES.ADMIN_KG);
  const unread = await prisma.notification.count({ where: { userId: user.id, isRead: false } });

  const esSupervisor = user.role.code === ROLES.SUPERVISOR;

  const groups: NavGroup[] = [
    {
      title: "Capacitacion",
      items: [
        { href: "/empresa", label: "Dashboard", icon: <IconHome width={18} height={18} />, exact: true },
        { href: "/empresa/seguimiento", label: "Seguimiento", icon: <IconChart width={18} height={18} /> },
        { href: "/empresa/trabajadores", label: "Trabajadores", icon: <IconUsers width={18} height={18} /> },
        ...(esSupervisor
          ? []
          : [{ href: "/empresa/asignar", label: "Asignar cursos", icon: <IconClipboard width={18} height={18} /> }]),
      ],
    },
    {
      title: "Informes",
      items: [
        { href: "/empresa/reportes", label: "Reportes", icon: <IconFile width={18} height={18} /> },
        { href: "/catalogo", label: "Catalogo KG", icon: <IconBook width={18} height={18} /> },
      ],
    },
  ];

  return (
    <AppShell
      groups={groups}
      area={user.company?.tradeName ?? "Panel empresarial"}
      notifications={unread}
      user={{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleLabel: ROLE_LABEL[user.role.code] ?? user.role.name,
      }}
    >
      {children}
    </AppShell>
  );
}
