import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { encuentrosDe, finDe } from "@/lib/encuentros";
import { EmptyState, SectionTitle } from "@/components/ui";
import { IconPlay } from "@/components/Icons";
import { TarjetaEncuentro } from "@/components/Encuentros";

export const metadata: Metadata = { title: "Clases en vivo" };
export const dynamic = "force-dynamic";

/** Clases en vivo y materiales que la empresa le compartió a la persona. */
export default async function EncuentrosAula() {
  const user = await requireUser();
  const ahora = new Date();
  const todos = await encuentrosDe(user.id, { vigentes: false });
  const proximos = todos.filter((e) => finDe(e) > ahora);
  const anteriores = todos.filter((e) => finDe(e) <= ahora).reverse();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <SectionTitle
        eyebrow="Mi aprendizaje"
        title="Clases en vivo"
        description="Las clases, reuniones y grabaciones que su empresa le compartió. Toque «Unirse» a la hora indicada."
      />
      {proximos.length === 0 ? (
        <EmptyState
          icon={<IconPlay width={30} height={30} />}
          title="No tiene clases programadas"
          description="Cuando su empresa programe una clase o comparta una grabación, aparecerá aquí y le llegará una notificación."
        />
      ) : (
        <div className="space-y-3">
          {proximos.map((e) => (
            <TarjetaEncuentro key={e.id} e={e} ahora={ahora} />
          ))}
        </div>
      )}
      {anteriores.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-base font-bold text-navy-700">Anteriores (últimos 30 días)</h2>
          <div className="space-y-3 opacity-80">
            {anteriores.map((e) => (
              <TarjetaEncuentro key={e.id} e={e} ahora={ahora} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
