"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Info, Sparkles, Users } from "lucide-react";
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
    rail: string;
  }
> = {
  launch: {
    label: "First 7 days",
    eyebrow: "Launch window",
    badge: "Launch boost",
    join: "+100 WebXP",
    referral: "+20 WebXP",
    signal: "Highest early-access signal",
    rail: "72%",
  },
  after: {
    label: "After 7 days",
    eyebrow: "Standard window",
    badge: "Still active",
    join: "+50 WebXP",
    referral: "+10 WebXP",
    signal: "Ongoing waitlist signal",
    rail: "44%",
  },
};

const REWARD_COPY: Record<RewardKey, { label: string; body: string; icon: typeof Sparkles }> = {
  join: {
    label: "Verified join reward",
    body: "Email verification activates WebXP, waitlist position, and the first dashboard signal.",
    icon: Sparkles,
  },
  referral: {
    label: "Verified referral reward",
    body: "Referral XP unlocks only after the invited person verifies, keeping rank movement proof-based.",
    icon: Users,
  },
};

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
              background: "linear-gradient(145deg, #0b1024 0%, #171128 54%, #090910 100%)",
              boxShadow: "0 34px 90px -38px rgba(17,24,39,0.7), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
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
              <span className="rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ borderColor: COLORS.darkBorder, color: "#c4b5fd", backgroundColor: "rgba(124,58,237,0.14)" }}>
                {window.signal}
              </span>
            </div>

            <div className="relative mt-6 grid grid-cols-2 gap-2 rounded-2xl border p-1.5" style={{ borderColor: COLORS.darkBorder, backgroundColor: "rgba(255,255,255,0.035)" }}>
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
                        className="absolute inset-0 rounded-xl"
                        style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.32), rgba(219,39,119,0.18))" }}
                        transition={{ duration: 0.32, ease: EASE }}
                      />
                    ) : null}
                    <span className="relative block text-[10px] font-bold uppercase tracking-[0.16em]">{WINDOWS[key].eyebrow}</span>
                    <span className="relative mt-1 block text-[14px] font-bold">{WINDOWS[key].label}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative mt-6 rounded-2xl border p-4" style={{ borderColor: COLORS.darkBorder, backgroundColor: "rgba(255,255,255,0.035)" }}>
              <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.14em]" style={{ color: COLORS.darkTextMuted }}>
                <span>{window.label}</span>
                <span className="rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ backgroundImage: GRAD.brandWarm, color: "#0a0a10" }}>
                  {window.badge}
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <RewardButton
                  active={activeReward === "join"}
                  icon={Sparkles}
                  amount={window.join}
                  label="for joining"
                  onClick={() => setActiveReward("join")}
                />
                <RewardButton
                  active={activeReward === "referral"}
                  icon={Users}
                  amount={window.referral}
                  label="per verified referral"
                  onClick={() => setActiveReward("referral")}
                />
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: COLORS.darkTextMuted }}>
                  <span>Email verified</span>
                  <span>Rank signal</span>
                  <span>Dashboard access</span>
                </div>
                <div className="relative mt-3 h-2 overflow-hidden rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                  <motion.span
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: "linear-gradient(90deg, #34d399, #8b5cf6, #db2777)" }}
                    animate={{ width: window.rail }}
                    transition={{ duration: 0.55, ease: EASE }}
                  />
                  <motion.span
                    className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full"
                    style={{ backgroundColor: "#fff", boxShadow: "0 0 24px rgba(167,139,250,0.95)" }}
                    animate={{ left: window.rail }}
                    transition={{ duration: 0.55, ease: EASE }}
                  />
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeWindow}-${activeReward}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.24, ease: EASE }}
                className="relative mt-4 grid gap-4 rounded-2xl border p-4 sm:grid-cols-[1fr_auto]"
                style={{ borderColor: "rgba(167,139,250,0.2)", backgroundColor: "rgba(124,58,237,0.08)" }}
              >
                <div className="flex gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ color: "#c4b5fd", backgroundColor: "rgba(124,58,237,0.18)" }}>
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
                <div className="grid content-center gap-1 text-[12px]" style={{ color: COLORS.darkTextSecondary }}>
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" style={{ color: "#34d399" }} />
                    Verified only
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" style={{ color: "#c4b5fd" }} />
                    Ledger-safe
                  </span>
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
  icon: typeof Sparkles;
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
