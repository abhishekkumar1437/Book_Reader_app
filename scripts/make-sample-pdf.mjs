// Generates a simple multi-page PDF (with an outline) for trying out the reader.
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const PAGES = Number(process.argv[2] ?? 64);
const W = 420, H = 595; // A5 points
const objects = [];
const add = (body) => { objects.push(body); return objects.length; };

const font = add("<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>");
const fontB = add("<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>");
const pagesId = objects.length + 1 + PAGES * 2; // reserved after page/content pairs
const pageIds = [];
const chapterPages = [];

const lorem = "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump. Sphinx of black quartz, judge my vow.".split(" ");

for (let p = 1; p <= PAGES; p++) {
  const isChapter = p === 1 || (p - 1) % 8 === 0;
  if (isChapter) chapterPages.push(p);
  const lines = [];
  lines.push("BT");
  if (p === 1) {
    lines.push(`/F2 30 Tf 60 ${H - 200} Td (Sample Book) Tj`);
    lines.push(`/F1 14 Tf 0 -40 Td (A generated PDF for the flipbook reader) Tj`);
    lines.push(`0 -30 Td (${PAGES} pages) Tj`);
  } else {
    if (isChapter) lines.push(`/F2 22 Tf 50 ${H - 80} Td (Chapter ${chapterPages.length - 1}) Tj 0 -34 Td`);
    else lines.push(`/F1 12 Tf 50 ${H - 80} Td`);
    lines.push(`/F1 11 Tf`);
    let word = (p * 7) % lorem.length;
    for (let l = 0; l < 30; l++) {
      const words = [];
      let len = 0;
      while (len < 52) { const w = lorem[word++ % lorem.length]; words.push(w); len += w.length + 1; }
      lines.push(`(${words.join(" ")}) Tj 0 -15 Td`);
    }
    lines.push(`/F1 9 Tf 0 ${-(H - 80 - 30 * 15 - 40)} Td (Page ${p} of ${PAGES}) Tj`);
  }
  lines.push("ET");
  // a decorative rule
  lines.push(`0.6 0.5 0.3 RG 1 w 50 ${H - 60} m ${W - 50} ${H - 60} l S`);
  const stream = lines.join("\n");
  const contentId = add(`<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`);
  const pageId = add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${W} ${H}] /Contents ${contentId} 0 R /Resources << /Font << /F1 ${font} 0 R /F2 ${fontB} 0 R >> >> >>`);
  pageIds.push(pageId);
}

const pagesActual = add(`<< /Type /Pages /Count ${PAGES} /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] >>`);
if (pagesActual !== pagesId) throw new Error("page tree id mismatch");

// Outline
const outlineId = objects.length + 1;
const itemIds = chapterPages.map((_, i) => outlineId + 1 + i);
add(`<< /Type /Outlines /First ${itemIds[0]} 0 R /Last ${itemIds[itemIds.length - 1]} 0 R /Count ${itemIds.length} >>`);
chapterPages.forEach((p, i) => {
  const title = i === 0 ? "Title page" : `Chapter ${i}`;
  add(`<< /Title (${title}) /Parent ${outlineId} 0 R ${i > 0 ? `/Prev ${itemIds[i - 1]} 0 R ` : ""}${i < itemIds.length - 1 ? `/Next ${itemIds[i + 1]} 0 R ` : ""}/Dest [${pageIds[p - 1]} 0 R /XYZ 0 ${H} 0] >>`);
});
const catalog = add(`<< /Type /Catalog /Pages ${pagesId} 0 R /Outlines ${outlineId} 0 R /PageMode /UseOutlines >>`);

let out = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
const offsets = [];
objects.forEach((body, i) => {
  offsets.push(Buffer.byteLength(out, "latin1"));
  out += `${i + 1} 0 obj\n${body}\nendobj\n`;
});
const xref = Buffer.byteLength(out, "latin1");
out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (const o of offsets) out += `${String(o).padStart(10, "0")} 00000 n \n`;
out += `trailer\n<< /Size ${objects.length + 1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;

mkdirSync("books", { recursive: true });
const file = join("books", `Sample Book (${PAGES} pages).pdf`);
writeFileSync(file, Buffer.from(out, "latin1"));
console.log(`Wrote ${file}`);
