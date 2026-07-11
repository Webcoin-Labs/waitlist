import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Mail } from "lucide-react";
import { WaitlistStatusPanel } from "@/components/waitlist/WaitlistStatusPanel";
import { VerifyEmailPanel } from "@/components/waitlist/VerifyEmailPanel";
import { FounderPassEligibilityStrip } from "@/components/waitlist/FounderPassEligibilityStrip";
import { Wordmark } from "@/components/waitlist/Brand";
import { getWaitlistStatus } from "@/app/actions/waitlist";
import { COLORS } from "@/lib/waitlist/tokens";

export const metadata: Metadata = { title: "Your Webcoin Labs dashboard" };

export default async function StatusPage({
  searchParams,
}: {
  searchParams?: Promise<{ c?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const code = typeof sp.c === "string" ? sp.c : "";
  const status = code ? await getWaitlistStatus(code) : null;

  return (
    <main className="min-h-dvh" style={{ backgroundColor: COLORS.bg, color: COLORS.text }}>
      <section className="px-5 pb-12 pt-5 sm:px-6 lg:pb-16 lg:pt-6">
        <div className="mx-auto max-w-6xl">
          <header className="flex items-center justify-between border-b py-4" style={{ borderColor: COLORS.border }}>
            <Link href="/" aria-label="Webcoin Labs">
              <Wordmark variant="dark" height={22} />
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/docs/faq" className="hidden text-[13px] font-medium sm:inline" style={{ color: COLORS.textSecondary }}>
                FAQ
              </Link>
              <Link href="/docs" className="rounded-full border border-zinc-300 bg-white/70 px-3 py-1.5 text-[13px] font-semibold text-zinc-800 transition-transform hover:-translate-y-0.5">
                Read docs
              </Link>
              <Link href="/" className="text-[12px] font-medium" style={{ color: COLORS.textSecondary }}>
                Back to home
              </Link>
              {status?.verified ? (
                <span className="hidden max-w-[240px] items-center gap-2 truncate rounded-full border px-3 py-1.5 text-[11px] font-medium sm:inline-flex" style={{ borderColor: COLORS.border, backgroundColor: "#fff", color: COLORS.textSecondary }}>
                  <Mail className="size-3.5 shrink-0" />
                  <span className="truncate">{status.email}</span>
                </span>
              ) : null}
            </nav>
          </header>

          {!status ? (
            <div className="mx-auto mt-16 max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm" style={{ borderColor: COLORS.border }}>
              <h1 className="text-balance text-2xl font-semibold tracking-tight" style={{ color: COLORS.text }}>
                Status link not found.
              </h1>
              <p className="mt-3 text-pretty text-[15px] leading-6" style={{ color: COLORS.textSecondary }}>
                We could not find that early-access record. Join the waitlist to receive a private dashboard link.
              </p>
              <Link href="/" className="mt-6 inline-flex rounded-lg px-5 py-3 text-sm font-semibold" style={{ backgroundColor: COLORS.text, color: "#fff" }}>
                Join the waitlist
              </Link>
            </div>
          ) : !status.verified ? (
            <div className="mx-auto mt-12 max-w-md">
              <VerifyEmailPanel email={status.email} />
            </div>
          ) : (
            <>
              <div className="grid gap-6 border-b py-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.42fr)] lg:items-end" style={{ borderColor: COLORS.border }}>
                <div>
                  <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase" style={{ color: COLORS.accentDeep }}>
                    <CheckCircle2 className="size-4" />
                    Early access verified
                  </p>
                  <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl" style={{ color: COLORS.text }}>
                    Your dashboard.
                  </h1>
                  <p className="mt-4 max-w-2xl text-pretty text-[16px] leading-7" style={{ color: COLORS.textSecondary }}>
                    Track your waitlist progress, invite the right people, and see the access paths currently available to you.
                  </p>
                </div>
                <div className="rounded-xl border bg-white p-4" style={{ borderColor: COLORS.border }}>
                  <p className="text-[10px] font-semibold uppercase" style={{ color: COLORS.textMuted }}>
                    Account
                  </p>
                  <p className="mt-2 truncate text-[14px] font-semibold" style={{ color: COLORS.text }}>
                    {status.displayName ?? status.name ?? "Founder"}
                  </p>
                  <p className="mt-1 truncate text-[12px]" style={{ color: COLORS.textSecondary }}>
                    {status.email}
                  </p>
                </div>
              </div>

              <div className="pt-8">
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
              </div>
            </>
          )}
        </div>
      </section>

      {status?.verified ? <FounderPassEligibilityStrip /> : null}
    </main>
  );
}
