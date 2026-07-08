import { describe, it, expect } from "vitest";
import { getDisplayNameFromEmail } from "@/lib/notifications/displayName";

describe("getDisplayNameFromEmail", () => {
  it("derives from a concatenated local-part with trailing digits", () => {
    expect(getDisplayNameFromEmail("anshitraj4@gmail.com")).toBe("Anshit Raj");
  });

  it("derives from a dot-separated local-part", () => {
    expect(getDisplayNameFromEmail("anshit.raj@gmail.com")).toBe("Anshit Raj");
  });

  it("derives from an underscore-separated local-part", () => {
    expect(getDisplayNameFromEmail("founder_team@gmail.com")).toBe("Founder Team");
  });

  it("derives from a hyphen-separated local-part", () => {
    expect(getDisplayNameFromEmail("jane-doe@example.com")).toBe("Jane Doe");
  });

  it("derives from camelCase local-parts", () => {
    expect(getDisplayNameFromEmail("JaneDoe@example.com")).toBe("Jane Doe");
  });

  it("falls back to null for generic mailbox prefixes", () => {
    expect(getDisplayNameFromEmail("info@example.com")).toBeNull();
    expect(getDisplayNameFromEmail("noreply@example.com")).toBeNull();
    expect(getDisplayNameFromEmail("admin123@example.com")).toBeNull();
  });

  it("title-cases a single confident token when no split is found", () => {
    expect(getDisplayNameFromEmail("zephyrion@example.com")).toBe("Zephyrion");
  });
});
