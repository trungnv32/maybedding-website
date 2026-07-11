import { defineField, defineType } from "sanity";

export default defineType({
  name: "policyPage",
  title: "Trang chính sách",
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
    defineField({
      name: "body",
      title: "Nội dung",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({ name: "updatedAt", title: "Cập nhật lần cuối", type: "datetime" }),
  ],
  preview: {
    select: { title: "title" },
  },
});
