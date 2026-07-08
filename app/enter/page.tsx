import type { Metadata } from "next";
import { GateForm } from "@/components/waitlist/GateForm";
import { COLORS, GRAD } from "@/lib/waitlist/tokens";

export const metadata: Metadata = {
  title: "Private access — Webcoin Labs",
  robots: { index: false, follow: false },
};

export default async function EnterPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const raw = typeof sp.next === "string" ? sp.next : "/";
  // Only allow same-site relative paths — block "//evil.com" style open redirects.
  const next = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16" style={{ background: GRAD.heroMesh, color: COLORS.text }}>
      <GateForm next={next} />
    </main>
  );
}
