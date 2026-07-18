import { defineField, defineType } from "sanity";

export default defineType({
  name: "activityGallery",
  title: "Hoạt động",
  type: "document",
  fields: [
    defineField({
      name: "images",
      title: "Ảnh hoạt động",
      description: "Kéo thả để đổi thứ tự. Hiển thị ở trang Hoạt động và ở dải ảnh trên trang chủ.",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Hoạt động" };
    },
  },
});
