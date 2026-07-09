"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { COLORS, EASE, GRAD } from "@/lib/waitlist/tokens";

const OLD_WAY = [
  "Cold outreach with no clear path to decision-makers",
  "Unqualified referrals that rarely turn into conversations",
  "Pitch feedback scattered across messages and calls",
  "Founder tools split across decks, spreadsheets, and DMs",
  "No visible progress, ranking signal, or next best action",
];

const WEBCOIN_WAY = [
  "Verified founder profile with early-access eligibility",
  "Founder Pass and Builder Pass pathways in one dashboard",
  "Pitch deck, tokenomics, and launch-readiness review",
  "Builder discovery, advisor matching, and warm intro requests",
  "WebXP signals that show momentum and priority",
  "A structured operating layer for every launch milestone",
];

const PAIN_POINTS = [
  "Capital Access",
  "Builder Discovery",
  "Pitch Readiness",
  "Advisor Matching",
  "Warm Introductions",
  "Launch Momentum",
];

function ComparisonRow({ children, positive, index }: { children: string; positive?: boolean; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay: index * 0.045, ease: EASE }}
      className="grid grid-cols-[24px_minmax(0,1fr)] items-start gap-3 rounded-2xl px-1 py-1 text-[14px] leading-6"
      style={{ color: positive ? COLORS.text : COLORS.textMuted }}
    >
      <span
        className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: positive ? "rgba(5,150,105,0.13)" : "rgba(220,38,38,0.09)",
          color: positive ? COLORS.green : COLORS.red,
        }}
      >
        {positive ? <Check className="h-3.5 w-3.5" strokeWidth={2.7} /> : <X className="h-3.5 w-3.5" strokeWidth={2.7} />}
      </span>
      <span>{children}</span>
    </motion.li>
  );
}

export function BeforeAfter() {
  return (
    <section className="border-t py-14 lg:py-24" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgAlt }}>
      <div className="container mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.22em]" style={{ color: COLORS.accentDeep }}>
            Founder operating layer
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-[1.05] tracking-tight md:text-[2.8rem]" style={{ color: COLORS.text }}>
            Replace scattered founder work with one verified path.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7" style={{ color: COLORS.textSecondary }}>
            Webcoin Labs helps serious founders move from cold outreach and scattered tools to verified profiles,
            launch support, advisor discovery, and relevant introduction requests.
          </p>
        </div>

        <div className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-2">
          {PAIN_POINTS.map((point) => (
            <span
              key={point}
              className="rounded-full border px-3.5 py-1.5 text-[12px] font-semibold shadow-[0_12px_30px_-24px_rgba(11,10,18,0.35)]"
              style={{ borderColor: COLORS.border, backgroundColor: "rgba(255,255,255,0.82)", color: COLORS.textSecondary }}
            >
              {point}
            </span>
          ))}
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-5 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="rounded-[28px] border p-7 shadow-[0_24px_70px_-52px_rgba(11,10,18,0.45)]"
            style={{ borderColor: COLORS.border, backgroundColor: "rgba(255,255,255,0.9)" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[12px] font-black uppercase tracking-[0.18em]" style={{ color: COLORS.textMuted }}>
                  The old way
                </h3>
                <p className="mt-2 text-[18px] font-bold tracking-tight" style={{ color: COLORS.text }}>
                  Slow, manual, and hard to measure.
                </p>
              </div>
              <span className="rounded-full px-3 py-1 text-[11px] font-bold" style={{ backgroundColor: "rgba(220,38,38,0.08)", color: COLORS.red }}>
                Friction
              </span>
            </div>
            <ul className="mt-6 grid gap-2.5">
              {OLD_WAY.map((item, index) => (
                <ComparisonRow key={item} index={index}>
                  {item}
                </ComparisonRow>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
            className="relative overflow-hidden rounded-[28px] border p-7 shadow-[0_30px_90px_-54px_rgba(124,58,237,0.65)]"
            style={{
              borderColor: COLORS.borderAccent,
              background: "linear-gradient(155deg, rgba(255,255,255,0.96) 0%, rgba(247,244,255,0.96) 48%, rgba(239,246,255,0.92) 100%)",
            }}
          >
            <div aria-hidden className="absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl" style={{ backgroundColor: "rgba(124,58,237,0.16)" }} />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <h3
                  className="bg-clip-text text-[12px] font-black uppercase tracking-[0.18em] text-transparent"
                  style={{ backgroundImage: GRAD.brand }}
                >
                  The Webcoin Labs way
                </h3>
                <p className="mt-2 text-[18px] font-bold tracking-tight" style={{ color: COLORS.text }}>
                  Verified access with clearer next steps.
                </p>
              </div>
              <span className="whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold" style={{ backgroundImage: GRAD.brand, color: "#fff" }}>
                Verified path
              </span>
            </div>
            <ul className="relative mt-6 grid gap-2.5">
              {WEBCOIN_WAY.map((item, index) => (
                <ComparisonRow key={item} index={index} positive>
                  {item}
                </ComparisonRow>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
