import { Lock, Orbit } from "lucide-react";
import { COLORS, GRAD } from "@/lib/waitlist/tokens";

const AVAILABLE = [
  {
    slug: "arc",
    label: "Arc",
    logo: "/logo/Arc_Logo_White.svg",
    tint: "rgba(245,158,11,0.13)",
    ring: "rgba(245,158,11,0.28)",
  },
  {
    slug: "base",
    label: "Base",
    logo: "/logo/Base_lockup_white.svg",
    tint: "rgba(0,82,255,0.16)",
    ring: "rgba(0,82,255,0.34)",
  },
] as const;

const COMING_SOON = [
  { slug: "solana", label: "Solana", logo: "/logo/Solana%20(SOL).svg" },
  { slug: "zama", label: "Zama", icon: Lock },
] as const;

export function FounderPassEligibilityStrip() {
  return (
    <section className="py-8" style={{ backgroundColor: COLORS.bg }}>
      <div className="container mx-auto max-w-7xl px-6">
        <div
          className="relative overflow-hidden rounded-[32px] border px-8 py-10 md:px-12 md:py-12"
          style={{ borderColor: COLORS.darkBorder, background: GRAD.darkIsland }}
        >
          <div aria-hidden className="absolute inset-0 opacity-60" style={{ background: "radial-gradient(520px 220px at 38% 0%, rgba(124,58,237,0.18), transparent 70%)" }} />
          <div className="relative grid gap-8 lg:grid-cols-[0.75fr_1.6fr] lg:items-center">
            <div className="lg:border-r lg:pr-7" style={{ borderColor: COLORS.darkBorder }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "#a78bfa" }}>
                Founder Pass beta eligibility
              </p>
              <h2 className="mt-2 text-[22px] font-bold tracking-tight" style={{ color: COLORS.darkText }}>
                Available now for Arc and Base.
              </h2>
              <p className="mt-3 max-w-md text-[13px] leading-6" style={{ color: COLORS.darkTextSecondary }}>
                Founder Pass is currently accessible only for builders launching on Arc and Base. More founder access
                tracks are coming soon.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-[0.72fr_1fr] md:items-start">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: COLORS.darkTextMuted }}>
                  Available now
                </p>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  {AVAILABLE.map((network) => (
                    <div
                      key={network.slug}
                      className="flex min-h-[152px] items-center justify-center rounded-2xl border p-5 transition duration-300 hover:-translate-y-0.5"
                      style={{ borderColor: network.ring, backgroundColor: network.tint }}
                    >
                      <img src={network.logo} alt={network.label} className="max-h-14 w-auto max-w-[140px] object-contain" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: COLORS.darkTextMuted }}>
                  Coming soon
                </p>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  {COMING_SOON.map((network) => (
                    <div
                      key={network.slug}
                      className="flex min-h-[152px] flex-col items-center justify-center gap-3 rounded-2xl border p-4 text-center opacity-72 transition duration-300 hover:opacity-100"
                      style={{ borderColor: COLORS.darkBorder, backgroundColor: "rgba(255,255,255,0.032)" }}
                    >
                      {"logo" in network ? (
                        <img src={network.logo} alt={network.label} className="max-h-10 w-auto max-w-[110px] object-contain" />
                      ) : (
                        <network.icon className="h-8 w-8" style={{ color: COLORS.darkTextMuted }} />
                      )}
                      <span className="text-[9px] font-semibold uppercase tracking-[0.1em]" style={{ color: COLORS.darkTextMuted }}>
                        Coming soon
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Orbit className="absolute right-5 top-5 h-4 w-4 opacity-40" style={{ color: "#a78bfa" }} aria-hidden />
        </div>
      </div>
    </section>
  );
}
