import { AppShell, type NavGroup } from "@/components/AppShell";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ROLE_HOME, ROLE_LABEL, ROLES } from "@/lib/constants";
import {
  IconHome,
  IconBook,
  IconAward,
  IconUsers,
  IconBell,
  IconSpark,
  IconSettings,
} from "@/components/Icons";

export default async function AulaLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const unread = await prisma.notification.count({ where: { userId: user.id, isRead: false } });

  // Quien administra (KG o una empresa) también puede estudiar: desde el aula
  // vuelve a su panel con un clic.
  const panel =
    user.role.code === ROLES.ESTUDIANTE
      ? null
      : {
          href: ROLE_HOME[user.role.code] ?? "/aula",
          label: [ROLES.ADMIN_EMPRESA, ROLES.SUPERVISOR].includes(user.role.code as never) ? "Panel empresarial" : "Administración",
        };

  const groups: NavGroup[] = [
    ...(panel
      ? [{ title: "Gestión", items: [{ href: panel.href, label: panel.label, icon: <IconSettings width={18} height={18} /> }] }]
      : []),
    {
      title: "Mi aprendizaje",
      items: [
        { href: "/aula", label: "Inicio", icon: <IconHome width={18} height={18} />, exact: true },
        { href: "/aula/cursos", label: "Mis cursos", icon: <IconBook width={18} height={18} /> },
        { href: "/aula/certificados", label: "Mis certificados", icon: <IconAward width={18} height={18} /> },
        { href: "/aula/logros", label: "Logros y puntos", icon: <IconSpark width={18} height={18} /> },
      ],
    },
    {
      title: "Cuenta",
      items: [
        { href: "/aula/notificaciones", label: "Notificaciones", icon: <IconBell width={18} height={18} /> },
        { href: "/aula/perfil", label: "Mi perfil", icon: <IconUsers width={18} height={18} /> },
      ],
    },
  ];

  return (
    <AppShell
      groups={groups}
      area="Aula virtual"
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
