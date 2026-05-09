
import { auth } from "@/lib/auth.config";
import { getToken } from "@/lib/apiFetch";

const API_URL_BASE = process.env.API_URL_BASE!;

export type GetAplineListViewsParams = {
  currentPage: number;
  shopId?: number;
  keyword?: string;
  pageSize: number;
  unread?: boolean;
  incomplete?: boolean;
};


// 未読件数、未完了件数を取得
export async function toggleAplineFavorite(id: number) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }
  const token = await getToken();
  const res = await fetch(`${API_URL_BASE}/apline/favorite/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  const data = await res.json();
  console.log(`draft response: ${JSON.stringify(data)}`);
  return true;
}


// 未読件数、未完了件数を取得
export async function getBadgeCounts() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }
  const token = await getToken();
  const res = await fetch(`${API_URL_BASE}/apline/nav`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  const data = await res.json();
  //console.log(`draft response: ${JSON.stringify(data)}`);
  return {
    unreadCount: data.unreadCount,
    incompleteCount: data.incompleteCount,
  }
}


















export async function fetchAplineList(params: GetAplineListViewsParams) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const token = await getToken();
  const res = await fetch(`${API_URL_BASE}/apline/lists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...params, userId: session.user.id }),
    cache: "no-store", // 常に最新データを取得
  });

  // if (!res.ok) {
  //   throw new Error(`Failed to fetch apline list: ${res.status}`);
  // }
  const data = await res.json();
  //console.log(`draft response: ${JSON.stringify(data)}`);
  //console.log(`lists count: ${data.aplineDatas.length}`);
  return data;
}

/**
 * 下書き削除
 * @param articleId 
 * @returns 
 */
export async function deleteAplineById(articleId: number): Promise<boolean> {

  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const token = await getToken();

  const res = await fetch(`${API_URL_BASE}/apline/draft/${articleId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();

    throw new Error(
      `Delete failed: ${res.status} ${text}`
    );
  }
  //console.log(`draft response: ${JSON.stringify(res)}`);
  return true;




  // const authUser = await getUserWithAccount(session.user.id);
  // if (!authUser.aplineUserId) {
  //   throw new Error("Invalid user");
  // }
  // const db = await getDB();

  // const deleted = await db
  //   .delete(aplineBase)
  //   .where(
  //     dz.and(
  //       dz.eq(aplineBase.id, articleId),
  //       dz.eq(aplineBase.acceptanceId, authUser.aplineUserId)
  //     )
  //   )
  //   .returning({ id: aplineBase.id });

  // // 未読レコードを削除
  // await db.delete(atbl.userUnreadArticles).where(dz.eq(atbl.userUnreadArticles.articleId, articleId));

  // return deleted.length > 0;
}
