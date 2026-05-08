"use client";

import { SessionProvider } from "next-auth/react";
import ThemeProviderClient from "../ThemeProviderClient";
import { ThemeVariablesClient } from "../ThemeVariablesClient";
import { Session } from "next-auth";
import type { ThemeMode } from "@/src/types/user"
import type { ColorThemeKey } from "@/app/theme/colorTheme";

type Props = {
  children: React.ReactNode;
  session: Session;
};

export default function Providers({
  children,
  session,
}: Props) {
  return (
    <SessionProvider session={session}>
      <ThemeProviderClient
        initialTheme={(session.user.themeMode ?? "light") as ThemeMode}
      >
        <ThemeVariablesClient
          paletteKey={(session.user.colorThemes ?? "default") as ColorThemeKey}
        />

        {children}
      </ThemeProviderClient>
    </SessionProvider>
  );
}