import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { SocialLinks } from "@/components/SocialLinks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SiteLayout } from "@/components/SiteLayout";
import { useActiveServices } from "@/hooks/useServices";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SITE, waLink } from "@/lib/constants";
import contactoEquipoAsset from "@/assets/equipo-todo-clean-despues.png.asset.json";

const schema = z.object({
  name: z.string().trim().min(2, "Ingresa tu nombre").max(100),
  phone: z.string().trim().min(6, "Ingresa un teléfono válido").max(20),
  email: z.string().trim().email("Correo inválido").max(255).optional().or(z.literal("")),
  district: z.string().trim().max(100).optional(),
  service_slug: z.string().optional(),
  preferred_date: z.string().max(100).optional(),
  message: z.string().trim().max(1000).optional(),
});

type FormData = z.infer<typeof schema>;

export default function Contact() {
  const [params] = useSearchParams();
  const { data: services } = useActiveServices();
  const [submitted, setSubmitted] = useState<FormData | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "", phone: "", email: "", district: "",
      service_slug: params.get("servicio") || "",
      preferred_date: "", message: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    const { error } = await supabase.from("contact_requests").insert({
      name: values.name,
      phone: values.phone,
      email: values.email || null,
      district: values.district || null,
      service_slug: values.service_slug || null,
      preferred_date: values.preferred_date || null,
      message: values.message || null,
    });
    if (error) {
      toast.error("No pudimos enviar tu solicitud. Intenta de nuevo.");
      return;
    }
    setSubmitted(values);
    toast.success("¡Solicitud enviada! Te contactaremos pronto.");
  };

  if (submitted) {
    const serviceTitle = services?.find((s) => s.slug === submitted.service_slug)?.title ?? "un servicio";
    const waMessage = `Hola ${SITE.name}, soy ${submitted.name}. Acabo de enviar una solicitud para ${serviceTitle}. ${submitted.message ?? ""}`.trim();
    return (
      <SiteLayout>
        <section className="container py-20 max-w-xl text-center">
          <div className="w-20 h-20 rounded-full bg-whatsapp/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-whatsapp" />
          </div>
          <h1 className="font-display text-3xl lg:text-4xl mb-3">¡Solicitud recibida!</h1>
          <p className="text-muted-foreground mb-8">
            Gracias {submitted.name}. Te contactaremos en menos de 24 horas para coordinar los detalles.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild variant="whatsapp" size="lg">
              <a href={waLink(waMessage)} target="_blank" rel="noreferrer">
                <MessageCircle /> Continuar por WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/servicios">Volver a servicios</Link>
            </Button>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="bg-gradient-hero py-14">
        <div className="container max-w-3xl text-center">
          <div className="text-sm font-medium text-primary mb-2">Contacto</div>
          <h1 className="font-display text-4xl lg:text-5xl mb-3 text-balance">
            Cuéntanos qué necesitas
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Te respondemos en menos de 24 horas con la mejor opción para ti.
          </p>
          <div className="w-full max-w-xl rounded-[2.5rem] overflow-hidden bg-white p-3 shadow-card border border-border/40 mx-auto">
            <img
              src={contactoEquipoAsset.url}
              alt="Equipo de Todo Clean Perú listos para atenderte"
              className="w-full h-auto object-cover rounded-[2rem]"
            />
          </div>
        </div>
      </section>

      <section className="container py-12 max-w-2xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="bg-card rounded-3xl p-6 lg:p-10 border border-border/60 shadow-card space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Nombre completo *" error={form.formState.errors.name?.message}>
              <Input {...form.register("name")} placeholder="Tu nombre" />
            </Field>
            <Field label="Teléfono / WhatsApp *" error={form.formState.errors.phone?.message}>
              <Input {...form.register("phone")} placeholder="999 999 999" />
            </Field>
            <Field label="Correo (opcional)" error={form.formState.errors.email?.message}>
              <Input {...form.register("email")} type="email" placeholder="tu@correo.com" />
            </Field>
            <Field label="Distrito o zona">
              <Input {...form.register("district")} placeholder="Ej: Miraflores" />
            </Field>
            <Field label="Servicio de interés">
              <Select
                value={form.watch("service_slug") || ""}
                onValueChange={(v) => form.setValue("service_slug", v)}
              >
                <SelectTrigger><SelectValue placeholder="Elige un servicio" /></SelectTrigger>
                <SelectContent>
                  {services?.map((s) => (
                    <SelectItem key={s.slug} value={s.slug}>{s.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Fecha u horario tentativo">
              <Input {...form.register("preferred_date")} placeholder="Ej: lunes por la mañana" />
            </Field>
          </div>
          <Field label="Mensaje adicional">
            <Textarea {...form.register("message")} rows={4} placeholder="Cuéntanos los detalles de lo que necesitas..." />
          </Field>
          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Enviando..." : "Enviar solicitud"}
          </Button>
        </form>
      </section>

      <SocialLinks
        profiles={[
          { name: "Instagram", url: "https://www.instagram.com/t0d0cleanperu/", handle: "@t0d0cleanperu", icon: "instagram" },
          { name: "TikTok", url: "https://www.tiktok.com/@todo.clean.peru", handle: "@todo.clean.peru", icon: "tiktok" },
        ]}
      />
    </SiteLayout>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
