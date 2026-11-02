-- Todo Clean Peru: final migration after the base migrations already applied.
-- Safe to run more than once.

BEGIN;

-- Editable site-wide content.
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Site settings are public" ON public.site_settings;
DROP POLICY IF EXISTS "Admins insert site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins delete site settings" ON public.site_settings;

CREATE POLICY "Site settings are public" ON public.site_settings
  FOR SELECT USING (true);
CREATE POLICY "Admins insert site settings" ON public.site_settings
  FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins update site settings" ON public.site_settings
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins delete site settings" ON public.site_settings
  FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP TRIGGER IF EXISTS trg_site_settings_updated ON public.site_settings;
CREATE TRIGGER trg_site_settings_updated
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Extra editable fields used by the service editor.
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS brand_logo_url text;
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS custom_sections jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Public buckets. Public delivery uses the CDN; writes remain admin-only.
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('site-media', 'site-media', true),
  ('products', 'products', true),
  ('gallery', 'gallery', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- Remove older or broad object policies before installing the final policies.
DROP POLICY IF EXISTS "Public read site media" ON storage.objects;
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Public read gallery" ON storage.objects;

DROP POLICY IF EXISTS "Admins upload site media" ON storage.objects;
DROP POLICY IF EXISTS "Admins update site media" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete site media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload gallery" ON storage.objects;
DROP POLICY IF EXISTS "Admins update gallery" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete gallery" ON storage.objects;

CREATE POLICY "Admins upload site media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'site-media'
    AND private.has_role(auth.uid(), 'admin'::public.app_role)
  );
CREATE POLICY "Admins update site media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'site-media'
    AND private.has_role(auth.uid(), 'admin'::public.app_role)
  )
  WITH CHECK (
    bucket_id = 'site-media'
    AND private.has_role(auth.uid(), 'admin'::public.app_role)
  );
CREATE POLICY "Admins delete site media" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'site-media'
    AND private.has_role(auth.uid(), 'admin'::public.app_role)
  );

CREATE POLICY "Admins can upload product images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'products'
    AND private.has_role(auth.uid(), 'admin'::public.app_role)
  );
CREATE POLICY "Admins can update product images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'products'
    AND private.has_role(auth.uid(), 'admin'::public.app_role)
  )
  WITH CHECK (
    bucket_id = 'products'
    AND private.has_role(auth.uid(), 'admin'::public.app_role)
  );
CREATE POLICY "Admins can delete product images" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'products'
    AND private.has_role(auth.uid(), 'admin'::public.app_role)
  );

CREATE POLICY "Admins upload gallery" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'gallery'
    AND private.has_role(auth.uid(), 'admin'::public.app_role)
  );
CREATE POLICY "Admins update gallery" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'gallery'
    AND private.has_role(auth.uid(), 'admin'::public.app_role)
  )
  WITH CHECK (
    bucket_id = 'gallery'
    AND private.has_role(auth.uid(), 'admin'::public.app_role)
  );
CREATE POLICY "Admins delete gallery" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'gallery'
    AND private.has_role(auth.uid(), 'admin'::public.app_role)
  );

COMMIT;

-- Verification result: expect 8 services, 3 buckets and all tables = true.
SELECT
  (SELECT count(*) FROM public.services) AS services,
  (SELECT count(*) FROM public.gallery_images) AS gallery_images,
  (SELECT count(*) FROM public.products) AS products,
  (SELECT count(*) FROM storage.buckets
    WHERE id IN ('site-media', 'products', 'gallery')) AS buckets,
  to_regclass('public.site_settings') IS NOT NULL AS has_site_settings,
  to_regclass('public.contact_requests') IS NOT NULL AS has_contact_requests,
  to_regclass('public.job_applications') IS NOT NULL AS has_job_applications;
