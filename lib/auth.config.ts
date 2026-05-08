// lib/auth.config.ts

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import * as z from "zod";

const API_URL_BASE = process.env.API_URL_BASE!;

if (!API_URL_BASE) {
  throw new Error("API_URL_BASE is not defined");
}

type LoginResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatorURL: string;
    themeMode: string;
    colorThemes: string;
    defaultView: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // 秒
};

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

async function refreshAccessToken(token: any) {
  try {
    const res = await fetch(`${API_URL_BASE}/internal/token/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    });

    if (!res.ok) throw new Error("Refresh failed");

    const data: RefreshResponse = await res.json();

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? token.refreshToken,
      accessTokenExpires: Date.now() + data.expiresIn * 1000,
    };
  } catch (error) {
    console.error("Refresh token error", error);

    return {
      ...token,
      accessToken: undefined,
      accessTokenExpires: 0,
      error: "RefreshAccessTokenError",
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const validatedFields = LoginSchema.safeParse(credentials);

          if (!validatedFields.success) {
            return null;
          }
          const { email, password } = validatedFields.data;
          const res = await fetch(`${API_URL_BASE}/internal/token/access`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          });

          if (!res.ok) return null;

          const data: LoginResponse = await res.json();
          console.log("auth/login success", {
            userId: data.user.id,
            email: data.user.email,
            avatorURL: data.user.avatorURL,
            colorThemes: data.user.colorThemes,
            themeMode: data.user.themeMode,
          });
          // auth/login response: {"user":{"id":"ac20cc34-1d60-4aeb-8755-2097c9311302","name":"阿佐雄一",
          // "email":"yuichi.asa@gmail.com"},
          // "accessToken":"","refreshToken":"6cddf308-2d21-4bdb-947d-f607d2e85cff"}

          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role as "user" | "admin" | undefined,
            avatorURL: data.user.avatorURL,
            themeMode: data.user.themeMode,
            colorThemes: data.user.colorThemes,
            defaultView: data.user.defaultView,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            accessTokenExpires: Date.now() + data.expiresIn * 1000,
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // 🔥 初回ログイン
      if (user) {
        return {
          ...token,
          userId: user.id,
          role: user.role,

          avatorURL: user.avatorURL,
          themeMode: user.themeMode,
          colorThemes: user.colorThemes,
          defaultView: user.defaultView,

          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.accessTokenExpires,
        };
      }

      // 🔥 まだ有効
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // 🔥 期限切れ → refresh
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.role = token.role as "user" | "admin";

        session.user.avatorURL = token.avatorURL as string;
        session.user.themeMode = token.themeMode as string;
        session.user.colorThemes = token.colorThemes as string;
        session.user.defaultView = token.defaultView as string;
      }

      session.accessToken = token.accessToken as string | undefined;
      session.error = token.error as string | undefined;

      return session;
    },
  },
});