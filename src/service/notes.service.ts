// /app/src/service/notes.service.ts

// service層に "use server" を書かない
// API → service
// front → action → service
import { getToken } from "@/lib/apiFetch";

const API_URL_BASE = process.env.API_URL_BASE!;

// workerAPI から取得
export async function getNotesAPI() {
  const token = await getToken();
  console.log(`token: ${JSON.stringify(token)}`);
  const res = await fetch(`${API_URL_BASE}/notes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error(`ノート取得失敗: ${res.status}`);

  return res.json();
}

// notes データ登録
export async function createNote(data: {
  title: string
  content?: string
}) {
  const token = await getToken();

  const res = await fetch(`${API_URL_BASE}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`ノート作成失敗: ${res.status}`);
  }

  const result = await res.json();

  return result;
}

