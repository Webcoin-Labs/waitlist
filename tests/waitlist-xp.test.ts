import { describe, it, expect } from "vitest";
import {
  isWithinLaunchWindow,
  joiningXp,
  referralXp,
  compareRank,
  accessTier,
  isRankedStatus,
  type Rankable,
} from "@/lib/waitlist/xp";

const LAUNCH = new Date("2026-07-05T00:00:00.000Z");
const DAY = 24 * 60 * 60 * 1000;

describe("launch window", () => {
  it("is inside within 7 days", () => {
    expect(isWithinLaunchWindow(new Date(LAUNCH.getTime() + 3 * DAY), LAUNCH)).toBe(true);
  });
  it("is inside just before the 7-day edge", () => {
    expect(isWithinLaunchWindow(new Date(LAUNCH.getTime() + 7 * DAY - 1), LAUNCH)).toBe(true);
  });
  it("is outside at/after the 7-day edge", () => {
    expect(isWithinLaunchWindow(new Date(LAUNCH.getTime() + 7 * DAY), LAUNCH)).toBe(false);
    expect(isWithinLaunchWindow(new Date(LAUNCH.getTime() + 10 * DAY), LAUNCH)).toBe(false);
  });
});

describe("joining XP", () => {
  it("awards 100 in first 7 days", () => {
    expect(joiningXp(new Date(LAUNCH.getTime() + 2 * DAY), LAUNCH)).toBe(100);
  });
  it("awards 50 after 7 days", () => {
    expect(joiningXp(new Date(LAUNCH.getTime() + 8 * DAY), LAUNCH)).toBe(50);
  });
});

describe("referral XP", () => {
  it("awards 20 in first 7 days", () => {
    expect(referralXp(new Date(LAUNCH.getTime() + 1 * DAY), LAUNCH)).toBe(20);
  });
  it("awards 10 after 7 days", () => {
    expect(referralXp(new Date(LAUNCH.getTime() + 9 * DAY), LAUNCH)).toBe(10);
  });
});

describe("rank ordering", () => {
  it("orders by XP desc, then referrals desc, then earliest verify", () => {
    const a: Rankable & { id: string } = { id: "a", webXp: 120, verifiedReferralCount: 1, emailVerifiedAt: new Date("2026-07-06") };
    const b: Rankable & { id: string } = { id: "b", webXp: 200, verifiedReferralCount: 0, emailVerifiedAt: new Date("2026-07-07") };
    const c: Rankable & { id: string } = { id: "c", webXp: 120, verifiedReferralCount: 3, emailVerifiedAt: new Date("2026-07-08") };
    const d: Rankable & { id: string } = { id: "d", webXp: 120, verifiedReferralCount: 1, emailVerifiedAt: new Date("2026-07-05") };
    const sorted = [a, b, c, d].sort(compareRank).map((x) => x.id);
    // b highest XP; then c (same XP as a/d but more refs); then d (earlier verify than a); then a
    expect(sorted).toEqual(["b", "c", "d", "a"]);
  });
});

describe("access tier", () => {
  it("prioritizes Founder Pass candidate", () => {
    expect(accessTier("BUILDER", 50, "ELIGIBLE")).toBe("Founder Pass Candidate");
    expect(accessTier("FOUNDER", 500, "INVITED")).toBe("Founder Pass Candidate");
  });
  it("gives Priority Access at 200+ WebXP", () => {
    expect(accessTier("FOUNDER", 200, "LOCKED")).toBe("Priority Access");
  });
  it("labels founders Early Founder below threshold", () => {
    expect(accessTier("FOUNDER", 100, "LOCKED")).toBe("Early Founder");
  });
  it("labels others Waitlist Member", () => {
    expect(accessTier("INVESTOR", 100, "LOCKED")).toBe("Waitlist Member");
  });
});

describe("ranked statuses", () => {
  it("includes VERIFIED/INVITED/APPROVED only", () => {
    expect(isRankedStatus("VERIFIED")).toBe(true);
    expect(isRankedStatus("INVITED")).toBe(true);
    expect(isRankedStatus("APPROVED")).toBe(true);
    expect(isRankedStatus("PENDING_VERIFICATION")).toBe(false);
    expect(isRankedStatus("BLOCKED")).toBe(false);
  });
});
