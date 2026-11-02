-- Grant Todo Clean Peru administrator access to the existing Auth user.
DO $$
DECLARE
  target_user_id uuid;
BEGIN
  SELECT id
  INTO target_user_id
  FROM auth.users
  WHERE lower(email) = lower('admin@todocleanperu.com')
  LIMIT 1;

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION
      'The user admin@todocleanperu.com does not exist in Authentication > Users';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END
$$;

SELECT
  u.email,
  u.email_confirmed_at IS NOT NULL AS confirmed,
  r.role
FROM auth.users AS u
JOIN public.user_roles AS r ON r.user_id = u.id
WHERE lower(u.email) = lower('admin@todocleanperu.com');
