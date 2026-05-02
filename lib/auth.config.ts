// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
//import { getUserFromDb, getAccountFromDb, saveAuthLoginHistory } from "@/lib/utils/auth";
// import { getRequestMeta } from "@/lib/auth.server";
import type { UserRole } from "@/src/types/user"

const isProduction = process.env.NODE_ENV === "production";

const API_URL_BASE = process.env.API_URL_BASE!;

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }
        // ユーザー認証
        //const user = await getUserFromDb(email, password);

        // 🔥 APIサーバーに認証を委譲
        const res = await fetch(`${API_URL_BASE}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!res.ok) {
          return null;
        }

        const data = await res.json();

        console.log(`Login ok data: ${JSON.stringify(data)}`)

        if (!data.user.id) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          return null;
        }
        // ログイン情報を記録（Worker側で実装）
        // try {
        //   await getRequestMeta(user);
        // } catch (error) {
        //   console.error("Failed to save login history:", error);
        // }
        // return user object with their profile data
        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name ?? undefined,
          role: data.user.role ?? undefined,
          avatarUrl: data.user.avatarUrl ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.avatarUrl = (user as { avatarUrl?: string }).avatarUrl;
        token.userId = user.id;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
      }
      // 👉 フロントで使いたい場合
      (session as any).accessToken = token.accessToken;
      // const userId = token.id as string;
      // const account = await getAccountFromDb(userId)
      // session.user.id = token.id as string;
      // session.user.role = token.role as UserRole;
      // session.user.avatarUrl = token.avatarUrl as string | undefined;
      // session.user.themeMode = account?.themeMode ?? "light"; next-themesを使うので未使用
      //session.user.themeColor = account?.colorThemes ?? "default";
      return session;
    },
  },
  trustHost: true, // hostを信用する
});
