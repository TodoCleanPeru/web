import { useCallback, useEffect, useState } from "react";
import { Trash2, ExternalLink, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SITE, waLink } from "@/lib/constants";
import { toast } from "sonner";

type Tab = "contact_requests" | "job_applications";

type RequestRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  district: string | null;
  service_slug: string | null;
  message: string | null;
  status: string;
  created_at: string;
  preferred_date?: string | null;
  experience?: string | null;
  availability?: string | null;
};

export function AdminRequestsList({ table, title }: { table: Tab; title: string }) {
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from(table).select("*").order("created_at", { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  }, [table]);
  useEffect(() => { load(); }, [load]);

  const markDone = async (id: string) => {
    await supabase.from(table).update({ status: "done" }).eq("id", id);
    toast.success("Marcado como atendido");
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("¿Eliminar?")) return;
    await supabase.from(table).delete().eq("id", id);
    load();
  };

  return (
    <div className="max-w-5xl">
      <h1 className="font-display text-3xl mb-2">{title}</h1>
      <p className="text-muted-foreground mb-8 text-sm">{rows.length} en total</p>

      {loading ? <div className="text-muted-foreground">Cargando…</div> : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="bg-card rounded-2xl border border-border/60 shadow-soft p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{r.name}</span>
                    {r.status === "new" ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary-soft text-primary">Nuevo</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Atendido</span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {r.phone} {r.email && `• ${r.email}`} {r.district && `• ${r.district}`}
                  </div>
                  {r.service_slug && <div className="text-xs"><span className="text-muted-foreground">Servicio:</span> <span className="font-medium">{r.service_slug}</span></div>}
                  {r.preferred_date && <div className="text-xs"><span className="text-muted-foreground">Fecha:</span> {r.preferred_date}</div>}
                  {r.experience && <div className="text-xs"><span className="text-muted-foreground">Experiencia:</span> {r.experience}</div>}
                  {r.availability && <div className="text-xs"><span className="text-muted-foreground">Disponibilidad:</span> {r.availability}</div>}
                  {r.message && <p className="text-sm mt-2 bg-muted/50 rounded-lg p-3">{r.message}</p>}
                  <div className="text-xs text-muted-foreground pt-1">{new Date(r.created_at).toLocaleString("es-PE")}</div>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <Button asChild variant="whatsapp" size="sm">
                    <a href={waLink(`Hola ${r.name}, te contacto desde ${SITE.name}.`)} target="_blank" rel="noreferrer">
                      <ExternalLink /> WhatsApp
                    </a>
                  </Button>
                  {r.status === "new" && <Button variant="soft" size="sm" onClick={() => markDone(r.id)}><Check /> Atendido</Button>}
                  <Button variant="ghost" size="sm" onClick={() => remove(r.id)}><Trash2 /></Button>
                </div>
              </div>
            </div>
          ))}
          {rows.length === 0 && <div className="text-center text-muted-foreground py-10">Aún no hay registros.</div>}
        </div>
      )}
    </div>
  );
}

export const AdminContacts = () => <AdminRequestsList table="contact_requests" title="Solicitudes de contacto" />;
export const AdminApplications = () => <AdminRequestsList table="job_applications" title="Postulaciones" />;
