import { Wordmark } from "./Brand";
import { COLORS } from "@/lib/waitlist/tokens";

const FOOTER_LINKS = [
  { title: "Build", links: ["Founder Tools", "Builder Proof", "Pitch Deck Review", "Tokenomics Support"] },
  { title: "Explore", links: ["Dashboard", "Founder Pass", "WebXP", "Private Network"] },
  { title: "Connect", links: ["Discord", "X", "Advisor Network", "Investor Access"] },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgAlt }}>
      <div className="container mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1.45fr]">
          <div>
            <Wordmark variant="dark" height={26} />
            <p className="mt-3 max-w-[280px] text-[13px] leading-6" style={{ color: COLORS.textSecondary }}>
              The operating system for founders.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {FOOTER_LINKS.map((group) => (
              <div key={group.title}>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: COLORS.accentDeep }}>
                  {group.title}
                </p>
                <div className="mt-4 grid gap-3">
                  {group.links.map((link) => (
                    <a key={link} href="#join" className="text-[13px] font-medium transition-colors" style={{ color: COLORS.textSecondary }}>
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-5 border-t pt-7 md:flex-row md:items-center" style={{ borderColor: COLORS.border }}>
          <p className="text-[12px] font-semibold" style={{ color: COLORS.text }}>
            © 2026 Webcoin Labs. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 text-[12px] font-medium" style={{ color: COLORS.textSecondary }}>
            <a href="#join">Terms</a>
            <a href="#join">Privacy</a>
            <a href="#join">Contact</a>
          </div>
        </div>

        <div className="mt-8 grid gap-3 text-[11px] leading-5" style={{ color: COLORS.textFaint }}>
          <p>
            Webcoin Labs is an early-access founder and builder network. Access, introductions, advisor discovery, and
            Founder Pass eligibility depend on verification, fit, and availability.
          </p>
          <p>
            WebXP is a promotional in-app points system for waitlist ranking and launch priority. It has no monetary,
            token, or airdrop value, and carries no ownership or financial rights.
          </p>
          <p>Nothing on this site is investment, legal, tax, or financial advice.</p>
        </div>
      </div>
    </footer>
  );
}
