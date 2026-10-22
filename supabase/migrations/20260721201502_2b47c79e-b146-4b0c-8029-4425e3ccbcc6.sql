
CREATE POLICY "Public read gallery" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Admins upload gallery" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'gallery' AND private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update gallery" ON storage.objects
  FOR UPDATE USING (bucket_id = 'gallery' AND private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete gallery" ON storage.objects
  FOR DELETE USING (bucket_id = 'gallery' AND private.has_role(auth.uid(), 'admin'::app_role));
