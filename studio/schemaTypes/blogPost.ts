import { defineField, defineType } from "sanity";

export default defineType({
  name: "blogPost",
  title: "Bài viết Blog",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Tiêu đề", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "excerpt", title: "Mô tả ngắn (cũng dùng làm meta description mặc định)", type: "text", rows: 3 }),
    defineField({
      name: "coverImage",
      title: "Ảnh bìa (tỉ lệ 16:9)",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string", validation: (r) => r.required() })],
      validation: (r) => r.required(),
    }),
    defineField({ name: "category", title: "Chuyên mục", type: "string" }),
    defineField({ name: "publishedAt", title: "Ngày đăng", type: "datetime", validation: (r) => r.required() }),
    defineField({ name: "author", title: "Tác giả", type: "string", initialValue: "Đội ngũ maybedding" }),
    defineField({
      name: "body",
      title: "Nội dung",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true }, fields: [{ name: "alt", title: "Alt text", type: "string" }] },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({ name: "metaTitle", title: "Meta title", type: "string" }),
        defineField({ name: "metaDescription", title: "Meta description", type: "text", rows: 2 }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "coverImage" },
  },
});
