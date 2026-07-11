import { sanityClient, urlFor } from "../sanity";

export interface SanityProduct {
  badge: string;
  name: string;
  price: string;
  description: string;
  image: string;
}

type RawProduct = { name: string; price: number; badge?: string; description?: string; mainImage: any };

// `defined(mainImage.asset)` excludes products where the editor hasn't uploaded an image yet —
// @sanity/image-url throws on a mainImage with no asset, which would otherwise fail the whole build.
const FEATURED_QUERY = `*[_type == "product" && featured == true && isActive == true && defined(mainImage.asset)] | order(order asc) [0...3] {
  name, price, badge, "description": shortDescription, mainImage
}`;

const ALL_QUERY = `*[_type == "product" && isActive == true && defined(mainImage.asset)] | order(order asc) {
  name, price, badge, "description": shortDescription, mainImage
}`;

function toSanityProduct(p: RawProduct): SanityProduct {
  return {
    badge: p.badge ?? "",
    name: p.name,
    price: `${p.price.toLocaleString("vi-VN")}đ`,
    description: p.description ?? "",
    image: urlFor(p.mainImage).width(600).height(750).url(),
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
