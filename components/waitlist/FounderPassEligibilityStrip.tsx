import { Orbit } from "lucide-react";
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
  { slug: "zama", label: "Zama", logo: "/logo/logo-zama-typowhite.svg" },
] as const;

export function FounderPassEligibilityStrip() {
  return (
    <section className="py-5 sm:py-8" style={{ backgroundColor: COLORS.bg }}>
      <div className="container mx-auto max-w-7xl px-6">
        <div
          className="relative overflow-hidden rounded-[18px] border px-4 py-5 sm:rounded-[22px] sm:px-5 sm:py-6 md:rounded-[32px] md:px-12 md:py-12"
          style={{ borderColor: COLORS.darkBorder, background: GRAD.darkIsland }}
        >
          <div aria-hidden className="absolute inset-0 opacity-60" style={{ background: "radial-gradient(520px 220px at 38% 0%, rgba(124,58,237,0.18), transparent 70%)" }} />
          <div className="relative grid gap-6 lg:grid-cols-[0.75fr_1.6fr] lg:items-center lg:gap-8">
            <div className="lg:border-r lg:pr-7" style={{ borderColor: COLORS.darkBorder }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "#a78bfa" }}>
                Builder Pass beta
              </p>
              <h2 className="mt-2 text-[20px] font-bold tracking-tight max-lg:text-balance sm:text-[22px]" style={{ color: COLORS.darkText }}>
                Available now for Arc and Base.
              </h2>
              <p className="mt-2.5 max-w-md text-[12px] leading-5 max-lg:text-pretty sm:mt-3 sm:text-[13px] sm:leading-6" style={{ color: COLORS.darkTextSecondary }}>
                Builder Pass is currently available for builders shipping on Arc and Base. More ecosystem tracks are
                coming soon.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-[0.72fr_1fr] md:items-start md:gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: COLORS.darkTextMuted }}>
                  Available now
                </p>
                <div className="mt-2.5 grid grid-cols-2 gap-2.5 md:mt-3 md:gap-4">
                  {AVAILABLE.map((network) => (
                    <div
                      key={network.slug}
                      className="flex min-h-[84px] items-center justify-center rounded-xl border p-3 transition duration-300 hover:-translate-y-0.5 md:min-h-[152px] md:rounded-2xl md:p-5"
                      style={{ borderColor: network.ring, backgroundColor: network.tint }}
                    >
                      <img src={network.logo} alt={network.label} className="max-h-8 w-auto max-w-[100px] object-contain md:max-h-14 md:max-w-[140px]" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: COLORS.darkTextMuted }}>
                  Coming soon
                </p>
                <div className="mt-2.5 grid grid-cols-2 gap-2.5 md:mt-3 md:gap-4">
                  {COMING_SOON.map((network) => (
                    <div
                      key={network.slug}
                      className="flex min-h-[84px] flex-col items-center justify-center gap-1.5 rounded-xl border p-2.5 text-center opacity-72 transition duration-300 hover:opacity-100 md:min-h-[152px] md:gap-3 md:rounded-2xl md:p-4"
                      style={{ borderColor: COLORS.darkBorder, backgroundColor: "rgba(255,255,255,0.032)" }}
                    >
                      <img src={network.logo} alt={network.label} className="max-h-6 w-auto max-w-[76px] object-contain md:max-h-10 md:max-w-[110px]" />
                      <span className="text-[8px] font-semibold uppercase tracking-[0.1em] md:text-[9px]" style={{ color: COLORS.darkTextMuted }}>
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
