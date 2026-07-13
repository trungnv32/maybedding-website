import { createHash } from "node:crypto";

function expectedToken(): string {
  return createHash("sha256").update(import.meta.env.ADMIN_CHAT_PASSWORD).digest("hex");
}

export function checkPassword(password: string): boolean {
  return password === import.meta.env.ADMIN_CHAT_PASSWORD;
}

export function sessionToken(): string {
  return expectedToken();
}

export function isAuthed(cookieValue: string | undefined): boolean {
  return !!cookieValue && cookieValue === expectedToken();
}
