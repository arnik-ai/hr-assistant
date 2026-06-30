// ارتباط فرانت با ماژول کارمندان و داشبورد بک‌اند
import { getAccessToken } from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

export interface Employee {
  id: string;
  org_id: string;
  full_name: string;
  national_id?: string | null;
  personnel_code?: string | null;
  position?: string | null;
  department?: string | null;
  hire_date?: string | null;
  contract_type?: string | null;
  base_wage?: number | null;
  marital_status?: string | null;
  children_count: number;
  status: string;
  phone?: string | null;
  email?: string | null;
}

export interface EmployeeInput {
  full_name: string;
  position?: string;
  department?: string;
  base_wage?: number;
  contract_type?: string;
  national_id?: string;
  phone?: string;
}

export interface DashboardStats {
  employees: number;
  active_employees: number;
  open_positions: number;
  risk_alerts: number;
}

function authHeaders(): HeadersInit {
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
  return res.json();
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE}/api/v1/dashboard/stats`, {
    headers: authHeaders(),
  });
  return jsonOrThrow(res);
}

export async function listEmployees(
  limit = 50,
  offset = 0,
): Promise<{ items: Employee[]; total: number }> {
  const res = await fetch(
    `${API_BASE}/api/v1/employees?limit=${limit}&offset=${offset}`,
    { headers: authHeaders() },
  );
  return jsonOrThrow(res);
}

export async function createEmployee(data: EmployeeInput): Promise<Employee> {
  const res = await fetch(`${API_BASE}/api/v1/employees`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return jsonOrThrow(res);
}

export async function deleteEmployee(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/v1/employees/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok && res.status !== 204) throw new Error("حذف ناموفق بود");
}
