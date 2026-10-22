
-- Restrict has_role SECURITY DEFINER execution
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

-- Replace overly permissive INSERT policies with field validation
DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_requests;
CREATE POLICY "Anyone can submit contact"
ON public.contact_requests
FOR INSERT
WITH CHECK (
  name IS NOT NULL AND length(trim(name)) BETWEEN 2 AND 120
  AND phone IS NOT NULL AND length(trim(phone)) BETWEEN 6 AND 30
  AND (message IS NULL OR length(message) <= 2000)
  AND (email IS NULL OR length(email) <= 200)
  AND (service_slug IS NULL OR length(service_slug) <= 120)
  AND (district IS NULL OR length(district) <= 120)
);

DROP POLICY IF EXISTS "Anyone can apply" ON public.job_applications;
CREATE POLICY "Anyone can apply"
ON public.job_applications
FOR INSERT
WITH CHECK (
  name IS NOT NULL AND length(trim(name)) BETWEEN 2 AND 120
  AND phone IS NOT NULL AND length(trim(phone)) BETWEEN 6 AND 30
  AND (message IS NULL OR length(message) <= 2000)
  AND (email IS NULL OR length(email) <= 200)
  AND (service_slug IS NULL OR length(service_slug) <= 120)
  AND (district IS NULL OR length(district) <= 120)
  AND (experience IS NULL OR length(experience) <= 2000)
  AND (availability IS NULL OR length(availability) <= 500)
  AND (document IS NULL OR length(document) <= 50)
);
