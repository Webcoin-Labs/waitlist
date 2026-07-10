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
import { WebXpSystem } from "@/components/waitlist/WebXpSystem";
import { PerksGrid } from "@/components/waitlist/PerksGrid";
import { Faq } from "@/components/waitlist/Faq";
import { FinalCta } from "@/components/waitlist/FinalCta";
import { SiteFooter } from "@/components/waitlist/SiteFooter";
import { COLORS } from "@/lib/waitlist/tokens";

export const metadata: Metadata = {
  title: "Webcoin Labs — Waitlist",
  description:
    "Join the Webcoin Labs waitlist. Get early access to a private network of founders, builders, investors, and advisors — built for people going from zero to 100.",
};

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Why Join", href: "#why-join" },
  { label: "FAQ", href: "#faq" },
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
              <a
                key={link.href}
                href={link.href}
                className="text-[13.5px] font-medium transition-colors"
                style={{ color: COLORS.textSecondary }}
              >
                {link.label}
              </a>
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
      <WebXpSystem />
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
