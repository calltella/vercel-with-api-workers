// app/(protected)/ThemeProviderClient.tsx
"use client";

import { ThemeProvider } from "next-themes";
import type { ThemeMode } from "@/src/types/user"

export default function ThemeProviderClient({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme: ThemeMode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={initialTheme}
      enableSystem={false}
    >
      {children}
    </ThemeProvider>
  );
}
