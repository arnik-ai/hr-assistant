import Sidebar from "@/components/Sidebar";
import ChatUI from "@/components/ChatUI";

export default function Home() {
  return (
    <main className="flex h-screen w-screen gap-3 p-3">
      <Sidebar />
      <div className="glass flex flex-1 overflow-hidden rounded-3xl border border-brand-400/50">
        <ChatUI />
      </div>
    </main>
  );
}
