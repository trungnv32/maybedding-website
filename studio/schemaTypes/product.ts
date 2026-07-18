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
      name: "images",
      title: "Ảnh sản phẩm",
      description: "Ảnh đầu tiên là ảnh đại diện (hiện ở danh sách sản phẩm). Kéo-thả hoặc thả nhiều ảnh cùng lúc để đổi thứ tự/thêm ảnh.",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
        },
      ],
      options: { layout: "grid" },
      validation: (r) => r.min(1).required(),
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
      name: "bodyMarkdown",
      title: "Mô tả đầy đủ (Markdown, dùng cho sản phẩm nhập tự động)",
      description:
        "Dùng cho sản phẩm do công cụ import tự động điền (định dạng Markdown thô). Nếu có nội dung ở đây, trang chi tiết sẽ hiển thị Markdown này THAY VÌ trường 'Mô tả đầy đủ' ở trên — để trống nếu viết tay bằng trình soạn thảo phía trên.",
      type: "text",
      rows: 10,
    }),
    defineField({
      name: "variants",
      title: "Biến thể (kích thước / độ dày...)",
      description:
        'Để trống nếu sản phẩm chỉ có 1 mức giá duy nhất (dùng field "Giá" ở trên). Mỗi dòng là 1 lựa chọn kèm giá riêng, VD "160x200cm dày 48cm" — không cần tách riêng độ dày và kích thước.',
      type: "array",
      of: [
        {
          type: "object",
          name: "productVariant",
          fields: [
            defineField({ name: "label", title: "Tên lựa chọn", type: "string", validation: (r) => r.required() }),
            defineField({ name: "price", title: "Giá (VNĐ)", type: "number", validation: (r) => r.required().min(0) }),
          ],
          preview: {
            select: { title: "label", price: "price" },
            prepare({ title, price }) {
              return { title, subtitle: typeof price === "number" ? `${price.toLocaleString("vi-VN")}đ` : "" };
            },
          },
        },
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
    select: { title: "name", subtitle: "price", media: "images.0" },
    prepare({ title, subtitle, media }) {
      return { title, subtitle: subtitle ? `${subtitle.toLocaleString("vi-VN")}đ` : "", media };
    },
  },
});
