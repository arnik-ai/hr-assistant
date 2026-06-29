import type { AssistantResponse, Intent } from "./types";

/**
 * لایه‌ی ارتباط با بک‌اند.
 * فعلاً پاسخ‌های نمونه (mock) برمی‌گرداند تا قبل از آماده‌شدن بک‌اند،
 * رابط کاربری کامل قابل تست باشد. ساختار خروجی دقیقاً همان schema رسمی است.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

function detectIntent(q: string): Intent {
  if (/(حقوق|دستمزد|اضافه|عیدی|سنوات|بیمه|مالیات|کسر)/.test(q)) return "payroll";
  if (/(قرارداد|بند|امضا|استخدام|فسخ)/.test(q)) return "contract";
  if (/(آیین|سیاست|رویه|مرخصی|پاداش)/.test(q)) return "hr_policy";
  return "legal";
}

const MOCK_RESPONSES: Record<Intent, AssistantResponse> = {
  payroll: {
    answer:
      "بر اساس قانون کار، اضافه‌کار با ضریب ۱٫۴ روی مزد مبنا محاسبه می‌شود. برای ۱۰ ساعت اضافه‌کار با مزد مبنای نمونه، مبلغ تقریبی محاسبه و در جدول زیر آمده است. (این یک پاسخ نمونه برای تست رابط است.)",
    intent: "payroll",
    risk_level: "LOW",
    legal_analysis: [
      "ضریب اضافه‌کار طبق ماده ۵۹ قانون کار: ۴۰٪ اضافه بر مزد عادی",
      "پایه‌ی اضافه‌کار فقط شامل مزد مبنا است، نه مزایا (حق مسکن/خواروبار)",
    ],
    calculation: {
      "مزد مبنا (ماهانه)": "۱۲۰٬۰۰۰٬۰۰۰ ریال",
      "نرخ ساعتی (÷۲۲۰)": "۵۴۵٬۴۵۵ ریال",
      "ضریب اضافه‌کار": "۱٫۴",
      "ساعت اضافه‌کار": "۱۰",
      "مبلغ اضافه‌کار": "۷٬۶۳۶٬۳۶۴ ریال",
    },
    recommendations: [
      "سقف مجاز اضافه‌کار روزانه (۴ ساعت) رعایت شود",
      "رضایت کتبی کارگر برای اضافه‌کار اخذ شود",
    ],
    missing_information: [],
  },
  contract: {
    answer:
      "نمونه‌ی پیش‌نویس قرارداد آماده است. توجه: یک بند پرخطر شناسایی شد که می‌تواند در هیأت تشخیص علیه کارفرما رأی ایجاد کند. جزئیات در پنل ریسک. (پاسخ نمونه)",
    intent: "contract",
    risk_level: "HIGH",
    legal_analysis: [
      "بند «انصراف از سنوات» خلاف قانون آمره و باطل است (ماده ۸ قانون کار)",
      "مدت قرارداد موقت برای کار با ماهیت دائم، ریسک تبدیل به دائم دارد",
    ],
    calculation: {},
    recommendations: [
      "بند انصراف از سنوات حذف شود",
      "نوع قرارداد متناسب با ماهیت دائمی کار اصلاح شود",
    ],
    missing_information: ["تاریخ شروع قرارداد", "مبلغ دقیق حقوق توافقی"],
  },
  legal: {
    answer:
      "در صورت استعفای کارگر، کارفرما موظف به پرداخت سنوات و مزایای پایان کار به نسبت مدت کارکرد است. (پاسخ نمونه — منبع قانونی هنگام اتصال به RAG نمایش داده می‌شود.)",
    intent: "legal",
    risk_level: "MEDIUM",
    legal_analysis: [
      "ماده ۲۴ قانون کار: مزایای پایان کار به ازای هر سال، یک ماه آخرین حقوق",
      "استعفا باید کتبی و با رعایت یک ماه پیش‌اطلاع باشد",
    ],
    calculation: {},
    recommendations: ["استعفای کتبی در پرونده پرسنلی بایگانی شود"],
    missing_information: ["مدت دقیق سابقه‌ی کارگر"],
  },
  hr_policy: {
    answer:
      "مرخصی استحقاقی سالانه ۲۶ روز کاری است که با احتساب ۴ جمعه به ۳۰ روز قانونی می‌رسد و قابل ذخیره است. (پاسخ نمونه)",
    intent: "hr_policy",
    risk_level: "LOW",
    legal_analysis: ["ماده ۶۴ قانون کار: مرخصی سالانه با احتساب تعطیلات"],
    calculation: {},
    recommendations: ["سیاست ذخیره‌ی مرخصی به‌صورت مکتوب ابلاغ شود"],
    missing_information: [],
  },
};

/** ارسال پیام و دریافت پاسخ ساختاریافته (نسخه‌ی mock) */
export async function sendMessage(query: string): Promise<AssistantResponse> {
  // اگر بک‌اند تنظیم شده باشد، به آن وصل می‌شویم
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) throw new Error("خطا در ارتباط با سرور");
    return (await res.json()) as AssistantResponse;
  }

  // حالت نمونه: تأخیر کوتاه برای شبیه‌سازی پردازش
  await new Promise((r) => setTimeout(r, 900));
  return MOCK_RESPONSES[detectIntent(query)];
}
