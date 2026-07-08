"use client";

import { motion } from "framer-motion";
import { Check, Rocket } from "lucide-react";
import { WaitlistForm } from "./WaitlistForm";
import { HeroMockup } from "./HeroMockup";
import { GradientText } from "./Brand";
import { COLORS, EASE, GRAD } from "@/lib/waitlist/tokens";

const BENEFITS = [
  "Builder Pass access",
  "+100 WebXP first 7 days",
  "Founder tools",
  "Pitch deck and tokenomics review",
  "Builder access and advisor discovery",
] as const;

export function WaitlistHero({ referralCode, statLabel }: { referralCode?: string; statLabel: string }) {
  return (
    <section className="relative overflow-hidden" style={{ background: GRAD.heroMesh, color: COLORS.text }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.46]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(11,10,18,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,10,18,0.035) 1px, transparent 1px)",
          backgroundSize: "58px 58px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent 78%)",
        }}
      />

      <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
        <div
          className="absolute -right-[12%] top-[4%] h-[780px] w-[780px] rounded-full border opacity-[0.45]"
          style={{ borderColor: "rgba(124,58,237,0.14)" }}
        />
        <div
          className="absolute -right-[4%] top-[14%] h-[560px] w-[560px] rounded-full border opacity-[0.55]"
          style={{ borderColor: "rgba(37,99,235,0.12)" }}
        />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-6 pb-14 pt-24 lg:pb-16 lg:pt-28">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(420px,0.82fr)_minmax(0,1.18fr)] xl:gap-10">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={{
                borderColor: COLORS.border,
                color: COLORS.accentDeep,
                backgroundColor: "rgba(255,255,255,0.82)",
                boxShadow: "0 1px 2px rgba(11,10,18,0.04), 0 8px 24px -14px rgba(124,58,237,0.35)",
              }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70" style={{ backgroundColor: COLORS.accent }} />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: COLORS.accent }} />
              </span>
              Private early access
              <Rocket className="h-3.5 w-3.5" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05, ease: EASE }}
              className="mt-6 max-w-xl text-[2.5rem] font-bold leading-[1.02] tracking-[-0.02em] md:text-[4rem] lg:text-[3.55rem]"
            >
              Join the <GradientText>Webcoin Labs</GradientText> waitlist
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease: EASE }}
              className="mt-5 max-w-lg text-[18px] leading-7 md:text-[19px]"
              style={{ color: COLORS.textSecondary }}
            >
              The OS for founders, builders, and future breakout teams.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16, ease: EASE }}
              className="mt-3 max-w-lg text-[15px] leading-6"
              style={{ color: COLORS.textMuted }}
            >
              Get early access to founder tools, builder access, pitch deck intelligence, tokenomics support, WebXP,
              and private network opportunities.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24, ease: EASE }}
              className="mt-6 max-w-xl"
              id="join-form"
            >
              <WaitlistForm referralCode={referralCode} />
            </motion.div>

            <motion.ul
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32, ease: EASE }}
              className="mt-5 flex flex-wrap gap-2"
            >
              {BENEFITS.map((line, i) => (
                <motion.li
                  key={line}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.36 + i * 0.04, ease: EASE }}
                  className="inline-flex items-center gap-2 rounded-xl border bg-white/70 px-3 py-2 text-[12.5px] font-semibold shadow-[0_10px_28px_-24px_rgba(11,10,18,0.5)]"
                  style={{ borderColor: COLORS.border, color: COLORS.textSecondary }}
                >
                  <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full" style={{ backgroundImage: GRAD.brand, color: "#fff" }}>
                    <Check className="h-2.5 w-2.5" strokeWidth={2.8} />
                  </span>
                  {line}
                </motion.li>
              ))}
            </motion.ul>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
              className="mt-4 max-w-xl text-[12.5px] leading-6"
              style={{ color: COLORS.textMuted }}
            >
              Webcoin Labs gives founders and builders one operating layer to collaborate, ship faster, and become
              fundraising-ready through structured profiles, matching, intros, and ecosystem distribution.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.58 }}
              className="mt-3 text-[11.5px] font-medium uppercase tracking-[0.14em]"
              style={{ color: COLORS.textMuted }}
            >
              {statLabel}
            </motion.p>
          </div>

          <div className="hidden lg:block">
            <HeroMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
