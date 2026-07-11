import { defineField, defineType } from "sanity";

export default defineType({
  name: "aboutPage",
  title: "Về chúng tôi",
  type: "document",
  fields: [
    defineField({ name: "heading", title: "Tiêu đề", type: "string" }),
    defineField({
      name: "quote",
      title: "Câu trích dẫn ngắn",
      type: "text",
      rows: 2,
      description: "Hiển thị ở cả trang chủ (bản rút gọn) và trang Về chúng tôi",
    }),
    defineField({
      name: "shortIntro",
      title: "Đoạn giới thiệu ngắn",
      type: "text",
      rows: 4,
      description: "Dùng ở mục 'Về chúng tôi' trên trang chủ",
    }),
    defineField({
      name: "body",
      title: "Nội dung đầy đủ (trang Về chúng tôi)",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true }, fields: [{ name: "alt", title: "Alt text", type: "string" }] },
      ],
    }),
    defineField({
      name: "image1",
      title: "Ảnh 1",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({
      name: "image2",
      title: "Ảnh 2",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Về chúng tôi" };
    },
  },
});
