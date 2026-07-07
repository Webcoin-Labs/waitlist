import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

function read(path: string) {
  return readFileSync(join(root, path), "utf8");
}

function walk(dir: string): string[] {
  return readdirSync(join(root, dir)).flatMap((name) => {
    const path = join(dir, name);
    const full = join(root, path);
    return statSync(full).isDirectory() ? walk(path) : [path];
  });
}

describe("Founder Pass direction", () => {
  it("defines Founder Pass fields in Prisma schema", () => {
    const schema = read("prisma/schema.prisma");
    expect(schema).toContain("enum FounderPassStatus");
    expect(schema).toContain("enum FounderPassTier");
    expect(schema).toContain("enum FounderPassTrack");
    expect(schema).toContain("founderPassStatus");
    expect(schema).toContain("founderPassTier");
    expect(schema).toContain("founderPassTrack");
  });

  it("removes old product labels from app UI source", () => {
    const source = walk("app").concat(walk("components"), walk("lib")).map(read).join("\n");
    expect(source).not.toMatch(/Arc Builder Card|Arc Card|Builder Card|Arc card|Builder card/);
    expect(source).toContain("Founder Pass");
  });

  it("keeps the public waitlist form email-only", () => {
    const form = read("components/waitlist/WaitlistForm.tsx");
    expect(form).toContain('fd.set("email", email)');
    expect(form).not.toContain("ROLE_OPTIONS");
    expect(form).not.toContain('fd.set("role"');
  });

  it("shows Founder Pass in status and admin surfaces", () => {
    const status = read("components/waitlist/WaitlistStatusPanel.tsx");
    const admin = read("components/waitlist/AdminWaitlistTable.tsx");
    expect(status).toContain("Founder Pass");
    expect(status).toContain("founderPassStatus");
    expect(admin).toContain("Founder Pass");
    expect(admin).toContain("adminSetFounderPassStatus");
  });
});
