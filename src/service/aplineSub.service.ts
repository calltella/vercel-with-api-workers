
import { auth } from "@/lib/auth.config";
import { getToken } from "@/lib/apiFetch";

import type { DraftAplineListItems, AplineTenpoListItems } from "@/src/service/types/apline";

const API_URL_BASE = process.env.API_URL_BASE!;

export async function getAplineTenpoLists() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const token = await getToken();

  const res = await fetch(`${API_URL_BASE}/apline/stores`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data: AplineTenpoListItems[] = await res.json();
  return data;
}


export async function getDraftAplineList(): Promise<DraftAplineListItems[]> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const token = await getToken();

  const res = await fetch(`${API_URL_BASE}/apline/draft`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data: DraftAplineListItems[] = await res.json();
  console.log(`debugText: ${JSON.stringify(data)}`);
  //console.log("draft response:", data);

  return data;
}