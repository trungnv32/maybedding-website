import { sanityClient, urlFor } from "../sanity";

export interface SanityProduct {
  slug: string;
  badge: string;
  name: string;
  price: string;
  description: string;
  image: string;
}

export interface SanityProductVariant {
  label: string;
  price: string;
}

export interface SanityProductDetail extends SanityProduct {
  category: string;
  body: any[];
  bodyMarkdown?: string;
  images: string[];
  variants: SanityProductVariant[];
}

const CATEGORY_LABELS: Record<string, string> = {
  dem: "Đệm",
  chan: "Chăn",
  ga: "Ga",
  goi: "Gối",
  "phu-kien": "Phụ kiện",
};

type RawProduct = {
  slug: string;
  name: string;
  price: number;
  badge?: string;
  description?: string;
  images: any[];
};

type RawVariant = { label: string; price: number };

type RawProductDetail = RawProduct & {
  category?: string;
  body?: any[];
  bodyMarkdown?: string;
  variants?: RawVariant[];
};

// `defined(images[0].asset)` excludes products where the editor hasn't uploaded a photo yet —
// @sanity/image-url throws on an image with no asset, which would otherwise fail the whole build.
const FEATURED_QUERY = `*[_type == "product" && featured == true && isActive == true && defined(images[0].asset)] | order(order asc) [0...3] {
  "slug": slug.current, name, price, badge, "description": shortDescription, images
}`;

const ALL_QUERY = `*[_type == "product" && isActive == true && defined(images[0].asset)] | order(order asc) {
  "slug": slug.current, name, price, badge, "description": shortDescription, images
}`;

const DETAIL_QUERY = `*[_type == "product" && slug.current == $slug && defined(images[0].asset)][0] {
  "slug": slug.current, name, price, badge, category, "description": shortDescription, body, bodyMarkdown, variants,
  "images": images[]{ ..., "hasAsset": defined(asset) }
}`;

function toSanityProduct(p: RawProduct): SanityProduct {
  return {
    slug: p.slug,
    badge: p.badge ?? "",
    name: p.name,
    price: `${p.price.toLocaleString("vi-VN")}đ`,
    description: p.description ?? "",
    // No forced height here: the card/detail markup renders with object-contain (fit, not
    // crop), so requesting a fixed height would just make Sanity crop the source photo down
    // to that box server-side before the browser ever gets to letterbox it losslessly.
    image: urlFor(p.images[0]).width(600).url(),
  };
}

export async function getFeaturedProducts(): Promise<SanityProduct[]> {
  const results = await sanityClient.fetch<RawProduct[]>(FEATURED_QUERY);
  return results.map(toSanityProduct);
}

export async function getAllProducts(): Promise<SanityProduct[]> {
  const results = await sanityClient.fetch<RawProduct[]>(ALL_QUERY);
  return results.map(toSanityProduct);
}

export async function getProductBySlug(slug: string): Promise<SanityProductDetail | null> {
  const p = await sanityClient.fetch<RawProductDetail | null>(DETAIL_QUERY, { slug });
  if (!p) return null;
  const galleryImages = p.images.filter((img) => img?.hasAsset);
  return {
    ...toSanityProduct(p),
    image: urlFor(galleryImages[0]).width(1000).url(),
    images: galleryImages.map((img) => urlFor(img).width(1000).url()),
    category: CATEGORY_LABELS[p.category ?? ""] ?? "",
    body: p.body ?? [],
    bodyMarkdown: p.bodyMarkdown,
    variants: (p.variants ?? []).map((v) => ({ label: v.label, price: `${v.price.toLocaleString("vi-VN")}đ` })),
  };
}
