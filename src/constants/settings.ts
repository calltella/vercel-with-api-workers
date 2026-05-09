// /app/src/constants/settings.ts

import { UserSettings } from "@/src/types/user";
/**
 * KV用 ユーザー設定
*/
export const DEFAULT_SETTINGS: UserSettings = {
  themeMode: 'light',
  colorThemes: 'default',
  avatarPath: 'default.png',
  notifications: true,
  defaultView: 'dashboard',
  createdAt: new Date().toISOString(),
};
