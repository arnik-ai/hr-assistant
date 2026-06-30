// ارتباط فرانت با ماژول کارمندان و داشبورد بک‌اند
import { getAccessToken } from "./auth";
import { DEMO } from "./config";

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

// ----- داده‌ی نمونه برای حالت نمایشی -----
let demoEmployees: Employee[] = [
  { id: "d1", org_id: "demo", full_name: "زهرا احمدی", position: "کارشناس فروش", department: "فروش", hire_date: null, contract_type: "permanent", base_wage: 145000000, marital_status: "married", children_count: 1, status: "active", phone: null, email: null, national_id: null, personnel_code: null },
  { id: "d2", org_id: "demo", full_name: "علی کریمی", position: "حسابدار", department: "مالی", hire_date: null, contract_type: "full_time", base_wage: 160000000, marital_status: "single", children_count: 0, status: "active", phone: null, email: null, national_id: null, personnel_code: null },
  { id: "d3", org_id: "demo", full_name: "مریم محمدی", position: "مسئول دفتر", department: "اداری", hire_date: null, contract_type: "part_time", base_wage: 120000000, marital_status: "married", children_count: 2, status: "active", phone: null, email: null, national_id: null, personnel_code: null },
];

export async function getDashboardStats(): Promise<DashboardStats> {
  if (DEMO) {
    const active = demoEmployees.filter((e) => e.status === "active").length;
    return { employees: demoEmployees.length, active_employees: active, open_positions: 2, risk_alerts: 2 };
  }
  const res = await fetch(`${API_BASE}/api/v1/dashboard/stats`, {
    headers: authHeaders(),
  });
  return jsonOrThrow(res);
}

export async function listEmployees(
  limit = 50,
  offset = 0,
): Promise<{ items: Employee[]; total: number }> {
  if (DEMO) return { items: [...demoEmployees], total: demoEmployees.length };
  const res = await fetch(
    `${API_BASE}/api/v1/employees?limit=${limit}&offset=${offset}`,
    { headers: authHeaders() },
  );
  return jsonOrThrow(res);
}

export async function createEmployee(data: EmployeeInput): Promise<Employee> {
  if (DEMO) {
    const emp: Employee = {
      id: "d" + (demoEmployees.length + 1) + "-" + data.full_name,
      org_id: "demo",
      full_name: data.full_name,
      position: data.position ?? null,
      department: null,
      hire_date: null,
      contract_type: data.contract_type ?? null,
      base_wage: data.base_wage ?? null,
      marital_status: null,
      children_count: 0,
      status: "active",
      phone: data.phone ?? null,
      email: null,
      national_id: data.national_id ?? null,
      personnel_code: null,
    };
    demoEmployees = [emp, ...demoEmployees];
    return emp;
  }
  const res = await fetch(`${API_BASE}/api/v1/employees`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return jsonOrThrow(res);
}

export async function deleteEmployee(id: string): Promise<void> {
  if (DEMO) {
    demoEmployees = demoEmployees.filter((e) => e.id !== id);
    return;
  }
  const res = await fetch(`${API_BASE}/api/v1/employees/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok && res.status !== 204) throw new Error("حذف ناموفق بود");
}
