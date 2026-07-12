"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, BadgeCheck, Gift, Loader2, ShieldCheck, TrendingUp } from "lucide-react";
import { getExistingWaitlistAccess, getPublicWaitlistPulse, joinWaitlist } from "@/app/actions/waitlist";
import { COLORS, EASE, GRAD } from "@/lib/waitlist/tokens";

const PULSE_POLL_MS = 20_000;

function useWaitlistPulse() {
  const [pulse, setPulse] = useState<{ displayCount: number; recentMaskedEmail: string | null } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      getPublicWaitlistPulse().then((next) => {
        if (!cancelled) setPulse(next);
      });
    };
    load();
    const id = setInterval(load, PULSE_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return pulse;
}

type Role = "FOUNDER" | "BUILDER" | "INVESTOR" | "ADVISOR";

const ROLES: Array<{ value: Role; label: string; caption: string; iconSrc: string; accent: string }> = [
  { value: "FOUNDER", label: "Founder", caption: "Startup access", iconSrc: "/role-icons/founder-badge.svg", accent: "#7c3aed" },
  { value: "BUILDER", label: "Builder", caption: "Proof credential", iconSrc: "/role-icons/builder-hammer.svg", accent: "#0ea5e9" },
  { value: "INVESTOR", label: "Investor", caption: "Deal flow", iconSrc: "/role-icons/investor-chart.svg", accent: "#059669" },
  { value: "ADVISOR", label: "Advisor", caption: "Expert network", iconSrc: "/role-icons/advisor-handshake.svg", accent: "#db2777" },
];

function cleanReferralCodeInput(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  try {
    const url = new URL(trimmed);
    const ref = url.searchParams.get("ref");
    if (ref) return ref.trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32).toUpperCase();
  } catch {
    const refMatch = trimmed.match(/[?&]ref=([^&#]+)/i);
    if (refMatch?.[1]) {
      try {
        return decodeURIComponent(refMatch[1]).trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32).toUpperCase();
      } catch {
        return refMatch[1].trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32).toUpperCase();
      }
    }
  }

  return trimmed.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32).toUpperCase();
}

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

function AccessPassPreview({ kind }: { kind: "founder" | "builder" }) {
  const isFounder = kind === "founder";
  const title = isFounder ? "Founder Pass" : "Builder Pass";
  const label = isFounder ? "Founder" : "Builder";
  const subtitle = isFounder ? "Invite-only founder credential" : "Verified proof-of-work credential";
  const accent = isFounder ? "#a78bfa" : "#38bdf8";
  const proof = isFounder ? "Startup profile" : "GitHub + portfolio";

  return (
    <div className="rounded-[20px] border p-2.5 sm:p-3" style={{ borderColor: COLORS.border, backgroundColor: COLORS.surfaceMuted }}>
      <p className="mb-2 px-1 text-[11px] font-semibold leading-snug" style={{ color: COLORS.textSecondary }}>
        This is how your {title} will look.
      </p>
      <div className="relative overflow-hidden rounded-[18px] border p-3 sm:p-3.5" style={{ borderColor: "rgba(255,255,255,0.14)", background: GRAD.darkIsland }}>
        <div aria-hidden className="absolute -right-10 -top-10 h-24 w-24 rounded-full blur-2xl" style={{ backgroundColor: isFounder ? "rgba(167,139,250,0.3)" : "rgba(56,189,248,0.24)" }} />
        <div className="relative flex items-start gap-2.5 sm:items-center sm:gap-3">
          <div className="h-12 w-12 shrink-0 rounded-2xl p-[2px] sm:h-14 sm:w-14" style={{ background: `linear-gradient(135deg, ${accent}, rgba(255,255,255,0.65))` }}>
            <img src="/logo/solrishuavatar.png" alt="" className="h-full w-full rounded-[14px] object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[15px] font-black" style={{ color: COLORS.darkText }}>
                  {title}
                </p>
                <p className="truncate text-[11px]" style={{ color: COLORS.darkTextSecondary }}>
                  {subtitle}
                </p>
              </div>
              <BadgeCheck className="h-4 w-4 shrink-0" style={{ color: accent }} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <PassMini label={label} value="You" />
              <PassMini label="Track" value="Arc / Base" />
              <PassMini label="Status" value="Eligible soon" accent={accent} />
            </div>
          </div>
        </div>
        <div className="relative mt-3 flex items-center justify-between gap-2 border-t pt-2" style={{ borderColor: COLORS.darkBorder }}>
          <span className="truncate text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: COLORS.darkTextMuted }}>
            {proof}
          </span>
          <span className="shrink-0 text-[10px] font-black" style={{ color: accent }}>
            +5,000 Credits
          </span>
        </div>
      </div>
      <p className="mt-2.5 text-center text-[12px] leading-snug" style={{ color: COLORS.textMuted }}>
        {isFounder ? "Building too?" : "Founding too?"}{" "}
        <span className="font-semibold" style={{ color: COLORS.accentDeep }}>
          You can also claim a {isFounder ? "Builder" : "Founder"} Pass.
        </span>
      </p>
    </div>
  );
}

function PassMini({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="min-w-0 rounded-xl px-2 py-1.5" style={{ backgroundColor: "rgba(255,255,255,0.045)" }}>
      <p className="text-[8.5px] font-bold uppercase tracking-[0.12em]" style={{ color: COLORS.darkTextMuted }}>
        {label}
      </p>
      <p className="mt-0.5 truncate text-[10.5px] font-bold" style={{ color: accent ?? COLORS.darkText }}>
        {value}
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
  const [manualReferralCode, setManualReferralCode] = useState(referralCode ?? "");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const pulse = useWaitlistPulse();

  const goTo = (path: string) => {
    router.push(path);
  };

  const continueFromEmail = () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;
    setError("");
    setEmail(normalizedEmail);
    startTransition(async () => {
      const res = await getExistingWaitlistAccess(normalizedEmail);
      if (!res.success) {
        setError(res.error);
        return;
      }
      if (res.alreadyVerified && res.statusToken) {
        goTo(`/status?c=${res.statusToken}`);
        return;
      }
      setStep("role");
    });
  };

  const submit = (options?: { skipReferral?: boolean }) => {
    if (!role) return;
    setError("");
    startTransition(async () => {
      const fd = new FormData();
      fd.set("email", email);
      fd.set("role", role);
      const referral = options?.skipReferral ? "" : cleanReferralCodeInput(manualReferralCode);
      if (referral) fd.set("ref", referral);
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
        goTo(`/status?c=${res.statusToken}`);
        return;
      }
      goTo(`/verify?e=${encodeURIComponent(res.email)}`);
    });
  };

  const preview =
    role === "FOUNDER" ? <AccessPassPreview kind="founder" /> : role === "BUILDER" ? <AccessPassPreview kind="builder" /> : role === "INVESTOR" ? <InvestorPreview /> : role === "ADVISOR" ? <AdvisorPreview /> : null;

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {step === "email" ? (
          <motion.div key="email-step" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25, ease: EASE }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                continueFromEmail();
              }}
              className="flex flex-col gap-1.5 rounded-[18px] border p-2 transition-shadow duration-300 focus-within:shadow-[0_0_0_5px_rgba(124,58,237,0.14)] sm:flex-row sm:items-center sm:gap-2 sm:rounded-[22px] sm:p-2.5"
              style={{
                borderColor: COLORS.border,
                backgroundColor: "#fff",
                boxShadow: "0 24px 60px -30px rgba(11,10,18,0.18)",
              }}
            >
              <div className="flex-1 px-3 py-2 text-left sm:px-3.5 sm:py-2.5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => onFocusChange?.(true)}
                  onBlur={() => onFocusChange?.(false)}
                  placeholder="you@yourcompany.com"
                  className="w-full bg-transparent text-[14px] outline-none sm:text-[16px]"
                  style={{ color: COLORS.text }}
                  autoComplete="email"
                />
              </div>
              <button
                type="submit"
                disabled={isPending || !email.trim()}
                className="group inline-flex items-center justify-center gap-2 rounded-[14px] px-4 py-3 text-[13px] font-semibold transition-all duration-200 hover:-translate-y-0.5 sm:rounded-2xl sm:px-6 sm:py-3.5 sm:text-sm"
                style={{ backgroundColor: COLORS.text, color: "#fff", boxShadow: "0 10px 24px -12px rgba(11,10,18,0.5)" }}
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isPending ? "Checking..." : "Join Waitlist"}
                {!isPending ? <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /> : null}
              </button>
            </form>

            {error ? (
              <p className="mt-3 text-center text-[13px]" style={{ color: COLORS.red }}>
                {error}
              </p>
            ) : null}

            {pulse ? (
              <div className="mt-3 flex items-center gap-1.5 text-[10.5px] font-medium sm:text-[11.5px]" style={{ color: COLORS.textMuted }}>
                <span className="relative flex shrink-0 items-center justify-center">
                  <span className="absolute inline-flex size-2.5 animate-ping rounded-full opacity-60" style={{ backgroundColor: COLORS.green }} />
                  <span className="relative text-[13px] leading-none">🟢</span>
                </span>
                <span>
                  <strong className="font-bold tabular-nums" style={{ color: COLORS.text }}>
                    {pulse.displayCount.toLocaleString()}
                  </strong>{" "}
                  people just joined the waitlist
                </span>
              </div>
            ) : null}

            <div className="mt-2.5 grid gap-1 text-left sm:mt-3 sm:gap-1.5">
              <p className="grid grid-cols-[16px_minmax(0,1fr)] items-start gap-2 text-[11px] font-semibold leading-4 max-lg:text-pretty sm:grid-cols-[18px_minmax(0,1fr)] sm:gap-2.5 sm:text-[12.5px] sm:leading-5" style={{ color: COLORS.textSecondary }}>
                <ShieldCheck className="mt-0.5 size-3.5 shrink-0 sm:size-4" style={{ color: COLORS.textMuted }} />
                <span>Verify your email and get a chance to unlock exclusive Founder and Builder Pass.</span>
              </p>
              <p className="grid grid-cols-[16px_minmax(0,1fr)] items-start gap-2 text-[11px] font-medium leading-4 max-lg:text-pretty sm:grid-cols-[18px_minmax(0,1fr)] sm:gap-2.5 sm:text-[12.5px] sm:leading-5" style={{ color: COLORS.textSecondary }}>
                <Gift className="mt-0.5 size-3.5 shrink-0 sm:size-4" style={{ color: COLORS.textMuted }} />
                <span>
                  Get{" "}
                  <span className="font-bold" style={{ color: COLORS.accentDeep }}>
                    +100 Credits
                  </span>{" "}
                  after verifying your email.
                </span>
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="role-step" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25, ease: EASE }}>
            <div className="overflow-hidden rounded-[24px] border p-3 sm:p-5" style={{ borderColor: COLORS.border, backgroundColor: "rgba(255,255,255,0.94)", boxShadow: "0 24px 70px -34px rgba(11,10,18,0.24)" }}>
              <button
                type="button"
                onClick={() => setStep("email")}
                className="mb-3 inline-flex max-w-full items-center gap-1.5 text-[12px] font-semibold"
                style={{ color: COLORS.textMuted }}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="truncate">{email}</span>
              </button>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[18px] font-black tracking-tight" style={{ color: COLORS.text }}>
                    Who are you?
                  </p>
                  <p className="mt-1 text-[12.5px]" style={{ color: COLORS.textSecondary }}>
                    Pick the access path that fits you best.
                  </p>
                </div>
                <span className="hidden rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] sm:inline-flex" style={{ borderColor: COLORS.borderAccent, color: COLORS.accentDeep }}>
                  Private beta
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {ROLES.map((r) => {
                  const active = role === r.value;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className="group relative overflow-hidden rounded-[16px] border px-2.5 py-2.5 text-left transition-all duration-200 hover:-translate-y-0.5 sm:rounded-[18px] sm:py-3"
                      style={{
                        borderColor: active ? COLORS.borderAccent : COLORS.border,
                        backgroundColor: active ? "rgba(124,58,237,0.07)" : "#fff",
                        boxShadow: active ? "0 14px 34px -26px rgba(124,58,237,0.9)" : "0 1px 2px rgba(11,10,18,0.03)",
                      }}
                    >
                      <span
                        aria-hidden
                        className="absolute -right-6 -top-6 h-14 w-14 rounded-full opacity-0 blur-xl transition-opacity group-hover:opacity-50"
                        style={{ backgroundColor: r.accent }}
                      />
                      <span className="relative flex items-center gap-2 sm:flex-col sm:text-center">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl sm:h-10 sm:w-10 sm:rounded-2xl" style={{ backgroundColor: active ? "rgba(255,255,255,0.86)" : COLORS.surfaceMuted }}>
                          <img src={r.iconSrc} alt="" className="h-6 w-6 object-contain sm:h-7 sm:w-7" />
                        </span>
                        <span className="min-w-0 sm:mt-2">
                          <span className="block truncate text-[12.5px] font-black" style={{ color: COLORS.text }}>
                            {r.label}
                          </span>
                          <span className="block truncate text-[10px] leading-tight sm:text-[10.5px]" style={{ color: COLORS.textMuted }}>
                            {r.caption}
                          </span>
                        </span>
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
                    className="mt-3 sm:mt-4"
                  >
                    {preview}
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {role === "FOUNDER" ? (
                <p className="mt-3 text-pretty text-[11.5px] leading-5 sm:mt-4" style={{ color: COLORS.textMuted }}>
                  Founders need a company email (e.g.{" "}
                  <span className="font-semibold" style={{ color: COLORS.text }}>
                    you@yourcompany.com
                  </span>
                  ) — personal inboxes aren&apos;t accepted for this role, so we can confirm a real company. Prefer a personal email? Choose Builder instead.
                </p>
              ) : null}

              {role ? (
                <div className="mt-3 rounded-[18px] border p-3 sm:mt-4" style={{ borderColor: COLORS.border, backgroundColor: COLORS.surfaceMuted }}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[13px] font-black" style={{ color: COLORS.text }}>
                      Referral code
                    </p>
                    <span className="rounded-full px-2.5 py-1 text-[9.5px] font-black uppercase tracking-[0.12em]" style={{ backgroundColor: "#fff", color: COLORS.textMuted }}>
                      Optional
                    </span>
                  </div>
                  <input
                    type="text"
                    value={manualReferralCode}
                    onChange={(e) => setManualReferralCode(e.target.value)}
                    placeholder="Paste referral code or link"
                    className="mt-2 w-full rounded-2xl border bg-white px-3.5 py-3 text-[13.5px] font-semibold outline-none transition-shadow focus:shadow-[0_0_0_4px_rgba(124,58,237,0.12)]"
                    style={{ borderColor: COLORS.border, color: COLORS.text }}
                    autoComplete="off"
                  />
                  <p className="mt-2 text-[11.5px] leading-5" style={{ color: COLORS.textMuted }}>
                    If your referral link did not apply, paste the code here. You can also skip this and still join.
                  </p>
                </div>
              ) : null}

              <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_150px]">
                <button
                  type="button"
                  onClick={() => submit()}
                  disabled={!role || isPending}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-[18px] px-4 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-2xl sm:px-6 sm:py-3.5"
                  style={{ backgroundColor: COLORS.text, color: "#fff", boxShadow: "0 10px 24px -12px rgba(11,10,18,0.5)" }}
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {isPending ? "Joining..." : "Join Waitlist"}
                  {!isPending ? <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /> : null}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setManualReferralCode("");
                    submit({ skipReferral: true });
                  }}
                  disabled={!role || isPending}
                  className="inline-flex w-full items-center justify-center rounded-[18px] border px-4 py-3 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-2xl"
                  style={{ borderColor: COLORS.border, backgroundColor: "#fff", color: COLORS.textSecondary }}
                >
                  Skip code
                </button>
              </div>
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
