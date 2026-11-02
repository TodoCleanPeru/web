import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const source = await readFile(
  new URL("../supabase/migrations/20260721201435_37cefe1c-84bc-4470-8c1b-2c597cce104c.sql", import.meta.url),
  "utf8",
);

const urls = [...source.matchAll(/\('(https:\/\/brjwevsebwfedsokosmd\.supabase\.co\/storage\/v1\/object\/sign\/[^']+)'/g)]
  .map((match) => match[1]);

if (urls.length !== 25) {
  throw new Error(`Expected 25 gallery URLs, found ${urls.length}`);
}

const outputDir = new URL("../deliverables/todo-clean-gallery-migration/files/", import.meta.url);
await mkdir(outputDir, { recursive: true });

const manifest = [];

for (const [index, url] of urls.entries()) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Download failed (${response.status}): ${url}`);
  }

  const sourceName = decodeURIComponent(new URL(url).pathname.split("/").at(-1));
  const extension = path.extname(sourceName) || ".jpg";
  const safeStem = path.basename(sourceName, extension)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const filename = `${String(index + 1).padStart(2, "0")}-${safeStem}${extension.toLowerCase()}`;
  const bytes = new Uint8Array(await response.arrayBuffer());

  await writeFile(new URL(filename, outputDir), bytes);
  manifest.push({
    sort_order: index,
    source_name: sourceName,
    filename,
    bytes: bytes.byteLength,
    content_type: response.headers.get("content-type"),
  });
}

await writeFile(
  new URL("../deliverables/todo-clean-gallery-migration/manifest.json", import.meta.url),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log(JSON.stringify({ files: manifest.length, bytes: manifest.reduce((sum, item) => sum + item.bytes, 0) }));
