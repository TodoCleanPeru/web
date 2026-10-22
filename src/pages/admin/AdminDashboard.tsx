import { useEffect, useState } from "react";
import { Briefcase, Mail, UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ services: 0, contacts: 0, applications: 0 });

  useEffect(() => {
    (async () => {
      const [s, c, a] = await Promise.all([
        supabase.from("services").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("contact_requests").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("job_applications").select("*", { count: "exact", head: true }).eq("status", "new"),
      ]);
      setCounts({ services: s.count ?? 0, contacts: c.count ?? 0, applications: a.count ?? 0 });
    })();
  }, []);

  const cards = [
    { label: "Servicios activos", value: counts.services, icon: Briefcase, color: "from-sky-500 to-blue-500" },
    { label: "Solicitudes nuevas", value: counts.contacts, icon: Mail, color: "from-emerald-500 to-teal-500" },
    { label: "Postulaciones nuevas", value: counts.applications, icon: UserCheck, color: "from-orange-500 to-amber-500" },
  ];

  return (
    <div className="max-w-5xl">
      <h1 className="font-display text-3xl mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">Resumen general del sitio.</p>
      <div className="grid sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-card rounded-3xl p-6 border border-border/60 shadow-soft">
            <div className={`w-12 h-12 rounded-2xl mb-4 bg-gradient-to-br ${c.color} flex items-center justify-center`}>
              <c.icon className="w-6 h-6 text-white" />
            </div>
            <div className="font-display text-4xl font-semibold">{c.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
