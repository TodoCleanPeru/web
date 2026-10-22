import { Link } from "react-router-dom";
import { Sparkles, Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";
import { useActiveServices } from "@/hooks/useServices";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function Footer() {
  const { data: services } = useActiveServices();
  const { settings } = useSiteSettings();
  const { general, footer } = settings;

  return (
    <footer className="bg-foreground/[0.03] border-t border-border/60 mt-24">
      <div className="container py-16 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-display text-lg font-semibold">{footer.brand_title}</div>
              <div className="text-xs text-muted-foreground -mt-1">{footer.brand_subtitle}</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{footer.description}</p>
          <div className="flex items-center gap-2">
            {general.facebook && (
              <a
                href={general.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Facebook ${general.name}`}
                className="w-9 h-9 rounded-full bg-primary-soft text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-base"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {general.instagram && (
              <a
                href={general.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram ${general.name}`}
                className="w-9 h-9 rounded-full bg-primary-soft text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-base"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-display text-base mb-4">Servicios</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {services?.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link to={`/servicios/${s.slug}`} className="hover:text-foreground transition-base">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base mb-4">Enlaces</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/servicios" className="hover:text-foreground">Todos los servicios</Link></li>
            <li><Link to="/contacto" className="hover:text-foreground">Solicitar servicio</Link></li>
            <li><Link to="/postula" className="hover:text-foreground">Trabaja con nosotros</Link></li>
            <li><Link to="/admin/login" className="hover:text-foreground">Acceso administrador</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base mb-4">Contacto</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 text-primary" /> {general.phone}</li>
            <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 text-primary" /> {general.email}</li>
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-primary" /> {general.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {general.name}. {footer.copyright_suffix}
      </div>
    </footer>
  );
}
