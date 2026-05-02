// /app/app/(auth)/login/page.tsx
import { Suspense } from "react";
import LoginClient from "@/src/features/auth/login/LoginClient";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginClient />
    </Suspense>
  );
}
