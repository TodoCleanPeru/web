import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { parseService, Service } from "@/types/service";

export function useActiveServices() {
  return useQuery({
    queryKey: ["services", "active"],
    queryFn: async (): Promise<Service[]> => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map(parseService);
    },
  });
}

export function useServiceBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["services", "slug", slug],
    enabled: !!slug,
    queryFn: async (): Promise<Service | null> => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("slug", slug!)
        .maybeSingle();
      if (error) throw error;
      return data ? parseService(data) : null;
    },
  });
}

export function useAllServices() {
  return useQuery({
    queryKey: ["services", "all"],
    queryFn: async (): Promise<Service[]> => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map(parseService);
    },
  });
}
