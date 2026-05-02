// /app/app/(auth)/login/actions.ts
"use server";

import { signIn, signOut } from "@/lib/auth.config";
import { redirect } from "next/navigation";
import { findUserByEmail } from "@/src/service/user.service";
//import { putPasswordResetToken, getPasswordResetToken, deletePasswordResetToken } from "@/src/service/settings.service";
import { sendMailAction } from "@/src/features/user/actions/sendMailAction";
import { getJstDateTimeString, parseJstStringToDate } from "@/lib/utils/date";
import crypto from "crypto";
import bcrypt from "bcryptjs"

type NextRedirectError = {
  digest: string;
};

function isNextRedirectError(error: unknown): error is NextRedirectError {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;
  const next = formData.get("next") as string | null;

  if (!email || !password) {
    redirect("/login?error=AuthError");
  }
  console.log(`email: ${email} - password: ${password}`)
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: next || "/user/dashboard",
    });
  } catch (error: unknown) {
    /**
     * ✅ 成功時の NEXT_REDIRECT は必ず素通し
     */
    if (isNextRedirectError(error)) {
      throw error;
    }

    console.error("Login failed:", error);
    /**
     * ❌ それ以外はすべてログイン画面へ
     */
    redirect("/login?error=AuthError");
  }
}

/**
 * ログアウト処理（Server Action）
 * - セッション破棄
 * - 完了後に /login へ遷移（必要なら callbackUrl を変更）
 */
export async function logoutAction() {
  await signOut({
    redirect: true,
    redirectTo: "/login",
  });

  // signOutがredirect=trueなら基本到達しないが保険として
  redirect("/login");
}

const RESET_TOKEN_EXPIRY_MINUTES = 5; // 5分

export async function requestPasswordReset(email: string) {
  // ユーザー検索（例）
  const user = await findUserByEmail(email);

  if (!user) {
    // セキュリティ上、存在しなくても成功っぽく返す
    return { message: "メールを送信しました" };
  }

  // トークン生成
  const token = crypto.randomBytes(32).toString("hex");
  const expires = getJstDateTimeString({ minutes: RESET_TOKEN_EXPIRY_MINUTES });

  // KV保存
  //await putPasswordResetToken(email, token, expires);

  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  // メール送信
  await sendMailAction(
    user.email,
    "パスワード再設定",
    `以下のリンクからパスワードを再設定してください（5分有効）:\n${resetLink}`,
  );

  return { message: "メールを送信しました" };
}

// パスワード再設定
export async function resetPassword(email: string, token: string, newPassword: string) {
  const user = await findUserByEmail(email);

  if (!user) {
    return { message: "ユーザーが見つかりません" };
  }

  //const record = await getPasswordResetToken(email);
  const record = { expires: "", resetToken: "" }
  const expires = parseJstStringToDate(record?.expires || "");
  const isValid = await bcrypt.compare(record?.resetToken || "", token);

  // 不正なIPアドレスからのリクエストや、期限切れのトークンを弾く
  if (!record || expires < new Date() || !isValid) {
    return { message: "トークンが無効または期限切れです" };
  }

  //await updateUserPassword(user.id, newPassword);

  //await deletePasswordResetToken(email);

  return { message: "パスワードを更新しました" };
}