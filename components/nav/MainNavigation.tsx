// components/nav/MainNavigation.tsx
"use client";
// Client Component で「サーバー専用コード（auth / Prisma / pg）」は実行できない

import Link from "next/link";
import { ProfileMenu } from "@/components/nav/ProfileMenu";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { UserRole } from "@/src/types/user";
import { UserSettings } from "@/src/types/user";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { Menu } from 'lucide-react';

type Props = {
  userSettings: UserSettings;
};

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="md:px-4 py-2 block text-(--color-text) hover:text-(--color-secondary)"
    >
      {children}
    </Link>
  );
}

export function MainNavigation({ userSettings }: Props) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const role: UserRole | null = session?.user?.role ?? null;
  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "http://localhost:3000";
  const handleClose = () => setOpen(false);

  const pathname = usePathname();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 w-full px-4 py-2 bg-(--color-primary) shadow-md">
        <div className="flex items-center">
          {/* ロゴ */}
          <div className="shrink-0 bg-white">
            <img
              src={`${imageBaseUrl}/logos/bmc_logo_icon.png`}
              className="h-10 w-10"
              alt="logo"
            />
          </div>

          {/* 左メニュー */}
          <div className={clsx('ml-6 flex-1 md:flex md:items-center',
            open ? '' : 'hidden md:flex'
          )}
          >
            <ul className="flex flex-col md:flex-row text-base">
              <li>
                <NavLink href="/apline" onClick={handleClose}>Apline</NavLink>
              </li>
              {/* roleで出し分けも可能 */}
              {role === "admin" && (
                <>
                  <li>
                    <NavLink href="/admin" onClick={handleClose}>管理者</NavLink>
                  </li>
                  <li>
                    <NavLink href="/admin/logs" onClick={handleClose}>ログ</NavLink>
                  </li>
                </>
              )}
            </ul>

            {/* 右端：プロフィール */}
            <div className="ml-auto">
              <ProfileMenu
                userName={session?.user.name || ""}
                avatarsImage={`${imageBaseUrl}/avatars/${userSettings.avatarPath}`}
              />
            </div>
          </div>

          {/* ハンバーガー */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="ml-auto md:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>
    </>
  );
}
