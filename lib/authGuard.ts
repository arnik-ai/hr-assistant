"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "./auth";
import { DEMO } from "./config";

/**
 * محافظ صفحه — اگر کاربر وارد نشده باشد، خودکار به صفحه‌ی ورود هدایت می‌شود.
 * در حالت نمایشی (DEMO) هدایت انجام نمی‌شود تا همه‌ی صفحه‌ها قابل مشاهده باشند.
 */
export function useAuthGuard(): boolean {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (DEMO) {
      setReady(true);
      return;
    }
    if (!isLoggedIn()) {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [router]);

  return ready;
}
