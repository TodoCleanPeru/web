import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const empty = {
  name: "",
  description: "",
  price: 0,
  image_url: "",
  sizes: [] as string[],
  colors: [] as string[],
  is_active: true,
  sort_order: 0,
};

type ProductForm = typeof empty;

export default function AdminProductEditor() {
  const { id } = useParams<{ id?: string }>();
  const isNew = !id;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [p, setP] = useState<ProductForm>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from("products").select("*").eq("id", id).single().then(({ data }) => {
      if (data) setP({
        ...data,
        sizes: Array.isArray(data.sizes) ? data.sizes : [],
        colors: Array.isArray(data.colors) ? data.colors : [],
      });
      setLoading(false);
    });
  }, [id]);

  const update = (patch: Partial<ProductForm>) => setP((current) => ({ ...current, ...patch }));

  const handleUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("products").upload(path, file, { upsert: false });
    if (error) { toast.error(error.message); setUploading(false); return; }
    const { data } = supabase.storage.from("products").getPublicUrl(path);
    update({ image_url: data.publicUrl });
    setUploading(false);
    toast.success("Imagen subida");
  };

  const save = async () => {
    if (!p.name) { toast.error("El nombre es obligatorio"); return; }
    const payload = {
      name: p.name,
      description: p.description || null,
      price: Number(p.price) || 0,
      image_url: p.image_url || null,
      sizes: p.sizes ?? [],
      colors: p.colors ?? [],
      is_active: !!p.is_active,
      sort_order: Number(p.sort_order) || 0,
    };
    const q = isNew
      ? supabase.from("products").insert(payload).select().single()
      : supabase.from("products").update(payload).eq("id", id!).select().single();
    const { data, error } = await q;
    if (error) { toast.error(error.message); return; }
    toast.success("Guardado");
    qc.invalidateQueries({ queryKey: ["products"] });
    if (isNew && data) navigate(`/admin/tienda/${data.id}/editar`);
  };

  if (loading) return <div className="text-muted-foreground">Cargando…</div>;

  return (
    <div className="max-w-3xl">
      <Link to="/admin/tienda" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Volver
      </Link>
      <h1 className="font-display text-3xl mb-8">{isNew ? "Nuevo producto" : "Editar producto"}</h1>

      <div className="space-y-6 bg-card rounded-3xl border border-border/60 p-6 shadow-soft">
        <div>
          <Label>Nombre *</Label>
          <Input value={p.name} onChange={(e) => update({ name: e.target.value })} placeholder="Polo Oversize Crema" />
        </div>

        <div>
          <Label>Descripción</Label>
          <Textarea value={p.description ?? ""} onChange={(e) => update({ description: e.target.value })} rows={3} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Precio (S/) *</Label>
            <Input type="number" step="0.01" value={p.price} onChange={(e) => update({ price: e.target.value })} />
          </div>
          <div>
            <Label>Orden</Label>
            <Input type="number" value={p.sort_order} onChange={(e) => update({ sort_order: e.target.value })} />
          </div>
        </div>

        <div>
          <Label>Imagen del producto</Label>
          <div className="flex items-start gap-4 mt-2">
            {p.image_url ? (
              <div className="relative">
                <img src={p.image_url} alt="" className="w-32 h-32 rounded-xl object-cover border border-border" />
                <button
                  type="button"
                  onClick={() => update({ image_url: "" })}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="w-32 h-32 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-foreground transition-base">
                <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">{uploading ? "Subiendo…" : "Subir"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
              </label>
            )}
            <div className="flex-1">
              <Input value={p.image_url ?? ""} onChange={(e) => update({ image_url: e.target.value })} placeholder="O pega una URL" />
            </div>
          </div>
        </div>

        <TagInput
          label="Tallas disponibles"
          values={p.sizes}
          onChange={(v) => update({ sizes: v })}
          placeholder="S, M, L, XL"
          suggestions={["S", "M", "L", "XL", "XXL"]}
        />

        <TagInput
          label="Colores disponibles"
          values={p.colors}
          onChange={(v) => update({ colors: v })}
          placeholder="Negro, Beige, Blanco"
        />

        <div className="flex items-center justify-between">
          <Label>Activo (visible en la tienda)</Label>
          <Switch checked={p.is_active} onCheckedChange={(v) => update({ is_active: v })} />
        </div>

        <div className="flex gap-3 pt-2">
          <Button onClick={save} variant="hero">Guardar</Button>
          <Button asChild variant="ghost"><Link to="/admin/tienda">Cancelar</Link></Button>
        </div>
      </div>
    </div>
  );
}

function TagInput({
  label, values, onChange, placeholder, suggestions,
}: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string; suggestions?: string[] }) {
  const [input, setInput] = useState("");
  const add = (v: string) => {
    const t = v.trim();
    if (!t || values.includes(t)) return;
    onChange([...values, t]);
    setInput("");
  };
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-1.5 mb-2 mt-1">
        {values.map((v) => (
          <span key={v} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm">
            {v}
            <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} className="hover:text-destructive">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(input); } }}
          placeholder={placeholder}
        />
        <Button type="button" variant="outline" onClick={() => add(input)}>Añadir</Button>
      </div>
      {suggestions && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {suggestions.filter((s) => !values.includes(s)).map((s) => (
            <button key={s} type="button" onClick={() => add(s)} className="text-xs px-2 py-0.5 rounded-full border border-border hover:bg-muted">
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
