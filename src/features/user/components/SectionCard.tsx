// src/features/user/components/SectionCard.tsx

"use client";

type SectionCardProps = {
  children: React.ReactNode;
  className?: string;
};

/** セクションカード */
export function SectionCard({
  children,
  className = "",
}: SectionCardProps) {
  return (
    <div className={`rounded-xl border p-5 ${className}`}>
      {children}
    </div>
  );
}