// Rasterise public/favicon.svg into the PNG icons referenced by the PWA
// manifest and index.html. Run with: node scripts/generate-icons.mjs
//
// Outputs (all on a solid #080d14 background):
//   public/icon-192.png        192x192  (manifest, maskable)
//   public/icon-512.png        512x512  (manifest, maskable)
//   public/apple-touch-icon.png 180x180 (iOS home screen)
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const svg = readFileSync(resolve(root, "public/favicon.svg"));
const BG = { r: 8, g: 13, b: 20, alpha: 1 }; // #080d14

const targets = [
  { file: "public/icon-192.png", size: 192 },
  { file: "public/icon-512.png", size: 512 },
  { file: "public/apple-touch-icon.png", size: 180 },
];

for (const { file, size } of targets) {
  await sharp(svg, { density: 384 })
    .resize(size, size, { fit: "contain", background: BG })
    .flatten({ background: BG })
    .png()
    .toFile(resolve(root, file));
  console.log(`wrote ${file} (${size}x${size})`);
}
