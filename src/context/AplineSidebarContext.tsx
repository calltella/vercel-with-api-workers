'use client';

import { createContext, useContext, useState } from 'react';

type SidebarContextType = {
  isOpen: boolean;
  toggle: () => void;
  setOpen: (v: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export function AplineSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, setOpen: setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useAplineSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useAplineSidebar must be used within Provider');
  return ctx;
}