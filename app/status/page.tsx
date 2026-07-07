import type { Metadata } from "next";
import Link from "next/link";
import { WaitlistStatusPanel } from "@/components/waitlist/WaitlistStatusPanel";
import { VerifyEmailPanel } from "@/components/waitlist/VerifyEmailPanel";
import { Wordmark } from "@/components/waitlist/Brand";
import { getWaitlistStatus } from "@/app/actions/waitlist";
import { COLORS } from "@/lib/waitlist/tokens";

export const metadata: Metadata = { title: "You're on the Webcoin Labs waitlist" };

export default async function StatusPage({
  searchParams,
}: {
  searchParams?: Promise<{ c?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const code = typeof sp.c === "string" ? sp.c : "";
  const status = code ? await getWaitlistStatus(code) : null;

  return (
    <main className="min-h-screen px-6 py-14" style={{ backgroundColor: COLORS.bg, color: COLORS.text }}>
      <div className="mx-auto mb-10 flex max-w-5xl items-center justify-between">
        <Link href="/" aria-label="Webcoin Labs">
          <Wordmark variant="dark" height={26} />
        </Link>
        <Link href="/" className="text-[13px] font-medium" style={{ color: COLORS.textSecondary }}>
          Home →
        </Link>
      </div>

      {!status ? (
        <div
          className="mx-auto max-w-md rounded-3xl border p-8 text-center"
          style={{ borderColor: COLORS.border, backgroundColor: "#fff" }}
        >
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: COLORS.text }}>
            Status not found
          </h1>
          <p className="mt-3 text-[15px] leading-6" style={{ color: COLORS.textSecondary }}>
            We couldn&apos;t find that early-access record. Join the list to get your status link.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full px-6 py-3 text-sm font-semibold"
            style={{ backgroundColor: COLORS.text, color: "#fff" }}
          >
            Join waitlist
          </Link>
        </div>
      ) : !status.verified ? (
        <div className="mx-auto max-w-md">
          <VerifyEmailPanel email={status.email} />
        </div>
      ) : (
        <>
          <div className="mx-auto mb-8 max-w-5xl text-center">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl" style={{ color: COLORS.text }}>
              You&apos;re on the Webcoin Labs waitlist.
            </h1>
            <p className="mt-2 text-[15px]" style={{ color: COLORS.textSecondary }}>
              Invite verified founders, builders, and ecosystem operators to move up.
            </p>
          </div>
          <WaitlistStatusPanel
            role={status.role ?? "FOUNDER"}
            status={status.status ?? "VERIFIED"}
            webXp={status.webXp}
            verifiedReferralCount={status.verifiedReferralCount}
            rank={status.rank}
            rankedTotal={status.rankedTotal}
            accessTier={status.accessTier}
            founderPassStatus={status.founderPassStatus}
            founderPassTier={status.founderPassTier}
            founderPassTrack={status.founderPassTrack}
            referralLink={status.referralLink}
          />
        </>
      )}
    </main>
  );
}
