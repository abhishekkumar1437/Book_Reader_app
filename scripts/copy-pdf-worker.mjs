// Copies the PDF.js worker and its asset folders (standard fonts, CMaps, ICC profiles,
// WASM decoders) into /public/pdfjs so the browser can load them from stable URLs.
import { cpSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const src = join("node_modules", "pdfjs-dist");
const dest = join("public", "pdfjs");
mkdirSync(dest, { recursive: true });

cpSync(join(src, "build", "pdf.worker.min.mjs"), join(dest, "pdf.worker.min.mjs"));
for (const dir of ["standard_fonts", "cmaps", "iccs", "wasm"]) {
  cpSync(join(src, dir), join(dest, dir), { recursive: true });
}
console.log(`Copied PDF.js worker and assets -> ${dest}`);
