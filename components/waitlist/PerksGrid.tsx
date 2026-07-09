"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  BarChart3,
  Handshake,
  IdCard,
  Rocket,
  ScanSearch,
  UserSearch,
  Users,
  type LucideIcon,
} from "lucide-react";
import { COLORS, EASE, GRAD } from "@/lib/waitlist/tokens";

type Signal = "chips" | "avatars" | "meter" | "tokenomics" | "progress" | "availability" | "pending" | "network";

const PERKS: {
  icon: LucideIcon;
  title: string;
  body: string;
  signal: Signal;
  accent: string;
  soft: string;
}[] = [
  {
    icon: Rocket,
    title: "Founder Sprint",
    body: "Daily task, milestone tracking, and progress insights.",
    signal: "chips",
    accent: "#7c3aed",
    soft: "#f1ecff",
  },
  {
    icon: BadgeCheck,
    title: "Builder Proof",
    body: "Onboard verified builders and showcase real traction.",
    signal: "avatars",
    accent: "#0e7490",
    soft: "#e9f8fb",
  },
  {
    icon: ScanSearch,
    title: "Pitch Deck Review",
    body: "AI + expert feedback to strengthen your story.",
    signal: "meter",
    accent: "#059669",
    soft: "#ecfdf3",
  },
  {
    icon: BarChart3,
    title: "Tokenomics Support",
    body: "Get expert feedback on your token design.",
    signal: "tokenomics",
    accent: "#c2410c",
    soft: "#fff3eb",
  },
  {
    icon: Handshake,
    title: "Investor Intros",
    body: "Request warm investor introductions and access a curated 1000+ venture capital directory for research and outreach.",
    signal: "progress",
    accent: "#db2777",
    soft: "#fdf2f8",
  },
  {
    icon: UserSearch,
    title: "Advisor Discovery",
    body: "Find domain experts and operators who care.",
    signal: "availability",
    accent: "#0891b2",
    soft: "#ecfeff",
  },
  {
    icon: IdCard,
    title: "Builder Pass Access",
    body: "Arc and Base builders can become eligible for proof-based Builder Pass access.",
    signal: "pending",
    accent: "#7c3aed",
    soft: "#f1ecff",
  },
  {
    icon: Users,
    title: "Influencer Directory",
    body: "Access a curated 5000+ influencer and KOL directory for launch, marketing, and ecosystem distribution.",
    signal: "network",
    accent: "#4f46e5",
    soft: "#eef2ff",
  },
];

export function PerksGrid() {
  const [active, setActive] = useState(0);

  return (
    <section id="perks" className="border-y py-14 lg:py-20" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgAlt }}>
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid gap-9 lg:grid-cols-[230px_1fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{ borderColor: COLORS.border, backgroundColor: "#fff", color: COLORS.accentDeep }}
            >
              <motion.span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: COLORS.accentDeep }}
                animate={{ scale: [1, 1.55, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
              What you unlock
            </span>
            <h2 className="mt-5 text-[2rem] font-bold leading-[1.08] tracking-tight md:text-[2.35rem]" style={{ color: COLORS.text }}>
              Everything you need to build and scale.
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {PERKS.map((perk, index) => (
              <UnlockCard
                key={perk.title}
                perk={perk}
                index={index}
                active={active === index}
                onClick={() => setActive(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function UnlockCard({
  perk,
  index,
  active,
  onClick,
}: {
  perk: (typeof PERKS)[number];
  index: number;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = perk.icon;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.46, delay: (index % 8) * 0.045, ease: EASE }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.985 }}
      className="group relative min-h-[150px] overflow-hidden rounded-2xl border p-4 text-left"
      style={{
        borderColor: active ? `${perk.accent}55` : COLORS.border,
        backgroundColor: "#fff",
        boxShadow: active ? `0 22px 55px -34px ${perk.accent}` : "0 16px 42px -34px rgba(11,10,18,0.18)",
      }}
    >
      <motion.span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${perk.accent}, transparent)` }}
        initial={{ opacity: 0.25 }}
        animate={{ opacity: active ? 1 : 0.35 }}
      />
      <motion.span
        aria-hidden
        className="absolute -right-14 -top-14 h-28 w-28 rounded-full blur-2xl"
        style={{ backgroundColor: perk.soft }}
        animate={{ scale: active ? 1.18 : 0.9, opacity: active ? 0.95 : 0.45 }}
        transition={{ duration: 0.45, ease: EASE }}
      />

      <div className="relative flex items-start gap-3">
        <motion.span
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: perk.soft, color: perk.accent }}
          animate={active ? { rotate: [0, -5, 5, 0], scale: [1, 1.05, 1] } : { rotate: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <Icon className="h-4.5 w-4.5" />
        </motion.span>
        <div className="min-w-0">
          <p className="text-[13.5px] font-bold leading-5" style={{ color: COLORS.text }}>
            {perk.title}
          </p>
          <p className="mt-1.5 text-[11.5px] leading-4" style={{ color: COLORS.textSecondary }}>
            {perk.body}
          </p>
        </div>
      </div>

      <div className="relative mt-4">
        <SignalPreview type={perk.signal} accent={perk.accent} active={active} />
      </div>
    </motion.button>
  );
}

function SignalPreview({ type, accent, active }: { type: Signal; accent: string; active: boolean }) {
  if (type === "chips") {
    return (
      <div className="flex flex-wrap gap-1.5">
        {["task", "milestone", "progress"].map((chip, i) => (
          <motion.span
            key={chip}
            className="rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em]"
            style={{ borderColor: COLORS.border, backgroundColor: COLORS.surfaceMuted, color: i === 1 ? accent : COLORS.textMuted }}
            animate={{ y: active ? [0, -2, 0] : 0 }}
            transition={{ duration: 0.45, delay: i * 0.05, ease: EASE }}
          >
            {chip}
          </motion.span>
        ))}
      </div>
    );
  }

  if (type === "avatars" || type === "network" || type === "progress") {
    const faces = type === "progress" ? ["N", "A", "R", "K"] : ["S", "M", "J", "A", "P", "D"];
    return (
      <div className="flex items-center gap-2">
        <div className="flex -space-x-1.5">
          {faces.map((face, i) => (
            <motion.span
              key={`${face}-${i}`}
              className="inline-flex h-5 w-5 items-center justify-center rounded-full border text-[8px] font-bold"
              style={{
                borderColor: "#fff",
                background: ["#ede9fe", "#cffafe", "#dcfce7", "#fce7f3", "#ffedd5", "#e0e7ff"][i],
                color: COLORS.textSecondary,
              }}
              animate={{ x: active ? [0, -1, 0] : 0 }}
              transition={{ duration: 0.35, delay: i * 0.04, ease: EASE }}
            >
              {face}
            </motion.span>
          ))}
        </div>
        <span className="text-[10px] font-bold" style={{ color: accent }}>
          {type === "progress" ? "4 in progress" : type === "network" ? "+24" : "+4"}
        </span>
      </div>
    );
  }

  if (type === "meter") {
    return (
      <div className="flex items-center gap-2">
        <span className="relative h-8 w-12 overflow-hidden">
          <svg viewBox="0 0 56 34" className="h-8 w-12" aria-hidden>
            <path d="M8 28a20 20 0 0 1 40 0" fill="none" stroke="#e5e7eb" strokeWidth="5" strokeLinecap="round" />
            <motion.path
              d="M8 28a20 20 0 0 1 40 0"
              fill="none"
              stroke={accent}
              strokeWidth="5"
              strokeLinecap="round"
              initial={{ pathLength: 0.18 }}
              animate={{ pathLength: active ? 0.73 : 0.58 }}
              transition={{ duration: 0.65, ease: EASE }}
            />
          </svg>
        </span>
        <span className="text-[10px] font-bold" style={{ color: accent }}>
          73 <span style={{ color: COLORS.textMuted }}>/100</span>
        </span>
      </div>
    );
  }

  if (type === "tokenomics") {
    return (
      <div className="flex items-center gap-2">
        {["Model", "Vesting"].map((chip) => (
          <span key={chip} className="rounded-full px-2 py-1 text-[9px] font-bold" style={{ backgroundColor: COLORS.surfaceMuted, color: COLORS.textMuted }}>
            {chip}
          </span>
        ))}
        <motion.span
          className="ml-auto h-6 w-6 rounded-full"
          style={{
            background: `conic-gradient(${accent} 0 68%, #ede9fe 68% 100%)`,
            boxShadow: active ? `0 0 18px ${accent}44` : "none",
          }}
          animate={{ rotate: active ? 360 : 0 }}
          transition={{ duration: 1.1, ease: EASE }}
        />
      </div>
    );
  }

  if (type === "availability") {
    return (
      <div className="flex items-center gap-2">
        <span className="rounded-full px-2 py-1 text-[10px] font-bold" style={{ backgroundColor: `${accent}14`, color: accent }}>
          11 available
        </span>
        <span className="rounded-full px-2 py-1 text-[10px] font-semibold" style={{ backgroundColor: COLORS.surfaceMuted, color: COLORS.textMuted }}>
          domain experts
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <motion.span
        className="rounded-full px-2.5 py-1 text-[10px] font-bold"
        style={{ backgroundColor: `${accent}14`, color: accent }}
        animate={{ opacity: active ? [0.65, 1, 0.65] : 1 }}
        transition={{ duration: 1.4, repeat: active ? Infinity : 0, ease: "easeInOut" }}
      >
        Beta
      </motion.span>
      <BadgeCheck className="h-3.5 w-3.5" style={{ color: accent }} />
    </div>
  );
}
