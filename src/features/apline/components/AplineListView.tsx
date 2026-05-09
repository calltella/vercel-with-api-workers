"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import * as ui from "@/src/features/apline/components";

import type { AplineListDTO, AplineDetailListDTO } from "@/src/features/apline/types/ui";
import type { AplineTenpoListItems } from "@/src/service/types/apline";
import { CirclePlus } from 'lucide-react';
import { useBadge } from '@/src/context/BadgeContext';

type Props = {
  data: {
    aplineDatas: AplineListDTO[];
    totalPages: number;
    currentPage: number;
    tenpoLists: AplineTenpoListItems[];
  }
};

export function AplineListView({
  data
}: Props) {
  const router = useRouter();
  const { setBadge } = useBadge();
  const [openIds, setOpenIds] = useState<number[]>([]);

  const [listItems, setListItems] = useState<AplineListDTO[]>(
    data?.aplineDatas ?? []
  );
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (selectedId !== null) return;

    const interval = setInterval(() => {
      router.refresh();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [router, selectedId]);


  const [detail, setDetail] = useState<AplineDetailListDTO | null>(null);
  const [isPending, startTransition] = useTransition();

  // 👇 propsが変わったら同期
  useEffect(() => {
    setListItems(data?.aplineDatas ?? []);
  }, [data?.aplineDatas]);

  const toggle = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  return (
    <>
      <ui.AplineSearchBar tenpoLists={data.tenpoLists} />
      <div className="h-20">CSSマージンで調節しない</div>
      {/* レスポンシブ対応 */}
      <div className="flex flex-col gap-4 px-2">
        {listItems.length === 0 ? (
          <p className="text-center text-gray-500">データがありません</p>
        ) : (
          listItems.map((element) => (
            <ui.AplineSectionCardItem
              key={element.id}
              item={element}
              onClick={() => toggle(element.id)}
              isOpen={openIds.includes(element.id)}
            />
          ))
        )}
      </div>
      {/* ペジネーション */}
      <ui.AplinePaginationContent
        totalPages={data.totalPages}
      />

      {/* 新規登録ボタン */}
      <div className="fixed bottom-6 right-6 z-50 group">
        {/* ツールチップ */}
        <div className="absolute bottom-full right-0 mb-2 px-2 py-1 rounded-md bg-(--color-secondary)  text-(--color-text) text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          新規登録
        </div>
        {/* ボタン */}
        <button
          type="button"
          aria-label="新規登録"
          onClick={() => { router.push(`/apline/create`); }}
        >
          <CirclePlus className="w-15 h-15 cursor-pointer hover:scale-110 text-(--color-secondary)" />
        </button>
      </div>
    </>
  )
}
