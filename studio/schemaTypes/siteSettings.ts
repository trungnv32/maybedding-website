import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Thông tin chung",
  type: "document",
  fields: [
    defineField({ name: "siteName", title: "Tên website", type: "string", initialValue: "maybedding" }),
    defineField({ name: "tagline", title: "Khẩu hiệu / Tagline", type: "string" }),
    defineField({ name: "hotline", title: "Hotline", type: "string" }),
    defineField({ name: "zaloNumber", title: "Số Zalo CSKH", type: "string" }),
    defineField({ name: "email", title: "Email liên hệ", type: "string" }),
    defineField({
      name: "socialLinks",
      title: "Mạng xã hội",
      type: "object",
      fields: [
        defineField({ name: "facebook", title: "Facebook", type: "url" }),
        defineField({ name: "tiktok", title: "TikTok", type: "url" }),
        defineField({ name: "youtube", title: "YouTube", type: "url" }),
        defineField({ name: "zalo", title: "Zalo (link zalo.me/...)", type: "url" }),
      ],
    }),
    defineField({ name: "footerBlurb", title: "Đoạn giới thiệu ngắn ở footer", type: "text", rows: 3 }),
  ],
  preview: {
    prepare() {
      return { title: "Thông tin chung (Site Settings)" };
    },
  },
});
