import type { StructureResolver } from "sanity/structure";

// siteSettings is a singleton: force it to a single editable document instead
// of a list, so editors can't accidentally create a second one.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Nội dung")
    .items([
      S.listItem()
        .title("Thông tin chung (Site Settings)")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem()
        .title("Trang chủ (Hero)")
        .child(S.document().schemaType("homepage").documentId("homepage")),
      S.listItem()
        .title("Về chúng tôi")
        .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
      S.divider(),
      S.documentTypeListItem("product").title("Sản phẩm"),
      S.documentTypeListItem("service").title("Dịch vụ"),
      S.documentTypeListItem("blogPost").title("Bài viết Blog"),
      S.documentTypeListItem("storeLocation").title("Cửa hàng"),
      S.documentTypeListItem("policyPage").title("Trang chính sách"),
    ]);
