/**
 * Post-build image optimization for the static export.
 *
 * Runs over `out/assets/**` only, so the sources committed in `public/` keep
 * their original quality — this rewrites the deployed copy, never the repo copy.
 *
 * Formats and filenames are preserved on purpose: every image URL is already
 * published in metadata, JSON post data and hand-written HTML templates, and a
 * static export has no redirects to repair a renamed asset.
 *
 * A rewritten file is only kept when it is meaningfully smaller, so an image
 * that is already well encoded is left byte-identical.
 */
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

const ROOT = path.join(process.cwd(), 'out', 'assets');
const MAX_EDGE = 2000;
const MIN_GAIN = 0.1;
const JPEG_QUALITY = 88;
const PNG_QUALITY = 95;

async function collect(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? collect(full) : Promise.resolve([full]);
    })
  );

  return files.flat().filter((file) => /\.(png|jpe?g)$/i.test(file));
}

async function optimize(file) {
  const original = await readFile(file);
  const isPng = /\.png$/i.test(file);

  let pipeline = sharp(original);
  const { width, height } = await pipeline.metadata();

  if (Math.max(width ?? 0, height ?? 0) > MAX_EDGE) {
    pipeline = pipeline.resize(MAX_EDGE, MAX_EDGE, { fit: 'inside', withoutEnlargement: true });
  }

  const rewritten = await (isPng
    ? pipeline.png({ compressionLevel: 9, effort: 10, palette: true, quality: PNG_QUALITY, dither: 1 })
    : pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
  ).toBuffer();

  if (rewritten.length > original.length * (1 - MIN_GAIN)) {
    return { saved: 0, before: original.length };
  }

  await writeFile(file, rewritten);
  return { saved: original.length - rewritten.length, before: original.length };
}

const mb = (bytes) => `${(bytes / 1048576).toFixed(2)} MB`;

try {
  await stat(ROOT);
} catch {
  console.log('optimize-images: no out/assets directory, nothing to do.');
  process.exit(0);
}

const files = await collect(ROOT);
let before = 0;
let saved = 0;
let rewritten = 0;

for (const file of files) {
  try {
    const result = await optimize(file);
    before += result.before;
    saved += result.saved;
    if (result.saved > 0) rewritten += 1;
  } catch (error) {
    // A single unreadable asset must not fail the deploy; it ships as-is.
    console.warn(`optimize-images: skipped ${path.relative(ROOT, file)} — ${error.message}`);
  }
}

console.log(
  `optimize-images: ${rewritten}/${files.length} rewritten, ${mb(before)} -> ${mb(before - saved)} (-${((saved / before) * 100).toFixed(0)}%)`
);
