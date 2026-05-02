"use server";

import { revalidatePath } from "next/cache";
import { createNote } from "@/src/service/notes.service";

export async function createNoteAction(formData: FormData) {
  const title = formData.get("title");
  const content = formData.get("content");

  if (typeof title !== "string" || typeof content !== "string") {
    throw new Error("Invalid form data");
  }

  if (!title.trim()) {
    throw new Error("Title is required");
  }

  await createNote({ title, content });

  revalidatePath("/notes");
}
