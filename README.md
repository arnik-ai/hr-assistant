# 🎨 فرانت‌اند — دستیار هوشمند منابع انسانی

رابط کاربری مدرن (استایل ۲۰۲۶) با Next.js 14 + TypeScript + TailwindCSS + Framer Motion.
طراحی: Dark + Glassmorphism، راست‌به‌چپ (RTL)، فونت وزیرمتن.

## اجرا

```bash
cd frontend
npm install        # نصب پکیج‌ها (یک‌بار)
npm run dev        # اجرای محیط توسعه روی http://localhost:3000
```

> تا وقتی بک‌اند آماده نشده، فرانت با **پاسخ‌های نمونه (mock)** کار می‌کند.
> برای اتصال به بک‌اند، `NEXT_PUBLIC_API_BASE` را در فایل `.env.local` تنظیم کنید.

## ساختار

```
app/
  layout.tsx        قالب کلی (RTL + dark + فونت وزیرمتن)
  page.tsx          صفحه‌ی اصلی → شل اپلیکیشن (سایدبار + چت)
  globals.css       استایل پایه، گرادیان، شیشه‌ای
  fonts/            فونت وزیرمتن (محلی)
components/
  Sidebar.tsx       پنل کناری شیشه‌ای + ناوبری ماژول‌ها
  ChatUI.tsx        محیط چت + صفحه‌ی خوش‌آمد
  MessageBubble.tsx حباب پیام (کاربر/دستیار)
  RiskPanel.tsx     پنل ریسک + تحلیل حقوقی + جدول محاسبه
lib/
  api.ts            ارتباط با بک‌اند (فعلاً mock)
  types.ts          ساختار واحد پاسخ (schema رسمی)
  utils.ts          توابع کمکی
```
