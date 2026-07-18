# HANDOFF — maybedding-website

Tài liệu bàn giao trạng thái dự án tại thời điểm 2026-07-18. Đọc file này trước khi tiếp tục bất kỳ việc gì.

## Bối cảnh & giao tiếp

- Chủ dự án giao tiếp bằng **tiếng Việt** trong toàn bộ session — hãy tiếp tục trả lời bằng tiếng Việt.
- Đây là website bán hàng (chăn ga gối đệm may đo) của thương hiệu maybedding, có 2 cửa hàng offline tại Hà Nội. Không có giỏ hàng/thanh toán online — mô hình là "xem sản phẩm → chat hỏi tư vấn → mua tại cửa hàng". Bối cảnh kinh doanh đầy đủ (lịch sử, chính sách, thông tin liên hệ...) nằm ở `website_maybedding.md` — nên đọc file này nếu cần viết nội dung/trả lời câu hỏi liên quan thương hiệu.
- Hệ thống thiết kế (màu sắc, typography, spacing) nằm ở `DESIGN.md`.

## Stack & kiến trúc

- **Astro 5** (output `"server"`, adapter `@astrojs/node`), **Tailwind CSS v4** (token tuỳ biến trong `src/styles/global.css`, không có file config riêng).
- Nội dung lấy từ **Sanity CMS** headless — thư mục `studio/` là Sanity Studio **độc lập**, có `package.json`/`node_modules` riêng.
- **QUAN TRỌNG**: sửa schema trong `studio/schemaTypes/` KHÔNG tự động lên Sanity Studio đã host. Phải chạy `npm run deploy` trong `studio/` (chạy `sanity deploy`, đã đăng nhập sẵn CLI trên máy này) để đẩy schema mới lên `https://maybedding-website.sanity.studio/`. Sửa code Astro thì `git push` — có `import.meta.env.CONTEXT` trong `BaseLayout.astro` gợi ý site build qua Netlify (dò `noindex` cho preview/branch deploy), nhưng **repo này không có `netlify.toml`** — chưa xác nhận được webhook/dashboard tự deploy khi push, nên kiểm tra lại trước khi giả định push = tự lên production.
- Lấy Sanity auth token để chạy script ghi dữ liệu: `cd studio && npx sanity debug --secrets` (dòng "Auth token:"), rồi `SANITY_AUTH_TOKEN=<token> node <script>`.
- Biến môi trường cần có trong `.env` (không commit): `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `N8N_URL`, `N8N_API_KEY`, `PUBLIC_N8N_CHAT_WEBHOOK_URL`, `ADMIN_CHAT_PASSWORD`, `ADMIN_CHAT_API_SECRET`.

## Quy ước code đã dùng xuyên suốt (giữ nhất quán khi sửa tiếp)

- Mọi nội dung Sanity đều có **fallback cứng** trong code (VD `Header.astro`, `Footer.astro`, `Hero.astro`) để trang không vỡ khi Studio chưa có dữ liệu.
- Singleton document (1 bản ghi duy nhất, VD `siteSettings`, `homepage`, `aboutPage`, `activityGallery`) khai báo trong `studio/structure.ts` bằng `S.document().schemaType(...).documentId(...)` với `documentId` cố định.
- Field ảnh luôn guard bằng `defined(asset)`/`defined(images[0].asset)` trong GROQ trước khi gọi `urlFor()` — ảnh chưa upload sẽ làm `@sanity/image-url` throw và fail cả build nếu không guard.
- Bài viết/sản phẩm nhập tự động dùng field `bodyMarkdown` (text thô) song song với `body` (Portable Text viết tay trong Studio) — ưu tiên hiển thị `bodyMarkdown` nếu có nội dung, render bằng `marked.parse()`. Xem `blogPost.ts`/`product.ts` + `blog/[slug].astro`/`san-pham/[slug].astro`.
- Migrate dữ liệu Sanity cũ khi đổi schema: viết script tạm `.mjs` trong `studio/scripts/`, chạy 1 lần bằng `SANITY_AUTH_TOKEN=...`, rồi **xoá script** ngay sau khi xác nhận xong (không để lại trong git). Đã làm việc này 3 lần trong session (activityGallery x2, product mainImage→images).
- Component `src/components/gallery/ActivityLightbox.astro` là lightbox dùng chung (zoom/vuốt/đóng bằng phím) — nhận prop `images: {url, alt, caption?}[]`, tự tìm mọi phần tử `[data-gallery-thumb][data-index]` trên trang để gắn sự kiện click. Đang dùng ở trang Hoạt động, dải ảnh trang chủ, và trang chi tiết sản phẩm — tái dùng tiếp nếu cần lightbox ở chỗ khác thay vì viết mới.

## Việc đã làm trong session này (commit gần nhất trước, theo thứ tự thời gian)

1. **`f183e54` → `7104980`**: Thêm trang/menu **Khuyến mãi** (`/khuyen-mai`, tự ẩn ngoài khoảng ngày, không lưu lịch sử) và **Hoạt động** (`/hoat-dong`, gallery ảnh + lightbox). Trải qua nhiều vòng chỉnh theo phản hồi người dùng — schema Sanity `activityGallery` hiện tại: `items: [{images: image[], caption: string}]` (mỗi lần "Add item" = 1 đợt ảnh dùng chung 1 ghi chú, item mới mở sẵn `collapsed:false`). Trang chủ: mobile = 1 hàng ảnh vuốt + link "Xem toàn bộ hoạt động" dưới-trái; desktop = lưới cố định 3 ảnh + link ở hàng tiêu đề.
   - **Lưu ý đã biết**: nút "Upload" (bấm chọn file) trong Sanity Studio chỉ nhận 1 ảnh/lần — giới hạn nền tảng Sanity (sanity-io/sanity#1547, #4483), không phải lỗi. Phải **kéo-thả nhiều file cùng lúc** từ File Explorer mới tải nhiều ảnh 1 lần. Đã ghi rõ trong description của field trong Studio.
2. **`a964e2d`**: Đổi schema `product`: `mainImage` (1 ảnh) → `images[]` (nhiều ảnh, đã migrate 5 sản phẩm cũ không mất ảnh), thêm `variants: {label, price}[]` (danh sách phẳng, KHÔNG có 2 tầng phân loại riêng — theo đúng cách trang nguồn tuananh.vn làm), thêm `bodyMarkdown`. Trang chi tiết sản phẩm có dải thumbnail đổi ảnh chính + mở lightbox, chọn biến thể đổi giá hiển thị.
   - **Công cụ import sản phẩm từ link ngoài**: `studio/scripts/product-import/` — `fetch-products.mjs <url...>` scrape trang sản phẩm tuananh.vn → xuất `output/products-import.xlsx` (3 sheet: Sản phẩm/Biến thể/Ảnh, nối qua cột `slug`, **gitignore, không commit**); `import-products.mjs <file.xlsx>` đọc Excel đã sửa tay → tạo/cập nhật sản phẩm trên Sanity bằng `createOrReplace` với `_id: product-${slug}` (chạy lại **không tạo trùng**), mặc định `isActive:false` để chủ web duyệt trước khi bật bán.
   - Đã dùng công cụ này fetch + import **17 sản phẩm thật** từ tuananh.vn (đệm, bộ ga phủ) theo yêu cầu chủ web.
3. **`6a28816`**: Cố định chiều cao tiêu đề (2 dòng)/mô tả (4 dòng) trên `ProductCard.astro` bằng `line-clamp` + `min-height` để lưới sản phẩm thẳng hàng.
4. **`5b66a19` → `4786956`**: Đổi favicon từ icon "m" đặt tạm sang crop icon hoa thật từ `maybedding_logo.png` (`public/favicon.png` 32×32, `public/apple-touch-icon.png` 180×180). Đã sửa lại crop 1 lần vì bản đầu bị lem chữ "y" bên cạnh.

## ⚠️ Cần chủ web/agent tiếp theo xử lý — trạng thái Sanity hiện tại

Kiểm tra trực tiếp lúc viết file này:
- **16 sản phẩm đã publish** (15 `isActive:true` đang hiển thị công khai, 1 `isActive:false` — `product-dem-legends-limited`).
- **3 sản phẩm đang có draft chưa publish** trong Sanity Studio (`drafts.product-dem-bong-ep-bebop-cotton`, `drafts.product-dem-bong-mix-modern`, `drafts.product-dem-legends-limited`) — tức chủ web đã vào Studio sửa tay (rút gọn tên, bật "Đang bán"...) nhưng **chưa bấm nút Publish**, nên thay đổi CHƯA lên web thật. Đặc biệt `dem-legends-limited`: bản publish đang `isActive:false`, bản draft đang `isActive:true` — nếu muốn sản phẩm này hiển thị, cần vào Studio bấm Publish.
- Đây là hành vi bình thường của Sanity (draft/publish workflow), không phải lỗi — nhưng nên nhắc chủ web publish nốt nếu họ đã sửa xong.
- 1 sản phẩm cũ (`Đệm bông ép 2 mảnh vỏ chần`) chưa từng có ảnh từ trước khi session này bắt đầu (không phải do migration) — hiện bị ẩn khỏi listing do guard `defined(images[0].asset)`, cần chủ web tự upload ảnh nếu muốn sản phẩm này lên web.

## File chưa track ở root (đã hỏi & xác nhận, không động vào)

- `data/` — 5 ảnh mẫu chủ web chuẩn bị, **không liên quan** tới tính năng nào đã làm (đã hỏi, chủ web bảo bỏ qua).
- `maybedding_logo.png` — logo gốc độ phân giải cao (1254×1254), dùng để crop ra favicon. Giữ lại phòng khi cần crop lại/xuất icon khác.
- Cả 2 file này **cố tình không thêm vào git** — nếu cần dùng thêm thì thêm, đừng tự ý xoá.

## Việc gợi ý làm tiếp (chưa ai yêu cầu, chỉ là quan sát)

- Nhắc chủ web publish 3 draft đang treo ở Sanity Studio (mục trên).
- Rà lại 15+ sản phẩm mới import xem mô tả/ảnh/biến thể có ổn không (mô tả tự động chuyển từ HTML→Markdown có thể còn sạn định dạng, VD nhiều thẻ `<h1>` lồng nhau từ trang nguồn).
- Còn nhiều sản phẩm khác trên tuananh.vn (chăn, gối, phụ kiện...) chưa được hỏi copy — nếu chủ web gửi thêm link thì dùng lại đúng quy trình `fetch-products.mjs` → gửi Excel cho họ sửa → `import-products.mjs`.
