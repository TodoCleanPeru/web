
-- Move has_role to a private schema not exposed via the Data API
CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Update RLS policies to use private.has_role
-- user_roles
DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- services
DROP POLICY IF EXISTS "Admins read all services" ON public.services;
DROP POLICY IF EXISTS "Admins insert services" ON public.services;
DROP POLICY IF EXISTS "Admins update services" ON public.services;
DROP POLICY IF EXISTS "Admins delete services" ON public.services;
CREATE POLICY "Admins read all services" ON public.services FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert services" ON public.services FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update services" ON public.services FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete services" ON public.services FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

-- contact_requests
DROP POLICY IF EXISTS "Admins read contacts" ON public.contact_requests;
DROP POLICY IF EXISTS "Admins update contacts" ON public.contact_requests;
DROP POLICY IF EXISTS "Admins delete contacts" ON public.contact_requests;
CREATE POLICY "Admins read contacts" ON public.contact_requests FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update contacts" ON public.contact_requests FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete contacts" ON public.contact_requests FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

-- job_applications
DROP POLICY IF EXISTS "Admins read applications" ON public.job_applications;
DROP POLICY IF EXISTS "Admins update applications" ON public.job_applications;
DROP POLICY IF EXISTS "Admins delete applications" ON public.job_applications;
CREATE POLICY "Admins read applications" ON public.job_applications FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update applications" ON public.job_applications FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete applications" ON public.job_applications FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

-- products
DROP POLICY IF EXISTS "Admins can view all products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can view all products" ON public.products FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));

-- storage.objects policies for products bucket admin management
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;
CREATE POLICY "Admins can upload product images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'products' AND private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update product images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'products' AND private.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'products' AND private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete product images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'products' AND private.has_role(auth.uid(), 'admin'));

-- Drop the public.has_role function (now unused; exposed via API)
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

-- Fix public bucket listing: remove broad public SELECT on storage.objects for the products bucket.
-- Objects remain accessible via their public CDN URLs; only anonymous listing/enumeration is prevented.
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
