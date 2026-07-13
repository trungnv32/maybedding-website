import { getBlogPosts } from "../lib/groq/blog";
import { getPolicyPages } from "../lib/groq/policyPages";

// @astrojs/sitemap only discovers static-shaped routes; in SSR mode it can't see
// dynamic blog/policy slugs, so this hand-rolled endpoint fetches them per-request
// the same way rss.xml.js does.
const STATIC_PATHS = ["/", "/san-pham", "/dich-vu", "/blog", "/ve-chung-toi", "/lien-he"];

export async function GET(context) {
  const [posts, policyPages] = await Promise.all([getBlogPosts(), getPolicyPages()]);

  const paths = [
    ...STATIC_PATHS,
    ...posts.map((post) => `/blog/${post.slug}`),
    ...policyPages.map((page) => `/chinh-sach/${page.slug}`),
  ];

  const urls = paths
    .map((path) => `<url><loc>${new URL(path, context.site)}</loc></url>`)
    .join("");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { "Content-Type": "application/xml" },
  });
}
