// lib/parse/parseAplineParams.ts

import { AplineSearchParams } from "@/src/features/apline/types/searchParams";

export function parseAplineParams(params: AplineSearchParams) {
  return {
    currentPage: Number(params.page ?? 1),
    shopId: Number(params.shopId ?? 0),
    keyword: params.keyword?.trim() || "",
    unread: params.unread === "true",
    incomplete: params.incomplete === "true",
    category: params.category ?? "all",
  };
}

/**
 * params制御を共通化(不要なパラメータを削除します)
 * 
 * @param current 
 * @param updates 
 * @param removeKeys 
 * @returns 
 */
export function updateSearchParams(
  current: URLSearchParams,
  updates: Record<string, string | null>,
  removeKeys: string[] = []
) {
  const params = new URLSearchParams(current.toString());

  // set / delete
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });

  // まとめて削除
  removeKeys.forEach((key) => params.delete(key));

  return params;
}