"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Hammer, Loader2, Rocket, TrendingUp, Users } from "lucide-react";
import { joinWaitlist } from "@/app/actions/waitlist";
import { COLORS, EASE, GRAD } from "@/lib/waitlist/tokens";

type Role = "FOUNDER" | "BUILDER" | "INVESTOR" | "ADVISOR";

const ROLES: Array<{ value: Role; label: string; icon: typeof Rocket }> = [
  { value: "FOUNDER", label: "Founder", icon: Rocket },
  { value: "BUILDER", label: "Builder", icon: Hammer },
  { value: "INVESTOR", label: "Investor", icon: TrendingUp },
  { value: "ADVISOR", label: "Advisor", icon: Users },
];

function MiniKpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl px-2 py-2" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
      <p className="text-[13px] font-bold text-white">{value}</p>
      <p className="mt-0.5 text-[9px] leading-tight" style={{ color: "rgba(245,245,247,0.5)" }}>
        {label}
      </p>
    </div>
  );
}

function FounderPassPreview() {
  return (
    <div className="grid gap-2">
      <div className="overflow-hidden rounded-2xl p-4" style={{ background: GRAD.darkIsland, border: "1px solid rgba(167,139,250,0.35)" }}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: "#a78bfa" }}>
            Founder Pass
          </span>
          <span className="rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ backgroundColor: "rgba(167,139,250,0.18)", color: "#c4b5fd" }}>
            Eligible soon
          </span>
        </div>
        <p className="mt-2 text-[15px] font-bold text-white">Your builder credential.</p>
        <div className="mt-3 flex items-center gap-3">
          <img src="/logo/Arc_Logo_White.svg" alt="Arc" className="h-4 w-auto object-contain opacity-80" />
          <img src="/logo/Base_lockup_white.svg" alt="Base" className="h-4 w-auto object-contain opacity-80" />
        </div>
      </div>
      <p className="text-center text-[12px]" style={{ color: COLORS.textMuted }}>
        Building too?{" "}
        <span className="font-semibold" style={{ color: COLORS.accentDeep }}>
          You can also claim a Builder Pass.
        </span>
      </p>
    </div>
  );
}

function BuilderPassPreview() {
  return (
    <div className="grid gap-2">
      <div className="overflow-hidden rounded-2xl p-4" style={{ background: GRAD.darkIsland, border: "1px solid rgba(56,189,248,0.35)" }}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: "#38bdf8" }}>
            Builder Pass
          </span>
          <span className="rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ backgroundColor: "rgba(56,189,248,0.18)", color: "#bae6fd" }}>
            Eligible soon
          </span>
        </div>
        <p className="mt-2 text-[15px] font-bold text-white">Your proof-of-work credential.</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold" style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(245,245,247,0.75)" }}>
            GitHub
          </span>
          <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold" style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(245,245,247,0.75)" }}>
            Portfolio
          </span>
        </div>
      </div>
      <p className="text-center text-[12px]" style={{ color: COLORS.textMuted }}>
        Founding too?{" "}
        <span className="font-semibold" style={{ color: COLORS.accentDeep }}>
          You can also claim a Founder Pass.
        </span>
      </p>
    </div>
  );
}

function InvestorPreview() {
  return (
    <div className="overflow-hidden rounded-2xl p-4" style={{ backgroundColor: "#0b0a12", border: "1px solid rgba(52,211,153,0.28)" }}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: "#34d399" }}>
          Investor access
        </span>
        <TrendingUp className="h-3.5 w-3.5" style={{ color: "#34d399" }} />
      </div>
      <p className="mt-2 text-[15px] font-bold text-white">Curated deal flow, verified.</p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <MiniKpi label="Verified founders" value="1,250+" />
        <MiniKpi label="Avg proof score" value="82" />
        <MiniKpi label="Countries" value="33+" />
      </div>
      <svg className="mt-3 h-8 w-full" viewBox="0 0 150 32" fill="none" aria-hidden>
        <path d="M2 26 L26 20 L48 23 L70 12 L92 16 L114 6 L132 10 L148 3" stroke="rgba(52,211,153,0.25)" strokeWidth="6" />
        <path d="M2 26 L26 20 L48 23 L70 12 L92 16 L114 6 L132 10 L148 3" stroke="#34d399" strokeWidth="2" />
      </svg>
    </div>
  );
}

function AdvisorPreview() {
  return (
    <div className="rounded-2xl border p-4 text-center" style={{ borderColor: COLORS.border, backgroundColor: "#fff" }}>
      <p className="text-[13.5px] font-semibold" style={{ color: COLORS.text }}>
        Advisor network access
      </p>
      <p className="mt-1 text-[12px]" style={{ color: COLORS.textSecondary }}>
        Matched with founders and builders who need your expertise.
      </p>
    </div>
  );
}

export function WaitlistForm({
  referralCode,
  onFocusChange,
}: {
  referralCode?: string;
  onFocusChange?: (focused: boolean) => void;
  /** @deprecated the site is light-first now; kept optional for old call sites. */
  theme?: "dark" | "light";
}) {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "role">("email");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const submit = () => {
    if (!role) return;
    setError("");
    startTransition(async () => {
      const fd = new FormData();
      fd.set("email", email);
      fd.set("role", role);
      if (referralCode) fd.set("ref", referralCode);
      if (typeof window !== "undefined") {
        const p = new URLSearchParams(window.location.search);
        if (p.get("utm_source")) fd.set("utmSource", p.get("utm_source") ?? "");
        if (p.get("utm_medium")) fd.set("utmMedium", p.get("utm_medium") ?? "");
        if (p.get("utm_campaign")) fd.set("utmCampaign", p.get("utm_campaign") ?? "");
      }
      const res = await joinWaitlist(fd);
      if (!res.success) {
        setError(res.error);
        return;
      }
      if (res.alreadyVerified && res.statusToken) {
        router.push(`/status?c=${res.statusToken}`);
        return;
      }
      router.push(`/verify?e=${encodeURIComponent(res.email)}`);
    });
  };

  const preview =
    role === "FOUNDER" ? <FounderPassPreview /> : role === "BUILDER" ? <BuilderPassPreview /> : role === "INVESTOR" ? <InvestorPreview /> : role === "ADVISOR" ? <AdvisorPreview /> : null;

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {step === "email" ? (
          <motion.div key="email-step" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25, ease: EASE }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setStep("role");
              }}
              className="flex flex-col gap-2 rounded-[22px] border p-2.5 transition-shadow duration-300 focus-within:shadow-[0_0_0_5px_rgba(124,58,237,0.14)] sm:flex-row sm:items-center"
              style={{
                borderColor: COLORS.border,
                backgroundColor: "#fff",
                boxShadow: "0 24px 60px -30px rgba(11,10,18,0.18)",
              }}
            >
              <div className="flex-1 px-3.5 py-2.5 text-left">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => onFocusChange?.(true)}
                  onBlur={() => onFocusChange?.(false)}
                  placeholder="Enter your email to get started"
                  className="w-full bg-transparent text-[15px] outline-none sm:text-[16px]"
                  style={{ color: COLORS.text }}
                  autoComplete="email"
                />
              </div>
              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                style={{ backgroundColor: COLORS.text, color: "#fff", boxShadow: "0 10px 24px -12px rgba(11,10,18,0.5)" }}
              >
                Join Waitlist
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>

            <div className="mt-3 flex flex-col items-center gap-1 text-center">
              <p className="text-[13.5px] font-semibold" style={{ color: COLORS.text }}>
                Verify your email to activate your WebXP and waitlist position.
              </p>
              <p className="text-[13px] font-medium" style={{ color: COLORS.textSecondary }}>
                Get{" "}
                <span className="font-bold" style={{ color: COLORS.accentDeep }}>
                  +100 WebXP
                </span>{" "}
                after verifying your email.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="role-step" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25, ease: EASE }}>
            <div className="rounded-[22px] border p-5" style={{ borderColor: COLORS.border, backgroundColor: "#fff", boxShadow: "0 24px 60px -30px rgba(11,10,18,0.18)" }}>
              <button
                type="button"
                onClick={() => setStep("email")}
                className="mb-3 inline-flex items-center gap-1.5 text-[12px] font-semibold"
                style={{ color: COLORS.textMuted }}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {email}
              </button>

              <p className="text-[15px] font-bold" style={{ color: COLORS.text }}>
                Who are you?
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  const active = role === r.value;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className="flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 transition-all duration-200"
                      style={{
                        borderColor: active ? COLORS.borderAccent : COLORS.border,
                        backgroundColor: active ? "rgba(124,58,237,0.06)" : COLORS.surfaceMuted,
                      }}
                    >
                      <Icon className="h-4.5 w-4.5" style={{ color: active ? COLORS.accentDeep : COLORS.textMuted }} />
                      <span className="text-[12px] font-semibold" style={{ color: active ? COLORS.text : COLORS.textSecondary }}>
                        {r.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                {preview ? (
                  <motion.div
                    key={role}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: EASE }}
                    className="mt-4"
                  >
                    {preview}
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <button
                type="button"
                onClick={submit}
                disabled={!role || isPending}
                className="group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: COLORS.text, color: "#fff", boxShadow: "0 10px 24px -12px rgba(11,10,18,0.5)" }}
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isPending ? "Joining…" : "Join Waitlist"}
                {!isPending ? <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /> : null}
              </button>
            </div>

            {error ? (
              <p className="mt-3 text-center text-[13px]" style={{ color: COLORS.red }}>
                {error}
              </p>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
