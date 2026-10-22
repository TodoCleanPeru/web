import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SiteLayout } from "@/components/SiteLayout";
import { useActiveServices } from "@/hooks/useServices";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  document: z.string().trim().max(20).optional(),
  phone: z.string().trim().min(6).max(20),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  district: z.string().trim().max(100).optional(),
  service_slug: z.string().optional(),
  experience: z.string().trim().max(1000).optional(),
  availability: z.string().trim().max(255).optional(),
  message: z.string().trim().max(1000).optional(),
});
type FormData = z.infer<typeof schema>;

export default function Apply() {
  const [params] = useSearchParams();
  const { data: services } = useActiveServices();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "", document: "", phone: "", email: "", district: "",
      service_slug: params.get("servicio") || "",
      experience: "", availability: "", message: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    const { error } = await supabase.from("job_applications").insert({
      name: values.name,
      document: values.document || null,
      phone: values.phone,
      email: values.email || null,
      district: values.district || null,
      service_slug: values.service_slug || null,
      experience: values.experience || null,
      availability: values.availability || null,
      message: values.message || null,
    });
    if (error) {
      toast.error("No pudimos enviar tu postulación.");
      return;
    }
    setSubmitted(true);
    toast.success("¡Postulación recibida!");
  };

  if (submitted) {
    return (
      <SiteLayout>
        <section className="container py-20 max-w-xl text-center">
          <div className="w-20 h-20 rounded-full bg-primary-soft flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-3xl lg:text-4xl mb-3">¡Gracias por postular!</h1>
          <p className="text-muted-foreground mb-8">
            Recibimos tu postulación. Revisaremos tu perfil y te contactaremos si encaja con nuestras vacantes.
          </p>
          <Button asChild variant="outline" size="lg"><Link to="/">Volver al inicio</Link></Button>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="bg-gradient-hero py-14">
        <div className="container max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-soft mb-4">
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium">Trabaja con nosotros</span>
          </div>
          <h1 className="font-display text-4xl lg:text-5xl mb-3 text-balance">
            Trabaja con Todo Clean Perú
          </h1>
          <p className="text-muted-foreground text-lg">
            Únete a nuestra red de personal confiable y capacitado.
          </p>
        </div>
      </section>

      <section className="container py-12 max-w-2xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="bg-card rounded-3xl p-6 lg:p-10 border border-border/60 shadow-card space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Nombre completo *" error={form.formState.errors.name?.message}>
              <Input {...form.register("name")} placeholder="Tu nombre" />
            </Field>
            <Field label="DNI / Documento">
              <Input {...form.register("document")} placeholder="Opcional" />
            </Field>
            <Field label="Teléfono / WhatsApp *" error={form.formState.errors.phone?.message}>
              <Input {...form.register("phone")} placeholder="999 999 999" />
            </Field>
            <Field label="Correo (opcional)">
              <Input {...form.register("email")} type="email" placeholder="tu@correo.com" />
            </Field>
            <Field label="Distrito donde puedes trabajar">
              <Input {...form.register("district")} placeholder="Ej: Surco" />
            </Field>
            <Field label="Servicio en el que quieres trabajar">
              <Select value={form.watch("service_slug") || ""} onValueChange={(v) => form.setValue("service_slug", v)}>
                <SelectTrigger><SelectValue placeholder="Elige uno" /></SelectTrigger>
                <SelectContent>
                  {services?.map((s) => <SelectItem key={s.slug} value={s.slug}>{s.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Experiencia previa">
            <Textarea {...form.register("experience")} rows={3} placeholder="Cuéntanos brevemente tu experiencia." />
          </Field>
          <Field label="Disponibilidad horaria">
            <Input {...form.register("availability")} placeholder="Ej: lunes a viernes mañanas" />
          </Field>
          <Field label="Mensaje adicional">
            <Textarea {...form.register("message")} rows={3} />
          </Field>
          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Enviando..." : "Enviar postulación"}
          </Button>
        </form>
      </section>
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
