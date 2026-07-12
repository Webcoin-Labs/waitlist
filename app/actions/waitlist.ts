"use server";

import { createHash, randomBytes, randomInt } from "node:crypto";
import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  Prisma,
  type WaitlistRole,
  type WaitlistStatus,
  type FounderPassStatus,
  type FounderPassTier,
  type FounderPassTrack,
  type WaitlistTaskType,
  type WebXpReason,
} from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/prisma";
import { rateLimitAsync, rateLimitKey } from "@/lib/rateLimit";
import { logger } from "@/lib/logger";
import { dispatchWaitlistVerificationEmail, dispatchWaitlistWelcomeEmail } from "@/lib/notifications/waitlistVerification";
import { isAdminSession } from "@/lib/adminAuth";
import {
  getLaunchAt,
  joiningXp,
  referralXp,
  compareRank,
  RANKED_STATUSES,
  accessTier,
  type Rankable,
} from "@/lib/waitlist/xp";
import { getDisplayNameFromEmail } from "@/lib/notifications/displayName";
import { WAITLIST_TASK_REWARDS, buildXShareText, buildXShareUrl } from "@/lib/waitlist/share";
import { WAITLIST_DEVICE_COOKIE } from "@/lib/deviceCookie";
import { assessWaitlistSignup } from "@/lib/waitlist/signupFraud";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const FOUNDER_PASS_ELIGIBILITY_TASK_OPEN = process.env.FOUNDER_PASS_ELIGIBILITY_TASK_OPEN === "true";

function baseUrl() {
  return (process.env.WAITLIST_BASE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/+$/, "");
}

function hashValue(value: string | null | undefined): string | null {
  if (!value) return null;
  const secret = process.env.APP_ENCRYPTION_SECRET ?? "wcl-waitlist";
  return createHash("sha256").update(`${value}:${secret}`).digest("hex");
}

function newToken() {
  return randomBytes(32).toString("hex");
}

// Private key for /status + task-completion actions. Never derived from or
// equal to referralCode — referralCode is meant to be shared publicly, so
// using it to gate PII/state-changing actions would let anyone with a
// person's referral link view their email or forge XP claims on their behalf.
function newStatusToken() {
  return randomBytes(24).toString("base64url");
}

const REFERRAL_CODE_LENGTH = 7;
const REFERRAL_CODE_ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const REFERRAL_CODE_DIGITS = "0123456789";

/** 7-character alphanumeric referral code, guaranteed to include at least one digit. */
function newReferralCode() {
  const chars = Array.from({ length: REFERRAL_CODE_LENGTH }, () => REFERRAL_CODE_ALPHANUMERIC[randomInt(REFERRAL_CODE_ALPHANUMERIC.length)]);
  if (!chars.some((c) => REFERRAL_CODE_DIGITS.includes(c))) {
    chars[randomInt(REFERRAL_CODE_LENGTH)] = REFERRAL_CODE_DIGITS[randomInt(REFERRAL_CODE_DIGITS.length)];
  }
  return chars.join("");
}

function normalizeReferralCodeInput(value: FormDataEntryValue | null): string {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return "";

  try {
    const url = new URL(trimmed);
    const ref = url.searchParams.get("ref");
    if (ref) return ref.trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32).toUpperCase();
  } catch {
    const refMatch = trimmed.match(/[?&]ref=([^&#]+)/i);
    if (refMatch?.[1]) {
      try {
        return decodeURIComponent(refMatch[1]).trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32).toUpperCase();
      } catch {
        return refMatch[1].trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32).toUpperCase();
      }
    }
  }

  return trimmed.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32).toUpperCase();
}

function referralLinkFor(code: string) {
  return `${baseUrl()}/?ref=${code}`;
}

/** Lazily assigns a statusToken to entries created before the field existed. */
async function backfillStatusToken(id: string): Promise<string> {
  const token = newStatusToken();
  const updated = await db.waitlistEntry.updateMany({
    where: { id, statusToken: null },
    data: { statusToken: token },
  });
  if (updated.count === 1) return token;
  // Lost the race (or already backfilled) — read back whatever is there now.
  const current = await db.waitlistEntry.findUnique({ where: { id }, select: { statusToken: true } });
  return current?.statusToken ?? token;
}

function statusLinkFor(code: string) {
  void code;
  return "/status";
}

function titleCase(s: string) {
  return s.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function displayNameFor(entry: { name: string | null; email: string }) {
  return entry.name?.trim() || getDisplayNameFromEmail(entry.email) || "Founder";
}

/** Masks an email for the public leaderboard, e.g. "anshitraj4@gmail.com" -> "an*****4@gmail.com". */
function maskEmailForLeaderboard(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  if (local.length <= 3) return `${local[0] ?? ""}*****@${domain}`;
  return `${local.slice(0, 2)}*****${local.slice(-1)}@${domain}`;
}

/**
 * Public, unauthenticated social-proof pulse for the landing-page email step:
 * a growing headline count (100 + verified signups) and the most recent
 * verified joiner's masked email. No PII beyond what the leaderboard already
 * exposes to any visitor.
 */
export async function getPublicWaitlistPulse(): Promise<{ displayCount: number; recentMaskedEmail: string | null }> {
  try {
    const [verifiedCount, recent] = await Promise.all([
      db.waitlistEntry.count({ where: { emailVerifiedAt: { not: null } } }),
      db.waitlistEntry.findFirst({
        where: { emailVerifiedAt: { not: null } },
        orderBy: { emailVerifiedAt: "desc" },
        select: { email: true },
      }),
    ]);
    return {
      displayCount: 100 + verifiedCount,
      recentMaskedEmail: recent ? maskEmailForLeaderboard(recent.email) : null,
    };
  } catch (error) {
    await logger.captureError({ scope: "waitlist.getPublicWaitlistPulse", message: "Failed to load public waitlist pulse.", error });
    return { displayCount: 100, recentMaskedEmail: null };
  }
}

function isMissingTaskTable(error: unknown) {
  return (
    (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") ||
    (error instanceof Error && error.message.includes("WaitlistTaskCompletion"))
  );
}

async function requestMeta() {
  try {
    const h = await headers();
    const cookieStore = await cookies();
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? null;
    const ua = h.get("user-agent") ?? null;
    const deviceId = cookieStore.get(WAITLIST_DEVICE_COOKIE)?.value;
    return { ipHash: hashValue(ip), deviceHash: hashValue(deviceId ? `device:${deviceId}` : ua) };
  } catch {
    return { ipHash: null, deviceHash: null };
  }
}

const joinSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email."),
  name: z.string().trim().max(120).optional().or(z.literal("")),
  role: z.enum(["FOUNDER", "BUILDER", "INVESTOR", "ADVISOR"]).default("FOUNDER"),
  ref: z.string().trim().max(32).optional().or(z.literal("")),
  utmSource: z.string().trim().max(80).optional().or(z.literal("")),
  utmMedium: z.string().trim().max(80).optional().or(z.literal("")),
  utmCampaign: z.string().trim().max(80).optional().or(z.literal("")),
});

const emailOnlySchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email."),
});

export type JoinWaitlistResult =
  | { success: true; email: string; alreadyVerified: boolean; statusToken?: string }
  | { success: false; error: string };

export type ExistingWaitlistAccessResult =
  | { success: true; email: string; alreadyVerified: boolean; statusToken?: string }
  | { success: false; error: string };

// Founders must use a company email, not a free personal inbox — one signal
// that helps confirm they're a real, registered company. Investors, builders,
// and advisors can use any email, including personal inboxes.
const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "icloud.com",
  "me.com",
  "proton.me",
  "protonmail.com",
  "gmx.com",
  "aol.com",
  "mail.com",
]);

// ── join ─────────────────────────────────────────────────────────────────────

export async function getExistingWaitlistAccess(emailInput: string): Promise<ExistingWaitlistAccessResult> {
  const parsed = emailOnlySchema.safeParse({ email: emailInput });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid email." };

  const { email } = parsed.data;
  const meta = await requestMeta();
  const limiter = await rateLimitAsync(rateLimitKey(meta.ipHash ?? email, "waitlist-existing-access"), 10, 60_000);
  if (!limiter.ok) return { success: false, error: "Too many attempts. Please try again shortly." };

  const existing = await db.waitlistEntry.findUnique({
    where: { email },
    select: { id: true, status: true, emailVerifiedAt: true, statusToken: true },
  });

  if (!existing || existing.status === "BLOCKED" || !existing.emailVerifiedAt) {
    return { success: true, email, alreadyVerified: false };
  }

  const statusToken = existing.statusToken ?? (await backfillStatusToken(existing.id));
  return { success: true, email, alreadyVerified: true, statusToken };
}

export async function joinWaitlist(formData: FormData): Promise<JoinWaitlistResult> {
  const parsed = joinSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name") ?? "",
    role: formData.get("role") ?? "FOUNDER",
    ref: normalizeReferralCodeInput(formData.get("ref")),
    utmSource: formData.get("utmSource") ?? "",
    utmMedium: formData.get("utmMedium") ?? "",
    utmCampaign: formData.get("utmCampaign") ?? "",
  });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid submission." };
  const { email, role } = parsed.data;
  const name = parsed.data.name || null;

  // Founder path requires a company email.
  if (role === "FOUNDER") {
    const domain = email.split("@")[1];
    if (domain && FREE_EMAIL_DOMAINS.has(domain)) {
      return { success: false, error: "We detected you're using a personal email. Please use your company email (e.g. you@yourcompany.com) — you can use a personal email if you join as a Builder instead." };
    }
  }

  const meta = await requestMeta();
  const limiter = await rateLimitAsync(rateLimitKey(meta.ipHash ?? email, "waitlist-join"), 6, 60_000);
  if (!limiter.ok) return { success: false, error: "Too many attempts. Please try again shortly." };

  let referredById: string | null = null;
  if (parsed.data.ref) {
    const referrer = await db.waitlistEntry.findUnique({
      where: { referralCode: parsed.data.ref },
      select: { id: true, email: true, status: true },
    });
    if (referrer && referrer.email !== email && referrer.status !== "BLOCKED") {
      referredById = referrer.id;
    }
  }

  const existing = await db.waitlistEntry.findUnique({ where: { email } });
  const token = newToken();
  const expires = new Date(Date.now() + TOKEN_TTL_MS);

  if (existing) {
    if (existing.status === "BLOCKED") return { success: true, email, alreadyVerified: false };
    if (existing.emailVerifiedAt) {
      // Backfill statusToken for entries created before this field existed.
      const statusToken = existing.statusToken ?? (await backfillStatusToken(existing.id));
      return { success: true, email, alreadyVerified: true, statusToken };
    }
    await db.waitlistEntry.update({
      where: { id: existing.id },
      data: { verificationToken: token, verificationExpiresAt: expires, name: name ?? existing.name, role },
    });
    const delivery = await sendVerification(email, token, name ?? existing.name, role);
    if (!delivery.delivered) {
      return { success: false, error: "Your place is saved, but we could not send the verification email. Please retry." };
    }
    return { success: true, email, alreadyVerified: false };
  }

  const security = await assessWaitlistSignup({ email, ipHash: meta.ipHash, deviceHash: meta.deviceHash });
  if (!security.allowed) {
    return {
      success: false,
      error: security.flags.includes("DISPOSABLE_EMAIL")
        ? "Temporary or disposable email addresses are not supported."
        : "We could not accept this signup right now. Please try again later.",
    };
  }

  let created: { referralCode: string; statusToken: string | null } | null = null;
  for (let attempt = 0; attempt < 5 && !created; attempt += 1) {
    const referralCode = newReferralCode();
    try {
      created = await db.waitlistEntry.create({
        data: {
          email,
          name,
          role: role as WaitlistRole,
          referralCode,
          statusToken: newStatusToken(),
          referredById,
          verificationToken: token,
          verificationExpiresAt: expires,
          source: "waitlist_page",
          utmSource: parsed.data.utmSource || null,
          utmMedium: parsed.data.utmMedium || null,
          utmCampaign: parsed.data.utmCampaign || null,
          ipHash: meta.ipHash,
          // Kept in the existing column for compatibility; this now stores a
          // hash of the anonymous first-party device cookie, not the raw UA.
          userAgentHash: meta.deviceHash,
        },
        select: { referralCode: true, statusToken: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        const target = (error.meta?.target as string[] | undefined)?.join(",") ?? "";
        if (target.includes("email")) return { success: true, email, alreadyVerified: false };
        continue;
      }
      throw error;
    }
  }
  if (!created) return { success: false, error: "Could not create your entry. Please retry." };

  const delivery = await sendVerification(email, token, name, role);
  if (!delivery.delivered) {
    return { success: false, error: "Your place is saved, but we could not send the verification email. Please retry." };
  }
  return { success: true, email, alreadyVerified: false };
}

async function sendVerification(email: string, token: string, name?: string | null, role?: WaitlistRole) {
  const verifyLink = `${baseUrl()}/verify?token=${token}&e=${encodeURIComponent(email)}`;
  return dispatchWaitlistVerificationEmail({ toEmail: email, verifyLink, name, role });
}

// ── resend ───────────────────────────────────────────────────────────────────

export async function resendWaitlistVerification(email: string): Promise<{ success: boolean; error?: string }> {
  const normalized = email.trim().toLowerCase();
  if (!z.string().email().safeParse(normalized).success) return { success: false, error: "Invalid email." };

  const meta = await requestMeta();
  const limiter = await rateLimitAsync(rateLimitKey(meta.ipHash ?? normalized, "waitlist-resend"), 4, 60_000);
  if (!limiter.ok) return { success: false, error: "Too many requests. Try again shortly." };

  const entry = await db.waitlistEntry.findUnique({ where: { email: normalized } });
  if (entry && !entry.emailVerifiedAt && entry.status !== "BLOCKED") {
    const token = newToken();
    await db.waitlistEntry.update({
      where: { id: entry.id },
      data: { verificationToken: token, verificationExpiresAt: new Date(Date.now() + TOKEN_TTL_MS) },
    });
    const delivery = await sendVerification(normalized, token, entry.name, entry.role);
    if (!delivery.delivered) return { success: false, error: "Could not send the verification email. Please retry." };
  }
  return { success: true };
}

// ── verify (awards XP) ───────────────────────────────────────────────────────

export type VerifyResult =
  | { success: true; statusToken: string; alreadyVerified: boolean }
  | { success: false; error: string; email?: string };

export async function verifyWaitlistEmail(token: string, email?: string): Promise<VerifyResult> {
  if (!token || token.length < 16) return { success: false, error: "Invalid verification link." };

  const entry = await db.waitlistEntry.findUnique({ where: { verificationToken: token } });
  if (!entry) {
    // The token is single-use and cleared once verification succeeds. Email
    // security scanners (Outlook Safe Links, Gmail, corporate gateways) often
    // pre-fetch links before the user ever clicks them, which silently
    // completes verification first — the user's genuine first click then
    // finds no token and would otherwise see a false "invalid link" error
    // even though their account is already verified. Fall back to the email
    // on the link to recognize that case instead of hard-failing.
    if (email) {
      const parsedEmail = emailOnlySchema.safeParse({ email });
      if (parsedEmail.success) {
        const meta = await requestMeta();
        const limiter = await rateLimitAsync(rateLimitKey(meta.ipHash ?? parsedEmail.data.email, "waitlist-verify-fallback"), 10, 60_000);
        if (limiter.ok) {
          const byEmail = await db.waitlistEntry.findUnique({ where: { email: parsedEmail.data.email } });
          if (byEmail && byEmail.status !== "BLOCKED" && byEmail.emailVerifiedAt) {
            const statusToken = byEmail.statusToken ?? (await backfillStatusToken(byEmail.id));
            return { success: true, statusToken, alreadyVerified: true };
          }
        }
      }
    }
    return { success: false, error: "This verification link is invalid or has already been used." };
  }
  if (entry.status === "BLOCKED") return { success: false, error: "This entry is not eligible." };
  if (entry.emailVerifiedAt) {
    const statusToken = entry.statusToken ?? (await backfillStatusToken(entry.id));
    return { success: true, statusToken, alreadyVerified: true };
  }
  if (entry.verificationExpiresAt && entry.verificationExpiresAt.getTime() < Date.now()) {
    return { success: false, error: "This verification link has expired. Request a new one.", email: entry.email };
  }

  const launchAt = getLaunchAt();
  const joinXp = joiningXp(entry.createdAt, launchAt);

  await db.$transaction(async (tx) => {
    await tx.waitlistEntry.update({
      where: { id: entry.id },
      data: {
        status: "VERIFIED",
        emailVerifiedAt: new Date(),
        verificationToken: null,
        verificationExpiresAt: null,
        webXp: { increment: joinXp },
        founderPassStatus: ["FOUNDER", "BUILDER"].includes(entry.role) ? "ELIGIBLE_SOON" : entry.founderPassStatus,
      },
    });
    await tx.webXpLedger.create({
      data: { waitlistEntryId: entry.id, amount: joinXp, reason: "SIGNUP", sourceEntryId: null },
    });

    if (entry.referredById && entry.referredById !== entry.id) {
      const referrer = await tx.waitlistEntry.findUnique({
        where: { id: entry.referredById },
        select: { id: true, status: true },
      });
      if (referrer && referrer.status !== "BLOCKED") {
        const refXp = referralXp(entry.createdAt, launchAt);
        try {
          await tx.webXpLedger.create({
            data: { waitlistEntryId: referrer.id, amount: refXp, reason: "REFERRAL", sourceEntryId: entry.id },
          });
          await tx.waitlistEntry.update({
            where: { id: referrer.id },
            data: { webXp: { increment: refXp }, verifiedReferralCount: { increment: 1 } },
          });
        } catch (error) {
          if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")) throw error;
        }
      }
    }
  });

  const statusToken = entry.statusToken ?? (await backfillStatusToken(entry.id));
  try {
    await dispatchWaitlistWelcomeEmail({
      toEmail: entry.email,
      dashboardLink: `${baseUrl()}/status?c=${encodeURIComponent(statusToken)}`,
      name: entry.name,
      role: entry.role,
    });
  } catch (error) {
    await logger.captureError({
      scope: "waitlist.verify",
      message: "Verification succeeded, but the welcome email could not be dispatched.",
      data: { recipientDomain: entry.email.split("@")[1] ?? "unknown" },
      error,
    });
  }
  return { success: true, statusToken, alreadyVerified: false };
}

// ── status (own record only) ─────────────────────────────────────────────────

export type WaitlistStatusView = {
  found: boolean;
  email?: string;
  name?: string | null;
  displayName?: string;
  role?: WaitlistRole;
  status?: WaitlistStatus;
  verified: boolean;
  webXp: number;
  verifiedReferralCount: number;
  rank: number | null;
  rankedTotal: number;
  accessTier: string;
  founderPassStatus: FounderPassStatus;
  founderPassTier: FounderPassTier | null;
  founderPassTrack: FounderPassTrack | null;
  referralCode: string;
  statusToken: string;
  referralLink: string;
  xShareText: string;
  xShareUrl: string;
  leaderboard: WaitlistLeaderboardRow[];
  taskStates: WaitlistTaskState[];
  networkStats: {
    verifiedMembers: number;
    verifiedReferrals: number;
    countriesLabel: string;
    buildersFounders: number;
  };
};

export type WaitlistLeaderboardRow = {
  rank: number;
  label: string;
  webXp: number;
  verifiedReferralCount: number;
  isCurrent: boolean;
};

export type WaitlistTaskState = {
  taskType: WaitlistTaskType;
  status: "LOCKED" | "AVAILABLE" | "IN_PROGRESS" | "COMPLETED" | "CLAIMED";
  xpAwarded: number;
  progress: number;
  goal: number;
};

function taskView({
  taskType,
  completion,
  progress,
  goal,
  available,
}: {
  taskType: WaitlistTaskType;
  completion?: { status: string; xpAwarded: number } | null;
  progress: number;
  goal: number;
  available: boolean;
}): WaitlistTaskState {
  if (completion?.xpAwarded) {
    return { taskType, status: "CLAIMED", xpAwarded: completion.xpAwarded, progress: goal, goal };
  }
  if (completion?.status === "PENDING_CONFIRMATION" || completion?.status === "OPENED") {
    return { taskType, status: "IN_PROGRESS", xpAwarded: 0, progress, goal };
  }
  if (progress >= goal) return { taskType, status: "COMPLETED", xpAwarded: 0, progress: goal, goal };
  return { taskType, status: available ? "AVAILABLE" : "LOCKED", xpAwarded: 0, progress, goal };
}

async function awardTaskXp(
  tx: Prisma.TransactionClient,
  waitlistEntryId: string,
  taskType: WaitlistTaskType,
  reason: WebXpReason,
  amount: number,
  metadata?: Prisma.InputJsonValue,
) {
  const now = new Date();
  await tx.waitlistTaskCompletion.upsert({
    where: { waitlistEntryId_taskType: { waitlistEntryId, taskType } },
    create: {
      waitlistEntryId,
      taskType,
      status: "COMPLETED",
      xpAwarded: 0,
      metadata,
      completedAt: now,
    },
    update: {},
  });

  const claimed = await tx.waitlistTaskCompletion.updateMany({
    where: { waitlistEntryId, taskType, xpAwarded: 0 },
    data: {
      status: "CLAIMED",
      xpAwarded: amount,
      metadata,
      completedAt: now,
      confirmedAt: now,
    },
  });

  if (claimed.count !== 1) return false;

  await tx.webXpLedger.create({
    data: { waitlistEntryId, amount, reason, sourceEntryId: null },
  });
  await tx.waitlistEntry.update({
    where: { id: waitlistEntryId },
    data: { webXp: { increment: amount } },
  });
  return true;
}

async function syncAutomaticTaskAwards(entry: { id: string; status: WaitlistStatus; emailVerifiedAt: Date | null; verifiedReferralCount: number }) {
  if (!entry.emailVerifiedAt || entry.status === "BLOCKED" || entry.verifiedReferralCount < 3) return;

  try {
    await db.$transaction(async (tx) => {
      await awardTaskXp(
        tx,
        entry.id,
        "THREE_VERIFIED_REFERRALS",
        "THREE_VERIFIED_REFERRALS",
        WAITLIST_TASK_REWARDS.THREE_VERIFIED_REFERRALS,
        { verifiedReferralCount: entry.verifiedReferralCount },
      );
    });
  } catch (error) {
    if (!isMissingTaskTable(error)) throw error;
  }
}

async function getTaskCompletionsForStatus(waitlistEntryId: string) {
  try {
    return await db.waitlistTaskCompletion.findMany({ where: { waitlistEntryId } });
  } catch (error) {
    if (isMissingTaskTable(error)) return [];
    throw error;
  }
}

export async function getWaitlistStatus(statusToken: string): Promise<WaitlistStatusView | null> {
  if (!statusToken || statusToken.length < 16) return null;

  const meta = await requestMeta();
  const limiter = await rateLimitAsync(rateLimitKey(meta.ipHash ?? statusToken, "waitlist-status"), 30, 60_000);
  if (!limiter.ok) return null;

  let entry = await db.waitlistEntry.findUnique({ where: { statusToken } });
  if (!entry) return null;

  await syncAutomaticTaskAwards(entry);
  entry = await db.waitlistEntry.findUnique({ where: { statusToken } });
  if (!entry) return null;

  const verified = Boolean(entry.emailVerifiedAt);
  let rank: number | null = null;
  let rankedTotal = 0;
  let leaderboard: WaitlistLeaderboardRow[] = [];
  let verifiedReferrals = 0;
  let buildersFounders = 0;

  if (verified && (RANKED_STATUSES as readonly string[]).includes(entry.status)) {
    const ranked = await db.waitlistEntry.findMany({
      where: { status: { in: RANKED_STATUSES as unknown as WaitlistStatus[] } },
      select: { id: true, name: true, email: true, role: true, webXp: true, verifiedReferralCount: true, emailVerifiedAt: true },
      take: 10_000,
    });
    rankedTotal = ranked.length;
    verifiedReferrals = ranked.reduce((sum, item) => sum + item.verifiedReferralCount, 0);
    buildersFounders = ranked.filter((item) => item.role === "FOUNDER" || item.role === "BUILDER").length;
    const sorted = ([...ranked] as (Rankable & { id: string; name: string | null; email: string; role: WaitlistRole })[]).sort(compareRank);
    const idx = sorted.findIndex((r) => r.id === entry.id);
    rank = idx >= 0 ? idx + 1 : null;
    leaderboard = sorted.slice(0, 10).map((item, i) => ({
        rank: i + 1,
        label: item.id === entry.id ? "You" : maskEmailForLeaderboard(item.email),
        webXp: item.webXp,
        verifiedReferralCount: item.verifiedReferralCount,
        isCurrent: item.id === entry.id,
      }));
  }

  const taskCompletions = await getTaskCompletionsForStatus(entry.id);
  const completions = new Map(taskCompletions.map((completion) => [completion.taskType, completion]));
  const referralLink = referralLinkFor(entry.referralCode);

  return {
    found: true,
    email: entry.email,
    name: entry.name,
    displayName: displayNameFor(entry),
    role: entry.role,
    status: entry.status,
    verified,
    webXp: entry.webXp,
    verifiedReferralCount: entry.verifiedReferralCount,
    rank,
    rankedTotal,
    accessTier: accessTier(entry.role, entry.webXp, entry.founderPassStatus),
    founderPassStatus: entry.founderPassStatus,
    founderPassTier: entry.founderPassTier,
    founderPassTrack: entry.founderPassTrack,
    referralCode: entry.referralCode,
    statusToken: entry.statusToken ?? (await backfillStatusToken(entry.id)),
    referralLink,
    xShareText: buildXShareText({ referralUrl: referralLink }),
    xShareUrl: buildXShareUrl({ referralUrl: referralLink }),
    leaderboard,
    taskStates: [
      taskView({
        taskType: "X_SHARE",
        completion: completions.get("X_SHARE"),
        progress: completions.has("X_SHARE") ? 1 : 0,
        goal: 1,
        available: verified,
      }),
      taskView({
        taskType: "THREE_VERIFIED_REFERRALS",
        completion: completions.get("THREE_VERIFIED_REFERRALS"),
        progress: entry.verifiedReferralCount,
        goal: 3,
        available: verified,
      }),
      taskView({
        taskType: "FOUNDER_PASS_ELIGIBILITY_CHECK",
        completion: completions.get("FOUNDER_PASS_ELIGIBILITY_CHECK"),
        progress: completions.has("FOUNDER_PASS_ELIGIBILITY_CHECK") ? 1 : 0,
        goal: 1,
        available: verified,
      }),
    ],
    networkStats: {
      verifiedMembers: rankedTotal,
      verifiedReferrals,
      countriesLabel: "Global network activating",
      buildersFounders,
    },
  };
}

export async function getPublicWaitlistStat(): Promise<{ verifiedCount: number; label: string }> {
  const verifiedCount = await db.waitlistEntry.count({
    where: { status: { in: RANKED_STATUSES as unknown as WaitlistStatus[] } },
  });
  const label = verifiedCount >= 100 ? "100+ verified early-access requests." : "Private early access is open.";
  return { verifiedCount, label };
}

// ── admin (token-gated, no shared session system) ───────────────────────────

async function getVerifiedEntryForTask(statusToken: string) {
  if (!statusToken || statusToken.length < 16) return null;
  const entry = await db.waitlistEntry.findUnique({
    where: { statusToken },
    select: { id: true, referralCode: true, status: true, emailVerifiedAt: true, verifiedReferralCount: true },
  });
  if (!entry || !entry.emailVerifiedAt || entry.status === "BLOCKED") return null;
  return entry;
}

export async function recordXShareOpened(statusToken: string): Promise<{ success: boolean; error?: string }> {
  try {
    const meta = await requestMeta();
    const limiter = await rateLimitAsync(rateLimitKey(meta.ipHash ?? statusToken, "waitlist-task"), 20, 60_000);
    if (!limiter.ok) return { success: false, error: "Too many requests. Please try again shortly." };

    const entry = await getVerifiedEntryForTask(statusToken);
    if (!entry) return { success: false, error: "Verify your email before completing tasks." };

    const existing = await db.waitlistTaskCompletion.findUnique({
      where: { waitlistEntryId_taskType: { waitlistEntryId: entry.id, taskType: "X_SHARE" } },
      select: { xpAwarded: true },
    });
    if (existing?.xpAwarded) return { success: true };

    const referralUrl = referralLinkFor(entry.referralCode);
    const metadata = { referralUrl, xShareUrl: buildXShareUrl({ referralUrl }) };
    await db.waitlistTaskCompletion.upsert({
      where: { waitlistEntryId_taskType: { waitlistEntryId: entry.id, taskType: "X_SHARE" } },
      create: {
        waitlistEntryId: entry.id,
        taskType: "X_SHARE",
        status: "PENDING_CONFIRMATION",
        xpAwarded: 0,
        openedAt: new Date(),
        metadata,
      },
      update: {
        status: "PENDING_CONFIRMATION",
        openedAt: new Date(),
        metadata,
      },
    });
    revalidatePath(statusLinkFor(entry.referralCode));
    return { success: true };
  } catch (error) {
    await logger.captureError({ scope: "waitlist.recordXShareOpened", message: "Failed to record X share open.", error });
    return { success: false, error: "Could not update the task. Please retry." };
  }
}

export async function confirmXSharePosted(statusToken: string): Promise<{ success: boolean; awarded: boolean; error?: string }> {
  try {
    const meta = await requestMeta();
    const limiter = await rateLimitAsync(rateLimitKey(meta.ipHash ?? statusToken, "waitlist-task"), 20, 60_000);
    if (!limiter.ok) return { success: false, awarded: false, error: "Too many requests. Please try again shortly." };

    const entry = await getVerifiedEntryForTask(statusToken);
    if (!entry) return { success: false, awarded: false, error: "Verify your email before completing tasks." };

    const referralUrl = referralLinkFor(entry.referralCode);
    const awarded = await db.$transaction((tx) =>
      awardTaskXp(tx, entry.id, "X_SHARE", "X_SHARE_TASK", WAITLIST_TASK_REWARDS.X_SHARE, {
        referralUrl,
        confirmedByUser: true,
        reviewNote: "User confirmed posting through X web intent.",
      }),
    );
    revalidatePath(statusLinkFor(entry.referralCode));
    return { success: true, awarded };
  } catch (error) {
    await logger.captureError({ scope: "waitlist.confirmXSharePosted", message: "Failed to confirm X share.", error });
    return { success: false, awarded: false, error: "Could not claim that task. Please retry." };
  }
}

const founderPassEligibilitySchema = z.object({
  statusToken: z.string().trim().min(16),
  track: z.enum(["ARC", "BASE", "BOTH", "NOT_YET"]),
});

export async function submitFounderPassEligibility(input: {
  statusToken: string;
  track: "ARC" | "BASE" | "BOTH" | "NOT_YET";
}): Promise<{ success: boolean; awarded: boolean; error?: string }> {
  if (!FOUNDER_PASS_ELIGIBILITY_TASK_OPEN) {
    return { success: false, awarded: false, error: "Founder Pass eligibility checks are coming soon." };
  }

  const parsed = founderPassEligibilitySchema.safeParse(input);
  if (!parsed.success) return { success: false, awarded: false, error: "Choose an eligibility option." };

  try {
    const meta = await requestMeta();
    const limiter = await rateLimitAsync(rateLimitKey(meta.ipHash ?? parsed.data.statusToken, "waitlist-task"), 20, 60_000);
    if (!limiter.ok) return { success: false, awarded: false, error: "Too many requests. Please try again shortly." };

    const entry = await getVerifiedEntryForTask(parsed.data.statusToken);
    if (!entry) return { success: false, awarded: false, error: "Verify your email before completing tasks." };

    const track = parsed.data.track === "NOT_YET" ? null : (parsed.data.track as FounderPassTrack);
    const awarded = await db.$transaction(async (tx) => {
      await tx.waitlistEntry.update({
        where: { id: entry.id },
        data: {
          founderPassTrack: track,
          founderPassStatus: parsed.data.track === "NOT_YET" ? "ELIGIBLE_SOON" : "ELIGIBLE",
        },
      });
      return awardTaskXp(
        tx,
        entry.id,
        "FOUNDER_PASS_ELIGIBILITY_CHECK",
        "FOUNDER_PASS_ELIGIBILITY_CHECK",
        WAITLIST_TASK_REWARDS.FOUNDER_PASS_ELIGIBILITY_CHECK,
        { submittedTrack: parsed.data.track },
      );
    });

    revalidatePath(statusLinkFor(entry.referralCode));
    return { success: true, awarded };
  } catch (error) {
    await logger.captureError({
      scope: "waitlist.submitFounderPassEligibility",
      message: "Failed to submit Founder Pass eligibility.",
      error,
    });
    return { success: false, awarded: false, error: "Could not save eligibility. Please retry." };
  }
}

async function assertAdmin() {
  if (!(await isAdminSession())) throw new Error("Unauthorized.");
}

// Never echoes raw error messages to the client — Prisma errors can include
// table/column names. "Unauthorized." is the one safe, intentional message.
async function safeAdminError(e: unknown, scope: string): Promise<string> {
  if (e instanceof Error && e.message === "Unauthorized.") return e.message;
  await logger.captureError({ scope, message: "Admin action failed.", error: e });
  return "Failed. Please retry.";
}

export async function adminSetWaitlistStatus(id: string, status: WaitlistStatus): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    await db.waitlistEntry.update({ where: { id }, data: { status } });
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    return { success: false, error: await safeAdminError(e, "waitlist.adminSetWaitlistStatus") };
  }
}

export async function adminSetFounderPassStatus(id: string, founderPassStatus: FounderPassStatus): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    await db.waitlistEntry.update({ where: { id }, data: { founderPassStatus } });
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    return { success: false, error: await safeAdminError(e, "waitlist.adminSetFounderPassStatus") };
  }
}

export async function adminSetFounderPassTier(id: string, founderPassTier: FounderPassTier | ""): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    await db.waitlistEntry.update({ where: { id }, data: { founderPassTier: founderPassTier || null } });
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    return { success: false, error: await safeAdminError(e, "waitlist.adminSetFounderPassTier") };
  }
}

export async function adminSetFounderPassTrack(id: string, founderPassTrack: FounderPassTrack | ""): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    await db.waitlistEntry.update({ where: { id }, data: { founderPassTrack: founderPassTrack || null } });
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    return { success: false, error: await safeAdminError(e, "waitlist.adminSetFounderPassTrack") };
  }
}

export async function adminAdjustWebXp(id: string, amount: number): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    const delta = Math.trunc(Number(amount));
    if (!Number.isFinite(delta) || delta === 0) return { success: false, error: "Enter a non-zero amount." };
    await db.$transaction([
      db.webXpLedger.create({ data: { waitlistEntryId: id, amount: delta, reason: "ADMIN_ADJUSTMENT", sourceEntryId: null } }),
      db.waitlistEntry.update({ where: { id }, data: { webXp: { increment: delta } } }),
    ]);
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    return { success: false, error: await safeAdminError(e, "waitlist.adminAdjustWebXp") };
  }
}
