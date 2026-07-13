import { defineField, defineType } from "sanity";

export default defineType({
  name: "product",
  title: "Sản phẩm",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Tên sản phẩm", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "price", title: "Giá (VNĐ)", type: "number", validation: (r) => r.required().min(0) }),
    defineField({
      name: "badge",
      title: "Nhãn (VD: BÁN CHẠY NHẤT, MỚI VỀ)",
      type: "string",
    }),
    defineField({
      name: "mainImage",
      title: "Ảnh sản phẩm",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string", validation: (r) => r.required() })],
      validation: (r) => r.required(),
    }),
    defineField({ name: "shortDescription", title: "Mô tả ngắn (hiện ở thẻ sản phẩm)", type: "text", rows: 3 }),
    defineField({
      name: "body",
      title: "Mô tả đầy đủ (hiện ở trang chi tiết sản phẩm)",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true }, fields: [{ name: "alt", title: "Alt text", type: "string" }] },
      ],
    }),
    defineField({
      name: "category",
      title: "Danh mục",
      type: "string",
      options: {
        list: [
          { title: "Đệm", value: "dem" },
          { title: "Chăn", value: "chan" },
          { title: "Ga", value: "ga" },
          { title: "Gối", value: "goi" },
          { title: "Phụ kiện", value: "phu-kien" },
        ],
      },
    }),
    defineField({ name: "featured", title: "Nổi bật trên trang chủ", type: "boolean", initialValue: false }),
    defineField({ name: "order", title: "Thứ tự hiển thị", type: "number", initialValue: 0 }),
    defineField({ name: "isActive", title: "Đang bán", type: "boolean", initialValue: true }),
  ],
  preview: {
    select: { title: "name", subtitle: "price", media: "mainImage" },
    prepare({ title, subtitle, media }) {
      return { title, subtitle: subtitle ? `${subtitle.toLocaleString("vi-VN")}đ` : "", media };
    },
  },
});
