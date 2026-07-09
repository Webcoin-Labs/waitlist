"use client";

import { motion } from "framer-motion";
import { Check, Rocket } from "lucide-react";
import { WaitlistForm } from "./WaitlistForm";
import { HeroMockup } from "./HeroMockup";
import { GradientText, Wordmark } from "./Brand";
import { COLORS, EASE, GRAD } from "@/lib/waitlist/tokens";

const BENEFITS = [
  "Early access to Webcoin Labs products",
  "Founder tools, pitch deck review, tokenomics support, builder access, investor intros, and advisor discovery",
  "Unlock Founder Pass and Builder Pass",
  "Access 500+ venture capitalists, angel investors, and advisors from top companies like Microsoft, Google, and NVIDIA",
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

      <div className="container relative z-10 mx-auto max-w-7xl px-6 pb-10 pt-24 lg:pb-12 lg:pt-24">
        <div className="grid items-start gap-7 lg:grid-cols-[minmax(390px,0.72fr)_minmax(0,1.28fr)] xl:gap-8">
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
              className="mt-5 max-w-xl text-[2.15rem] font-bold leading-[1.05] tracking-[-0.02em] md:text-[3.1rem] lg:text-[2.65rem] xl:text-[2.85rem]"
            >
              Build real{"\u00a0"}startups with the right{" "}
              <GradientText>builders, systems, and distribution.</GradientText>
            </motion.h1>

            <motion.ul
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
              className="mt-4 grid max-w-xl gap-2"
            >
              {BENEFITS.map((line, i) => (
                <motion.li
                  key={line}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.16 + i * 0.04, ease: EASE }}
                  className="grid grid-cols-[20px_minmax(0,1fr)] items-start gap-3 text-[13px] font-medium leading-5 sm:text-[13.5px]"
                  style={{ color: COLORS.textSecondary }}
                >
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ backgroundImage: GRAD.brand, color: "#fff" }}>
                    <Check className="h-2.5 w-2.5" strokeWidth={2.8} />
                  </span>
                  <span>{line}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28, ease: EASE }}
              className="mt-5 max-w-xl"
              id="join-form"
            >
              <WaitlistForm referralCode={referralCode} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.42, ease: EASE }}
              className="mt-4 max-w-xl rounded-[20px] border bg-white/75 p-4 shadow-[0_18px_50px_-38px_rgba(11,10,18,0.45)] backdrop-blur"
              style={{ borderColor: COLORS.border }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: COLORS.textMuted }}>
                    What is
                  </p>
                  <div className="mt-1">
                    <Wordmark variant="dark" height={24} />
                  </div>
                </div>
                <span className="rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em]" style={{ borderColor: COLORS.borderAccent, color: COLORS.accentDeep, backgroundColor: "rgba(124,58,237,0.06)" }}>
                  {statLabel}
                </span>
              </div>

              <p className="mt-3 text-[15px] font-semibold leading-6" style={{ color: COLORS.text }}>
                The operating system for founders, builders, and future breakout teams.
              </p>
              <p className="mt-2 text-[12.5px] leading-5" style={{ color: COLORS.textSecondary }}>
                Webcoin Labs gives founders and builders one operating layer to collaborate, ship faster, become
                fundraising-ready, and access founder tools, builder discovery, pitch deck intelligence, tokenomics
                support, WebXP, private network opportunities, matching, intros, and ecosystem distribution.
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.56 }}
              className="sr-only"
              style={{ color: COLORS.textMuted }}
            >
              {statLabel}
            </motion.p>
          </div>

          <div className="hidden self-start pt-32 lg:block xl:pt-28">
            <HeroMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
