import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { VerifyEmailPanel } from "@/components/waitlist/VerifyEmailPanel";
import { verifyWaitlistEmail } from "@/app/actions/waitlist";
import { COLORS, GRAD } from "@/lib/waitlist/tokens";

export const metadata: Metadata = { title: "Verify email — Webcoin Labs" };

export default async function VerifyPage({
  searchParams,
}: {
  searchParams?: Promise<{ token?: string; e?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const token = typeof sp.token === "string" ? sp.token : undefined;
  const email = typeof sp.e === "string" ? sp.e : undefined;

  if (token) {
    const result = await verifyWaitlistEmail(token);
    if (result.success) {
      redirect(`/status?c=${result.statusToken}`);
    }
    return (
      <Shell>
        <div
          className="mx-auto w-full max-w-md rounded-3xl border p-8 text-center"
          style={{ borderColor: COLORS.border, backgroundColor: "#fff" }}
        >
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: COLORS.text }}>
            Verification issue
          </h1>
          <p className="mt-3 text-[15px] leading-6" style={{ color: COLORS.textSecondary }}>
            {result.error}
          </p>
          {result.email ? (
            <div className="mt-6">
              <VerifyEmailPanel email={result.email} />
            </div>
          ) : (
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
              style={{ backgroundColor: COLORS.text, color: "#fff" }}
            >
              Back to waitlist
            </Link>
          )}
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <VerifyEmailPanel email={email} />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="flex min-h-screen items-center justify-center px-6 py-16"
      style={{ background: GRAD.heroMesh, color: COLORS.text }}
    >
      {children}
    </main>
  );
}
