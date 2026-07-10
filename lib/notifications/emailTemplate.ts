// Pure email template module — no server-only import so it can be rendered by
// scripts/tests for visual previews. All runtime secrets stay in
// waitlistVerification.ts; this file only turns strings into HTML/text.

export type WaitlistEmailRole = "FOUNDER" | "BUILDER" | "INVESTOR" | "ADVISOR";

const LOGO_PATH = "/logo/webcoin-wordmark-dark.webp";

type RoleCopy = {
  preheader: string;
  roleLine: string;
  activationExtra: string;
  passDisclaimer: boolean;
};

const ROLE_COPY: Record<WaitlistEmailRole, RoleCopy> = {
  FOUNDER: {
    preheader: "Activate your waitlist profile, WebXP, referral link, and access eligibility.",
    roleLine:
      "After verification, you’ll unlock your WebXP, referral link, and Founder Pass consideration for selected founders after beta launch.",
    activationExtra: "Founder Pass consideration after beta launch",
    passDisclaimer: true,
  },
  BUILDER: {
    preheader: "Activate your waitlist profile, WebXP, referral link, and Builder Pass eligibility.",
    roleLine:
      "After verification, you’ll unlock your WebXP, referral link, and Builder Pass eligibility for builders shipping on Arc and Base.",
    activationExtra: "Builder Pass eligibility",
    passDisclaimer: true,
  },
  INVESTOR: {
    preheader: "Activate your waitlist profile and verified deal-flow access.",
    roleLine:
      "After verification, you’ll unlock your WebXP, referral link, and curated access to verified founder and builder profiles.",
    activationExtra: "Verified deal-flow access",
    passDisclaimer: false,
  },
  ADVISOR: {
    preheader: "Activate your waitlist profile and advisor network access.",
    roleLine:
      "After verification, you’ll unlock your WebXP, referral link, and advisor matching inside Webcoin Labs.",
    activationExtra: "Advisor matching access",
    passDisclaimer: false,
  },
};

function copyFor(role?: WaitlistEmailRole | null): RoleCopy {
  return ROLE_COPY[role ?? "FOUNDER"] ?? ROLE_COPY.FOUNDER;
}

export function subjectFor(role?: WaitlistEmailRole | null): string {
  switch (role) {
    case "BUILDER":
      return "Verify your Webcoin Labs builder access";
    case "INVESTOR":
      return "Verify your Webcoin Labs investor access";
    case "ADVISOR":
      return "Verify your Webcoin Labs advisor access";
    case "FOUNDER":
    default:
      return "Verify your Webcoin Labs early access";
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Resolves a public asset path against the environment the verify link points at. */
function baseUrlFrom(verifyLink: string): string {
  try {
    return new URL(verifyLink).origin;
  } catch {
    return "https://www.webcoinlabs.com";
  }
}

function disclaimerFor(passDisclaimer: boolean): string {
  return passDisclaimer
    ? "WebXP, Builder Pass, and Founder Pass are promotional in-app access systems. They have no monetary value, no token value, no airdrop value, and do not represent ownership, investment, or financial rights."
    : "WebXP is a promotional in-app points system. It has no monetary value, no token value, no airdrop value, and does not represent ownership, investment, or financial rights.";
}

const SECURITY_NOTE =
  "Kindly note: always make sure you are visiting the official Webcoin Labs website before entering sensitive information. Webcoin Labs will never ask for your password, private keys, seed phrase, or wallet recovery phrase by email.";

const RISK_NOTE =
  "Nothing in this email is financial, investment, legal, or tax advice. Access to Webcoin Labs features, introductions, directories, or opportunities is not guaranteed and may be subject to review, availability, and eligibility.";

export function buildVerificationHtml({
  verifyLink,
  displayName,
  role,
}: {
  verifyLink: string;
  displayName: string;
  role?: WaitlistEmailRole | null;
}): string {
  const link = escapeHtml(verifyLink);
  const copy = copyFor(role);
  const subject = subjectFor(role);
  const baseUrl = baseUrlFrom(verifyLink);
  const logoUrl = escapeHtml(`${baseUrl}${LOGO_PATH}`);
  const greetName = escapeHtml(displayName || "there");

  const activationItems = ["Waitlist profile", "+100 WebXP during the first 7 days", "Referral link", copy.activationExtra];
  const activationRows = activationItems
    .map(
      (item) =>
        `<tr><td style="padding:3px 0;font-size:13px;line-height:1.55;color:#374151;"><span style="color:#6d28d9;">&bull;</span>&nbsp;&nbsp;${escapeHtml(item)}</td></tr>`,
    )
    .join("");

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-text-size-adjust:100%;text-size-adjust:100%;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(copy.preheader)}</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f7;">
      <tr>
        <td align="center" style="padding:28px 12px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border:1px solid #e5e7eb;border-radius:16px;">

            <tr>
              <td style="padding:26px 26px 0 26px;">
                <img src="${logoUrl}" alt="Webcoin Labs" width="132" style="display:block;width:132px;max-width:132px;height:auto;border:0;" />
              </td>
            </tr>

            <tr>
              <td style="padding:26px 26px 0 26px;">
                <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#6d28d9;">Private beta access</p>
                <h1 style="margin:8px 0 0 0;font-size:22px;line-height:1.3;font-weight:700;color:#111827;">${escapeHtml(subject)}</h1>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 26px 0 26px;">
                <p style="margin:0 0 12px 0;font-size:14px;line-height:1.65;color:#374151;">Hi ${greetName},</p>
                <p style="margin:0 0 12px 0;font-size:14px;line-height:1.65;color:#374151;">Verify your email to activate your Webcoin Labs waitlist profile.</p>
                <p style="margin:0 0 12px 0;font-size:14px;line-height:1.65;color:#374151;">${escapeHtml(copy.roleLine)}</p>
                <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280;">Webcoin Labs is the OS for founders and serious builders &mdash; launch faster, prove execution, and become investor-ready.</p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:22px 26px 0 26px;">
                <a href="${link}" style="display:inline-block;background-color:#111827;color:#ffffff;border-radius:999px;padding:13px 30px;font-size:14px;font-weight:700;text-decoration:none;">Verify email</a>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:12px 26px 0 26px;">
                <p style="margin:0;font-size:12px;line-height:1.6;color:#6b7280;">This secure link expires in 24 hours. If you did not request this email, you can safely ignore it.</p>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 26px 0 26px;">
                <p style="margin:0 0 3px 0;font-size:12px;line-height:1.6;color:#6b7280;">If the button does not work, copy and paste this secure link into your browser:</p>
                <p style="margin:0;font-size:12px;line-height:1.6;color:#2563eb;word-break:break-all;">${link}</p>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 26px 0 26px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;">
                  <tr>
                    <td style="padding:14px 16px;">
                      <p style="margin:0 0 6px 0;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#111827;">Verification activates</p>
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${activationRows}</table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 26px 26px 26px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e7eb;">
                  <tr>
                    <td style="padding-top:18px;">
                      <p style="margin:0 0 10px 0;font-size:11px;line-height:1.6;color:#6b7280;">${escapeHtml(SECURITY_NOTE)}</p>
                      <p style="margin:0 0 10px 0;font-size:11px;line-height:1.6;color:#6b7280;">${escapeHtml(disclaimerFor(copy.passDisclaimer))}</p>
                      <p style="margin:0 0 12px 0;font-size:11px;line-height:1.6;color:#6b7280;">${escapeHtml(RISK_NOTE)}</p>
                      <p style="margin:0 0 12px 0;font-size:11px;line-height:1.6;">
                        <a href="${escapeHtml(`${baseUrl}/terms`)}" style="color:#2563eb;text-decoration:underline;">Terms of Use</a>
                        &nbsp;&middot;&nbsp;
                        <a href="${escapeHtml(`${baseUrl}/privacy`)}" style="color:#2563eb;text-decoration:underline;">Privacy Policy</a>
                        &nbsp;&middot;&nbsp;
                        <a href="${escapeHtml(`${baseUrl}/risk-warning`)}" style="color:#2563eb;text-decoration:underline;">Risk Warning</a>
                      </p>
                      <p style="margin:0 0 4px 0;font-size:11px;line-height:1.6;color:#9ca3af;">You are receiving this email because you requested early access to Webcoin Labs.</p>
                      <p style="margin:0 0 4px 0;font-size:11px;line-height:1.6;color:#9ca3af;">Need help? Contact us at <a href="mailto:contact@webcoinlabs.com" style="color:#6b7280;text-decoration:underline;">contact@webcoinlabs.com</a></p>
                      <p style="margin:0;font-size:11px;line-height:1.6;color:#9ca3af;">&copy; 2026 Webcoin Labs. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildVerificationText({
  verifyLink,
  displayName,
  role,
}: {
  verifyLink: string;
  displayName: string;
  role?: WaitlistEmailRole | null;
}): string {
  const copy = copyFor(role);
  const baseUrl = baseUrlFrom(verifyLink);
  return [
    `Hi ${displayName || "there"},`,
    "",
    "Verify your email to activate your Webcoin Labs waitlist profile.",
    "",
    copy.roleLine.replace(/’/g, "'"),
    "",
    `Verify here:`,
    verifyLink,
    "",
    "This secure link expires in 24 hours. If you did not request this email, you can safely ignore it.",
    "",
    "Verification activates:",
    "- Waitlist profile",
    "- +100 WebXP during the first 7 days",
    "- Referral link",
    `- ${copy.activationExtra}`,
    "",
    "Security note:",
    "Always make sure you are visiting the official Webcoin Labs website. Webcoin Labs will never ask for your password, private keys, seed phrase, or wallet recovery phrase by email.",
    "",
    "Disclaimer:",
    disclaimerFor(copy.passDisclaimer),
    "",
    RISK_NOTE,
    "",
    `Terms: ${baseUrl}/terms`,
    `Privacy: ${baseUrl}/privacy`,
    `Risk Warning: ${baseUrl}/risk-warning`,
    "",
    "You are receiving this email because you requested early access to Webcoin Labs.",
    "Need help? Contact contact@webcoinlabs.com",
    "",
    "(c) 2026 Webcoin Labs. All rights reserved.",
  ].join("\n");
}
