// ارتباط فرانت با ماژول جذب و استخدام بک‌اند
import { getAccessToken } from "./auth";
import { DEMO } from "./config";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";
const REC = `${API_BASE}/api/v1/recruitment`;

function headers(): HeadersInit {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function jsonOrThrow(res: Response) {
  if (res.status === 401) throw new Error("ابتدا وارد حساب شوید");
  if (!res.ok) {
    let msg = "خطا در ارتباط با سرور";
    try {
      const d = await res.json();
      if (typeof d.detail === "string") msg = d.detail;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

// ---------- انواع ----------
export interface JobPosting {
  id: string;
  title: string;
  department?: string | null;
  description?: string | null;
  requirements?: string | null;
  status: string;
}

export interface Candidate {
  id: string;
  job_posting_id?: string | null;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  status: string;
  score?: number | null;
  notes?: string | null;
}

export interface Interview {
  id: string;
  candidate_id: string;
  scheduled_at: string;
  interviewer?: string | null;
  mode: string;
  status: string;
}

// ----- داده‌ی نمونه برای حالت نمایشی -----
let demoJobs: JobPosting[] = [
  { id: "j1", title: "کارشناس بازاریابی دیجیتال", department: "مارکتینگ", description: null, requirements: null, status: "open" },
  { id: "j2", title: "برنامه‌نویس بک‌اند", department: "فناوری اطلاعات", description: null, requirements: null, status: "open" },
];
let demoCandidates: Candidate[] = [
  { id: "c1", job_posting_id: "j1", full_name: "رضا نوری", email: "reza@example.com", phone: null, status: "screening", score: 82, notes: null },
  { id: "c2", job_posting_id: "j2", full_name: "سارا رستمی", email: null, phone: null, status: "interview", score: null, notes: null },
];
let demoInterviews: Interview[] = [
  { id: "i1", candidate_id: "c2", scheduled_at: "2026-07-15T07:00:00.000Z", interviewer: "مدیر فنی", mode: "online", status: "scheduled" },
];

// ---------- آگهی شغل ----------
export async function listJobs(): Promise<JobPosting[]> {
  if (DEMO) return [...demoJobs];
  return jsonOrThrow(await fetch(`${REC}/job-postings`, { headers: headers() }));
}
export async function createJob(data: {
  title: string;
  department?: string;
  status?: string;
}): Promise<JobPosting> {
  if (DEMO) {
    const job: JobPosting = { id: "j" + (demoJobs.length + 1), title: data.title, department: data.department ?? null, description: null, requirements: null, status: "open" };
    demoJobs = [job, ...demoJobs];
    return job;
  }
  return jsonOrThrow(
    await fetch(`${REC}/job-postings`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    }),
  );
}

// ---------- نامزد ----------
export async function listCandidates(): Promise<Candidate[]> {
  if (DEMO) return [...demoCandidates];
  return jsonOrThrow(await fetch(`${REC}/candidates`, { headers: headers() }));
}
export async function createCandidate(data: {
  full_name: string;
  email?: string;
  job_posting_id?: string;
}): Promise<Candidate> {
  if (DEMO) {
    const cand: Candidate = { id: "c" + (demoCandidates.length + 1), job_posting_id: data.job_posting_id ?? null, full_name: data.full_name, email: data.email ?? null, phone: null, status: "new", score: null, notes: null };
    demoCandidates = [cand, ...demoCandidates];
    return cand;
  }
  return jsonOrThrow(
    await fetch(`${REC}/candidates`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    }),
  );
}

// ---------- مصاحبه ----------
export async function listInterviews(): Promise<Interview[]> {
  if (DEMO) return [...demoInterviews];
  return jsonOrThrow(await fetch(`${REC}/interviews`, { headers: headers() }));
}
export async function createInterview(data: {
  candidate_id: string;
  scheduled_at: string;
  interviewer?: string;
  mode?: string;
}): Promise<Interview> {
  if (DEMO) {
    const iv: Interview = { id: "i" + (demoInterviews.length + 1), candidate_id: data.candidate_id, scheduled_at: data.scheduled_at, interviewer: data.interviewer ?? null, mode: data.mode ?? "in_person", status: "scheduled" };
    demoInterviews = [iv, ...demoInterviews];
    return iv;
  }
  return jsonOrThrow(
    await fetch(`${REC}/interviews`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    }),
  );
}

// ---------- هوش مصنوعی ----------
export interface JDResult {
  description: string;
  requirements: string;
}
export async function generateJD(data: {
  title: string;
  department?: string;
  seniority?: string;
}): Promise<JDResult> {
  if (DEMO) {
    await new Promise((r) => setTimeout(r, 800));
    return {
      description:
        `مسئولیت‌های «${data.title}»: برنامه‌ریزی و اجرای وظایف مرتبط، همکاری با سایر واحدها، ` +
        "تهیه‌ی گزارش‌های دوره‌ای، و بهبود مستمر فرایندها مطابق با اهداف سازمان. (نمونه)",
      requirements:
        "مدرک کارشناسی مرتبط، حداقل ۲ سال سابقه، مهارت‌های ارتباطی قوی، آشنایی با ابزارهای تخصصی حوزه، و روحیه‌ی کار تیمی. (نمونه)",
    };
  }
  return jsonOrThrow(
    await fetch(`${REC}/ai/generate-jd`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    }),
  );
}

export interface ScreenResult {
  score: number;
  summary: string;
  strengths: string[];
  gaps: string[];
}
export async function screenResume(data: {
  resume_text: string;
  requirements: string;
}): Promise<ScreenResult> {
  if (DEMO) {
    await new Promise((r) => setTimeout(r, 900));
    return {
      score: 78,
      summary:
        "این رزومه تطابق خوبی با شرایط شغل دارد؛ تجربه‌ی مرتبط و مهارت‌های کلیدی موجود است، اما در یک حوزه نیاز به توسعه دیده می‌شود. (نمونه)",
      strengths: ["سابقه‌ی کاری مرتبط", "تسلط بر ابزارهای تخصصی"],
      gaps: ["نبود گواهی‌نامه‌ی تخصصی مرتبط"],
    };
  }
  return jsonOrThrow(
    await fetch(`${REC}/ai/screen-resume`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    }),
  );
}
