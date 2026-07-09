import "server-only";

import { logger } from "@/lib/logger";
import { getDisplayNameFromEmail } from "./displayName";

export type WaitlistEmailRole = "FOUNDER" | "BUILDER" | "INVESTOR" | "ADVISOR";

type Payload = { toEmail: string; verifyLink: string; name?: string | null; role?: WaitlistEmailRole | null };
type DeliveryResult = { delivered: boolean; provider: "resend" | "webhook" | "console"; error?: string };

const DEFAULT_SUBJECT = "Activate your Webcoin Labs early access";

type RoleCopy = {
  preheader: string;
  passLabel: string | null;
  passOwnerLabel: string | null;
  passProof: string | null;
  passTone: "violet" | "blue" | null;
  bannerTitle: string;
  intro: string;
  body: string;
  eligibility: string | null;
};

const ROLE_COPY: Record<WaitlistEmailRole, RoleCopy> = {
  FOUNDER: {
    preheader: "Verify your email to activate WebXP, referrals, and your Founder Pass access.",
    passLabel: "Founder Pass",
    passOwnerLabel: "Founder",
    passProof: "Startup profile",
    passTone: "violet",
    bannerTitle: "Your Founder Pass access is almost ready.",
    intro:
      "Verify your email to lock your waitlist position, activate your referral link, and open your Founder Pass eligibility track.",
    body: "Webcoin Labs is the operating layer for serious founders and builders: proof profiles, launch tasks, advisor discovery, builder networks, and investor-ready workflows in one place.",
    eligibility: "Founder Pass is locked until email verification. Beta access opens first to founders and builders launching on Arc and Base, with more tracks coming soon.",
  },
  BUILDER: {
    preheader: "Verify your email to activate WebXP, referrals, and your Builder Pass access.",
    passLabel: "Builder Pass",
    passOwnerLabel: "Builder",
    passProof: "GitHub + portfolio",
    passTone: "blue",
    bannerTitle: "Your Builder Pass access is almost ready.",
    intro:
      "Verify your email to lock your waitlist position, activate your referral link, and open your Builder Pass eligibility track.",
    body: "Webcoin Labs puts shipped work in front of founders who need proof, not pitches: GitHub, portfolios, live projects, and a builder network that gets you discovered directly.",
    eligibility: "Builder Pass is locked until email verification. Beta access opens first to builders launching on Arc and Base, with more tracks coming soon.",
  },
  INVESTOR: {
    preheader: "Verify your email to activate verified deal-flow access.",
    passLabel: null,
    passOwnerLabel: null,
    passProof: null,
    passTone: null,
    bannerTitle: "Your investor access is one step away.",
    intro:
      "Verify your email to activate your waitlist position and unlock curated access to verified founder and builder profiles.",
    body: "Webcoin Labs surfaces proof-backed founders and builders with structured profiles, traction signals, and warm introductions instead of cold decks.",
    eligibility: null,
  },
  ADVISOR: {
    preheader: "Verify your email to activate advisor network access.",
    passLabel: null,
    passOwnerLabel: null,
    passProof: null,
    passTone: null,
    bannerTitle: "Your advisor access is one step away.",
    intro:
      "Verify your email to activate your waitlist position and unlock advisor matching inside Webcoin Labs.",
    body: "Webcoin Labs connects advisors directly with founders and builders who need real guidance, matched by domain and proof signals instead of cold outreach.",
    eligibility: null,
  },
};

function copyFor(role?: WaitlistEmailRole | null): RoleCopy {
  return ROLE_COPY[role ?? "FOUNDER"] ?? ROLE_COPY.FOUNDER;
}

function subjectFor(role?: WaitlistEmailRole | null): string {
  switch (role) {
    case "FOUNDER":
      return "Activate your Webcoin Labs Founder Pass";
    case "BUILDER":
      return "Activate your Webcoin Labs Builder Pass";
    case "INVESTOR":
      return "Verify your Webcoin Labs investor access";
    case "ADVISOR":
      return "Verify your Webcoin Labs advisor access";
    default:
      return DEFAULT_SUBJECT;
  }
}

function getFrom() {
  return process.env.WAITLIST_FROM_EMAIL ?? process.env.SIGNUP_FROM_EMAIL ?? null;
}

function displayNameFor(toEmail: string, name?: string | null): string {
  return name?.trim() || getDisplayNameFromEmail(toEmail) || "there";
}

function greetingFor(displayName: string): string {
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

function roleLabelFor(role?: WaitlistEmailRole | null): string {
  switch (role) {
    case "BUILDER":
      return "Builder";
    case "INVESTOR":
      return "Investor";
    case "ADVISOR":
      return "Advisor";
    case "FOUNDER":
    default:
      return "Founder";
  }
}

function bannerTitleFor(role: WaitlistEmailRole | null | undefined, displayName: string, fallback: string): string {
  if (role === "FOUNDER" || role === "BUILDER") {
    const roleLabel = roleLabelFor(role);
    const namePart = displayName.toLowerCase() === "there" ? "" : ` ${displayName}`;
    return `Hey ${roleLabel}${namePart}, we're glad to have you onboard.`;
  }
  return fallback;
}

function wordmarkHtml(color = "#0b0a12", size = 18): string {
  return `<span style="display:inline-block;font-size:${size}px;line-height:1;font-weight:800;letter-spacing:-0.04em;color:${color};">Webcoin <span style="color:#3b82f6;">Labs</span></span>`;
}

function buildPassCard(copy: RoleCopy): string {
  if (!copy.passLabel || !copy.passOwnerLabel || !copy.passProof || !copy.passTone) return "";

  const accent = copy.passTone === "blue" ? "#38bdf8" : "#a78bfa";
  const accentSoft = copy.passTone === "blue" ? "rgba(56,189,248,0.16)" : "rgba(167,139,250,0.18)";
  const border = copy.passTone === "blue" ? "rgba(56,189,248,0.34)" : "rgba(167,139,250,0.38)";

  return `
            <tr>
              <td style="padding:0 34px 26px 34px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0a12;background-image:linear-gradient(135deg,#0b0a12 0%,#121127 50%,#311a45 100%);border:1px solid ${border};border-radius:20px;overflow:hidden;">
                  <tr>
                    <td style="padding:22px 22px 18px 22px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="vertical-align:top;">
                            <p style="margin:0;">${wordmarkHtml("#ffffff", 14)}</p>
                            <p style="margin:16px 0 0 0;font-size:28px;line-height:1.05;font-weight:800;color:#ffffff;">${escapeHtml(copy.passLabel)}</p>
                            <p style="margin:8px 0 0 0;font-size:13px;line-height:1.5;color:#c9c5dc;">Your access credential preview.</p>
                          </td>
                          <td align="right" style="vertical-align:top;width:76px;">
                            <span style="display:inline-block;width:38px;height:38px;border-radius:12px;background:${accentSoft};border:1px solid ${border};font-size:21px;line-height:38px;text-align:center;color:${accent};">✓</span>
                            <span style="display:inline-block;margin-top:14px;padding:6px 10px;border-radius:999px;background:${accentSoft};font-size:10px;font-weight:bold;color:${accent};white-space:nowrap;">Locked</span>
                          </td>
                        </tr>
                      </table>

                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;border-collapse:separate;border-spacing:0 8px;">
                        <tr>
                          <td width="50%" style="padding:12px 14px;border:1px solid rgba(255,255,255,0.1);border-radius:14px;background:rgba(255,255,255,0.045);">
                            <span style="display:block;font-size:9px;font-weight:bold;letter-spacing:0.14em;text-transform:uppercase;color:#8f8aa8;">${escapeHtml(copy.passOwnerLabel)}</span>
                            <span style="display:block;margin-top:4px;font-size:13px;font-weight:bold;color:#ffffff;">You</span>
                          </td>
                          <td width="50%" style="padding:12px 14px;border:1px solid rgba(255,255,255,0.1);border-radius:14px;background:rgba(255,255,255,0.045);">
                            <span style="display:block;font-size:9px;font-weight:bold;letter-spacing:0.14em;text-transform:uppercase;color:#8f8aa8;">Track</span>
                            <span style="display:block;margin-top:4px;font-size:13px;font-weight:bold;color:#ffffff;">Arc / Base beta</span>
                          </td>
                        </tr>
                        <tr>
                          <td width="50%" style="padding:12px 14px;border:1px solid rgba(255,255,255,0.1);border-radius:14px;background:rgba(255,255,255,0.045);">
                            <span style="display:block;font-size:9px;font-weight:bold;letter-spacing:0.14em;text-transform:uppercase;color:#8f8aa8;">Status</span>
                            <span style="display:block;margin-top:4px;font-size:13px;font-weight:bold;color:${accent};">Eligible soon</span>
                          </td>
                          <td width="50%" style="padding:12px 14px;border:1px solid rgba(255,255,255,0.1);border-radius:14px;background:rgba(255,255,255,0.045);">
                            <span style="display:block;font-size:9px;font-weight:bold;letter-spacing:0.14em;text-transform:uppercase;color:#8f8aa8;">WebXP</span>
                            <span style="display:block;margin-top:4px;font-size:13px;font-weight:bold;color:${accent};">+5,000</span>
                          </td>
                        </tr>
                      </table>

                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;border-top:1px solid rgba(255,255,255,0.1);">
                        <tr>
                          <td style="padding-top:13px;font-size:11px;font-weight:bold;letter-spacing:0.12em;text-transform:uppercase;color:#8f8aa8;">${escapeHtml(copy.passProof)}</td>
                          <td align="right" style="padding-top:13px;font-size:11px;font-weight:bold;color:${accent};">Unlocks after verification</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>`;
}

function buildHtml(verifyLink: string, greeting: string, displayName: string, role?: WaitlistEmailRole | null) {
  const link = escapeHtml(verifyLink);
  const copy = copyFor(role);
  const subject = subjectFor(role);
  const bannerTitle = bannerTitleFor(role, displayName, copy.bannerTitle);
  const passCard = buildPassCard(copy);

  const eligibilityBlock = copy.eligibility
    ? `<p style="margin:0 0 16px 0;font-size:15px;line-height:1.7;color:#444052;">${escapeHtml(copy.eligibility)}</p>`
    : "";

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f3f8;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;text-size-adjust:100%;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(copy.preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f3f8;padding:36px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background-color:#ffffff;border:1px solid #e4e2ee;border-radius:24px;overflow:hidden;box-shadow:0 22px 70px rgba(20,16,42,0.10);">
            <tr>
              <td style="padding:30px 34px 0 34px;">
                ${wordmarkHtml()}
              </td>
            </tr>

            <tr>
              <td style="padding:24px 34px 0 34px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0a12;background-image:linear-gradient(135deg,#0b0a12 0%,#17113a 50%,#2f63ff 100%);border-radius:22px;overflow:hidden;">
                  <tr>
                    <td style="padding:28px 26px;">
                      <p style="margin:0;font-size:10px;font-weight:bold;letter-spacing:0.18em;text-transform:uppercase;color:#c4b5fd;">Private beta access</p>
                      <p style="margin:10px 0 0 0;font-size:30px;line-height:1.08;font-weight:800;color:#ffffff;">${escapeHtml(bannerTitle)}</p>
                      <p style="margin:14px 0 0 0;max-width:500px;font-size:15px;line-height:1.65;color:#e4e0f4;">${escapeHtml(copy.intro)}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:28px 34px 10px 34px;">
                <p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:#0b0a12;">${escapeHtml(greeting)}</p>
                <p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:#0b0a12;">Welcome to Webcoin Labs. Your spot is reserved; verification turns it into an active waitlist profile.</p>
                <p style="margin:0 0 16px 0;font-size:15px;line-height:1.7;color:#444052;">${escapeHtml(copy.body)}</p>
                ${eligibilityBlock}
              </td>
            </tr>

${passCard}

            <tr>
              <td align="center" style="padding:0 34px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="border-radius:9999px;background-color:#0b0a12;">
                      <a href="${link}" style="display:inline-block;padding:15px 34px;font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:9999px;">Verify email</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:22px 34px 0 34px;">
                <p style="margin:0 0 4px 0;font-size:12px;line-height:1.6;color:#79778a;">If the button does not work, copy and paste this secure link into your browser:</p>
                <p style="margin:0;font-size:12px;line-height:1.6;color:#7c3aed;word-break:break-all;">${link}</p>
              </td>
            </tr>

            <tr>
              <td style="padding:22px 34px 0 34px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fbfbfd;border:1px solid #e6e5ee;border-radius:14px;">
                  <tr>
                    <td style="padding:15px 16px;font-size:13px;line-height:1.6;color:#0b0a12;">
                      Verification activates your dashboard and grants <strong>+100 WebXP</strong> during the first 7 days of the launch window.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:22px 34px 30px 34px;">
                <p style="margin:0;font-size:11px;line-height:1.6;color:#a3a1b3;">
                  ${escapeHtml(disclaimerFor(copy.passLabel))}
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 34px;border-top:1px solid #e6e5ee;background-color:#fbfbfd;">
                <p style="margin:0;font-size:12px;font-weight:bold;color:#0b0a12;">Webcoin Labs</p>
                <p style="margin:3px 0 0 0;font-size:12px;color:#79778a;">The operating system for founders.</p>
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

function buildText(verifyLink: string, greeting: string, displayName: string, role?: WaitlistEmailRole | null) {
  const copy = copyFor(role);
  const lines = [
    subjectFor(role),
    "",
    bannerTitleFor(role, displayName, copy.bannerTitle),
    "",
    greeting,
    "",
    "Welcome to Webcoin Labs. Your spot is reserved; verification turns it into an active waitlist profile.",
    "",
    stripTags(copy.intro),
    "",
    stripTags(copy.body),
  ];
  if (copy.eligibility) lines.push("", copy.eligibility);
  if (copy.passLabel && copy.passOwnerLabel && copy.passProof) {
    lines.push(
      "",
      `${copy.passLabel} access`,
      `Status: Locked until verification`,
      `${copy.passOwnerLabel}: You`,
      "Track: Arc / Base beta",
      "WebXP: +5,000",
      `Proof: ${copy.passProof}`,
    );
  }
  lines.push(
    "",
    `Verify email: ${verifyLink}`,
    "",
    "Verification activates your dashboard and grants +100 WebXP during the first 7 days of the launch window.",
    "",
    disclaimerFor(copy.passLabel),
    "",
    "Webcoin Labs",
    "The operating system for founders.",
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
        subject: subjectFor(payload.role),
        html: buildHtml(payload.verifyLink, greeting, displayNameFor(payload.toEmail, payload.name), payload.role),
        text: buildText(payload.verifyLink, greeting, displayNameFor(payload.toEmail, payload.name), payload.role),
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
  const displayName = displayNameFor(payload.toEmail, payload.name);
  const greeting = greetingFor(displayName);

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
