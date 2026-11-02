import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const manifest = JSON.parse(
  await readFile(new URL("deliverables/todo-clean-gallery-migration/manifest.json", root), "utf8"),
);

const projectUrl = "https://cwedwmljbocetgxafrly.supabase.co";
const rows = manifest
  .map(({ sort_order, filename }) => {
    const publicUrl = `${projectUrl}/storage/v1/object/public/gallery/legacy/${encodeURIComponent(filename)}`;
    return `    (${sort_order}, '${publicUrl}')`;
  })
  .join(",\n");

const sql = `-- Run only after uploading all 25 files to gallery/legacy.
BEGIN;

WITH migrated(sort_order, image_url) AS (
  VALUES
${rows}
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
    WHERE image_url LIKE '${projectUrl}/storage/v1/object/public/gallery/legacy/%'
  ) AS migrated_to_new_storage
FROM public.gallery_images;
`;

await writeFile(new URL("supabase/MIGRATE_GALLERY_URLS.sql", root), sql);
console.log(`Generated ${manifest.length} gallery URL mappings`);
