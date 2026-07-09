"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CircleDollarSign,
  Lock,
  Megaphone,
  ShieldCheck,
  Star,
  TrendingUp,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";
import { GradientText } from "./Brand";
import { COLORS, EASE, GRAD } from "@/lib/waitlist/tokens";

const CHIPS: { icon: LucideIcon; label: string }[] = [
  { icon: Users, label: "Builder Access" },
  { icon: UserPlus, label: "Co-founder Discovery" },
  { icon: CircleDollarSign, label: "Funding Support" },
  { icon: Megaphone, label: "Marketing Access" },
  { icon: Star, label: "Premium Founder Tools" },
];

const CARD_FIELDS: { label: string; value: string; accent?: boolean }[] = [
  { label: "Founder", value: "Solrishu" },
  { label: "Startup", value: "Webcoin Labs" },
  { label: "Stage", value: "Early Access" },
  { label: "Status", value: "Invite Only", accent: true },
  { label: "Focus", value: "Builders • Funding • Growth" },
  { label: "Access", value: "Premium Features" },
  { label: "Network", value: "Web3 Startups" },
];

const CARD_META: { label: string; value: string; accent?: boolean }[] = [
  { label: "Access", value: "Premium founder tools" },
  { label: "Status", value: "Invite only", accent: true },
  { label: "Network", value: "Builders / funding / growth" },
];

const UNLOCKS: { icon: LucideIcon; label: string }[] = [
  { icon: Users, label: "Access to serious builders" },
  { icon: UserPlus, label: "Co-founder and advisor visibility" },
  { icon: TrendingUp, label: "Funding and investor-readiness support" },
  { icon: Megaphone, label: "Marketing and distribution advantages" },
];

export function FounderPassInviteSection() {
  return (
    <section className="py-14 lg:py-24" style={{ backgroundColor: COLORS.bg }}>
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid items-start gap-14 lg:grid-cols-[0.95fr_1.05fr]">
          {/* LEFT — copy */}
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{ borderColor: COLORS.borderAccent, color: COLORS.accentDeep, backgroundColor: "rgba(124,58,237,0.05)" }}
            >
              <Lock className="h-3 w-3" />
              Invite-only access
            </span>
            <h2 className="mt-5 text-4xl font-bold tracking-tight md:text-[4.2rem] md:leading-[0.95]" style={{ color: COLORS.text }}>
              Founder Pass<GradientText>.</GradientText>
            </h2>
            <p className="mt-3 text-2xl font-semibold tracking-tight" style={{ color: COLORS.text }}>
              Your invite-only founder credential.
            </p>
            <p className="mt-5 max-w-lg text-[15px] leading-7" style={{ color: COLORS.textSecondary }}>
              Founder Pass is an exclusive credential for startup founders building serious companies. It unlocks
              curated access to premium Webcoin Labs features — including builder discovery, co-founder access,
              investor readiness, funding support, and marketing/distribution advantages.
            </p>
            <p className="mt-4 max-w-lg text-[14px] leading-6" style={{ color: COLORS.textMuted }}>
              Invites open after the Webcoin Labs beta launch. Waitlist members may become eligible for consideration
              based on startup quality, execution proof, and ecosystem activity.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {CHIPS.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] font-semibold"
                  style={{ borderColor: COLORS.border, color: COLORS.text, backgroundColor: "#fff" }}
                >
                  <Icon className="h-4 w-4" style={{ color: COLORS.accentDeep }} />
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#join"
                className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: COLORS.text, color: "#fff" }}
              >
                Join waitlist
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-6 flex items-start gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" style={{ color: COLORS.accentDeep }} />
              <p className="text-[12px] leading-5" style={{ color: COLORS.textMuted }}>
                Founder Pass is an in-app access credential inside Webcoin Labs. It is not a payment card, token, NFT,
                investment product, or financial product.
              </p>
            </div>
          </div>

          {/* RIGHT — invite card + unlocks */}
          <div className="grid gap-5">
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.65, ease: EASE }}
              className="relative mx-auto w-full max-w-xl"
            >
              <div aria-hidden className="absolute inset-4 rounded-[34px] blur-3xl" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(34,211,238,0.18))" }} />
              <div
                className="relative overflow-hidden rounded-[30px] border p-5 shadow-[0_46px_130px_-62px_rgba(76,29,149,0.75)] sm:p-6"
                style={{
                  background:
                    "radial-gradient(circle at 18% 18%, rgba(34,211,238,0.2), transparent 28%), radial-gradient(circle at 84% 20%, rgba(167,139,250,0.28), transparent 30%), linear-gradient(135deg, #08091a 0%, #11102a 47%, #30194c 100%)",
                  borderColor: "rgba(196,181,253,0.55)",
                }}
              >
                <div aria-hidden className="absolute inset-x-0 top-0 h-px" style={{ backgroundImage: GRAD.brand }} />
                <div aria-hidden className="absolute -right-20 -top-24 h-60 w-60 rounded-full blur-3xl" style={{ backgroundColor: "rgba(124,58,237,0.34)" }} />
                <div aria-hidden className="absolute -bottom-24 left-8 h-48 w-48 rounded-full blur-3xl" style={{ backgroundColor: "rgba(34,211,238,0.18)" }} />
                <div aria-hidden className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(115deg, transparent 0 43%, #fff 44%, transparent 45% 100%)" }} />

                <div className="relative flex items-start justify-between gap-5">
                  <img src="/logo/wcl-white.webp" alt="Webcoin Labs" className="h-6 w-auto object-contain sm:h-7" />
                  <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em]" style={{ borderColor: "rgba(196,181,253,0.26)", color: "#ddd6fe", backgroundColor: "rgba(255,255,255,0.07)" }}>
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Founder Pass
                  </span>
                </div>

                <div className="relative mt-9 flex items-end justify-between gap-5">
                  <div>
                    <div
                      className="grid h-12 w-16 grid-cols-3 grid-rows-2 gap-[3px] rounded-xl border p-2"
                      style={{ borderColor: "rgba(250,204,21,0.36)", background: "linear-gradient(135deg, rgba(250,204,21,0.55), rgba(180,83,9,0.24))" }}
                      aria-hidden
                    >
                      {Array.from({ length: 6 }).map((_, i) => (
                        <span key={i} className="rounded-[3px]" style={{ backgroundColor: "rgba(255,255,255,0.38)" }} />
                      ))}
                    </div>
                    <p className="mt-5 text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: COLORS.darkTextMuted }}>
                      Credential ID
                    </p>
                    <p className="mt-1 font-mono text-[18px] font-bold tracking-[0.12em]" style={{ color: COLORS.darkText }}>
                      WCL-FND-2026
                    </p>
                  </div>

                  <div className="hidden items-center gap-1 text-[#ddd6fe] sm:flex" aria-hidden>
                    <span className="h-7 w-[2px] rounded-full bg-current opacity-35" />
                    <span className="h-10 w-[2px] rounded-full bg-current opacity-55" />
                    <span className="h-14 w-[2px] rounded-full bg-current opacity-75" />
                  </div>
                </div>

                <div className="relative mt-8 grid gap-5 border-t pt-5 sm:grid-cols-[96px_1fr]" style={{ borderColor: COLORS.darkBorder }}>
                  <div
                    className="h-20 w-20 rounded-2xl p-[2px]"
                    style={{ background: "linear-gradient(135deg, #22d3ee, #a78bfa, #f472b6)" }}
                  >
                    <img
                      src="/logo/solrishuavatar.png"
                      alt="Founder"
                      className="h-full w-full rounded-[14px] object-cover"
                      style={{ backgroundColor: COLORS.darkSurface }}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: COLORS.darkTextMuted }}>
                          Cardholder
                        </p>
                        <p className="mt-1 text-[20px] font-black tracking-tight" style={{ color: COLORS.darkText }}>
                          Solrishu
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold" style={{ backgroundColor: "rgba(167,139,250,0.18)", color: "#ddd6fe" }}>
                        <Lock className="h-3.5 w-3.5" />
                        Under consideration
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      {CARD_META.map((field) => (
                        <div key={field.label} className="min-w-0">
                          <p className="text-[9px] font-black uppercase tracking-[0.14em]" style={{ color: COLORS.darkTextMuted }}>
                            {field.label}
                          </p>
                          <p className="mt-1 truncate text-[12px] font-bold" style={{ color: field.accent ? "#c4b5fd" : COLORS.darkText }}>
                            {field.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="#perks"
                  className="inline-flex items-center gap-1.5 rounded-full border bg-white px-4 py-2 text-[12px] font-bold transition-transform hover:-translate-y-0.5"
                  style={{ borderColor: COLORS.border, color: COLORS.text }}
                >
                  Check Founder Access benefits
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: COLORS.textMuted }}>
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Access credential only
                </span>
              </div>
            </motion.div>

            <div className="rounded-2xl border p-6" style={{ borderColor: COLORS.border, backgroundColor: "#fff" }}>
              <p className="text-[15px] font-bold" style={{ color: COLORS.text }}>
                What Founder Pass unlocks
              </p>
              <div className="mt-4 grid gap-3.5">
                {UNLOCKS.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: "rgba(124,58,237,0.08)", color: COLORS.accentDeep }}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-[13.5px] font-medium" style={{ color: COLORS.textSecondary }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-2 border-t pt-4" style={{ borderColor: COLORS.border }}>
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" style={{ color: COLORS.textMuted }} />
                <p className="text-[11.5px]" style={{ color: COLORS.textMuted }}>
                  Invite-based access for selected founders after beta launch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
