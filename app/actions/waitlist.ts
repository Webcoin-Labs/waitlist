"use server";

import { createHash, randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  Prisma,
  type WaitlistRole,
  type WaitlistStatus,
  type FounderPassStatus,
  type FounderPassTier,
  type FounderPassTrack,
} from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/prisma";
import { rateLimitAsync, rateLimitKey } from "@/lib/rateLimit";
import { logger } from "@/lib/logger";
import { dispatchWaitlistVerificationEmail } from "@/lib/notifications/waitlistVerification";
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

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function baseUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/+$/, "");
}

function hashValue(value: string | null | undefined): string | null {
  if (!value) return null;
  const secret = process.env.APP_ENCRYPTION_SECRET ?? "wcl-waitlist";
  return createHash("sha256").update(`${value}:${secret}`).digest("hex");
}

function newToken() {
  return randomBytes(32).toString("hex");
}

function newReferralCode() {
  return randomBytes(6).toString("base64url").replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase();
}

function referralLinkFor(code: string) {
  return `${baseUrl()}/?ref=${code}`;
}

async function requestMeta() {
  try {
    const h = await headers();
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? null;
    const ua = h.get("user-agent") ?? null;
    return { ipHash: hashValue(ip), userAgentHash: hashValue(ua) };
  } catch {
    return { ipHash: null, userAgentHash: null };
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

export type JoinWaitlistResult =
  | { success: true; email: string; alreadyVerified: boolean; referralCode?: string }
  | { success: false; error: string };

// VCs must use a firm/work email, not a free personal inbox.
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

export async function joinWaitlist(formData: FormData): Promise<JoinWaitlistResult> {
  const parsed = joinSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name") ?? "",
    role: formData.get("role") ?? "FOUNDER",
    ref: formData.get("ref") ?? "",
    utmSource: formData.get("utmSource") ?? "",
    utmMedium: formData.get("utmMedium") ?? "",
    utmCampaign: formData.get("utmCampaign") ?? "",
  });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid submission." };
  const { email, role } = parsed.data;
  const name = parsed.data.name || null;

  // VC path requires a firm/work email.
  if (role === "INVESTOR") {
    const domain = email.split("@")[1];
    if (domain && FREE_EMAIL_DOMAINS.has(domain)) {
      return { success: false, error: "Please use your firm's registered work email." };
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
      return { success: true, email, alreadyVerified: true, referralCode: existing.referralCode };
    }
    await db.waitlistEntry.update({
      where: { id: existing.id },
      data: { verificationToken: token, verificationExpiresAt: expires, name: name ?? existing.name, role },
    });
    await sendVerification(email, token);
    return { success: true, email, alreadyVerified: false };
  }

  let created: { referralCode: string } | null = null;
  for (let attempt = 0; attempt < 5 && !created; attempt += 1) {
    const referralCode = newReferralCode();
    try {
      created = await db.waitlistEntry.create({
        data: {
          email,
          name,
          role: role as WaitlistRole,
          referralCode,
          referredById,
          verificationToken: token,
          verificationExpiresAt: expires,
          source: "waitlist_page",
          utmSource: parsed.data.utmSource || null,
          utmMedium: parsed.data.utmMedium || null,
          utmCampaign: parsed.data.utmCampaign || null,
          ipHash: meta.ipHash,
          userAgentHash: meta.userAgentHash,
        },
        select: { referralCode: true },
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

  await sendVerification(email, token);
  return { success: true, email, alreadyVerified: false };
}

async function sendVerification(email: string, token: string) {
  const verifyLink = `${baseUrl()}/verify?token=${token}`;
  const result = await dispatchWaitlistVerificationEmail({ toEmail: email, verifyLink });
  if (!result.delivered) {
    logger.error({ scope: "waitlist.sendVerification", message: "Verification email not delivered.", data: { email, error: result.error } });
  }
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
    await sendVerification(normalized, token);
  }
  return { success: true };
}

// ── verify (awards XP) ───────────────────────────────────────────────────────

export type VerifyResult =
  | { success: true; referralCode: string; alreadyVerified: boolean }
  | { success: false; error: string; email?: string };

export async function verifyWaitlistEmail(token: string): Promise<VerifyResult> {
  if (!token || token.length < 16) return { success: false, error: "Invalid verification link." };

  const entry = await db.waitlistEntry.findUnique({ where: { verificationToken: token } });
  if (!entry) return { success: false, error: "This verification link is invalid or has already been used." };
  if (entry.status === "BLOCKED") return { success: false, error: "This entry is not eligible." };
  if (entry.emailVerifiedAt) return { success: true, referralCode: entry.referralCode, alreadyVerified: true };
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

  revalidatePath("/admin");
  return { success: true, referralCode: entry.referralCode, alreadyVerified: false };
}

// ── status (own record only) ─────────────────────────────────────────────────

export type WaitlistStatusView = {
  found: boolean;
  email?: string;
  name?: string | null;
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
  referralLink: string;
};

export async function getWaitlistStatus(referralCode: string): Promise<WaitlistStatusView | null> {
  const entry = await db.waitlistEntry.findUnique({ where: { referralCode } });
  if (!entry) return null;

  const verified = Boolean(entry.emailVerifiedAt);
  let rank: number | null = null;
  let rankedTotal = 0;

  if (verified && (RANKED_STATUSES as readonly string[]).includes(entry.status)) {
    const ranked = await db.waitlistEntry.findMany({
      where: { status: { in: RANKED_STATUSES as unknown as WaitlistStatus[] } },
      select: { id: true, webXp: true, verifiedReferralCount: true, emailVerifiedAt: true },
      take: 10_000,
    });
    rankedTotal = ranked.length;
    const sorted = ([...ranked] as (Rankable & { id: string })[]).sort(compareRank);
    const idx = sorted.findIndex((r) => r.id === entry.id);
    rank = idx >= 0 ? idx + 1 : null;
  }

  return {
    found: true,
    email: entry.email,
    name: entry.name,
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
    referralLink: referralLinkFor(entry.referralCode),
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

async function assertAdmin() {
  if (!(await isAdminSession())) throw new Error("Unauthorized.");
}

export async function adminSetWaitlistStatus(id: string, status: WaitlistStatus): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    await db.waitlistEntry.update({ where: { id }, data: { status } });
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed." };
  }
}

export async function adminSetFounderPassStatus(id: string, founderPassStatus: FounderPassStatus): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    await db.waitlistEntry.update({ where: { id }, data: { founderPassStatus } });
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed." };
  }
}

export async function adminSetFounderPassTier(id: string, founderPassTier: FounderPassTier | ""): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    await db.waitlistEntry.update({ where: { id }, data: { founderPassTier: founderPassTier || null } });
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed." };
  }
}

export async function adminSetFounderPassTrack(id: string, founderPassTrack: FounderPassTrack | ""): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    await db.waitlistEntry.update({ where: { id }, data: { founderPassTrack: founderPassTrack || null } });
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed." };
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
    return { success: false, error: e instanceof Error ? e.message : "Failed." };
  }
}
