"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import ChatUI from "./ChatUI";

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="flex h-[100dvh] w-screen gap-2 p-2 sm:gap-3 sm:p-3">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="glass flex flex-1 overflow-hidden rounded-2xl border border-brand-400/50 sm:rounded-3xl">
        <ChatUI onMenu={() => setSidebarOpen(true)} />
      </div>
    </main>
  );
}
