// app/(protected)/layout.tsx
import "../globals.css";
import { Suspense } from "react";
import AuthGate from "./AuthGate";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<ProtectedSkeleton />}>
      <AuthGate>{children}</AuthGate>
    </Suspense>
  );

  /** ローディング画面 */
  function ProtectedSkeleton() {
    return <div style={{ padding: 16 }}>Loading secure area...</div>;
  }
}
