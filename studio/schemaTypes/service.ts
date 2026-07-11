import { defineField, defineType } from "sanity";

export default defineType({
  name: "service",
  title: "Dịch vụ",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Tên dịch vụ", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "icon",
      title: "Icon (tên Material Symbols)",
      type: "string",
      description: "Xem tên icon tại fonts.google.com/icons, ví dụ: local_shipping, sanitizer, design_services",
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", title: "Mô tả", type: "text", rows: 3 }),
    defineField({ name: "order", title: "Thứ tự hiển thị", type: "number", initialValue: 0 }),
  ],
  preview: {
    select: { title: "title", subtitle: "icon" },
  },
});
