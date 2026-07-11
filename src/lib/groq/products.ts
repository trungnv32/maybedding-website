import { sanityClient, urlFor } from "../sanity";

export interface SanityProduct {
  badge: string;
  name: string;
  price: string;
  description: string;
  image: string;
}

const QUERY = `*[_type == "product" && featured == true && isActive == true] | order(order asc) [0...3] {
  name, price, badge, "description": shortDescription, mainImage
}`;

export async function getFeaturedProducts(): Promise<SanityProduct[]> {
  const results = await sanityClient.fetch<
    { name: string; price: number; badge?: string; description?: string; mainImage: any }[]
  >(QUERY);

  return results.map((p) => ({
    badge: p.badge ?? "",
    name: p.name,
    price: `${p.price.toLocaleString("vi-VN")}đ`,
    description: p.description ?? "",
    image: urlFor(p.mainImage).width(600).height(750).url(),
  }));
}
