"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Globe2 } from "lucide-react";
import { COLORS, EASE } from "@/lib/waitlist/tokens";

type Props = {
  stats: {
    verifiedMembers: number;
    verifiedReferrals: number;
    countriesLabel: string;
    buildersFounders: number;
  };
};

// Same verified geography as DashboardPreview's GlobalNetworkPanel — coords are
// % positions on the real map asset (public/maps/simplemaps-world.svg, viewBox
// 0 0 2000 857), checked against the asset's own path data, not eyeballed.
const HUBS = [
  { x: 16.5, y: 31.0, tone: COLORS.accent }, // San Francisco
  { x: 29.0, y: 29.5, tone: COLORS.accent }, // New York
  { x: 34.0, y: 69.2, tone: COLORS.accentCool }, // Brazil
  { x: 49.5, y: 20.0, tone: COLORS.accentCool }, // London
  { x: 51.8, y: 51.8, tone: COLORS.accentWarm }, // Nigeria
  { x: 60.1, y: 58.2, tone: COLORS.accent }, // Kenya
  { x: 87.5, y: 32.5, tone: COLORS.accent }, // Japan
] as const;

const ARCS = [
  { d: "M16.5 31 C28 20, 40 18, 49.5 20", tone: COLORS.accent },
  { d: "M34 69.2 C42 64, 52 60, 60.1 58.2", tone: COLORS.accentWarm },
] as const;

export function GlobalMap({ stats }: Props) {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden rounded-[22px] border bg-white p-5 shadow-sm" style={{ borderColor: COLORS.border }}>
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: COLORS.textMuted }}>
            <Globe2 className="h-4 w-4" />
            Global network reach
          </div>
          <p className="mt-2 text-lg font-black" style={{ color: COLORS.text }}>
            {stats.countriesLabel}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.12em]" style={{ color: COLORS.green }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: COLORS.green }} />
          Live
        </span>
      </div>

      <div
        className="relative mt-4 overflow-hidden rounded-xl border"
        style={{
          borderColor: "#e8ebf2",
          background:
            "radial-gradient(circle at 24% 38%, rgba(124,58,237,0.08), transparent 26%), radial-gradient(circle at 72% 42%, rgba(14,116,144,0.07), transparent 30%), #fbfcff",
          aspectRatio: "2000 / 857",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: "linear-gradient(120deg, rgba(124,58,237,0.18), rgba(14,116,144,0.13))",
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
            {ARCS.map((arc, i) => (
              <path key={i} d={arc.d} fill="none" stroke={arc.tone} strokeWidth="0.35" strokeDasharray="1.4 1.6" />
            ))}
          </g>
        </svg>

        {HUBS.map((hub, i) => (
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
                transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.24, ease: "easeInOut" }}
              />
            ) : null}
            <span className="absolute inset-0 rounded-full" style={{ backgroundColor: hub.tone, boxShadow: `0 0 6px ${hub.tone}` }} />
          </span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <MapStat label="Verified members" value={stats.verifiedMembers.toLocaleString()} />
        <MapStat label="Referrals" value={stats.verifiedReferrals.toLocaleString()} />
        <MapStat label="Countries" value="Activating" />
        <MapStat label="Builders/founders" value={stats.buildersFounders.toLocaleString()} />
      </div>
    </section>
  );
}

function MapStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: COLORS.textMuted }}>
        {label}
      </p>
      <p className="mt-1 text-[14px] font-black" style={{ color: COLORS.text }}>
        {value}
      </p>
    </div>
  );
}
