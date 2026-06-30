// حالت نمایشی (Demo) — برای نمایش به کارفرما بدون بک‌اند.
// در build سایت نمایشی روشن است؛ در production خاموش (پیش‌فرض).
export const DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
