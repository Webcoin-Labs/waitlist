"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { WaitlistForm } from "./WaitlistForm";
import { HeroMockup } from "./HeroMockup";
import { MobileDashboardPhone } from "./MobileDashboardPhone";
import { GradientText } from "./Brand";
import { COLORS, EASE, GRAD } from "@/lib/waitlist/tokens";

const BENEFITS = [
  "Early access to Webcoin Labs products",
  "Founder tools, including pitch deck support, a tokenomics generator, builder access, investor introductions, and more",
  "Unlock the exclusive Founder Pass",
  "Access a network of 2,000+ VCs and angel investors to help you raise funds",
] as const;

export function WaitlistHero({ referralCode }: { referralCode?: string }) {
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

      <div className="container relative z-10 mx-auto max-w-7xl px-4 pb-8 pt-20 sm:px-6 sm:pb-10 sm:pt-24 lg:pb-12 lg:pt-24">
        <div className="grid items-start gap-5 sm:gap-7 lg:grid-cols-[minmax(390px,0.72fr)_minmax(0,1.28fr)] xl:gap-8">
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="order-1 inline-flex self-start items-center gap-2 rounded-full border px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] sm:px-3.5 sm:py-1.5 sm:text-[11px] lg:order-none"
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
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05, ease: EASE }}
              className="order-2 mt-4 max-w-xl text-[1.9rem] font-bold leading-[1.08] tracking-[-0.02em] max-lg:text-balance sm:mt-5 sm:text-[2.15rem] sm:leading-[1.05] md:text-[3.1rem] lg:order-none lg:text-[2.65rem] xl:text-[2.85rem]"
            >
              Build real{"\u00a0"}startups with the right{" "}
              <GradientText>builders, systems, and distribution.</GradientText>
            </motion.h1>

            <div className="order-6 mt-6 lg:order-none lg:hidden">
              <MobileDashboardPhone compact />
            </div>

            <motion.ul
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
              className="order-4 mt-5 grid max-w-xl gap-1.5 sm:mt-4 sm:gap-2 lg:order-none"
            >
              {BENEFITS.map((line, i) => (
                <motion.li
                  key={line}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.16 + i * 0.04, ease: EASE }}
                  className="grid grid-cols-[18px_minmax(0,1fr)] items-start gap-2.5 text-[12px] font-medium leading-[18px] max-lg:text-pretty sm:grid-cols-[20px_minmax(0,1fr)] sm:gap-3 sm:text-[13.5px] sm:leading-5"
                  style={{ color: COLORS.textSecondary }}
                >
                  <span className="mt-0.5 inline-flex size-[18px] shrink-0 items-center justify-center rounded-full sm:size-5" style={{ backgroundImage: GRAD.brand, color: "#fff" }}>
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
              className="order-3 mt-4 max-w-xl sm:mt-5 lg:order-none"
              id="join-form"
            >
              <WaitlistForm referralCode={referralCode} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.42, ease: EASE }}
              className="order-5 mt-4 max-w-xl text-[13px] font-medium leading-5 max-lg:text-pretty sm:mt-6 sm:text-[18px] sm:leading-7 lg:order-none"
              style={{ color: COLORS.textSecondary }}
            >
              The OS for founders, builders, and Investors.
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
