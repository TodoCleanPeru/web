import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SocialLinks } from "@/components/SocialLinks";
import { ArrowRight, Sparkles, ShieldCheck, Clock, Heart, Star, Calendar, Users, Smile, Target, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { ServiceCard } from "@/components/ServiceCard";
import { useActiveServices } from "@/hooks/useServices";
import { useActiveGallery } from "@/hooks/useGallery";
import { useSiteSettings, waFor } from "@/hooks/useSiteSettings";
import logoAsset from "@/assets/logo_todo_clean_peru.png.asset.json";
import equipoAsset from "@/assets/equipo-todo-clean-despues.png.asset.json";

const benefitIcons = [ShieldCheck, Clock, Heart, Star];
const stepIcons = [Sparkles, Calendar, Users, Smile];

export default function Home() {
  const { data: services, isLoading } = useActiveServices();
  const { data: gallery } = useActiveGallery();
  const { settings } = useSiteSettings();
  const home = settings.home;
  const general = settings.general;
  const carouselImages = (gallery ?? []).map((g) => g.image_url);
  const [loadedCount, setLoadedCount] = useState(0);
  const allLoaded = carouselImages.length > 0 && loadedCount >= carouselImages.length;

  useEffect(() => {
    if (carouselImages.length === 0) return;
    let active = true;
    setLoadedCount(0);
    carouselImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (active) setLoadedCount((c) => c + 1);
      };
      img.onerror = () => {
        if (active) setLoadedCount((c) => c + 1);
      };
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gallery]);

  const socialProfiles = [
    general.instagram && { name: "Instagram", url: general.instagram, handle: "@t0d0cleanperu", icon: "instagram" as const },
    general.tiktok && { name: "TikTok", url: general.tiktok, handle: "@todo.clean.peru", icon: "tiktok" as const },
  ].filter(Boolean) as { name: string; url: string; handle: string; icon: "instagram" | "tiktok" }[];

  return (
    <SiteLayout>
      {/* BANNER DE BIENVENIDA */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary via-primary-glow to-emerald-500 text-primary-foreground">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,white,transparent_50%)]" />
        <div className="container py-8 sm:py-10 relative flex items-center justify-center">
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-center tracking-tight">
            {home.welcome_title}
          </h2>
        </div>
      </section>

      {/* LOGO + FOTO DEL EQUIPO */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container py-10 lg:py-16 flex flex-col items-center text-center gap-8">
          <img
            src={home.logo_url || logoAsset.url}
            alt={general.name}
            className="h-28 sm:h-36 lg:h-44 w-auto object-contain"
          />
          <div className="w-full max-w-2xl rounded-[2.5rem] overflow-hidden bg-white p-3 shadow-card border border-border/40">
            <img
              src={home.team_image_url || equipoAsset.url}
              alt={`Equipo de ${general.name} listo para atenderte`}
              className="w-full h-auto object-cover rounded-[2rem]"
            />
          </div>
        </div>
      </section>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container py-12 lg:py-20 max-w-4xl mx-auto text-center">
          <div className="space-y-7 animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-card border border-border/60 px-4 py-2 rounded-full shadow-soft">
              <span className="w-2 h-2 rounded-full bg-whatsapp animate-pulse" />
              <span className="text-xs font-medium">{home.badge_text}</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-balance whitespace-pre-line">
              {home.hero_title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance whitespace-pre-line">
              {home.hero_text}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild variant="hero" size="lg">
                <Link to="/servicios">{home.cta_primary} <ArrowRight /></Link>
              </Button>
              <Button asChild variant="whatsapp" size="lg">
                <a href={waFor(general.whatsapp, `Hola ${general.name}, quisiera cotizar un servicio.`)} target="_blank" rel="noreferrer">
                  {home.cta_secondary}
                </a>
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 pt-2 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-gradient-to-br from-primary to-primary-glow" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <div>{home.social_proof}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="container py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {home.benefits.map((b, i) => {
            const Icon = benefitIcons[i % benefitIcons.length];
            return (
              <div key={i} className="p-6 bg-card rounded-2xl border border-border/60 shadow-soft hover:shadow-card transition-base">
                <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-1">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* MISIÓN Y VISIÓN */}
      <section className="container pb-8">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="text-sm font-medium text-primary mb-2">{home.mission_eyebrow}</div>
          <h2 className="font-display text-3xl lg:text-4xl text-balance">{home.mission_heading}</h2>
          <p className="text-muted-foreground mt-3">{home.mission_subheading}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <article className="relative overflow-hidden rounded-3xl p-8 text-white shadow-hover bg-gradient-to-br from-primary via-primary to-primary-glow">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/15" />
            <div className="absolute -bottom-16 -left-10 w-44 h-44 rounded-full bg-white/10" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-5">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-3">{home.mission_title}</h3>
              <p className="leading-relaxed text-white/95 text-[0.98rem] whitespace-pre-line">{home.mission_text}</p>
              <p className="mt-4 font-semibold text-white text-lg leading-snug">{home.mission_highlight}</p>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-3xl p-8 text-white shadow-hover bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/15" />
            <div className="absolute -bottom-16 -left-10 w-44 h-44 rounded-full bg-white/10" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-5">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-3">{home.vision_title}</h3>
              <p className="leading-relaxed text-white/95 text-[0.98rem] whitespace-pre-line">{home.vision_text}</p>
              <p className="mt-4 font-semibold text-white text-lg leading-snug">{home.vision_highlight}</p>
            </div>
          </article>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="max-w-xl">
            <div className="text-sm font-medium text-primary mb-2">{home.services_eyebrow}</div>
            <h2 className="font-display text-3xl lg:text-4xl leading-tight text-balance">
              {home.services_heading}
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link to="/servicios">Ver todos <ArrowRight /></Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-96 rounded-3xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services?.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gradient-hero py-20 mt-12">
        <div className="container">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <div className="text-sm font-medium text-primary mb-2">{home.steps_eyebrow}</div>
            <h2 className="font-display text-3xl lg:text-4xl text-balance">{home.steps_heading}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {home.steps.map((s, i) => {
              const Icon = stepIcons[i % stepIcons.length];
              return (
                <div key={i} className="bg-card rounded-3xl p-6 shadow-soft relative">
                  <div className="text-5xl font-display text-primary/15 absolute top-4 right-5">{s.n}</div>
                  <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-1">{s.t}</h3>
                  <p className="text-sm text-muted-foreground">{s.d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="container py-20">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="text-sm font-medium text-primary mb-2">{home.gallery_eyebrow}</div>
          <h2 className="font-display text-3xl lg:text-4xl text-balance">{home.gallery_heading}</h2>
          <p className="text-muted-foreground mt-3">{home.gallery_text}</p>
        </div>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] min-h-[16rem] sm:min-h-[18rem] md:min-h-[20rem]">
          {!allLoaded ? (
            <div className="flex w-max gap-4 md:gap-6 h-full items-center">
              {carouselImages.map((_, i) => (
                <div
                  key={i}
                  className="shrink-0 w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-2xl md:rounded-3xl bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="flex w-max gap-4 md:gap-6 animate-marquee-x animate-fade-in">
              {[...carouselImages, ...carouselImages].map((src, i) => (
                <div
                  key={i}
                  className="relative shrink-0 w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-2xl md:rounded-3xl overflow-hidden shadow-soft"
                >
                  <img
                    src={src}
                    alt={`${general.name} en acción ${(i % carouselImages.length) + 1}`}
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container py-20">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="text-sm font-medium text-primary mb-2">{home.testimonials_eyebrow}</div>
          <h2 className="font-display text-3xl lg:text-4xl text-balance">{home.testimonials_heading}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {home.testimonials.map((t, i) => (
            <div key={i} className="bg-card rounded-3xl p-7 border border-border/60 shadow-soft">
              <div className="flex gap-0.5 text-amber-500 mb-4">
                {[1, 2, 3, 4, 5].map((j) => <Star key={j} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-foreground/85 leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-glow" />
                <div>
                  <div className="font-medium text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REDES SOCIALES */}
      <SocialLinks profiles={socialProfiles} />

      {/* CTA FINAL */}
      <section className="container pb-20">
        <div className="rounded-[2.5rem] bg-gradient-primary p-10 lg:p-16 text-center text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,white,transparent_50%)]" />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="font-display text-3xl lg:text-5xl mb-4 text-balance">{home.final_heading}</h2>
            <p className="text-primary-foreground/90 text-lg mb-8">{home.final_text}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link to="/contacto">Solicitar servicio</Link>
              </Button>
              <Button asChild variant="whatsapp" size="lg">
                <a href={waFor(general.whatsapp, "Hola, quiero más información sobre los servicios.")} target="_blank" rel="noreferrer">
                  WhatsApp directo
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
