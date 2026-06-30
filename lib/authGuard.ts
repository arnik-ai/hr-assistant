"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "./auth";

/**
 * محافظ صفحه — اگر کاربر وارد نشده باشد، خودکار به صفحه‌ی ورود هدایت می‌شود.
 * مقدار بازگشتی: آیا بررسی انجام شده و کاربر مجاز است؟
 */
export function useAuthGuard(): boolean {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [router]);

  return ready;
}
