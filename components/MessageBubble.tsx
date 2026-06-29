"use client";

import { motion } from "framer-motion";
import { Sparkles, User } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import RiskPanel from "./RiskPanel";

export default function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* آواتار */}
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl",
          isUser
            ? "bg-gradient-to-br from-emerald-400 to-teal-500"
            : "bg-gradient-to-br from-brand-400 to-fuchsia-500 shadow-glow"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Sparkles className="h-4 w-4 text-white" />
        )}
      </div>

      {/* محتوای پیام */}
      <div className={cn("flex max-w-[78%] flex-col", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-3xl px-4 py-3 text-[15px] leading-7",
            isUser
              ? "bg-gradient-to-l from-brand-600 to-brand-500 text-white"
              : "glass-strong text-slate-100"
          )}
        >
          {message.pending ? (
            <TypingDots />
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        {/* پنل ریسک و جزئیات — فقط برای دستیار */}
        {!isUser && message.data && !message.pending && (
          <RiskPanel data={message.data} />
        )}
      </div>
    </motion.div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-brand-300 animate-pulse-dot"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}
