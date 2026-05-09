"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { utcFormatDateTimeWithDay } from "@/lib/utils/date";
import { AplineFiles } from "@/src/features/apline/components/AplineFiles";
import { toggleFavoriteAction } from "../actions";
import type { AplineDetailListDTO } from "@/src/features/apline/types/ui";

type AplineDetailContentProps = {
  item: AplineDetailListDTO | null;
  keyWord?: string;
  renderAction?: () => React.ReactNode; // ← ここがポイント
};
export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-2">
      <div className="absolute inset-x-0 top-1/2 h-px bg-zinc-400" />
      <div className="relative flex justify-center">
        <span className="bg-white dark:bg-gray-800 px-3 text-sm font-bold text-(--color-text)">
          {children}
        </span>
      </div>
    </div>
  );
}
function HighlightText({ text, keyword }: { text: string; keyword: string }) {
  if (!keyword.trim() || !text) return <>{text}</>;
  const parts = text.split(new RegExp(`(${keyword})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 dark:bg-yellow-600 rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
export function AplineDetailContent({
  item,
  keyWord = "",
  renderAction,
}: AplineDetailContentProps) {
  const [isFavorite, setIsFavorite] = useState(!!item?.favorite);
  const [isPending, startTransition] = useTransition();

  if (!item) return null;

  const handleToggleFavorite = () => {
    // 楽観的UI更新
    const nextState = !isFavorite;
    setIsFavorite(nextState);

    startTransition(async () => {
      try {
        await toggleFavoriteAction(item.id);
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
        // 失敗したら戻す
        setIsFavorite(!nextState);
      }
    });
  };

  return (
    <>
      {/* Header */}
      <div key={item.id} className="flex flex-col gap-3 pb-1">
        <div className="flex items-start justify-between gap-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold leading-snug text-zinc-900 dark:text-white">
            <button
              onClick={handleToggleFavorite}
              disabled={isPending}
              className={`
                p-1 rounded-full transition-colors
                hover:bg-zinc-100 dark:hover:bg-zinc-700
                ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
              aria-label={isFavorite ? "お気に入り解除" : "お気に入り登録"}
            >
              <Star
                className={`w-6 h-6 ${isFavorite ? "text-black fill-yellow-400" : "text-zinc-300 dark:text-zinc-600"}`}
              />
            </button>
            <HighlightText text={item.title ?? ""} keyword={keyWord} />
          </h2>

          {/* ActionMenuレンダリング */}
          {renderAction?.()}
        </div>

        <div className="pl-9 flex flex-wrap items-center justify-between text-sm text-zinc-800 dark:text-zinc-400">
          <div className="flex flex-wrap items-center divide-x divide-zinc-500 dark:divide-zinc-600">
            <span className="pr-3">
              <HighlightText text={item.apid ?? ""} keyword={keyWord} />
            </span>
            <span className="px-3">{item.organization}</span>
            <span className="px-3">{item.responsible}</span>
          </div>
          <span className=" dark:text-zinc-500">
            {utcFormatDateTimeWithDay(item.occurrenceDate)}
          </span>
        </div>
      </div>

      <SectionTitle>受付内容</SectionTitle>
      <div className="my-1 text-base whitespace-pre-wrap text-zinc-700 dark:text-zinc-200">
        <HighlightText text={item.workContent ?? ""} keyword={keyWord} />
      </div>

      <SectionTitle>対処/回答</SectionTitle>
      <div className="my-1 text-base whitespace-pre-wrap text-zinc-700 dark:text-zinc-200">
        <HighlightText text={item.dealAnswer ?? ""} keyword={keyWord} />
      </div>

      {item.surveyResults?.trim() && (
        <>
          <SectionTitle>調査結果/原因</SectionTitle>
          <div className="my-1 text-base whitespace-pre-wrap text-zinc-700 dark:text-zinc-200">
            <HighlightText text={item.surveyResults ?? ""} keyword={keyWord} />
          </div>
        </>
      )}

      {item.customerImpact?.trim() && (
        <>
          <SectionTitle>顧客影響</SectionTitle>
          <div className="my-1 text-base whitespace-pre-wrap text-zinc-700 dark:text-zinc-200">
            <HighlightText text={item.customerImpact ?? ""} keyword={keyWord} />
          </div>
        </>
      )}

      {item.correspondingNote?.trim() && (
        <>
          <SectionTitle>対応メモ（再発防止・運用改善等）</SectionTitle>
          <div className="my-1 text-base whitespace-pre-wrap text-zinc-700 dark:text-zinc-200">
            <HighlightText text={item.correspondingNote ?? ""} keyword={keyWord} />
          </div>
        </>
      )}

      {item.files.length > 0 && (
        <>
          {/* 添付ファイル一覧　*/}
          <SectionTitle>添付ファイル一覧</SectionTitle>
          <div className="my-1 text-base whitespace-pre-wrap text-zinc-700 dark:text-zinc-200">
            <AplineFiles files={item?.files} />
          </div>
        </>
      )}
    </>
  );
}