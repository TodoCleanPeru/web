import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Trash2, Plus, ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { parseService, Service, FAQ } from "@/types/service";
import { useQueryClient } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";

const empty: Partial<Service> = {
  slug: "", title: "", subtitle: "", short_description: "", long_description: "",
  hero_image_url: "", gallery: [], accent_color: "#0EA5E9", price_from: null, show_price: true,
  includes: [], benefits: [], ideal_for: [], faqs: [], category: "", sort_order: 0, is_active: true,
  video_url: "", brand_logo_url: "", custom_sections: [],
};

type CustomSection = { title: string; content: string; media_url?: string };
type ServiceForm = Partial<Service>;
type ServicePayload = Database["public"]["Tables"]["services"]["Insert"];

const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function AdminServiceEditor() {
  const { id } = useParams<{ id?: string }>();
  const isNew = !id;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [s, setS] = useState<ServiceForm>(empty);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (!id) return;
    supabase.from("services").select("*").eq("id", id).single().then(({ data }) => {
      if (data) setS(parseService(data));
      setLoading(false);
    });
  }, [id]);

  const update = (patch: Partial<ServiceForm>) => setS((current) => ({ ...current, ...patch }));

  const save = async () => {
    const payload: ServicePayload = {
      slug: s.slug || slugify(s.title),
      title: s.title,
      subtitle: s.subtitle || null,
      short_description: s.short_description || null,
      long_description: s.long_description || null,
      hero_image_url: s.hero_image_url || null,
      gallery: s.gallery ?? [],
      accent_color: s.accent_color || "#0EA5E9",
      price_from: s.price_from ? Number(s.price_from) : null,
      show_price: !!s.show_price,
      includes: s.includes ?? [],
      benefits: s.benefits ?? [],
      ideal_for: s.ideal_for ?? [],
      faqs: s.faqs ?? [],
      category: s.category || null,
      sort_order: Number(s.sort_order) || 0,
      is_active: !!s.is_active,
      video_url: s.video_url || null,
      brand_logo_url: s.brand_logo_url || null,
      custom_sections: Array.isArray(s.custom_sections) ? s.custom_sections : [],
    };
    if (!payload.title) { toast.error("El título es obligatorio"); return; }
    const q = isNew
      ? supabase.from("services").insert(payload).select().single()
      : supabase.from("services").update(payload).eq("id", id!).select().single();
    const { data, error } = await q;
    if (error) { toast.error(error.message); return; }
    toast.success("Guardado");
    qc.invalidateQueries({ queryKey: ["services"] });
    if (isNew && data) navigate(`/admin/servicios/${data.id}/editar`);
  };

  const remove = async () => {
    if (!confirm("¿Eliminar este servicio?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id!);
    if (error) { toast.error(error.message); return; }
    toast.success("Eliminado");
    qc.invalidateQueries({ queryKey: ["services"] });
    navigate("/admin/servicios");
  };

  if (loading) return <div className="text-muted-foreground">Cargando…</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link to="/admin/servicios" className="text-sm text-muted-foreground inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Volver</Link>
        <div className="flex gap-2">
          {!isNew && s.slug && (
            <Button asChild variant="outline" size="sm">
              <a href={`/servicios/${s.slug}`} target="_blank" rel="noreferrer"><Eye /> Vista previa</a>
            </Button>
          )}
          {!isNew && <Button variant="ghost" size="sm" onClick={remove}><Trash2 /> Eliminar</Button>}
          <Button variant="hero" onClick={save}>Guardar</Button>
        </div>
      </div>

      <h1 className="font-display text-3xl">{isNew ? "Nuevo servicio" : s.title}</h1>

      <Section title="General">
        <div className="grid sm:grid-cols-2 gap-4">
          <F label="Título *"><Input value={s.title ?? ""} onChange={(e) => update({ title: e.target.value, slug: s.slug || slugify(e.target.value) })} /></F>
          <F label="Slug (URL)"><Input value={s.slug ?? ""} onChange={(e) => update({ slug: slugify(e.target.value) })} /></F>
          <F label="Subtítulo"><Input value={s.subtitle ?? ""} onChange={(e) => update({ subtitle: e.target.value })} /></F>
          <F label="Categoría"><Input value={s.category ?? ""} onChange={(e) => update({ category: e.target.value })} /></F>
        </div>
        <F label="Descripción corta"><Textarea rows={2} value={s.short_description ?? ""} onChange={(e) => update({ short_description: e.target.value })} /></F>
        <F label="Descripción larga"><Textarea rows={4} value={s.long_description ?? ""} onChange={(e) => update({ long_description: e.target.value })} /></F>
      </Section>

      <Section title="Visual">
        <div className="grid sm:grid-cols-3 gap-4">
          <F label="Imagen principal (URL)"><Input value={s.hero_image_url ?? ""} onChange={(e) => update({ hero_image_url: e.target.value })} placeholder="https://..." /></F>
          <F label="Color de acento"><div className="flex gap-2"><Input type="color" value={s.accent_color ?? "#0EA5E9"} onChange={(e) => update({ accent_color: e.target.value })} className="w-16 p-1 h-10" /><Input value={s.accent_color ?? ""} onChange={(e) => update({ accent_color: e.target.value })} /></div></F>
          <F label="Orden"><Input type="number" value={s.sort_order ?? 0} onChange={(e) => update({ sort_order: Number(e.target.value) || 0 })} /></F>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <F label="Video principal (URL, opcional)"><Input value={s.video_url ?? ""} onChange={(e) => update({ video_url: e.target.value })} placeholder="https://...mp4" /></F>
          <F label="Logo de la marca (URL, opcional)"><Input value={s.brand_logo_url ?? ""} onChange={(e) => update({ brand_logo_url: e.target.value })} placeholder="https://...png" /></F>
        </div>
        <ArrayEditor label="Galería (URLs)" items={s.gallery ?? []} onChange={(v) => update({ gallery: v })} placeholder="https://imagen.jpg" />
      </Section>

      <Section title="Precio & estado">
        <div className="grid sm:grid-cols-3 gap-4 items-end">
          <F label="Precio desde (S/)"><Input type="number" step="0.01" value={s.price_from ?? ""} onChange={(e) => update({ price_from: e.target.value === "" ? null : Number(e.target.value) })} /></F>
          <ToggleRow label="Mostrar precio" checked={!!s.show_price} onChange={(v) => update({ show_price: v })} />
          <ToggleRow label="Servicio activo" checked={!!s.is_active} onChange={(v) => update({ is_active: v })} />
        </div>
      </Section>

      <Section title="Contenido">
        <ArrayEditor label="Qué incluye" items={s.includes ?? []} onChange={(v) => update({ includes: v })} />
        <ArrayEditor label="Beneficios" items={s.benefits ?? []} onChange={(v) => update({ benefits: v })} />
        <ArrayEditor label="Ideal para" items={s.ideal_for ?? []} onChange={(v) => update({ ideal_for: v })} />
        <FaqEditor items={s.faqs ?? []} onChange={(v) => update({ faqs: v })} />
      </Section>

      <Section title="Secciones adicionales">
        <SectionsEditor items={(s.custom_sections ?? []) as CustomSection[]} onChange={(v) => update({ custom_sections: v })} />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-3xl p-6 border border-border/60 shadow-soft space-y-4">
      <h2 className="font-display text-xl">{title}</h2>
      {children}
    </div>
  );
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-sm">{label}</Label>{children}</div>;
}
function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return <div className="flex items-center justify-between bg-muted/50 rounded-xl px-4 py-3"><span className="text-sm font-medium">{label}</span><Switch checked={checked} onCheckedChange={onChange} /></div>;
}

function ArrayEditor({ label, items, onChange, placeholder }: { label: string; items: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      {items.map((it, i) => (
        <div key={i} className="flex gap-2">
          <Input value={it} placeholder={placeholder} onChange={(e) => { const c = [...items]; c[i] = e.target.value; onChange(c); }} />
          <Button type="button" variant="ghost" size="icon" onClick={() => onChange(items.filter((_, j) => j !== i))}><Trash2 /></Button>
        </div>
      ))}
      <Button type="button" variant="soft" size="sm" onClick={() => onChange([...items, ""])}><Plus /> Agregar</Button>
    </div>
  );
}

function SectionsEditor({ items, onChange }: { items: CustomSection[]; onChange: (v: CustomSection[]) => void }) {
  const patch = (i: number, p: Partial<CustomSection>) => onChange(items.map((x, j) => (j === i ? { ...x, ...p } : x)));
  return (
    <div className="space-y-3">
      <Label className="text-sm">Bloques de texto e imagen propios de este servicio</Label>
      {items.map((sec, i) => (
        <div key={i} className="bg-muted/50 rounded-xl p-3 space-y-2">
          <div className="flex gap-2">
            <Input placeholder="Título del bloque" value={sec.title ?? ""} onChange={(e) => patch(i, { title: e.target.value })} />
            <Button type="button" variant="ghost" size="icon" onClick={() => onChange(items.filter((_, j) => j !== i))}><Trash2 /></Button>
          </div>
          <Textarea rows={4} placeholder="Texto" value={sec.content ?? ""} onChange={(e) => patch(i, { content: e.target.value })} />
          <Input placeholder="Imagen (URL, opcional)" value={sec.media_url ?? ""} onChange={(e) => patch(i, { media_url: e.target.value })} />
        </div>
      ))}
      <Button type="button" variant="soft" size="sm" onClick={() => onChange([...items, { title: "", content: "" }])}><Plus /> Agregar bloque</Button>
    </div>
  );
}

function FaqEditor({ items, onChange }: { items: FAQ[]; onChange: (v: FAQ[]) => void }) {
  return (
    <div className="space-y-3">
      <Label className="text-sm">Preguntas frecuentes</Label>
      {items.map((f, i) => (
        <div key={i} className="bg-muted/50 rounded-xl p-3 space-y-2">
          <div className="flex gap-2">
            <Input placeholder="Pregunta" value={f.q} onChange={(e) => { const c = [...items]; c[i] = { ...c[i], q: e.target.value }; onChange(c); }} />
            <Button type="button" variant="ghost" size="icon" onClick={() => onChange(items.filter((_, j) => j !== i))}><Trash2 /></Button>
          </div>
          <Textarea rows={2} placeholder="Respuesta" value={f.a} onChange={(e) => { const c = [...items]; c[i] = { ...c[i], a: e.target.value }; onChange(c); }} />
        </div>
      ))}
      <Button type="button" variant="soft" size="sm" onClick={() => onChange([...items, { q: "", a: "" }])}><Plus /> Agregar pregunta</Button>
    </div>
  );
}
