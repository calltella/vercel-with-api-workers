// 関数の戻り値ベースの型

// import * as apline from "../apline.service";
// import * as aplineSub from "../aplineSub.service";

// // 一覧表示用（複数）
// export type AplineListItem = Awaited<ReturnType<typeof apline.fetchAplineList>>["aplineDatas"][number];

// // 詳細表示用（単数）
// export type AplineDetailItem = Awaited<ReturnType<typeof apline.fetchAplineDetailList>>["aplineDatas"][number];

// // エディター用
// export type AplineSelectItems = Awaited<ReturnType<typeof apline.getAplineSelectItems>>;

// // 店舗一覧リスト
// export type AplineTenpoListItems = Awaited<ReturnType<typeof aplineSub.getAplineTenpoLists>>[number];

// export type DraftAplineListItems = Awaited<ReturnType<typeof aplineSub.getDraftAplineList>>[number];

// export type FavoriteAplineListItems = Awaited<ReturnType<typeof aplineSub.getFavoriteAplineList>>[number];

// export type aplineArticleLock = Awaited<ReturnType<typeof apline.getAplineArticleLock>>;
export type DraftAplineListItems = {
  id: number;
  title: string | null;
  apid: string | null;
  organization: string | null;
  responsible: string | null;
  workContent: string | null;
  statusId: number | null;
  status: string | null;
  acceptanceUserId: number | null;
  acceptanceUserName: string | null;
  acceptanceAplineUserId: number | null;
  mailFlag: boolean | null;
  occurrenceDate: string | null;
  updatedAt: string;
}

export type AplineTenpoListItems = {
  id: number;
  tencd: number;
  pulldownName: string;
  registName: string;
};
