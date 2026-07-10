import { Globe2 } from "lucide-react";
import { COLORS } from "@/lib/waitlist/tokens";

type Props = {
  stats: {
    verifiedMembers: number;
    verifiedReferrals: number;
    countriesLabel: string;
    buildersFounders: number;
  };
};

const HUBS = [
  { x: 16.5, y: 31.0, tone: COLORS.accent },
  { x: 29.0, y: 29.5, tone: COLORS.accent },
  { x: 34.0, y: 69.2, tone: COLORS.accentCool },
  { x: 49.5, y: 20.0, tone: COLORS.accentCool },
  { x: 51.8, y: 51.8, tone: COLORS.accentWarm },
  { x: 60.1, y: 58.2, tone: COLORS.accent },
  { x: 87.5, y: 32.5, tone: COLORS.accent },
] as const;

const ARCS = [
  { d: "M16.5 31 C28 20, 40 18, 49.5 20", tone: COLORS.accent },
  { d: "M34 69.2 C42 64, 52 60, 60.1 58.2", tone: COLORS.accentWarm },
] as const;

export function GlobalMap({ stats }: Props) {
  return (
    <section className="flex h-full min-h-[360px] min-w-0 flex-col rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.border }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase" style={{ color: COLORS.accentDeep }}>
            <Globe2 className="size-4" />
            Global activity
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight" style={{ color: COLORS.text }}>
            {stats.countriesLabel}
          </h2>
          <p className="mt-2 text-pretty text-[13px] leading-5" style={{ color: COLORS.textSecondary }}>
            Verified members and referrals moving through the Webcoin Labs network.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-semibold" style={{ borderColor: COLORS.border, color: COLORS.textMuted }}>
          <span className="size-1.5 rounded-full" style={{ backgroundColor: COLORS.green }} />
          Live signal
        </span>
      </div>

      <div className="relative mt-5 min-h-[210px] flex-1 overflow-hidden rounded-xl border" style={{ borderColor: COLORS.border, backgroundColor: COLORS.surfaceMuted }}>
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundColor: "#d8d6e6",
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
            backgroundImage: "radial-gradient(circle, #a3a1b3 1px, transparent 1.5px)",
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

        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
          {ARCS.map((arc) => (
            <path key={arc.d} d={arc.d} fill="none" stroke={arc.tone} strokeWidth="0.35" strokeDasharray="1.4 1.6" opacity="0.48" />
          ))}
        </svg>

        {HUBS.map((hub) => (
          <span
            key={`${hub.x}-${hub.y}`}
            className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
            style={{ left: `${hub.x}%`, top: `${hub.y}%`, backgroundColor: hub.tone }}
          />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 border-t pt-4 sm:grid-cols-4" style={{ borderColor: COLORS.border }}>
        <MapStat label="Verified members" value={stats.verifiedMembers.toLocaleString()} />
        <MapStat label="Referrals" value={stats.verifiedReferrals.toLocaleString()} />
        <MapStat label="Countries" value={stats.countriesLabel} />
        <MapStat label="Builders / founders" value={stats.buildersFounders.toLocaleString()} />
      </div>
    </section>
  );
}

function MapStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 border-r px-3 first:pl-0 last:border-r-0 last:pr-0 even:border-r-0 sm:even:border-r" style={{ borderColor: COLORS.border }}>
      <p className="text-[9px] font-semibold uppercase" style={{ color: COLORS.textMuted }}>
        {label}
      </p>
      <p className="mt-1 truncate text-[13px] font-semibold tabular-nums" style={{ color: COLORS.text }}>
        {value}
      </p>
    </div>
  );
}
