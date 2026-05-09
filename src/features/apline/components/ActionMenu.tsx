"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { AplineListDTO, AplineDetailListDTO } from "@/src/features/apline/types/ui";
import { Menu, EllipsisVertical } from 'lucide-react';
import clsx from 'clsx';

type MenuVariant = "hamburger" | "dots";

type Props = {
  item: AplineListDTO | AplineDetailListDTO;
  onCloseModal?: () => void;
  variant?: MenuVariant; // 追加：指定なしなら "hamburger"
};

export function ActionMenu({ item, onCloseModal, variant = "hamburger" }: Props) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div ref={menuRef} className="relative" onClick={(e) => e.stopPropagation()} >
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
        aria-label="メニュー"
      >
        {variant === "hamburger" ? (
          // 横3本線
          <div className="flex flex-col gap-1">
            <Menu className="w-6 h-6" />
          </div>
        ) : (
          // 縦3つのドット
          <div className="flex flex-col gap-1 items-center">
            <EllipsisVertical className="w-4 h-4 text-zinc-500 hover:text-black" />
          </div>
        )}
      </button>

      <div className={clsx('absolute right-0 mt-2 w-56 rounded-xl bg-(--color-primary) text-(--color-text) \
          shadow-xl border border-(--color-secondary) origin-top-right z-50 \
          transform transition-all duration-200 ease-out flex flex-col max-h-64 overflow-y-auto',
        menuOpen
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
      )}
      >
        <div className="py-1">
          <button
            onClick={() => {
              setMenuOpen(false);
              router.push(`/apline/edit/${item?.id}`);
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-600"
          >
            編集
          </button>

          <button
            onClick={() => {
              setMenuOpen(false);
              router.push(`/apline/edit/${item?.id}/copy`);
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-600"
          >
            コピーして編集
          </button>

          <div className="my-1 border-t border-(--color-secondary)" />

          {onCloseModal && (
            <>
              <div className="my-1 border-t border-(--color-secondary)" />
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onCloseModal();
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-600"
              >
                閉じる
              </button>
            </>
          )}
        </div>
        <div className="py-2">
          <button
            onClick={() => {
              setMenuOpen(false);
              router.push(`/apline/delete/${item?.id}`);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}