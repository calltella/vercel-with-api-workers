// components/nav/ProfileMenu.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuLinkProps = {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

function MenuLink({
  href,
  disabled,
  children,
  onClick,
  className = "",
}: MenuLinkProps) {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className={`block px-4 py-2 opacity-50 cursor-not-allowed ${className}`}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-4 py-2 hover:bg-(--color-primary) transition-colors ${className}`}
    >
      {children}
    </Link>
  );
}

type Props = {
  userName: string;
  avatarsImage: string;
};

export function ProfileMenu({ userName, avatarsImage }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  const handleOutsideClick = useCallback((e: PointerEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("pointerdown", handleOutsideClick, {
      passive: true,
    });
    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  return (
    <div className="relative" ref={ref}>
      {/* アバター */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="cursor-pointer block bg-white rounded-full p-0.5"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {/* Cloudflareではimg推奨 */}
        <img
          src={avatarsImage}
          className="rounded-full object-cover w-11.25 h-11.25"
          alt="avatar"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 border border-(--color-text) bg-(--color-secondary) text-(--color-text)">
          <div className="px-4 py-2 text-sm">
            {userName} さんがログイン中
          </div>

          <div className="border-t border-(--color-text)" />

          <MenuLink
            href="/user/profile"
            disabled={pathname === "/user/profile"}
            onClick={() => setOpen(false)}
          >
            プロフィール
          </MenuLink>

          <MenuLink
            href="/user/dashboard"
            disabled={pathname === "/user/dashboard"}
            onClick={() => setOpen(false)}
          >
            ダッシュボード
          </MenuLink>

          <MenuLink
            href="/user/packages"
            disabled={pathname === "/user/packages"}
            onClick={() => setOpen(false)}
          >
            パッケージリスト
          </MenuLink>

          <MenuLink
            href="/user/settings"
            disabled={pathname === "/user/settings"}
            onClick={() => setOpen(false)}
          >
            設定
          </MenuLink>

          <MenuLink
            href="/logout"
            disabled={false}
            className="text-red-600"
          >
            ログアウト
          </MenuLink>
        </div>
      )}
    </div>
  );
}