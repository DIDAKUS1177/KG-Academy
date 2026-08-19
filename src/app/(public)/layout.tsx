import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BotonWhatsApp } from "@/components/Contacto";
import { getCurrentUser } from "@/lib/auth";
import { ROLE_HOME } from "@/lib/constants";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const session = user
    ? { name: user.firstName, home: ROLE_HOME[user.role.code] ?? "/aula" }
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader session={session} />
      <div className="flex-1">{children}</div>
      <SiteFooter />
      <BotonWhatsApp />
    </div>
  );
}
