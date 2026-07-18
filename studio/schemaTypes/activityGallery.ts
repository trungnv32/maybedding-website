import { defineField, defineType } from "sanity";

export default defineType({
  name: "activityGallery",
  title: "Hoạt động",
  type: "document",
  fields: [
    defineField({
      name: "items",
      title: "Ảnh hoạt động",
      description:
        'Bấm "Add item" để tạo 1 mục, sau đó kéo-thả hoặc chọn nhiều ảnh cùng lúc vào ô "Ảnh" bên trong mục đó — các ảnh tải lên cùng lúc sẽ dùng chung 1 dòng ghi chú.',
      type: "array",
      of: [
        {
          type: "object",
          name: "activityItem",
          fields: [
            defineField({
              name: "images",
              title: "Ảnh (có thể chọn nhiều ảnh cùng lúc)",
              type: "array",
              of: [{ type: "image", options: { hotspot: true } }],
              options: { layout: "grid" },
              validation: (r) => r.min(1),
            }),
            defineField({
              name: "caption",
              title: "Ghi chú (1 dòng, áp dụng chung cho các ảnh ở trên)",
              type: "string",
            }),
          ],
          preview: {
            select: { caption: "caption", images: "images" },
            prepare({ caption, images }) {
              const count = Array.isArray(images) ? images.length : 0;
              return {
                title: caption || "(Chưa có ghi chú)",
                subtitle: `${count} ảnh`,
              };
            },
          },
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
