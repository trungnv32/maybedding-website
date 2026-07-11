import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = (await getCollection("blog")).sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf()
  );

  return rss({
    title: "Blog maybedding",
    description: "Kiến thức và kinh nghiệm chăm sóc chăn ga gối đệm, giấc ngủ và sức khỏe cột sống từ đội ngũ maybedding.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.publishedAt,
      link: `/blog/${post.id}/`,
    })),
    customData: `<language>vi</language>`,
  });
}
