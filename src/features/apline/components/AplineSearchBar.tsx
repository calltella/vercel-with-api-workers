"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import type { AplineTenpoListItems } from "@/src/service/types/apline";
import clsx from 'clsx';
import { Button, Select, Input } from '@headlessui/react'

import { useAplineSidebar } from '@/src/context/AplineSidebarContext';

export function AplineSearchBar({
  tenpoLists = [],
}: {
  tenpoLists?: AplineTenpoListItems[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // フィルターメニュー開閉(context)
  const { isOpen, setOpen } = useAplineSidebar();

  // キーワードフィルター
  const [keywordInput, setKeywordInput] = useState(
    searchParams.get("q") ?? ""
  );

  // 店舗フィルター 
  const [shopId, setShopId] = useState(
    searchParams.get("shopId") ?? ""
  );

  useEffect(() => {
    const hasKeyword = searchParams.get("q");
    const hasShopId = searchParams.get("shopId");

    const hasFilterActive =
      hasKeyword || hasShopId;

    if (hasFilterActive) return; // ← 条件あれば閉じない

    const timer = setTimeout(() => {
      setOpen(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const buildQuery = (
    base: URLSearchParams,
    params: Record<string, string | boolean | null>,
    options?: { resetPage?: boolean }
  ) => {
    const current = new URLSearchParams(base.toString());

    Object.entries(params).forEach(([key, value]) => {
      const v =
        typeof value === "string" ? value.trim() : value;

      if (!v) {
        current.delete(key);
      } else {
        current.set(key, String(v));
      }
    });

    if (options?.resetPage) {
      current.set("page", "1");
    }

    return current;
  };

  /* =========================
     Actions
  ========================= */

  // クエリ更新（replace）
  const updateQuery = (params: Record<string, string | boolean | null>) => {
    const query = buildQuery(searchParams, params, { resetPage: true });
    router.replace(`?${query.toString()}`);
  };

  // キーワード検索
  const submitKeyword = () => {
    updateQuery({
      keyword: keywordInput,
    });
  };

  // クリア
  const handleClear = () => {
    setKeywordInput("");
    setShopId("");

    updateQuery({
      keyword: null,
      shopId: null,
    });
  };

  return (
    <div className="sticky top-16 z-20 mb-2">
      {/* 検索パネル（開閉） */}
      <div
        className={clsx(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="flex gap-2 px-2 pt-2">
          <div className="w-48 flex shrink-0">
            {/* 店舗 */}
            <Select
              value={shopId}
              onChange={(e) => {
                const value = e.target.value;
                setShopId(value);

                updateQuery({
                  shopId: value || null,
                  q: keywordInput || null,
                });
              }}
              className="
              w-full rounded-md border px-2 py-2 
              bg-white dark:bg-gray-700 dark:border-gray-600
              data-focus:bg-blue-100 data-hover:shadow
              "
            >
              <option value="">全店舗</option>
              {tenpoLists.map((tenpo) => (
                <option key={tenpo.id} value={tenpo.id}>
                  {tenpo.pulldownName}
                </option>
              ))}
            </Select >
          </div>
          <div className="flex-1 min-w-48 h-11">
            {/* キーワード */}
            <Input
              type="text"
              placeholder="検索キーワード"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitKeyword();
              }}
              className="w-full rounded-md border px-3 py-2 
              bg-white dark:bg-gray-700 dark:border-gray-600
              data-focus:bg-blue-100 data-hover:shadow
              data-focus:dark:bg-blue-300
              "
            />
          </div>
          <div className="flex shrink-0">
            {/* 検索 */}
            <Button
              onClick={submitKeyword}
              className="flex-1 rounded-md text-sm bg-blue-600 px-4 py-2 text-white"
            >
              検索
            </Button>

            {/* クリア */}
            <Button
              onClick={handleClear}
              className="flex-1 rounded-md text-sm w-24 bg-gray-300 ml-2 px-4 py-2 text-gray-700 hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200"
            >
              クリア
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}