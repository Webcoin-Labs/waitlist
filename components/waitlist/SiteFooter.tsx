"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Wordmark } from "./Brand";
import { COLORS, GRAD } from "@/lib/waitlist/tokens";

const CONTACT_EMAIL = "contact@webcoinlabs.com";

function CopyEmailChip() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="mt-4 inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors hover:bg-white/[0.06]"
      style={{ borderColor: COLORS.darkBorder, color: COLORS.darkText, backgroundColor: "rgba(255,255,255,0.04)" }}
    >
      {CONTACT_EMAIL}
      {copied ? <Check className="size-3.5" style={{ color: "#34d399" }} /> : <Copy className="size-3.5" style={{ color: COLORS.darkTextSecondary }} />}
    </button>
  );
}

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
  comingSoon?: boolean;
};

type FooterLinkGroup = {
  title: string;
  links: FooterLink[];
};

const FOOTER_LINKS: FooterLinkGroup[] = [
  {
    title: "Build",
    links: [
      { label: "Founder Tools", href: "#join", comingSoon: true },
      { label: "Builder Proof", href: "#join", comingSoon: true },
      { label: "Pitch Deck Review", href: "#join", comingSoon: true },
      { label: "Tokenomics Support", href: "#join", comingSoon: true },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Founder Pass", href: "/docs/access/founder-pass" },
      { label: "Builder Pass", href: "/docs/access/builder-pass" },
      { label: "Credits", href: "/docs/platform/credits" },
      { label: "Brand Assets", href: "/docs/brand-assets" },
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
            <CopyEmailChip />
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
                      className="inline-flex items-center gap-2 text-[13px] font-medium transition-colors"
                      style={{ color: COLORS.darkTextSecondary }}
                    >
                      {link.label}
                      {link.comingSoon ? (
                        <span
                          className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                          style={{ backgroundColor: "rgba(255,255,255,0.08)", color: COLORS.darkTextMuted }}
                        >
                          Soon
                        </span>
                      ) : null}
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
            <a href="/docs">Docs</a>
            <a href="/docs/help">Help</a>
            <a href="/docs/legal/terms">Terms</a>
            <a href="/docs/legal/privacy">Privacy</a>
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
