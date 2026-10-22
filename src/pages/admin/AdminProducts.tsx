import { Link } from "react-router-dom";
import { Plus, Edit3, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAllProducts } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function AdminProducts() {
  const { data: products } = useAllProducts();
  const qc = useQueryClient();
  const refresh = () => qc.invalidateQueries({ queryKey: ["products"] });

  const toggle = async (id: string, current: boolean) => {
    const { error } = await supabase.from("products").update({ is_active: !current }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Actualizado"); refresh(); }
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Eliminado"); refresh(); }
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl mb-1">Tienda (Amor Bello Muack)</h1>
          <p className="text-muted-foreground text-sm">Gestiona los productos de ropa oversize.</p>
        </div>
        <Button asChild variant="hero">
          <Link to="/admin/tienda/nuevo"><Plus /> Nuevo producto</Link>
        </Button>
      </div>

      <div className="bg-card rounded-3xl border border-border/60 shadow-soft overflow-hidden">
        {!products || products.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground text-sm">Aún no hay productos.</div>
        ) : products.map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-4 border-b border-border/60 last:border-0">
            <div className="w-14 h-14 rounded-xl bg-muted overflow-hidden shrink-0">
              {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{p.name}</div>
              <div className="text-xs text-muted-foreground">S/ {p.price.toFixed(2)} · {p.sizes.length} tallas · {p.colors.length} colores</div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => toggle(p.id, p.is_active)} title={p.is_active ? "Desactivar" : "Activar"}>
              {p.is_active ? <Eye /> : <EyeOff />}
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to={`/admin/tienda/${p.id}/editar`}><Edit3 /></Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => remove(p.id)}><Trash2 /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
