// Usage: SANITY_AUTH_TOKEN=<token> node scripts/product-import/import-products.mjs <file.xlsx>
//
// Reads a workbook shaped like fetch-products.mjs's output (sheets "Sản phẩm" /
// "Biến thể" / "Ảnh", joined by the "slug" column — edit freely in Excel first)
// and upserts each product into Sanity as isActive:false, ready for review.
import ExcelJS from "exceljs";
import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";

const VALID_CATEGORIES = new Set(["dem", "chan", "ga", "goi", "phu-kien"]);

const file = process.argv[2];
if (!file) {
  console.error("Usage: SANITY_AUTH_TOKEN=<token> node import-products.mjs <file.xlsx>");
  process.exit(1);
}
if (!process.env.SANITY_AUTH_TOKEN) {
  console.error("Thiếu SANITY_AUTH_TOKEN. Lấy bằng: npx sanity debug --secrets");
  process.exit(1);
}

const client = createClient({
  projectId: "w11gsv8j",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
});

function sheetToObjects(sheet) {
  const [headerRow, ...rows] = sheet.getRows(1, sheet.rowCount) ?? [];
  if (!headerRow) return [];
  const headers = headerRow.values.map((v) => (typeof v === "string" ? v.trim() : v));
  return rows
    .filter((row) => row.values.some((v) => v !== undefined && v !== null && v !== ""))
    .map((row) => {
      const obj = {};
      headers.forEach((h, i) => {
        if (!h) return;
        const key = h.split(" ")[0]; // "category (dem/chan/...)" -> "category"
        obj[key] = row.values[i];
      });
      return obj;
    });
}

async function loadImage(source) {
  if (/^https?:\/\//i.test(source)) {
    const res = await fetch(source);
    if (!res.ok) throw new Error(`HTTP ${res.status} khi tải ảnh ${source}`);
    return Buffer.from(await res.arrayBuffer());
  }
  return readFile(source);
}

async function main() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(file);

  const productSheet = workbook.getWorksheet("Sản phẩm");
  const variantSheet = workbook.getWorksheet("Biến thể");
  const imageSheet = workbook.getWorksheet("Ảnh");
  if (!productSheet) {
    console.error('Không tìm thấy sheet "Sản phẩm" trong file.');
    process.exit(1);
  }

  const products = sheetToObjects(productSheet);
  const variantRows = variantSheet ? sheetToObjects(variantSheet) : [];
  const imageRows = imageSheet ? sheetToObjects(imageSheet) : [];

  let created = 0;
  let skipped = 0;

  for (const p of products) {
    const slug = String(p.slug ?? "").trim();
    const name = String(p.name ?? "").trim();
    const price = Number(p.price);
    const images = imageRows
      .filter((r) => String(r.slug).trim() === slug)
      .sort((a, b) => Number(a.order) - Number(b.order));

    if (!slug || !name || !Number.isFinite(price) || price < 0) {
      console.warn(`Bỏ qua "${name || slug || "(không tên)"}": thiếu tên/slug hoặc giá không hợp lệ.`);
      skipped++;
      continue;
    }
    if (images.length === 0) {
      console.warn(`Bỏ qua "${name}": không có ảnh nào trong sheet Ảnh.`);
      skipped++;
      continue;
    }

    const category = String(p.category ?? "").trim();
    if (category && !VALID_CATEGORIES.has(category)) {
      console.warn(`"${name}": category "${category}" không hợp lệ, để trống. (Hợp lệ: ${[...VALID_CATEGORIES].join(", ")})`);
    }

    console.log(`Đang xử lý: ${name}`);
    const uploadedImages = [];
    for (const img of images) {
      try {
        const buffer = await loadImage(String(img.url).trim());
        const asset = await client.assets.upload("image", buffer, { filename: `${slug}-${img.order}` });
        uploadedImages.push({ _type: "image", _key: `img${img.order}`, asset: { _type: "reference", _ref: asset._id } });
      } catch (err) {
        console.warn(`  Lỗi tải ảnh #${img.order} (${img.url}): ${err.message}`);
      }
    }
    if (uploadedImages.length === 0) {
      console.warn(`  Bỏ qua "${name}": không tải được ảnh nào.`);
      skipped++;
      continue;
    }

    const variants = variantRows
      .filter((r) => String(r.slug).trim() === slug)
      .map((r, i) => ({ _type: "productVariant", _key: `v${i}`, label: String(r.label).trim(), price: Number(r.price) }))
      .filter((v) => v.label && Number.isFinite(v.price));

    await client.createOrReplace({
      _id: `product-${slug}`,
      _type: "product",
      name,
      slug: { _type: "slug", current: slug },
      price,
      category: category && VALID_CATEGORIES.has(category) ? category : undefined,
      badge: String(p.badge ?? "").trim() || undefined,
      shortDescription: String(p.shortDescription ?? "").trim() || undefined,
      bodyMarkdown: String(p.bodyMarkdown ?? "").trim() || undefined,
      images: uploadedImages,
      variants,
      isActive: false,
      featured: false,
      order: 0,
    });

    console.log(`  -> Đã lưu (${uploadedImages.length} ảnh, ${variants.length} biến thể), isActive: false`);
    created++;
  }

  console.log(`\nHoàn tất: ${created} sản phẩm đã tạo/cập nhật, ${skipped} dòng bị bỏ qua.`);
  if (created > 0) console.log('Vào Sanity Studio > Sản phẩm để rà soát rồi bật "Đang bán".');
}

main();
