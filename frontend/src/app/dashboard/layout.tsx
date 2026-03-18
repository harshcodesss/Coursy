"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-white">
      
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-800/50 bg-zinc-950 px-4 md:hidden">
          <button 
            onClick={() => setIsMobileOpen(true)} 
            className="rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <span className="font-semibold text-zinc-100">Coursy</span>
          <div className="w-10" />
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}