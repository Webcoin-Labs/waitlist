import { describe, expect, it } from "vitest";
import { buildVerificationHtml, buildVerificationText, subjectFor } from "@/lib/notifications/emailTemplate";

const VERIFY_LINK = "https://www.webcoinlabs.com/verify?token=abc123def456abc123def456";

describe("verification email template", () => {
  it("uses role-aware subjects", () => {
    expect(subjectFor("FOUNDER")).toBe("Verify your Webcoin Labs early access");
    expect(subjectFor("BUILDER")).toContain("builder");
    expect(subjectFor("INVESTOR")).toContain("investor");
    expect(subjectFor(null)).toBe("Verify your Webcoin Labs early access");
  });

  it("renders logo from the verify link origin", () => {
    const html = buildVerificationHtml({ verifyLink: VERIFY_LINK, displayName: "Anshit Raj", role: "FOUNDER" });
    expect(html).toContain("https://www.webcoinlabs.com/logo/webcoin-wordmark-dark.webp");
    expect(html).toContain('alt="Webcoin Labs"');
  });

  it("greets by display name and includes the verify link twice (button + fallback)", () => {
    const html = buildVerificationHtml({ verifyLink: VERIFY_LINK, displayName: "Anshit Raj", role: "FOUNDER" });
    expect(html).toContain("Hi Anshit Raj,");
    expect(html.split(VERIFY_LINK).length - 1).toBe(2);
  });

  it("keeps role-specific activation lines", () => {
    const founder = buildVerificationHtml({ verifyLink: VERIFY_LINK, displayName: "A", role: "FOUNDER" });
    const builder = buildVerificationHtml({ verifyLink: VERIFY_LINK, displayName: "A", role: "BUILDER" });
    const investor = buildVerificationHtml({ verifyLink: VERIFY_LINK, displayName: "A", role: "INVESTOR" });
    expect(founder).toContain("Founder Pass consideration after beta launch");
    expect(builder).toContain("Builder Pass eligibility");
    expect(investor).toContain("Verified deal-flow access");
    expect(investor).not.toContain("Founder Pass");
  });

  it("never promises claimable or guaranteed access", () => {
    for (const role of ["FOUNDER", "BUILDER", "INVESTOR", "ADVISOR"] as const) {
      const html = buildVerificationHtml({ verifyLink: VERIFY_LINK, displayName: "A", role }).toLowerCase();
      expect(html).not.toContain("claimable");
      // "not guaranteed" is the required disclaimer; any other "guaranteed" is a promise.
      expect(html.replace(/not guaranteed/g, "")).not.toContain("guaranteed");
    }
  });

  it("includes footer compliance blocks and legal links", () => {
    const html = buildVerificationHtml({ verifyLink: VERIFY_LINK, displayName: "A", role: "FOUNDER" });
    expect(html).toContain("no monetary value");
    expect(html).toContain("seed phrase");
    expect(html).toContain("https://www.webcoinlabs.com/terms");
    expect(html).toContain("https://www.webcoinlabs.com/privacy");
    expect(html).toContain("https://www.webcoinlabs.com/risk-warning");
    expect(html).toContain("© 2026 Webcoin Labs. All rights reserved.".replace("©", "&copy;"));
  });

  it("plain text mirrors the essentials", () => {
    const text = buildVerificationText({ verifyLink: VERIFY_LINK, displayName: "Anshit Raj", role: "BUILDER" });
    expect(text).toContain("Hi Anshit Raj,");
    expect(text).toContain(VERIFY_LINK);
    expect(text).toContain("- Builder Pass eligibility");
    expect(text).toContain("Risk Warning: https://www.webcoinlabs.com/risk-warning");
    expect(text).toContain("contact@webcoinlabs.com");
  });

  it("escapes html-sensitive display names", () => {
    const html = buildVerificationHtml({ verifyLink: VERIFY_LINK, displayName: '<img src=x onerror="1">', role: "FOUNDER" });
    expect(html).not.toContain('<img src=x onerror="1">');
    expect(html).toContain("&lt;img src=x onerror=");
  });
});
