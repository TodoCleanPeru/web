import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Loader2, Plus, Save, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  DEFAULT_FOOTER,
  DEFAULT_GENERAL,
  DEFAULT_HOME,
  useSaveSiteSettings,
  useSiteSettings,
  type FooterSettings,
  type GeneralSettings,
  type HomeSettings,
} from "@/hooks/useSiteSettings";

function Field({ label, value, onChange, textarea, rows }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {textarea ? (
        <Textarea value={value} rows={rows ?? 4} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function MediaField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
      const { error } = await supabase.storage.from("site-media").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("site-media").getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success("Archivo subido");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo subir el archivo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <div className="flex flex-wrap gap-2 items-center">
        <Input
          value={value}
          placeholder="Pega una dirección de imagen o sube un archivo"
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-[220px]"
        />
        <label className="inline-flex">
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
            }}
          />
          <span className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-border bg-card text-sm cursor-pointer hover:bg-muted">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Subir
          </span>
        </label>
      </div>
      {value && (
        <img src={value} alt="" className="h-24 w-auto rounded-xl border border-border/60 object-contain bg-white" />
      )}
      <p className="text-xs text-muted-foreground">Déjalo vacío para usar la imagen original del sitio.</p>
    </div>
  );
}

export default function AdminContent() {
  const { settings, isLoading } = useSiteSettings();
  const save = useSaveSiteSettings();

  const [general, setGeneral] = useState<GeneralSettings>(DEFAULT_GENERAL);
  const [home, setHome] = useState<HomeSettings>(DEFAULT_HOME);
  const [footer, setFooter] = useState<FooterSettings>(DEFAULT_FOOTER);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading) {
      setGeneral(settings.general);
      setHome(settings.home);
      setFooter(settings.footer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const doSave = async (key: string, value: unknown) => {
    setSaving(key);
    try {
      await save(key, value);
      toast.success("Cambios guardados");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo guardar");
    } finally {
      setSaving(null);
    }
  };

  const SaveBtn = ({ k, value }: { k: string; value: unknown }) => (
    <Button onClick={() => doSave(k, value)} disabled={saving === k}>
      {saving === k ? <Loader2 className="animate-spin" /> : <Save />} Guardar cambios
    </Button>
  );

  const set = <K extends keyof HomeSettings>(k: K, v: HomeSettings[K]) => setHome((h) => ({ ...h, [k]: v }));

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Contenido del sitio</h1>
          <p className="text-muted-foreground text-sm">Edita los textos, imágenes y datos de contacto que ven tus clientes.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/" target="_blank">Ver sitio <ExternalLink /></Link>
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="general">Datos y contacto</TabsTrigger>
          <TabsTrigger value="portada">Portada</TabsTrigger>
          <TabsTrigger value="bloques">Beneficios y testimonios</TabsTrigger>
          <TabsTrigger value="pie">Pie de página</TabsTrigger>
        </TabsList>

        {/* GENERAL */}
        <TabsContent value="general" className="space-y-4 pt-6">
          <Field label="Nombre de la empresa" value={general.name} onChange={(v) => setGeneral({ ...general, name: v })} />
          <Field label="Eslogan" value={general.tagline} onChange={(v) => setGeneral({ ...general, tagline: v })} />
          <Field label="WhatsApp (solo números, con código de país)" value={general.whatsapp} onChange={(v) => setGeneral({ ...general, whatsapp: v })} />
          <Field label="Teléfono visible" value={general.phone} onChange={(v) => setGeneral({ ...general, phone: v })} />
          <Field label="Correo" value={general.email} onChange={(v) => setGeneral({ ...general, email: v })} />
          <Field label="Dirección" value={general.address} onChange={(v) => setGeneral({ ...general, address: v })} />
          <Field label="Instagram" value={general.instagram} onChange={(v) => setGeneral({ ...general, instagram: v })} />
          <Field label="Facebook" value={general.facebook} onChange={(v) => setGeneral({ ...general, facebook: v })} />
          <Field label="TikTok" value={general.tiktok} onChange={(v) => setGeneral({ ...general, tiktok: v })} />
          <SaveBtn k="general" value={general} />
        </TabsContent>

        {/* PORTADA */}
        <TabsContent value="portada" className="space-y-4 pt-6">
          <Field label="Texto de bienvenida" value={home.welcome_title} onChange={(v) => set("welcome_title", v)} />
          <MediaField label="Logo de la portada" value={home.logo_url} onChange={(v) => set("logo_url", v)} />
          <MediaField label="Foto del equipo" value={home.team_image_url} onChange={(v) => set("team_image_url", v)} />
          <Field label="Etiqueta pequeña (cobertura)" value={home.badge_text} onChange={(v) => set("badge_text", v)} />
          <Field label="Título principal" value={home.hero_title} textarea rows={3} onChange={(v) => set("hero_title", v)} />
          <Field label="Texto principal" value={home.hero_text} textarea rows={14} onChange={(v) => set("hero_text", v)} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Botón 1" value={home.cta_primary} onChange={(v) => set("cta_primary", v)} />
            <Field label="Botón 2 (WhatsApp)" value={home.cta_secondary} onChange={(v) => set("cta_secondary", v)} />
          </div>
          <Field label="Frase de confianza" value={home.social_proof} onChange={(v) => set("social_proof", v)} />

          <h3 className="font-display text-lg pt-4">Misión y visión</h3>
          <Field label="Antetítulo" value={home.mission_eyebrow} onChange={(v) => set("mission_eyebrow", v)} />
          <Field label="Título de la sección" value={home.mission_heading} onChange={(v) => set("mission_heading", v)} />
          <Field label="Bajada" value={home.mission_subheading} onChange={(v) => set("mission_subheading", v)} />
          <Field label="Título misión" value={home.mission_title} onChange={(v) => set("mission_title", v)} />
          <Field label="Texto misión" value={home.mission_text} textarea onChange={(v) => set("mission_text", v)} />
          <Field label="Frase destacada misión" value={home.mission_highlight} onChange={(v) => set("mission_highlight", v)} />
          <Field label="Título visión" value={home.vision_title} onChange={(v) => set("vision_title", v)} />
          <Field label="Texto visión" value={home.vision_text} textarea onChange={(v) => set("vision_text", v)} />
          <Field label="Frase destacada visión" value={home.vision_highlight} onChange={(v) => set("vision_highlight", v)} />

          <h3 className="font-display text-lg pt-4">Otros títulos de la portada</h3>
          <Field label="Antetítulo servicios" value={home.services_eyebrow} onChange={(v) => set("services_eyebrow", v)} />
          <Field label="Título servicios" value={home.services_heading} onChange={(v) => set("services_heading", v)} />
          <Field label="Antetítulo pasos" value={home.steps_eyebrow} onChange={(v) => set("steps_eyebrow", v)} />
          <Field label="Título pasos" value={home.steps_heading} onChange={(v) => set("steps_heading", v)} />
          <Field label="Antetítulo galería" value={home.gallery_eyebrow} onChange={(v) => set("gallery_eyebrow", v)} />
          <Field label="Título galería" value={home.gallery_heading} onChange={(v) => set("gallery_heading", v)} />
          <Field label="Texto galería" value={home.gallery_text} textarea onChange={(v) => set("gallery_text", v)} />
          <Field label="Antetítulo testimonios" value={home.testimonials_eyebrow} onChange={(v) => set("testimonials_eyebrow", v)} />
          <Field label="Título testimonios" value={home.testimonials_heading} onChange={(v) => set("testimonials_heading", v)} />
          <Field label="Título del bloque final" value={home.final_heading} onChange={(v) => set("final_heading", v)} />
          <Field label="Texto del bloque final" value={home.final_text} textarea onChange={(v) => set("final_text", v)} />
          <SaveBtn k="home" value={home} />
        </TabsContent>

        {/* BLOQUES */}
        <TabsContent value="bloques" className="space-y-8 pt-6">
          <section className="space-y-4">
            <h3 className="font-display text-lg">Beneficios</h3>
            {home.benefits.map((b, i) => (
              <div key={i} className="rounded-2xl border border-border/60 p-4 space-y-3">
                <Field label="Título" value={b.title} onChange={(v) => set("benefits", home.benefits.map((x, j) => j === i ? { ...x, title: v } : x))} />
                <Field label="Descripción" value={b.desc} onChange={(v) => set("benefits", home.benefits.map((x, j) => j === i ? { ...x, desc: v } : x))} />
                <Button variant="ghost" size="sm" onClick={() => set("benefits", home.benefits.filter((_, j) => j !== i))}>
                  <Trash2 /> Quitar
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={() => set("benefits", [...home.benefits, { title: "", desc: "" }])}>
              <Plus /> Añadir beneficio
            </Button>
          </section>

          <section className="space-y-4">
            <h3 className="font-display text-lg">Pasos</h3>
            {home.steps.map((s, i) => (
              <div key={i} className="rounded-2xl border border-border/60 p-4 space-y-3">
                <Field label="Número" value={s.n} onChange={(v) => set("steps", home.steps.map((x, j) => j === i ? { ...x, n: v } : x))} />
                <Field label="Título" value={s.t} onChange={(v) => set("steps", home.steps.map((x, j) => j === i ? { ...x, t: v } : x))} />
                <Field label="Descripción" value={s.d} onChange={(v) => set("steps", home.steps.map((x, j) => j === i ? { ...x, d: v } : x))} />
                <Button variant="ghost" size="sm" onClick={() => set("steps", home.steps.filter((_, j) => j !== i))}>
                  <Trash2 /> Quitar
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={() => set("steps", [...home.steps, { n: "", t: "", d: "" }])}>
              <Plus /> Añadir paso
            </Button>
          </section>

          <section className="space-y-4">
            <h3 className="font-display text-lg">Testimonios</h3>
            {home.testimonials.map((t, i) => (
              <div key={i} className="rounded-2xl border border-border/60 p-4 space-y-3">
                <Field label="Nombre" value={t.name} onChange={(v) => set("testimonials", home.testimonials.map((x, j) => j === i ? { ...x, name: v } : x))} />
                <Field label="Distrito" value={t.role} onChange={(v) => set("testimonials", home.testimonials.map((x, j) => j === i ? { ...x, role: v } : x))} />
                <Field label="Comentario" value={t.text} textarea onChange={(v) => set("testimonials", home.testimonials.map((x, j) => j === i ? { ...x, text: v } : x))} />
                <Button variant="ghost" size="sm" onClick={() => set("testimonials", home.testimonials.filter((_, j) => j !== i))}>
                  <Trash2 /> Quitar
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={() => set("testimonials", [...home.testimonials, { name: "", role: "", text: "" }])}>
              <Plus /> Añadir testimonio
            </Button>
          </section>

          <SaveBtn k="home" value={home} />
        </TabsContent>

        {/* FOOTER */}
        <TabsContent value="pie" className="space-y-4 pt-6">
          <Field label="Nombre en el pie" value={footer.brand_title} onChange={(v) => setFooter({ ...footer, brand_title: v })} />
          <Field label="Subtítulo" value={footer.brand_subtitle} onChange={(v) => setFooter({ ...footer, brand_subtitle: v })} />
          <Field label="Descripción" value={footer.description} textarea onChange={(v) => setFooter({ ...footer, description: v })} />
          <Field label="Texto de derechos" value={footer.copyright_suffix} onChange={(v) => setFooter({ ...footer, copyright_suffix: v })} />
          <SaveBtn k="footer" value={footer} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
