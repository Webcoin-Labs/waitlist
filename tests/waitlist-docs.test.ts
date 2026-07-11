import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DOCS_PAGES, docsHref, getDocsPage } from "@/lib/docs/content";

describe("Webcoin Labs documentation", () => {
  it("has unique routes and section anchors", () => {
    expect(DOCS_PAGES.length).toBeGreaterThanOrEqual(15);
    expect(new Set(DOCS_PAGES.map((page) => page.slug)).size).toBe(DOCS_PAGES.length);
    for (const page of DOCS_PAGES) {
      expect(new Set(page.sections.map((section) => section.id)).size).toBe(page.sections.length);
      expect(docsHref(page.slug)).toMatch(/^\/docs/);
    }
  });

  it("publishes complete legal and help destinations", () => {
    const terms = getDocsPage(["legal", "terms"]);
    const privacy = getDocsPage(["legal", "privacy"]);
    const help = getDocsPage(["help"]);
    expect(terms?.sections.length).toBeGreaterThanOrEqual(12);
    expect(privacy?.sections.length).toBeGreaterThanOrEqual(12);
    expect(help?.title).toBe("Help and support");
  });

  it("uses Credits terminology and documents the Q4 2026 roadmap", () => {
    const content = JSON.stringify(DOCS_PAGES);
    expect(content).toContain("Credits");
    expect(content).toContain("Q4 2026");
    expect(content).not.toContain("WebXP");
  });

  it("connects the landing navigation, footer, and legacy legal routes", () => {
    const landing = readFileSync("app/page.tsx", "utf8");
    const footer = readFileSync("components/waitlist/SiteFooter.tsx", "utf8");
    const termsRoute = readFileSync("app/terms/page.tsx", "utf8");
    const privacyRoute = readFileSync("app/privacy/page.tsx", "utf8");
    expect(landing).toContain('label: "Read docs"');
    expect(footer).toContain('href="/docs/legal/terms"');
    expect(footer).toContain('href="/docs/legal/privacy"');
    expect(termsRoute).toContain('redirect("/docs/legal/terms")');
    expect(privacyRoute).toContain('redirect("/docs/legal/privacy")');
  });
});
