import { Link, useParams } from "react-router-dom";
import { ArrowRight, Check, Sparkles, CheckCircle2, Briefcase, Phone, Mail, Target, Heart, Coffee, Cake, Home, Flower2, Info, HeartPulse, Stethoscope, ShieldCheck, UserCheck, BookOpen, Globe, MapPin, Megaphone, Video, Newspaper, PenTool, Radio, Clapperboard, Users, GraduationCap, ChefHat, Lightbulb, Baby, Clock } from "lucide-react";
import logoPetAsset from "@/assets/lepuchy-mango-pet.png.asset.json";
import soulcleanLogo from "@/assets/soulcleanperulogo.png.asset.json";
import peruTvLogo from "@/assets/peru-para-todos-tv-logo.png.asset.json";
import estamosContigoLogo from "@/assets/estamos-contigo.png.asset.json";
import limpiezaResidencialVideo from "@/assets/TCP03.mp4.asset.json";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SiteLayout } from "@/components/SiteLayout";
import { useServiceBySlug } from "@/hooks/useServices";
import { SITE, waLink } from "@/lib/constants";
import { SocialLinks } from "@/components/SocialLinks";

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: service, isLoading } = useServiceBySlug(slug);

  if (isLoading) {
    return <SiteLayout><div className="container py-20"><div className="h-96 rounded-3xl bg-muted animate-pulse" /></div></SiteLayout>;
  }
  if (!service) {
    return (
      <SiteLayout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-3xl mb-4">Servicio no encontrado</h1>
          <Button asChild><Link to="/servicios">Ver todos los servicios</Link></Button>
        </div>
      </SiteLayout>
    );
  }

  const accent = service.accent_color || "#0EA5E9";

  return (
    <SiteLayout>
      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${accent}18, ${accent}05)` }}
      >
        <div className="container py-16 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 animate-fade-up">
            <div className="mb-6">
              <Link to="/servicios" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                ← Volver a servicios
              </Link>
            </div>
            {service.category && (
              <div
                className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: accent, color: "#fff" }}
              >
                {service.category}
              </div>
            )}
            <h1 className="font-display text-4xl lg:text-5xl leading-tight text-balance">{service.title}</h1>
            {service.subtitle && <p className="text-xl text-foreground/75 text-balance">{service.subtitle}</p>}
            <p className="text-muted-foreground leading-relaxed">{service.short_description}</p>

            {service.show_price && service.price_from && (
              <div className="inline-flex items-baseline gap-2 bg-card rounded-2xl px-5 py-3 shadow-soft border border-border/60">
                <span className="text-sm text-muted-foreground">Desde</span>
                <span className="font-display text-2xl font-semibold" style={{ color: accent }}>S/ {service.price_from}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" style={{ background: accent, color: "#fff" }} className="hover:opacity-90 hover:shadow-hover">
                <Link to={`/contacto?servicio=${service.slug}`}>Contactar <ArrowRight /></Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to={`/postula?servicio=${service.slug}`}><Briefcase /> Quiero trabajar en este servicio</Link>
              </Button>
              <Button asChild variant="whatsapp" size="lg">
                <a href={waLink(`Hola, me interesa el servicio de ${service.title}.`)} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
          <div className="relative">
            {service.video_url || slug === "limpieza-residencial" ? (
              <div className="rounded-[2.5rem] overflow-hidden shadow-hover bg-card">
                <video
                  src={service.video_url || limpiezaResidencialVideo.url}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-auto block"
                  poster={service.hero_image_url ?? undefined}
                >
                  Tu navegador no soporta la reproducción de video.
                </video>
              </div>
            ) : (
              <div className="rounded-[2.5rem] overflow-hidden shadow-hover aspect-[4/3] bg-card">
                {service.hero_image_url ? (
                  <img src={service.hero_image_url} alt={service.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${accent}33, ${accent}11)` }}>
                    <div className="w-32 h-32 rounded-3xl flex items-center justify-center shadow-soft" style={{ background: accent }}>
                      <Sparkles className="w-14 h-14 text-white" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {slug === "soulclean" ? (
        <section className="container py-16 max-w-5xl space-y-12">
          {/* Header */}
          <div className="text-center space-y-3">
            <img src={soulcleanLogo.url} alt="SoulClean" className="mx-auto w-auto h-40 lg:h-56 object-contain" />
            <h2 className="font-display text-3xl lg:text-4xl text-balance">💖 SOULCLEAN ✨ TODO CLEAN PERÚ</h2>
            <p className="text-xl text-muted-foreground font-medium tracking-wide uppercase">Hermana • Amiga • Mujer</p>
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: accent }}>Solo para mujeres</p>
            <p className="text-lg text-foreground/80 pt-2">El acompañamiento y crecimiento que necesitas</p>
          </div>

          {/* Purpose */}
          <div className="bg-card rounded-3xl p-8 border border-border/60 shadow-soft space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}22` }}>
                <Target className="w-5 h-5" style={{ color: accent }} />
              </div>
              <h3 className="font-display text-xl">Nuestro propósito</h3>
            </div>
            <p className="text-foreground/80 leading-relaxed">
              Lograr tu independencia personal y económica, sin depender de nadie. Aprendemos juntas: ninguna es perfecta, nos levantamos con resiliencia. Aquí valen los hechos, no lo que digan otros. Actuamos con total legalidad, transparencia y respeto mutuo.
            </p>
          </div>

          {/* YouTube embed */}
          <div className="rounded-3xl overflow-hidden border border-border/60 shadow-soft aspect-[9/16] sm:aspect-video max-w-md mx-auto sm:max-w-2xl">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/L3NNMafY7k0"
              title="SoulClean — Todo Clean Perú"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* What we offer */}
          <div className="bg-card rounded-3xl p-8 border border-border/60 shadow-soft space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}22` }}>
                <Heart className="w-5 h-5" style={{ color: accent }} />
              </div>
              <h3 className="font-display text-xl">¿Qué te ofrecemos?</h3>
            </div>
            <ul className="space-y-3">
              {[
                "Compañía virtual o presencial en cualquier momento",
                "Espacio seguro para hablar de lo que sientas",
                "Consejos: finanzas, emprendimiento, belleza, viajes y organización",
                "Contenido próximo: blogs, videos y transmisiones",
                "Charlas exclusivas personalizadas (servicio con costo)",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: accent }} />
                  <span className="text-foreground/85">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="bg-card rounded-3xl p-8 border border-border/60 shadow-soft space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}22` }}>
                <Sparkles className="w-5 h-5" style={{ color: accent }} />
              </div>
              <h3 className="font-display text-xl">Servicios</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Coffee, text: "Cafés con conexión" },
                { icon: Flower2, text: "Acompañamiento en recuerdos" },
                { icon: Cake, text: "Celebraciones especiales" },
                { icon: Home, text: "Apoyo para organizar tu vida" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50">
                  <s.icon className="w-5 h-5 shrink-0" style={{ color: accent }} />
                  <span className="text-sm font-medium">{s.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 rounded-2xl bg-muted/50 px-6 py-4 text-sm text-muted-foreground">
            <Info className="w-5 h-5 shrink-0 mt-0.5" style={{ color: accent }} />
            <p>En servicios presenciales, gastos de traslado a cargo de quien solicita.</p>
          </div>

          {/* Contact */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-foreground/80">
            <a href="tel:+51994119949" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Phone className="w-5 h-5" style={{ color: accent }} />
              <span>+51 994119949</span>
            </a>
            <a href="mailto:contacto@todocleanperu.com" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Mail className="w-5 h-5" style={{ color: accent }} />
              <span>contacto@todocleanperu.com</span>
            </a>
          </div>
        </section>
      ) : slug === "cuidado-infantil" ? (
        <section className="container py-16 max-w-5xl space-y-12">
          {/* Header */}
          <div className="text-center space-y-3">
            <h2 className="font-display text-3xl lg:text-4xl text-balance">👶 NANITA DE NIÑOS</h2>
            <p className="text-xl text-muted-foreground font-medium">Cuidado seguro y confiable</p>
          </div>

          {/* Service */}
          <div className="bg-card rounded-3xl p-8 border border-border/60 shadow-soft space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}22` }}>
                <Baby className="w-5 h-5" style={{ color: accent }} />
              </div>
              <h3 className="font-display text-xl">Servicio</h3>
            </div>
            <p className="text-foreground/80 leading-relaxed">
              Cuidado integral: alimentación, aseo, acompañamiento, juegos y actividades diarias.
            </p>
          </div>

          {/* Modalidades */}
          <div className="bg-card rounded-3xl p-8 border border-border/60 shadow-soft space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}22` }}>
                <Clock className="w-5 h-5" style={{ color: accent }} />
              </div>
              <h3 className="font-display text-xl">Modalidades</h3>
            </div>
            <ul className="grid sm:grid-cols-2 gap-3">
              {[
                "Por horas",
                "Un día a la semana",
                "Tres veces por semana",
                "Lunes a viernes",
                "Lunes a sábado",
                "Solo fines de semana",
                "Sin residencia: no se queda a dormir",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: accent }} />
                  <span className="text-foreground/85">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Personal */}
          <div className="bg-card rounded-3xl p-8 border border-border/60 shadow-soft space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}22` }}>
                <ShieldCheck className="w-5 h-5" style={{ color: accent }} />
              </div>
              <h3 className="font-display text-xl">Personal</h3>
            </div>
            <p className="text-foreground/80 leading-relaxed">
              Verificado, filtrado y capacitado para atención responsable y con cariño.
            </p>
          </div>

          {/* Nota */}
          <div className="flex items-start gap-3 rounded-2xl bg-muted/50 px-6 py-4 text-sm text-muted-foreground">
            <Info className="w-5 h-5 shrink-0 mt-0.5" style={{ color: accent }} />
            <div className="space-y-1">
              <p><strong>Logo:</strong> Diseño que transmita confianza y ternura, sin figuras complejas.</p>
              <p><strong>Transparencia:</strong> Se detalla selección, capacitación y normas de atención.</p>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-foreground/80">
            <a href="tel:+51994119949" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Phone className="w-5 h-5" style={{ color: accent }} />
              <span>+51 994119949</span>
            </a>
            <a href="mailto:contacto@todocleanperu.com" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Mail className="w-5 h-5" style={{ color: accent }} />
              <span>contacto@todocleanperu.com</span>
            </a>
          </div>
        </section>
      ) : slug === "cuidado-adulto-mayor" ? (
        <section className="container py-16 max-w-5xl space-y-12">
          {/* Header */}
          <div className="text-center space-y-3">
            <img src={estamosContigoLogo.url} alt="Estamos Contigo" className="mx-auto w-auto h-40 lg:h-56 object-contain" />
            <h2 className="font-display text-3xl lg:text-4xl text-balance">✨ ESTAMOS CONTIGO</h2>
            <p className="text-xl text-muted-foreground font-medium">Cuidado para adultos mayores</p>
          </div>

          {/* Presencial Services */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider" style={{ color: accent }}>
              <MapPin className="w-4 h-4" />
              <span>Servicios Presenciales – Lima, Perú</span>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-card rounded-3xl p-8 border border-border/60 shadow-soft space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}22` }}>
                    <UserCheck className="w-5 h-5" style={{ color: accent }} />
                  </div>
                  <h3 className="font-display text-xl">Asistente de adulto mayor</h3>
                </div>
                <p className="text-foreground/80 leading-relaxed">
                  Aseo personal, baño, alimentación, limpieza de su entorno y acompañamiento diario.
                </p>
              </div>
              <div className="bg-card rounded-3xl p-8 border border-border/60 shadow-soft space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}22` }}>
                    <HeartPulse className="w-5 h-5" style={{ color: accent }} />
                  </div>
                  <h3 className="font-display text-xl">Enfermera profesional</h3>
                </div>
                <p className="text-foreground/80 leading-relaxed">
                  Control de signos vitales, administración de medicamentos y cuidados de salud.
                </p>
              </div>
            </div>
          </div>

          {/* Nuestra Diferencia */}
          <div className="bg-card rounded-3xl p-8 border border-border/60 shadow-soft space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}22` }}>
                <ShieldCheck className="w-5 h-5" style={{ color: accent }} />
              </div>
              <h3 className="font-display text-xl">Nuestra Diferencia</h3>
            </div>
            <ul className="grid sm:grid-cols-2 gap-3">
              {[
                "Personal verificado y responsable",
                "Trato respetuoso y paciente",
                "Procedimientos claros y seguros",
                "Seguimiento continuo",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: accent }} />
                  <span className="text-foreground/85">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Comunidad */}
          <div className="bg-card rounded-3xl p-8 border border-border/60 shadow-soft space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}22` }}>
                <BookOpen className="w-5 h-5" style={{ color: accent }} />
              </div>
              <h3 className="font-display text-xl">Comunidad</h3>
            </div>
            <p className="text-foreground/80 leading-relaxed">
              Consejos prácticos sobre cuidados, alimentación, salud y organización.
            </p>
          </div>

          {/* Servicio Virtual */}
          <div
            className="rounded-3xl p-8 border shadow-soft space-y-4"
            style={{ background: `linear-gradient(135deg, ${accent}18, ${accent}05)`, borderColor: `${accent}33` }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}22` }}>
                <Globe className="w-5 h-5" style={{ color: accent }} />
              </div>
              <h3 className="font-display text-xl">Servicio Virtual</h3>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-card/80 px-6 py-4">
              <Info className="w-5 h-5 shrink-0 mt-0.5" style={{ color: accent }} />
              <div className="space-y-1">
                <p className="text-sm font-semibold">Solo para personas en el extranjero</p>
                <p className="text-sm text-muted-foreground">Consultas y orientación personalizada. (Con valor establecido)</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-foreground/80">
            <a href="tel:+51994119949" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Phone className="w-5 h-5" style={{ color: accent }} />
              <span>+51 994119949</span>
            </a>
            <a href="mailto:contacto@estamoscontigo.pe" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Mail className="w-5 h-5" style={{ color: accent }} />
              <span>contacto@estamoscontigo.pe</span>
            </a>
          </div>
        </section>
      ) : slug === "servicios-mascotas" ? (
        <section className="container py-16 max-w-5xl space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <img src={logoPetAsset.url} alt="LEPUCHY & MANGO PET" className="mx-auto h-48 w-auto" />
            <h2 className="font-display text-3xl lg:text-4xl text-balance">🐾 LEPUCHY & MANGO PET</h2>
            <p className="text-xl text-muted-foreground font-medium">Paseo, cuidado de mascotas</p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-card rounded-3xl p-8 border border-border/60 shadow-soft space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}22` }}>
                  <MapPin className="w-5 h-5" style={{ color: accent }} />
                </div>
                <h3 className="font-display text-xl">Paseo de mascotas</h3>
              </div>
              <p className="text-foreground/80 leading-relaxed">Salidas seguras, ejercicio y compañía adaptada a su tamaño y energía.</p>
            </div>

            <div className="bg-card rounded-3xl p-8 border border-border/60 shadow-soft space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}22` }}>
                  <Home className="w-5 h-5" style={{ color: accent }} />
                </div>
                <h3 className="font-display text-xl">Nanita de mascotas</h3>
              </div>
              <p className="text-sm text-muted-foreground">(en tu hogar)</p>
              <ul className="space-y-2">
                {[
                  "Alimentación, medicamentos y cuidados básicos",
                  "Limpieza exclusiva de su espacio y utensilios",
                  "Mucho cariño y supervisión",
                  "Servicio por horas",
                  "Incluye pasaje de ida y vuelta",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: accent }} />
                    <span className="text-foreground/85 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-3xl p-8 border border-border/60 shadow-soft space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}22` }}>
                  <ShieldCheck className="w-5 h-5" style={{ color: accent }} />
                </div>
                <h3 className="font-display text-xl">Hotel / Hospedaje</h3>
              </div>
              <p className="text-foreground/80 leading-relaxed">Espacio seguro, limpio y vigilado, con atención personalizada las 24h.</p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 rounded-2xl bg-muted/50 px-6 py-4 text-sm text-muted-foreground">
            <Info className="w-5 h-5 shrink-0 mt-0.5" style={{ color: accent }} />
            <p>Contamos con personal preparado, responsable y con experiencia en bienestar animal.</p>
          </div>

          {/* Contact */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-foreground/80">
            <a href="tel:+51994119949" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Phone className="w-5 h-5" style={{ color: accent }} />
              <span>+51 994119949</span>
            </a>
            <a href="mailto:contacto@todocleanperu.com" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Mail className="w-5 h-5" style={{ color: accent }} />
              <span>contacto@todocleanperu.com</span>
            </a>
          </div>
        </section>
      ) : slug === "peru-para-todos-tv" ? (
        <section className="container py-16 max-w-5xl space-y-12">
          {/* Header */}
          <div className="text-center space-y-3">
            <img src={peruTvLogo.url} alt="Perú Para Todos TV" className="mx-auto w-auto h-40 lg:h-56 object-contain" />
            <h2 className="font-display text-3xl lg:text-4xl text-balance">Perú Para Todos TV</h2>
            <p className="text-xl text-muted-foreground font-medium">Área de Comunicación, Producción y Difusión</p>
          </div>

          {/* Su Función */}
          <div className="bg-card rounded-3xl p-8 border border-border/60 shadow-soft space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}22` }}>
                <Target className="w-5 h-5" style={{ color: accent }} />
              </div>
              <h3 className="font-display text-xl">Su Función</h3>
            </div>
            <p className="text-foreground/80 leading-relaxed">
              Es la dirección encargada de todo lo relacionado con:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Newspaper, text: "Prensa y comunicación" },
                { icon: Video, text: "Producción de contenido" },
                { icon: Megaphone, text: "Publicidad y estrategia de marketing" },
                { icon: PenTool, text: "Imagen corporativa y desarrollo de marca" },
                { icon: Radio, text: "Difusión de todas las líneas de servicio" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50">
                  <s.icon className="w-5 h-5 shrink-0" style={{ color: accent }} />
                  <span className="text-sm font-medium">{s.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Temas y Contenido */}
          <div className="bg-card rounded-3xl p-8 border border-border/60 shadow-soft space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}22` }}>
                <BookOpen className="w-5 h-5" style={{ color: accent }} />
              </div>
              <h3 className="font-display text-xl">Temas y contenido que compartimos</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">De nuestra empresa</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    "Limpieza y cuidado del hogar",
                    "Atención y bienestar para adultos mayores",
                    "Cuidado integral de mascotas: paseo, estancia y hospedaje",
                    "Espacio y apoyo para mujeres",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50">
                      <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: accent }} />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">Para todos</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    "Emprendimiento y consejos para crecer",
                    "Temas familiares, educación y niños",
                    "Recetas, cocina, estilo de vida y recomendaciones",
                    "Lecturas, cuentos, libros, música y pasatiempos",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50">
                      <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: accent }} />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Nota Final */}
          <div className="flex items-start gap-3 rounded-2xl bg-muted/50 px-6 py-4 text-sm text-muted-foreground">
            <Info className="w-5 h-5 shrink-0 mt-0.5" style={{ color: accent }} />
            <p>
              También abarcamos contenido de interés para el público en general: propuestas de otros emprendedores, experiencias compartidas y temas personales. El formato es estilo blog, YouTube y transmisiones, con un tono cercano, claro y ameno.
            </p>
          </div>

          {/* Propósito */}
          <div
            className="rounded-3xl p-8 border shadow-soft space-y-4"
            style={{ background: `linear-gradient(135deg, ${accent}18, ${accent}05)`, borderColor: `${accent}33` }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}22` }}>
                <Users className="w-5 h-5" style={{ color: accent }} />
              </div>
              <h3 className="font-display text-xl">Propósito</h3>
            </div>
            <p className="text-foreground/80 leading-relaxed">
              Crear un espacio abierto donde compartimos, aprendemos y conectamos, formando una comunidad unida y de confianza.
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-foreground/80">
            <a href="tel:+51994119949" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Phone className="w-5 h-5" style={{ color: accent }} />
              <span>+51 994119949</span>
            </a>
            <a href="mailto:contacto@todocleanperu.com" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Mail className="w-5 h-5" style={{ color: accent }} />
              <span>contacto@todocleanperu.com</span>
            </a>
          </div>
        </section>
      ) : slug === "sabor-para-todos-peru" ? (
        <section className="container py-16 max-w-5xl space-y-12">
          {/* Header */}
          <div className="text-center space-y-3">
            <h2 className="font-display text-3xl lg:text-4xl text-balance">Sabor Para Todos Perú</h2>
            <p className="text-xl text-muted-foreground font-medium">Sabor, enseñanza y confianza</p>
          </div>

          {/* Nuestros servicios principales */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}22` }}>
                <Sparkles className="w-5 h-5" style={{ color: accent }} />
              </div>
              <h3 className="font-display text-xl">Nuestros servicios principales</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { icon: GraduationCap, title: "Capacitaciones y talleres", desc: "Impartidos por profesionales especializados en cocina criolla, marina y casera." },
                { icon: ChefHat, title: "Personal de cocina", desc: "Disponemos de asistentes de cocina preparadas, listas para trabajar tanto en hogares como en empresas." },
                { icon: BookOpen, title: "Recetas y contenido", desc: "Compartimos preparaciones paso a paso, trucos y consejos útiles." },
                { icon: Newspaper, title: "Reseñas y noticias", desc: "Información actualizada sobre gastronomía y lugares recomendados." },
                { icon: Clapperboard, title: "Contenido digital", desc: "Publicaciones en blog y videos en YouTube para aprender y disfrutar." },
              ].map((s, i) => (
                <div key={i} className="bg-card rounded-3xl p-8 border border-border/60 shadow-soft space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}22` }}>
                      <s.icon className="w-5 h-5" style={{ color: accent }} />
                    </div>
                    <h3 className="font-display text-xl">{s.title}</h3>
                  </div>
                  <p className="text-foreground/80 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Nuestra propuesta */}
          <div
            className="rounded-3xl p-8 border shadow-soft space-y-4"
            style={{ background: `linear-gradient(135deg, ${accent}18, ${accent}05)`, borderColor: `${accent}33` }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}22` }}>
                <Lightbulb className="w-5 h-5" style={{ color: accent }} />
              </div>
              <h3 className="font-display text-xl">Nuestra propuesta</h3>
            </div>
            <p className="text-foreground/80 leading-relaxed">
              No ofrecemos solo recetas o cursos: te brindamos seguridad, facilidad y resultados garantizados. Adquieres no solo el conocimiento o el servicio, sino la tranquilidad de contar con personal capacitado, explicaciones claras y la confianza de disfrutar de una buena cocina sin complicaciones.
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-foreground/80">
            <a href="tel:+51994119949" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Phone className="w-5 h-5" style={{ color: accent }} />
              <span>+51 994119949</span>
            </a>
            <a href="mailto:contacto@todocleanperu.com" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Mail className="w-5 h-5" style={{ color: accent }} />
              <span>contacto@todocleanperu.com</span>
            </a>
          </div>
        </section>
      ) : service.long_description ? (
        <section className="container py-16 max-w-3xl">
          <p className="text-lg text-foreground/80 leading-relaxed text-balance">{service.long_description}</p>
        </section>
      ) : null}

      {/* INCLUDES + IDEAL FOR + BENEFITS */}
      <section className="container py-8 grid lg:grid-cols-2 gap-6">
        {service.includes.length > 0 && (
          <div className="bg-card rounded-3xl p-8 border border-border/60 shadow-soft">
            <h2 className="font-display text-2xl mb-5">Qué incluye este servicio</h2>
            <ul className="space-y-3">
              {service.includes.map((it, i) => (
                <li key={i} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: accent }} />
                  <span className="text-foreground/85">{it}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {service.ideal_for.length > 0 && (
          <div className="bg-card rounded-3xl p-8 border border-border/60 shadow-soft">
            <h2 className="font-display text-2xl mb-5">Ideal para</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {service.ideal_for.map((it, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-muted/50">
                  <Check className="w-4 h-4" style={{ color: accent }} />
                  <span className="text-sm font-medium">{it}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {service.custom_sections.length > 0 && (
        <section className="container py-8 space-y-6">
          {service.custom_sections.map((cs, i) => (
            <div key={i} className="bg-card rounded-3xl p-8 border border-border/60 shadow-soft">
              {cs.title && <h2 className="font-display text-2xl mb-4">{cs.title}</h2>}
              {cs.content && (
                <p className="text-foreground/85 leading-relaxed whitespace-pre-line">{cs.content}</p>
              )}
              {cs.media_url && (
                <img src={cs.media_url} alt={cs.title || service.title} className="mt-6 rounded-2xl w-full h-auto object-cover" />
              )}
            </div>
          ))}
        </section>
      )}

      {service.benefits.length > 0 && (
        <section className="container py-8">
          <h2 className="font-display text-2xl lg:text-3xl mb-8">Beneficios</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {service.benefits.map((b, i) => (
              <div key={i} className="bg-card p-6 rounded-2xl border border-border/60 shadow-soft">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${accent}22` }}>
                  <Sparkles className="w-5 h-5" style={{ color: accent }} />
                </div>
                <p className="font-medium">{b}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {service.gallery.length > 0 && (
        <section className="container py-12">
          <h2 className="font-display text-2xl lg:text-3xl mb-6">Galería</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {service.gallery.map((url, i) => (
              <img key={i} src={url} alt="" className="rounded-2xl aspect-square object-cover shadow-soft" loading="lazy" />
            ))}
          </div>
        </section>
      )}

      {service.faqs.length > 0 && (
        <section className="container py-16 max-w-3xl">
          <h2 className="font-display text-2xl lg:text-3xl mb-8 text-center">Preguntas frecuentes</h2>
          <Accordion type="single" collapsible className="space-y-3">
            {service.faqs.map((f, i) => (
              <AccordionItem key={i} value={`f${i}`} className="bg-card border border-border/60 rounded-2xl px-6">
                <AccordionTrigger className="text-left font-medium">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}

      <SocialLinks
        accentColor={accent}
        profiles={
          slug === "peru-para-todos-tv"
            ? [
                { name: "Instagram", url: "https://www.instagram.com/peruparatodostv/", handle: "@peruparatodostv", icon: "instagram" },
                { name: "Facebook", url: "https://www.facebook.com/share/1E8KyW5CdC/", handle: "Perú Para Todos TV", icon: "facebook" },
                { name: "TikTok", url: "https://www.tiktok.com/@peruparatodostv", handle: "@peruparatodostv", icon: "tiktok" },
                { name: "YouTube", url: "https://youtube.com/@peruparatodostv5509", handle: "@peruparatodostv", icon: "youtube" },
              ]
            : [
                { name: "Instagram", url: "https://www.instagram.com/t0d0cleanperu/", handle: "@t0d0cleanperu", icon: "instagram" },
                { name: "TikTok", url: "https://www.tiktok.com/@todo.clean.peru", handle: "@todo.clean.peru", icon: "tiktok" },
              ]
        }
      />

      {/* CTA FINAL */}
      <section className="container pb-20">
        <div
          className="rounded-[2.5rem] p-10 lg:p-14 text-center text-white relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}
        >
          <h2 className="font-display text-3xl lg:text-4xl mb-3 text-balance">¿Listo para empezar?</h2>
          <p className="opacity-90 mb-8 max-w-xl mx-auto">
            Cuéntanos qué necesitas y coordinamos contigo en menos de 24 horas.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" className="bg-white text-foreground hover:bg-white/90">
              <Link to={`/contacto?servicio=${service.slug}`}>Contactar</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              <Link to={`/postula?servicio=${service.slug}`}>Postular</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
