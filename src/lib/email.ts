import { Resend } from "resend";

/**
 * Resend SDK client configuration for Skill Nest transactional emails
 * (e.g., account verification, password resets, onboarding emails).
 */
export const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

export const DEFAULT_FROM_EMAIL =
  process.env.EMAIL_FROM || "Skill Nest <onboarding@resend.dev>";
