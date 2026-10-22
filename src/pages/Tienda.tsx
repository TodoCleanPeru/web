import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useActiveProducts, Product } from "@/hooks/useProducts";
import { SITE, waLink } from "@/lib/constants";
import { MessageCircle, ShoppingBag, Sparkles } from "lucide-react";
import abmLogo from "@/assets/amor-bello-muack-logo.png.asset.json";

function ProductCard({ p }: { p: Product }) {
  const [size, setSize] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const msg = `Hola ${SITE.name}, quiero pedir el producto *${p.name}* (S/ ${p.price.toFixed(2)})${
    size ? ` — Talla: ${size}` : ""
  }${color ? ` — Color: ${color}` : ""}.`;

  return (
    <div className="group rounded-3xl overflow-hidden bg-card border border-border/60 shadow-card hover:shadow-hover transition-base flex flex-col">
      <div className="aspect-square bg-muted relative overflow-hidden">
        {p.image_url ? (
          <img src={p.image_url} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-base duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground/40" />
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold leading-tight">{p.name}</h3>
          <div className="font-display text-lg font-bold text-amber-600 whitespace-nowrap">S/ {p.price.toFixed(2)}</div>
        </div>
        {p.description && <p className="text-sm text-muted-foreground line-clamp-3">{p.description}</p>}

        {p.sizes.length > 0 && (
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1.5">Talla</div>
            <div className="flex flex-wrap gap-1.5">
              {p.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-base ${
                    size === s ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {p.colors.length > 0 && (
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1.5">Color</div>
            <div className="flex flex-wrap gap-1.5">
              {p.colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-base ${
                    color === c ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        <Button asChild variant="whatsapp" className="mt-auto">
          <a href={waLink(msg)} target="_blank" rel="noreferrer">
            <MessageCircle /> Pedir por WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}

export default function Tienda() {
  const { data: products, isLoading } = useActiveProducts();

  return (
    <SiteLayout>
      <section className="bg-gradient-to-b from-amber-50 to-background py-14">
        <div className="container text-center max-w-2xl">
          <img src={abmLogo.url} alt="Amor Bello Muack" className="h-32 lg:h-40 w-auto mx-auto mb-4" />
          <div className="inline-flex items-center gap-2 text-xs font-medium text-amber-700 bg-amber-100 px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Tienda oficial
          </div>
          <h1 className="font-display text-4xl lg:text-5xl text-balance mb-3">
            Amor Bello Muack — Ropa Unisex
          </h1>
          <p className="text-muted-foreground text-lg">
            Prendas cómodas y con estilo. Elige tu talla y color, y haz tu pedido directo por WhatsApp.
          </p>
        </div>
      </section>

      <section className="container py-12">
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-96 rounded-3xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : !products || products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>Pronto tendremos productos disponibles.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
