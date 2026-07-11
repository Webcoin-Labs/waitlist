import { afterEach, describe, expect, it } from "vitest";
import {
  DEFAULT_SIGNUP_SECURITY_THRESHOLDS,
  emailDomain,
  evaluateSignupRisk,
  isDisposableEmailDomain,
  signupSecurityThresholdsFromEnv,
} from "@/lib/waitlist/signupSecurity";

const emptyCounts = {
  ipHour: 0,
  ipDay: 0,
  deviceDay: 0,
  ipDomainDay: 0,
  deviceDomainDay: 0,
};

afterEach(() => {
  delete process.env.WAITLIST_DISPOSABLE_EMAIL_DOMAINS;
  delete process.env.WAITLIST_MAX_SIGNUPS_PER_IP_HOUR;
});

describe("waitlist signup security", () => {
  it("normalizes email domains", () => {
    expect(emailDomain(" Founder@Example.COM ")).toBe("example.com");
  });

  it("blocks built-in disposable domains and their subdomains", () => {
    expect(isDisposableEmailDomain("mailinator.com")).toBe(true);
    expect(isDisposableEmailDomain("inbox.mailinator.com")).toBe(true);
    expect(evaluateSignupRisk(emptyCounts, { disposable: true })).toEqual({
      allowed: false,
      score: 100,
      flags: ["DISPOSABLE_EMAIL"],
    });
  });

  it("supports a configurable disposable-domain extension list", () => {
    process.env.WAITLIST_DISPOSABLE_EMAIL_DOMAINS = "temporary.example, blocked.test";
    expect(isDisposableEmailDomain("temporary.example")).toBe(true);
    expect(isDisposableEmailDomain("sub.blocked.test")).toBe(true);
    expect(isDisposableEmailDomain("company.example")).toBe(false);
  });

  it("allows ordinary low-volume activity", () => {
    expect(evaluateSignupRisk(emptyCounts)).toEqual({ allowed: true, score: 0, flags: [] });
  });

  it("blocks direct IP, device, and domain burst limits", () => {
    expect(
      evaluateSignupRisk({ ...emptyCounts, ipHour: DEFAULT_SIGNUP_SECURITY_THRESHOLDS.ipHour }),
    ).toMatchObject({ allowed: false, flags: ["IP_HOURLY_LIMIT"] });
    expect(
      evaluateSignupRisk({ ...emptyCounts, deviceDay: DEFAULT_SIGNUP_SECURITY_THRESHOLDS.deviceDay }),
    ).toMatchObject({ allowed: false, flags: ["DEVICE_DAILY_LIMIT"] });
    expect(
      evaluateSignupRisk({ ...emptyCounts, deviceDomainDay: DEFAULT_SIGNUP_SECURITY_THRESHOLDS.deviceDomainDay }),
    ).toMatchObject({ allowed: false, flags: ["DEVICE_DOMAIN_LIMIT"] });
  });

  it("blocks combined suspicious activity before a single hard limit", () => {
    const result = evaluateSignupRisk({
      ipHour: 5,
      ipDay: 12,
      deviceDay: 2,
      ipDomainDay: 3,
      deviceDomainDay: 2,
    });
    expect(result.allowed).toBe(false);
    expect(result.score).toBe(100);
    expect(result.flags).toEqual(["COMBINED_ACTIVITY_RISK"]);
  });

  it("reads positive threshold overrides and ignores invalid values", () => {
    process.env.WAITLIST_MAX_SIGNUPS_PER_IP_HOUR = "3";
    expect(signupSecurityThresholdsFromEnv().ipHour).toBe(3);
    process.env.WAITLIST_MAX_SIGNUPS_PER_IP_HOUR = "0";
    expect(signupSecurityThresholdsFromEnv().ipHour).toBe(DEFAULT_SIGNUP_SECURITY_THRESHOLDS.ipHour);
  });
});
