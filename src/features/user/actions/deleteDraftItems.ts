"use server";

import { auth } from "@/lib/auth.config";
//import { getUserWithAccount } from "@/src/service/user.service";
import { deleteAplineById } from "@/src/service/apline.service";

export async function deleteDraftItems(selected: number[]) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await Promise.all(
    selected.map((id) => deleteAplineById(id))
  );
}