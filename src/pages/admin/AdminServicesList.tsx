import { Link } from "react-router-dom";
import { Plus, Edit3, Eye, EyeOff, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAllServices } from "@/hooks/useServices";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function AdminServicesList() {
  const { data: services } = useAllServices();
  const qc = useQueryClient();

  const refresh = () => qc.invalidateQueries({ queryKey: ["services"] });

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase.from("services").update({ is_active: !current }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Actualizado"); refresh(); }
  };

  const move = async (id: string, dir: -1 | 1) => {
    const list = services ?? [];
    const idx = list.findIndex((s) => s.id === id);
    const swap = list[idx + dir];
    if (!swap) return;
    await Promise.all([
      supabase.from("services").update({ sort_order: swap.sort_order }).eq("id", id),
      supabase.from("services").update({ sort_order: list[idx].sort_order }).eq("id", swap.id),
    ]);
    refresh();
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl mb-1">Servicios</h1>
          <p className="text-muted-foreground text-sm">Crea, edita y ordena los servicios del sitio.</p>
        </div>
        <Button asChild variant="hero">
          <Link to="/admin/servicios/nuevo"><Plus /> Nuevo servicio</Link>
        </Button>
      </div>

      <div className="bg-card rounded-3xl border border-border/60 shadow-soft overflow-hidden">
        {services?.map((s, i) => (
          <div key={s.id} className="flex items-center gap-4 p-4 border-b border-border/60 last:border-0">
            <div className="w-3 h-12 rounded-full" style={{ background: s.accent_color }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium truncate">{s.title}</span>
                {!s.is_active && <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Inactivo</span>}
              </div>
              <div className="text-xs text-muted-foreground truncate">/servicios/{s.slug}</div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => move(s.id, -1)} disabled={i === 0}><ArrowUp /></Button>
              <Button variant="ghost" size="icon" onClick={() => move(s.id, 1)} disabled={i === (services.length - 1)}><ArrowDown /></Button>
              <Button variant="ghost" size="icon" onClick={() => toggleActive(s.id, s.is_active)}>
                {s.is_active ? <Eye /> : <EyeOff />}
              </Button>
              <Button asChild variant="soft" size="sm">
                <Link to={`/admin/servicios/${s.id}/editar`}><Edit3 /> Editar</Link>
              </Button>
            </div>
          </div>
        ))}
        {services?.length === 0 && (
          <div className="p-10 text-center text-muted-foreground text-sm">No hay servicios todavía.</div>
        )}
      </div>
    </div>
  );
}
