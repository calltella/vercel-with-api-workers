'use client';


/**
 * 利用レイアウト
 * 
 */
import { useEffect, useState } from 'react';
import {
  Menu,
  LayoutDashboard,
  FileText,
  Star,
  Settings,
  Bell,
  MonitorOff,
  UserPen,
  Plus,
  Search,
  ChevronDown,
  Download,
  LockKeyhole,
  LockKeyholeOpen,
  NotebookText,
} from 'lucide-react';
import clsx from 'clsx';
import { useRouter, useSearchParams } from "next/navigation";
import { useBadge } from '@/src/context/BadgeContext';
import { useAplineSidebar } from '@/src/context/AplineSidebarContext';
import { parseAplineParams, updateSearchParams } from "@/lib/parse/parseAplineParams";
import { Input } from '@headlessui/react'

const PIN_KEY = 'sidebar:pinned';

export function Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { toggle } = useAplineSidebar();

  const [isPinnedOpen, setIsPinnedOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // セクション開閉
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    main: true,
    filter: true,
    other: true,
  });

  const isExpanded = isPinnedOpen || isHovering;
  const initial = searchParams.get("keyword") ?? "";
  const [value, setValue] = useState(initial);
  const isUnread = searchParams.get("unread") === "true";
  const inComplete = searchParams.get("incomplete") === "true";

  const { badge } = useBadge();

  // ✅ localStorage 読み込み
  useEffect(() => {
    const saved = localStorage.getItem(PIN_KEY);
    if (saved === 'true') setIsPinnedOpen(true);
  }, []);

  // ✅ localStorage 保存
  useEffect(() => {
    localStorage.setItem(PIN_KEY, String(isPinnedOpen));
  }, [isPinnedOpen]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div
      className={clsx(
        'h-screen z-50 flex flex-col pt-16 border-r border-(--color-secondary) transition-all duration-300',
        isExpanded ? 'w-40' : 'w-12'
      )}
      onMouseEnter={() => {
        if (!isPinnedOpen) setIsHovering(true);
      }}
      onMouseLeave={() => {
        if (!isPinnedOpen) setIsHovering(false);
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-(--color-secondary)">
        {isExpanded && (
          <span className="font-bold text-lg whitespace-nowrap">
            Apline
          </span>
        )}
        <Menu className="w-5 h-5" />
      </div>

      <div className="flex-1 pt-2 space-y-2 overflow-y-auto">
        {isPinnedOpen ? (
          <SidebarItem
            icon={<LockKeyhole className=" stroke-yellow-500 fill-transparent" />}
            label="メニューロック解除"
            isExpanded={isExpanded}
            onClick={() => setIsPinnedOpen((prev) => !prev)}
          />
        ) : (
          <SidebarItem
            icon={<LockKeyholeOpen className="stroke-gray-500" />}
            label="メニューロック"
            isExpanded={isExpanded}
            onClick={() => setIsPinnedOpen((prev) => !prev)}
          />
        )}
        <hr className='border-(--color-secondary) mx-2' />

        {/* ===== セクション: メイン ===== */}
        <Section
          title="メニュー"
          isExpanded={isExpanded}
          isOpen={openSections.main}
          onToggle={() => toggleSection('main')}
        >
          <SidebarItem
            icon={<Plus />}
            label="新規登録"
            isExpanded={isExpanded}
            onClick={() => { router.push(`/apline/create`); }}
          />
          <SidebarItem icon={<NotebookText />} label="下書き" isExpanded={isExpanded} />

          <SidebarItem icon={<Download />} label="エクスポート" isExpanded={isExpanded} />
        </Section>
        <hr className='border-(--color-secondary) mx-2' />

        {/* ===== セクション: フィルタ ===== */}
        <Section
          title="フィルタ"
          isExpanded={isExpanded}
          isOpen={openSections.filter}
          onToggle={() => toggleSection('filter')}
        >
          <SidebarItem
            icon={<LayoutDashboard />}
            label="全件表示"
            isExpanded={isExpanded}
            onClick={() => {
              const params = updateSearchParams(
                searchParams,
                {
                  unread: null,
                  incomplete: null,
                  category: null,
                },
                ["page"]
              );

              router.push(`?${params.toString()}`);
            }}
          />
          <SidebarItem
            icon={<Search />}
            label="検索"
            isExpanded={isExpanded}
            onClick={toggle}
          />
          <div className="px-2">
            <Input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="検索"
              className="
              w-full rounded-md
              border border-zinc-300 dark:border-zinc-600
              bg-white dark:bg-zinc-800
              px-2 py-1.5 text-sm text-zinc-700 dark:text-zinc-200
              placeholder:text-zinc-400 outline-none transition
              focus:border-blue-500 focus:ring-1 focus:ring-blue-500
            "
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("keyword", value);
                  router.push(`?${params.toString()}`);
                }
              }}
            />
          </div>
          <SidebarItem
            icon={<Bell />}
            label="未読"
            badge={badge.unreadCount}
            isExpanded={isExpanded}
            active={isUnread}
            onClick={() => {
              const params = updateSearchParams(
                searchParams,
                {
                  unread: searchParams.get("unread") === "true" ? null : "true",
                },
                ["incomplete", "page", "category"]
              );

              router.push(`?${params.toString()}`);
            }}
          />

          <SidebarItem
            icon={<FileText />}
            label="未完了"
            badge={badge.incompleteCount}
            isExpanded={isExpanded}
            active={inComplete}
            onClick={() => {
              const params = updateSearchParams(
                searchParams,
                {
                  incomplete: searchParams.get("incomplete") === "true" ? null : "true",
                },
                ["unread", "page", "category"]
              );

              router.push(`?${params.toString()}`);
            }}
          />

          <SidebarItem
            icon={<Star />}
            label="お気に入り"
            isExpanded={isExpanded}
            onClick={() => { router.push(`/apline/favorites`); }}
          />


        </Section>
        <hr className='border-(--color-secondary) mx-2' />

        {/* ===== セクション: その他 ===== */}
        <Section
          title="その他"
          isExpanded={isExpanded}
          isOpen={openSections.other}
          onToggle={() => toggleSection('other')}
        >

          <SidebarItem
            icon={<MonitorOff />}
            label="監視業務以外"
            isExpanded={isExpanded}
            active={searchParams.get("category") === "non-monitoring"}
            onClick={() => {
              const params = updateSearchParams(
                searchParams,
                {
                  category:
                    searchParams.get("category") === "non-monitoring"
                      ? null
                      : "non-monitoring",
                },
                ["unread", "page", "incomplete"]
              );

              router.push(`?${params.toString()}`);
            }}
          />

          <SidebarItem icon={<UserPen />} label="マイ受付案件" isExpanded={isExpanded} />
        </Section>
      </div>


      {/* 下部 */}
      <div className="p-2 border-t border-(--color-secondary)">
        <SidebarItem icon={<Settings />} label="設定" isExpanded={isExpanded} />
      </div>
    </div>
  );
}

/* =========================
   Section Component
========================= */
function Section({
  title,
  isExpanded,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isExpanded: boolean;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* タイトル */}
      {isExpanded && (
        <div
          onClick={onToggle}
          className="flex items-center justify-between px-2 py-1 text-xs text-gray-400 cursor-pointer"
        >
          <span>{title}</span>
          <ChevronDown
            className={clsx(
              "w-4 h-4 transition",
              isOpen ? "rotate-0" : "-rotate-90"
            )}
          />
        </div>
      )}

      {/* 中身 */}
      <div className={clsx(!isOpen && "hidden")}>
        {children}
      </div>
    </div>
  );
}

/* =========================
   Sidebar Item
========================= */
function SidebarItem({
  icon,
  label,
  badge,
  isExpanded,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: number | null;
  isExpanded: boolean;
  onClick?: () => void;
  active?: boolean;
}) {
  const hasBadge = (badge ?? 0) > 0;

  return (
    <div
      onClick={onClick}
      className={clsx(
        'relative flex items-center rounded-lg cursor-pointer transition-all duration-200',
        isExpanded ? 'justify-between px-2 py-1.5' : 'justify-center py-1.5',
        active
          ? 'bg-(--color-secondary)'
          : 'hover:bg-(--color-primary)'
      )}
    >
      <div className={clsx('flex items-center', isExpanded ? 'gap-2' : '')}>
        <div className="relative flex items-center justify-center w-5 h-5">
          {icon}

          {!isExpanded && hasBadge && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] px-1 rounded-full min-w-4 text-center">
              {badge}
            </span>
          )}
        </div>

        <span
          className={clsx(
            'text-sm whitespace-nowrap transition-all duration-200',
            isExpanded
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 absolute'
          )}
        >
          {label}
        </span>
      </div>

      {isExpanded && hasBadge && (
        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full min-w-5 text-center">
          {badge}
        </span>
      )}
    </div>
  );
}