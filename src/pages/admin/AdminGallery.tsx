import { useState } from "react";
import { Plus, Trash2, Eye, EyeOff, Upload, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAllGallery, GalleryImage } from "@/hooks/useGallery";

export default function AdminGallery() {
  const { data: images } = useAllGallery();
  const qc = useQueryClient();
  const refresh = () => qc.invalidateQueries({ queryKey: ["gallery"] });
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const addByUrl = async () => {
    const v = url.trim();
    if (!v) return;
    const nextOrder = (images?.at(-1)?.sort_order ?? -1) + 1;
    const { error } = await supabase.from("gallery_images").insert({ image_url: v, sort_order: nextOrder });
    if (error) toast.error(error.message);
    else { toast.success("Imagen agregada"); setUrl(""); refresh(); }
  };

  const handleFile = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("gallery").upload(path, file, { upsert: false });
    if (error) { toast.error(error.message); setUploading(false); return; }
    const { data } = supabase.storage.from("gallery").getPublicUrl(path);
    const nextOrder = (images?.at(-1)?.sort_order ?? -1) + 1;
    const { error: e2 } = await supabase.from("gallery_images").insert({ image_url: data.publicUrl, sort_order: nextOrder });
    if (e2) toast.error(e2.message); else { toast.success("Imagen subida"); refresh(); }
    setUploading(false);
  };

  const toggle = async (img: GalleryImage) => {
    const { error } = await supabase.from("gallery_images").update({ is_active: !img.is_active }).eq("id", img.id);
    if (error) toast.error(error.message); else refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar esta imagen del carrusel?")) return;
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Eliminada"); refresh(); }
  };

  const move = async (idx: number, dir: -1 | 1) => {
    if (!images) return;
    const target = idx + dir;
    if (target < 0 || target >= images.length) return;
    const a = images[idx], b = images[target];
    const { error } = await supabase.from("gallery_images").upsert([
      { id: a.id, sort_order: b.sort_order, image_url: a.image_url },
      { id: b.id, sort_order: a.sort_order, image_url: b.image_url },
    ]);
    if (error) toast.error(error.message); else refresh();
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl mb-1">Galería (Carrusel del inicio)</h1>
        <p className="text-muted-foreground text-sm">Gestiona las imágenes del carrusel "Trabajo real, resultados reales" en la página principal.</p>
      </div>

      <div className="bg-card rounded-3xl border border-border/60 shadow-soft p-6 mb-6">
        <div className="grid sm:grid-cols-[1fr_auto_auto] gap-3 items-end">
          <div>
            <label className="text-sm font-medium mb-1 block">Agregar desde URL</label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
          </div>
          <Button onClick={addByUrl} variant="hero"><Plus /> Agregar</Button>
          <label className="inline-flex">
            <Button type="button" variant="outline" asChild>
              <span className="cursor-pointer">
                <Upload /> {uploading ? "Subiendo…" : "Subir archivo"}
              </span>
            </Button>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </label>
        </div>
      </div>

      <div className="bg-card rounded-3xl border border-border/60 shadow-soft overflow-hidden">
        {!images || images.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground text-sm">Aún no hay imágenes.</div>
        ) : images.map((img, i) => (
          <div key={img.id} className="flex items-center gap-4 p-4 border-b border-border/60 last:border-0">
            <div className="w-20 h-20 rounded-xl bg-muted overflow-hidden shrink-0">
              <img src={img.image_url} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground truncate">{img.image_url}</div>
              <div className="text-xs text-muted-foreground mt-1">Orden: {img.sort_order}</div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => move(i, -1)} disabled={i === 0}><ArrowUp /></Button>
            <Button variant="ghost" size="sm" onClick={() => move(i, 1)} disabled={i === images.length - 1}><ArrowDown /></Button>
            <Button variant="ghost" size="sm" onClick={() => toggle(img)} title={img.is_active ? "Desactivar" : "Activar"}>
              {img.is_active ? <Eye /> : <EyeOff />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => remove(img.id)}><Trash2 /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
