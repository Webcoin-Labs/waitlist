import { Wordmark } from "./Brand";
import { COLORS, GRAD } from "@/lib/waitlist/tokens";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

type FooterLinkGroup = {
  title: string;
  links: FooterLink[];
};

const FOOTER_LINKS: FooterLinkGroup[] = [
  {
    title: "Build",
    links: [
      { label: "Founder Tools", href: "#join" },
      { label: "Builder Proof", href: "#join" },
      { label: "Pitch Deck Review", href: "#join" },
      { label: "Tokenomics Support", href: "#join" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Dashboard", href: "#join" },
      { label: "Builder Pass", href: "#join" },
      { label: "Credits", href: "#join" },
      { label: "Private Network", href: "#join" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Telegram", href: "https://t.me/thewebcoinlabs", external: true },
      { label: "X", href: "https://x.com/webcoinlabs", external: true },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/webcoin-capital", external: true },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t" style={{ borderColor: COLORS.darkBorder, background: GRAD.darkIsland }}>
      <div className="container mx-auto max-w-6xl px-6 py-10 sm:py-14">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[1.1fr_1.45fr]">
          <div>
            <Wordmark variant="light" height={26} />
            <p className="mt-3 max-w-[280px] text-[13px] leading-6" style={{ color: COLORS.darkTextSecondary }}>
              The operating system for founders.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-7 sm:grid-cols-3 sm:gap-8">
            {FOOTER_LINKS.map((group) => (
              <div key={group.title}>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "#a78bfa" }}>
                  {group.title}
                </p>
                <div className="mt-4 grid gap-3">
                  {group.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-[13px] font-medium transition-colors"
                      style={{ color: COLORS.darkTextSecondary }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-4 border-t pt-6 sm:mt-14 sm:gap-5 sm:pt-7 md:flex-row md:items-center" style={{ borderColor: COLORS.darkBorder }}>
          <p className="text-[12px] font-semibold" style={{ color: COLORS.darkText }}>
            © 2026 Webcoin Labs. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 text-[12px] font-medium" style={{ color: COLORS.darkTextSecondary }}>
            <a href="https://www.webcoinlabs.com/terms" target="_blank" rel="noopener noreferrer">
              Terms
            </a>
            <a href="https://www.webcoinlabs.com/privacy" target="_blank" rel="noopener noreferrer">
              Privacy
            </a>
            <a href="mailto:contact@webcoinlabs.com">Contact</a>
          </div>
        </div>

        <div className="mt-8 grid gap-3 text-[11px] leading-5" style={{ color: COLORS.darkTextMuted }}>
          <p>
            Webcoin Labs is an early-access founder and builder network. Access, introductions, advisor discovery, and
            Builder Pass eligibility depend on verification, fit, and availability.
          </p>
          <p>
            Credits are a promotional in-app points system for waitlist ranking and launch priority. They have no
            monetary, token, or airdrop value, and carry no ownership or financial rights.
          </p>
          <p>Nothing on this site is investment, legal, tax, or financial advice.</p>
        </div>
      </div>
    </footer>
  );
}
