const BUILT_IN_DISPOSABLE_DOMAINS = new Set([
  "10minutemail.com",
  "10minutemail.net",
  "dispostable.com",
  "emailondeck.com",
  "fakeinbox.com",
  "getairmail.com",
  "getnada.com",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "maildrop.cc",
  "mailinator.com",
  "mailnesia.com",
  "mintemail.com",
  "mohmal.com",
  "mytemp.email",
  "sharklasers.com",
  "spam4.me",
  "temp-mail.org",
  "tempail.com",
  "tempmail.com",
  "tempmail.net",
  "tempmailo.com",
  "throwawaymail.com",
  "trashmail.com",
  "trashmail.net",
  "yopmail.com",
  "yopmail.fr",
  "yopmail.net",
]);

export type SignupActivityCounts = {
  ipHour: number;
  ipDay: number;
  deviceDay: number;
  ipDomainDay: number;
  deviceDomainDay: number;
};

export type SignupSecurityThresholds = {
  ipHour: number;
  ipDay: number;
  deviceDay: number;
  ipDomainDay: number;
  deviceDomainDay: number;
};

export const DEFAULT_SIGNUP_SECURITY_THRESHOLDS: SignupSecurityThresholds = {
  ipHour: 10,
  ipDay: 25,
  deviceDay: 4,
  ipDomainDay: 6,
  deviceDomainDay: 3,
};

export function emailDomain(email: string): string {
  return email.trim().toLowerCase().split("@").pop() ?? "";
}

function configuredDisposableDomains(): string[] {
  return (process.env.WAITLIST_DISPOSABLE_EMAIL_DOMAINS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function isDisposableEmailDomain(domainInput: string): boolean {
  const domain = domainInput.trim().toLowerCase().replace(/^@/, "");
  if (!domain) return false;
  const domains = [...BUILT_IN_DISPOSABLE_DOMAINS, ...configuredDisposableDomains()];
  return domains.some((blocked) => domain === blocked || domain.endsWith(`.${blocked}`));
}

export function evaluateSignupRisk(
  counts: SignupActivityCounts,
  options?: { disposable?: boolean; thresholds?: SignupSecurityThresholds },
) {
  const thresholds = options?.thresholds ?? DEFAULT_SIGNUP_SECURITY_THRESHOLDS;
  const flags: string[] = [];
  let score = 0;

  if (options?.disposable) {
    flags.push("DISPOSABLE_EMAIL");
    score = 100;
  }
  if (counts.deviceDay >= 2) score += 30;
  if (counts.ipHour >= 5) score += 20;
  if (counts.ipDay >= 12) score += 20;
  if (counts.ipDomainDay >= 3) score += 25;
  if (counts.deviceDomainDay >= 2) score += 35;

  if (counts.ipHour >= thresholds.ipHour) flags.push("IP_HOURLY_LIMIT");
  if (counts.ipDay >= thresholds.ipDay) flags.push("IP_DAILY_LIMIT");
  if (counts.deviceDay >= thresholds.deviceDay) flags.push("DEVICE_DAILY_LIMIT");
  if (counts.ipDomainDay >= thresholds.ipDomainDay) flags.push("IP_DOMAIN_LIMIT");
  if (counts.deviceDomainDay >= thresholds.deviceDomainDay) flags.push("DEVICE_DOMAIN_LIMIT");

  return {
    allowed: flags.length === 0 && score < 100,
    score: Math.min(score, 100),
    flags: score >= 100 && flags.length === 0 ? ["COMBINED_ACTIVITY_RISK"] : flags,
  };
}

export function signupSecurityThresholdsFromEnv(): SignupSecurityThresholds {
  const read = (key: string, fallback: number) => {
    const value = Number.parseInt(process.env[key] ?? "", 10);
    return Number.isFinite(value) && value > 0 ? value : fallback;
  };
  return {
    ipHour: read("WAITLIST_MAX_SIGNUPS_PER_IP_HOUR", DEFAULT_SIGNUP_SECURITY_THRESHOLDS.ipHour),
    ipDay: read("WAITLIST_MAX_SIGNUPS_PER_IP_DAY", DEFAULT_SIGNUP_SECURITY_THRESHOLDS.ipDay),
    deviceDay: read("WAITLIST_MAX_SIGNUPS_PER_DEVICE_DAY", DEFAULT_SIGNUP_SECURITY_THRESHOLDS.deviceDay),
    ipDomainDay: read("WAITLIST_MAX_SIGNUPS_PER_IP_DOMAIN_DAY", DEFAULT_SIGNUP_SECURITY_THRESHOLDS.ipDomainDay),
    deviceDomainDay: read(
      "WAITLIST_MAX_SIGNUPS_PER_DEVICE_DOMAIN_DAY",
      DEFAULT_SIGNUP_SECURITY_THRESHOLDS.deviceDomainDay,
    ),
  };
}
