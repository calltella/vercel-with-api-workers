"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  totalPages: number;
};

export function AplinePaginationContent({ totalPages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page") ?? 1);
  const search = searchParams.get("q") ?? "";

  if (totalPages <= 1) return null;

  function go(page: number) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());

    if (search) {
      params.set("q", search);
    }

    router.push(`?${params.toString()}`);
  }

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const delta = 2;

    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (rangeStart > 2) {
      pages.push("...");
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-10 mb-10 flex-wrap">
      {/* Prev */}
      <button
        disabled={currentPage === 1}
        onClick={() => go(currentPage - 1)}
        className="
          px-3 py-1.5 rounded-md border
          border-zinc-300 dark:border-zinc-700
          bg-white dark:bg-zinc-900
          text-sm font-medium
          shadow-sm
          cursor-pointer
          transition-colors duration-150
          disabled:opacity-40 disabled:cursor-not-allowed
          hover:bg-zinc-200 dark:hover:bg-zinc-700
        "
      >
        前へ
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2 text-zinc-400 select-none"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => go(page)}
            className={`
              px-3 py-1.5 rounded-md text-sm font-medium
              shadow-sm
              cursor-pointer
              transition-all duration-150
              ${currentPage === page
                ? "bg-(--color-primary) text-white shadow-md"
                : "bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }
            `}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => go(currentPage + 1)}
        className="
          px-3 py-1.5 rounded-md border
          border-zinc-300 dark:border-zinc-700
          bg-white dark:bg-zinc-900
          text-sm font-medium
          shadow-sm
          cursor-pointer
          transition-colors duration-150
          disabled:opacity-40 disabled:cursor-not-allowed
          hover:bg-zinc-200 dark:hover:bg-zinc-700
        "
      >
        次へ
      </button>
    </div>
  );
}