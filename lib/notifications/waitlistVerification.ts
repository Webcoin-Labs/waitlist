import "server-only";

import { logger } from "@/lib/logger";
import { getDisplayNameFromEmail } from "./displayName";

export type WaitlistEmailRole = "FOUNDER" | "BUILDER" | "INVESTOR" | "ADVISOR";

type Payload = { toEmail: string; verifyLink: string; name?: string | null; role?: WaitlistEmailRole | null };
type DeliveryResult = { delivered: boolean; provider: "resend" | "webhook" | "console"; error?: string };

const SUBJECT = "Verify your Webcoin Labs early access";

type RoleCopy = {
  preheader: string;
  passLabel: string | null;
  bannerTitle: string;
  intro: string;
  body: string;
  eligibility: string | null;
};

const ROLE_COPY: Record<WaitlistEmailRole, RoleCopy> = {
  FOUNDER: {
    preheader: "Activate your WebXP, referral link, and Founder Pass eligibility.",
    passLabel: "Founder Pass",
    bannerTitle: "Your builder credential is one step away.",
    intro:
      "You&rsquo;re one step away from activating your early-access position. Verify your email to unlock your WebXP, referral link, and Founder Pass eligibility.",
    body: "Webcoin Labs is the OS for founders and serious builders &mdash; built to help you launch faster, prove what you&rsquo;re building, and access founder tools, builder networks, advisor discovery, and investor-ready workflows.",
    eligibility: "Founder Pass beta eligibility is currently available for founders and builders launching on Arc and Base. More tracks are coming soon.",
  },
  BUILDER: {
    preheader: "Activate your WebXP, referral link, and Builder Pass eligibility.",
    passLabel: "Builder Pass",
    bannerTitle: "Your proof-of-work credential is one step away.",
    intro:
      "You&rsquo;re one step away from activating your early-access position. Verify your email to unlock your WebXP, referral link, and Builder Pass eligibility.",
    body: "Webcoin Labs puts your work in front of founders who need proof, not pitches &mdash; GitHub, shipped projects, and a builder network that gets you discovered directly.",
    eligibility: "Builder Pass beta eligibility is currently available for builders launching on Arc and Base. More tracks are coming soon.",
  },
  INVESTOR: {
    preheader: "Activate your verified deal-flow access.",
    passLabel: null,
    bannerTitle: "",
    intro:
      "You&rsquo;re one step away from activating your early-access position. Verify your email to unlock curated deal flow and your verified investor network access.",
    body: "Webcoin Labs surfaces verified, proof-backed founders and builders &mdash; structured profiles, traction signals, and warm introductions instead of cold decks.",
    eligibility: null,
  },
  ADVISOR: {
    preheader: "Activate your advisor network access.",
    passLabel: null,
    bannerTitle: "",
    intro:
      "You&rsquo;re one step away from activating your early-access position. Verify your email to unlock advisor matching and your network access.",
    body: "Webcoin Labs connects advisors directly with founders and builders who need real guidance &mdash; matched by domain, not cold outreach.",
    eligibility: null,
  },
};

function copyFor(role?: WaitlistEmailRole | null): RoleCopy {
  return ROLE_COPY[role ?? "FOUNDER"] ?? ROLE_COPY.FOUNDER;
}

function getFrom() {
  return process.env.WAITLIST_FROM_EMAIL ?? process.env.SIGNUP_FROM_EMAIL ?? null;
}

function greetingFor(toEmail: string, name?: string | null): string {
  const displayName = name?.trim() || getDisplayNameFromEmail(toEmail);
  return displayName ? `Hey ${displayName},` : "Hey there,";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function disclaimerFor(passLabel: string | null): string {
  return passLabel
    ? `WebXP and ${passLabel} are promotional in-app access systems. They have no monetary value, no token value, no airdrop value, and do not represent ownership, investment, or financial rights.`
    : "WebXP is a promotional in-app points system. It has no monetary value, no token value, no airdrop value, and does not represent ownership, investment, or financial rights.";
}

function buildHtml(verifyLink: string, greeting: string, role?: WaitlistEmailRole | null) {
  const link = escapeHtml(verifyLink);
  const copy = copyFor(role);

  const bannerBlock = copy.passLabel
    ? `
            <tr>
              <td style="padding:20px 32px 0 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:linear-gradient(120deg,#7c3aed,#2563eb);border-radius:16px;border:1px solid rgba(255,255,255,0.14);">
                  <tr>
                    <td style="padding:22px 24px;display:block;">
                      <span style="display:block;font-size:10px;font-weight:bold;letter-spacing:0.16em;color:rgba(255,255,255,0.75);text-transform:uppercase;">${escapeHtml(copy.passLabel)}</span>
                      <span style="display:block;margin-top:6px;font-size:19px;font-weight:bold;color:#ffffff;">${escapeHtml(copy.bannerTitle)}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>`
    : "";

  const eligibilityBlock = copy.eligibility
    ? `<p style="margin:0 0 24px 0;font-size:15px;line-height:1.7;color:#3f3f46;">${escapeHtml(copy.eligibility)}</p>`
    : "";

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${SUBJECT}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f3f8;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${copy.preheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f3f8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border:1px solid #e6e5ee;border-radius:20px;overflow:hidden;">
            <tr>
              <td style="padding:28px 32px 0 32px;">
                <span style="font-size:13px;font-weight:bold;color:#0b0a12;letter-spacing:0.02em;">Webcoin&nbsp;<span style="color:#7c3aed;">Labs</span></span>
              </td>
            </tr>
${bannerBlock}
            <tr>
              <td style="padding:28px 32px 0 32px;">
                <p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:#0b0a12;">${escapeHtml(greeting)}</p>
                <p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:#0b0a12;">Welcome to Webcoin Labs.</p>
                <p style="margin:0 0 16px 0;font-size:15px;line-height:1.7;color:#3f3f46;">${copy.intro}</p>
                <p style="margin:0 0 16px 0;font-size:15px;line-height:1.7;color:#3f3f46;">${copy.body}</p>
                ${eligibilityBlock}
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:0 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="border-radius:9999px;background-color:#0b0a12;">
                      <a href="${link}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:9999px;">Verify email</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 32px 0 32px;">
                <p style="margin:0 0 4px 0;font-size:12px;line-height:1.6;color:#79778a;">If the button does not work, copy and paste this link into your browser:</p>
                <p style="margin:0;font-size:12px;line-height:1.6;color:#7c3aed;word-break:break-all;">${link}</p>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 32px 0 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fbfbfd;border:1px solid #e6e5ee;border-radius:12px;">
                  <tr>
                    <td style="padding:14px 16px;font-size:13px;line-height:1.6;color:#0b0a12;">
                      You&rsquo;ll receive <strong>+100 WebXP</strong> after verifying during the first 7 days of the launch window.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 32px 28px 32px;">
                <p style="margin:0;font-size:11px;line-height:1.6;color:#a3a1b3;">
                  ${escapeHtml(disclaimerFor(copy.passLabel))}
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 32px;border-top:1px solid #e6e5ee;">
                <p style="margin:0;font-size:12px;font-weight:bold;color:#0b0a12;">Webcoin Labs</p>
                <p style="margin:2px 0 0 0;font-size:12px;color:#79778a;">Proof over noise.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function stripTags(value: string): string {
  return value.replace(/&rsquo;/g, "'").replace(/&mdash;/g, "--").replace(/&[a-z]+;/g, "");
}

function buildText(verifyLink: string, greeting: string, role?: WaitlistEmailRole | null) {
  const copy = copyFor(role);
  const lines = [
    greeting,
    "",
    "Welcome to Webcoin Labs.",
    "",
    stripTags(copy.intro),
    "",
    stripTags(copy.body),
  ];
  if (copy.eligibility) lines.push("", copy.eligibility);
  lines.push(
    "",
    `Verify email: ${verifyLink}`,
    "",
    "You'll receive +100 WebXP after verifying during the first 7 days of the launch window.",
    "",
    disclaimerFor(copy.passLabel),
    "",
    "Webcoin Labs",
    "Proof over noise.",
  );
  return lines.join("\n");
}

async function sendViaResend(payload: Payload, greeting: string): Promise<DeliveryResult> {
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
        subject: SUBJECT,
        html: buildHtml(payload.verifyLink, greeting, payload.role),
        text: buildText(payload.verifyLink, greeting, payload.role),
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

async function sendViaWebhook(payload: Payload, greeting: string): Promise<DeliveryResult> {
  const webhookUrl = process.env.WAITLIST_EMAIL_WEBHOOK_URL;
  if (!webhookUrl) return { delivered: false, provider: "webhook", error: "Webhook not configured." };
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.WAITLIST_EMAIL_WEBHOOK_TOKEN ? { authorization: `Bearer ${process.env.WAITLIST_EMAIL_WEBHOOK_TOKEN}` } : {}),
      },
      body: JSON.stringify({ type: "waitlist_verification", toEmail: payload.toEmail, verifyLink: payload.verifyLink, greeting, role: payload.role ?? "FOUNDER" }),
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
  const greeting = greetingFor(payload.toEmail, payload.name);

  const resendResult = await sendViaResend(payload, greeting);
  if (resendResult.delivered) return resendResult;

  const webhookResult = await sendViaWebhook(payload, greeting);
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
    data: { toEmail: payload.toEmail, verifyLink: payload.verifyLink, greeting, role: payload.role ?? "FOUNDER" },
  });
  return { delivered: true, provider: "console" };
}
