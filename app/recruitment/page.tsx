"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Briefcase,
  Users,
  CalendarClock,
  Sparkles,
  Plus,
  Loader2,
  AlertCircle,
  FileText,
  ClipboardCheck,
} from "lucide-react";
import AppNav from "@/components/AppNav";
import PersianDateTimePicker from "@/components/PersianDateTimePicker";
import { useAuthGuard } from "@/lib/authGuard";
import {
  listJobs,
  createJob,
  listCandidates,
  createCandidate,
  listInterviews,
  createInterview,
  generateJD,
  screenResume,
} from "@/lib/recruitment";
import { cn } from "@/lib/utils";

type Tab = "jobs" | "candidates" | "interviews" | "ai";

const TABS: { key: Tab; label: string; icon: typeof Briefcase }[] = [
  { key: "jobs", label: "آگهی‌ها", icon: Briefcase },
  { key: "candidates", label: "نامزدها", icon: Users },
  { key: "interviews", label: "مصاحبه‌ها", icon: CalendarClock },
  { key: "ai", label: "ابزار هوش مصنوعی", icon: Sparkles },
];

const inputCls =
  "w-full rounded-2xl border-2 border-brand-400/40 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand-500";
const btnCls =
  "flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-brand-600 to-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition enabled:hover:shadow-glow-lg disabled:opacity-50";

export default function RecruitmentPage() {
  const ready = useAuthGuard();
  const [tab, setTab] = useState<Tab>("jobs");

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppNav />
      <main className="mx-auto w-full max-w-5xl flex-1 p-4 md:p-8">
        <h1 className="mb-1 text-2xl font-bold text-slate-100">جذب و استخدام</h1>
        <p className="mb-6 text-sm text-slate-400">آگهی‌ها، نامزدها، مصاحبه‌ها و ابزارهای هوشمند</p>

        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex items-center gap-2 rounded-2xl border px-4 py-2 text-[13px] transition",
                tab === t.key ? "border-brand-400/60 bg-white/10 text-white" : "border-white/10 text-slate-400 hover:bg-white/5",
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === "jobs" && <JobsTab />}
        {tab === "candidates" && <CandidatesTab />}
        {tab === "interviews" && <InterviewsTab />}
        {tab === "ai" && <AITab />}
      </main>
    </div>
  );
}

function ErrorBox() {
  return (
    <div className="mb-4 flex items-center gap-2 rounded-2xl bg-amber-500/10 px-4 py-3 text-[13px] text-amber-300 ring-1 ring-amber-500/20">
      <AlertCircle className="h-4 w-4 shrink-0" />
      برای دیدن اطلاعات ابتدا وارد شوید — <Link href="/login" className="underline">ورود</Link>
    </div>
  );
}
function Panel({ children }: { children: React.ReactNode }) {
  return <div className="glass rounded-3xl border border-brand-400/40 p-5">{children}</div>;
}
function Loading() {
  return (
    <div className="flex items-center justify-center gap-2 p-8 text-slate-400">
      <Loader2 className="h-5 w-5 animate-spin" /> در حال بارگذاری…
    </div>
  );
}
function Empty({ icon: Icon, text }: { icon: typeof Briefcase; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 p-10 text-center text-slate-400">
      <Icon className="h-9 w-9 opacity-40" />
      {text}
    </div>
  );
}

// ---------- تب آگهی‌ها ----------
function JobsTab() {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const { data: items = [], isLoading, isError } = useQuery({ queryKey: ["jobs"], queryFn: listJobs });
  const mut = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      setTitle("");
      setDepartment("");
    },
  });

  return (
    <div className="flex flex-col gap-4">
      {isError && <ErrorBox />}
      <Panel>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mut.mutate({ title, department: department || undefined });
          }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان شغل *" required className={inputCls} />
          <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="واحد" className={inputCls} />
          <button type="submit" disabled={mut.isPending || !title} className={btnCls}>
            {mut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            ثبت آگهی
          </button>
        </form>
      </Panel>
      <Panel>
        {isLoading ? (
          <Loading />
        ) : items.length === 0 ? (
          <Empty icon={Briefcase} text="هنوز آگهی‌ای ثبت نشده." />
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((j) => (
              <li key={j.id} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3">
                <div>
                  <p className="font-medium text-slate-100">{j.title}</p>
                  <p className="text-[12px] text-slate-400">{j.department ?? "—"}</p>
                </div>
                <span className="rounded-full bg-brand-500/15 px-2.5 py-1 text-[11px] text-brand-300">
                  {j.status === "open" ? "باز" : j.status === "closed" ? "بسته" : "پیش‌نویس"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

// ---------- تب نامزدها ----------
function CandidatesTab() {
  const qc = useQueryClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const { data: items = [], isLoading, isError } = useQuery({ queryKey: ["candidates"], queryFn: listCandidates });
  const mut = useMutation({
    mutationFn: createCandidate,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["candidates"] });
      setFullName("");
      setEmail("");
    },
  });

  return (
    <div className="flex flex-col gap-4">
      {isError && <ErrorBox />}
      <Panel>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mut.mutate({ full_name: fullName, email: email || undefined });
          }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="نام نامزد *" required className={inputCls} />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ایمیل" className={inputCls} />
          <button type="submit" disabled={mut.isPending || !fullName} className={btnCls}>
            {mut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            افزودن نامزد
          </button>
        </form>
      </Panel>
      <Panel>
        {isLoading ? (
          <Loading />
        ) : items.length === 0 ? (
          <Empty icon={Users} text="هنوز نامزدی ثبت نشده." />
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((c) => (
              <li key={c.id} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3">
                <div>
                  <p className="font-medium text-slate-100">{c.full_name}</p>
                  <p className="text-[12px] text-slate-400">{c.email ?? "—"}</p>
                </div>
                <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-slate-300">
                  {c.score != null ? `نمره: ${c.score}` : c.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

// ---------- تب مصاحبه‌ها ----------
function InterviewsTab() {
  const qc = useQueryClient();
  const [candidateId, setCandidateId] = useState("");
  const [when, setWhen] = useState("");
  const [interviewer, setInterviewer] = useState("");
  const { data: items = [], isLoading, isError } = useQuery({ queryKey: ["interviews"], queryFn: listInterviews });
  const { data: candidates = [] } = useQuery({ queryKey: ["candidates"], queryFn: listCandidates });
  const mut = useMutation({
    mutationFn: createInterview,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["interviews"] });
      setWhen("");
      setInterviewer("");
    },
  });

  const nameOf = (id: string) => candidates.find((c) => c.id === id)?.full_name ?? "نامزد";

  return (
    <div className="flex flex-col gap-4">
      {isError && <ErrorBox />}
      <Panel>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mut.mutate({ candidate_id: candidateId, scheduled_at: when, interviewer: interviewer || undefined });
          }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <select value={candidateId} onChange={(e) => setCandidateId(e.target.value)} required className={inputCls}>
            <option value="">انتخاب نامزد *</option>
            {candidates.map((c) => (
              <option key={c.id} value={c.id}>{c.full_name}</option>
            ))}
          </select>
          <PersianDateTimePicker value={when} onChange={setWhen} placeholder="تاریخ و ساعت مصاحبه *" />
          <input value={interviewer} onChange={(e) => setInterviewer(e.target.value)} placeholder="مصاحبه‌کننده" className={inputCls} />
          <button type="submit" disabled={mut.isPending || !candidateId || !when} className={btnCls}>
            {mut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarClock className="h-4 w-4" />}
            زمان‌بندی مصاحبه
          </button>
        </form>
      </Panel>
      <Panel>
        {isLoading ? (
          <Loading />
        ) : items.length === 0 ? (
          <Empty icon={CalendarClock} text="مصاحبه‌ای زمان‌بندی نشده." />
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((iv) => (
              <li key={iv.id} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3">
                <div>
                  <p className="font-medium text-slate-100">{nameOf(iv.candidate_id)}</p>
                  <p className="text-[12px] text-slate-400">
                    {new Date(iv.scheduled_at).toLocaleString("fa-IR")} · {iv.mode === "online" ? "آنلاین" : "حضوری"}
                  </p>
                </div>
                <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-slate-300">{iv.status}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

// ---------- تب هوش مصنوعی ----------
function AITab() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <GenerateJDCard />
      <ScreenResumeCard />
    </div>
  );
}

function GenerateJDCard() {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [seniority, setSeniority] = useState("");
  const mut = useMutation({ mutationFn: generateJD });

  return (
    <Panel>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-300">
        <FileText className="h-4 w-4" /> تولید شرح وظایف با هوش مصنوعی
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mut.mutate({ title, department: department || undefined, seniority: seniority || undefined });
        }}
        className="flex flex-col gap-3"
      >
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان شغل *" required className={inputCls} />
        <div className="grid grid-cols-2 gap-3">
          <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="واحد" className={inputCls} />
          <input value={seniority} onChange={(e) => setSeniority(e.target.value)} placeholder="سطح (جونیور/ارشد)" className={inputCls} />
        </div>
        <button type="submit" disabled={mut.isPending || !title} className={btnCls}>
          {mut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          تولید
        </button>
      </form>
      {mut.isError && <p className="mt-3 text-[13px] text-amber-300">اتصال به سرویس هوش مصنوعی برقرار نشد.</p>}
      {mut.data && (
        <div className="mt-4 flex flex-col gap-3 text-[13px] leading-7 text-slate-300">
          <div>
            <p className="mb-1 font-semibold text-slate-200">شرح وظایف:</p>
            <p className="whitespace-pre-wrap rounded-xl bg-white/[0.03] p-3">{mut.data.description}</p>
          </div>
          <div>
            <p className="mb-1 font-semibold text-slate-200">شرایط احراز:</p>
            <p className="whitespace-pre-wrap rounded-xl bg-white/[0.03] p-3">{mut.data.requirements}</p>
          </div>
        </div>
      )}
    </Panel>
  );
}

function ScreenResumeCard() {
  const [resume, setResume] = useState("");
  const [requirements, setRequirements] = useState("");
  const mut = useMutation({ mutationFn: screenResume });

  return (
    <Panel>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-300">
        <ClipboardCheck className="h-4 w-4" /> غربالگری رزومه با هوش مصنوعی
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mut.mutate({ resume_text: resume, requirements });
        }}
        className="flex flex-col gap-3"
      >
        <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder="شرایط شغل *" required rows={2} className={inputCls} />
        <textarea value={resume} onChange={(e) => setResume(e.target.value)} placeholder="متن رزومه *" required rows={4} className={inputCls} />
        <button type="submit" disabled={mut.isPending || !resume || !requirements} className={btnCls}>
          {mut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ClipboardCheck className="h-4 w-4" />}
          غربالگری
        </button>
      </form>
      {mut.isError && <p className="mt-3 text-[13px] text-amber-300">اتصال به سرویس هوش مصنوعی برقرار نشد.</p>}
      {mut.data && (
        <div className="mt-4 flex flex-col gap-2 text-[13px] text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-emerald-400">{mut.data.score}</span>
            <span className="text-slate-400">/ ۱۰۰</span>
          </div>
          <p className="whitespace-pre-wrap rounded-xl bg-white/[0.03] p-3">{mut.data.summary}</p>
          {mut.data.strengths.length > 0 && <p className="text-emerald-300">نقاط قوت: {mut.data.strengths.join("، ")}</p>}
          {mut.data.gaps.length > 0 && <p className="text-amber-300">شکاف‌ها: {mut.data.gaps.join("، ")}</p>}
        </div>
      )}
    </Panel>
  );
}
