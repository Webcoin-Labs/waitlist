"use client";

import { useEffect, useState, type ComponentType, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  BarChart3,
  ChevronRight,
  Compass,
  Crown,
  FileText,
  Gauge,
  Globe2,
  Hammer,
  IdCard,
  LayoutDashboard,
  Lock,
  Network,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { COLORS, EASE, GRAD } from "@/lib/waitlist/tokens";

function LogoImgIcon(src: string) {
  return function LogoIcon({ className, style }: { className?: string; style?: CSSProperties }) {
    return <img src={src} alt="" className={className} style={{ ...style, objectFit: "contain" }} />;
  };
}

const ArcLogoIcon = LogoImgIcon("/logo/Arc_network-A.svg");
const SolanaLogoIcon = LogoImgIcon("/logo/solana-s-LogoMark.svg");
const ZamaLogoIcon = LogoImgIcon("/logo/zama-z-square_yellow.svg");
const BitcoinLogoIcon = LogoImgIcon("/logo/Bitcoin.svg");

// Positions were swapped per request: Credits<->Zama, Founder Access<->Bitcoin,
// Builder Access<->Arc, then Arc<->Solana — each chip keeps its own icon/tone/tilt,
// only the left/top slot changed.
const TOP_CHIPS = [
  { label: "Credits", icon: Zap, left: "95%", top: "46%", tone: "#8b5cf6", tilt: -4 },
  { label: "Founder Access", icon: Crown, left: "6%", top: "72%", tone: "#c084fc", tilt: 3 },
  { label: "Builder Access", icon: Hammer, left: "84%", top: "-10%", tone: "#38bdf8", tilt: -3 },
  { label: "Arc", icon: ArcLogoIcon, left: "16%", top: "38%", tone: "#f59e0b", tilt: 4 },
  { label: "Solana", icon: SolanaLogoIcon, left: "63%", top: "-7%", tone: "#9945FF", tilt: 5 },
  { label: "Zama", icon: ZamaLogoIcon, left: "10%", top: "-8%", tone: "#fdd10b", tilt: -4 },
  { label: "Bitcoin", icon: BitcoinLogoIcon, left: "38%", top: "-12%", tone: "#f7931a", tilt: -3 },
] as const;

type DashboardIcon = typeof Activity;
type ModuleItem = {
  label: string;
  value: string;
  icon: DashboardIcon;
  tone: string;
  foot?: string;
};
type NavItem = {
  label: string;
  icon: DashboardIcon;
  active?: boolean;
};

const MODULES: ModuleItem[] = [
  { label: "Founder Tools", value: "8 tools active", icon: Compass, tone: "#8b5cf6" },
  { label: "Pitch Deck Score", value: "82 /100", icon: FileText, tone: "#22d3ee", foot: "Strong" },
  { label: "Tokenomics Studio", value: "Review in progress", icon: BarChart3, tone: "#c084fc" },
  { label: "Investor Intros", value: "3 requests sent", icon: Network, tone: "#34d399" },
  { label: "Builder Access", value: "12 new builders", icon: Users, tone: "#38bdf8" },
  { label: "Credits", value: "320 XP", icon: Gauge, tone: "#a78bfa", foot: "+100 pending" },
] as const;

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Founder Tools", icon: Compass },
  { label: "Builder Access", icon: Users },
  { label: "Intros", icon: Network },
  { label: "Credits", icon: Activity },
  { label: "Builder Pass", icon: IdCard },
] as const;

function useLoadingPercent(reduce: boolean | null) {
  const [percent, setPercent] = useState(reduce ? 100 : 0);

  useEffect(() => {
    if (reduce) {
      setPercent(100);
      return;
    }

    let value = 0;
    let holding = false;
    let resetTimer: number | null = null;
    const tick = window.setInterval(() => {
      if (holding) return;
      value += value < 70 ? 4 : value < 92 ? 2 : 1;
      if (value >= 100) {
        value = 100;
        holding = true;
        resetTimer = window.setTimeout(() => {
          value = 0;
          holding = false;
          setPercent(0);
        }, 1150);
      }
      setPercent(value);
    }, 58);

    return () => {
      window.clearInterval(tick);
      if (resetTimer) window.clearTimeout(resetTimer);
    };
  }, [reduce]);

  return percent;
}

function Chip({
  label,
  icon: Icon,
  tone,
}: {
  label: string;
  icon?: ComponentType<{ className?: string; style?: CSSProperties }>;
  tone: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border py-1.5 pl-1.5 pr-3.5 text-[10px] font-bold"
      style={{
        borderColor: "rgba(255,255,255,0.14)",
        backgroundColor: "rgba(15,18,34,0.88)",
        color: COLORS.darkText,
        boxShadow: `0 12px 28px -10px ${tone}59, 0 6px 16px rgba(0,0,0,0.32)`,
      }}
    >
      {Icon ? (
        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full" style={{ backgroundColor: `${tone}26` }}>
          <Icon className="h-3 w-3" style={{ color: tone }} />
        </span>
      ) : null}
      {label}
    </span>
  );
}

function MetricTile({ item }: { item: ModuleItem }) {
  const Icon = item.icon;
  if (item.label === "Pitch Deck Score") {
    return (
      <div
        className="group rounded-xl border px-3.5 py-3 transition-transform duration-300 hover:-translate-y-0.5"
        style={{
          borderColor: "rgba(34,211,238,0.14)",
          background: "linear-gradient(155deg, rgba(34,211,238,0.075), rgba(255,255,255,0.03) 54%, rgba(124,58,237,0.04))",
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <span className="max-w-[76px] text-[10.5px] font-bold leading-tight" style={{ color: COLORS.darkText }}>
            Pitch Deck Score
          </span>
          <FileText className="h-3.5 w-3.5" style={{ color: item.tone }} />
        </div>
        <div className="mt-2 flex items-end gap-1.5">
          <span className="text-[27px] font-black leading-none tabular-nums" style={{ color: COLORS.darkText }}>
            82
          </span>
          <span className="pb-1 text-[10px] font-semibold" style={{ color: COLORS.darkTextSecondary }}>
            /100
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #22d3ee, #34d399)" }}
            initial={{ width: "0%" }}
            animate={{ width: "82%" }}
            transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
          />
        </div>
        <p className="mt-1.5 text-[9.5px] font-semibold" style={{ color: "#34d399" }}>
          Strong narrative
        </p>
      </div>
    );
  }

  return (
    <div
      className="group rounded-xl border px-3.5 py-3 transition-transform duration-300 hover:-translate-y-0.5"
      style={{
        borderColor: "rgba(255,255,255,0.075)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.058), rgba(255,255,255,0.028))",
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10.5px] font-bold" style={{ color: COLORS.darkText }}>
          {item.label}
        </span>
        <Icon className="h-3.5 w-3.5" style={{ color: item.tone }} />
      </div>
      <p className="mt-2 text-[10px]" style={{ color: COLORS.darkTextSecondary }}>
        {item.value}
      </p>
      {item.foot ? (
        <p className="mt-0.5 text-[9.5px] font-semibold" style={{ color: item.tone }}>
          {item.foot}
        </p>
      ) : null}
      <ChevronRight className="ml-auto mt-1 h-3 w-3 opacity-50 transition-transform group-hover:translate-x-0.5" style={{ color: COLORS.darkTextSecondary }} />
    </div>
  );
}

function MiniMap() {
  const points = [
    ["15%", "62%"],
    ["24%", "45%"],
    ["43%", "53%"],
    ["55%", "42%"],
    ["68%", "56%"],
    ["77%", "38%"],
    ["86%", "67%"],
  ];

  return (
    <div
      className="relative h-[116px] overflow-hidden rounded-xl border p-3"
      style={{ borderColor: "rgba(255,255,255,0.075)", backgroundColor: "rgba(4,9,20,0.56)" }}
    >
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-[10.5px] font-bold" style={{ color: COLORS.darkText }}>
            Global Founder Network
          </p>
          <p className="text-[9.5px]" style={{ color: COLORS.darkTextSecondary }}>
            1,250+ founders worldwide
          </p>
        </div>
        <Globe2 className="h-3.5 w-3.5" style={{ color: "#818cf8" }} />
      </div>
      <div className="absolute inset-x-4 bottom-2 h-[66px] overflow-hidden opacity-90">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, rgba(129,140,248,0.2), rgba(56,189,248,0.16))",
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
          className="absolute inset-0 opacity-55"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(129,140,248,0.7) 1px, transparent 1.5px)",
            backgroundSize: "7px 7px",
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
      </div>
      {points.map(([left, top], i) => (
        <motion.span
          key={`${left}-${top}`}
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{ left, top, backgroundColor: i % 2 ? "#a78bfa" : "#38bdf8", boxShadow: "0 0 16px currentColor" }}
          animate={{ opacity: [0.45, 1, 0.45], scale: [1, 1.35, 1] }}
          transition={{ duration: 2.6 + i * 0.15, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function FounderPassWidget() {
  return (
    <div
      className="rounded-xl border p-3"
      style={{
        borderColor: "rgba(245,158,11,0.14)",
        background: "linear-gradient(160deg, rgba(245,158,11,0.07), rgba(255,255,255,0.035) 48%, rgba(124,58,237,0.05))",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10.5px] font-bold" style={{ color: COLORS.darkText }}>
            Builder Pass
          </p>
          <p className="mt-1 text-[9.5px]" style={{ color: COLORS.darkTextSecondary }}>
            Beta eligibility review
          </p>
        </div>
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(245,158,11,0.12)", color: "#fbbf24" }}>
          <IdCard className="h-3.5 w-3.5" />
        </span>
      </div>

      <div
        className="mt-3 overflow-hidden rounded-xl border p-2.5"
        style={{
          borderColor: "rgba(255,255,255,0.1)",
          background: "linear-gradient(135deg, rgba(255,255,255,0.09), rgba(255,255,255,0.025))",
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[8.5px] font-black uppercase tracking-[0.16em]" style={{ color: "#fbbf24" }}>
            Builder Pass
          </span>
          <Lock className="h-3 w-3" style={{ color: COLORS.darkTextMuted }} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          <span className="flex items-center justify-center rounded-md px-1.5 py-1.5" style={{ backgroundColor: "rgba(245,158,11,0.12)" }}>
            <img src="/logo/Arc_Logo_White.svg" alt="Arc" className="h-3 w-auto max-w-full object-contain" />
          </span>
          <span className="flex items-center justify-center rounded-md px-1.5 py-1.5" style={{ backgroundColor: "rgba(59,130,246,0.13)" }}>
            <img src="/logo/Base_lockup_white.svg" alt="Base" className="h-3 w-auto max-w-full object-contain" />
          </span>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-[9px] font-bold" style={{ color: COLORS.darkTextSecondary }}>
        <span>Verify to unlock</span>
        <span style={{ color: "#a78bfa" }}>Pending</span>
      </div>
    </div>
  );
}

function FloatingFounderPassPreview({ reduce }: { reduce: boolean | null }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={reduce ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: [0, -4, 0], scale: 1 }}
      transition={
        reduce
          ? { duration: 0.45, delay: 0.7, ease: EASE }
          : {
              opacity: { duration: 0.45, delay: 0.7, ease: EASE },
              scale: { duration: 0.45, delay: 0.7, ease: EASE },
              y: { duration: 4.8, repeat: Infinity, ease: "easeInOut" },
            }
      }
      className="absolute bottom-[-54px] right-[24px] z-20 w-[304px] overflow-hidden rounded-2xl border p-3.5 shadow-[0_24px_70px_-28px_rgba(15,23,42,0.7)]"
      style={{
        borderColor: "rgba(167,139,250,0.42)",
        background: "linear-gradient(135deg, rgba(9,12,27,0.96), rgba(43,25,83,0.94) 56%, rgba(8,10,20,0.96))",
        boxShadow: "0 0 0 1px rgba(167,139,250,0.12), 0 24px 70px -28px rgba(15,23,42,0.7), 0 0 38px rgba(124,58,237,0.2)",
      }}
    >
      <div aria-hidden className="absolute -right-10 -top-12 h-28 w-28 rounded-full blur-2xl" style={{ backgroundColor: "rgba(124,58,237,0.28)" }} />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[17px] font-black tracking-tight" style={{ color: COLORS.darkText }}>
            Builder Pass
          </p>
        </div>
        <span className="rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.08em]" style={{ borderColor: "rgba(167,139,250,0.28)", backgroundColor: "rgba(167,139,250,0.16)", color: "#ddd6fe" }}>
          Eligible
        </span>
      </div>

      <div className="relative mt-3 grid grid-cols-[56px_1fr] gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "conic-gradient(from 180deg, #22d3ee, #8b5cf6, #f472b6, #22d3ee)" }}>
          <img
            src="/logo/solrishuavatar.png"
            alt="Solrishu"
            className="h-[48px] w-[48px] rounded-full object-cover"
            style={{ backgroundColor: "rgba(10,10,15,0.96)" }}
          />
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.16em]" style={{ color: COLORS.darkTextMuted }}>
              Status
            </p>
            <p className="mt-0.5 text-[10px] font-bold" style={{ color: "#ddd6fe" }}>
              Early Access
            </p>
          </div>
          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.16em]" style={{ color: COLORS.darkTextMuted }}>
              Network
            </p>
            <p className="mt-0.5 text-[10px] font-bold" style={{ color: "#bfdbfe" }}>
              Arc / Base
            </p>
          </div>
          <div className="col-span-2 flex items-center justify-between rounded-xl border px-2.5 py-2" style={{ borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.055)" }}>
            <span className="text-[9.5px] font-bold" style={{ color: COLORS.darkText }}>
              Check Builder Pass eligibility
            </span>
            <IdCard className="h-3.5 w-3.5" style={{ color: "#fbbf24" }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SystemPanel({ percent }: { percent: number }) {
  const ready = percent >= 100;
  const rows = [
    ["Founder tools", ready ? "ready" : "loading"],
    ["Credits", "+100"],
    ["Builder Pass", "eligibility pending"],
    ["Referral rank", "verify to reveal"],
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.65, delay: 0.35, ease: EASE }}
      className="absolute left-[-34px] top-[146px] z-30 w-[224px] rounded-2xl border p-3.5"
      style={{
        borderColor: "rgba(56,189,248,0.18)",
        background: "linear-gradient(160deg, rgba(9,18,31,0.92), rgba(10,20,32,0.82))",
        backdropFilter: "blur(16px)",
        boxShadow: "0 20px 50px -18px rgba(0,0,0,0.52), 0 0 36px rgba(56,189,248,0.14)",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-[10px] font-semibold" style={{ color: COLORS.darkTextSecondary }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#34d399", boxShadow: "0 0 10px rgba(52,211,153,0.8)" }} />
          System loading
        </span>
        <span className="text-[10px] font-bold tabular-nums" style={{ color: "#a78bfa" }}>
          {percent}%
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #34d399, #8b5cf6)" }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        />
      </div>
      <div className="mt-3 grid gap-1.5 text-[10px]">
        {rows.map(([key, value]) => (
          <div key={key} className="flex items-center justify-between gap-3">
            <span className="shrink-0" style={{ color: COLORS.darkTextSecondary }}>
              {key}
            </span>
            <span className="truncate font-semibold" style={{ color: value === "ready" || value === "loading" ? "#34d399" : "rgba(245,245,247,0.64)", maxWidth: 108 }}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function HeroMockup() {
  const reduce = useReducedMotion();
  const percent = useLoadingPercent(reduce);

  return (
    <div className="relative -ml-4 w-[720px] max-w-none xl:w-[760px]" style={{ perspective: 1400 }}>
      <div aria-hidden className="absolute -inset-16 rounded-full opacity-70 blur-3xl" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.26), rgba(34,211,238,0.08) 42%, transparent 68%)" }} />
      <div aria-hidden className="absolute -left-16 top-2 h-[420px] w-[620px] rounded-full border opacity-35" style={{ borderColor: "rgba(167,139,250,0.25)" }} />

      <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
        {TOP_CHIPS.map((chip, i) => (
          <motion.span
            key={chip.label}
            className="pointer-events-auto absolute z-30"
            style={{ left: chip.left, top: chip.top }}
            initial={{ opacity: 0, y: 8, rotate: chip.tilt }}
            animate={
              reduce
                ? { opacity: 1, y: 0, rotate: chip.tilt }
                : { opacity: 1, y: [0, -8, 0], rotate: [chip.tilt, chip.tilt + (chip.tilt > 0 ? 3 : -3), chip.tilt] }
            }
            transition={
              reduce
                ? { duration: 0.4, delay: i * 0.08 }
                : {
                    opacity: { duration: 0.45, delay: i * 0.08 },
                    y: { duration: 4 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 },
                    rotate: { duration: 4 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 },
                  }
            }
            whileHover={{ scale: 1.1, y: -4, rotate: 0 }}
          >
            <Chip label={chip.label} icon={chip.icon} tone={chip.tone} />
          </motion.span>
        ))}
      </div>

      <SystemPanel percent={percent} />

      <motion.div
        initial={{ opacity: 0, y: 22, rotateY: -8, rotateX: 5 }}
        animate={{ opacity: 1, y: 0, rotateY: reduce ? 0 : -4, rotateX: reduce ? 0 : 2 }}
        whileHover={reduce ? undefined : { rotateY: -2, rotateX: 1 }}
        transition={{ duration: 0.75, ease: EASE }}
        className="relative z-10 overflow-hidden rounded-[24px] border p-4"
        style={{
          borderColor: "rgba(167,139,250,0.42)",
          background: "linear-gradient(145deg, rgba(12,16,31,0.96), rgba(8,14,26,0.92))",
          boxShadow: "0 0 0 1px rgba(167,139,250,0.12), 0 0 60px rgba(124,58,237,0.24), 0 42px 90px -46px rgba(0,0,0,0.76)",
          transformStyle: "preserve-3d",
        }}
      >
        <div aria-hidden className="absolute inset-x-0 top-0 h-px" style={{ backgroundImage: GRAD.brand }} />
        <div className="grid grid-cols-[132px_1fr_180px] gap-3">
          <aside className="rounded-2xl border p-2.5" style={{ borderColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(255,255,255,0.032)" }}>
            <p className="px-2 pt-1 text-[11px] font-bold" style={{ color: COLORS.darkText }}>
              Webcoin <span style={{ color: "#8b5cf6" }}>Labs</span>
            </p>
            <div className="mt-4 grid gap-1.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <span
                    key={item.label}
                    className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-[9.5px] font-semibold"
                    style={{
                      backgroundColor: item.active ? "rgba(124,58,237,0.18)" : "transparent",
                      color: item.active ? "#c4b5fd" : COLORS.darkTextSecondary,
                    }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </span>
                );
              })}
            </div>
          </aside>

          <main>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[15px] font-bold tracking-tight" style={{ color: COLORS.darkText }}>
                  Good morning, Founder
                </h3>
                <p className="mt-0.5 text-[9.5px]" style={{ color: COLORS.darkTextSecondary }}>
                  Connected founder operating layer.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: COLORS.darkTextMuted }}>
                    Credits
                  </p>
                  <p className="text-[18px] font-black leading-none" style={{ color: "#a78bfa" }}>
                    100
                  </p>
                  <p className="text-[8.5px]" style={{ color: COLORS.darkTextSecondary }}>
                    Level 1
                  </p>
                </div>
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border text-[10px] font-black tracking-[-0.03em]"
                  style={{
                    borderColor: "rgba(167,139,250,0.28)",
                    background: "linear-gradient(135deg, rgba(124,58,237,0.28), rgba(37,99,235,0.18))",
                    color: "#ddd6fe",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 10px 24px -18px rgba(124,58,237,0.85)",
                  }}
                >
                  XP
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2.5">
              {MODULES.map((item) => (
                <MetricTile key={item.label} item={item} />
              ))}
            </div>

            <div className="mt-2.5 grid grid-cols-[0.85fr_1.15fr] gap-2.5">
              <div className="rounded-xl border p-3" style={{ borderColor: "rgba(255,255,255,0.075)", backgroundColor: "rgba(255,255,255,0.035)" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10.5px] font-bold" style={{ color: COLORS.darkText }}>
                      Referral Rank
                    </p>
                    <p className="text-[9.5px]" style={{ color: COLORS.darkTextSecondary }}>
                      Top 25%
                    </p>
                  </div>
                  <BarChart3 className="h-4 w-4" style={{ color: "#a78bfa" }} />
                </div>
                <svg className="mt-2 h-7 w-full" viewBox="0 0 150 36" fill="none" aria-hidden>
                  <path d="M2 28 L24 19 L43 23 L64 10 L86 16 L110 8 L132 14 L148 5" stroke="rgba(34,211,238,0.2)" strokeWidth="7" />
                  <path d="M2 28 L24 19 L43 23 L64 10 L86 16 L110 8 L132 14 L148 5" stroke="rgba(167,139,250,0.7)" strokeWidth="2" />
                </svg>
              </div>
              <MiniMap />
            </div>
          </main>

          <aside className="grid gap-2.5">
            <FounderPassWidget />
            <div className="rounded-xl border p-3" style={{ borderColor: "rgba(255,255,255,0.075)", backgroundColor: "rgba(255,255,255,0.035)" }}>
              <p className="text-[10.5px] font-bold" style={{ color: COLORS.darkText }}>
                Recent Activity
              </p>
              <div className="mt-2 grid gap-1.5 text-[9.5px]" style={{ color: COLORS.darkTextSecondary }}>
                {["Deck review completed", "Intro request accepted", "Builder joined", "Tokenomics reviewed"].map((line, i) => (
                  <div key={line} className="flex items-center justify-between gap-2">
                    <span className="truncate">{line}</span>
                    <span>{[2, 3, 14, 18][i]}h</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border px-3 py-2.5" style={{ borderColor: "rgba(52,211,153,0.18)", backgroundColor: "rgba(52,211,153,0.08)" }}>
              <span className="flex items-center gap-2 text-[10px] font-bold" style={{ color: "#bbf7d0" }}>
                <ShieldCheck className="h-3.5 w-3.5" />
                Private access
              </span>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#34d399", boxShadow: "0 0 10px rgba(52,211,153,0.8)" }} />
            </div>
          </aside>
        </div>
      </motion.div>
      <FloatingFounderPassPreview reduce={reduce} />
    </div>
  );
}
