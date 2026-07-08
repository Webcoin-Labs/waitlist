import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { WAITLIST_TASK_REWARDS, buildXShareText, buildXShareUrl } from "@/lib/waitlist/share";

const root = process.cwd();

function read(path: string) {
  return readFileSync(join(root, path), "utf8");
}

describe("waitlist launch tasks", () => {
  it("keeps task rewards explicit", () => {
    expect(WAITLIST_TASK_REWARDS).toEqual({
      X_SHARE: 200,
      THREE_VERIFIED_REFERRALS: 150,
      FOUNDER_PASS_ELIGIBILITY_CHECK: 5000,
    });
  });

  it("builds an encoded X intent URL with the referral link inside the text", () => {
    const referralUrl = "https://webcoinlabs.com/?ref=ABC123";
    const url = buildXShareUrl({ referralUrl, arcHandle: "arc", baseHandle: "@base" });

    expect(url).toMatch(/^https:\/\/x\.com\/intent\/tweet\?text=/);
    const decoded = decodeURIComponent(url.split("text=")[1]);
    expect(decoded).toContain(referralUrl);
    expect(decoded).toContain("@arc or @base");
    expect(decoded).toContain("#WebcoinLabs #FounderPass");
  });

  it("does not hardcode network handles when none are configured", () => {
    const text = buildXShareText({ referralUrl: "https://example.com/?ref=XYZ", arcHandle: "", baseHandle: "" });
    expect(text).toContain("Building on Arc or Base?");
    expect(text).not.toContain("@arc");
    expect(text).not.toContain("@base");
  });

  it("defines task completion persistence and one-time task keys", () => {
    const schema = read("prisma/schema.prisma");
    expect(schema).toContain("model WaitlistTaskCompletion");
    expect(schema).toContain("enum WaitlistTaskType");
    expect(schema).toContain("X_SHARE_TASK");
    expect(schema).toContain("THREE_VERIFIED_REFERRALS");
    expect(schema).toContain("FOUNDER_PASS_ELIGIBILITY_CHECK");
    expect(schema).toContain("@@unique([waitlistEntryId, taskType])");
  });
});
