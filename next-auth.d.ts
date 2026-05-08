import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;

    user: {
      id: string;

      role?: "user" | "admin";

      avatorURL?: string;
      themeMode?: string;
      colorThemes?: string;
      defaultView?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;

    role?: "user" | "admin";

    avatorURL?: string;
    themeMode?: string;
    colorThemes?: string;
    defaultView?: string;

    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;

    role?: "user" | "admin";

    avatorURL?: string;
    themeMode?: string;
    colorThemes?: string;
    defaultView?: string;

    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires: number;

    error?: string;
  }
}