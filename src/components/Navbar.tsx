import { Link, NavLink, useLocation, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useActiveServices } from "@/hooks/useServices";
import { SITE, waLink } from "@/lib/constants";
import { cn } from "@/lib/utils";
import logoAsset from "@/assets/logo_todo_clean_peru.png.asset.json";
import agenciaLogo from "@/assets/agencia-de-empleo-logo.png.asset.json";
import lepuchyMangoPetLogo from "@/assets/lepuchy-mango-pet.png.asset.json";
import peruParaTodosTvLogo from "@/assets/peru-para-todos-tv-logo.png.asset.json";
import estamosContigoLogo from "@/assets/estamos-contigo.png.asset.json";
import saborLogo from "@/assets/sabor-para-todos.png.asset.json";
import soulcleanLogo from "@/assets/soulcleanperulogo.png.asset.json";
import abmLogo from "@/assets/amor-bello-muack-logo.png.asset.json";

const SERVICE_LOGOS: Record<string, { url: string; alt: string }> = {
  "cuidado-infantil": { url: agenciaLogo.url, alt: "Agencia Todo Empleo" },
  "cuidado-adulto-mayor": { url: estamosContigoLogo.url, alt: "Estamos Contigo" },
  "servicios-mascotas": { url: lepuchyMangoPetLogo.url, alt: "LEPUCHY & MANGO PET" },
  "peru-para-todos-tv": { url: peruParaTodosTvLogo.url, alt: "Perú Para Todos TV" },
  "sabor-para-todos-peru": { url: saborLogo.url, alt: "Sabor Para Todos" },
  "soulclean": { url: soulcleanLogo.url, alt: "SoulClean" },
};

const leftNavItems = [
  { to: "/", label: "Inicio" },
  { to: "/servicios", label: "Servicios" },
];

const rightNavItems = [
  { to: "/contacto", label: "Contacto" },
  { to: "/postula", label: "Trabaja con nosotros" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { data: services } = useActiveServices();
  const loc = useLocation();
  const { slug } = useParams<{ slug: string }>();
  const isTienda = loc.pathname.startsWith("/tienda");

  const headerRef = useRef<HTMLElement>(null);
  const isHome = loc.pathname === "/";
  const [showNav, setShowNav] = useState(!isHome);

  useEffect(() => {
    setShowNav(!isHome);
  }, [isHome]);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const setHeight = () => {
      const height = isHome ? 0 : el.offsetHeight;
      document.documentElement.style.setProperty("--navbar-height", `${height}px`);
    };
    setHeight();
    window.addEventListener("resize", setHeight);
    return () => window.removeEventListener("resize", setHeight);
  }, [isHome]);

  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () => {
      setShowNav(window.scrollY > 80);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);
  const activeLogo = (slug && SERVICE_LOGOS[slug])
    || (isTienda ? { url: abmLogo.url, alt: "Amor Bello Muack" } : null)
    || { url: logoAsset.url, alt: "Todo Clean Perú" };
  const hasServiceLogo = !!(slug && SERVICE_LOGOS[slug]) || isTienda;

  const renderNavLink = (item: { to: string; label: string }) =>
    item.to === "/servicios" ? (
      <div
        key={item.to}
        className="relative"
        onMouseEnter={() => setServicesOpen(true)}
        onMouseLeave={() => setServicesOpen(false)}
      >
        <NavLink
          to={item.to}
          className={({ isActive }) =>
            cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-base inline-flex items-center gap-1",
              isActive
                ? "bg-primary-soft text-primary"
                : "text-foreground/70 hover:text-foreground hover:bg-muted"
            )
          }
        >
          {item.label}
          <ChevronDown className="w-3.5 h-3.5" />
        </NavLink>
        {servicesOpen && services && services.length > 0 && (
          <div className="absolute top-full left-0 pt-2 w-72">
            <div className="bg-card rounded-2xl shadow-card border border-border/60 p-2 animate-fade-up">
              {services.map((s) => (
                <Link
                  key={s.slug}
                  to={`/servicios/${s.slug}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-base"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: s.accent_color }}
                  />
                  <span className="text-sm font-medium">{s.title}</span>
                </Link>
              ))}
              <Link
                to="/tienda"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-base border-t border-border/60 mt-1 pt-3"
              >
                <ShoppingBag className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-sm font-medium">Tienda — Amor Bello Muack</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    ) : (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-base",
            isActive
              ? "bg-primary-soft text-primary"
              : "text-foreground/70 hover:text-foreground hover:bg-muted"
          )
        }
      >
        {item.label}
      </NavLink>
    );

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/85 border-b border-border/60 transition-transform duration-300",
        isHome && !showNav ? "-translate-y-full" : "translate-y-0"
      )}
    >
      {/* Mobile header */}
      <div className="lg:hidden relative container flex items-center justify-center py-6">
        <Link to="/" className="group">
          <img
            src={activeLogo.url}
            alt={activeLogo.alt}
            className={cn("w-auto transition-base group-hover:scale-105", hasServiceLogo ? "h-20" : "h-32")}
          />
        </Link>

        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl hover:bg-muted"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop header */}
      <div className="hidden lg:container lg:flex lg:items-center lg:justify-between lg:py-6">
        <nav className="flex items-center gap-1">
          {leftNavItems.map(renderNavLink)}
        </nav>

        <Link to="/" className="flex items-center justify-center group">
          <img
            src={activeLogo.url}
            alt={activeLogo.alt}
            className={cn("w-auto transition-base group-hover:scale-105", hasServiceLogo ? "h-20" : "h-32")}
          />
        </Link>

        <div className="flex items-center gap-1">
          <nav className="flex items-center gap-1">
            {rightNavItems.map(renderNavLink)}
          </nav>
          <Button asChild variant="whatsapp" size="sm" className="ml-2">
            <a href={waLink(`Hola ${SITE.name}, me interesa cotizar un servicio.`)} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </Button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border/60 bg-background">
          <div className="container py-4 flex flex-col gap-1">
            {[...leftNavItems, ...rightNavItems].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium",
                  loc.pathname === item.to
                    ? "bg-primary-soft text-primary"
                    : "hover:bg-muted"
                )}
              >
                {item.label}
              </Link>
            ))}
            {services && services.length > 0 && (
              <div className="pl-4 mt-1 border-l-2 border-border ml-4 flex flex-col gap-0.5">
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/servicios/${s.slug}`}
                    onClick={() => setOpen(false)}
                    className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    {s.title}
                  </Link>
                ))}
                <Link
                  to="/tienda"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-amber-700 hover:text-amber-800 inline-flex items-center gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Tienda — Amor Bello Muack
                </Link>
              </div>
            )}
            <Button asChild variant="whatsapp" className="mt-3">
              <a href={waLink(`Hola ${SITE.name}, me interesa cotizar un servicio.`)}>
                Contactar por WhatsApp
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
