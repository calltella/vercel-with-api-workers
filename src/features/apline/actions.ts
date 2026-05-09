// src/features/apline/actions.ts
"use server";

//import { UpdateAplineInput, CreateAplineInput } from "@/lib/utils/validation/apline.schema";
//import { fetchAplineSingle, markArticleAsRead, deleteAplineById, generateNewApid, updateDraftAplineBase, toggleAplineFavorite } from "@/src/service/apline.service";
import { toggleAplineFavorite } from "@/src/service/apline.service";
//import { getReindexAplineBase } from "@/src/service/aplineImportDatas.service";
//import { updateAplineBase } from "@/src/service/aplineUpdate.service";
import * as aplineSub from "@/src/service/aplineSub.service";
import { getJstDateTimeString } from "@/lib/utils/date";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
//import { uploadFilesToR2, createUploadUrl } from "@/src/service/storage.service";
import * as aplieSetting from "@/src/service/settings.service";
import type { AplineSingleDTO } from "@/src/features/apline/types/ui";
import { auth } from "@/lib/auth.config";

// apline更新
// export async function updateApline(data: UpdateAplineInput, tempKey: string) {
//   //console.log("updateApline received:", data);

//   let apid: string | undefined;

//   const draft = await aplineSub.getAplineDraftsExists(data.id);
//   //console.log(`draft: ${JSON.stringify(draft)} - Count: ${draft.length}`)

//   // 下書き登録時にapidをつける
//   if (draft.length) {
//     await updateDraftAplineBase(data.id);
//     //console.log(`apid: ${JSON.stringify(apid)} - id: ${data.id}`)
//   }

//   const updateId = await updateAplineBase({
//     ...data,
//     apid: apid ?? "",
//     tempKey,
//   });

//   // 検索用インデックス再作成
//   await getReindexAplineBase(updateId);
// }

// apline登録
// export async function createApline(data: CreateAplineInput, tempKey: string) {
//   type CreateAplineWithApid = CreateAplineInput & {
//     apid: string;
//     tempKey: string;
//   };
//   // 登録 でもドラフトでもidは必要
//   // ドラフトの場合はapidは採番しない
//   // apid採番用の関数が必要
//   //console.log(`tempKey: ${tempKey}`)
//   const newApid = await generateNewApid();
//   //console.log("Generated new apid:", newApid);
//   //console.log("createApline received:", data);
//   const params: CreateAplineWithApid = {
//     ...data,
//     apid: newApid,
//     tempKey: tempKey,
//   };

//   const updateId = await updateAplineBase(params);

//   // 検索用インデックス再作成
//   await getReindexAplineBase(updateId);
// }

// export async function deleteAplineAction(id: number) {
//   // ここで削除のロジックを実装
//   //console.log(`Deleting Apline with id: ${id}`);
//   await deleteAplineById(id);

//   // 🔥 キャッシュ無効化
//   revalidatePath(`/apline/delete/${id}`);
//   revalidatePath(`/apline`);

//   // 🔥 再取得させる（これが重要）
//   redirect(`/apline`);
// }

// ドラフト登録
// export async function createDraftApline(
//   data: UpdateAplineInput & { apid: string; tempKey: string }
// ) {
//   //console.log(`createDraftApline: ${JSON.stringify(data)}`);

//   let aplineDraft: any[] = [];

//   // idがある場合のみdraft存在チェック
//   if (data.id) {
//     aplineDraft = await aplineSub.getAplineDraftsExists(data.id);
//   }

//   const hasDraft = aplineDraft.length > 0;
//   const isPublished = !!data.apid;

//   // ① 新規（idなし）
//   if (!data.id) {
//     const newId = await updateAplineBase(data);
//     await aplineSub.insertAplineDrafts(newId);
//     return newId;
//   }

//   // ② 本投稿 → 必ずcloneしてdraft作成
//   if (isPublished) {
//     const { id, ...cloneData } = data;

//     const newId = await updateAplineBase({
//       ...cloneData,
//       apid: "",
//       tempKey: data.tempKey,
//     });

//     await aplineSub.insertAplineDrafts(newId);
//     return newId;
//   }

//   // ③ draftあり → 更新
//   if (hasDraft) {
//     const updatedId = await updateAplineBase(data);
//     await aplineSub.updateAplineDrafts(updatedId);
//     return updatedId;
//   }

//   // ④ draftなし → cloneして新規
//   const { id, ...cloneData } = data;

//   const newId = await updateAplineBase({
//     ...cloneData,
//     tempKey: data.tempKey,
//   });

//   await aplineSub.insertAplineDrafts(newId);
//   return newId;
// }

// // apline詳細
// export async function aplineModalDetail(id: number) {
//   const result = await fetchAplineSingle(id);
//   return result;
// }

// export async function aplineCopyEdit(id: number): Promise<AplineSingleDTO> {
//   const result = await fetchAplineSingle(id);

//   if (!result) {
//     throw new Error("データが見つかりません");
//   }

//   //const base = normalizeApline(result);
//   const now = getJstDateTimeString();

//   return {
//     ...result,

//     // コピー時リセット
//     apid: "",
//     mailFlag: false,
//     statusId: 2,

//     occurrenceDate: now,
//     reception: now,
//     workStartTime: now,
//     workEndTime: "",

//     organization: "",
//     responsible: "",
//     customerImpact: "",
//     correspondingNote: "",
//     files: [],

//   };
// }


// apline既読
// export async function markAsRead(id: number) {
//   const result = await markArticleAsRead(id);
//   console.log(`markArticleAsRead: ${JSON.stringify(result)}`)
//   return result;
// }

// お気に入り
export async function toggleFavoriteAction(id: number) {
  const result = await toggleAplineFavorite(id);
  revalidatePath("/apline");
  return result;
}

// apline店舗リスト
// export async function aplineTenpoLists() {
//   const result = await aplineSub.getAplineTenpoLists();
//   return result;
// }

// apline添付ファイルアップロード
// export async function uploadAplineFiles(
//   joinId: number | null,
//   tempKey: string,
//   files: File[],
//   fileNames: string[],
// ) {
//   console.log(`/app/src/features/apline/actions.ts`)
//   console.log(`CLOUDFLARE_ENV: ${process.env.CLOUDFLARE_ENV}`)

//   if (!files.length) return;
//   const uploaded = process.env.CLOUDFLARE_ENV
//     ? await uploadFilesToR2(joinId, files)// Workers環境なら直接アップロード
//     : await createUploadUrl(joinId, files);// ローカル環境なら署名付きURLを生成してアップロード

//   await aplineSub.saveFileMetadata(joinId, tempKey, uploaded, fileNames);
// }

// apline添付ファイルダウンロード
// export async function downloadAplineFile(downloadKey: string) {
//   // ダウンロードURLを取得
//   const url = await aplineSub.getAplineFileDownloadUrl(downloadKey);

//   return url;
// }

// ログインユーザーのKV設定取得
// export async function getUserSettingFromKV() {
//   const session = await auth();
//   if (!session) {
//     throw new Error("Unauthorized");
//   }
//   const userSetting = await aplieSetting.getUserSettings(session.user.id);

//   return userSetting;
// }