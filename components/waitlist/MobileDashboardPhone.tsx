import {
  Activity,
  Bell,
  CheckCircle2,
  Compass,
  Home,
  IdCard,
  Network,
  UserPlus,
  Zap,
} from "lucide-react";

const MOBILE_METRICS = [
  { label: "WebXP", value: "100", detail: "+100 verified", icon: Zap, tone: "#7c3aed", soft: "#f1ecff" },
  { label: "Waitlist rank", value: "#128", detail: "Top 4%", icon: Activity, tone: "#c2410c", soft: "#fff3eb" },
  { label: "Referrals", value: "3", detail: "1 this week", icon: UserPlus, tone: "#059669", soft: "#ecfdf3" },
  { label: "Builder Pass", value: "Review", detail: "Beta access", icon: IdCard, tone: "#0891b2", soft: "#ecfeff" },
] as const;

const MOBILE_NAV = [
  { label: "Home", icon: Home, href: "#join", active: true },
  { label: "Tools", icon: Compass, href: "#perks", active: false },
  { label: "Network", icon: Network, href: "#why-join", active: false },
  { label: "Pass", icon: IdCard, href: "#join-form", active: false },
] as const;

export function MobileDashboardPhone({ compact = false }: { compact?: boolean }) {
  return (
    <figure
      className={`mx-auto w-full ${compact ? "max-w-[300px]" : "max-w-[326px]"}`}
      aria-label="Mobile preview of the Webcoin Labs founder dashboard"
    >
      <div className="mb-3 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase text-[#667085]">
        <span className="size-1.5 rounded-full bg-[#12b76a]" />
        Mobile Founder OS preview
      </div>

      <div
        className="overflow-hidden rounded-[36px] border-[6px] border-[#0b0a12] bg-[#0b0a12] p-1 shadow-xl"
        style={{ boxShadow: "0 26px 70px -34px rgba(15,23,42,0.72)" }}
      >
        <div className="relative overflow-hidden rounded-[27px] bg-[#f6f7fb]">
          <div className="relative flex h-7 items-center justify-between px-4 text-[8.5px] font-bold text-[#344054]">
            <span className="tabular-nums">9:41</span>
            <span className="absolute left-1/2 top-1.5 h-4 w-[72px] -translate-x-1/2 rounded-full bg-[#0b0a12]" />
            <span className="flex items-center gap-1" aria-hidden>
              <span className="h-2 w-3 rounded-sm border border-[#344054]" />
              <span className="size-2 rounded-full border border-[#344054]" />
            </span>
          </div>

          <div className="border-b border-[#e4e7ec] bg-white px-3.5 pb-3 pt-2.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-[#101828]">
                  <img src="/logo/webcoin-mark-light.webp" alt="" className="size-5 object-contain" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-bold text-[#101828]">Webcoin Labs</p>
                  <p className="truncate text-[8.5px] text-[#98a2b3]">Founder operating system</p>
                </div>
              </div>
              <a
                href="#join-form"
                aria-label="Join to access dashboard notifications"
                className="grid size-8 place-items-center rounded-full border border-[#e4e7ec] bg-white text-[#667085]"
              >
                <Bell className="size-3.5" />
              </a>
            </div>
          </div>

          <div className={`${compact ? "px-3 pb-3 pt-3" : "px-3.5 pb-4 pt-3.5"}`}>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[9px] font-medium text-[#667085]">Good morning</p>
                <h3 className="text-balance text-[17px] font-bold leading-tight text-[#101828]">Build your next move.</h3>
              </div>
              <span className="rounded-full bg-[#ede9fe] px-2.5 py-1 text-[8.5px] font-bold text-[#6d28d9]">LEVEL 1</span>
            </div>

            <div className="mt-3 rounded-2xl bg-[#101828] p-3 text-white shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[8.5px] font-semibold uppercase text-[#c4b5fd]">Priority access</p>
                  <p className="mt-1 text-pretty text-[12px] font-semibold leading-4">Complete 2 actions to enter priority review.</p>
                </div>
                <span className="grid size-7 shrink-0 place-items-center rounded-xl bg-[#7c3aed]">
                  <Zap className="size-3.5" />
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#344054]">
                <div className="h-full w-[72%] rounded-full bg-[#8b5cf6]" />
              </div>
              <div className="mt-1.5 flex justify-between text-[8px] font-medium text-[#d0d5dd]">
                <span>Access progress</span>
                <span className="tabular-nums">72%</span>
              </div>
            </div>

            <div className="mt-2.5 grid grid-cols-2 gap-2">
              {MOBILE_METRICS.map(({ label, value, detail, icon: Icon, tone, soft }) => (
                <div key={label} className="rounded-2xl border border-[#e4e7ec] bg-white p-2.5 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <span className="grid size-6 place-items-center rounded-lg" style={{ color: tone, backgroundColor: soft }}>
                      <Icon className="size-3" />
                    </span>
                    <span className="text-[7.5px] font-semibold text-[#98a2b3]">LIVE</span>
                  </div>
                  <p className="mt-2 text-[8.5px] font-medium text-[#667085]">{label}</p>
                  <p className="mt-0.5 truncate text-[15px] font-bold leading-none text-[#101828] tabular-nums">{value}</p>
                  <p className="mt-1 text-[7.5px] font-medium" style={{ color: tone }}>{detail}</p>
                </div>
              ))}
            </div>

            {!compact ? (
              <div className="mt-2.5 rounded-2xl border border-[#e4e7ec] bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-[#101828]">Recent activity</p>
                    <p className="text-[8px] text-[#98a2b3]">Your verified progress</p>
                  </div>
                  <span className="text-[8.5px] font-semibold text-[#6d28d9]">View all</span>
                </div>
                <div className="mt-2 grid gap-2">
                  {[
                    ["Email verified", "+100 WebXP"],
                    ["Founder profile", "82% ready"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center gap-2.5 border-t border-[#f0f1f3] pt-2 first:border-0 first:pt-0">
                      <span className="grid size-6 place-items-center rounded-full bg-[#ecfdf3] text-[#059669]">
                        <CheckCircle2 className="size-3" />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[8.5px] font-semibold text-[#344054]">{label}</span>
                      <span className="shrink-0 text-[8px] font-medium text-[#667085]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <nav className="grid grid-cols-4 border-t border-[#e4e7ec] bg-white px-2 pb-2.5 pt-2" aria-label="Mobile dashboard preview navigation">
            {MOBILE_NAV.map(({ label, icon: Icon, href, active }) => (
              <a key={label} href={href} className="flex flex-col items-center gap-1 text-[7.5px] font-semibold" style={{ color: active ? "#6d28d9" : "#98a2b3" }}>
                <span className={`grid size-7 place-items-center rounded-xl ${active ? "bg-[#f1ecff]" : "bg-transparent"}`}>
                  <Icon className="size-3.5" />
                </span>
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </figure>
  );
}
