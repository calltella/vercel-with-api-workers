"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { utcFormatDateTimeWithDay } from "@/lib/utils/date";
import { DraftAplineListItems } from "@/src/service/types/apline"
import { deleteDraftItems } from "@/src/features/user/actions/deleteDraftItems"

type Props = {
  items: DraftAplineListItems[];
};

export function DraftListView({ items }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<number[]>([]);

  function toggle(id: number) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  async function deleteSelected() {
    if (selected.length === 0) return;

    if (!confirm("選択した下書きを削除しますか？")) return;

    // TODO: server action 呼び出し
    console.log("delete ids:", selected);

    await deleteDraftItems(selected);
    setSelected([]);
    router.refresh();
  }

  return (
    <div className="p-6">
      {/* 下書き */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">下書き</h2>

        <button
          onClick={deleteSelected}
          disabled={selected.length === 0}
          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-40"
        >
          削除
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm">

          <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
            <tr className="">
              <th className="px-4 py-2 w-10"></th>
              <th className="px-4 py-2 text-left">タイトル</th>
              <th className="px-4 py-2 text-left">組織</th>
              <th className="px-4 py-2 text-left">担当</th>
              <th className="px-4 py-2 text-left">更新日時</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-gray-500"
                >
                  データなし
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => router.push(`/apline/edit/${item.id}`)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td
                    className="px-4 py-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(item.id)}
                      onChange={() => toggle(item.id)}
                    />
                  </td>

                  <td className="px-4 py-2">
                    {item.title || "-"}
                  </td>

                  <td className="px-4 py-2">
                    {item.organization || "-"}
                  </td>

                  <td className="px-4 py-2">
                    {item.responsible || "-"}
                  </td>

                  <td className="px-4 py-2 text-gray-500">
                    {utcFormatDateTimeWithDay(item.updatedAt)}
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}