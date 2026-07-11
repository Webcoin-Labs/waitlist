import "server-only";

import { db } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import {
  emailDomain,
  evaluateSignupRisk,
  isDisposableEmailDomain,
  signupSecurityThresholdsFromEnv,
  type SignupActivityCounts,
} from "./signupSecurity";

export async function assessWaitlistSignup(input: {
  email: string;
  ipHash: string | null;
  deviceHash: string | null;
}) {
  const domain = emailDomain(input.email);
  const now = Date.now();
  const hourAgo = new Date(now - 60 * 60 * 1000);
  const dayAgo = new Date(now - 24 * 60 * 60 * 1000);
  const emailDomainFilter = { endsWith: `@${domain}`, mode: "insensitive" as const };

  const [ipHour, ipDay, deviceDay, ipDomainDay, deviceDomainDay] = await Promise.all([
    input.ipHash
      ? db.waitlistEntry.count({ where: { ipHash: input.ipHash, createdAt: { gte: hourAgo } } })
      : Promise.resolve(0),
    input.ipHash
      ? db.waitlistEntry.count({ where: { ipHash: input.ipHash, createdAt: { gte: dayAgo } } })
      : Promise.resolve(0),
    input.deviceHash
      ? db.waitlistEntry.count({ where: { userAgentHash: input.deviceHash, createdAt: { gte: dayAgo } } })
      : Promise.resolve(0),
    input.ipHash
      ? db.waitlistEntry.count({
          where: { ipHash: input.ipHash, email: emailDomainFilter, createdAt: { gte: dayAgo } },
        })
      : Promise.resolve(0),
    input.deviceHash
      ? db.waitlistEntry.count({
          where: { userAgentHash: input.deviceHash, email: emailDomainFilter, createdAt: { gte: dayAgo } },
        })
      : Promise.resolve(0),
  ]);

  const counts: SignupActivityCounts = { ipHour, ipDay, deviceDay, ipDomainDay, deviceDomainDay };
  const result = evaluateSignupRisk(counts, {
    disposable: isDisposableEmailDomain(domain),
    thresholds: signupSecurityThresholdsFromEnv(),
  });

  if (!result.allowed) {
    await logger.captureWarn({
      scope: "waitlist.signupSecurity",
      message: "Waitlist signup blocked by fraud controls.",
      data: { domain, riskScore: result.score, flags: result.flags, counts },
    });
  }

  return { ...result, domain, counts };
}
