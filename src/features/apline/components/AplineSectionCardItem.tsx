import { Mail, Paperclip, Star, ChevronsDown, Clock, CircleUserRound } from "lucide-react";
import { utcFormatDateWithDay, utcFormatDateTimeWithDay } from "@/lib/utils/date";
import type { AplineDetailListDTO } from "@/src/features/apline/types/ui";
import { ActionMenu } from "@/src/features/apline/components/ActionMenu";
import { SectionTitle } from "@/src/features/apline/components/AplineDetailContent";
import clsx from 'clsx';

type Props = {
  item: AplineDetailListDTO;
  onClick: () => void;
  isOpen: boolean;
};

export function AplineSectionCardItem({ item, onClick, isOpen }: Props) {
  return (
    <div className="relative" >
      {/* 未読ドット：左上に絶対配置 */}
      <span className={clsx(
        'absolute top-3 left-2 z-10 h-2.5 w-2.5 rounded-full bg-orange-400',
        item.isUnread ? 'opacity-100' : 'opacity-0'
      )}
      />
      <div className="rounded-xl border border-gray-400 shadow-lg font-medium">
        <div className="flex flex-wrap justify-between p-1 rounded-t-xl bg-(--color-secondary)">
          {/* 固定幅 */}
          <div className="w-32 pl-5 shrink-0">
            {item.apid}
          </div>

          {/* 固定幅 */}
          <div className="w-40 shrink-0">
            {utcFormatDateWithDay(item.occurrenceDate)}
          </div>

          {/* 可変 */}
          <div className="flex-1 min-w-0">
            {item.organization}
          </div>

          {/* 固定幅 */}
          <div className="w-40 shrink-0 truncate">
            {item.responsible}
          </div>

          {/*  固定どちらでもOK */}
          <div className="w-40 shrink-0 pr-3 text-right">
            <span
              className={clsx(
                "inline-block rounded-2xl border px-2 py-1 text-xs font-medium",
                item.statusId !== null && [5, 6].includes(item.statusId)
                  ? "border-green-700 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                  : "border-red-700 bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
              )}
            >
              {item.status}
            </span>
          </div>
        </div>
        {/* 上段 */}
        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* 可変 */}
            <div className="flex-1 text-lg min-w-0 pl-5">
              {item.title}
            </div>
            {/* icons */}
            <div className="flex items-center gap-2 text-zinc-400 shrink-0">
              <Star className={clsx('w-4 h-4',
                item.favorite
                  ? 'text-yellow-500 fill-yellow-400'
                  : "text-zinc-300 fill-none opacity-40"
              )}
              />
              <Mail className={clsx('w-4 h-4',
                item.mailFlag ? 'opacity-100' : 'opacity-0'
              )}
              />
              <Paperclip className={clsx('w-4 h-4',
                item.files.length > 0 ? 'opacity-100' : 'opacity-0'
              )}
              />
            </div>
          </div>
          <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
            <ActionMenu item={item} variant="dots" />
          </div>
        </div>

        {/* 2段 */}
        <SectionTitle>受付内容</SectionTitle>
        <div className="flex items-center gap-3 min-w-0">
          {/* content */}
          <div className="pl-5 text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap wrap-break-words min-w-0 flex-1">
            {item.workContent}
          </div>
        </div>

        {/* 対処/回答 */}
        {item.dealAnswer && (
          <>
            <SectionTitle>対処/回答</SectionTitle>
            <div className="flex items-center gap-3 min-w-0">
              <div className="pl-5 text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap wrap-break-words min-w-0 flex-1">
                {item.dealAnswer}
              </div>
            </div>
          </>
        )}

        {/* 調査結果/原因 */}
        {item.surveyResults && (
          <>
            <SectionTitle>調査結果/原因</SectionTitle>
            <div className="flex items-center gap-3 min-w-0">
              <div className="pl-5 text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap wrap-break-words min-w-0 flex-1">
                {item.surveyResults}
              </div>
            </div>
          </>
        )}

        {/* 顧客影響 */}
        {item.customerImpact && (
          <>
            <SectionTitle>顧客影響</SectionTitle>
            <div className="flex items-center gap-3 min-w-0">
              <div className="pl-5 text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap wrap-break-words min-w-0 flex-1">
                {item.customerImpact}
              </div>
            </div>
          </>
        )}

        {/* 対応メモ */}
        {item.correspondingNote && (
          <>
            <SectionTitle>対応メモ</SectionTitle>
            <div className="flex items-center gap-3 min-w-0">
              <div className="pl-5 text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap wrap-break-words min-w-0 flex-1">
                {item.correspondingNote}
              </div>
            </div>
          </>
        )}

        {/* 詳細メモ */}
        <div
          className={clsx('flex justify-center px-2 mt-2 h-3 rounded-b-xl border border-gray-100 cursor-pointer',
            isOpen ? 'bg-gray-100' : ''
          )}
          onClick={onClick}
        >
          <ChevronsDown className={clsx(
            'h-3 w-3 text-gray-400 transition-transform',
            isOpen ? 'rotate-180' : ''
          )}
          />
        </div>
        <div className={clsx(
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-250' : 'max-h-0'
        )}
        >
          <div className="flex flex-wrap gap-x-6 gap-y-1 pl-5 py-3">
            <div>
              <div className="flex items-center gap-1 text-sm text-zinc-400 dark:text-zinc-500">
                <CircleUserRound className="h-4 w-4" />受付者
              </div>
              <div className="font-medium text-zinc-700 dark:text-zinc-300">
                {item.acceptanceUserName}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-sm text-zinc-400 dark:text-zinc-500">
                <Clock className="h-4 w-4" />受付時間
              </div>
              <div className="font-medium text-zinc-700 dark:text-zinc-300">
                {utcFormatDateTimeWithDay(item.workStartTime)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-sm text-zinc-400 dark:text-zinc-500">
                <CircleUserRound className="h-4 w-4" />更新者
              </div>
              <div className="font-medium text-zinc-700 dark:text-zinc-300">
                {item.updateUserName}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-sm text-zinc-400 dark:text-zinc-500">
                <Clock className="h-4 w-4" />更新時間
              </div>
              <div className="font-medium text-zinc-700 dark:text-zinc-300">
                {utcFormatDateTimeWithDay(item.updatedAt)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-sm text-zinc-400 dark:text-zinc-500">
                <Clock className="h-4 w-4" />終了時間
              </div>
              <div className="font-medium text-zinc-700 dark:text-zinc-300">
                {item.workEndtime ? utcFormatDateTimeWithDay(item.workEndtime) : "-"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




