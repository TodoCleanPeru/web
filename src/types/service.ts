export type FAQ = { q: string; a: string };
export type CustomSection = { title: string; content: string; media_url?: string };

export interface Service {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  short_description: string | null;
  long_description: string | null;
  hero_image_url: string | null;
  gallery: string[];
  accent_color: string;
  price_from: number | null;
  show_price: boolean;
  includes: string[];
  benefits: string[];
  ideal_for: string[];
  faqs: FAQ[];
  video_url: string | null;
  brand_logo_url: string | null;
  custom_sections: CustomSection[];
  category: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

type ServiceRow = Database["public"]["Tables"]["services"]["Row"];

export const parseService = (row: ServiceRow): Service => ({
  ...row,
  gallery: Array.isArray(row.gallery) ? row.gallery : [],
  includes: Array.isArray(row.includes) ? row.includes : [],
  benefits: Array.isArray(row.benefits) ? row.benefits : [],
  ideal_for: Array.isArray(row.ideal_for) ? row.ideal_for : [],
  faqs: Array.isArray(row.faqs) ? row.faqs as FAQ[] : [],
  video_url: row.video_url ?? null,
  brand_logo_url: row.brand_logo_url ?? null,
  custom_sections: Array.isArray(row.custom_sections) ? row.custom_sections as CustomSection[] : [],
});
import type { Database } from "@/integrations/supabase/types";

