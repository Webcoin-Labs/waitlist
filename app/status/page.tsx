import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { WaitlistStatusPanel } from "@/components/waitlist/WaitlistStatusPanel";
import { VerifyEmailPanel } from "@/components/waitlist/VerifyEmailPanel";
import { FounderPassEligibilityStrip } from "@/components/waitlist/FounderPassEligibilityStrip";
import { PartnerStrip } from "@/components/waitlist/PartnerStrip";
import { SiteFooter } from "@/components/waitlist/SiteFooter";
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
    <main className="min-h-screen" style={{ backgroundColor: COLORS.bg, color: COLORS.text }}>
      <section className="relative overflow-hidden px-5 pb-12 pt-8 sm:px-6 lg:pb-16 lg:pt-10">
        <div
          aria-hidden
          className="pointer-events-none absolute right-[10%] top-24 hidden h-44 w-44 rotate-12 rounded-[38px] border opacity-75 blur-[0.2px] lg:block"
          style={{
            borderColor: "rgba(167,139,250,0.24)",
            background: "linear-gradient(135deg, rgba(255,255,255,0.84), rgba(167,139,250,0.24))",
            boxShadow: "0 26px 80px -42px rgba(124,58,237,0.85), inset 0 0 38px rgba(124,58,237,0.12)",
          }}
        >
          <span className="grid h-full w-full -rotate-12 place-items-center text-6xl font-black" style={{ color: "rgba(124,58,237,0.28)" }}>
            W
          </span>
        </div>

        <div className="mx-auto mb-10 flex max-w-5xl items-center justify-between">
          <Link href="/" aria-label="Webcoin Labs">
            <Wordmark variant="dark" height={22} />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-[12px] font-semibold" style={{ color: COLORS.textSecondary }}>
              Home
            </Link>
            {status?.verified ? (
              <span
                className="hidden max-w-[220px] truncate rounded-full border px-3 py-1.5 text-[11px] font-semibold sm:inline-flex"
                style={{ borderColor: COLORS.border, color: COLORS.textSecondary, backgroundColor: "#fff" }}
              >
                {status.email}
              </span>
            ) : null}
          </div>
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
            <div className="mx-auto mb-8 max-w-5xl">
              <div
                className="mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em]"
                style={{ borderColor: COLORS.borderAccent, color: COLORS.accentDeep, backgroundColor: "rgba(124,58,237,0.06)" }}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Email verified
              </div>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight md:text-5xl md:leading-[1.02]" style={{ color: COLORS.text }}>
                You&apos;re on the Webcoin Labs waitlist.
              </h1>
              <p className="mt-3 max-w-xl text-[14px] leading-6" style={{ color: COLORS.textSecondary }}>
                Invite verified founders, builders, and ecosystem operators to move up.
              </p>
              <p className="mt-3 text-[12px] font-semibold" style={{ color: COLORS.textMuted }}>
                Webcoin Labs is the OS for founders and serious builders.
              </p>
            </div>
            <WaitlistStatusPanel
              email={status.email ?? ""}
              displayName={status.displayName ?? status.name ?? "Founder"}
              referralCode={status.referralCode}
              statusToken={status.statusToken}
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
              xShareText={status.xShareText}
              xShareUrl={status.xShareUrl}
              leaderboard={status.leaderboard}
              taskStates={status.taskStates}
              networkStats={status.networkStats}
            />
          </>
        )}
      </section>

      {status?.verified ? (
        <>
          <FounderPassEligibilityStrip />
          <PartnerStrip />
          <SiteFooter />
        </>
      ) : null}
    </main>
  );
}
