import "server-only";

import { logger } from "@/lib/logger";

type Payload = { toEmail: string; verifyLink: string };
type DeliveryResult = { delivered: boolean; provider: "resend" | "webhook" | "console"; error?: string };

const SUBJECT = "Verify your Webcoin Labs early access";

function getFrom() {
  return process.env.WAITLIST_FROM_EMAIL ?? process.env.SIGNUP_FROM_EMAIL ?? null;
}

function buildHtml(verifyLink: string) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#0a0a0f;max-width:520px;">
      <h2 style="margin:0 0 8px;font-size:20px;">Confirm your Webcoin Labs early access</h2>
      <p style="margin:0 0 16px;color:#3f3f46;">Confirm your email to unlock WebXP and activate your early-access position on the Webcoin Labs waitlist.</p>
      <p style="margin:0 0 20px;">
        <a href="${verifyLink}" style="background:#0a0a0f;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:9999px;display:inline-block;font-weight:600;">
          Verify email
        </a>
      </p>
      <p style="font-size:12px;color:#71717a;margin:0 0 6px;">If the button does not work, paste this link:</p>
      <p style="font-size:12px;word-break:break-all;color:#71717a;margin:0;">${verifyLink}</p>
      <p style="font-size:12px;color:#a1a1aa;margin-top:20px;">Only verified emails receive WebXP and referral rank. This link expires in 24 hours.</p>
    </div>
  `;
}

async function sendViaResend(payload: Payload): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = getFrom();
  if (!apiKey || !from) return { delivered: false, provider: "resend", error: "Resend is not configured." };
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [payload.toEmail], subject: SUBJECT, html: buildHtml(payload.verifyLink) }),
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

async function sendViaWebhook(payload: Payload): Promise<DeliveryResult> {
  const webhookUrl = process.env.WAITLIST_EMAIL_WEBHOOK_URL;
  if (!webhookUrl) return { delivered: false, provider: "webhook", error: "Webhook not configured." };
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.WAITLIST_EMAIL_WEBHOOK_TOKEN ? { authorization: `Bearer ${process.env.WAITLIST_EMAIL_WEBHOOK_TOKEN}` } : {}),
      },
      body: JSON.stringify({ type: "waitlist_verification", toEmail: payload.toEmail, verifyLink: payload.verifyLink }),
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
  const resendResult = await sendViaResend(payload);
  if (resendResult.delivered) return resendResult;

  const webhookResult = await sendViaWebhook(payload);
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
    data: { toEmail: payload.toEmail, verifyLink: payload.verifyLink },
  });
  return { delivered: true, provider: "console" };
}
