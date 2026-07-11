"use client";

import { useEffect, useRef, useState, type ComponentType, type CSSProperties, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Fingerprint,
  Gauge,
  Globe2,
  IdCard,
  LayoutDashboard,
  ListOrdered,
  MessageSquare,
  Route,
  Search,
  Send,
  TrendingUp,
  Trophy,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { COLORS, EASE, GRAD } from "@/lib/waitlist/tokens";
import { GradientText } from "./Brand";
import { TIERS } from "./FounderPassSection";
import { MobileDashboardPhone } from "./MobileDashboardPhone";

const UI = {
  shell: "#f7f9fc",
  panel: "#ffffff",
  panelSoft: "#f2f5f9",
  panelWarm: "#fbf7ff",
  ink: "#101828",
  muted: "#667085",
  faint: "#98a2b3",
  line: "#e4e7ec",
  lineStrong: "#d0d5dd",
  violet: "#6d5dfc",
  cyan: "#0891b2",
  green: "#12b76a",
  amber: "#f79009",
  rose: "#e31b54",
} as const;

function useCountUp(target: number, active: boolean, duration = 1100) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return value;
}

function useFounderPassStatus(active: boolean) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setI((n) => (n + 1) % 3), 2600);
    return () => clearInterval(t);
  }, [active]);
  return ["Eligible", "Reviewing", "Invited"][i];
}

function WebcoinGlyph() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect width="32" height="32" rx="9" fill="#101828" />
      <path
        d="M7.1 8.6h3.4l1.5 12.2 2.1-8.5h3.8l2.1 8.5 1.5-12.2h3.4l-2.5 16H18l-2-8.6-2 8.6H9.6l-2.5-16Z"
        fill="url(#dashboardWcl)"
      />
      <circle cx="16.2" cy="6.6" r="1.8" fill="#ffffff" />
      <circle cx="20.8" cy="6" r="1.05" fill="#22d3ee" />
      <defs>
        <linearGradient id="dashboardWcl" x1="7.1" y1="16.6" x2="24.9" y2="16.6" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22d3ee" />
          <stop offset="0.58" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#f5f5f7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ChromeBar() {
  return (
    <div className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: UI.line, backgroundColor: "#fbfcfe" }}>
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#ff5f57" }} />
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#febc2e" }} />
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#28c840" }} />
      <div className="ml-3 flex h-6 flex-1 items-center rounded-full border px-3 text-[11px]" style={{ borderColor: UI.line, color: UI.muted, backgroundColor: UI.panel }}>
        app.webcoinlabs.com/dashboard
      </div>
    </div>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[12px] font-semibold transition-colors hover:bg-[#eef2ff]"
      style={{
        color: active ? UI.ink : UI.muted,
        backgroundColor: active ? "#eef2ff" : "transparent",
      }}
    >
      <Icon className="h-4 w-4" style={{ color: active ? UI.violet : UI.faint }} />
      <span>{label}</span>
    </button>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  note,
  tone,
  pill,
  pillFg = UI.green,
  pillBg = "#ecfdf3",
}: {
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  label: string;
  value: ReactNode;
  note: string;
  tone: string;
  pill?: string;
  pillFg?: string;
  pillBg?: string;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border p-4" style={{ borderColor: UI.line, backgroundColor: UI.panel }}>
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl" style={{ color: tone, backgroundColor: `${tone}14` }}>
          <Icon className="h-5 w-5" />
        </span>
        {pill ? (
          <span className="rounded-full px-2 py-1 text-[10px] font-semibold" style={{ color: pillFg, backgroundColor: pillBg }}>
            {pill}
          </span>
        ) : null}
      </div>
      <p className="mt-3.5 text-[11px] font-semibold uppercase tracking-[0.13em]" style={{ color: UI.faint }}>
        {label}
      </p>
      <div className="mt-1 text-[24px] font-bold leading-tight tracking-tight" style={{ color: UI.ink }}>
        {value}
      </div>
      <p className="mt-auto pt-1 text-[12px]" style={{ color: UI.muted }}>
        {note}
      </p>
    </div>
  );
}

const DASHBOARD_NETWORKS = [
  { name: "Arc", logo: "/logo/Arc_Logo_NavyGradient.svg", status: "Available", live: true },
  { name: "Base", logo: "/logo/baselogoblackcolor.svg", status: "Available", live: true },
  { name: "Solana", logo: "/logo/Solana%20(SOL).svg", status: "Soon", live: false },
] as const;

function NetworksCard() {
  return (
    <div className="flex h-full flex-col rounded-2xl border p-4" style={{ borderColor: UI.line, backgroundColor: UI.panel }}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.13em]" style={{ color: UI.faint }}>
          Networks
        </p>
        <Globe2 className="h-4 w-4" style={{ color: UI.violet }} />
      </div>
      <div className="mt-3 grid gap-2">
        {DASHBOARD_NETWORKS.map((n) => (
          <div
            key={n.name}
            className="flex items-center justify-between gap-2 rounded-xl border px-2.5 py-2"
            style={{ borderColor: UI.line, backgroundColor: UI.panelSoft }}
          >
            <img src={n.logo} alt={n.name} className="h-4 w-auto max-w-[72px] object-contain" />
            <span className="flex shrink-0 items-center gap-1.5 text-[10px] font-semibold" style={{ color: n.live ? UI.green : UI.faint }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: n.live ? UI.green : UI.lineStrong }} />
              {n.status}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-auto pt-2 text-[11px]" style={{ color: UI.muted }}>
        Builder Pass beta lanes
      </p>
    </div>
  );
}

function StatusPill({ children, tone = "violet" }: { children: ReactNode; tone?: "violet" | "green" | "amber" | "cyan" }) {
  const colors = {
    violet: { fg: UI.violet, bg: "#f0efff" },
    green: { fg: UI.green, bg: "#ecfdf3" },
    amber: { fg: UI.amber, bg: "#fff8eb" },
    cyan: { fg: UI.cyan, bg: "#ecfeff" },
  }[tone];

  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ color: colors.fg, backgroundColor: colors.bg }}>
      {children}
    </span>
  );
}

function QueueRow({
  name,
  meta,
  status,
  tone,
}: {
  name: string;
  meta: string;
  status: string;
  tone: "violet" | "green" | "amber" | "cyan";
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t py-3 first:border-t-0" style={{ borderColor: UI.line }}>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold" style={{ color: UI.ink }}>
          {name}
        </p>
        <p className="mt-0.5 truncate text-[12px]" style={{ color: UI.muted }}>
          {meta}
        </p>
      </div>
      <StatusPill tone={tone}>{status}</StatusPill>
    </div>
  );
}

function ActivityItem({ icon: Icon, title, time, tone }: { icon: ComponentType<{ className?: string; style?: CSSProperties }>; title: string; time: string; tone: string }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ color: tone, backgroundColor: `${tone}14` }}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[12.5px] font-semibold leading-5" style={{ color: UI.ink }}>
          {title}
        </p>
        <p className="text-[11px]" style={{ color: UI.faint }}>
          {time}
        </p>
      </div>
    </div>
  );
}

// Hub coords are % positions on the real world map asset (public/maps/simplemaps-world.svg,
// viewBox 0 0 2000 857) so the container's aspectRatio below is locked to match — no letterboxing,
// no drift between dot position and the landmass under it.
// Coordinates checked against the asset's own path data (country bounding-box centers extracted
// directly from the SVG) rather than assumed — e.g. Nigeria/Kenya/Brazil/UK/US/Japan/Australia
// centroids were computed from the file itself, not eyeballed.
const MAP_HUBS = [
  { x: 16.5, y: 31.0, tone: UI.violet }, // San Francisco (US west coast)
  { x: 29.0, y: 29.5, tone: UI.violet }, // New York (US east coast)
  { x: 34.0, y: 69.2, tone: UI.cyan }, // Brazil
  { x: 49.5, y: 20.0, tone: UI.cyan }, // London
  { x: 51.8, y: 51.8, tone: UI.amber }, // Nigeria
  { x: 60.1, y: 58.2, tone: UI.violet }, // Kenya
  { x: 72.0, y: 44.0, tone: UI.amber }, // India
  { x: 79.0, y: 56.0, tone: UI.amber }, // Singapore
  { x: 87.5, y: 32.5, tone: UI.violet }, // Japan
  { x: 88.5, y: 78.0, tone: UI.cyan }, // Australia
] as const;

const MAP_ARCS = [
  { d: "M16.5 31 C28 20, 40 18, 49.5 20", tone: UI.violet },
  { d: "M49.5 20 C58 30, 65 40, 72 44", tone: UI.cyan },
  { d: "M34 69.2 C42 64, 52 60, 60.1 58.2", tone: UI.amber },
  { d: "M79 56 C82 48, 85 40, 87.5 32.5", tone: UI.violet },
] as const;

const REGIONS = [
  { label: "North America", count: "1,248", tone: UI.violet },
  { label: "Europe", count: "982", tone: UI.cyan },
  { label: "Asia", count: "1,105", tone: UI.amber },
  { label: "Others", count: "673", tone: UI.faint },
] as const;

function GlobalNetworkPanel() {
  const reduce = useReducedMotion();
  return (
    <section className="rounded-2xl border p-6" style={{ borderColor: UI.line, backgroundColor: UI.panel }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[15px] font-bold" style={{ color: UI.ink }}>
            Global founder network
          </p>
          <p className="text-[12px]" style={{ color: UI.muted }}>
            Members across 33+ countries
          </p>
        </div>
        <ArrowUpRight className="h-4 w-4" style={{ color: UI.faint }} />
      </div>

      <div className="mt-5 grid gap-6 md:grid-cols-[minmax(0,1.65fr)_minmax(0,0.9fr)]">
        <div
          className="relative overflow-hidden rounded-xl border"
          style={{
            borderColor: "#e8ebf2",
            background:
              "radial-gradient(circle at 24% 38%, rgba(109,93,252,0.1), transparent 26%), radial-gradient(circle at 72% 42%, rgba(8,145,178,0.08), transparent 30%), #fbfcff",
            aspectRatio: "2000 / 857",
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: "linear-gradient(120deg, rgba(109,93,252,0.18), rgba(8,145,178,0.13))",
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
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, #aab1c4 1px, transparent 1.5px)",
              backgroundSize: "7px 7px",
              opacity: 0.75,
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

          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
            <g opacity="0.4">
              {MAP_ARCS.map((arc, i) => (
                <path key={i} d={arc.d} fill="none" stroke={arc.tone} strokeWidth="0.35" strokeDasharray="1.4 1.6" />
              ))}
            </g>
          </svg>

          {MAP_HUBS.map((hub, i) => (
            <span
              key={`${hub.x}-${hub.y}`}
              className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${hub.x}%`, top: `${hub.y}%` }}
            >
              {!reduce ? (
                <motion.span
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: hub.tone }}
                  animate={{ scale: [1, 2.8, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
                />
              ) : null}
              <span className="absolute inset-0 rounded-full" style={{ backgroundColor: hub.tone, boxShadow: `0 0 6px ${hub.tone}` }} />
            </span>
          ))}
        </div>

        <div className="grid content-center gap-3.5">
          <div className="rounded-2xl p-4" style={{ backgroundColor: "#0f172a", color: "#fff" }}>
            <p className="text-[20px] font-bold tracking-tight">Growing</p>
            <p className="mt-1 text-[11px]" style={{ color: "#cbd5e1" }}>
              Founder, builder, investor, and advisor graph.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <img src="/logo/circle-logo-ondark.svg" alt="Arc" className="h-4 w-auto object-contain" />
            </div>
          </div>
          {REGIONS.map((r) => (
            <div key={r.label} className="flex items-center justify-between gap-3 text-[13px]">
              <span className="flex items-center gap-2" style={{ color: UI.muted }}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.tone }} />
                {r.label}
              </span>
              <span className="font-semibold tabular-nums" style={{ color: UI.ink }}>
                {r.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NetworkOverview() {
  return (
    <div className="grid gap-4">
      <section className="rounded-2xl border p-4" style={{ borderColor: UI.line, backgroundColor: UI.panel }}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[15px] font-bold" style={{ color: UI.ink }}>
              Your network
            </p>
            <p className="text-[12px]" style={{ color: UI.muted }}>
              Founders, builders, investors, and advisors in your graph.
            </p>
          </div>
          <Globe2 className="h-4 w-4" style={{ color: UI.violet }} />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <MetricCard icon={Users} label="Connections" value="46" note="Across 4 roles" tone={UI.violet} />
          <MetricCard icon={MessageSquare} label="Requests" value="5" note="Awaiting reply" tone={UI.cyan} />
          <MetricCard icon={Trophy} label="Reach rank" value="Top 4%" note="This week" tone={UI.amber} />
        </div>
      </section>

      <section className="rounded-2xl border p-4" style={{ borderColor: UI.line, backgroundColor: UI.panel }}>
        <p className="text-[15px] font-bold" style={{ color: UI.ink }}>
          Connection requests
        </p>
        <p className="text-[12px]" style={{ color: UI.muted }}>
          People in your extended founder network.
        </p>
        <div className="mt-4 overflow-hidden rounded-2xl border" style={{ borderColor: UI.line }}>
          <QueueRow name="Priya S. — Fintech founder" meta="Mutual: 2 advisors" status="Connect" tone="violet" />
          <QueueRow name="Diego R. — Arc builder" meta="Mutual: Builder peer room" status="Connect" tone="cyan" />
          <QueueRow name="Amara K. — Seed investor" meta="Mutual: Seed investor intro" status="Pending" tone="amber" />
        </div>
      </section>
    </div>
  );
}

function FounderPassPreview() {
  return (
    <div className="grid gap-4">
      <section className="rounded-2xl border p-6" style={{ borderColor: UI.line, background: "linear-gradient(180deg, #ffffff, #fbf7ff)" }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[15px] font-bold" style={{ color: UI.ink }}>
              Builder Pass eligibility
            </p>
            <p className="mt-1 text-[12px]" style={{ color: UI.muted }}>
              Builder Pass credential for builders shipping on Arc and Base.
            </p>
          </div>
          <StatusPill tone="cyan">Eligible</StatusPill>
        </div>

        <div className="mt-5 grid grid-cols-5 gap-2">
          {TIERS.map((tier) => (
            <div
              key={tier.label}
              className="flex flex-col items-center justify-center rounded-2xl border px-2 py-3"
              style={{
                borderColor: tier.label === "Gold" ? "#c4b5fd" : UI.line,
                backgroundColor: tier.label === "Gold" ? "#f0efff" : UI.panelSoft,
              }}
            >
              <img src={tier.src} alt={tier.label} className="h-12 w-12 object-contain" />
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px]" style={{ color: UI.faint }}>
          Tier depends on verified builder proof, contracts interacted, launch quality, GitHub activity, and ecosystem contribution.
        </p>

        <a
          href="#join-form"
          className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13px] font-semibold"
          style={{ backgroundColor: UI.ink, color: "#fff" }}
        >
          Check Builder Pass
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </section>

      <section className="rounded-2xl border p-4" style={{ borderColor: UI.line, backgroundColor: UI.panel }}>
        <p className="text-[15px] font-bold" style={{ color: UI.ink }}>
          Beta tracks
        </p>
        <p className="mt-1 text-[12px]" style={{ color: UI.muted }}>
          Available now for Arc and Base. More tracks coming soon.
        </p>
      </section>
    </div>
  );
}

function DemoStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border px-3 py-3" style={{ borderColor: UI.line, backgroundColor: UI.panelSoft }}>
      <span className="text-[12px] font-medium" style={{ color: UI.muted }}>{label}</span>
      <span className="text-[13px] font-bold tabular-nums" style={{ color: UI.ink }}>{value}</span>
    </div>
  );
}

function IntroductionsOverview() {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
      <section className="rounded-2xl border p-4" style={{ borderColor: UI.line, backgroundColor: UI.panel }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[15px] font-bold" style={{ color: UI.ink }}>Introduction pipeline</p>
            <p className="text-[12px]" style={{ color: UI.muted }}>Curated investors, advisors, and operator requests.</p>
          </div>
          <StatusPill tone="violet">4 active</StatusPill>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border" style={{ borderColor: UI.line }}>
          <QueueRow name="Seed investor intro" meta="Fintech, infra, consumer networks" status="Queued" tone="violet" />
          <QueueRow name="Advisor match" meta="Go-to-market and founder storytelling" status="Ready" tone="green" />
          <QueueRow name="Builder peer room" meta="Arc ecosystem founders" status="Live" tone="cyan" />
          <QueueRow name="Pitch review" meta="Deck, profile, proof points" status="Draft" tone="amber" />
        </div>
      </section>

      <section className="rounded-2xl border p-4" style={{ borderColor: UI.line, backgroundColor: UI.panel }}>
        <p className="text-[15px] font-bold" style={{ color: UI.ink }}>Request health</p>
        <p className="text-[12px]" style={{ color: UI.muted }}>Your current introduction activity.</p>
        <div className="mt-4 grid gap-2">
          <DemoStat label="Ready to send" value="2" />
          <DemoStat label="Awaiting reply" value="1" />
          <DemoStat label="Completed" value="6" />
        </div>
      </section>
    </div>
  );
}

function ProfileOverview() {
  const proof = [
    ["Founder role", "Verified", UI.green],
    ["Pitch summary", "Uploaded", UI.violet],
    ["Builder proof", "Connected", UI.cyan],
    ["Advisor notes", "Pending", UI.amber],
  ] as const;

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.7fr)]">
      <section className="rounded-2xl border p-5" style={{ borderColor: UI.line, backgroundColor: UI.panel }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[15px] font-bold" style={{ color: UI.ink }}>Founder profile</p>
            <p className="text-[12px]" style={{ color: UI.muted }}>Proof score and launch readiness.</p>
          </div>
          <StatusPill tone="green">82% ready</StatusPill>
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {proof.map(([label, value, tone]) => (
            <div key={label} className="flex items-center justify-between gap-3 rounded-xl border px-3 py-3" style={{ borderColor: UI.line, backgroundColor: UI.panelSoft }}>
              <span className="text-[12px] font-medium" style={{ color: UI.muted }}>{label}</span>
              <span className="text-[11px] font-semibold" style={{ color: tone }}>{value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border p-5" style={{ borderColor: UI.line, backgroundColor: UI.panel }}>
        <p className="text-[15px] font-bold" style={{ color: UI.ink }}>Next profile action</p>
        <p className="mt-1 text-pretty text-[12px] leading-5" style={{ color: UI.muted }}>Add advisor context to improve matching and introduction quality.</p>
        <div className="mt-5 h-2 overflow-hidden rounded-full" style={{ backgroundColor: UI.panelSoft }}>
          <div className="h-full w-[82%] rounded-full" style={{ backgroundColor: UI.violet }} />
        </div>
        <a href="#join-form" className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[12px] font-semibold" style={{ backgroundColor: UI.ink, color: "#fff" }}>
          Complete your profile
          <ArrowUpRight className="size-3.5" />
        </a>
      </section>
    </div>
  );
}

const NAV_COPY: Record<string, { eyebrow: string; title: string }> = {
  Overview: { eyebrow: "Command Center", title: "Good morning, Founder" },
  Network: { eyebrow: "Network", title: "Your founder network" },
  Introductions: { eyebrow: "Introductions", title: "Warm intro pipeline" },
  "Builder Pass": { eyebrow: "Builder Pass", title: "Builder Pass eligibility" },
  Profile: { eyebrow: "Founder profile", title: "Proof and readiness" },
};

const DASHBOARD_NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview" },
  { icon: Users, label: "Network" },
  { icon: MessageSquare, label: "Introductions" },
  { icon: IdCard, label: "Builder Pass" },
  { icon: FileText, label: "Profile" },
] as const;

export function DashboardPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const reduce = useReducedMotion();

  const xp = useCountUp(100, inView && !reduce);
  const referrals = useCountUp(3, inView && !reduce, 900);
  const founderPassStatus = useFounderPassStatus(inView && !reduce);
  const [activeNav, setActiveNav] = useState("Overview");
  const [showNotifications, setShowNotifications] = useState(false);

  const selectNav = (label: string) => {
    setActiveNav(label);
    setShowNotifications(false);
  };

  return (
    <section className="relative py-12 sm:py-16 lg:py-24" style={{ backgroundColor: COLORS.bg }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px]"
        style={{ background: "radial-gradient(620px 320px at 50% 0%, rgba(124,58,237,0.14), transparent 60%)" }}
      />

      <div className="container relative mx-auto max-w-7xl px-6">
        {/* headline row — landscape layout, dashboard gets full width below */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{ borderColor: COLORS.border, color: COLORS.accent, backgroundColor: "#fff" }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: COLORS.accent }} />
              Preview
            </span>
            <h2 className="mt-4 text-balance text-[1.9rem] font-bold leading-[1.12] tracking-tight sm:mt-5 sm:text-[2.15rem] sm:leading-[1.18]" style={{ color: COLORS.text }}>
              See how <GradientText>Webcoin Labs</GradientText> dashboards will work.
            </h2>
            <p className="mt-2 max-w-2xl text-pretty text-[14px] leading-6 sm:text-[16px] sm:leading-7" style={{ color: COLORS.textSecondary }}>
              Explore a sample founder dashboard and select any section to preview the experience.
            </p>
          </div>
          <a
            href="#join"
            className="inline-flex items-center rounded-full px-5 py-2.5 text-[13px] font-semibold transition-transform hover:-translate-y-0.5 max-sm:w-full max-sm:justify-center sm:text-[13.5px]"
            style={{ backgroundColor: COLORS.text, color: "#fff" }}
          >
            Explore the dashboard
          </a>
        </div>

        <div className="mt-8 lg:hidden">
          <MobileDashboardPhone />
        </div>

        {/* full-width landscape mockup */}
        <div ref={ref} className="relative mt-10 hidden lg:block">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 rounded-[38px]"
              style={{
                background: "linear-gradient(120deg, rgba(167,139,250,0.18), rgba(34,211,238,0.13) 58%, transparent)",
                filter: "blur(30px)",
              }}
            />

            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-[28px] border"
              style={{
                borderColor: "rgba(255,255,255,0.22)",
                backgroundColor: UI.shell,
                boxShadow: "0 42px 110px -48px rgba(15,23,42,0.85), 0 0 0 1px rgba(255,255,255,0.24)",
              }}
            >
              <ChromeBar />

              <div className="grid lg:grid-cols-[220px_minmax(0,1fr)]">
                <aside className="hidden border-r p-4 lg:block" style={{ borderColor: UI.line, backgroundColor: "#ffffff" }}>
                  <div className="flex items-center gap-3">
                    <WebcoinGlyph />
                    <div>
                      <p className="text-[13px] font-bold leading-4" style={{ color: UI.ink }}>
                        Webcoin Labs
                      </p>
                      <p className="text-[11px]" style={{ color: UI.faint }}>
                        Founder OS
                      </p>
                    </div>
                  </div>

                  <nav className="mt-7 grid gap-1">
                    {DASHBOARD_NAV_ITEMS.map((item) => (
                      <SidebarItem
                        key={item.label}
                        icon={item.icon}
                        label={item.label}
                        active={activeNav === item.label}
                        onClick={() => selectNav(item.label)}
                      />
                    ))}
                  </nav>

                  <div className="mt-8 rounded-2xl border p-3" style={{ borderColor: UI.line, backgroundColor: UI.panelSoft }}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: UI.faint }}>
                      Access tier
                    </p>
                    <p className="mt-2 text-[22px] font-bold" style={{ color: UI.ink }}>
                      Builder
                    </p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: "#e9eef5" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: GRAD.brand }}
                        initial={{ width: "18%" }}
                        whileInView={{ width: "72%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
                      />
                    </div>
                    <p className="mt-2 text-[11px]" style={{ color: UI.muted }}>
                      2 actions from priority review.
                    </p>
                  </div>
                </aside>

                <div>
                  <header className="relative flex flex-wrap items-center gap-3 border-b px-5 py-4" style={{ borderColor: UI.line, backgroundColor: UI.panel }}>
                    <div>
                      <p className="text-[12px] font-semibold" style={{ color: UI.muted }}>
                        {(NAV_COPY[activeNav] ?? NAV_COPY.Overview).eyebrow}
                      </p>
                      <h3 className="text-[22px] font-bold tracking-tight" style={{ color: UI.ink }}>
                        {(NAV_COPY[activeNav] ?? NAV_COPY.Overview).title}
                      </h3>
                    </div>
                    <div className="ml-auto hidden min-w-[260px] items-center gap-2 rounded-full border px-3 py-2 lg:flex" style={{ borderColor: UI.line, backgroundColor: UI.panelSoft, color: UI.faint }}>
                      <Search className="h-4 w-4" />
                      <span className="text-[12px]">Search intros, referrals, docs</span>
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowNotifications((value) => !value)}
                        aria-label="Notifications"
                        aria-expanded={showNotifications}
                        aria-controls="dashboard-notifications"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border"
                        style={{ borderColor: UI.line, color: UI.muted, backgroundColor: UI.panel }}
                      >
                        <Bell className="h-4 w-4" />
                      </button>
                      {showNotifications ? (
                        <div id="dashboard-notifications" className="absolute right-0 top-12 z-20 w-72 rounded-2xl border bg-white p-3 shadow-lg" style={{ borderColor: UI.line }}>
                          <p className="px-2 py-1 text-[11px] font-semibold uppercase" style={{ color: UI.faint }}>Notifications</p>
                          {[
                            ["Referral verified", "+50 Credits added", UI.green],
                            ["Builder Pass", "Eligibility review opened", UI.cyan],
                            ["Pitch review", "Advisor notes are ready", UI.violet],
                          ].map(([title, detail, tone]) => (
                            <div key={title} className="flex gap-2.5 border-t px-2 py-2.5 first:border-t-0" style={{ borderColor: UI.line }}>
                              <span className="mt-1 size-2 shrink-0 rounded-full" style={{ backgroundColor: tone }} />
                              <span>
                                <span className="block text-[11px] font-semibold" style={{ color: UI.ink }}>{title}</span>
                                <span className="mt-0.5 block text-[10px]" style={{ color: UI.muted }}>{detail}</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2 rounded-full border py-1 pl-1 pr-3" style={{ borderColor: UI.line, backgroundColor: UI.panelSoft }}>
                      <span className="inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full" style={{ background: GRAD.brand }}>
                        <img src="/logo/solrishuavatar.png" alt="Founder" className="h-full w-full object-cover" />
                      </span>
                      <span className="text-[12px] font-semibold" style={{ color: UI.ink }}>
                        Verified Founder
                      </span>
                    </div>
                  </header>

                  <nav className="flex gap-1 overflow-x-auto border-b px-4 py-2 lg:hidden" style={{ borderColor: UI.line, backgroundColor: UI.panel }} aria-label="Dashboard sections">
                    {DASHBOARD_NAV_ITEMS.map((item) => {
                      const active = activeNav === item.label;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => selectNav(item.label)}
                          aria-current={active ? "page" : undefined}
                          className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6d5dfc]"
                          style={{ color: active ? UI.violet : UI.muted, backgroundColor: active ? "#f0efff" : "transparent" }}
                        >
                          <Icon className="size-3.5" style={{ color: active ? UI.violet : UI.faint }} />
                          {item.label}
                        </button>
                      );
                    })}
                  </nav>

                  <main className="p-5">
                    <div className="grid gap-4">
                      {activeNav === "Network" ? (
                        <NetworkOverview />
                      ) : activeNav === "Introductions" ? (
                        <IntroductionsOverview />
                      ) : activeNav === "Builder Pass" ? (
                        <FounderPassPreview />
                      ) : activeNav === "Profile" ? (
                        <ProfileOverview />
                      ) : (
                        <>
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.25fr)]">
                        <MetricCard icon={Gauge} label="Credits" value={<span className="tabular-nums">{xp}</span>} note="Launch boost active" tone={UI.violet} pill="Live" />
                        <MetricCard icon={ListOrdered} label="Waitlist rank" value="#128" note="This week" tone={UI.amber} pill="Top 4%" pillFg={UI.amber} pillBg="#fff8eb" />
                        <MetricCard icon={UserPlus} label="Referrals" value={<span className="tabular-nums">{referrals}</span>} note="Verified count" tone={UI.green} pill="+1 today" pillFg={UI.cyan} pillBg="#ecfeff" />
                        <MetricCard icon={Fingerprint} label="Builder Pass" value={founderPassStatus} note="Eligibility review" tone={UI.cyan} pill="Beta" pillFg={UI.violet} pillBg="#f0efff" />
                        <NetworksCard />
                      </div>

                      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.95fr)_minmax(0,0.85fr)]">
                        <section className="rounded-2xl border p-4" style={{ borderColor: UI.line, backgroundColor: UI.panel }}>
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-[15px] font-bold" style={{ color: UI.ink }}>
                                Introduction pipeline
                              </p>
                              <p className="text-[12px]" style={{ color: UI.muted }}>
                                Curated investors, advisors, and operator requests.
                              </p>
                            </div>
                            <button type="button" onClick={() => selectNav("Introductions")} className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-[12px] font-semibold" style={{ color: UI.violet, backgroundColor: "#f0efff" }}>
                              View all <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="mt-4 overflow-hidden rounded-2xl border" style={{ borderColor: UI.line }}>
                            <QueueRow name="Seed investor intro" meta="Fintech, infra, consumer networks" status="Queued" tone="violet" />
                            <QueueRow name="Advisor match" meta="Go-to-market and founder storytelling" status="Ready" tone="green" />
                            <QueueRow name="Builder peer room" meta="Arc ecosystem founders" status="Live" tone="cyan" />
                            <QueueRow name="Pitch review" meta="Deck, profile, proof points" status="Draft" tone="amber" />
                          </div>
                        </section>

                        <section className="rounded-2xl border p-4" style={{ borderColor: UI.line, background: "linear-gradient(180deg, #ffffff, #fbf7ff)" }}>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[15px] font-bold" style={{ color: UI.ink }}>
                                Founder profile
                              </p>
                              <p className="text-[12px]" style={{ color: UI.muted }}>
                                Proof score and readiness
                              </p>
                            </div>
                            <StatusPill tone="green">82%</StatusPill>
                          </div>

                          <div className="mt-5 flex items-end gap-3">
                            {[46, 72, 58, 88, 68, 82].map((h, i) => (
                              <motion.span
                                key={i}
                                className="flex-1 rounded-t-xl"
                                style={{ height: 104, backgroundColor: "#edf0f7" }}
                              >
                                <motion.span
                                  className="block rounded-t-xl"
                                  style={{ height: `${h}%`, background: i === 3 ? GRAD.brand : "#d9def0" }}
                                  initial={{ height: "10%" }}
                                  whileInView={{ height: `${h}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.7, delay: 0.12 + i * 0.05, ease: EASE }}
                                />
                              </motion.span>
                            ))}
                          </div>

                          <div className="mt-5 grid gap-2">
                            <div className="flex items-center gap-2 text-[12px]" style={{ color: UI.muted }}>
                              <CheckCircle2 className="h-4 w-4" style={{ color: UI.green }} />
                              Pitch summary uploaded
                            </div>
                            <div className="flex items-center gap-2 text-[12px]" style={{ color: UI.muted }}>
                              <CheckCircle2 className="h-4 w-4" style={{ color: UI.green }} />
                              Founder role verified
                            </div>
                            <div className="flex items-center gap-2 text-[12px]" style={{ color: UI.muted }}>
                              <Clock3 className="h-4 w-4" style={{ color: UI.amber }} />
                              Advisor notes pending
                            </div>
                          </div>
                        </section>

                        <section className="rounded-2xl border p-4" style={{ borderColor: UI.line, backgroundColor: UI.panel }}>
                          <div className="flex items-center justify-between">
                            <p className="text-[15px] font-bold" style={{ color: UI.ink }}>
                              Activity
                            </p>
                            <ArrowUpRight className="h-4 w-4" style={{ color: UI.faint }} />
                          </div>
                          <div className="mt-4 grid gap-4">
                            <ActivityItem icon={UserCheck} title="Referral verified" time="2 min ago" tone={UI.green} />
                            <ActivityItem icon={TrendingUp} title="Credits launch boost added" time="12 min ago" tone={UI.violet} />
                            <ActivityItem icon={Send} title="Investor intro request queued" time="Today" tone={UI.cyan} />
                            <ActivityItem icon={Route} title="Arc builder lane opened" time="Today" tone={UI.amber} />
                          </div>
                        </section>
                      </div>

                      <GlobalNetworkPanel />
                        </>
                      )}
                    </div>
                  </main>
                </div>
              </div>
            </motion.div>

            <p className="mt-4 text-center text-[11px] leading-5" style={{ color: COLORS.textFaint }}>
              Demo dashboard. The layout, content, and features are illustrative and subject to change. Live numbers appear after verification.
            </p>
        </div>
      </div>
    </section>
  );
}
