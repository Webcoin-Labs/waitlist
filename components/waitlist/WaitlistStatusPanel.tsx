"use client";

import { useMemo, useState, useTransition, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  BarChart3,
  Check,
  CheckCircle2,
  Compass,
  Copy,
  ExternalLink,
  FileText,
  Gift,
  Github,
  Handshake,
  IdCard,
  Link2,
  Loader2,
  Lock,
  Medal,
  Network,
  PieChart,
  Rocket,
  Send,
  ShieldCheck,
  TrendingUp,
  Trophy,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import type { WaitlistLeaderboardRow, WaitlistTaskState } from "@/app/actions/waitlist";
import { confirmXSharePosted, recordXShareOpened } from "@/app/actions/waitlist";
import { COLORS, GRAD } from "@/lib/waitlist/tokens";
import { WAITLIST_TASK_REWARDS } from "@/lib/waitlist/share";
import { cn } from "@/lib/utils";
import { GlobalMap } from "./GlobalMap";

type IconComponent = ComponentType<{ className?: string; strokeWidth?: number | string }>;

function XLogoMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function DiscordLogoMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.522 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
  );
}

type Props = {
  email: string;
  displayName: string;
  referralCode: string;
  statusToken: string;
  role: string;
  status: string;
  webXp: number;
  verifiedReferralCount: number;
  rank: number | null;
  rankedTotal: number;
  accessTier: string;
  founderPassStatus: string;
  founderPassTier: string | null;
  founderPassTrack: string | null;
  referralLink: string;
  xShareText: string;
  xShareUrl: string;
  leaderboard: WaitlistLeaderboardRow[];
  taskStates: WaitlistTaskState[];
  networkStats: {
    verifiedMembers: number;
    verifiedReferrals: number;
    countriesLabel: string;
    buildersFounders: number;
  };
};

const PASS_STATUS_LABEL: Record<string, string> = {
  LOCKED: "Locked",
  ELIGIBLE_SOON: "Eligible soon",
  ELIGIBLE: "Eligible",
  INVITED: "Invited",
  CLAIMED: "Claimed",
};

const ROLE_LABEL: Record<string, string> = {
  FOUNDER: "Founder",
  BUILDER: "Builder",
  INVESTOR: "VC",
  ADVISOR: "Advisor",
};

const PERKS_BY_ROLE: Record<string, { icon: LucideIcon; title: string }[]> = {
  FOUNDER: [
    { icon: FileText, title: "Pitch deck review" },
    { icon: PieChart, title: "Tokenomics support" },
    { icon: Handshake, title: "Investor introductions" },
    { icon: Compass, title: "Advisor discovery" },
  ],
  BUILDER: [
    { icon: Github, title: "Builder proof and portfolio" },
    { icon: Users, title: "Peer builder rooms" },
    { icon: Handshake, title: "Founder introductions" },
    { icon: IdCard, title: "Builder Pass eligibility" },
  ],
  INVESTOR: [
    { icon: TrendingUp, title: "Curated deal flow" },
    { icon: ShieldCheck, title: "Verified founder profiles" },
    { icon: Send, title: "Warm intro requests" },
    { icon: BarChart3, title: "Network analytics access" },
  ],
  ADVISOR: [
    { icon: Compass, title: "Advisor-founder matching" },
    { icon: Users, title: "Domain-based discovery" },
    { icon: Network, title: "Network visibility" },
  ],
};

export function WaitlistStatusPanel(props: Props) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [showXConfirm, setShowXConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const taskByType = useMemo(() => new Map(props.taskStates.map((task) => [task.taskType, task])), [props.taskStates]);

  const xTask = taskByType.get("X_SHARE");
  const referralTask = taskByType.get("THREE_VERIFIED_REFERRALS");
  const eligibilityTask = taskByType.get("FOUNDER_PASS_ELIGIBILITY_CHECK");
  const passStatus = PASS_STATUS_LABEL[props.founderPassStatus] ?? titleCase(props.founderPassStatus);
  const passTier = props.founderPassTier ? titleCase(props.founderPassTier) : "Not assigned";
  const passTrack = trackLabel(props.founderPassTrack);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(props.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const openXShare = () => {
    window.open(props.xShareUrl, "_blank", "noopener,noreferrer");
    setShowXConfirm(true);
    startTransition(async () => {
      await recordXShareOpened(props.statusToken);
      router.refresh();
    });
  };

  const confirmXShare = () => {
    startTransition(async () => {
      await confirmXSharePosted(props.statusToken);
      setShowXConfirm(false);
      router.refresh();
    });
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <StatusOverview
        rank={props.rank}
        rankedTotal={props.rankedTotal}
        webXp={props.webXp}
        referrals={props.verifiedReferralCount}
        accessTier={props.accessTier}
        status={props.status}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
        <div className="flex flex-col gap-6">
          <Leaderboard
            rows={props.leaderboard}
            rankedTotal={props.rankedTotal}
            rank={props.rank}
            displayName={props.displayName}
            webXp={props.webXp}
            referrals={props.verifiedReferralCount}
          />
          <PerksCard role={props.role} />
        </div>

        <div className="grid content-start gap-6">
          <ReferralPanel
            referralLink={props.referralLink}
            referralCode={props.referralCode}
            copied={copied}
            onCopy={copy}
            onShare={openXShare}
            shareClaimed={xTask?.status === "CLAIMED"}
          />
          <LaunchTasks
            xTask={xTask}
            referralTask={referralTask}
            eligibilityTask={eligibilityTask}
            onShare={openXShare}
            onCopy={copy}
            loading={isPending}
          />
        </div>
      </div>

      <div className="mt-6 grid items-stretch gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)]">
        <GlobalMap stats={props.networkStats} />
        <FounderPassPanel
          displayName={props.displayName}
          passTrack={passTrack}
          passTier={passTier}
          passStatus={passStatus}
          webXp={props.webXp}
          verifiedReferralCount={props.verifiedReferralCount}
        />
      </div>

      {showXConfirm ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-5">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase" style={{ color: COLORS.accentDeep }}>
                  Share confirmation
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight" style={{ color: COLORS.text }}>
                  Posted on X?
                </h3>
                <p className="mt-2 text-pretty text-[13px] leading-5" style={{ color: COLORS.textSecondary }}>
                  Confirm after posting. Webcoin Labs may review public task activity before awarding the promotional reward.
                </p>
              </div>
              <button type="button" onClick={() => setShowXConfirm(false)} aria-label="Close" className="inline-flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-[#f4f3f8]" style={{ color: COLORS.textMuted }}>
                <X className="size-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={confirmXShare}
              disabled={isPending}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold disabled:opacity-70"
              style={{ backgroundColor: COLORS.text, color: "#fff" }}
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
              Yes, I posted
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StatusOverview({
  rank,
  rankedTotal,
  webXp,
  referrals,
  accessTier,
  status,
}: {
  rank: number | null;
  rankedTotal: number;
  webXp: number;
  referrals: number;
  accessTier: string;
  status: string;
}) {
  return (
    <section className="rounded-2xl border bg-white p-3 shadow-sm" style={{ borderColor: COLORS.border }}>
      <div className="grid gap-3 lg:grid-cols-[minmax(280px,0.7fr)_minmax(0,1.3fr)]">
        <div className="relative flex min-h-[280px] flex-col overflow-hidden rounded-xl p-6 sm:p-7" style={{ backgroundColor: COLORS.darkBg }}>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ backgroundImage: GRAD.brand }} />
          <div aria-hidden className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full blur-3xl" style={{ backgroundColor: "rgba(124,58,237,0.28)" }} />
          <Trophy aria-hidden className="pointer-events-none absolute -bottom-4 -right-4 size-28 opacity-[0.06]" style={{ color: COLORS.darkText }} />

          <div className="relative flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase" style={{ color: "#c4b5fd" }}>
              <Trophy className="size-4" />
              Waitlist position
            </span>
            <span className="rounded-full border px-2.5 py-1 text-[10px] font-semibold" style={{ borderColor: COLORS.darkBorder, color: COLORS.darkTextSecondary }}>
              {accessTier}
            </span>
          </div>
          <p className="relative mt-6 text-6xl font-semibold tabular-nums sm:text-7xl" style={{ color: COLORS.darkText }}>
            {rank ? `#${rank.toLocaleString()}` : "—"}
          </p>
          <p className="relative mt-1.5 text-sm" style={{ color: COLORS.darkTextSecondary }}>
            {rank ? `of ${rankedTotal.toLocaleString()} verified members` : "Your rank appears after verification."}
          </p>

          {rank && rankedTotal > 0 ? (
            <div className="relative mt-5">
              <div className="flex items-center justify-between text-[10px] font-semibold uppercase" style={{ color: COLORS.darkTextMuted }}>
                <span>Percentile</span>
                <span style={{ color: "#c4b5fd" }}>Ahead of {Math.max(0, Math.round(((rankedTotal - rank) / rankedTotal) * 100))}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.max(4, Math.round(((rankedTotal - rank + 1) / rankedTotal) * 100))}%`, backgroundImage: GRAD.brand }}
                />
              </div>
            </div>
          ) : null}

          <p className="relative mt-auto border-t pt-4 text-pretty text-xs leading-5" style={{ borderColor: COLORS.darkBorder, color: COLORS.darkTextMuted }}>
            Invite people you trust. Verified referrals improve your rank and add Credits.
          </p>
        </div>

        <div className="flex min-w-0 flex-col rounded-xl border p-6 sm:p-7" style={{ borderColor: COLORS.border, backgroundColor: COLORS.surfaceMuted }}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase" style={{ color: COLORS.accentDeep }}>
                Early access snapshot
              </p>
              <h2 className="mt-2 max-w-2xl text-balance text-2xl font-semibold leading-tight" style={{ color: COLORS.text }}>
                Your account is active and ready for the next step.
              </h2>
            </div>
            <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-xs font-semibold" style={{ borderColor: COLORS.border, color: COLORS.green }}>
              <CheckCircle2 className="size-4" />
              Verified
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <OverviewStat label="Credits" value={webXp.toLocaleString()} />
            <OverviewStat label="Referrals" value={String(referrals)} />
            <OverviewStat label="Tier" value={accessTier} />
            <OverviewStat label="Status" value={titleCase(status)} />
          </div>

          <div className="mt-5 flex items-center gap-3 border-t pt-4" style={{ borderColor: COLORS.border }}>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white" style={{ color: COLORS.accentDeep }}>
              <TrendingUp className="size-4" />
            </div>
            <p className="text-pretty text-xs leading-5" style={{ color: COLORS.textSecondary }}>
              Keep inviting verified members to strengthen your position and unlock more Credits.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function OverviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border bg-white p-4" style={{ borderColor: COLORS.border }}>
      <p className="text-[10px] font-semibold uppercase" style={{ color: COLORS.textMuted }}>
        {label}
      </p>
      <p className="mt-2 line-clamp-2 text-sm font-semibold leading-5 tabular-nums" style={{ color: COLORS.text }} title={value}>
        {value}
      </p>
    </div>
  );
}

function ReferralPanel({
  referralLink,
  referralCode,
  copied,
  onCopy,
  onShare,
  shareClaimed,
}: {
  referralLink: string;
  referralCode: string;
  copied: boolean;
  onCopy: () => void;
  onShare: () => void;
  shareClaimed: boolean;
}) {
  const [codeCopied, setCodeCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.border }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase" style={{ color: COLORS.accentDeep }}>
            Next best action
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight" style={{ color: COLORS.text }}>
            Share your referral link.
          </h2>
          <p className="mt-2 max-w-xl text-pretty text-[13px] leading-5" style={{ color: COLORS.textSecondary }}>
            Invite serious founders, builders, and operators. Referral rewards are added once the person verifies their email.
          </p>
        </div>
        <button
          type="button"
          onClick={onCopy}
          aria-label="Copy referral link"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border hover:bg-[#f4f3f8]"
          style={{ borderColor: COLORS.border, color: COLORS.text }}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-lg border px-3 py-3" style={{ borderColor: COLORS.border, backgroundColor: COLORS.surfaceMuted }}>
        <Link2 className="size-4 shrink-0" style={{ color: COLORS.accentDeep }} />
        <code className="min-w-0 flex-1 truncate text-[12px] font-medium" style={{ color: COLORS.text }}>
          {referralLink}
        </code>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={onShare}
          disabled={shareClaimed}
          className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[12px] font-semibold disabled:cursor-not-allowed disabled:opacity-60"
          style={{ backgroundColor: COLORS.text, color: "#fff" }}
        >
          <ExternalLink className="size-4" />
          {shareClaimed ? "X task claimed" : "Share on X"}
        </button>
        <button type="button" onClick={onCopy} className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-[12px] font-semibold hover:bg-[#f4f3f8]" style={{ borderColor: COLORS.border, color: COLORS.text }}>
          <Copy className="size-4" />
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5" style={{ borderColor: COLORS.border, backgroundColor: COLORS.surfaceMuted }}>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: COLORS.textMuted }}>
            Referral code
          </p>
          <code className="mt-0.5 block text-[13px] font-semibold tracking-[0.06em]" style={{ color: COLORS.text }}>
            {referralCode}
          </code>
        </div>
        <button
          type="button"
          onClick={copyCode}
          aria-label="Copy referral code"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border bg-white px-3 py-2 text-[11px] font-semibold hover:bg-[#f4f3f8]"
          style={{ borderColor: COLORS.border, color: COLORS.text }}
        >
          {codeCopied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {codeCopied ? "Copied" : "Copy code"}
        </button>
      </div>
    </section>
  );
}

const PERKS_DESCRIPTION: Record<string, string> = {
  FOUNDER: "Access opens in stages as verification, review, and beta availability allow.",
  BUILDER: "Proof-based access — the more you ship on Arc or Base, the more these unlock.",
  INVESTOR: "Curated deal-flow access, unlocked as the founder directory grows.",
  ADVISOR: "Matching and visibility access, unlocked as advisor demand grows.",
};

function PerksCard({ role }: { role: string }) {
  const perks = PERKS_BY_ROLE[role] ?? PERKS_BY_ROLE.FOUNDER;
  const roleLabel = ROLE_LABEL[role] ?? "Founder";
  const description = PERKS_DESCRIPTION[role] ?? PERKS_DESCRIPTION.FOUNDER;

  return (
    <section className="flex min-h-0 flex-1 flex-col rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.border }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase" style={{ color: COLORS.accentDeep }}>
            Your access
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight" style={{ color: COLORS.text }}>
            {roleLabel} perks
          </h2>
          <p className="mt-2 max-w-md text-pretty text-[12.5px] leading-5" style={{ color: COLORS.textSecondary }}>
            {description}
          </p>
        </div>
        <Gift className="size-5 shrink-0" style={{ color: COLORS.accentDeep }} />
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {perks.map((perk) => {
          const Icon = perk.icon;
          return (
            <div key={perk.title} className="flex items-center gap-3 rounded-lg border p-3" style={{ borderColor: COLORS.border, backgroundColor: COLORS.surfaceMuted }}>
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-white" style={{ color: COLORS.accentDeep }}>
                <Icon className="size-4" />
              </span>
              <span className="text-[12px] font-medium leading-5" style={{ color: COLORS.text }}>
                {perk.title}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-auto border-t pt-4 text-pretty text-[11px] leading-5" style={{ borderColor: COLORS.border, color: COLORS.textMuted }}>
        Perks are access signals, not guarantees. Availability depends on verification, fit, and current beta capacity.
      </p>
    </section>
  );
}

function LaunchTasks({
  xTask,
  referralTask,
  eligibilityTask,
  onShare,
  onCopy,
  loading,
}: {
  xTask?: WaitlistTaskState;
  referralTask?: WaitlistTaskState;
  eligibilityTask?: WaitlistTaskState;
  onShare: () => void;
  onCopy: () => void;
  loading: boolean;
}) {
  const lockedEligibility = {
    taskType: "FOUNDER_PASS_ELIGIBILITY_CHECK",
    status: "LOCKED",
    xpAwarded: eligibilityTask?.xpAwarded ?? 0,
    progress: 0,
    goal: 1,
  } as WaitlistTaskState;
  const completedCount = [xTask, referralTask, eligibilityTask].filter((task) => task?.status === "CLAIMED").length;

  return (
    <section className="overflow-hidden rounded-xl border bg-white shadow-sm" style={{ borderColor: COLORS.border }}>
      <div className="flex items-start justify-between gap-5 border-b px-5 py-6 sm:px-6" style={{ borderColor: COLORS.border, backgroundColor: COLORS.surfaceMuted }}>
        <div className="flex min-w-0 items-start gap-4">
          <TaskIcon icon={Rocket} featured />
          <div>
            <p className="text-[11px] font-semibold uppercase" style={{ color: COLORS.accentDeep }}>
              Launch tasks
            </p>
            <h2 className="mt-2 text-balance text-xl font-semibold tracking-tight" style={{ color: COLORS.text }}>
              Build real early-access momentum.
            </h2>
            <p className="mt-2 max-w-xl text-pretty text-[13px] leading-5" style={{ color: COLORS.textSecondary }}>
              Complete a few verified actions. We use them to measure signal, not vanity metrics.
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold tabular-nums" style={{ borderColor: COLORS.border, color: COLORS.textMuted }}>
          {completedCount} / 3 complete
        </span>
      </div>

      <div>
        <TaskRow
          number="01"
          icon={Send}
          title="Share your access link"
          description="Post your referral link on X and invite people you would genuinely recommend."
          reward={formatReward(WAITLIST_TASK_REWARDS.X_SHARE)}
          task={xTask}
          actionLabel={xTask?.status === "CLAIMED" ? "Claimed" : "Share on X"}
          onAction={onShare}
          disabled={xTask?.status === "CLAIMED" || loading}
        />
        <TaskRow
          number="02"
          icon={Users}
          title="Invite three verified people"
          description="Referrals count only after each person verifies their email."
          reward={formatReward(WAITLIST_TASK_REWARDS.THREE_VERIFIED_REFERRALS)}
          task={referralTask}
          actionLabel={referralTask?.status === "CLAIMED" ? "Claimed" : "Copy link"}
          onAction={onCopy}
          disabled={referralTask?.status === "CLAIMED"}
        />
        <TaskRow
          number="03"
          icon={IdCard}
          title="Check Founder Pass eligibility"
          description="Eligibility review will open in a future beta phase."
          reward={formatReward(WAITLIST_TASK_REWARDS.FOUNDER_PASS_ELIGIBILITY_CHECK)}
          task={lockedEligibility}
          actionLabel="Coming soon"
          onAction={() => undefined}
          disabled
        />
        <TaskRow
          number="04"
          icon={XLogoMark}
          title="Connect X"
          description="Link your X account to verify your access link posts automatically."
          reward={formatReward(WAITLIST_TASK_REWARDS.CONNECT_X)}
          actionLabel="Coming soon"
          onAction={() => undefined}
          disabled
        />
        <TaskRow
          number="05"
          icon={DiscordLogoMark}
          title="Connect Discord"
          description="Join the Webcoin Labs Discord to unlock community-only updates."
          reward={formatReward(WAITLIST_TASK_REWARDS.CONNECT_DISCORD)}
          actionLabel="Coming soon"
          onAction={() => undefined}
          disabled
        />
      </div>

      <p className="border-t px-5 py-4 text-pretty text-[11px] leading-5 sm:px-6" style={{ borderColor: COLORS.border, color: COLORS.textMuted }}>
        Credits are a promotional access signal only. They have no monetary, token, airdrop, ownership, investment, or financial value.
      </p>
    </section>
  );
}

function TaskRow({
  number,
  icon,
  title,
  description,
  reward,
  task,
  actionLabel,
  onAction,
  disabled,
}: {
  number: string;
  icon: IconComponent;
  title: string;
  description: string;
  reward: string;
  task?: WaitlistTaskState;
  actionLabel: string;
  onAction: () => void;
  disabled?: boolean;
}) {
  const status = task?.status ?? "LOCKED";

  return (
    <div className="grid gap-4 border-t px-5 py-5 first:border-t-0 sm:grid-cols-[28px_minmax(0,1fr)_auto] sm:items-center sm:px-6" style={{ borderColor: COLORS.border }}>
      <span className="hidden text-[11px] font-semibold tabular-nums sm:block" style={{ color: COLORS.textMuted }}>
        {number}
      </span>
      <div className="flex min-w-0 items-start gap-3">
        <TaskIcon icon={icon} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[13px] font-semibold" style={{ color: COLORS.text }}>
              {title}
            </h3>
            <span className="rounded-full border px-2 py-0.5 text-[9px] font-semibold tabular-nums" style={{ borderColor: "rgba(194,65,12,0.22)", color: COLORS.accentWarm }}>
              {reward}
            </span>
          </div>
          <p className="mt-1 text-pretty text-[12px] leading-5" style={{ color: COLORS.textSecondary }}>
            {description}
          </p>
          <p className="mt-1.5 text-[10px] font-semibold uppercase" style={{ color: COLORS.textMuted }}>
            {statusLabel(status)}{task ? ` · ${task.progress}/${task.goal}` : ""}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onAction}
        disabled={disabled}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-[11px] font-semibold disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
        style={{ backgroundColor: status === "LOCKED" ? COLORS.surfaceMuted : COLORS.text, color: status === "LOCKED" ? COLORS.textMuted : "#fff" }}
      >
        {status === "LOCKED" ? <Lock className="size-3.5" /> : <ShieldCheck className="size-3.5" />}
        {actionLabel}
      </button>
    </div>
  );
}

function TaskIcon({ icon: Icon, featured = false }: { icon: IconComponent; featured?: boolean }) {
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-lg border bg-white", featured ? "size-11" : "size-9")}
      style={{ borderColor: COLORS.border, color: COLORS.accentDeep }}
    >
      <Icon className={cn(featured ? "size-5" : "size-4")} strokeWidth={1.8} />
    </span>
  );
}

function FounderPassPanel({
  displayName,
  passTrack,
  passTier,
  passStatus,
  webXp,
  verifiedReferralCount,
}: {
  displayName: string;
  passTrack: string;
  passTier: string;
  passStatus: string;
  webXp: number;
  verifiedReferralCount: number;
}) {
  return (
    <section className="flex h-full flex-col rounded-2xl border p-6 shadow-sm" style={{ borderColor: COLORS.darkBorderStrong, backgroundColor: COLORS.darkBg }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase" style={{ color: "#c4b5fd" }}>
            Founder Pass
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight" style={{ color: COLORS.darkText }}>
            Your access credential.
          </h2>
          <p className="mt-2 text-pretty text-[13px] leading-5" style={{ color: COLORS.darkTextSecondary }}>
            Your current status is based on verification and available beta criteria.
          </p>
        </div>
        <span className="rounded-full border px-2.5 py-1 text-[10px] font-semibold" style={{ borderColor: "rgba(167,139,250,0.35)", color: "#c4b5fd" }}>
          {passStatus}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 overflow-hidden rounded-xl border" style={{ borderColor: COLORS.darkBorder }}>
        <PassMetric label="Founder" value={displayName} />
        <PassMetric label="Track" value={passTrack} />
        <PassMetric label="Tier" value={passTier} />
        <PassMetric label="Status" value={passStatus} />
        <PassMetric label="Credits" value={webXp.toLocaleString()} />
        <PassMetric label="Referrals" value={String(verifiedReferralCount)} />
      </div>

      <p className="mt-auto border-t pt-4 text-pretty text-[11px] leading-5" style={{ borderColor: COLORS.darkBorder, color: COLORS.darkTextMuted }}>
        Founder Pass is a Webcoin Labs access credential. It is not a payment card, token, NFT, investment product, or financial product.
      </p>
    </section>
  );
}

function PassMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 border-b border-r p-3 odd:border-r-0 even:border-r sm:[&:nth-last-child(-n+2)]:border-b-0" style={{ borderColor: COLORS.darkBorder, backgroundColor: "rgba(255,255,255,0.025)" }}>
      <p className="text-[9px] font-semibold uppercase" style={{ color: COLORS.darkTextMuted }}>
        {label}
      </p>
      <p className="mt-1 truncate text-[12px] font-semibold" style={{ color: COLORS.darkText }}>
        {value}
      </p>
    </div>
  );
}

function Leaderboard({
  rows,
  rankedTotal,
  rank,
  displayName,
  webXp,
  referrals,
}: {
  rows: WaitlistLeaderboardRow[];
  rankedTotal: number;
  rank: number | null;
  displayName: string;
  webXp: number;
  referrals: number;
}) {
  const reduce = useReducedMotion();

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.border }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase" style={{ color: COLORS.accentDeep }}>
            Verified leaderboard
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight" style={{ color: COLORS.text }}>
            Where you stand.
          </h2>
          <p className="mt-2 text-[13px] leading-5" style={{ color: COLORS.textSecondary }}>
            Ordered by Credits, verified referrals, then verification time.
          </p>
        </div>
        <Medal className="size-5 shrink-0" style={{ color: COLORS.accentDeep }} />
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mt-5 rounded-xl border p-4"
        style={{ borderColor: "rgba(124,58,237,0.38)", backgroundColor: "rgba(124,58,237,0.06)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase" style={{ color: COLORS.accentDeep }}>
              Your position
            </p>
            <p className="mt-1 truncate text-[15px] font-semibold" style={{ color: COLORS.text }}>
              {displayName}
            </p>
            <p className="mt-1 text-[12px]" style={{ color: COLORS.textSecondary }}>
              {rank ? `Ranked #${rank.toLocaleString()} of ${rankedTotal.toLocaleString()}` : "Rank appears after verification"}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[20px] font-semibold leading-none tabular-nums" style={{ color: COLORS.accentDeep }}>
              {rank ? `#${rank.toLocaleString()}` : "—"}
            </p>
            <p className="mt-1 text-[10px] font-semibold tabular-nums" style={{ color: COLORS.textMuted }}>
              {webXp.toLocaleString()} Credits · {referrals} refs
            </p>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase" style={{ color: COLORS.textMuted }}>
          Top 10 members
        </p>
        <span className="text-[11px]" style={{ color: COLORS.textMuted }}>
          Live ranking
        </span>
      </div>

      <ol className="mt-3 overflow-hidden rounded-xl border" style={{ borderColor: COLORS.border }}>
        {rows.length ? rows.map((row, index) => <LeaderboardRow key={`${row.rank}-${row.label}`} row={row} index={index} reduce={reduce} />) : (
          <li className="p-4 text-pretty text-[13px] leading-6" style={{ color: COLORS.textSecondary, backgroundColor: COLORS.surfaceMuted }}>
            You&apos;re early. Invite verified founders and builders to help shape the leaderboard.
          </li>
        )}
      </ol>

      <p className="mt-4 text-[11px] leading-5" style={{ color: COLORS.textMuted }}>
        {rankedTotal.toLocaleString()} verified members ranked. Email addresses remain private.
      </p>
    </section>
  );
}

function LeaderboardRow({ row, index, reduce }: { row: WaitlistLeaderboardRow; index: number; reduce: boolean | null }) {
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, x: -8 }}
      whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.28, delay: Math.min(index * 0.035, 0.2), ease: "easeOut" }}
      className="grid grid-cols-[32px_minmax(0,1fr)_auto_auto] items-center gap-3 border-t px-4 py-3 first:border-t-0"
      style={{ borderColor: COLORS.border, backgroundColor: row.isCurrent ? "rgba(124,58,237,0.07)" : "#fff" }}
    >
      <span className="text-[12px] font-semibold tabular-nums" style={{ color: row.isCurrent ? COLORS.accentDeep : COLORS.textMuted }}>
        #{row.rank}
      </span>
      <p className="min-w-0 truncate text-[13px] font-semibold" style={{ color: COLORS.text }}>
        {row.label}
      </p>
      <span className="text-[11px] tabular-nums" style={{ color: COLORS.textMuted }}>
        {row.verifiedReferralCount} verified {row.verifiedReferralCount === 1 ? "referral" : "referrals"}
      </span>
      <span className="text-[12px] font-semibold tabular-nums" style={{ color: COLORS.text }}>
        {row.webXp.toLocaleString()} Credits
      </span>
    </motion.li>
  );
}

function statusLabel(status: string) {
  return status.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function titleCase(value: string) {
  return value.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatReward(amount: number) {
  return `+${amount.toLocaleString()} Credits`;
}

function trackLabel(track: string | null) {
  if (!track) return "Arc / Base beta";
  if (track === "BOTH") return "Arc + Base";
  return titleCase(track);
}
