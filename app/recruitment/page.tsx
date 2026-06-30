"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  type JobPosting,
  type Candidate,
  type Interview,
  type JDResult,
  type ScreenResult,
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
        <p className="mb-6 text-sm text-slate-400">
          آگهی‌ها، نامزدها، مصاحبه‌ها و ابزارهای هوشمند
        </p>

        {/* تب‌ها */}
        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex items-center gap-2 rounded-2xl border px-4 py-2 text-[13px] transition",
                tab === t.key
                  ? "border-brand-400/60 bg-white/10 text-white"
                  : "border-white/10 text-slate-400 hover:bg-white/5",
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

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="mb-4 flex items-center gap-2 rounded-2xl bg-amber-500/10 px-4 py-3 text-[13px] text-amber-300 ring-1 ring-amber-500/20">
      <AlertCircle className="h-4 w-4 shrink-0" />
      {msg} — <Link href="/login" className="underline">ورود</Link>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass rounded-3xl border border-brand-400/40 p-5">{children}</div>
  );
}

// ---------- تب آگهی‌ها ----------
function JobsTab() {
  const [items, setItems] = useState<JobPosting[]>([]);
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setItems(await listJobs());
      setErr(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "خطا");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await createJob({ title, department: department || undefined });
      setTitle("");
      setDepartment("");
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "خطا");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {err && <ErrorBox msg={err} />}
      <Panel>
        <form onSubmit={add} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان شغل *" required className={inputCls} />
          <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="واحد" className={inputCls} />
          <button type="submit" disabled={saving || !title} className={btnCls}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            ثبت آگهی
          </button>
        </form>
      </Panel>
      <Panel>
        {loading ? (
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
  const [items, setItems] = useState<Candidate[]>([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setItems(await listCandidates());
      setErr(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "خطا");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await createCandidate({ full_name: fullName, email: email || undefined });
      setFullName("");
      setEmail("");
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "خطا");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {err && <ErrorBox msg={err} />}
      <Panel>
        <form onSubmit={add} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="نام نامزد *" required className={inputCls} />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ایمیل" className={inputCls} />
          <button type="submit" disabled={saving || !fullName} className={btnCls}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            افزودن نامزد
          </button>
        </form>
      </Panel>
      <Panel>
        {loading ? (
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
  const [items, setItems] = useState<Interview[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [candidateId, setCandidateId] = useState("");
  const [when, setWhen] = useState("");
  const [interviewer, setInterviewer] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [iv, cs] = await Promise.all([listInterviews(), listCandidates()]);
      setItems(iv);
      setCandidates(cs);
      setErr(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "خطا");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await createInterview({
        candidate_id: candidateId,
        scheduled_at: new Date(when).toISOString(),
        interviewer: interviewer || undefined,
      });
      setWhen("");
      setInterviewer("");
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "خطا");
    } finally {
      setSaving(false);
    }
  }

  const nameOf = (id: string) =>
    candidates.find((c) => c.id === id)?.full_name ?? "نامزد";

  return (
    <div className="flex flex-col gap-4">
      {err && <ErrorBox msg={err} />}
      <Panel>
        <form onSubmit={add} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <select value={candidateId} onChange={(e) => setCandidateId(e.target.value)} required className={inputCls}>
            <option value="">انتخاب نامزد *</option>
            {candidates.map((c) => (
              <option key={c.id} value={c.id}>{c.full_name}</option>
            ))}
          </select>
          <PersianDateTimePicker value={when} onChange={setWhen} placeholder="تاریخ و ساعت مصاحبه *" />
          <input value={interviewer} onChange={(e) => setInterviewer(e.target.value)} placeholder="مصاحبه‌کننده" className={inputCls} />
          <button type="submit" disabled={saving || !candidateId || !when} className={btnCls}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarClock className="h-4 w-4" />}
            زمان‌بندی مصاحبه
          </button>
        </form>
      </Panel>
      <Panel>
        {loading ? (
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
  const [result, setResult] = useState<JDResult | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      setResult(await generateJD({ title, department: department || undefined, seniority: seniority || undefined }));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "خطا");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Panel>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-300">
        <FileText className="h-4 w-4" /> تولید شرح وظایف با هوش مصنوعی
      </div>
      <form onSubmit={run} className="flex flex-col gap-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان شغل *" required className={inputCls} />
        <div className="grid grid-cols-2 gap-3">
          <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="واحد" className={inputCls} />
          <input value={seniority} onChange={(e) => setSeniority(e.target.value)} placeholder="سطح (جونیور/ارشد)" className={inputCls} />
        </div>
        <button type="submit" disabled={loading || !title} className={btnCls}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          تولید
        </button>
      </form>
      {err && <p className="mt-3 text-[13px] text-amber-300">{err}</p>}
      {result && (
        <div className="mt-4 flex flex-col gap-3 text-[13px] leading-7 text-slate-300">
          <div>
            <p className="mb-1 font-semibold text-slate-200">شرح وظایف:</p>
            <p className="whitespace-pre-wrap rounded-xl bg-white/[0.03] p-3">{result.description}</p>
          </div>
          <div>
            <p className="mb-1 font-semibold text-slate-200">شرایط احراز:</p>
            <p className="whitespace-pre-wrap rounded-xl bg-white/[0.03] p-3">{result.requirements}</p>
          </div>
        </div>
      )}
    </Panel>
  );
}

function ScreenResumeCard() {
  const [resume, setResume] = useState("");
  const [requirements, setRequirements] = useState("");
  const [result, setResult] = useState<ScreenResult | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      setResult(await screenResume({ resume_text: resume, requirements }));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "خطا");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Panel>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-300">
        <ClipboardCheck className="h-4 w-4" /> غربالگری رزومه با هوش مصنوعی
      </div>
      <form onSubmit={run} className="flex flex-col gap-3">
        <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder="شرایط شغل *" required rows={2} className={inputCls} />
        <textarea value={resume} onChange={(e) => setResume(e.target.value)} placeholder="متن رزومه *" required rows={4} className={inputCls} />
        <button type="submit" disabled={loading || !resume || !requirements} className={btnCls}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ClipboardCheck className="h-4 w-4" />}
          غربالگری
        </button>
      </form>
      {err && <p className="mt-3 text-[13px] text-amber-300">{err}</p>}
      {result && (
        <div className="mt-4 flex flex-col gap-2 text-[13px] text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-emerald-400">{result.score}</span>
            <span className="text-slate-400">/ ۱۰۰</span>
          </div>
          <p className="whitespace-pre-wrap rounded-xl bg-white/[0.03] p-3">{result.summary}</p>
          {result.strengths.length > 0 && (
            <p className="text-emerald-300">نقاط قوت: {result.strengths.join("، ")}</p>
          )}
          {result.gaps.length > 0 && (
            <p className="text-amber-300">شکاف‌ها: {result.gaps.join("، ")}</p>
          )}
        </div>
      )}
    </Panel>
  );
}

// ---------- کمکی ----------
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
