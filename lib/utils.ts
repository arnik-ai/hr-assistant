import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** ادغام هوشمند کلاس‌های Tailwind */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** قالب‌بندی عدد به فارسی با جداکننده‌ی هزارگان */
export function formatToman(value: number): string {
  return new Intl.NumberFormat("fa-IR").format(value);
}

/** عدد ساده به ارقام فارسی */
export function faNumber(value: number): string {
  return new Intl.NumberFormat("fa-IR").format(value);
}
