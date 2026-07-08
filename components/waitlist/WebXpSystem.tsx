"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Flame, Gift, Info, LayoutDashboard, Lock, MailCheck, Share2 } from "lucide-react";
import { COLORS, EASE, GRAD } from "@/lib/waitlist/tokens";

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
    join: "+100 WebXP",
    referral: "+20 WebXP",
    signal: "Highest signal",
  },
  after: {
    label: "After 7 days",
    eyebrow: "Standard window",
    badge: "Still active",
    join: "+50 WebXP",
    referral: "+10 WebXP",
    signal: "Ongoing signal",
  },
};

const REWARD_COPY: Record<RewardKey, { label: string; body: string; icon: typeof Gift }> = {
  join: {
    label: "Verified join reward",
    body: "Email verification activates WebXP, waitlist position, and the first dashboard signal.",
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

export function WebXpSystem() {
  const [activeWindow, setActiveWindow] = useState<WindowKey>("launch");
  const [activeReward, setActiveReward] = useState<RewardKey>("join");
  const window = WINDOWS[activeWindow];
  const reward = REWARD_COPY[activeReward];
  const RewardIcon = reward.icon;

  return (
    <section id="why-join" className="relative overflow-hidden py-24" style={{ backgroundColor: COLORS.bg }}>
      <div className="container relative mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{ borderColor: COLORS.border, color: COLORS.accentDeep, backgroundColor: "#fff" }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: COLORS.accentDeep }} />
              WebXP System
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight md:text-[2.7rem] md:leading-[1.05]" style={{ color: COLORS.text }}>
              Unlock{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: GRAD.brandWarm }}>
                WebXP
              </span>{" "}
              during the launch window.
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-7" style={{ color: COLORS.textSecondary }}>
              WebXP is a promotional early-access points system. It sets your launch priority, referral rank, and
              dashboard perks once Webcoin Labs opens up.
            </p>

            <div
              className="mt-6 flex items-start gap-3 rounded-xl border p-4 text-[12.5px] leading-6"
              style={{ borderColor: COLORS.border, backgroundColor: "#fff", color: COLORS.textMuted }}
            >
              <Info className="mt-0.5 h-4 w-4 shrink-0" style={{ color: COLORS.textSecondary }} />
              <p>
                <span style={{ color: COLORS.text }} className="font-semibold">
                  Important:
                </span>{" "}
                WebXP has no monetary value, no token value, no airdrop value, and represents no ownership,
                investment, or financial rights.
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: EASE }}
            className="relative overflow-hidden rounded-3xl p-6 md:p-7"
            style={{
              backgroundColor: "#0a0a12",
              boxShadow: "0 34px 90px -38px rgba(17,24,39,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full blur-3xl" style={{ backgroundColor: "rgba(124,58,237,0.22)" }} />
            <div aria-hidden className="absolute inset-x-6 top-0 h-px" style={{ backgroundImage: GRAD.brandWarm }} />

            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: COLORS.accent }}>
                  Launch WebXP
                </p>
                <h3 className="mt-2 text-xl font-bold md:text-2xl" style={{ color: COLORS.darkText }}>
                  Reward engine preview.
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ borderColor: "rgba(251,146,60,0.3)", color: "#fdba74", backgroundColor: "rgba(251,146,60,0.08)" }}>
                <Flame className="h-3 w-3" />
                {window.signal}
              </span>
            </div>

            <div className="relative mt-6 grid grid-cols-2 gap-2 rounded-2xl border p-1.5" style={{ borderColor: COLORS.darkBorder, backgroundColor: "rgba(255,255,255,0.03)" }}>
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
                    className="relative overflow-hidden rounded-xl px-4 py-3 text-left transition-transform hover:-translate-y-0.5"
                    style={{ color: selected ? COLORS.darkText : COLORS.darkTextMuted }}
                  >
                    {selected ? (
                      <motion.span
                        layoutId="webxp-window-bg"
                        className="absolute inset-0 rounded-xl border"
                        style={{ backgroundColor: "rgba(124,58,237,0.16)", borderColor: "rgba(167,139,250,0.32)" }}
                        transition={{ duration: 0.32, ease: EASE }}
                      />
                    ) : null}
                    <span className="relative block text-[10px] font-bold uppercase tracking-[0.16em]">{WINDOWS[key].eyebrow}</span>
                    <span className="relative mt-1 block text-[14px] font-bold">{WINDOWS[key].label}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative mt-6 rounded-2xl border p-4" style={{ borderColor: COLORS.darkBorder, backgroundColor: "rgba(255,255,255,0.03)" }}>
              <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.14em]" style={{ color: COLORS.darkTextMuted }}>
                <span>{window.label}</span>
                <span className="rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ backgroundImage: GRAD.brandWarm, color: "#0a0a10" }}>
                  {window.badge}
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <RewardButton
                  active={activeReward === "join"}
                  icon={Gift}
                  amount={window.join}
                  label="for joining"
                  onClick={() => setActiveReward("join")}
                />
                <RewardButton
                  active={activeReward === "referral"}
                  icon={Share2}
                  amount={window.referral}
                  label="per verified referral"
                  onClick={() => setActiveReward("referral")}
                />
              </div>

              <div className="mt-6 flex items-start">
                {STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const done = step.state === "done";
                  const active = step.state === "active";
                  const tone = done ? "#34d399" : active ? "#a78bfa" : COLORS.darkTextMuted;
                  return (
                    <div key={step.label} className="flex flex-1 items-start">
                      <div className="flex flex-col items-center">
                        <span
                          className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border"
                          style={{
                            borderColor: done ? "rgba(52,211,153,0.5)" : active ? "rgba(167,139,250,0.5)" : COLORS.darkBorder,
                            backgroundColor: done ? "rgba(52,211,153,0.14)" : active ? "rgba(167,139,250,0.14)" : "rgba(255,255,255,0.03)",
                          }}
                        >
                          {active ? (
                            <motion.span
                              className="absolute inset-0 rounded-full"
                              style={{ boxShadow: "0 0 0 2px rgba(167,139,250,0.35)" }}
                              animate={{ scale: [1, 1.35, 1], opacity: [0.7, 0, 0.7] }}
                              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                            />
                          ) : null}
                          {step.state === "locked" ? <Lock className="h-3.5 w-3.5" style={{ color: tone }} /> : <Icon className="h-3.5 w-3.5" style={{ color: tone }} />}
                        </span>
                        <span className="mt-2 max-w-[76px] text-center text-[9.5px] font-semibold leading-tight" style={{ color: tone }}>
                          {step.label}
                        </span>
                      </div>
                      {i < STEPS.length - 1 ? (
                        <div className="mt-4 h-px flex-1" style={{ backgroundColor: done ? "rgba(52,211,153,0.4)" : COLORS.darkBorder }} />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeWindow}-${activeReward}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.24, ease: EASE }}
                className="relative mt-4 overflow-hidden rounded-2xl border pl-4"
                style={{ borderColor: COLORS.darkBorder, backgroundColor: "rgba(255,255,255,0.03)" }}
              >
                <span className="absolute inset-y-0 left-0 w-1" style={{ backgroundImage: GRAD.brandWarm }} />
                <div className="grid gap-4 p-4 pl-3 sm:grid-cols-[1fr_auto]">
                  <div className="flex gap-3">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ color: "#c4b5fd", backgroundColor: "rgba(124,58,237,0.16)" }}>
                      <RewardIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[14px] font-bold" style={{ color: COLORS.darkText }}>
                        {reward.label}
                      </p>
                      <p className="mt-1 max-w-md text-[12.5px] leading-5" style={{ color: COLORS.darkTextSecondary }}>
                        {reward.body}
                      </p>
                    </div>
                  </div>
                  <div className="grid content-center gap-1.5 text-[11.5px] font-semibold" style={{ color: COLORS.darkTextSecondary }}>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#34d399" }} />
                      Verified only
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#a78bfa" }} />
                      Ledger-safe
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <p className="relative mt-5 text-[12px]" style={{ color: COLORS.darkTextMuted }}>
              Only verified emails count. Referrals count only after the referred person verifies their email.
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
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden rounded-xl border px-4 py-3 text-left transition-transform hover:-translate-y-0.5"
      style={{
        borderColor: active ? "rgba(167,139,250,0.44)" : COLORS.darkBorder,
        backgroundColor: active ? "rgba(124,58,237,0.14)" : COLORS.darkSurface,
        color: COLORS.darkText,
      }}
    >
      {active ? <motion.span layoutId="webxp-reward-edge" className="absolute inset-y-0 left-0 w-1" style={{ backgroundImage: GRAD.brandWarm }} /> : null}
      <span className="flex items-center gap-2.5">
        <Icon className="h-4 w-4" style={{ color: active ? "#c4b5fd" : COLORS.accent }} />
        <span className="font-bold">{amount}</span>
      </span>
      <span className="mt-1 block text-[12px] font-semibold" style={{ color: COLORS.darkTextSecondary }}>
        {label}
      </span>
    </motion.button>
  );
}
