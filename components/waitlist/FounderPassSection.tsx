"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { TiltCard } from "./TiltCard";
import { GradientText } from "./Brand";
import { COLORS, EASE, GRAD } from "@/lib/waitlist/tokens";

export const TIERS = [
  { label: "Bronze", src: "/logo/7411-bronze.png" },
  { label: "Silver", src: "/logo/8099-silver.png" },
  { label: "Gold", src: "/logo/1881-gold.png" },
  { label: "Platinum", src: "/logo/1117-platinum.png" },
  { label: "Diamond", src: "/logo/83783-diamonrank.png" },
] as const;

const TRACKS = ["Arc", "Base"] as const;

// Light variants (dark logo, for white surfaces). Dark-surface variants land per-track as they arrive.
const TRACK_LOGO_LIGHT: Record<(typeof TRACKS)[number], string> = {
  Arc: "/logo/Arc_Logo_NavyGradient.svg",
  Base: "/logo/baselogoblackcolor.svg",
};
const TRACK_LOGO_DARK: Partial<Record<(typeof TRACKS)[number], string>> = {
  Arc: "/logo/circle-logo-ondark.svg",
  Base: "/logo/Base_lockup_white.svg",
};

export function FounderPassSection() {
  return (
    <section className="py-11 sm:py-14 lg:py-24" style={{ backgroundColor: COLORS.bg }}>
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-9 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{ borderColor: COLORS.borderAccent, color: COLORS.accentDeep, backgroundColor: "rgba(124,58,237,0.05)" }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: COLORS.accent }} />
              Builder Pass beta
            </span>
            <h2 className="mt-4 text-[2rem] font-bold tracking-tight max-lg:text-balance sm:mt-5 sm:text-4xl md:text-[4.2rem] md:leading-[0.95]" style={{ color: COLORS.text }}>
              Builder Pass.
            </h2>
            <p className="mt-2.5 text-xl font-semibold tracking-tight sm:mt-3 sm:text-2xl" style={{ color: COLORS.text }}>
              Your verified builder credential.
            </p>
            <p className="mt-4 max-w-lg text-[13.5px] leading-6 max-lg:text-pretty sm:mt-5 sm:text-[15px] sm:leading-7" style={{ color: COLORS.textSecondary }}>
              Builder Pass is a proof-based access credential for builders shipping on selected ecosystems. It
              recognizes real execution across Arc and Base — including mini apps, deployed contracts, GitHub
              projects, and ecosystem contributions.
            </p>
            <p className="mt-3 max-w-lg text-[14px] leading-6" style={{ color: COLORS.textMuted }}>
              Builder Pass beta is currently available for builders shipping on Arc and Base.
            </p>

            <div className="mt-7 rounded-2xl border p-4" style={{ borderColor: COLORS.border, backgroundColor: "#fff" }}>
              <p className="text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: COLORS.textMuted }}>
                Available in beta for Arc and Base builders
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {TRACKS.map((track) => (
                  <span key={track} className="inline-flex items-center rounded-full border px-4 py-2" style={{ borderColor: COLORS.borderAccent, color: COLORS.text }}>
                    <img src={TRACK_LOGO_LIGHT[track]} alt={track} className="h-5 w-auto object-contain" />
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a href="#join-form" className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5" style={{ backgroundColor: COLORS.text, color: "#fff" }}>
                Join waitlist
                <ArrowRight className="h-4 w-4" />
              </a>
              <span
                aria-disabled
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold opacity-70"
                style={{ borderColor: COLORS.border, color: COLORS.text, backgroundColor: "#fff" }}
              >
                Check eligibility
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ backgroundColor: COLORS.surfaceMuted, color: COLORS.textMuted }}>
                  Coming soon
                </span>
              </span>
            </div>

            <p className="mt-6 text-[12px] leading-5" style={{ color: COLORS.textMuted }}>
              Builder Pass is an in-app access credential inside Webcoin Labs. It has no monetary value, no token
              value, no airdrop value, and does not represent ownership, investment, or financial rights.
            </p>
          </div>

          <div className="grid gap-5">
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.65, ease: EASE }}
              className="mx-auto w-full max-w-xl"
            >
              <TiltCard
                className="relative overflow-hidden rounded-[22px] p-5 sm:rounded-[26px] sm:p-8"
                style={{
                  background: GRAD.darkIsland,
                  boxShadow:
                    "0 0 0 1.5px rgba(167,139,250,0.55), 0 0 40px -6px rgba(34,211,238,0.35), 0 50px 120px -52px rgba(124,58,237,0.6)",
                }}
                max={10}
              >
                <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ backgroundImage: GRAD.brand }} />
                <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl" style={{ backgroundColor: "rgba(124,58,237,0.3)" }} />
                <img
                  src="/logo/webcoin-mono-white.webp"
                  alt=""
                  aria-hidden
                  className="pointer-events-none absolute -bottom-4 -right-4 h-28 w-28 object-contain opacity-[0.06]"
                />

                <div className="relative flex flex-col gap-7" style={{ transform: "translateZ(34px)" }}>
                  <div className="flex items-center justify-between gap-5">
                    <div className="min-w-0">
                      <img src="/logo/webcoin-wordmark-light.webp" alt="Webcoin Labs" className="h-10 w-auto max-w-[220px] object-contain sm:h-12" />
                    </div>
                    <p className="text-[22px] font-bold tracking-tight" style={{ color: COLORS.darkText }}>
                      Builder Pass
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div
                      className="h-24 w-24 shrink-0 rounded-full p-[2.5px]"
                      style={{ background: "conic-gradient(from 180deg, #a78bfa, #22d3ee, #f472b6, #a78bfa)" }}
                    >
                      <img
                        src="/logo/solrishuavatar.png"
                        alt="Builder"
                        className="h-full w-full rounded-full object-cover"
                        style={{ backgroundColor: COLORS.darkSurface }}
                      />
                    </div>

                    <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-3 text-[12.5px]">
                      <PassField label="Builder" value="Solrishu" />
                      <PassField label="Project" value="Webcoin Labs" />
                      <PassField label="Mini app" value="Launched" check />
                      <PassField label="Contracts interacted" value="100+" />
                      <PassField label="GitHub" value="Connected" check />
                      <div>
                        <p className="text-[10.5px] uppercase tracking-[0.12em]" style={{ color: COLORS.darkTextMuted }}>
                          Network
                        </p>
                        <div className="mt-0.5 flex items-center gap-3">
                          {TRACKS.map((track) => (
                            <span key={track} className="inline-flex items-center gap-1.5">
                              <img
                                src={TRACK_LOGO_DARK[track] ?? `/logo/${track.toLowerCase()}.webp`}
                                alt=""
                                className="h-3.5 w-auto object-contain"
                              />
                              <GradientText className="text-[12.5px] font-semibold">{track}</GradientText>
                            </span>
                          ))}
                        </div>
                      </div>
                      <PassField label="Tier" value="Gold" gold />
                      <div>
                        <p className="text-[10.5px] uppercase tracking-[0.12em]" style={{ color: COLORS.darkTextMuted }}>
                          Status
                        </p>
                        <span
                          className="mt-1 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold"
                          style={{ backgroundColor: "rgba(167,139,250,0.18)", color: "#c4b5fd" }}
                        >
                          Early Access
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            <div className="rounded-2xl border p-4" style={{ borderColor: COLORS.border, backgroundColor: "#fff" }}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" style={{ color: COLORS.accentDeep }} />
                <p className="text-[13px] font-bold" style={{ color: COLORS.text }}>
                  Tier depends on verified builder proof, contracts interacted, launch quality, GitHub activity, and
                  ecosystem contribution.
                </p>
              </div>
              <div className="mt-4 grid grid-cols-5 gap-2">
                {TIERS.map((tier) => (
                  <div
                    key={tier.label}
                    className="flex flex-col items-center justify-center rounded-2xl border px-2 py-3"
                    style={{
                      borderColor: tier.label === "Gold" ? COLORS.borderAccent : COLORS.border,
                      backgroundColor: tier.label === "Gold" ? "rgba(124,58,237,0.1)" : COLORS.surfaceMuted,
                    }}
                  >
                    <img src={tier.src} alt={tier.label} className="h-14 w-14 object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PassField({ label, value, check, gold }: { label: string; value: string; check?: boolean; gold?: boolean }) {
  return (
    <div>
      <p className="text-[10.5px] uppercase tracking-[0.12em]" style={{ color: COLORS.darkTextMuted }}>
        {label}
      </p>
      <p className="mt-0.5 flex items-center gap-1.5 font-semibold" style={{ color: gold ? "#facc15" : COLORS.darkText }}>
        {value}
        {check ? <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "#34d399" }} /> : null}
      </p>
    </div>
  );
}
