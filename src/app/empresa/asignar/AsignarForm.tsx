"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui";
import { IconCheck, IconAlert, IconClipboard, IconSearch } from "@/components/Icons";

type Course = { id: string; title: string; code: string; durationHours: number; status: string };
type Member = {
  userId: string;
  name: string;
  email: string;
  areaId: string | null;
  areaName: string;
  position: string;
  employeeCode: string;
};

export function AsignarForm({
  companyId,
  courses,
  members,
  areas,
  existentes,
}: {
  companyId: string;
  courses: Course[];
  members: Member[];
  areas: { id: string; name: string }[];
  existentes: string[];
}) {
  const router = useRouter();
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [dueDate, setDueDate] = useState("");
  const [mandatory, setMandatory] = useState(true);
  const [batchName, setBatchName] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [q, setQ] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const yaAsignado = useMemo(() => new Set(existentes), [existentes]);

  const visibles = useMemo(
    () =>
      members.filter(
        (m) =>
          (!areaFilter || m.areaId === areaFilter) &&
          (!q ||
            m.name.toLowerCase().includes(q.toLowerCase()) ||
            m.email.toLowerCase().includes(q.toLowerCase()) ||
            m.employeeCode.toLowerCase().includes(q.toLowerCase()))
      ),
    [members, areaFilter, q]
  );

  function toggle(id: string) {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  function toggleAll() {
    const disponibles = visibles.filter((m) => !yaAsignado.has(`${courseId}:${m.userId}`));
    const todos = disponibles.every((m) => selected.has(m.userId));
    setSelected((s) => {
      const n = new Set(s);
      disponibles.forEach((m) => (todos ? n.delete(m.userId) : n.add(m.userId)));
      return n;
    });
  }

  async function asignar() {
    setLoading(true);
    setMsg(null);
    const res = await fetch("/api/empresa/asignar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyId,
        courseId,
        userIds: [...selected],
        dueDate: dueDate || null,
        isMandatory: mandatory,
        batchName: batchName || null,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) return setMsg({ ok: false, text: data.error ?? "No fue posible asignar" });
    setMsg({
      ok: true,
      text: `${data.creadas} asignacion(es) creada(s). ${data.omitidas} ya existian.`,
    });
    setSelected(new Set());
    router.refresh();
  }

  const curso = courses.find((c) => c.id === courseId);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      {/* Lista de trabajadores */}
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-navy-50 bg-navy-50/40 px-5 py-4">
          <div className="relative min-w-[200px] flex-1">
            <IconSearch
              width={15}
              height={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-300"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar trabajador"
              className="input py-2 pl-9 text-sm"
            />
          </div>
          <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)} className="select py-2 text-sm">
            <option value="">Todas las areas</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <button onClick={toggleAll} className="btn-outline btn-sm">
            Seleccionar visibles
          </button>
        </div>

        <div className="max-h-[520px] overflow-y-auto">
          <table className="table-kg">
            <thead>
              <tr>
                <th className="w-10" />
                <th>Trabajador</th>
                <th>Area / Cargo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((m) => {
                const ya = yaAsignado.has(`${courseId}:${m.userId}`);
                const check = selected.has(m.userId);
                return (
                  <tr
                    key={m.userId}
                    onClick={() => !ya && toggle(m.userId)}
                    className={ya ? "opacity-50" : "cursor-pointer"}
                  >
                    <td>
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-md border-2 ${
                          check ? "border-lime-500 bg-lime-500 text-white" : "border-navy-200"
                        }`}
                      >
                        {check && <IconCheck width={11} height={11} strokeWidth={4} />}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar first={m.name.split(" ")[0]} last={m.name.split(" ").pop()} size={30} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-navy-700">{m.name}</p>
                          <p className="truncate text-[11px] text-navy-400">{m.employeeCode || m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-xs text-navy-500">
                      {m.areaName}
                      <span className="block text-[11px] text-navy-300">{m.position}</span>
                    </td>
                    <td>
                      {ya ? (
                        <span className="badge-slate">Ya asignado</span>
                      ) : (
                        <span className="badge-green">Disponible</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {visibles.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-sm text-navy-300">
                    No hay trabajadores que coincidan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Configuracion de la asignacion */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-700 text-lime-400">
              <IconClipboard width={19} height={19} />
            </span>
            <p className="font-display text-base font-bold text-navy-700">Configuracion</p>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="label">Curso a asignar</label>
              <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="select">
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.title}
                  </option>
                ))}
              </select>
              {curso && (
                <p className="mt-1.5 text-[11px] text-navy-400">
                  {curso.durationHours} horas &middot; estado {curso.status}
                </p>
              )}
            </div>

            <div>
              <label className="label">Nombre del lote (opcional)</label>
              <input
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                className="input"
                placeholder="Ej: Brigada de emergencias 2026"
              />
            </div>

            <div>
              <label className="label">Fecha limite</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input" />
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-navy-50/70 p-3 text-sm text-navy-600">
              <input
                type="checkbox"
                checked={mandatory}
                onChange={(e) => setMandatory(e.target.checked)}
                className="h-4 w-4 accent-lime-500"
              />
              Curso obligatorio
            </label>
          </div>

          <div className="mt-6 rounded-xl bg-kg-gradient p-4 text-center text-white">
            <p className="font-display text-3xl font-extrabold text-lime-400">{selected.size}</p>
            <p className="text-[11px] text-white/60">trabajador(es) seleccionado(s)</p>
          </div>

          {msg && (
            <div
              className={`mt-4 flex items-start gap-2.5 rounded-xl border p-3 text-xs ${
                msg.ok ? "border-lime-200 bg-lime-50 text-lime-800" : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {msg.ok ? <IconCheck width={16} height={16} strokeWidth={3} /> : <IconAlert width={16} height={16} />}
              {msg.text}
            </div>
          )}

          <button onClick={asignar} disabled={loading || selected.size === 0} className="btn-lime mt-5 w-full py-3">
            {loading ? "Asignando..." : `Asignar a ${selected.size} trabajador(es)`}
          </button>
          <p className="mt-3 text-[11px] leading-relaxed text-navy-400">
            Cada trabajador recibe una notificacion interna y se crea su matricula con estado &quot;no
            iniciado&quot;. Todo queda registrado en el lote de asignacion para auditoria.
          </p>
        </div>
      </aside>
    </div>
  );
}
