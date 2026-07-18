import { defineField, defineType } from "sanity";

export default defineType({
  name: "promotion",
  title: "Khuyến mãi",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Tiêu đề", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "body",
      title: "Nội dung",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "startDate",
      title: "Ngày bắt đầu",
      type: "datetime",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "endDate",
      title: "Ngày kết thúc",
      description: "Sau ngày này, chương trình tự động ẩn khỏi trang Khuyến mãi.",
      type: "datetime",
      validation: (r) => r.required().min(r.valueOfField("startDate")).error("Phải sau ngày bắt đầu"),
    }),
  ],
  preview: {
    select: { title: "title", startDate: "startDate", endDate: "endDate" },
    prepare({ title, startDate, endDate }) {
      const fmt = (d?: string) => (d ? new Date(d).toLocaleDateString("vi-VN") : "?");
      return { title, subtitle: `${fmt(startDate)} - ${fmt(endDate)}` };
    },
  },
});
