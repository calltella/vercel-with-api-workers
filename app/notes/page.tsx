// /app/app/notes/page.tsx

import type { Note } from "@/src/types/note";
import { utcFormatDateTimeWithDay } from "@/lib/utils/date"
import { createNoteAction } from "@/app/notes/actions";
import { getNotesAPI } from "@/src/service/notes.service";
import { SectionCard } from "@/src/features/user/components/SectionCard";
import { PrimaryButton } from "@/src/features/user/components/Buttons";
import { Field, Fieldset, Input, Legend, Textarea } from '@headlessui/react';

export const dynamic = "force-dynamic";
// Generating static pages → /notes をプリレンダリング → その中で fetch 実行 → env が undefined → クラッシュ

/**
 * 
 * @returns 完全API移行完了
 */

export default async function NotesPage() {
  const allNotes = await getNotesAPI();
  console.log(`APIからのノート: ${JSON.stringify(allNotes)}`);

  return (
    <main className="mx-auto max-w-3xl p-6">
      {/* ノート作成フォーム */}
      <form action={createNoteAction} className="mb-8 space-y-4">
        <Fieldset className="space-y-4">
          <Legend className="text-xl font-semibold">Notes</Legend>
          <Field>
            <Input
              className="w-full rounded block border text-base pl-3 py-1"
              placeholder="タイトル"
              type="text"
              name="title"
              required
              data-focus
              data-hover
            />
          </Field>
          <Field>
            <Textarea
              className="w-full rounded block border text-base pl-3 py-1"
              placeholder="内容"
              name="content"
              rows={4}
              data-focus
              data-hover
            />
          </Field>
          <Field className="flex justify-center">
            <PrimaryButton
              type="submit"
              className="w-4/5"
            >
              登録
            </PrimaryButton>
          </Field>
        </Fieldset>
      </form>

      {/* ノート一覧 */}
      {allNotes.length === 0 ? (
        <p className="text-gray-500">ノートがありません</p>
      ) : (
        <>
          {allNotes.map((f: Note) => (
            <SectionCard key={f.id} className="mb-4">
              <h2 className="font-semibold">{f.title}</h2>
              <p className="mt-2 text-gray-700">{f.content}</p>
              <p className="mt-2 text-xs text-gray-400">
                {utcFormatDateTimeWithDay(f.createdAt)}
              </p>
            </SectionCard>
          ))}

        </>
      )}
    </main>
  );
}
