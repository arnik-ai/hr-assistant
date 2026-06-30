// ارتباط فرانت با ماژول جذب و استخدام بک‌اند
import { getAccessToken } from "./auth";

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

// ---------- آگهی شغل ----------
export async function listJobs(): Promise<JobPosting[]> {
  return jsonOrThrow(await fetch(`${REC}/job-postings`, { headers: headers() }));
}
export async function createJob(data: {
  title: string;
  department?: string;
  status?: string;
}): Promise<JobPosting> {
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
  return jsonOrThrow(await fetch(`${REC}/candidates`, { headers: headers() }));
}
export async function createCandidate(data: {
  full_name: string;
  email?: string;
  job_posting_id?: string;
}): Promise<Candidate> {
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
  return jsonOrThrow(await fetch(`${REC}/interviews`, { headers: headers() }));
}
export async function createInterview(data: {
  candidate_id: string;
  scheduled_at: string;
  interviewer?: string;
  mode?: string;
}): Promise<Interview> {
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
  return jsonOrThrow(
    await fetch(`${REC}/ai/screen-resume`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    }),
  );
}
