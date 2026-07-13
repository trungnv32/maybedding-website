const N8N_ADMIN_BASE = "https://n8n.maybedding.vn/webhook";

function authHeaders() {
  return { "x-admin-secret": import.meta.env.ADMIN_CHAT_API_SECRET };
}

export interface AdminSession {
  session_id: string;
  message_count: string;
  last_id: number;
}

async function assertOk(res: Response, label: string) {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${label}: n8n trả về HTTP ${res.status}. ${body.slice(0, 200)}`);
  }
}

export async function listSessions(): Promise<AdminSession[]> {
  const res = await fetch(`${N8N_ADMIN_BASE}/admin-chat-sessions`, { headers: authHeaders() });
  await assertOk(res, "Không tải được danh sách phiên chat");
  return res.json();
}

export interface AiHistoryItem {
  id: number;
  role: string;
  content: string;
}

export interface ExtraMessageItem {
  id: number;
  sender: string;
  content: string;
  created_at: string;
}

export async function getMessages(sessionId: string): Promise<{ aiHistory: AiHistoryItem[]; extraMessages: ExtraMessageItem[] }> {
  const res = await fetch(`${N8N_ADMIN_BASE}/admin-chat-messages?session=${encodeURIComponent(sessionId)}`, {
    headers: authHeaders(),
  });
  await assertOk(res, "Không tải được nội dung hội thoại");
  return res.json();
}

export async function sendAdminMessage(sessionId: string, mode: "reply" | "nudge", message: string): Promise<void> {
  const res = await fetch(`${N8N_ADMIN_BASE}/admin-chat-send`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, mode, message }),
  });
  await assertOk(res, "Không gửi được tin nhắn");
}
