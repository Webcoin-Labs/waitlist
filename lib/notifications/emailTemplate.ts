// Pure email template module - no server-only import so it can be rendered by
// scripts/tests for visual previews. All runtime secrets stay in
// waitlistVerification.ts; this file only turns strings into HTML/text.

export type WaitlistEmailRole = "FOUNDER" | "BUILDER" | "INVESTOR" | "ADVISOR";

// PNG is used deliberately: it is more reliable than WebP/SVG across Outlook,
// Gmail, Apple Mail, and mobile email clients.
const LOGO_PATH = "/logo/webcoin-wordmark-email.png";

const SOCIAL_LINKS = {
  x: "https://x.com/webcoinlabs",
  linkedIn: "https://www.linkedin.com/company/webcoin-capital",
  telegram: "https://t.me/thewebcoinlabs",
} as const;

const WAITLIST_BENEFITS = [
  {
    title: "Early product access",
    detail: "New Webcoin Labs releases",
    plainText: "Early access to Webcoin Labs products",
    tone: "#7c3aed",
    soft: "#f5f3ff",
  },
  {
    title: "Founder tools",
    detail: "Pitch deck, tokenomics generator & more",
    plainText: "Founder tools: pitch deck support, tokenomics generator, and more",
    tone: "#2563eb",
    soft: "#eff6ff",
  },
  {
    title: "Passes & introductions",
    detail: "Unlock exclusive Founder Pass",
    plainText: "Unlock the exclusive Founder Pass",
    tone: "#0891b2",
    soft: "#ecfeff",
  },
  {
    title: "2,000+ VC & angel network",
    detail: "Meet investors who can help you raise funds",
    plainText: "Access a network of 2,000+ VCs and angel investors to help you raise funds",
    tone: "#059669",
    soft: "#ecfdf5",
  },
] as const;

type RoleCopy = {
  preheader: string;
  accessLabel: string;
  roleLine: string;
  activationExtra: string;
  passDisclaimer: boolean;
};

const ROLE_COPY: Record<WaitlistEmailRole, RoleCopy> = {
  FOUNDER: {
    preheader: "Confirm your email to activate your founder waitlist profile and Credits.",
    accessLabel: "Founder early access",
    roleLine:
      "After verification, you'll unlock your Credits, referral link, and Founder Pass consideration after beta launch for selected founders.",
    activationExtra: "Founder Pass consideration after beta launch",
    passDisclaimer: true,
  },
  BUILDER: {
    preheader: "Confirm your email to activate your builder profile and Builder Pass eligibility.",
    accessLabel: "Builder early access",
    roleLine:
      "After verification, you'll unlock your Credits, referral link, and Builder Pass eligibility for builders shipping on Arc and Base.",
    activationExtra: "Builder Pass eligibility",
    passDisclaimer: true,
  },
  INVESTOR: {
    preheader: "Confirm your email to activate your investor waitlist profile.",
    accessLabel: "Investor early access",
    roleLine:
      "After verification, you'll unlock your Credits, referral link, and Verified deal-flow access to curated founder and builder profiles.",
    activationExtra: "Verified deal-flow access",
    passDisclaimer: false,
  },
  ADVISOR: {
    preheader: "Confirm your email to activate your advisor waitlist profile.",
    accessLabel: "Advisor early access",
    roleLine:
      "After verification, you'll unlock your Credits, referral link, and advisor matching inside Webcoin Labs.",
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

/** Resolves public assets and legal pages against the verification origin. */
function baseUrlFrom(verifyLink: string): string {
  try {
    return new URL(verifyLink).origin;
  } catch {
    return "https://www.webcoinlabs.com";
  }
}

function disclaimerFor(passDisclaimer: boolean): string {
  return passDisclaimer
    ? "Credits, Builder Pass, and Founder Pass are promotional in-app access systems. They have no monetary value, no token value, no airdrop value, and do not represent ownership, investment, or financial rights."
    : "Credits are a promotional in-app points system. They have no monetary value, no token value, no airdrop value, and do not represent ownership, investment, or financial rights.";
}

const SECURITY_NOTE =
  "Always verify that links open on the official Webcoin Labs website. We will never ask for your password, private keys, seed phrase, or wallet recovery phrase by email.";

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
  const termsUrl = escapeHtml(`${baseUrl}/terms`);
  const privacyUrl = escapeHtml(`${baseUrl}/privacy`);
  const riskUrl = escapeHtml(`${baseUrl}/risk-warning`);

  const activationRows = [0, 2]
    .map((start) => {
      const cells = WAITLIST_BENEFITS.slice(start, start + 2).map(
        (item, index) => `<td class="benefit-cell" width="50%" valign="top" style="width:50%;padding:${start === 0 ? "0 4px 8px" : "0 4px"};">
          <table role="presentation" width="100%" height="72" cellpadding="0" cellspacing="0" bgcolor="${item.soft}" style="width:100%;height:72px;border-collapse:separate;background-color:${item.soft};border:1px solid #e4e7ec;border-top:2px solid ${item.tone};border-radius:10px;">
            <tr>
              <td width="31" valign="top" style="width:31px;padding:10px 0 9px 10px;">
                <span style="display:inline-block;width:18px;height:18px;border-radius:999px;background-color:#ffffff;color:${item.tone};font-size:9px;font-weight:800;line-height:18px;text-align:center;">0${start + index + 1}</span>
              </td>
              <td valign="top" style="padding:9px 9px 8px 5px;">
                <p class="benefit-title" style="margin:0;font-size:11px;font-weight:800;line-height:1.35;color:#111827;">${escapeHtml(item.title)}</p>
                <p class="benefit-detail" style="margin:3px 0 0 0;font-size:9.5px;font-weight:600;line-height:1.35;color:#667085;">${escapeHtml(item.detail)}</p>
              </td>
            </tr>
          </table>
        </td>`,
      );
      return `<tr>${cells.join("")}</tr>`;
    })
    .join("");

  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>${escapeHtml(subject)}</title>
    <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
    <style>
      html, body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
      table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
      a { color: inherit; }
      a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
      .brand-accent { background-color: #7c3aed; background-image: linear-gradient(90deg,#7c3aed 0%,#2563eb 48%,#06b6d4 100%); background-size: 220% 100%; }
      .pulse-dot { display: inline-block; transform-origin: center; }
      @keyframes wclSweep { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
      @keyframes wclPulse { 0%,100% { opacity: .55; transform: scale(.82); } 50% { opacity: 1; transform: scale(1); } }
      @media (prefers-reduced-motion: no-preference) {
        .brand-accent { animation: wclSweep 6s ease-in-out infinite; }
        .pulse-dot { animation: wclPulse 2.4s ease-in-out infinite; }
      }
      @media (prefers-reduced-motion: reduce) {
        .brand-accent, .pulse-dot { animation: none !important; }
      }
      @media only screen and (max-width: 620px) {
        .body-table { width: 100% !important; min-width: 0 !important; table-layout: fixed !important; }
        .outer-pad { padding: 8px 6px !important; }
        .email-shell { width: 100% !important; max-width: 100% !important; min-width: 0 !important; table-layout: fixed !important; }
        .mobile-pad { padding-left: 18px !important; padding-right: 18px !important; }
        .hero-pad { padding-top: 22px !important; }
        .email-heading { font-size: 25px !important; line-height: 1.16 !important; }
        .benefit-cell { width: 50% !important; }
        .benefit-title { font-size: 10px !important; line-height: 1.3 !important; }
        .benefit-detail { font-size: 8.5px !important; line-height: 1.3 !important; }
        .word-art { font-size: 8px !important; }
        .social-link { display: inline-block !important; margin: 0 12px 8px 0 !important; }
        .hide-mobile { display: none !important; max-height: 0 !important; overflow: hidden !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background-color:#eef0f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-text-size-adjust:100%;text-size-adjust:100%;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">${escapeHtml(copy.preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>

    <table role="presentation" class="body-table" width="100%" cellpadding="0" cellspacing="0" bgcolor="#eef0f4" style="width:100%;background-color:#eef0f4;">
      <tr>
        <td class="outer-pad" align="center" style="padding:32px 12px;">
          <table role="presentation" class="email-shell" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background-color:#ffffff;border:1px solid #dde1e8;border-radius:18px;overflow:hidden;box-shadow:0 12px 32px rgba(15,23,42,0.08);">
            <tr>
              <td class="mobile-pad" bgcolor="#111217" style="padding:18px 28px;background-color:#111217;border-radius:18px 18px 0 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td valign="middle">
                      <img src="${logoUrl}" alt="Webcoin Labs" width="142" style="display:block;width:142px;max-width:142px;height:auto;border:0;" />
                    </td>
                    <td class="hide-mobile" align="right" valign="middle">
                      <span style="display:inline-block;border:1px solid #343741;border-radius:999px;padding:6px 9px;font-size:8px;font-weight:800;letter-spacing:0.11em;line-height:1;color:#d4d4d8;text-transform:uppercase;"><span class="pulse-dot" style="width:6px;height:6px;border-radius:999px;background-color:#22d3ee;vertical-align:-1px;"></span>&nbsp;&nbsp;Secure email</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="brand-accent" height="3" bgcolor="#7c3aed" style="height:3px;font-size:0;line-height:0;background-color:#7c3aed;background-image:linear-gradient(90deg,#7c3aed 0%,#2563eb 48%,#06b6d4 100%);background-size:220% 100%;">&nbsp;</td>
            </tr>

            <tr>
              <td class="mobile-pad hero-pad" style="padding:28px 36px 0 36px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td valign="middle"><p style="margin:0;font-size:9.5px;font-weight:800;letter-spacing:0.11em;line-height:1.4;color:#6d28d9;text-transform:uppercase;">${escapeHtml(copy.accessLabel)}</p></td>
                    <td align="right" valign="middle"><p class="word-art" style="margin:0;font-size:8.5px;font-weight:900;letter-spacing:0.08em;line-height:1.4;text-transform:uppercase;"><span style="color:#7c3aed;">Build</span><span style="color:#c0c4cc;">&nbsp;/&nbsp;</span><span style="color:#2563eb;">Launch</span><span style="color:#c0c4cc;">&nbsp;/&nbsp;</span><span style="color:#0891b2;">Grow</span></p></td>
                  </tr>
                </table>
                <h1 class="email-heading" style="margin:7px 0 0 0;font-size:28px;font-weight:800;letter-spacing:-0.025em;line-height:1.14;color:#101114;">Confirm your email.</h1>
                <p style="margin:16px 0 0 0;font-size:14px;line-height:1.55;color:#30333a;">Hi ${greetName},</p>
                <p style="margin:7px 0 0 0;font-size:14px;line-height:1.55;color:#30333a;">You're one step away. Confirm this email address to activate your Webcoin Labs waitlist profile.</p>
                <p style="margin:7px 0 0 0;font-size:12.5px;line-height:1.55;color:#5b606b;">${escapeHtml(copy.roleLine)}</p>
              </td>
            </tr>

            <tr>
              <td class="mobile-pad" style="padding:19px 36px 0 36px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" bgcolor="#111217" style="background-color:#111217;border-radius:10px;">
                      <a href="${link}" target="_blank" style="display:inline-block;padding:12px 20px;font-size:13px;font-weight:800;line-height:1;color:#ffffff;text-decoration:none;border-radius:10px;">Verify my email&nbsp;&nbsp;&rarr;</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:8px 0 0 0;font-size:10px;line-height:1.5;color:#7a808c;">This secure link expires in 24 hours. If you did not request access, you can safely ignore this email.</p>
              </td>
            </tr>

            <tr>
              <td class="mobile-pad" style="padding:22px 32px 0 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="table-layout:fixed;">
                  <tr>
                    <td colspan="2" style="padding:0 4px 9px 4px;font-size:10px;font-weight:800;letter-spacing:0.1em;line-height:1.4;color:#6b7280;text-transform:uppercase;">Verification unlocks</td>
                  </tr>
                  ${activationRows}
                </table>
              </td>
            </tr>

            <tr>
              <td class="mobile-pad" style="padding:18px 36px 0 36px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#f8fafc" style="width:100%;background-color:#f8fafc;border:1px solid #e5e7eb;border-radius:10px;">
                  <tr>
                    <td style="padding:11px 13px;">
                      <p style="margin:0 0 3px 0;font-size:10px;font-weight:800;line-height:1.45;color:#30333a;">Button not working?</p>
                      <p style="margin:0 0 4px 0;font-size:9.5px;line-height:1.5;color:#6b7280;">Copy and paste this secure link into your browser:</p>
                      <a href="${link}" target="_blank" style="display:block;width:100%;max-width:100%;font-size:9.5px;line-height:1.5;color:#4f46e5;text-decoration:underline;word-break:break-all;overflow-wrap:anywhere;">${link}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="mobile-pad" style="padding:15px 36px 25px 36px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-left:3px solid #6d28d9;">
                  <tr>
                    <td style="padding:2px 0 2px 12px;">
                      <p style="margin:0 0 3px 0;font-size:10px;font-weight:800;line-height:1.45;color:#30333a;">Security reminder</p>
                      <p style="margin:0;font-size:9.5px;line-height:1.55;color:#6b7280;">${escapeHtml(SECURITY_NOTE)}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td class="mobile-pad" bgcolor="#111217" style="padding:20px 36px;background-color:#111217;">
                <p style="margin:0;font-size:12px;font-weight:800;line-height:1.45;color:#ffffff;">Webcoin Labs</p>
                <p style="margin:3px 0 11px 0;font-size:10px;line-height:1.5;color:#aeb2bc;">The operating system for founders and serious builders.</p>
                <p style="margin:0;font-size:10px;font-weight:700;line-height:1.7;color:#ffffff;">
                  <a class="social-link" href="${SOCIAL_LINKS.x}" target="_blank" style="color:#ffffff;text-decoration:underline;">X / Twitter</a>
                  <span class="hide-mobile" style="color:#5f6470;">&nbsp;&nbsp;&middot;&nbsp;&nbsp;</span>
                  <a class="social-link" href="${SOCIAL_LINKS.linkedIn}" target="_blank" style="color:#ffffff;text-decoration:underline;">LinkedIn</a>
                  <span class="hide-mobile" style="color:#5f6470;">&nbsp;&nbsp;&middot;&nbsp;&nbsp;</span>
                  <a class="social-link" href="${SOCIAL_LINKS.telegram}" target="_blank" style="color:#ffffff;text-decoration:underline;">Telegram</a>
                </p>
              </td>
            </tr>
          </table>

          <table role="presentation" class="email-shell" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;">
            <tr>
              <td class="mobile-pad" align="center" style="padding:14px 26px 0 26px;">
                <p style="margin:0 0 7px 0;font-size:10px;line-height:1.55;color:#606672;">
                  <a href="${termsUrl}" target="_blank" style="color:#30333a;text-decoration:underline;">Terms &amp; Conditions</a>
                  &nbsp;&nbsp;&middot;&nbsp;&nbsp;
                  <a href="${privacyUrl}" target="_blank" style="color:#30333a;text-decoration:underline;">Privacy Policy</a>
                  &nbsp;&nbsp;&middot;&nbsp;&nbsp;
                  <a href="${riskUrl}" target="_blank" style="color:#30333a;text-decoration:underline;">Risk Warning</a>
                </p>
                <p style="margin:0 0 5px 0;font-size:9px;line-height:1.5;color:#747b87;">${escapeHtml(disclaimerFor(copy.passDisclaimer))}</p>
                <p style="margin:0 0 5px 0;font-size:9px;line-height:1.5;color:#747b87;">${escapeHtml(RISK_NOTE)}</p>
                <p style="margin:0 0 3px 0;font-size:9px;line-height:1.5;color:#8a909b;">You received this transactional email because you requested early access at Webcoin Labs.</p>
                <p style="margin:0 0 3px 0;font-size:9px;line-height:1.5;color:#8a909b;">Need help? <a href="mailto:contact@webcoinlabs.com" style="color:#606672;text-decoration:underline;">contact@webcoinlabs.com</a></p>
                <p style="margin:0;font-size:9px;line-height:1.5;color:#8a909b;">&copy; 2026 Webcoin Labs. All rights reserved.</p>
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
    "WEB COIN LABS - EMAIL VERIFICATION",
    "",
    `Hi ${displayName || "there"},`,
    "",
    "You're one step away. Confirm this email address to activate your Webcoin Labs waitlist profile.",
    "",
    copy.roleLine,
    "",
    "Verify my email:",
    verifyLink,
    "",
    "This secure link expires in 24 hours. If you did not request access, you can safely ignore this email.",
    "",
    "Verification unlocks:",
    ...WAITLIST_BENEFITS.map((benefit) => `- ${benefit.plainText}`),
    `- ${copy.activationExtra}`,
    "",
    "Security reminder:",
    SECURITY_NOTE,
    "",
    "Important information:",
    disclaimerFor(copy.passDisclaimer),
    "",
    RISK_NOTE,
    "",
    `Terms & Conditions: ${baseUrl}/terms`,
    `Privacy Policy: ${baseUrl}/privacy`,
    `Risk Warning: ${baseUrl}/risk-warning`,
    "",
    `X / Twitter: ${SOCIAL_LINKS.x}`,
    `LinkedIn: ${SOCIAL_LINKS.linkedIn}`,
    `Telegram: ${SOCIAL_LINKS.telegram}`,
    "",
    "You received this transactional email because you requested early access at Webcoin Labs.",
    "Need help? Contact contact@webcoinlabs.com",
    "",
    "(c) 2026 Webcoin Labs. All rights reserved.",
  ].join("\n");
}

export function waitlistWelcomeSubject(): string {
  return "You're on the Webcoin Labs waitlist";
}

export function buildWaitlistWelcomeHtml({
  dashboardLink,
  displayName,
  role,
}: {
  dashboardLink: string;
  displayName: string;
  role?: WaitlistEmailRole | null;
}): string {
  const link = escapeHtml(dashboardLink);
  const baseUrl = baseUrlFrom(dashboardLink);
  const logoUrl = escapeHtml(`${baseUrl}${LOGO_PATH}`);
  const greetName = escapeHtml(displayName || "there");
  const roleCopy = copyFor(role);
  const termsUrl = escapeHtml(`${baseUrl}/terms`);
  const privacyUrl = escapeHtml(`${baseUrl}/privacy`);
  const subject = waitlistWelcomeSubject();
  const benefits = [
    ["Product updates", "Be among the first to hear about launches and early-access windows."],
    ["Tools and access", "Follow founder tools, Pass consideration, and selected introductions."],
    ["Network opportunities", "Discover relevant opportunities across our 2,000+ VC and angel network."],
  ] as const;

  const benefitRows = benefits
    .map(
      ([title, detail]) => `<tr>
        <td width="34" valign="top" style="width:34px;padding:0 0 12px 0;">
          <span style="display:inline-block;width:22px;height:22px;border-radius:7px;background-color:#dcfce7;color:#15803d;font-size:13px;font-weight:800;line-height:22px;text-align:center;">&#10003;</span>
        </td>
        <td valign="top" style="padding:0 0 12px 0;">
          <p style="margin:0;font-size:13px;font-weight:800;line-height:1.4;color:#111827;">${escapeHtml(title)}</p>
          <p style="margin:2px 0 0 0;font-size:12px;line-height:1.55;color:#667085;">${escapeHtml(detail)}</p>
        </td>
      </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>${escapeHtml(subject)}</title>
    <style>
      html, body { margin:0 !important; padding:0 !important; width:100% !important; }
      table, td { border-collapse:collapse; mso-table-lspace:0; mso-table-rspace:0; }
      img { border:0; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
      a { color:inherit; }
      @media only screen and (max-width:620px) {
        .outer-pad { padding:8px 6px !important; }
        .email-shell { width:100% !important; max-width:100% !important; min-width:0 !important; table-layout:fixed !important; }
        .mobile-pad { padding-left:20px !important; padding-right:20px !important; }
        .email-heading { font-size:26px !important; line-height:1.15 !important; }
        .dashboard-button { display:block !important; text-align:center !important; }
        .social-link { display:inline-block !important; margin:0 12px 7px 0 !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background-color:#eef0f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-text-size-adjust:100%;text-size-adjust:100%;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">Your email is verified and your Webcoin Labs waitlist profile is active.&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#eef0f4" style="width:100%;background-color:#eef0f4;">
      <tr>
        <td class="outer-pad" align="center" style="padding:32px 12px;">
          <table role="presentation" class="email-shell" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background-color:#ffffff;border:1px solid #dde1e8;border-radius:18px;overflow:hidden;box-shadow:0 12px 32px rgba(15,23,42,0.08);">
            <tr>
              <td class="mobile-pad" bgcolor="#111217" style="padding:18px 30px;background-color:#111217;border-radius:18px 18px 0 0;">
                <img src="${logoUrl}" alt="Webcoin Labs" width="142" style="display:block;width:142px;max-width:142px;height:auto;" />
              </td>
            </tr>
            <tr>
              <td class="mobile-pad" align="center" style="padding:32px 38px 0 38px;">
                <table role="presentation" width="72" height="72" cellpadding="0" cellspacing="0" bgcolor="#dcfce7" style="width:72px;height:72px;background-color:#dcfce7;border:1px solid #bbf7d0;border-radius:999px;">
                  <tr><td role="img" aria-label="Verified" align="center" valign="middle" style="font-size:32px;font-weight:800;line-height:72px;color:#15803d;">&#10003;</td></tr>
                </table>
                <p style="margin:18px 0 0 0;font-size:10px;font-weight:800;letter-spacing:0.11em;line-height:1.4;color:#15803d;text-transform:uppercase;">Email verified</p>
                <h1 class="email-heading" style="margin:8px 0 0 0;font-size:30px;font-weight:800;letter-spacing:-0.025em;line-height:1.15;color:#101114;">Congratulations—you made it to the Webcoin Labs waitlist.</h1>
                <p style="margin:14px 0 0 0;font-size:14px;line-height:1.6;color:#30333a;">Hi ${greetName}, your verified profile is active. We’ll email you when products launch, access windows open, or relevant opportunities become available.</p>
              </td>
            </tr>
            <tr>
              <td class="mobile-pad" style="padding:24px 38px 0 38px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#f8fafc" style="width:100%;background-color:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;">
                  <tr>
                    <td style="padding:18px 18px 6px 18px;">
                      <p style="margin:0 0 14px 0;font-size:10px;font-weight:800;letter-spacing:0.1em;line-height:1.4;color:#6b7280;text-transform:uppercase;">What your place includes</p>
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${benefitRows}</table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="mobile-pad" style="padding:22px 38px 0 38px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" bgcolor="#111217" style="background-color:#111217;border-radius:10px;">
                      <a class="dashboard-button" href="${link}" target="_blank" style="display:inline-block;padding:13px 22px;font-size:13px;font-weight:800;line-height:1;color:#ffffff;text-decoration:none;border-radius:10px;">Open my dashboard&nbsp;&nbsp;&rarr;</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:10px 0 0 0;font-size:10px;line-height:1.55;color:#7a808c;">Your dashboard tracks Credits, referrals, access status, and available launch tasks.</p>
              </td>
            </tr>
            <tr>
              <td class="mobile-pad" style="padding:22px 38px 28px 38px;">
                <p style="margin:0;font-size:10px;line-height:1.55;color:#7a808c;">${escapeHtml(roleCopy.accessLabel)} benefits, Pass consideration, introductions, and network opportunities remain subject to eligibility and availability.</p>
              </td>
            </tr>
            <tr>
              <td class="mobile-pad" bgcolor="#111217" style="padding:20px 30px;background-color:#111217;">
                <p style="margin:0;font-size:12px;font-weight:800;line-height:1.45;color:#ffffff;">Webcoin Labs</p>
                <p style="margin:3px 0 10px 0;font-size:10px;line-height:1.5;color:#aeb2bc;">The operating system for founders and serious builders.</p>
                <p style="margin:0;font-size:10px;font-weight:700;line-height:1.7;color:#ffffff;">
                  <a class="social-link" href="${SOCIAL_LINKS.x}" target="_blank" style="color:#ffffff;text-decoration:underline;">X / Twitter</a>&nbsp;&nbsp;&middot;&nbsp;&nbsp;
                  <a class="social-link" href="${SOCIAL_LINKS.linkedIn}" target="_blank" style="color:#ffffff;text-decoration:underline;">LinkedIn</a>&nbsp;&nbsp;&middot;&nbsp;&nbsp;
                  <a class="social-link" href="${SOCIAL_LINKS.telegram}" target="_blank" style="color:#ffffff;text-decoration:underline;">Telegram</a>
                </p>
              </td>
            </tr>
          </table>
          <table role="presentation" class="email-shell" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;">
            <tr>
              <td class="mobile-pad" align="center" style="padding:14px 26px 0 26px;">
                <p style="margin:0 0 7px 0;font-size:9px;line-height:1.5;color:#747b87;">
                  <a href="${termsUrl}" target="_blank" style="color:#30333a;text-decoration:underline;">Terms &amp; Conditions</a>&nbsp;&nbsp;&middot;&nbsp;&nbsp;
                  <a href="${privacyUrl}" target="_blank" style="color:#30333a;text-decoration:underline;">Privacy Policy</a>
                </p>
                <p style="margin:0 0 4px 0;font-size:9px;line-height:1.5;color:#8a909b;">You received this transactional email because you joined the Webcoin Labs waitlist.</p>
                <p style="margin:0;font-size:9px;line-height:1.5;color:#8a909b;">Need help? <a href="mailto:contact@webcoinlabs.com" style="color:#606672;text-decoration:underline;">contact@webcoinlabs.com</a> &nbsp;&middot;&nbsp; &copy; 2026 Webcoin Labs.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildWaitlistWelcomeText({
  dashboardLink,
  displayName,
  role,
}: {
  dashboardLink: string;
  displayName: string;
  role?: WaitlistEmailRole | null;
}): string {
  const baseUrl = baseUrlFrom(dashboardLink);
  const roleCopy = copyFor(role);
  return [
    "CONGRATULATIONS - YOU'RE ON THE WEBCOIN LABS WAITLIST",
    "",
    `Hi ${displayName || "there"},`,
    "",
    "Your email is verified and your waitlist profile is active.",
    "We'll email you when products launch, access windows open, or relevant opportunities become available.",
    "",
    "What your place includes:",
    "- Product updates and early-access windows",
    "- Founder tools, Pass consideration, and selected introductions",
    "- Opportunities across our 2,000+ VC and angel network",
    "",
    "Open my dashboard:",
    dashboardLink,
    "",
    `Note: ${roleCopy.accessLabel} benefits, Pass consideration, introductions, and network opportunities remain subject to eligibility and availability.`,
    "",
    `Terms & Conditions: ${baseUrl}/terms`,
    `Privacy Policy: ${baseUrl}/privacy`,
    "Need help? Contact contact@webcoinlabs.com",
    "",
    "(c) 2026 Webcoin Labs.",
  ].join("\n");
}
