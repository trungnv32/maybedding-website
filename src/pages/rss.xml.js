import rss from "@astrojs/rss";
import { getBlogPosts } from "../lib/groq/blog";

export async function GET(context) {
  const posts = await getBlogPosts();

  return rss({
    title: "Blog maybedding",
    description: "Kiến thức và kinh nghiệm chăm sóc chăn ga gối đệm, giấc ngủ và sức khỏe cột sống từ đội ngũ maybedding.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.title,
      description: post.excerpt,
      pubDate: new Date(post.publishedAt),
      link: `/blog/${post.slug}/`,
    })),
    customData: `<language>vi</language>`,
  });
}
