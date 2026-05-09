

import { SideBarLayout } from "@/src/layout/SideBarLayout";
import { AplineSidebarProvider } from '@/src/context/AplineSidebarContext';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AplineSidebarProvider>
      <SideBarLayout>
        {children}
      </SideBarLayout>
    </AplineSidebarProvider>
  );
}