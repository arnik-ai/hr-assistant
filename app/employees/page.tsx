"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, AlertCircle, Loader2, Users } from "lucide-react";
import AppNav from "@/components/AppNav";
import {
  listEmployees,
  createEmployee,
  deleteEmployee,
  type Employee,
} from "@/lib/employees";
import { formatToman } from "@/lib/utils";

const CONTRACT_LABELS: Record<string, string> = {
  permanent: "دائم",
  temporary: "موقت",
  full_time: "تمام‌وقت",
  part_time: "پاره‌وقت",
  daily: "روزمزد",
  consulting: "مشاوره‌ای",
  hourly_driver: "راننده استیجاری",
};

export default function EmployeesPage() {
  const [items, setItems] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // فرم افزودن
  const [fullName, setFullName] = useState("");
  const [position, setPosition] = useState("");
  const [baseWage, setBaseWage] = useState("");
  const [contractType, setContractType] = useState("permanent");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await listEmployees();
      setItems(data.items);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await createEmployee({
        full_name: fullName,
        position: position || undefined,
        base_wage: baseWage ? Number(baseWage) : undefined,
        contract_type: contractType,
      });
      setFullName("");
      setPosition("");
      setBaseWage("");
      setShowForm(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "ثبت ناموفق بود");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteEmployee(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch {
      setError("حذف ناموفق بود");
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppNav />
      <main className="mx-auto w-full max-w-5xl flex-1 p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">کارمندان</h1>
            <p className="text-sm text-slate-400">مدیریت پرونده‌ی پرسنلی</p>
          </div>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="flex items-center gap-2 rounded-2xl border border-brand-400/50 bg-gradient-to-l from-brand-600 to-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:shadow-glow-lg"
          >
            <Plus className="h-4 w-4" />
            افزودن کارمند
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-amber-500/10 px-4 py-3 text-[13px] text-amber-300 ring-1 ring-amber-500/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error} —{" "}
            <Link href="/login" className="underline">
              ورود
            </Link>
          </div>
        )}

        {/* فرم افزودن */}
        {showForm && (
          <form
            onSubmit={handleAdd}
            className="mb-6 grid grid-cols-1 gap-3 rounded-3xl border border-brand-400/40 bg-white/[0.03] p-5 sm:grid-cols-2"
          >
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="نام و نام خانوادگی *"
              required
              className="rounded-2xl border-2 border-brand-400/40 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand-500"
            />
            <input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="سمت"
              className="rounded-2xl border-2 border-brand-400/40 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand-500"
            />
            <input
              value={baseWage}
              onChange={(e) => setBaseWage(e.target.value)}
              placeholder="مزد مبنا (ریال)"
              type="number"
              className="rounded-2xl border-2 border-brand-400/40 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand-500"
            />
            <select
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
              className="rounded-2xl border-2 border-brand-400/40 bg-white px-4 py-2.5 text-slate-900 outline-none focus:border-brand-500"
            >
              {Object.entries(CONTRACT_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={saving || !fullName}
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-brand-600 to-brand-500 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 sm:col-span-2"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              ذخیره کارمند
            </button>
          </form>
        )}

        {/* جدول */}
        <div className="glass overflow-hidden rounded-3xl border border-brand-400/40">
          {loading ? (
            <div className="flex items-center justify-center gap-2 p-10 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin" /> در حال بارگذاری…
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-12 text-center text-slate-400">
              <Users className="h-10 w-10 opacity-40" />
              هنوز کارمندی ثبت نشده. با دکمه‌ی «افزودن کارمند» شروع کنید.
            </div>
          ) : (
            <table className="w-full text-right text-sm">
              <thead className="border-b border-white/10 text-[13px] text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">نام</th>
                  <th className="px-4 py-3 font-medium">سمت</th>
                  <th className="px-4 py-3 font-medium">نوع قرارداد</th>
                  <th className="px-4 py-3 font-medium">مزد مبنا (ریال)</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((emp) => (
                  <tr key={emp.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-medium text-slate-100">{emp.full_name}</td>
                    <td className="px-4 py-3 text-slate-300">{emp.position ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-300">
                      {emp.contract_type ? CONTRACT_LABELS[emp.contract_type] ?? emp.contract_type : "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {emp.base_wage ? formatToman(emp.base_wage) : "—"}
                    </td>
                    <td className="px-4 py-3 text-left">
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
