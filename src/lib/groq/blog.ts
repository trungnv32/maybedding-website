import { sanityClient, urlFor } from "../sanity";

export interface SanityBlogPostSummary {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  coverImageAlt: string;
  category: string;
  publishedAt: string;
}

export interface SanityBlogPost extends SanityBlogPostSummary {
  author: string;
  body: any[];
  metaTitle?: string;
  metaDescription?: string;
}

// `defined(coverImage.asset)` excludes posts where the editor hasn't uploaded a cover image yet —
// @sanity/image-url throws on an image with no asset, which would otherwise fail the whole build.
const LIST_QUERY = `*[_type == "blogPost" && defined(coverImage.asset)] | order(publishedAt desc) {
  "slug": slug.current, title, excerpt, coverImage, category, publishedAt
}`;

const DETAIL_QUERY = `*[_type == "blogPost" && slug.current == $slug && defined(coverImage.asset)][0] {
  "slug": slug.current, title, excerpt, coverImage, category, publishedAt, author, body,
  "metaTitle": seo.metaTitle, "metaDescription": seo.metaDescription
}`;

type RawSummary = {
  slug: string;
  title: string;
  excerpt?: string;
  coverImage: any;
  category?: string;
  publishedAt: string;
};

type RawDetail = RawSummary & {
  author?: string;
  body: any[];
  metaTitle?: string;
  metaDescription?: string;
};

function toSummary(p: RawSummary): SanityBlogPostSummary {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? "",
    coverImage: urlFor(p.coverImage).width(800).height(450).url(),
    coverImageAlt: p.coverImage?.alt ?? p.title,
    category: p.category ?? "",
    publishedAt: p.publishedAt,
  };
}

export async function getBlogPosts(): Promise<SanityBlogPostSummary[]> {
  const results = await sanityClient.fetch<RawSummary[]>(LIST_QUERY);
  return results.map(toSummary);
}

export async function getBlogPostBySlug(slug: string): Promise<SanityBlogPost | null> {
  const p = await sanityClient.fetch<RawDetail | null>(DETAIL_QUERY, { slug });
  if (!p) return null;
  return {
    ...toSummary(p),
    author: p.author ?? "Đội ngũ maybedding",
    body: p.body ?? [],
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
  };
}
