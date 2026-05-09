
import { MainNaviLayout } from "@/src/layout/MainNaviLayout";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainNaviLayout>
      {children}
    </MainNaviLayout>
  );
}