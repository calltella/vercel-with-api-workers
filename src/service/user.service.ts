

import { getToken } from "@/lib/apiFetch";
const API_URL_BASE = process.env.API_URL_BASE!;
/**
 * User取得( メールアドレスからユーザーを取得 )
 */
type FindUserByEmailResponse = {
  email: string;
  hasAccount: boolean;
};

export async function findUserByEmail(email: string): Promise<FindUserByEmailResponse> {
  const token = await getToken();

  const res = await fetch(`${API_URL_BASE}/user/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch user: ${res.status}`);
  }

  return res.json() as Promise<FindUserByEmailResponse>;
}