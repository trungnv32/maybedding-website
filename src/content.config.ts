import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Interim local content source (Markdown files in src/content/blog/).
// TODO(Phase 2): swap the loader for a Sanity GROQ query against the
// `blogPost` schema once Sanity is set up — field shape below already
// mirrors the planned Sanity schema so the swap only touches this file
// and blog page queries, not the page/layout components.
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: () =>
    z.object({
      title: z.string(),
      excerpt: z.string(),
      // Plain URL string (not Astro's image() asset pipeline) since these
      // are placeholder cover graphics for now — see public/blog/README.
      coverImage: z.string(),
      coverImageAlt: z.string(),
      category: z.string(),
      publishedAt: z.coerce.date(),
      author: z.string().default("Đội ngũ maybedding"),
      seo: z
        .object({
          metaTitle: z.string().optional(),
          metaDescription: z.string().optional(),
        })
        .optional(),
    }),
});

export const collections = { blog };
