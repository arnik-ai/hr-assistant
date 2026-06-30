"use client";

import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";

/**
 * انتخابگر تاریخ و ساعت شمسی (جلالی).
 * مقدار خروجی به‌صورت ISO (میلادی) به والد داده می‌شود تا برای بک‌اند مناسب باشد.
 */
export default function PersianDateTimePicker({
  value,
  onChange,
  placeholder = "انتخاب تاریخ و ساعت",
}: {
  value: string; // ISO string یا خالی
  onChange: (iso: string) => void;
  placeholder?: string;
}) {
  return (
    <DatePicker
      calendar={persian}
      locale={persian_fa}
      format="YYYY/MM/DD HH:mm"
      plugins={[<TimePicker key="t" position="bottom" hideSeconds />]}
      value={value ? new DateObject({ date: new Date(value) }).convert(persian) : ""}
      onChange={(d: DateObject | null) => {
        onChange(d ? d.toDate().toISOString() : "");
      }}
      inputClass="w-full rounded-2xl border-2 border-brand-400/40 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand-500"
      placeholder={placeholder}
      calendarPosition="bottom-right"
    />
  );
}
