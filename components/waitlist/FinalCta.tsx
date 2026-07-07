"use client";

import { WaitlistForm } from "./WaitlistForm";
import { GradientText } from "./Brand";
import { COLORS } from "@/lib/waitlist/tokens";

export function FinalCta({ referralCode }: { referralCode?: string }) {
  return (
    <section className="relative overflow-hidden border-t py-28" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
        style={{ background: "radial-gradient(700px 320px at 50% 0%, rgba(124,58,237,0.08), transparent 62%)" }}
      />
      <div className="container relative mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-[3.4rem] md:leading-[1.05]" style={{ color: COLORS.text }}>
          Build from <GradientText>zero to 100</GradientText>.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-6" style={{ color: COLORS.textSecondary }}>
          Join the Webcoin Labs waitlist and unlock founder tools, builder access, WebXP, and private network
          opportunities.
        </p>
        <div className="mx-auto mt-9 max-w-xl">
          <WaitlistForm referralCode={referralCode} theme="light" />
        </div>
      </div>
    </section>
  );
}
