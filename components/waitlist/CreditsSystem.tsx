"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Gift, Info, LayoutDashboard, Lock, MailCheck, Share2 } from "lucide-react";
import { COLORS, EASE } from "@/lib/waitlist/tokens";

type WindowKey = "launch" | "after";
type RewardKey = "join" | "referral";

const WINDOWS: Record<
  WindowKey,
  {
    label: string;
    eyebrow: string;
    badge: string;
    join: string;
    referral: string;
    signal: string;
  }
> = {
  launch: {
    label: "First 7 days",
    eyebrow: "Launch window",
    badge: "Launch boost",
    join: "+100 Credits",
    referral: "+20 Credits",
    signal: "Highest signal",
  },
  after: {
    label: "After 7 days",
    eyebrow: "Standard window",
    badge: "Still active",
    join: "+50 Credits",
    referral: "+10 Credits",
    signal: "Ongoing signal",
  },
};

const REWARD_COPY: Record<RewardKey, { label: string; body: string; icon: typeof Gift }> = {
  join: {
    label: "Verified join reward",
    body: "Email verification activates Credits, waitlist position, and the first dashboard signal.",
    icon: Gift,
  },
  referral: {
    label: "Verified referral reward",
    body: "Referral XP unlocks only after the invited person verifies, keeping rank movement proof-based.",
    icon: Share2,
  },
};

const STEPS = [
  { label: "Email verified", icon: MailCheck, state: "done" as const },
  { label: "Rank signal", icon: BarChart3, state: "active" as const },
  { label: "Dashboard access", icon: LayoutDashboard, state: "locked" as const },
];

export function CreditsSystem() {
  const [activeWindow, setActiveWindow] = useState<WindowKey>("launch");
  const [activeReward, setActiveReward] = useState<RewardKey>("join");
  const window = WINDOWS[activeWindow];
  const reward = REWARD_COPY[activeReward];
  const RewardIcon = reward.icon;

  return (
    <section id="why-join" className="relative overflow-hidden py-12 sm:py-16 lg:py-24" style={{ backgroundColor: COLORS.bgAlt }}>
      <div className="container relative mx-auto max-w-6xl px-6">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase text-[#6d28d9]">
              <span className="h-px w-8 bg-[#6d28d9]" />
              Credits System
            </div>

            <h2 className="mt-4 max-w-[560px] text-balance text-[2rem] font-semibold leading-[1.05] tracking-tight sm:mt-6 sm:text-4xl sm:leading-[1.02] md:text-[3.35rem]" style={{ color: COLORS.text }}>
              Unlock <span style={{ color: COLORS.accent }}>Credits</span> during the launch window.
            </h2>

            <p className="mt-4 max-w-lg text-pretty text-[14px] leading-6 sm:mt-6 sm:text-[16px] sm:leading-7" style={{ color: COLORS.textSecondary }}>
              Credits are a promotional early-access points system. They set your launch priority, referral rank, and dashboard perks once Webcoin Labs opens up.
            </p>

            <div className="mt-5 flex max-w-lg items-start gap-3 border-l-2 pl-3 text-[12px] leading-5 sm:mt-8 sm:pl-4 sm:text-[13px] sm:leading-6" style={{ borderColor: COLORS.accent, color: COLORS.textMuted }}>
              <Info className="mt-1 size-4 shrink-0" style={{ color: COLORS.accentDeep }} />
              <p className="text-pretty">
                <span className="font-semibold" style={{ color: COLORS.text }}>
                  Important:
                </span>{" "}
                Credits have no monetary value, no token value, no airdrop value, and represent no ownership, investment, or financial rights.
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative overflow-hidden rounded-[18px] border p-4 shadow-lg sm:rounded-[20px] sm:p-7"
            style={{ backgroundColor: COLORS.darkBg, borderColor: COLORS.darkBorderStrong }}
          >
            <div aria-hidden className="absolute inset-x-0 top-0 h-0.5" style={{ backgroundColor: COLORS.accent }} />

            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase text-[#a78bfa]">Launch Credits</p>
                <h3 className="mt-2 text-balance text-[22px] font-semibold tracking-tight" style={{ color: COLORS.darkText }}>
                  Reward engine preview.
                </h3>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase" style={{ borderColor: COLORS.darkBorderStrong, color: COLORS.darkTextSecondary }}>
                <span className="size-1.5 rounded-full" style={{ backgroundColor: COLORS.accent }} />
                {window.signal}
              </span>
            </div>

            <div className="relative mt-7 grid grid-cols-2 border-y" style={{ borderColor: COLORS.darkBorder }}>
              {(Object.keys(WINDOWS) as WindowKey[]).map((key) => {
                const selected = activeWindow === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setActiveWindow(key);
                      setActiveReward("join");
                    }}
                    aria-pressed={selected}
                    className="relative px-3 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a78bfa] focus-visible:ring-inset sm:px-4"
                    style={{ color: selected ? COLORS.darkText : COLORS.darkTextMuted }}
                  >
                    {selected ? <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5" style={{ backgroundColor: COLORS.accent }} /> : null}
                    <span className="block text-[10px] font-semibold uppercase">{WINDOWS[key].eyebrow}</span>
                    <span className="mt-1 block text-[14px] font-semibold">{WINDOWS[key].label}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative mt-6 rounded-xl border p-4 sm:p-5" style={{ borderColor: COLORS.darkBorder, backgroundColor: COLORS.darkSurface }}>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[11px] font-semibold uppercase" style={{ color: COLORS.darkTextMuted }}>
                  {window.label}
                </span>
                <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold" style={{ backgroundColor: "rgba(124,58,237,0.18)", color: "#c4b5fd" }}>
                  {window.badge}
                </span>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 sm:gap-3">
                <RewardButton active={activeReward === "join"} icon={Gift} amount={window.join} label="for joining" onClick={() => setActiveReward("join")} />
                <RewardButton active={activeReward === "referral"} icon={Share2} amount={window.referral} label="per verified referral" onClick={() => setActiveReward("referral")} />
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
                {STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const done = step.state === "done";
                  const active = step.state === "active";
                  const tone = done || active ? "#c4b5fd" : COLORS.darkTextMuted;
                  return (
                    <div key={step.label} className="relative text-center">
                      {i < STEPS.length - 1 ? <span aria-hidden className="absolute left-[calc(50%+20px)] right-[calc(-50%+20px)] top-4 h-px" style={{ backgroundColor: COLORS.darkBorder }} /> : null}
                      <span className="relative mx-auto flex size-8 items-center justify-center rounded-full border" style={{ borderColor: active ? "#a78bfa" : done ? "rgba(167,139,250,0.5)" : COLORS.darkBorderStrong, backgroundColor: active || done ? "rgba(124,58,237,0.16)" : COLORS.darkBg }}>
                        {step.state === "locked" ? <Lock className="size-3.5" style={{ color: tone }} /> : <Icon className="size-3.5" style={{ color: tone }} />}
                      </span>
                      <span className="mx-auto mt-2 block max-w-[88px] text-[10px] font-semibold leading-tight" style={{ color: tone }}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeWindow}-${activeReward}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="relative mt-3 overflow-hidden rounded-xl border p-4 sm:mt-4 sm:p-5"
                style={{ borderColor: COLORS.darkBorder, backgroundColor: COLORS.darkSurface }}
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(124,58,237,0.16)", color: "#c4b5fd" }}>
                    <RewardIcon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold" style={{ color: COLORS.darkText }}>
                      {reward.label}
                    </p>
                    <p className="mt-1 max-w-md text-pretty text-[12px] leading-5" style={{ color: COLORS.darkTextSecondary }}>
                      {reward.body}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <p className="relative mt-4 text-pretty text-[11px] leading-5" style={{ color: COLORS.darkTextMuted }}>
              Only verified emails count. Referrals count after the referred person verifies their email.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function RewardButton({
  active,
  icon: Icon,
  amount,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof Gift;
  amount: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="relative rounded-lg border px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a78bfa] sm:px-4"
      style={{ borderColor: active ? "#8b5cf6" : COLORS.darkBorder, backgroundColor: active ? "rgba(124,58,237,0.14)" : COLORS.darkBg, color: COLORS.darkText }}
    >
      {active ? <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 rounded-l-lg" style={{ backgroundColor: COLORS.accent }} /> : null}
      <span className="flex items-center gap-2.5">
        <Icon className="size-4" style={{ color: active ? "#c4b5fd" : COLORS.darkTextSecondary }} />
        <span className="font-semibold tabular-nums">{amount}</span>
      </span>
      <span className="mt-1 block text-[11px]" style={{ color: COLORS.darkTextSecondary }}>
        {label}
      </span>
    </button>
  );
}
