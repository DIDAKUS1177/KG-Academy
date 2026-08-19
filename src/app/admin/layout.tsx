import { AppShell, type NavGroup } from "@/components/AppShell";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ROLE_LABEL, ROLES } from "@/lib/constants";
import {
  IconHome,
  IconUsers,
  IconBuilding,
  IconBook,
  IconClipboard,
  IconAward,
  IconChart,
  IconSettings,
  IconShield,
  IconLayers,
} from "@/components/Icons";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole(ROLES.SUPERADMIN, ROLES.ADMIN_KG, ROLES.INSTRUCTOR);
  const unread = await prisma.notification.count({ where: { userId: user.id, isRead: false } });
  const esInstructor = user.role.code === ROLES.INSTRUCTOR;

  const groups: NavGroup[] = [
    {
      title: "General",
      items: [
        ...(esInstructor
          ? []
          : [{ href: "/admin", label: "Dashboard", icon: <IconHome width={18} height={18} />, exact: true }]),
        { href: "/admin/cursos", label: "Cursos", icon: <IconBook width={18} height={18} /> },
        { href: "/admin/evaluaciones", label: "Evaluaciones", icon: <IconClipboard width={18} height={18} /> },
      ],
    },
    ...(esInstructor
      ? []
      : [
          {
            title: "Administración",
            items: [
              { href: "/admin/usuarios", label: "Usuarios y roles", icon: <IconUsers width={18} height={18} /> },
              { href: "/admin/empresas", label: "Empresas y planes", icon: <IconBuilding width={18} height={18} /> },
              { href: "/admin/certificados", label: "Certificados", icon: <IconAward width={18} height={18} /> },
              { href: "/admin/reportes", label: "Reportes", icon: <IconChart width={18} height={18} /> },
            ],
          },
          {
            title: "Sistema",
            items: [
              { href: "/admin/auditoria", label: "Auditoría", icon: <IconShield width={18} height={18} /> },
              { href: "/admin/permisos", label: "Matriz de permisos", icon: <IconLayers width={18} height={18} /> },
              { href: "/admin/configuracion", label: "Configuración", icon: <IconSettings width={18} height={18} /> },
            ],
          },
        ]),
  ];

  return (
    <AppShell
      groups={groups}
      area={esInstructor ? "Panel de instructor" : "Administración KG"}
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
