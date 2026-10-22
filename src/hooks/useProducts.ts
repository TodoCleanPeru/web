import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  sizes: string[];
  colors: string[];
  is_active: boolean;
  sort_order: number;
};

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

const parse = (r: ProductRow): Product => ({
  id: r.id,
  name: r.name,
  description: r.description,
  price: Number(r.price) || 0,
  image_url: r.image_url,
  sizes: Array.isArray(r.sizes) ? r.sizes : [],
  colors: Array.isArray(r.colors) ? r.colors : [],
  is_active: !!r.is_active,
  sort_order: r.sort_order ?? 0,
});

export function useActiveProducts() {
  return useQuery({
    queryKey: ["products", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map(parse);
    },
  });
}

export function useAllProducts() {
  return useQuery({
    queryKey: ["products", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map(parse);
    },
  });
}
