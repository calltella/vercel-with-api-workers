// /types/user.ts

import type { ColorThemeKey } from "@/app/theme/colorTheme";

export type UserRole = "admin" | "user";
export type ThemeMode = "light" | "dark" | "system";

// KV形式で保存するための型
export interface UserSettings {
  themeMode: ThemeMode;
  colorThemes: ColorThemeKey;
  avatarPath: string;
  notifications: boolean;
  defaultView: string;
  createdAt: string;
}

/**
 * 基本ルール
 * Props → interface
 * それ以外 → type
 * 
 */