// src/layout/MainNaviLayout.tsx

import { auth } from "@/lib/auth.config";
import { redirect } from "next/navigation";
import { MainNavigation } from "@/components/nav/MainNavigation";
import { getUserSettings } from "@/src/service/settings.service";

export async function MainNaviLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  // KV からユーザーデータを取得(なければデフォルト)
  const kv = await getUserSettings(session.user.id);
  console.log(`kv response: ${JSON.stringify(kv)}`);

  return (
    <>
      <div className="flex-1 flex flex-col">
        <MainNavigation userSettings={kv} />
        <main className="pt-17">{children}</main>
      </div>
    </>
  );
}