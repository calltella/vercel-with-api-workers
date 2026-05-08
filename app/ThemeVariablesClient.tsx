// app/ThemeVariablesClient.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";
import {
  COLOR_THEMES,
  ColorThemeKey,
  ColorTheme,
} from "@/app/theme/colorTheme";

type Props = {
  paletteKey: ColorThemeKey;
};

export function ThemeVariablesClient({ paletteKey }: Props) {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) return;

    // ✅ 配列前提で安全に取得
    const palette: ColorTheme =
      COLOR_THEMES.find((t) => t.value === paletteKey) ??
      COLOR_THEMES.find((t) => t.value === "default")!;

    const vars = resolvedTheme === "dark" ? palette.dark : palette.light;

    Object.entries(vars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(
        `--color-${key}`,
        value
      );
    });
  }, [paletteKey, resolvedTheme]);

  return null;
}