import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type GalleryImage = {
  id: string;
  image_url: string;
  alt: string | null;
  sort_order: number;
  is_active: boolean;
};

export function useActiveGallery() {
  return useQuery({
    queryKey: ["gallery", "active"],
    queryFn: async (): Promise<GalleryImage[]> => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as GalleryImage[];
    },
  });
}

export function useAllGallery() {
  return useQuery({
    queryKey: ["gallery", "all"],
    queryFn: async (): Promise<GalleryImage[]> => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as GalleryImage[];
    },
  });
}
