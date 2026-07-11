import { defineField, defineType } from "sanity";

export default defineType({
  name: "storeLocation",
  title: "Cửa hàng",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Tên cửa hàng", type: "string", validation: (r) => r.required() }),
    defineField({ name: "isMain", title: "Là cửa hàng chính", type: "boolean", initialValue: false }),
    defineField({ name: "address", title: "Địa chỉ", type: "string", validation: (r) => r.required() }),
    defineField({ name: "phone", title: "Số điện thoại", type: "string" }),
    defineField({ name: "openingHours", title: "Giờ mở cửa", type: "string", initialValue: "8:00 - 22:00 hàng ngày" }),
    defineField({ name: "googleMapsUrl", title: "Link Google Maps", type: "url" }),
    defineField({
      name: "mapsSearchKeyword",
      title: "Từ khoá tìm trên Google Maps",
      type: "string",
      description: 'Ví dụ: "maybedding cầu diễn"',
    }),
    defineField({
      name: "photo",
      title: "Ảnh cửa hàng",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "address" },
  },
});
