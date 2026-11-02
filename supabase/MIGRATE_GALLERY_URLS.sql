-- Run only after uploading all 25 files to gallery/legacy.
BEGIN;

WITH migrated(sort_order, image_url) AS (
  VALUES
    (0, 'https://cwedwmljbocetgxafrly.supabase.co/storage/v1/object/public/gallery/legacy/01-IMG_0304.jpg'),
    (1, 'https://cwedwmljbocetgxafrly.supabase.co/storage/v1/object/public/gallery/legacy/02-IMG_0310.jpg'),
    (2, 'https://cwedwmljbocetgxafrly.supabase.co/storage/v1/object/public/gallery/legacy/03-IMG_0312.jpg'),
    (3, 'https://cwedwmljbocetgxafrly.supabase.co/storage/v1/object/public/gallery/legacy/04-IMG_0315.jpg'),
    (4, 'https://cwedwmljbocetgxafrly.supabase.co/storage/v1/object/public/gallery/legacy/05-IMG_0320.jpg'),
    (5, 'https://cwedwmljbocetgxafrly.supabase.co/storage/v1/object/public/gallery/legacy/06-IMG_0328.jpg'),
    (6, 'https://cwedwmljbocetgxafrly.supabase.co/storage/v1/object/public/gallery/legacy/07-IMG_0329-1.jpg'),
    (7, 'https://cwedwmljbocetgxafrly.supabase.co/storage/v1/object/public/gallery/legacy/08-IMG_0332.jpg'),
    (8, 'https://cwedwmljbocetgxafrly.supabase.co/storage/v1/object/public/gallery/legacy/09-IMG_0335.jpg'),
    (9, 'https://cwedwmljbocetgxafrly.supabase.co/storage/v1/object/public/gallery/legacy/10-IMG_0337.jpg'),
    (10, 'https://cwedwmljbocetgxafrly.supabase.co/storage/v1/object/public/gallery/legacy/11-IMG_0342.jpg'),
    (11, 'https://cwedwmljbocetgxafrly.supabase.co/storage/v1/object/public/gallery/legacy/12-IMG_0344.jpg'),
    (12, 'https://cwedwmljbocetgxafrly.supabase.co/storage/v1/object/public/gallery/legacy/13-IMG_0351.jpg'),
    (13, 'https://cwedwmljbocetgxafrly.supabase.co/storage/v1/object/public/gallery/legacy/14-IMG_0354.jpg'),
    (14, 'https://cwedwmljbocetgxafrly.supabase.co/storage/v1/object/public/gallery/legacy/15-IMG_0361.jpg'),
    (15, 'https://cwedwmljbocetgxafrly.supabase.co/storage/v1/object/public/gallery/legacy/16-IMG_0372.jpg'),
    (16, 'https://cwedwmljbocetgxafrly.supabase.co/storage/v1/object/public/gallery/legacy/17-IMG_0375.jpg'),
    (17, 'https://cwedwmljbocetgxafrly.supabase.co/storage/v1/object/public/gallery/legacy/18-IMG_0376-1.jpg'),
    (18, 'https://cwedwmljbocetgxafrly.supabase.co/storage/v1/object/public/gallery/legacy/19-IMG_0377.jpg'),
    (19, 'https://cwedwmljbocetgxafrly.supabase.co/storage/v1/object/public/gallery/legacy/20-IMG_0380.jpg'),
    (20, 'https://cwedwmljbocetgxafrly.supabase.co/storage/v1/object/public/gallery/legacy/21-IMG_0381.jpg'),
    (21, 'https://cwedwmljbocetgxafrly.supabase.co/storage/v1/object/public/gallery/legacy/22-IMG_0389.jpg'),
    (22, 'https://cwedwmljbocetgxafrly.supabase.co/storage/v1/object/public/gallery/legacy/23-IMG_0392.jpg'),
    (23, 'https://cwedwmljbocetgxafrly.supabase.co/storage/v1/object/public/gallery/legacy/24-IMG_0396.jpg'),
    (24, 'https://cwedwmljbocetgxafrly.supabase.co/storage/v1/object/public/gallery/legacy/25-IMG_0399-1.jpg')
)
UPDATE public.gallery_images AS gallery
SET image_url = migrated.image_url,
    updated_at = now()
FROM migrated
WHERE gallery.sort_order = migrated.sort_order;

COMMIT;

SELECT
  count(*) AS total,
  count(*) FILTER (
    WHERE image_url LIKE 'https://cwedwmljbocetgxafrly.supabase.co/storage/v1/object/public/gallery/legacy/%'
  ) AS migrated_to_new_storage
FROM public.gallery_images;
