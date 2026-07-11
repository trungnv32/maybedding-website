import { defineField, defineType } from "sanity";

export default defineType({
  name: "homepage",
  title: "Trang chủ",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Tiêu đề lớn (Hero)",
      type: "string",
      description: 'Ví dụ: "Mang giấc ngủ trọn vẹn đến mọi nhà"',
    }),
    defineField({ name: "heroSubtext", title: "Mô tả ngắn dưới tiêu đề", type: "text", rows: 3 }),
    defineField({
      name: "heroImage",
      title: "Ảnh nền Hero",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Trang chủ (Hero)" };
    },
  },
});
