// components/AppLayout.tsx

import { auth } from "@/lib/auth.config";
import { redirect } from "next/navigation";
import { MainNavigation } from "@/components/nav/MainNavigation";
import { Sidebar } from "@/src/features/apline/components/AplineSidebar";
import { getUserSettings } from "@/src/service/settings.service";
import { getBadgeCounts } from "@/src/service/apline.service";
import { BadgeProvider } from '@/src/context/BadgeContext';

export async function SideBarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  // api経由でKVを取得
  const kv = await getUserSettings(session.user.id);

  // session.user.id から未読件数と未完了件数を採取
  const badgeCount = await getBadgeCounts();

  return (
    <BadgeProvider initialBadge={badgeCount}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar: 幅は中で制御 */}
        <Sidebar />

        {/* Mainエリアは残り全部 */}
        <div className="flex flex-1 flex-col min-w-0 min-h-0">
          <MainNavigation userSettings={kv} />
          <main className="flex-1 overflow-y-auto no-scrollbar">
            {children}
          </main>
        </div>
      </div>
    </BadgeProvider>
  );
}