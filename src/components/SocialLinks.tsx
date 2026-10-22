import { Button } from "@/components/ui/button";

function InstagramIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.53V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.83 2.89 2.89 0 0 1-2.88-2.89 2.89 2.89 0 0 1 2.88-2.89c.3 0 .59.06.87.15V9.4a6.37 6.37 0 0 0-.87-.06A6.28 6.28 0 0 0 2.5 15.62a6.28 6.28 0 0 0 6.28 6.28 6.28 6.28 0 0 0 6.28-6.28V8.93a8.2 8.2 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-2.24-.36z" />
    </svg>
  );
}

function FacebookIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function YouTubeIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.5 6.5a3 3 0 0 0-2.1-2.12C19.5 4 12 4 12 4s-7.5 0-9.4.38A3 3 0 0 0 .5 6.5 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.12C4.5 20 12 20 12 20s7.5 0 9.4-.38a3 3 0 0 0 2.1-2.12A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.5zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
    </svg>
  );
}

export type SocialProfile = {
  name: string;
  url: string;
  handle: string;
  icon: "instagram" | "tiktok" | "facebook" | "youtube";
};

export function SocialLinks({ profiles, accentColor }: { profiles: SocialProfile[]; accentColor?: string }) {
  const color = accentColor || "var(--primary)";

  return (
    <section className="container py-12">
      <div className="bg-card rounded-3xl p-8 lg:p-12 border border-border/60 shadow-soft text-center space-y-6">
        <h2 className="font-display text-2xl lg:text-3xl text-balance">Síguenos en redes</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Entérate de novedades, consejos y contenido exclusivo en nuestras redes sociales.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {profiles.map((p) => {
            const Icon =
              p.icon === "tiktok" ? TikTokIcon :
              p.icon === "facebook" ? FacebookIcon :
              p.icon === "youtube" ? YouTubeIcon :
              InstagramIcon;
            return (
              <Button
                key={p.url}
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-6 gap-3 hover:shadow-hover transition-base"
              >
                <a href={p.url} target="_blank" rel="noopener noreferrer" aria-label={p.name}>
                  <Icon className="w-5 h-5" style={{ color }} />
                  <span className="font-medium">{p.name}</span>
                </a>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
