import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { ServiceCard } from "@/components/ServiceCard";
import { useActiveServices } from "@/hooks/useServices";
import { ArrowRight, ShoppingBag } from "lucide-react";
import abmLogo from "@/assets/amor-bello-muack-logo.png.asset.json";

export default function ServicesList() {
  const { data: services, isLoading } = useActiveServices();
  return (
    <SiteLayout>
      <section className="bg-gradient-hero py-16">
        <div className="container text-center max-w-2xl">
          <div className="text-sm font-medium text-primary mb-2">Servicios</div>
          <h1 className="font-display text-4xl lg:text-5xl text-balance mb-4">
            Todo lo que tu hogar y tu familia necesitan
          </h1>
          <p className="text-muted-foreground text-lg">
            Explora todos los servicios disponibles y elige el que mejor se adapte a ti.
          </p>
        </div>
      </section>
      <section className="container py-16">
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-96 rounded-3xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services?.map((s) => <ServiceCard key={s.id} service={s} />)}

            {/* Tienda Amor Bello Muack */}
            <Link
              to="/tienda"
              className="group relative flex flex-col rounded-3xl overflow-hidden bg-card border border-border/60 shadow-card hover:shadow-hover hover:-translate-y-1 transition-base"
            >
              <div
                className="relative aspect-[4/3] overflow-hidden flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #fef3c7, #fff8e7)" }}
              >
                <img src={abmLogo.url} alt="Amor Bello Muack" className="h-44 w-auto" />
                <div
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium backdrop-blur text-white"
                  style={{ background: "rgba(217, 119, 6, 0.95)" }}
                >
                  Tienda
                </div>
              </div>
              <div className="p-6 flex flex-col gap-3 flex-1">
                <h3 className="font-display text-xl font-semibold leading-tight">Amor Bello Muack — Ropa Unisex</h3>
                <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                  Prendas cómodas y con estilo. Elige tu talla y color, y pide directo por WhatsApp.
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 font-medium">
                    <ShoppingBag className="w-4 h-4" /> Productos disponibles
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 group-hover:gap-2.5 transition-base">
                    Ver tienda <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
