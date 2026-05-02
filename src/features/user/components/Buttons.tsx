"use client";

import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset"; // デフォルトは "button" にする
}

/** アウトラインボタン */
export function OutlineButton({
  children,
  onClick,
  className = "",
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-95 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 ${className}`}
    >
      {children}
    </button>
  );
}

/** プライマリボタン */
export function PrimaryButton({
  children,
  onClick,
  className = "",
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}

/** ワーニングボタン（注意） */
export function WarningButton({
  children,
  onClick,
  className = "",
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600 active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}

/** デンジャーボタン */
interface DangerButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function DangerButton({
  children,
  onClick,
  type = "button",
}: DangerButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-600 active:scale-95"
    >
      {children}
    </button>
  );
}