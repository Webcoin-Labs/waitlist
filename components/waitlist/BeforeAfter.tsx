"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { COLORS, EASE, GRAD } from "@/lib/waitlist/tokens";

const OLD_WAY = [
  "Cold outreach and long wait times",
  "Noisy referrals and low reply rates",
  "No clear visibility or feedback",
  "Disconnected tools and spreadsheets",
  "Hard to track progress or rank",
];

const WEBCOIN_WAY = [
  "Verified access and early eligibility",
  "Founder tools that save hours",
  "Builder access and advisor discovery",
  "Pitch deck and tokenomics review",
  "Investor introduction requests",
  "WebXP rewards and Founder Pass eligibility",
  "Structured dashboard",
];

const PAIN_POINTS = [
  "Capital Gaps",
  "Builder Discovery",
  "Pitch to Product",
  "Growth Deficit",
  "Closed Networks",
  "Founder Overload",
];

function ComparisonRow({ children, positive, index }: { children: string; positive?: boolean; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay: index * 0.045, ease: EASE }}
      className="flex items-center gap-3 text-[14.5px] leading-6"
      style={{ color: positive ? COLORS.text : COLORS.textMuted }}
    >
      <span
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: positive ? "rgba(5,150,105,0.12)" : "rgba(220,38,38,0.1)",
          color: positive ? COLORS.green : COLORS.red,
        }}
      >
        {positive ? <Check className="h-3 w-3" strokeWidth={2.5} /> : <X className="h-3 w-3" strokeWidth={2.5} />}
      </span>
      <span>{children}</span>
    </motion.li>
  );
}

export function BeforeAfter() {
  return (
    <section className="border-t py-24" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgAlt }}>
      <div className="container mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold leading-[1.05] tracking-tight md:text-[2.8rem]" style={{ color: COLORS.text }}>
            From weeks of waiting to intros in minutes.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-7" style={{ color: COLORS.textSecondary }}>
            Founders can spend 30+ days chasing the right investor conversation. Webcoin Labs helps verified founders
            request relevant introductions in minutes.
          </p>
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
          {PAIN_POINTS.map((point) => (
            <span key={point} className="rounded-full border px-3 py-1.5 text-[12px] font-semibold" style={{ borderColor: COLORS.border, backgroundColor: "#fff", color: COLORS.textSecondary }}>
              {point}
            </span>
          ))}
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-5 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: EASE }}
            className="rounded-3xl border p-7"
            style={{ borderColor: COLORS.border, backgroundColor: "#fff" }}
          >
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ color: COLORS.textMuted }}>
              The old way
            </h3>
            <ul className="mt-6 grid gap-3">
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
            className="rounded-3xl border p-7"
            style={{
              borderColor: COLORS.borderAccent,
              background: "linear-gradient(160deg, rgba(124,58,237,0.05), rgba(37,99,235,0.03))",
            }}
          >
            <h3
              className="bg-clip-text text-[13px] font-semibold uppercase tracking-[0.14em] text-transparent"
              style={{ backgroundImage: GRAD.brand }}
            >
              The Webcoin Labs way
            </h3>
            <ul className="mt-6 grid gap-3">
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
