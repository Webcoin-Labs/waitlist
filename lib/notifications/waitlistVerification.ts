import "server-only";

import { logger } from "@/lib/logger";
import { getDisplayNameFromEmail } from "./displayName";
import { buildVerificationHtml, buildVerificationText, subjectFor, type WaitlistEmailRole } from "./emailTemplate";

export type { WaitlistEmailRole };

type Payload = { toEmail: string; verifyLink: string; name?: string | null; role?: WaitlistEmailRole | null };
type DeliveryResult = { delivered: boolean; provider: "resend" | "webhook" | "console"; error?: string };

function getFrom() {
  return process.env.WAITLIST_FROM_EMAIL ?? process.env.SIGNUP_FROM_EMAIL ?? null;
}

function displayNameFor(toEmail: string, name?: string | null): string {
  return name?.trim() || getDisplayNameFromEmail(toEmail) || "there";
}

async function sendViaResend(payload: Payload, displayName: string): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = getFrom();
  const replyTo = process.env.WAITLIST_EMAIL_REPLY_TO;
  if (!apiKey || !from) return { delivered: false, provider: "resend", error: "Resend is not configured." };
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [payload.toEmail],
        subject: subjectFor(payload.role),
        html: buildVerificationHtml({ verifyLink: payload.verifyLink, displayName, role: payload.role }),
        text: buildVerificationText({ verifyLink: payload.verifyLink, displayName, role: payload.role }),
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      cache: "no-store",
    });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      return { delivered: false, provider: "resend", error: `Resend responded ${response.status}: ${body.slice(0, 250)}` };
    }
    return { delivered: true, provider: "resend" };
  } catch (error) {
    return { delivered: false, provider: "resend", error: error instanceof Error ? error.message : "Resend delivery failed." };
  }
}

async function sendViaWebhook(payload: Payload, displayName: string): Promise<DeliveryResult> {
  const webhookUrl = process.env.WAITLIST_EMAIL_WEBHOOK_URL;
  if (!webhookUrl) return { delivered: false, provider: "webhook", error: "Webhook not configured." };
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.WAITLIST_EMAIL_WEBHOOK_TOKEN ? { authorization: `Bearer ${process.env.WAITLIST_EMAIL_WEBHOOK_TOKEN}` } : {}),
      },
      body: JSON.stringify({
        type: "waitlist_verification",
        toEmail: payload.toEmail,
        verifyLink: payload.verifyLink,
        displayName,
        role: payload.role ?? "FOUNDER",
      }),
      cache: "no-store",
    });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      return { delivered: false, provider: "webhook", error: `Webhook responded ${response.status}: ${body.slice(0, 250)}` };
    }
    return { delivered: true, provider: "webhook" };
  } catch (error) {
    return { delivered: false, provider: "webhook", error: error instanceof Error ? error.message : "Webhook delivery failed." };
  }
}

export async function dispatchWaitlistVerificationEmail(payload: Payload): Promise<DeliveryResult> {
  const displayName = displayNameFor(payload.toEmail, payload.name);

  const resendResult = await sendViaResend(payload, displayName);
  if (resendResult.delivered) return resendResult;

  const webhookResult = await sendViaWebhook(payload, displayName);
  if (webhookResult.delivered) return webhookResult;

  if (process.env.NODE_ENV === "production") {
    logger.error({
      scope: "notifications.waitlistVerification",
      message: "Waitlist verification delivery failed in production.",
      data: { toEmail: payload.toEmail, resendError: resendResult.error, webhookError: webhookResult.error },
    });
    return { delivered: false, provider: "webhook", error: "Verification email delivery failed." };
  }

  logger.info({
    scope: "notifications.waitlistVerification",
    message: "Waitlist verification fallback to console output.",
    data: { toEmail: payload.toEmail, verifyLink: payload.verifyLink, displayName, role: payload.role ?? "FOUNDER" },
  });
  return { delivered: true, provider: "console" };
}
