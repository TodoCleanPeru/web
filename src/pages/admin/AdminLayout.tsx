import { Link, NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Briefcase, Mail, UserCheck, LogOut, Sparkles, ShoppingBag, Image as ImageIcon, FileText } from "lucide-react";
import { useIsAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/contenido", label: "Contenido", icon: FileText },
  { to: "/admin/servicios", label: "Servicios", icon: Briefcase },
  { to: "/admin/tienda", label: "Tienda", icon: ShoppingBag },
  { to: "/admin/galeria", label: "Galería", icon: ImageIcon },
  { to: "/admin/contactos", label: "Solicitudes", icon: Mail },
  { to: "/admin/postulaciones", label: "Postulaciones", icon: UserCheck },
];


export default function AdminLayout() {
  const { user, isAdmin, loading } = useIsAdmin();
  const navigate = useNavigate();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Cargando…</div>;
  }
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center bg-card rounded-3xl p-8 border border-border/60 shadow-card">
          <h1 className="font-display text-2xl mb-3">Acceso restringido</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Tu cuenta ({user.email}) no tiene rol de administrador. Pídele a un administrador que te asigne el rol "admin" desde la base de datos.
          </p>
          <Button onClick={() => supabase.auth.signOut().then(() => navigate("/admin/login"))}>Cerrar sesión</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[260px_1fr]">
      <aside className="bg-card border-r border-border/60 p-5 hidden lg:flex flex-col">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-2xl bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="font-display font-semibold">Admin</div>
        </Link>
        <nav className="flex flex-col gap-1 flex-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-base",
                isActive ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <l.icon className="w-4 h-4" />
              {l.label}
            </NavLink>
          ))}
        </nav>
        <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut().then(() => navigate("/"))}>
          <LogOut /> Cerrar sesión
        </Button>
      </aside>

      {/* mobile top bar */}
      <div className="lg:hidden border-b border-border/60 bg-card p-3 flex gap-2 overflow-x-auto">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end}
            className={({ isActive }) => cn("px-3 py-1.5 rounded-full text-xs whitespace-nowrap", isActive ? "bg-primary-soft text-primary" : "bg-muted")}>
            {l.label}
          </NavLink>
        ))}
      </div>

      <div className="p-6 lg:p-10 bg-background overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}
