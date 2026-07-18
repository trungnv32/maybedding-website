// Shared helpers for the product import scripts (fetch-products.mjs / import-products.mjs).

const VN_CATEGORY_KEYWORDS = [
  ["dem", "dem"],
  ["chan", "chan"],
  ["goi", "goi"],
  ["ga-", "ga"],
  ["-ga", "ga"],
];

// Combining diacritical marks range (U+0300-U+036F), built from code points to
// avoid embedding literal combining characters in this source file.
const COMBINING_MARKS = new RegExp(`[${String.fromCharCode(0x0300)}-${String.fromCharCode(0x036f)}]`, "g");

export function slugify(input) {
  return input
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// "1.060.000 đ" / "1,060,000đ" -> 1060000
export function parseVndPrice(text) {
  if (!text) return undefined;
  const digits = String(text).replace(/[^\d]/g, "");
  return digits ? Number(digits) : undefined;
}

export function guessCategory(urlOrSlug) {
  const s = urlOrSlug.toLowerCase();
  for (const [needle, category] of VN_CATEGORY_KEYWORDS) {
    if (s.includes(needle)) return category;
  }
  return "";
}
