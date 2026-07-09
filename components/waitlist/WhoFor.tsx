"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  CircleDot,
  Compass,
  FileText,
  Github,
  Handshake,
  IdCard,
  Network,
  PieChart,
  Rocket,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { COLORS, EASE, GRAD } from "@/lib/waitlist/tokens";

type PreviewKind = "founder" | "builder" | "deck" | "tokenomics" | "investor" | "advisor" | "pass" | "network";

// Same verified geography as DashboardPreview/GlobalMap — coords are % positions
// on the real map asset (public/maps/simplemaps-world.svg, viewBox 0 0 2000 857).
const NETWORK_HUBS = [
  { x: 16.5, y: 31.0, tone: "#a78bfa" }, // San Francisco
  { x: 49.5, y: 20.0, tone: "#38bdf8" }, // London
  { x: 51.8, y: 51.8, tone: "#fbbf24" }, // Nigeria
  { x: 60.1, y: 58.2, tone: "#a78bfa" }, // Kenya
  { x: 87.5, y: 32.5, tone: "#38bdf8" }, // Japan
] as const;

const CAPABILITIES: Array<{
  icon: LucideIcon;
  title: string;
  body: string;
  chips: string[];
  accent: string;
  kind: PreviewKind;
  span: string;
  dark?: boolean;
}> = [
  {
    icon: Rocket,
    title: "Founder Sprint",
    body: "Startup profile, pitch deck support, advisor access, and investor intros — everything to go from idea to investor-ready.",
    chips: ["Pitch Deck", "Investor Intro", "Advisor Access"],
    accent: "#7c3aed",
    kind: "founder",
    span: "lg:col-span-2",
  },
  {
    icon: Github,
    title: "Builder Proof",
    body: "Show your projects and GitHub work directly to founders who need serious builders — no cold pitch required.",
    chips: ["GitHub", "Projects", "Builder Access"],
    accent: "#0e7490",
    kind: "builder",
    span: "lg:col-span-2",
  },
  {
    icon: FileText,
    title: "Pitch Deck Review",
    body: "Upload your deck and get a clearer, investor-ready narrative with section-by-section feedback.",
    chips: ["Deck Score", "Narrative"],
    accent: "#2563eb",
    kind: "deck",
    span: "lg:col-span-1",
  },
  {
    icon: PieChart,
    title: "Tokenomics Support",
    body: "Model allocation, vesting, and scenarios with export-ready structures.",
    chips: ["Allocations", "Vesting"],
    accent: "#059669",
    kind: "tokenomics",
    span: "lg:col-span-1",
  },
  {
    icon: Handshake,
    title: "Investor Introductions",
    body: "Verified founders can request relevant investor intros instead of cold DMs and scattered outreach.",
    chips: ["Warm Intro", "Verified Founder"],
    accent: "#b45309",
    kind: "investor",
    span: "lg:col-span-1",
  },
  {
    icon: Compass,
    title: "Advisor Discovery",
    body: "Find advisors for product, fundraising, GTM, and community — matched to what you actually need.",
    chips: ["Advisors", "Strategy"],
    accent: "#db2777",
    kind: "advisor",
    span: "lg:col-span-1",
  },
  {
    icon: IdCard,
    title: "Builder Pass Access",
    body: "Proof-based Builder Pass access for selected Arc and Base builders.",
    chips: ["Builder Pass", "Arc", "Base", "Eligibility"],
    accent: "#7c3aed",
    kind: "pass",
    span: "lg:col-span-2",
  },
  {
    icon: Network,
    title: "Private Network",
    body: "A focused community of founders, builders, investors, and advisors building serious projects.",
    chips: ["Community", "Proof"],
    accent: "#0e7490",
    kind: "network",
    span: "lg:col-span-2",
  },
];

function PreviewShell({ label, children, dark }: { label: string; children: ReactNode; dark?: boolean }) {
  return (
    <div
      className="mt-5 overflow-hidden rounded-2xl border p-3 transition-all duration-300 group-hover:-translate-y-0.5"
      style={{
        borderColor: dark ? COLORS.darkBorderStrong : COLORS.border,
        background: dark ? GRAD.darkIsland : COLORS.surfaceMuted,
      }}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: dark ? COLORS.darkTextMuted : COLORS.textFaint }}>
          inside Webcoin Labs
        </span>
        <span className="text-[10px] font-semibold" style={{ color: dark ? COLORS.darkTextSecondary : COLORS.textMuted }}>
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

function Preview({ kind, accent, dark }: { kind: PreviewKind; accent: string; dark?: boolean }) {
  if (kind === "builder") {
    return (
      <PreviewShell label="proof layer" dark={dark}>
        <div className="grid gap-2">
          {["github.com/founder-tools", "startup profile linked", "available for Arc projects"].map((line, i) => (
            <div key={line} className="flex items-center gap-2 text-[11px]" style={{ color: dark ? COLORS.darkTextSecondary : COLORS.textSecondary }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: i === 0 ? accent : dark ? COLORS.darkTextMuted : COLORS.textFaint }} />
              <span className="truncate">{line}</span>
            </div>
          ))}
        </div>
      </PreviewShell>
    );
  }

  if (kind === "deck") {
    return (
      <PreviewShell label="readiness" dark={dark}>
        <div className="flex items-end gap-1.5">
          {[34, 58, 76, 64, 88].map((height, i) => (
            <span key={height} className="flex-1 rounded-t-lg" style={{ height: 42, backgroundColor: dark ? "rgba(255,255,255,0.1)" : COLORS.border }}>
              <motion.span
                className="block rounded-t-lg"
                style={{ background: i === 4 ? GRAD.brand : dark ? "rgba(255,255,255,0.28)" : COLORS.borderStrong }}
                initial={{ height: "14%" }}
                whileInView={{ height: `${height}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.04, ease: EASE }}
              />
            </span>
          ))}
        </div>
        <div className="mt-3 grid gap-1.5 text-[11px]" style={{ color: dark ? COLORS.darkTextSecondary : COLORS.textSecondary }}>
          <span>Narrative gaps marked for review</span>
          <span>Investor-ready sections prepared</span>
        </div>
      </PreviewShell>
    );
  }

  if (kind === "tokenomics") {
    return (
      <PreviewShell label="model view" dark={dark}>
        <div className="grid gap-2">
          {[
            ["Team", "42%"],
            ["Community", "68%"],
            ["Treasury", "54%"],
          ].map(([name, width]) => (
            <div key={name}>
              <div className="mb-1 flex justify-between text-[10px]" style={{ color: dark ? COLORS.darkTextMuted : COLORS.textMuted }}>
                <span>{name}</span>
                <span>allocation lane</span>
              </div>
              <span className="block h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: dark ? "rgba(255,255,255,0.1)" : COLORS.border }}>
                <span className="block h-full rounded-full" style={{ width, background: `linear-gradient(90deg, ${accent}, ${accent}88)` }} />
              </span>
            </div>
          ))}
        </div>
      </PreviewShell>
    );
  }

  if (kind === "investor") {
    return (
      <PreviewShell label="intro request" dark={dark}>
        <div className="grid gap-2 text-[11px]">
          <div className="flex items-center justify-between gap-3">
            <span style={{ color: dark ? COLORS.darkTextSecondary : COLORS.textSecondary }}>Relevant investor list</span>
            <span style={{ color: accent }}>Reviewing</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span style={{ color: dark ? COLORS.darkTextSecondary : COLORS.textSecondary }}>Warm intro request</span>
            <span style={{ color: dark ? "#34d399" : COLORS.green }}>Drafted</span>
          </div>
        </div>
      </PreviewShell>
    );
  }

  if (kind === "advisor") {
    return (
      <PreviewShell label="discovery" dark={dark}>
        <div className="flex flex-wrap gap-1.5">
          {["Product", "Fundraising", "GTM", "Community"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border px-2 py-1 text-[10px]"
              style={{ borderColor: dark ? COLORS.darkBorder : COLORS.border, color: dark ? COLORS.darkTextSecondary : COLORS.textSecondary }}
            >
              {tag}
            </span>
          ))}
        </div>
      </PreviewShell>
    );
  }

  if (kind === "pass") {
    return (
      <PreviewShell label="eligibility" dark={dark}>
        <div
          className="rounded-xl border p-3"
          style={{
            borderColor: dark ? "rgba(196,181,253,0.28)" : "rgba(124,58,237,0.24)",
            backgroundColor: dark ? "rgba(196,181,253,0.1)" : "rgba(124,58,237,0.06)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold" style={{ color: dark ? COLORS.darkText : COLORS.text }}>
              Builder Pass
            </span>
            <ShieldCheck className="h-4 w-4" style={{ color: accent }} />
          </div>
          <p className="mt-1 text-[11px]" style={{ color: dark ? COLORS.darkTextSecondary : COLORS.textSecondary }}>
            Arc and Base beta eligibility after proof review.
          </p>
        </div>
      </PreviewShell>
    );
  }

  if (kind === "network") {
    return (
      <PreviewShell label="private graph" dark={dark}>
        <div
          className="relative overflow-hidden rounded-xl"
          style={{
            aspectRatio: "2000 / 857",
            background: "radial-gradient(circle at 28% 34%, rgba(167,139,250,0.16), transparent 55%), rgba(255,255,255,0.03)",
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: "linear-gradient(120deg, rgba(167,139,250,0.34), rgba(56,189,248,0.24))",
              WebkitMaskImage: "url(/maps/simplemaps-world.svg)",
              maskImage: "url(/maps/simplemaps-world.svg)",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              WebkitMaskSize: "contain",
              maskSize: "contain",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(196,181,253,0.85) 1px, transparent 1.5px)",
              backgroundSize: "6px 6px",
              WebkitMaskImage: "url(/maps/simplemaps-world.svg)",
              maskImage: "url(/maps/simplemaps-world.svg)",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              WebkitMaskSize: "contain",
              maskSize: "contain",
            }}
          />
          {NETWORK_HUBS.map((hub, i) => (
            <motion.span
              key={`${hub.x}-${hub.y}`}
              className="absolute h-1.5 w-1.5 rounded-full"
              style={{ left: `${hub.x}%`, top: `${hub.y}%`, backgroundColor: hub.tone, boxShadow: `0 0 6px ${hub.tone}`, transform: "translate(-50%,-50%)" }}
              animate={{ opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
            />
          ))}
        </div>
      </PreviewShell>
    );
  }

  return (
    <PreviewShell label="workspace" dark={dark}>
      <div className="grid gap-2">
        {["Startup profile", "Pitch deck", "Intro request"].map((line, i) => (
          <div
            key={line}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5"
            style={{ backgroundColor: dark ? "rgba(255,255,255,0.06)" : "#fff" }}
          >
            {i === 2 ? (
              <CircleDot className="h-3.5 w-3.5" style={{ color: accent }} />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5" style={{ color: dark ? "#34d399" : COLORS.green }} />
            )}
            <span className="text-[11px]" style={{ color: dark ? COLORS.darkTextSecondary : COLORS.textSecondary }}>
              {line}
            </span>
          </div>
        ))}
      </div>
    </PreviewShell>
  );
}

function CapabilityCard({ item, index }: { item: (typeof CAPABILITIES)[number]; index: number }) {
  const Icon = item.icon;
  const dark = item.dark;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.52, delay: (index % 4) * 0.05, ease: EASE }}
      whileHover={{ y: -4 }}
      className={`group relative min-h-[300px] overflow-hidden rounded-3xl border p-5 ${item.span}`}
      style={{
        borderColor: dark ? COLORS.darkBorderStrong : COLORS.border,
        background: dark ? GRAD.darkIsland : "#fff",
        boxShadow: dark ? "0 24px 60px -40px rgba(124,58,237,0.5)" : "0 20px 50px -36px rgba(11,10,18,0.14)",
      }}
    >
      {dark ? (
        <div aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl" style={{ backgroundColor: "rgba(124,58,237,0.3)" }} />
      ) : null}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px opacity-70"
        style={{ background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)` }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <span
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
          style={{ backgroundColor: dark ? "#fff" : `${item.accent}14`, color: dark ? "#0a0a0f" : item.accent }}
        >
          <Icon className="h-5 w-5" strokeWidth={1.9} />
        </span>
        <span
          className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ color: dark ? COLORS.darkTextMuted : COLORS.textMuted }}
        >
          Open preview <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>

      <div className="relative mt-6">
        <h3 className="text-[20px] font-bold tracking-tight" style={{ color: dark ? COLORS.darkText : COLORS.text }}>
          {item.title}
        </h3>
        <p className="mt-2.5 text-[13.5px] leading-6" style={{ color: dark ? COLORS.darkTextSecondary : COLORS.textSecondary }}>
          {item.body}
        </p>
      </div>

      <div className="relative mt-5 flex flex-wrap gap-2">
        {item.chips.map((chip) => (
          <span
            key={chip}
            className="rounded-full border px-2.5 py-1 text-[11px] font-medium"
            style={{
              borderColor: dark ? COLORS.darkBorder : COLORS.border,
              backgroundColor: dark ? "rgba(255,255,255,0.06)" : COLORS.bg,
              color: dark ? COLORS.darkTextSecondary : COLORS.textSecondary,
            }}
          >
            {chip}
          </span>
        ))}
      </div>

      <div className="relative">
        <Preview kind={item.kind} accent={item.accent} dark />
      </div>
    </motion.article>
  );
}

export function WhoFor() {
  return (
    <section id="about" className="relative py-24" style={{ backgroundColor: COLORS.bg }}>
      <div className="container relative mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
            style={{ borderColor: COLORS.border, color: COLORS.accentDeep, backgroundColor: "#fff" }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: COLORS.accent }} />
            About Webcoin Labs
          </span>
          <h2 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight md:text-[3rem]" style={{ color: COLORS.text }}>
            Built for founders and builders who are serious.
          </h2>
          <p className="mt-4 max-w-xl text-[16px] leading-7" style={{ color: COLORS.textSecondary }}>
            Founder tools, builder proof, investor introductions, advisor discovery, pitch deck review, tokenomics
            support, and private ecosystem access — in one place.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((item, index) => (
            <CapabilityCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
