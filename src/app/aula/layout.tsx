import { AppShell, type NavGroup } from "@/components/AppShell";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ROLE_LABEL } from "@/lib/constants";
import {
  IconHome,
  IconBook,
  IconAward,
  IconUsers,
  IconBell,
  IconSpark,
} from "@/components/Icons";

export default async function AulaLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const unread = await prisma.notification.count({ where: { userId: user.id, isRead: false } });

  const groups: NavGroup[] = [
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
