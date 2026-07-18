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
        'Mỗi lần bấm "Add item" là 1 đợt tải ảnh mới: chọn/thả nhiều ảnh cùng lúc, rồi gõ 1 dòng ghi chú áp dụng riêng cho đợt ảnh đó. Đợt tải ảnh sau (bấm "Add item" lần nữa) sẽ có ghi chú riêng, không dùng lại ghi chú của đợt trước.',
      type: "array",
      of: [
        {
          type: "object",
          name: "activityItem",
          // collapsed: false — item mới thêm mở sẵn cả 2 field Ảnh + Ghi chú
          // trong cùng 1 khung nhìn, không cần bấm mở rộng thêm 1 bước.
          options: { collapsible: true, collapsed: false },
          fields: [
            defineField({
              name: "images",
              title: "Ảnh (chọn hoặc thả nhiều ảnh cùng lúc)",
              type: "array",
              of: [{ type: "image", options: { hotspot: true } }],
              options: { layout: "grid" },
              validation: (r) => r.min(1),
            }),
            defineField({
              name: "caption",
              title: "Ghi chú (áp dụng chung cho các ảnh ở trên)",
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
