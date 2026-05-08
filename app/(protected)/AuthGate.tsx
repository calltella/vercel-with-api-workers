import { auth } from "@/lib/auth.config";
import { redirect } from "next/navigation";
import Providers from "./Providers";

export default async function AuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <Providers session={session}>
      {children}
    </Providers>
  );
}