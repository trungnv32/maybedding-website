# AGENTS — đọc trước khi làm bất kỳ việc gì

1. Đọc **`HANDOFF.md`** ở thư mục gốc trước tiên — đây là tài liệu bàn giao đầy đủ: kiến trúc, quy ước code, trạng thái Sanity, tích hợp n8n, việc gợi ý làm tiếp.
2. Trả lời và giao tiếp bằng **tiếng Việt** — chủ dự án dùng tiếng Việt xuyên suốt.
3. `.env` chứa `N8N_API_KEY` cho phép sửa **trực tiếp** các workflow n8n đang chạy live tại `n8n.maybedding.vn` (phục vụ khách thật ngay lúc này). Chỉ được sửa workflow thuộc dự án này ("Website Chat Widget", "Website Admin Chat API" — xem chi tiết ở `HANDOFF.md` mục "Tích hợp chatbot"). **Không đụng vào các workflow khác** trên cùng instance (VD `CSKH Messenger`, `call_human_zalo`, `maybedding-invoice`, `maybedding-inventory`...) nếu chưa hỏi và được chủ dự án xác nhận trước.
4. `data/` và `maybedding_logo.png` ở thư mục gốc là **cố tình** không nằm trong git — thuộc về dự án, không xoá, không `git add`.
5. Sửa schema Sanity trong `studio/schemaTypes/` xong phải chạy `npm run deploy` trong `studio/` để đẩy lên Studio đã host — sửa code Astro thì `git push` như bình thường.

Sau khi hoàn thành một việc đáng kể, cập nhật lại `HANDOFF.md` (mục changelog + mục liên quan) để agent/người tiếp theo nắm được.
