export const WAITLIST_TASK_REWARDS = {
  X_SHARE: 200,
  THREE_VERIFIED_REFERRALS: 150,
  FOUNDER_PASS_ELIGIBILITY_CHECK: 5000,
} as const;

function cleanHandle(value: string | undefined): string | null {
  const cleaned = value?.trim().replace(/^@/, "");
  if (!cleaned) return null;
  return `@${cleaned}`;
}

export function buildXShareText({
  referralUrl,
  arcHandle = process.env.NEXT_PUBLIC_ARC_X_HANDLE,
  baseHandle = process.env.NEXT_PUBLIC_BASE_X_HANDLE,
}: {
  referralUrl: string;
  arcHandle?: string;
  baseHandle?: string;
}): string {
  const arc = cleanHandle(arcHandle);
  const base = cleanHandle(baseHandle);
  const networks = arc && base ? `${arc} or ${base}` : arc ?? base ?? "Arc or Base";

  return [
    "I just joined the Webcoin Labs waitlist - the founder OS for builders shipping real companies.",
    "",
    `Building on ${networks}? Founder Pass beta is opening for eligible builders.`,
    "",
    "Use my referral link to get +100 WebXP:",
    referralUrl,
    "",
    "#WebcoinLabs #FounderPass",
  ].join("\n");
}

export function buildXShareUrl(input: { referralUrl: string; arcHandle?: string; baseHandle?: string }): string {
  return `https://x.com/intent/tweet?text=${encodeURIComponent(buildXShareText(input))}`;
}
