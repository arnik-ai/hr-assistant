"use client";

import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Sparkles, FileText, Calculator, Scale, ShieldAlert, Menu } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import { sendMessage } from "@/lib/api";
import MessageBubble from "./MessageBubble";
import BackButton from "./BackButton";

const SUGGESTIONS = [
  { icon: Calculator, text: "اضافه‌کار ۱۰ ساعت با مزد مبنای ۱۲ میلیون چقدر می‌شود؟" },
  { icon: FileText, text: "یک قرارداد کار موقت سه‌ماهه برایم پیش‌نویس کن" },
  { icon: Scale, text: "اگر کارگر استعفا بدهد، چه مزایایی باید بپردازم؟" },
  { icon: ShieldAlert, text: "بند «انصراف از سنوات» در قرارداد قانونی است؟" },
];

export default function ChatUI({ onMenu }: { onMenu: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSend(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    setInput("");
    setLoading(true);

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: q };
    const pendingMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      pending: true,
    };
    setMessages((m) => [...m, userMsg, pendingMsg]);

    try {
      const res = await sendMessage(q);
      setMessages((m) =>
        m.map((msg) =>
          msg.id === pendingMsg.id
            ? { ...msg, content: res.answer, data: res, pending: false }
            : msg
        )
      );
    } catch {
      setMessages((m) =>
        m.map((msg) =>
          msg.id === pendingMsg.id
            ? { ...msg, content: "خطا در ارتباط با سرور. دوباره تلاش کنید.", pending: false }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full flex-1 flex-col">
      {/* هدر */}
      <header className="glass flex items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5">
        <div className="flex items-center gap-2.5">
          <BackButton />
          <button
            onClick={onMenu}
            aria-label="منو"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand-400/40 text-slate-300 transition hover:bg-white/10 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">گفتگو با دستیار</h2>
            <p className="text-[11px] text-slate-500">مبتنی بر قانون کار ایران</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-[11px] text-amber-300 ring-1 ring-amber-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse-dot" />
          نسخه نمایشی
        </div>
      </header>

      {/* ناحیه پیام‌ها */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="mx-auto max-w-3xl">
          {isEmpty ? (
            <WelcomeScreen onPick={handleSend} />
          ) : (
            <div className="flex flex-col gap-6">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <MessageBubble key={m.id} message={m} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* ورودی */}
      <div className="px-4 pb-5 md:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-end gap-2 rounded-3xl border-2 border-brand-400/60 bg-white p-2 shadow-glow-lg ring-1 ring-white/40 focus-within:border-brand-500">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
              rows={1}
              placeholder="سؤال خود را درباره‌ی حقوق، قرارداد یا قانون کار بنویسید…"
              className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || loading}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white transition enabled:hover:shadow-glow disabled:opacity-40"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-slate-600">
            پاسخ‌ها جنبه‌ی اطلاع‌رسانی دارند و جایگزین مشاوره‌ی حقوقی رسمی نیستند.
          </p>
        </div>
      </div>
    </div>
  );
}

function WelcomeScreen({ onPick }: { onPick: (t: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center pt-10 text-center"
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-400 to-fuchsia-500 shadow-glow-lg animate-float">
        <Sparkles className="h-8 w-8 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-gradient sm:text-4xl">دستیار هوشمند HR</h1>
      <p className="mt-2 text-sm font-medium tracking-[0.2em] text-slate-400">
        HR SMART ASSISTANT
      </p>

      <div className="mt-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map((s, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
            onClick={() => onPick(s.text)}
            className="glass group flex items-start gap-3 rounded-2xl p-4 text-right transition hover:border-brand-400/40 hover:bg-white/[0.07]"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300 transition group-hover:bg-brand-500/25">
              <s.icon className="h-[18px] w-[18px]" />
            </div>
            <span className="text-[13px] leading-6 text-slate-300">{s.text}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
