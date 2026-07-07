"use client";

import { motion, useReducedMotion } from "framer-motion";
import { COLORS } from "@/lib/waitlist/tokens";

// A simple, respectful "global" visual: dotted grid + a few pulsing waypoints.
// No fake user data; just conveys "network reach" without revealing anyone.
const WAYPOINTS = [
  { x: 24, y: 45 },
  { x: 38, y: 38 },
  { x: 52, y: 42 },
  { x: 66, y: 52 },
  { x: 78, y: 48 },
  { x: 44, y: 62 },
];

export function GlobalMap() {
  const reduce = useReducedMotion();

  return (
    <div
      className="relative overflow-hidden rounded-2xl border"
      style={{ borderColor: COLORS.darkBorder, backgroundColor: COLORS.darkSurface, aspectRatio: "16 / 9" }}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)",
          backgroundSize: "10px 10px",
          maskImage: "radial-gradient(ellipse 70% 55% at 50% 50%, black, transparent 78%)",
        }}
      />

      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        {WAYPOINTS.map((p, i) => (
          <g key={i}>
            {!reduce ? (
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={0.8}
                fill="none"
                stroke={COLORS.accent}
                strokeWidth={0.25}
                animate={{ r: [0.8, 2.6, 0.8], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.35, ease: "easeInOut" }}
              />
            ) : null}
            <circle cx={p.x} cy={p.y} r={0.7} fill={COLORS.accent} />
          </g>
        ))}
      </svg>

      <div
        className="absolute bottom-3 left-3 flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.14em]"
        style={{ color: COLORS.darkTextMuted }}
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: COLORS.accent }} />
        Global network reach
      </div>
    </div>
  );
}
