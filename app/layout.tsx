import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/components/Providers";

// فونت وزیرمتن (محلی) — وزن‌های معمولی و توپر
const vazir = localFont({
  src: [
    { path: "./fonts/Vazirmatn-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Vazirmatn-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-vazir",
  display: "swap",
});

export const metadata: Metadata = {
  title: "دستیار هوشمند منابع انسانی",
  description:
    "پلتفرم تصمیم‌یار منابع انسانی مبتنی بر قانون کار ایران — تولید قرارداد، محاسبه حقوق، تحلیل ریسک حقوقی",
};

export const viewport: Viewport = {
  themeColor: "#090912",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} dark`}>
      <body className="app-bg font-sans text-slate-100 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
