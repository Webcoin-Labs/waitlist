"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CircleDollarSign,
  Lock,
  Megaphone,
  ShieldCheck,
  Sparkles,
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

const UNLOCKS: { icon: LucideIcon; label: string }[] = [
  { icon: Users, label: "Access to serious builders" },
  { icon: UserPlus, label: "Co-founder and advisor visibility" },
  { icon: TrendingUp, label: "Funding and investor-readiness support" },
  { icon: Megaphone, label: "Marketing and distribution advantages" },
];

export function FounderPassInviteSection() {
  return (
    <section className="py-24" style={{ backgroundColor: COLORS.bg }}>
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
              <a
                href="#join"
                className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                style={{ borderColor: COLORS.border, color: COLORS.text, backgroundColor: "#fff" }}
              >
                Founder Pass consideration
                <UserPlus className="h-4 w-4" style={{ color: COLORS.accentDeep }} />
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
              className="relative overflow-hidden rounded-[26px] p-7 sm:p-8"
              style={{
                background: GRAD.darkIsland,
                boxShadow:
                  "0 0 0 1.5px rgba(167,139,250,0.4), 0 0 40px -10px rgba(124,58,237,0.35), 0 50px 120px -52px rgba(124,58,237,0.55)",
              }}
            >
              <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ backgroundImage: GRAD.brand }} />
              <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full blur-3xl" style={{ backgroundColor: "rgba(124,58,237,0.32)" }} />

              <div className="relative flex items-start justify-between">
                <p className="text-[13px] font-semibold" style={{ color: COLORS.darkTextSecondary }}>
                  Webcoin Labs
                </p>
                <div className="flex items-center gap-1.5">
                  <p className="text-[20px] font-bold tracking-tight" style={{ color: COLORS.darkText }}>
                    Founder Pass
                  </p>
                  <Sparkles className="h-4 w-4" style={{ color: "#c4b5fd" }} />
                </div>
              </div>

              <div className="relative mt-6 flex items-center gap-6">
                <div
                  className="h-24 w-24 shrink-0 rounded-full p-[2.5px]"
                  style={{ background: "conic-gradient(from 180deg, #a78bfa, #22d3ee, #f472b6, #a78bfa)" }}
                >
                  <img
                    src="/logo/solrishuavatar.png"
                    alt="Founder"
                    className="h-full w-full rounded-full object-cover"
                    style={{ backgroundColor: COLORS.darkSurface }}
                  />
                </div>

                <div className="flex-1">
                  {CARD_FIELDS.map((field) => (
                    <div key={field.label} className="flex items-center justify-between gap-4 py-[5px]">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: COLORS.darkTextMuted }}>
                        {field.label}
                      </span>
                      <span className="text-[13px] font-semibold" style={{ color: field.accent ? "#c4b5fd" : COLORS.darkText }}>
                        {field.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative mt-6 border-t pt-5" style={{ borderColor: COLORS.darkBorder }}>
                <span
                  className="mx-auto flex w-max items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "#c4b5fd" }}
                >
                  <Lock className="h-4 w-4" />
                  Under consideration
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
