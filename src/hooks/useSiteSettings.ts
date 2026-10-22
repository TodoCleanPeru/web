import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type GeneralSettings = {
  name: string;
  tagline: string;
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  tiktok: string;
};

export type HomeSettings = {
  welcome_title: string;
  logo_url: string;
  team_image_url: string;
  badge_text: string;
  hero_title: string;
  hero_text: string;
  cta_primary: string;
  cta_secondary: string;
  social_proof: string;
  mission_eyebrow: string;
  mission_heading: string;
  mission_subheading: string;
  mission_title: string;
  mission_text: string;
  mission_highlight: string;
  vision_title: string;
  vision_text: string;
  vision_highlight: string;
  services_eyebrow: string;
  services_heading: string;
  steps_eyebrow: string;
  steps_heading: string;
  gallery_eyebrow: string;
  gallery_heading: string;
  gallery_text: string;
  testimonials_eyebrow: string;
  testimonials_heading: string;
  final_heading: string;
  final_text: string;
  benefits: { title: string; desc: string }[];
  steps: { n: string; t: string; d: string }[];
  testimonials: { name: string; role: string; text: string }[];
};

export type FooterSettings = {
  brand_title: string;
  brand_subtitle: string;
  description: string;
  copyright_suffix: string;
};

export const DEFAULT_GENERAL: GeneralSettings = {
  name: "Todo Clean Perú",
  tagline: "Servicios para tu hogar, tu familia y tu tranquilidad",
  whatsapp: "51999999999",
  phone: "+51 999 999 999",
  email: "contacto@todocleanperu.com",
  address: "Lima, Perú",
  instagram: "https://www.instagram.com/t0d0cleanperu/",
  facebook: "https://www.facebook.com/todocleanperu",
  tiktok: "https://www.tiktok.com/@todo.clean.peru",
};

export const DEFAULT_HOME: HomeSettings = {
  welcome_title: "¡Bienvenidos!",
  logo_url: "",
  team_image_url: "",
  badge_text: "Atendemos en todo Lima",
  hero_title: "✨ FÁCIL, SEGURA Y A TU MEDIDA ✨\n\n🧹 Limpieza integral y mucho más",
  hero_text: `Personal capacitado, verificado y 100% garantizado.

👉 Contamos con:

✅ Cocineras expertas

✅ Cuidado dedicado de adulto mayor

✅ Cuidado responsable de niños

✅ Atención y paseo de mascotas, y más soluciones para tus peluditos

✅ Soul Clean Perú: soluciones pensadas especialmente para mujeres

ℹ️ Aclaraciones:

- Ofrecemos contrato de locación de servicios. Brindamos soluciones profesionales, no comercializamos ni asignamos personas.

- Emitimos boleta y factura. Precios no incluyen IGV.

✅ ¡Conoce todos nuestros servicios!`,
  cta_primary: "Ver servicios",
  cta_secondary: "Cotizar por WhatsApp",
  social_proof: "+1,200 familias satisfechas",
  mission_eyebrow: "Quiénes somos",
  mission_heading: "Nacimos para ser diferentes",
  mission_subheading: "Una empresa peruana, moderna y humana, hecha para transformar tu día a día.",
  mission_title: "Nuestra Misión",
  mission_text: "Soluciones confiables de limpieza, cocina, cuidado y asistencia — rápidas, seguras y con calidez humana.",
  mission_highlight: "Creamos tranquilidad, confianza y calidad de vida. ✨",
  vision_title: "Nuestra Visión",
  vision_text: "Ser la empresa multiservicios líder del Perú, reconocida por innovar, cuidar y transformar hogares con excelencia.",
  vision_highlight: "No nacimos para ser uno más… nacimos para ser diferentes. 💫",
  services_eyebrow: "Nuestros servicios",
  services_heading: "Una sola empresa, todo lo que tu hogar necesita",
  steps_eyebrow: "Cómo funciona",
  steps_heading: "Tan fácil como contar hasta cuatro",
  gallery_eyebrow: "Nuestro equipo en acción",
  gallery_heading: "Trabajo real, resultados reales",
  gallery_text: "Personal uniformado, capacitado y comprometido con la excelencia en cada detalle.",
  testimonials_eyebrow: "Lo que dicen las familias",
  testimonials_heading: "Confianza que se siente en casa",
  final_heading: "Encuentra el servicio ideal para ti",
  final_text: "Cuéntanos qué necesitas y te ayudamos a encontrar la mejor opción para tu familia.",
  benefits: [
    { title: "Personal verificado", desc: "Antecedentes y referencias revisadas." },
    { title: "Atención rápida", desc: "Coordinamos en menos de 24 horas." },
    { title: "Trato cercano", desc: "Personas comprometidas con tu hogar." },
    { title: "Tarifas claras", desc: "Sin sorpresas, todo conversado de inicio." },
  ],
  steps: [
    { n: "01", t: "Elige el servicio", d: "Explora nuestros servicios y encuentra el ideal para ti." },
    { n: "02", t: "Coordina el horario", d: "Nos adaptamos a tu disponibilidad y necesidades." },
    { n: "03", t: "Recibe al personal ideal", d: "Asignamos a quien mejor encaje contigo y tu familia." },
    { n: "04", t: "Disfruta la tranquilidad", d: "Tú te enfocas en lo importante, nosotros del resto." },
  ],
  testimonials: [
    { name: "Carolina M.", role: "Surco, Lima", text: "Increíble la atención. Mi casa quedó impecable y el trato fue cercano y profesional desde el primer momento." },
    { name: "Roberto L.", role: "San Isidro", text: "Contraté el servicio de cuidado para mi mamá y por fin puedo trabajar tranquilo. Personal muy cariñoso y responsable." },
    { name: "Andrea F.", role: "Miraflores", text: "Llevo 6 meses con la limpieza semanal y nunca me ha fallado. Súper recomendados, son parte de la familia." },
  ],
};

export const DEFAULT_FOOTER: FooterSettings = {
  brand_title: "Todo Clean Perú",
  brand_subtitle: "Multiservicios",
  description: "Personal confiable, capacitado y verificado para ayudarte con limpieza, cuidado y bienestar familiar.",
  copyright_suffix: "Todos los derechos reservados.",
};

export type SiteSettings = {
  general: GeneralSettings;
  home: HomeSettings;
  footer: FooterSettings;
};

async function fetchSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase.from("site_settings").select("key,value");
  if (error) throw error;
  const map = new Map((data ?? []).map((r) => [r.key, r.value as Record<string, unknown>]));
  return {
    general: { ...DEFAULT_GENERAL, ...(map.get("general") ?? {}) } as GeneralSettings,
    home: { ...DEFAULT_HOME, ...(map.get("home") ?? {}) } as HomeSettings,
    footer: { ...DEFAULT_FOOTER, ...(map.get("footer") ?? {}) } as FooterSettings,
  };
}

export function useSiteSettings() {
  const query = useQuery({
    queryKey: ["site_settings"],
    queryFn: fetchSettings,
    staleTime: 60_000,
  });
  const settings: SiteSettings = query.data ?? {
    general: DEFAULT_GENERAL,
    home: DEFAULT_HOME,
    footer: DEFAULT_FOOTER,
  };
  return { ...query, settings };
}

export function useSaveSiteSettings() {
  const qc = useQueryClient();
  return async (key: string, value: unknown) => {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value: value as never }, { onConflict: "key" });
    if (error) throw error;
    await qc.invalidateQueries({ queryKey: ["site_settings"] });
  };
}

export const waFor = (whatsapp: string, msg: string) =>
  `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;
