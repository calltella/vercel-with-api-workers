
import { auth } from "@/lib/auth.config";
import { getToken } from "@/lib/apiFetch";
import { UserSettings } from "@/src/types/user";
import { DEFAULT_SETTINGS } from "@/src/constants/settings";
import { getJstDateTimeString } from "@/lib/utils/date";

const API_URL_BASE = process.env.API_URL_BASE!;

export async function getUserSettings(userId: string): Promise<UserSettings> {


  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const token = await getToken();

  const res = await fetch(`${API_URL_BASE}/user/setting/${session.user.id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data: UserSettings = await res.json();

  return data;


}
