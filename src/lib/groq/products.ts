import { sanityClient, urlFor } from "../sanity";

export interface SanityProduct {
  slug: string;
  badge: string;
  name: string;
  price: string;
  description: string;
  image: string;
}

export interface SanityProductDetail extends SanityProduct {
  category: string;
  body: any[];
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
  mainImage: any;
};

type RawProductDetail = RawProduct & { category?: string; body?: any[] };

// `defined(mainImage.asset)` excludes products where the editor hasn't uploaded an image yet —
// @sanity/image-url throws on a mainImage with no asset, which would otherwise fail the whole build.
const FEATURED_QUERY = `*[_type == "product" && featured == true && isActive == true && defined(mainImage.asset)] | order(order asc) [0...3] {
  "slug": slug.current, name, price, badge, "description": shortDescription, mainImage
}`;

const ALL_QUERY = `*[_type == "product" && isActive == true && defined(mainImage.asset)] | order(order asc) {
  "slug": slug.current, name, price, badge, "description": shortDescription, mainImage
}`;

const DETAIL_QUERY = `*[_type == "product" && slug.current == $slug && defined(mainImage.asset)][0] {
  "slug": slug.current, name, price, badge, category, "description": shortDescription, body, mainImage
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
    image: urlFor(p.mainImage).width(600).url(),
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
  return {
    ...toSanityProduct(p),
    image: urlFor(p.mainImage).width(1000).url(),
    category: CATEGORY_LABELS[p.category ?? ""] ?? "",
    body: p.body ?? [],
  };
}
