// /app/app/(auth)/login/LoginError.tsx
"use client";

import { useSearchParams } from "next/navigation";

export function LoginError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (!error) return null;

  return (
    <p className="mb-4 text-sm text-center text-red-600 font-bold">
      メールアドレスまたはパスワードが違います
    </p>
  );
}
