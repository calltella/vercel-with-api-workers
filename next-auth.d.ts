// next-auth.d.ts

import "next-auth";

declare module "next-auth" {
  interface User {
    role?: "user" | "admin";
    avatarUrl?: string;
  }

  interface Session {
    user: {
      id: string;
      role?: "user" | "admin";
      avatarUrl?: string;
      //themeMode?: string;
      //themeColor?: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    id?: string;
    role?: "user" | "admin";
    avatarUrl?: string;
  }
}
