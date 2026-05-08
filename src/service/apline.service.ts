
import { auth } from "@/lib/auth.config";
import { getToken } from "@/lib/apiFetch";

const API_URL_BASE = process.env.API_URL_BASE!;

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
  console.log(`draft response: ${JSON.stringify(res)}`);
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
