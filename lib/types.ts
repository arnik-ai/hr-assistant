// ساختار واحد پاسخ سیستم — مطابق README (Output Format)

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type Intent = "payroll" | "contract" | "legal" | "hr_policy";

/** پاسخ ساختاریافته‌ی دستیار (همان schema رسمی پروژه) */
export interface AssistantResponse {
  answer: string;
  intent: Intent;
  risk_level: RiskLevel;
  legal_analysis: string[];
  calculation: Record<string, unknown>;
  recommendations: string[];
  missing_information: string[];
}

export type Role = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  /** فقط برای پیام دستیار — جزئیات ساختاریافته */
  data?: AssistantResponse;
  pending?: boolean;
}
