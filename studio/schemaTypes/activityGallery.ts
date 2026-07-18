import { defineField, defineType } from "sanity";

export default defineType({
  name: "activityGallery",
  title: "Hoạt động",
  type: "document",
  fields: [
    defineField({
      name: "images",
      title: "Ảnh hoạt động",
      description: "Kéo-thả hoặc bấm chọn nhiều ảnh cùng lúc để tải lên.",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      options: { layout: "grid" },
    }),
    defineField({
      name: "caption",
      title: "Ghi chú (1 dòng, áp dụng chung cho tất cả ảnh ở trên)",
      type: "string",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Hoạt động" };
    },
  },
});
