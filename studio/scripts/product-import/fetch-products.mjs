// Usage: node scripts/product-import/fetch-products.mjs <url1> <url2> ...
//
// Scrapes each tuananh.vn product detail page and writes
// scripts/product-import/output/products-import.xlsx with 3 sheets
// (Sản phẩm / Biến thể / Ảnh) for manual review/editing before import.
import * as cheerio from "cheerio";
import ExcelJS from "exceljs";
import TurndownService from "turndown";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { slugify, parseVndPrice, guessCategory } from "./lib.mjs";

const urls = process.argv.slice(2);
if (urls.length === 0) {
  console.error("Usage: node fetch-products.mjs <url1> <url2> ...");
  process.exit(1);
}

const turndown = new TurndownService({ headingStyle: "atx" });
const OUTPUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "output");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "products-import.xlsx");

async function fetchProduct(url) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; maybedding-import/1.0)" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} khi tải ${url}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const name = $('meta[property="og:title"]').attr("content")?.trim() || $("h1").first().text().trim();
  const price = parseVndPrice($("#priceshow").first().text());

  const images = [];
  $(".small_image li a").each((_, el) => {
    const href = $(el).attr("href");
    if (href) images.push(new URL(href, url).toString());
  });
  // Fall back to the single zoom image if the site didn't render a thumbnail strip.
  if (images.length === 0) {
    const zoomSrc = $("#product-zoom-img").attr("data-zoom-image") || $("#product-zoom-img").attr("src");
    if (zoomSrc) images.push(new URL(zoomSrc, url).toString());
  }

  const variants = [];
  $('select[name="size"] option[data-price]').each((_, el) => {
    const label = $(el).text().trim();
    const variantPrice = parseVndPrice($(el).attr("data-price"));
    if (label && variantPrice !== undefined) variants.push({ label, price: variantPrice });
  });

  const descriptionHtml = $("#product-info").html() || "";
  const bodyMarkdown = turndown.turndown(descriptionHtml).trim();

  const shortDescription = $('meta[property="og:description"]').attr("content")?.trim() || "";

  return {
    slug: slugify(name),
    name,
    price: price ?? 0,
    category: guessCategory(url),
    badge: "",
    shortDescription,
    bodyMarkdown,
    sourceUrl: url,
    images,
    variants,
  };
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const products = [];
  for (const url of urls) {
    console.log(`Đang tải: ${url}`);
    try {
      const product = await fetchProduct(url);
      products.push(product);
      console.log(`  -> ${product.name} (${product.images.length} ảnh, ${product.variants.length} biến thể)`);
    } catch (err) {
      console.error(`  Lỗi: ${err.message}`);
    }
  }

  if (products.length === 0) {
    console.error("Không lấy được sản phẩm nào.");
    process.exit(1);
  }

  const workbook = new ExcelJS.Workbook();

  const productSheet = workbook.addWorksheet("Sản phẩm");
  productSheet.columns = [
    { header: "slug", key: "slug", width: 30 },
    { header: "name", key: "name", width: 40 },
    { header: "price", key: "price", width: 14 },
    { header: "category (dem/chan/ga/goi/phu-kien)", key: "category", width: 20 },
    { header: "badge", key: "badge", width: 20 },
    { header: "shortDescription", key: "shortDescription", width: 50 },
    { header: "bodyMarkdown", key: "bodyMarkdown", width: 60 },
    { header: "sourceUrl", key: "sourceUrl", width: 40 },
  ];
  for (const p of products) {
    productSheet.addRow({
      slug: p.slug,
      name: p.name,
      price: p.price,
      category: p.category,
      badge: p.badge,
      shortDescription: p.shortDescription,
      bodyMarkdown: p.bodyMarkdown,
      sourceUrl: p.sourceUrl,
    });
  }

  const variantSheet = workbook.addWorksheet("Biến thể");
  variantSheet.columns = [
    { header: "slug", key: "slug", width: 30 },
    { header: "label", key: "label", width: 30 },
    { header: "price", key: "price", width: 14 },
  ];
  for (const p of products) {
    for (const v of p.variants) {
      variantSheet.addRow({ slug: p.slug, label: v.label, price: v.price });
    }
  }

  const imageSheet = workbook.addWorksheet("Ảnh");
  imageSheet.columns = [
    { header: "slug", key: "slug", width: 30 },
    { header: "order", key: "order", width: 8 },
    { header: "url", key: "url", width: 80 },
  ];
  for (const p of products) {
    p.images.forEach((url, i) => imageSheet.addRow({ slug: p.slug, order: i + 1, url }));
  }

  await workbook.xlsx.writeFile(OUTPUT_FILE);
  console.log(`\nĐã ghi ${products.length} sản phẩm vào ${OUTPUT_FILE}`);
}

main();
