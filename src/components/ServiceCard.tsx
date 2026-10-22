import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Service } from "@/types/service";

export function ServiceCard({ service }: { service: Service }) {
  const accent = service.accent_color || "#0EA5E9";
  return (
    <Link
      to={`/servicios/${service.slug}`}
      className="group relative flex flex-col rounded-3xl overflow-hidden bg-card border border-border/60 shadow-card hover:shadow-hover hover:-translate-y-1 transition-base"
    >
      <div
        className="relative aspect-[4/3] overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${accent}22, ${accent}05)` }}
      >
        {service.hero_image_url ? (
          <img
            src={service.hero_image_url}
            alt={service.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-base duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-soft"
              style={{ background: accent }}
            >
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
        )}
        <div
          className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium backdrop-blur"
          style={{ background: `${accent}ee`, color: "#fff" }}
        >
          {service.category ?? "Servicio"}
        </div>
      </div>
      <div className="p-6 flex flex-col gap-3 flex-1">
        <h3 className="font-display text-xl font-semibold leading-tight">{service.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
          {service.short_description}
        </p>
        <div className="flex items-center justify-between pt-2">
          {service.show_price && service.price_from ? (
            <div>
              <div className="text-xs text-muted-foreground">Desde</div>
              <div className="font-display text-lg font-semibold" style={{ color: accent }}>
                S/ {service.price_from}
              </div>
            </div>
          ) : <div />}
          <span
            className="inline-flex items-center gap-1.5 text-sm font-medium group-hover:gap-2.5 transition-base"
            style={{ color: accent }}
          >
            Ver servicio <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
