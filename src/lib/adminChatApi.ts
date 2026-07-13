const N8N_ADMIN_BASE = "https://n8n.maybedding.vn/webhook";

function authHeaders() {
  return { "x-admin-secret": import.meta.env.ADMIN_CHAT_API_SECRET };
}

export interface AdminSession {
  session_id: string;
  message_count: string;
  last_id: number;
}

export async function listSessions(): Promise<AdminSession[]> {
  const res = await fetch(`${N8N_ADMIN_BASE}/admin-chat-sessions`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to list sessions");
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
  if (!res.ok) throw new Error("Failed to get messages");
  return res.json();
}

export async function sendAdminMessage(sessionId: string, mode: "reply" | "nudge", message: string): Promise<void> {
  const res = await fetch(`${N8N_ADMIN_BASE}/admin-chat-send`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, mode, message }),
  });
  if (!res.ok) throw new Error("Failed to send message");
}
