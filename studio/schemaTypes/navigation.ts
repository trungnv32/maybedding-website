import { defineField, defineType } from "sanity";

const menuItemFields = [
  defineField({ name: "label", title: "Tên hiển thị", type: "string", validation: (r) => r.required() }),
  defineField({
    name: "href",
    title: "Đường dẫn",
    type: "string",
    description: 'VD: "/san-pham" hoặc "/blog" (đường dẫn nội bộ, bắt đầu bằng dấu /)',
    validation: (r) => r.required(),
  }),
];

export default defineType({
  name: "navigation",
  title: "Menu điều hướng",
  type: "document",
  fields: [
    defineField({
      name: "headerMenu",
      title: "Menu chính (thanh trên cùng + menu di động)",
      type: "array",
      description: "Kéo thả để đổi thứ tự. Bấm + để thêm menu mới, bấm biểu tượng thùng rác để xoá.",
      of: [
        {
          type: "object",
          name: "menuItem",
          fields: [
            ...menuItemFields,
            defineField({
              name: "icon",
              title: "Icon (chỉ hiện ở menu di động)",
              type: "string",
              description: 'Tên icon Material Symbols, VD: "home", "bed", "info" — xem tại fonts.google.com/icons',
            }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        },
      ],
    }),
    defineField({
      name: "footerExploreMenu",
      title: 'Footer - Cột "Khám phá"',
      type: "array",
      of: [{ type: "object", name: "menuItem", fields: menuItemFields, preview: { select: { title: "label", subtitle: "href" } } }],
    }),
    defineField({
      name: "footerQuickMenu",
      title: 'Footer - Cột "Liên kết nhanh"',
      description: "Các trang chính sách đã publish sẽ tự động thêm vào phía dưới danh sách này, không cần thêm tay.",
      type: "array",
      of: [{ type: "object", name: "menuItem", fields: menuItemFields, preview: { select: { title: "label", subtitle: "href" } } }],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Menu điều hướng" };
    },
  },
});
