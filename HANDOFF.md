# HANDOFF — maybedding-website

Tài liệu bàn giao trạng thái dự án tại thời điểm 2026-08-18. Đọc file này trước khi tiếp tục bất kỳ việc gì.

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

### Tích hợp chatbot — toàn bộ logic AI nằm ở n8n, web chỉ gọi webhook

- Chat widget khách hàng (`src/components/chat/ChatWidget.astro`, ở trang chủ): `POST` tới `PUBLIC_N8N_CHAT_WEBHOOK_URL` với `{sessionId, action:"sendMessage", chatInput}`, nhận lại `{output|text|reply}`. `sessionId` dạng `web:<uuid>` lưu trong `sessionStorage`. Nếu env trống thì dùng câu trả lời mẫu (`mockReply`) để vẫn test được UI.
- Trang quản trị `/admin/chat` (`src/lib/adminChatApi.ts`, `src/pages/admin/chat/`): gọi các webhook `https://n8n.maybedding.vn/webhook/admin-chat-{sessions,messages,send,poll}`, xác thực bằng header `x-admin-secret` = `ADMIN_CHAT_API_SECRET`. Cho phép nhân viên xem hội thoại AI + gửi tin nhắn thủ công (chế độ "reply" tạm dừng bot ~10 phút, hoặc "nudge" chỉ gợi ý cho bot tự trả lời câu tiếp theo). Widget khách poll `admin-chat-poll` mỗi 3 giây để nhận tin admin gửi ngoài luồng request của khách.
- **Toàn bộ workflow này sống trên server n8n (`n8n.maybedding.vn`), KHÔNG có trong repo git.** Workflow chính: "Website Chat Widget" (bot AI, id `o3VSJlAZdL9D100G`) và "Website Admin Chat API" (5 webhook admin ở trên, id `DACXfmSizB44CF5d`).
- **`N8N_API_KEY` trong `.env` cho phép gọi thẳng REST API của n8n** (`GET/PUT {N8N_URL}/api/v1/workflows/<id>`, header `X-N8N-API-KEY`) để đọc và **sửa trực tiếp** các workflow này — đã dùng cách này trong session 2026-08-18 để thêm timestamp cho chat (sửa 2 node Postgres `List Sessions`/`Get AI History` trong workflow "Website Admin Chat API"). Chỉ sửa workflow thuộc dự án này qua đường này; **không đụng vào các workflow khác** đang chạy trên cùng instance n8n (VD `CSKH Messenger`, `call_human_zalo`, `maybedding-invoice`, `maybedding-inventory`...) nếu chưa hỏi chủ web trước.
- Bảng Postgres đứng sau: `n8n_chat_histories` (lịch sử hội thoại AI, do node "Postgres Chat Memory" mặc định của n8n tạo — đã có sẵn cột `created_at` với dữ liệu lịch sử chính xác), `website_chat_control` (trạng thái tạm dừng bot theo session), `website_chat_extra_messages` (tin nhắn admin gửi tay, có `created_at`).

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
5. **`4b41dab` → `9e32098`** (2026-08-18): Sắp xếp lại menu "Liên hệ" ở footer theo yêu cầu chủ web — chuyển từ cột "Khám phá" sang cuối cùng trong cột "Liên kết nhanh" (`src/components/layout/Footer.astro`, chỉ sửa fallback vì Sanity `navigation` doc chưa có dữ liệu cho 2 menu này).
6. **`79f6710`** (2026-08-18): Thêm timestamp cho trang quản trị chat `/admin/chat` — danh sách phiên hiện giờ tin nhắn cuối, mỗi tin nhắn trong hội thoại hiện giờ gửi (định dạng giờ VN qua `formatChatTime()` mới trong `adminChatApi.ts`). Đi kèm sửa 2 node Postgres trong workflow n8n "Website Admin Chat API" (xem mục Tích hợp chatbot ở trên) để trả thêm cột `created_at` — đã kiểm tra kỹ và xác nhận cột này vốn có sẵn dữ liệu lịch sử chính xác (không phải giá trị giả lập), nên timestamp đúng 100% kể cả tin nhắn cũ.

## Trạng thái Sanity hiện tại (đã xác nhận sạch)

- Toàn bộ 3 sản phẩm từng ở trạng thái draft (`dem-bong-ep-bebop-cotton`, `dem-bong-mix-modern`, `dem-legends-limited`) **đã được chủ web publish** — đã kiểm tra lại: không còn document nào ở dạng `drafts.*`, `product-dem-legends-limited` hiện `isActive: true`.
- 1 sản phẩm cũ (`Đệm bông ép 2 mảnh vỏ chần`) chưa từng có ảnh từ trước khi session này bắt đầu (không phải do migration) — hiện bị ẩn khỏi listing do guard `defined(images[0].asset)`, cần chủ web tự upload ảnh nếu muốn sản phẩm này lên web.

## File chưa track ở root — đã xác nhận, thuộc về dự án, KHÔNG xoá

- `data/` và `maybedding_logo.png` — chủ web xác nhận đây là 1 phần của dự án, cứ để nguyên. `maybedding_logo.png` là logo gốc độ phân giải cao (1254×1254) dùng để crop favicon/icon khi cần.
- 2 file này **cố tình không thêm vào git** (không phải bị bỏ sót) — đừng `git add` hay xoá trừ khi chủ web yêu cầu khác.

## Việc gợi ý làm tiếp (chưa ai yêu cầu, chỉ là quan sát)

- Rà lại 15+ sản phẩm mới import xem mô tả/ảnh/biến thể có ổn không (mô tả tự động chuyển từ HTML→Markdown có thể còn sạn định dạng, VD nhiều thẻ `<h1>` lồng nhau từ trang nguồn).
- Còn nhiều sản phẩm khác trên tuananh.vn (chăn, gối, phụ kiện...) chưa được hỏi copy — nếu chủ web gửi thêm link thì dùng lại đúng quy trình `fetch-products.mjs` → gửi Excel cho họ sửa → `import-products.mjs`.
- Danh sách phiên chat ở `/admin/chat` giới hạn cứng **50 phiên gần nhất** (`LIMIT 50` trong node "List Sessions" của workflow n8n) — nếu lượng khách chat tăng, phiên cũ hơn sẽ rơi khỏi danh sách dù chưa được trả lời. Chưa có phân trang/lọc theo ngày/lọc "chưa xem" — cân nhắc bổ sung nếu chủ web cần.
