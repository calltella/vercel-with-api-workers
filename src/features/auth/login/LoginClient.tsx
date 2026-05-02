// /app/app/(auth)/login/LoginClient.tsx
"use client";

import { loginAction } from "@/src/features/auth/actions";
import { LoginError } from "@/src/features/auth/login/LoginError";
import { PrimaryButton } from "@/src/features/user/components/Buttons";
import { Field, Fieldset, Input, Label, Legend } from '@headlessui/react';
import { SectionCard } from "@/src/features/user/components/SectionCard";

export default function LoginClient() {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-black">
        <div className="w-full max-w-sm rounded-lg bg-white shadow dark:bg-black">
          <SectionCard>
            <form action={loginAction}>
              <Fieldset className="space-y-6">
                <Legend className="text-2xl font-bold text-center">ログイン</Legend>
                <LoginError />
                <Field>
                  <Label className="block text-sm font-medium pl-3 pb-1">メールアドレス</Label>
                  <Input className="w-full rounded block border text-base pl-3 py-1" type="email" name="email" data-focus data-hover />
                </Field>
                <Field>
                  <Label className="block text-sm font-medium pl-3 pb-1">パスワード</Label>
                  <Input className="w-full rounded block border text-base pl-3 py-1" type="password" name="password" data-focus data-hover />
                </Field>
                <Field>
                  <PrimaryButton
                    type="submit"
                    className="w-full"
                  >
                    ログイン
                  </PrimaryButton>
                </Field>
              </Fieldset>
            </form>
            <div className="text-right pt-1">
              <a
                href="/forgot-password"
                className="text-xs text-blue-600 hover:underline"
              >
                パスワードをお忘れですか？
              </a>
            </div>
          </SectionCard>
        </div>
      </div>
    </>
  );
}
