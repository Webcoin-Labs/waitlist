import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/waitlist/Brand";
import { WaitlistHero } from "@/components/waitlist/WaitlistHero";
import { FounderPassEligibilityStrip } from "@/components/waitlist/FounderPassEligibilityStrip";
import { PartnerStrip } from "@/components/waitlist/PartnerStrip";
import { DashboardPreview } from "@/components/waitlist/DashboardPreview";
import { WhoFor } from "@/components/waitlist/WhoFor";
import { BeforeAfter } from "@/components/waitlist/BeforeAfter";
import { FounderPassSection } from "@/components/waitlist/FounderPassSection";
import { FounderPassInviteSection } from "@/components/waitlist/FounderPassInviteSection";
import { CreditsSystem } from "@/components/waitlist/CreditsSystem";
import { PerksGrid } from "@/components/waitlist/PerksGrid";
import { Faq } from "@/components/waitlist/Faq";
import { FinalCta } from "@/components/waitlist/FinalCta";
import { SiteFooter } from "@/components/waitlist/SiteFooter";
import { COLORS } from "@/lib/waitlist/tokens";

const SITE_TITLE = "Webcoin Labs — Waitlist";
const SITE_DESCRIPTION =
  "Join the Webcoin Labs waitlist. Get early access to a private network of founders, builders, investors, and advisors — built for people going from zero to 100.";

function baseUrl() {
  return (process.env.WAITLIST_BASE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/+$/, "");
}

function sanitizeRef(value: string | undefined): string {
  return (value ?? "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 32);
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ ref?: string }>;
}): Promise<Metadata> {
  const sp = (await searchParams) ?? {};
  const ref = sanitizeRef(typeof sp.ref === "string" ? sp.ref : undefined);

  if (!ref) {
    return { title: SITE_TITLE, description: SITE_DESCRIPTION };
  }

  // Per-referrer share card so links pasted into X/Discord/iMessage unfurl with a
  // personalized preview — X's tweet-intent URL has no way to attach media directly,
  // so the OG image on the shared link is the only path to a "photo" on share.
  const imageUrl = `${baseUrl()}/api/share-card?ref=${encodeURIComponent(ref)}`;
  return {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    openGraph: { title: SITE_TITLE, description: SITE_DESCRIPTION, images: [{ url: imageUrl, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION, images: [imageUrl] },
  };
}

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Why Join", href: "#why-join" },
  { label: "FAQ", href: "#faq" },
  { label: "Read docs", href: "/docs" },
] as const;

export default async function WaitlistLandingPage({
  searchParams,
}: {
  searchParams?: Promise<{ ref?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const referralCode = typeof sp.ref === "string" ? sp.ref : undefined;

  return (
    <main className="waitlist-page" style={{ backgroundColor: COLORS.bg, color: COLORS.text }}>
      {/* top nav */}
      <div className="absolute left-0 right-0 top-0 z-30">
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
          <Link href="/" aria-label="Webcoin Labs" className="max-sm:origin-left max-sm:scale-90">
            <Wordmark variant="dark" height={24} priority />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  link.href === "/docs"
                    ? "rounded-full border border-zinc-300 bg-white/70 px-3 py-1.5 text-[13px] font-semibold text-zinc-800 transition-transform hover:-translate-y-0.5"
                    : "text-[13.5px] font-medium transition-colors"
                }
                style={link.href === "/docs" ? undefined : { color: COLORS.textSecondary }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <a
            href="#join"
            className="rounded-full px-3 py-2 text-[11px] font-semibold transition-transform hover:-translate-y-0.5 sm:px-4 sm:text-[13px]"
            style={{ backgroundColor: COLORS.text, color: "#fff" }}
          >
            Request access
          </a>
        </div>
      </div>

      <div id="join">
        <WaitlistHero referralCode={referralCode} />
      </div>

      <FounderPassEligibilityStrip />
      <PartnerStrip />
      <PerksGrid />
      <FounderPassSection />
      <FounderPassInviteSection />
      <CreditsSystem />
      <DashboardPreview />
      <div className="hidden lg:block">
        <WhoFor />
      </div>
      <BeforeAfter />
      <Faq />
      <FinalCta referralCode={referralCode} />
      <SiteFooter />
    </main>
  );
}
