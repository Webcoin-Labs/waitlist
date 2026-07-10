"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { COLORS, EASE } from "@/lib/waitlist/tokens";

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

function ComparisonRow({ children, positive, index, dark = false }: { children: string; positive?: boolean; index: number; dark?: boolean }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay: index * 0.045, ease: EASE }}
      className="grid grid-cols-[24px_minmax(0,1fr)] items-start gap-3 text-[14px] leading-6"
      style={{ color: dark ? COLORS.darkText : positive ? COLORS.text : COLORS.textMuted }}
    >
      <span
        className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: dark ? "rgba(124,58,237,0.22)" : positive ? "rgba(5,150,105,0.12)" : "rgba(220,38,38,0.08)",
          color: dark ? "#c4b5fd" : positive ? COLORS.green : COLORS.red,
        }}
      >
        {positive ? <Check className="size-3.5" strokeWidth={2.7} /> : <X className="size-3.5" strokeWidth={2.7} />}
      </span>
      <span>{children}</span>
    </motion.li>
  );
}

export function BeforeAfter() {
  return (
    <section className="border-t py-12 sm:py-20 lg:py-28" style={{ borderColor: COLORS.border, backgroundColor: "#fff" }}>
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-20">
          <div>
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase" style={{ color: COLORS.accentDeep }}>
              <span className="h-px w-8" style={{ backgroundColor: COLORS.accent }} />
              Founder operating layer
            </p>
            <h2 className="mt-4 max-w-xl text-balance text-[2rem] font-semibold leading-[1.05] tracking-tight sm:mt-5 sm:text-4xl sm:leading-[1.02] md:text-[3.5rem]" style={{ color: COLORS.text }}>
              Replace scattered founder work with one verified path.
            </h2>
          </div>

          <div>
            <p className="max-w-xl text-pretty text-[14px] leading-6 sm:text-[16px] sm:leading-7" style={{ color: COLORS.textSecondary }}>
              Webcoin Labs helps serious founders move from cold outreach and scattered tools to verified profiles, launch support, advisor discovery, and relevant introduction requests.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t pt-4 text-[12px] font-medium" style={{ borderColor: COLORS.border, color: COLORS.textMuted }}>
              {PAIN_POINTS.map((point, index) => (
                <span key={point} className="inline-flex items-center gap-2">
                  <span className="font-semibold tabular-nums" style={{ color: COLORS.accentDeep }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {point}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid overflow-hidden rounded-xl border shadow-sm sm:mt-14 sm:rounded-2xl lg:grid-cols-2" style={{ borderColor: COLORS.border, backgroundColor: COLORS.border }}>
          <motion.div
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="bg-white p-5 sm:p-9"
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-[11px] font-semibold uppercase" style={{ color: COLORS.textMuted }}>
                  01 / The old way
                </p>
                <h3 className="mt-3 text-[21px] font-semibold tracking-tight" style={{ color: COLORS.text }}>
                  Slow, manual, and hard to measure.
                </h3>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 pt-0.5 text-[11px] font-semibold" style={{ color: COLORS.textMuted }}>
                <span className="size-1.5 rounded-full" style={{ backgroundColor: COLORS.red }} />
                Friction
              </span>
            </div>

            <ul className="mt-9 grid gap-4">
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
            className="relative p-5 sm:p-9"
            style={{ backgroundColor: COLORS.text }}
          >
            <span aria-hidden className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: COLORS.accent }} />
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-[11px] font-semibold uppercase" style={{ color: "#c4b5fd" }}>
                  02 / The Webcoin Labs way
                </p>
                <h3 className="mt-3 text-[21px] font-semibold tracking-tight" style={{ color: COLORS.darkText }}>
                  Verified access with clearer next steps.
                </h3>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 pt-0.5 text-[11px] font-semibold" style={{ color: "#c4b5fd" }}>
                <span className="size-1.5 rounded-full" style={{ backgroundColor: COLORS.accent }} />
                Verified path
              </span>
            </div>

            <ul className="mt-9 grid gap-4">
              {WEBCOIN_WAY.map((item, index) => (
                <ComparisonRow key={item} index={index} positive dark>
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
