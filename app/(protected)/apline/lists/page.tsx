// app/(protected)/apline/page.tsx

//import { fetchAplineList, fetchAplineDetailList } from "@/src/service/apline.service";
import { fetchAplineList } from "@/src/service/apline.service";
import { getAplineTenpoLists } from "@/src/service/aplineSub.service";
import { AplineListView } from "@/src/features/apline/components";
import { AplineSearchParams } from "@/src/features/apline/types/searchParams";
import { parseAplineParams } from "@/lib/parse/parseAplineParams";
import type { DraftAplineListItems, AplineTenpoListItems } from "@/src/service/types/apline";
import type { AplineListResponse } from "@/src/features/apline/types/ui";


export default async function Page({
  searchParams,
}: {
  searchParams: Promise<AplineSearchParams>;
}) {

  const params = await searchParams;
  const parsed = parseAplineParams(params); // urlパラメータをパース

  // 将来的に設定項目にいれる
  const pageSize = 2;

  const hasKeyword = parsed.keyword.length > 0;

  const baseParams = {
    ...parsed,
    pageSize,
  };

  // 店舗リスト
  const tenpoLists = await getAplineTenpoLists() as AplineTenpoListItems[];

  // 検索対象あり
  if (hasKeyword) {
    //const detailListData = await fetchAplineDetailList(baseParams);

    return (
      <></>
      // <ui.AplineSearchListView
      //   data={{
      //     ...detailListData, // 中身をtenpoListsと同じ様に展開
      //     keyWord: parsed.keyword,
      //     tenpoLists,
      //   }}
      // />
    );
  }

  // 検索対象なし
  const listData = (await fetchAplineList(baseParams)) as AplineListResponse;

  return (
    <AplineListView
      data={{
        ...listData,
        tenpoLists,
      }}
    />
  );
}