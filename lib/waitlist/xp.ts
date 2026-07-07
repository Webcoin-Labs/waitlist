/**
 * lib/waitlist/xp.ts
 * ─────────────────────────────────────────
 * Pure WebXP + ranking logic for the early-access waitlist. No DB, no I/O — so
 * the launch-window / award / ordering rules are unit-testable in isolation.
 *
 * Rules:
 *   First 7 days from launch:  +100 join / +20 verified referral
 *   After 7 days:              +50  join / +10 verified referral
 * XP is only ever awarded after email verification (enforced by the action).
 */

export const LAUNCH_WINDOW_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Fallback launch date if WAITLIST_LAUNCH_AT is unset/invalid. */
const DEFAULT_LAUNCH_AT = new Date("2026-07-05T00:00:00.000Z");

export function getLaunchAt(): Date {
  const raw = process.env.WAITLIST_LAUNCH_AT;
  if (raw) {
    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return DEFAULT_LAUNCH_AT;
}

export function isWithinLaunchWindow(at: Date, launchAt: Date, windowDays: number = LAUNCH_WINDOW_DAYS): boolean {
  const end = launchAt.getTime() + windowDays * DAY_MS;
  return at.getTime() < end;
}

/** WebXP awarded for a verified signup, based on when the entry was created. */
export function joiningXp(joinedAt: Date, launchAt: Date): number {
  return isWithinLaunchWindow(joinedAt, launchAt) ? 100 : 50;
}

/** WebXP awarded to the referrer when a referred entry verifies. */
export function referralXp(referredJoinedAt: Date, launchAt: Date): number {
  return isWithinLaunchWindow(referredJoinedAt, launchAt) ? 20 : 10;
}

/** Statuses that appear in the ranking. PENDING/BLOCKED never rank. */
export const RANKED_STATUSES = ["VERIFIED", "INVITED", "APPROVED"] as const;
export type RankedStatus = (typeof RANKED_STATUSES)[number];

export function isRankedStatus(status: string): status is RankedStatus {
  return (RANKED_STATUSES as readonly string[]).includes(status);
}

export type Rankable = {
  webXp: number;
  verifiedReferralCount: number;
  emailVerifiedAt: Date | null;
};

/**
 * Ranking comparator (best-first): WebXP desc → verified referrals desc →
 * earliest verified time asc. Use with Array.sort; index 0 is rank #1.
 */
export function compareRank(a: Rankable, b: Rankable): number {
  if (b.webXp !== a.webXp) return b.webXp - a.webXp;
  if (b.verifiedReferralCount !== a.verifiedReferralCount) {
    return b.verifiedReferralCount - a.verifiedReferralCount;
  }
  const at = a.emailVerifiedAt?.getTime() ?? Number.POSITIVE_INFINITY;
  const bt = b.emailVerifiedAt?.getTime() ?? Number.POSITIVE_INFINITY;
  return at - bt;
}

export type WaitlistRoleLike = "FOUNDER" | "BUILDER" | "INVESTOR" | "ADVISOR";
export type FounderPassStatusLike = "LOCKED" | "ELIGIBLE_SOON" | "ELIGIBLE" | "INVITED" | "CLAIMED";

/** Human-readable access tier shown on the status page. */
export function accessTier(
  role: WaitlistRoleLike,
  webXp: number,
  founderPassStatus: FounderPassStatusLike,
): string {
  if (founderPassStatus === "ELIGIBLE" || founderPassStatus === "INVITED" || founderPassStatus === "CLAIMED") {
    return "Founder Pass Candidate";
  }
  if (webXp >= 200) return "Priority Access";
  if (role === "FOUNDER") return "Early Founder";
  return "Waitlist Member";
}
