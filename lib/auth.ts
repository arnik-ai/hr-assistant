// ارتباط فرانت با ماژول احراز هویت بک‌اند (FastAPI)

import { DEMO } from "./config";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

const DEMO_TOKENS: TokenResponse = {
  access_token: "demo",
  refresh_token: "demo",
  token_type: "bearer",
};

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface RegisterPayload {
  organization_name: string;
  full_name: string;
  email: string;
  password: string;
}

const ACCESS = "hr_access_token";
const REFRESH = "hr_refresh_token";

function saveTokens(t: TokenResponse) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS, t.access_token);
  localStorage.setItem(REFRESH, t.refresh_token);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS);
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(REFRESH);
}

export function isLoggedIn(): boolean {
  return !!getAccessToken();
}

async function handle(res: Response): Promise<TokenResponse> {
  if (!res.ok) {
    let detail = "خطایی رخ داد. دوباره تلاش کنید.";
    try {
      const data = await res.json();
      if (typeof data.detail === "string") detail = data.detail;
    } catch {
      /* ignore */
    }
    if (res.status === 429) detail = "تعداد تلاش‌ها زیاد است. کمی بعد دوباره تلاش کنید.";
    throw new Error(detail);
  }
  const data = (await res.json()) as TokenResponse;
  saveTokens(data);
  return data;
}

export async function login(email: string, password: string): Promise<TokenResponse> {
  if (DEMO) {
    saveTokens(DEMO_TOKENS);
    return DEMO_TOKENS;
  }
  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handle(res);
}

export async function register(payload: RegisterPayload): Promise<TokenResponse> {
  if (DEMO) {
    saveTokens(DEMO_TOKENS);
    return DEMO_TOKENS;
  }
  const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export interface CurrentUser {
  id: string;
  org_id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
}

export async function getMe(): Promise<CurrentUser | null> {
  if (DEMO) {
    return {
      id: "demo",
      org_id: "demo",
      email: "demo@company.com",
      full_name: "مدیر نمونه",
      role: "owner",
      is_active: true,
    };
  }
  const token = getAccessToken();
  if (!token) return null;
  const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return (await res.json()) as CurrentUser;
}
