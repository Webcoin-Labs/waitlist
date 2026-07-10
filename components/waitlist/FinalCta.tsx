"use client";

import { WaitlistForm } from "./WaitlistForm";
import { GradientText } from "./Brand";
import { COLORS } from "@/lib/waitlist/tokens";

export function FinalCta({ referralCode }: { referralCode?: string }) {
  return (
    <section className="relative overflow-hidden border-t py-12 sm:py-16 lg:py-28" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
        style={{ background: "radial-gradient(700px 320px at 50% 0%, rgba(124,58,237,0.08), transparent 62%)" }}
      />
      <div className="container relative mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-[1.9rem] font-bold tracking-tight max-lg:text-balance sm:text-3xl md:text-[3.4rem] md:leading-[1.05]" style={{ color: COLORS.text }}>
          Build from <GradientText>zero to 100</GradientText>.
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-[13.5px] leading-6 max-lg:text-pretty sm:mt-4 sm:text-[15px]" style={{ color: COLORS.textSecondary }}>
          Join the Webcoin Labs waitlist and unlock founder tools, builder access, WebXP, and private network
          opportunities.
        </p>
        <div className="mx-auto mt-6 max-w-xl sm:mt-9">
          <WaitlistForm referralCode={referralCode} theme="light" />
        </div>
      </div>
    </section>
  );
}
