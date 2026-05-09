'use client';

import { createContext, useContext, useState } from 'react';

type Badge = {
  unreadCount: number;
  incompleteCount: number;
};

const BadgeContext = createContext<{
  badge: Badge;
  setBadge: React.Dispatch<React.SetStateAction<Badge>>;
} | null>(null);

export function BadgeProvider({
  initialBadge,
  children,
}: {
  initialBadge: Badge;
  children: React.ReactNode;
}) {
  const [badge, setBadge] = useState(initialBadge);

  return (
    <BadgeContext.Provider value={{ badge, setBadge }}>
      {children}
    </BadgeContext.Provider>
  );
}

export function useBadge() {
  const ctx = useContext(BadgeContext);
  if (!ctx) throw new Error('useBadge must be used within BadgeProvider');
  return ctx;
}