// app/(protected)/apline/route.ts

import { redirect } from "next/navigation";

export async function GET() {
  return redirect("/apline/lists");
}