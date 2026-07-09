"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  BadgeCheck,
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
import { COLORS, EASE, GRAD } from "@/lib/waitlist/tokens";
import { WAITLIST_TASK_REWARDS } from "@/lib/waitlist/share";
import { GlobalMap } from "./GlobalMap";

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
    { icon: Handshake, title: "Investor intros" },
    { icon: Compass, title: "Advisor discovery" },
  ],
  BUILDER: [
    { icon: Github, title: "Builder proof and portfolio" },
    { icon: Users, title: "Peer builder rooms" },
    { icon: Handshake, title: "Founder intros" },
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
  const reduce = useReducedMotion();
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
    <div className="mx-auto grid w-full max-w-5xl gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
      <div className="space-y-5">
        <motion.section
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="relative overflow-hidden rounded-[22px] border p-5 sm:p-6"
          style={{ borderColor: COLORS.darkBorderStrong, background: GRAD.darkIsland }}
        >
          <div aria-hidden className="absolute -right-28 -top-28 h-72 w-72 rounded-full blur-3xl" style={{ backgroundColor: "rgba(124,58,237,0.32)" }} />
          <div aria-hidden className="absolute bottom-0 left-0 h-px w-full" style={{ backgroundImage: GRAD.brand }} />
          <div className="relative grid gap-7 xl:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: COLORS.darkTextMuted }}>
                  <Trophy className="h-4 w-4" />
                  Your position
                </div>
                <span className="rounded-full px-3 py-1 text-[10px] font-black" style={{ backgroundColor: "rgba(255,255,255,0.08)", color: COLORS.darkTextSecondary }}>
                  {props.accessTier}
                </span>
              </div>
              <motion.p
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={reduce ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="mt-4 text-6xl font-bold tracking-tight sm:text-7xl"
                style={{ color: COLORS.darkText }}
              >
                {props.rank ? `#${props.rank.toLocaleString()}` : "-"}
              </motion.p>
              <p className="mt-2 text-[14px]" style={{ color: COLORS.darkTextSecondary }}>
                {props.rank ? `of ${props.rankedTotal.toLocaleString()} verified members` : "Rank appears after verification"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <DarkStat label="WebXP total" value={props.webXp.toLocaleString()} accent={COLORS.accent} />
              <DarkStat label="Verified referrals" value={String(props.verifiedReferralCount)} accent={COLORS.green} />
              <DarkStat label="Access tier" value={props.accessTier} accent="#22d3ee" />
              <DarkStat label="Status" value={titleCase(props.status)} accent="#f472b6" />
            </div>
          </div>
          <div className="relative mt-5 rounded-2xl border p-3" style={{ borderColor: COLORS.darkBorder, backgroundColor: "rgba(255,255,255,0.045)" }}>
            <p className="text-[12px] font-black" style={{ color: COLORS.darkText }}>
              Keep inviting to climb the leaderboard
            </p>
            <p className="mt-1 text-[11.5px]" style={{ color: COLORS.darkTextMuted }}>
              More verified referrals = higher rank + more WebXP.
            </p>
          </div>
        </motion.section>

        <Leaderboard rows={props.leaderboard} rankedTotal={props.rankedTotal} />
        <GlobalMap stats={props.networkStats} />
      </div>

      <div className="space-y-5">
        <section className="rounded-[22px] border bg-white p-5 shadow-sm" style={{ borderColor: COLORS.border }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight" style={{ color: COLORS.text }}>
                Advance your position.
              </h2>
              <p className="mt-1.5 text-[12.5px] leading-5" style={{ color: COLORS.textSecondary }}>
                Share your referral link with verified builders and founders.
              </p>
            </div>
            <button
              type="button"
              onClick={copy}
              aria-label="Copy referral link"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: COLORS.text, color: "#fff" }}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>

          <div className="mt-4 rounded-xl border p-3" style={{ borderColor: COLORS.border, backgroundColor: COLORS.surfaceMuted }}>
            <p className="mb-1.5 text-[9px] font-black uppercase tracking-[0.14em]" style={{ color: COLORS.textMuted }}>
              Your referral link
            </p>
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4" style={{ color: COLORS.accentDeep }} />
              <code className="min-w-0 flex-1 truncate text-[12px] font-semibold" style={{ color: COLORS.text }}>
                {props.referralLink}
              </code>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={openXShare}
              disabled={xTask?.status === "CLAIMED"}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[12px] font-bold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: COLORS.text, color: "#fff" }}
            >
              <ExternalLink className="h-4 w-4" />
              {xTask?.status === "CLAIMED" ? "Shared on X" : "Share on X"}
            </button>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-[12px] font-bold transition-transform hover:-translate-y-0.5"
              style={{ borderColor: COLORS.border, color: COLORS.text, backgroundColor: "#fff" }}
            >
              <Copy className="h-4 w-4" />
              More options
            </button>
          </div>
        </section>

        <PerksCard role={props.role} />

        <FounderPassPanel
          displayName={props.displayName}
          passTrack={passTrack}
          passTier={passTier}
          passStatus={passStatus}
          webXp={props.webXp}
          verifiedReferralCount={props.verifiedReferralCount}
          reduce={reduce}
        />

        <section className="rounded-[22px] border bg-white p-5 shadow-sm" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight" style={{ color: COLORS.text }}>
                Complete launch tasks
              </h2>
              <p className="mt-1 text-[13px] leading-5" style={{ color: COLORS.textSecondary }}>
                Earn promotional WebXP by helping bring serious builders and founders into Webcoin Labs.
              </p>
            </div>
            <BadgeCheck className="h-5 w-5 shrink-0" style={{ color: COLORS.accentDeep }} />
          </div>

          <div className="mt-5 grid gap-3">
            <TaskCard
              icon={Send}
              title="Share your Founder Pass access"
              reward={formatReward(WAITLIST_TASK_REWARDS.X_SHARE)}
              description="Share your Webcoin Labs referral link on X and invite serious founders and builders."
              task={xTask}
              buttonLabel={xTask?.status === "CLAIMED" ? "Claimed" : "Share on X"}
              onClick={openXShare}
              disabled={xTask?.status === "CLAIMED"}
              loading={isPending}
            />
            <TaskCard
              icon={Users}
              title="Invite 3 verified builders or founders"
              reward={formatReward(WAITLIST_TASK_REWARDS.THREE_VERIFIED_REFERRALS)}
              description="Bring serious builders or founders into Webcoin Labs. Only verified referrals count."
              task={referralTask}
              buttonLabel={referralTask?.status === "CLAIMED" ? "Claimed" : "Copy referral link"}
              onClick={copy}
              disabled={referralTask?.status === "CLAIMED"}
            />
            <TaskCard
              icon={IdCard}
              title="Check Founder Pass eligibility"
              reward={formatReward(WAITLIST_TASK_REWARDS.FOUNDER_PASS_ELIGIBILITY_CHECK)}
              description="Founder Pass eligibility checks are opening soon for builders launching on Arc and Base."
              task={{ taskType: "FOUNDER_PASS_ELIGIBILITY_CHECK", status: "LOCKED", xpAwarded: eligibilityTask?.xpAwarded ?? 0, progress: 0, goal: 1 }}
              buttonLabel="Coming soon"
              onClick={() => undefined}
              disabled
              statusText="Coming soon"
              translucent
            />
          </div>

          <p className="mt-4 text-[11.5px] leading-5" style={{ color: COLORS.textMuted }}>
            We may review public task activity. WebXP is a promotional in-app points system. It has no monetary value, no token value, no airdrop value, and no financial rights.
          </p>
        </section>

      </div>

      {showXConfirm ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-5">
          <div className="w-full max-w-sm rounded-[24px] bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold" style={{ color: COLORS.text }}>
                  Posted on X?
                </h3>
                <p className="mt-2 text-[13px] leading-5" style={{ color: COLORS.textSecondary }}>
                  Confirm after posting. Webcoin Labs may review public task activity later.
                </p>
              </div>
              <button type="button" onClick={() => setShowXConfirm(false)} aria-label="Close" className="rounded-full p-1.5" style={{ color: COLORS.textMuted }}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={confirmXShare}
              disabled={isPending}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold disabled:opacity-70"
              style={{ backgroundColor: COLORS.text, color: "#fff" }}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Yes, I posted
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PerksCard({ role }: { role: string }) {
  const perks = PERKS_BY_ROLE[role] ?? PERKS_BY_ROLE.FOUNDER;
  const roleLabel = ROLE_LABEL[role] ?? "Founder";

  return (
    <section className="rounded-[22px] border bg-white p-5 shadow-sm" style={{ borderColor: COLORS.border }}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: COLORS.text }}>
            {roleLabel} perks
          </h2>
          <p className="mt-1 text-[12.5px] leading-5" style={{ color: COLORS.textSecondary }}>
            What your early access unlocks.
          </p>
        </div>
        <Gift className="h-5 w-5 shrink-0" style={{ color: COLORS.accentDeep }} />
      </div>

      <div className="mt-4 grid gap-2.5">
        {perks.map((perk) => {
          const Icon = perk.icon;
          return (
            <div key={perk.title} className="flex items-center gap-3 rounded-xl border px-3 py-2.5" style={{ borderColor: COLORS.border, backgroundColor: COLORS.surfaceMuted }}>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: "#fff", color: COLORS.accentDeep }}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-[12.5px] font-semibold" style={{ color: COLORS.text }}>
                {perk.title}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FounderPassPanel({
  displayName,
  passTrack,
  passTier,
  passStatus,
  webXp,
  verifiedReferralCount,
  reduce,
}: {
  displayName: string;
  passTrack: string;
  passTier: string;
  passStatus: string;
  webXp: number;
  verifiedReferralCount: number;
  reduce: boolean | null;
}) {
  return (
    <section
      className="relative overflow-hidden rounded-[22px] border p-5 shadow-sm"
      style={{ borderColor: COLORS.darkBorderStrong, background: GRAD.darkIsland }}
    >
      <div aria-hidden className="absolute -right-14 -top-14 h-40 w-40 rounded-full blur-3xl" style={{ backgroundColor: "rgba(124,58,237,0.32)" }} />
      <div className="relative mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight" style={{ color: COLORS.darkText }}>
              Founder Pass
            </h2>
            <span className="rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.1em]" style={{ backgroundColor: "rgba(167,139,250,0.16)", color: "#c4b5fd" }}>
              Eligible soon
            </span>
          </div>
          <p className="mt-1 text-[13px] leading-5" style={{ color: COLORS.darkTextSecondary }}>
            Your builder credential.
          </p>
        </div>
        <BadgeCheck className="h-5 w-5" style={{ color: "#a78bfa" }} />
      </div>
      <motion.div
        whileHover={reduce ? undefined : { rotateX: 1.5, rotateY: -2, y: -2 }}
        transition={{ duration: 0.25 }}
        className="relative overflow-hidden rounded-[18px] border p-5"
        style={{
          borderColor: COLORS.darkBorder,
          background: "linear-gradient(150deg, rgba(8,8,18,0.92), rgba(33,18,54,0.76))",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          aria-hidden
          className="absolute right-4 top-8 hidden h-28 w-20 rotate-12 rounded-[18px] border opacity-70 shadow-2xl sm:block"
          style={{
            borderColor: "rgba(255,255,255,0.22)",
            background: "linear-gradient(145deg, rgba(255,255,255,0.38), rgba(255,255,255,0.08))",
          }}
        >
          <span className="grid h-full w-full -rotate-90 place-items-center text-[11px] font-black tracking-[0.16em]" style={{ color: "rgba(255,255,255,0.35)" }}>
            FOUNDER
          </span>
        </div>
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-[0.18em]" style={{ color: COLORS.darkTextMuted }}>
              Webcoin Labs
            </span>
          </div>
          <p className="mt-5 text-2xl font-bold tracking-tight" style={{ color: COLORS.darkText }}>
            Founder Pass
          </p>
          <div className="mt-5 grid max-w-[72%] grid-cols-2 gap-3 sm:max-w-[70%]">
            <PassField label="Founder" value={displayName} />
            <PassField label="Track" value={passTrack} />
            <PassField label="Tier" value={passTier} />
            <PassField label="Status" value={passStatus} />
            <PassField label="WebXP" value={webXp.toLocaleString()} />
            <PassField label="Referrals" value={String(verifiedReferralCount)} />
          </div>
        </div>
      </motion.div>

      <div className="relative mt-4 flex items-end justify-between gap-3">
        <p className="max-w-[270px] text-[12px] leading-5" style={{ color: COLORS.darkTextSecondary }}>
          Beta eligibility is currently available for builders and founders launching on Arc and Base.
        </p>
      </div>
      <p className="relative mt-4 text-[10.5px] leading-5" style={{ color: COLORS.darkTextMuted }}>
        Founder Pass is an in-app access credential. It is not a payment card, token, NFT, investment product, or financial product.
      </p>
    </section>
  );
}

function Leaderboard({ rows, rankedTotal }: { rows: WaitlistLeaderboardRow[]; rankedTotal: number }) {
  return (
    <section className="rounded-[22px] border bg-white p-5 shadow-sm" style={{ borderColor: COLORS.border }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: COLORS.text }}>
            Leaderboard
          </h2>
          <p className="mt-1 text-[12.5px]" style={{ color: COLORS.textMuted }}>
            Ranked by WebXP, referrals, then verification time.
          </p>
        </div>
        <Medal className="h-5 w-5" style={{ color: COLORS.accentDeep }} />
      </div>

      <div className="mt-5 space-y-2">
        {rows.length ? (
          rows.map((row) => <LeaderboardRow key={`${row.rank}-${row.label}`} row={row} />)
        ) : (
          <div className="rounded-2xl border p-4 text-[13px] leading-6" style={{ borderColor: COLORS.border, color: COLORS.textSecondary, backgroundColor: COLORS.surfaceMuted }}>
            You&apos;re early. Invite verified builders and founders to shape the leaderboard.
          </div>
        )}
      </div>

      <p className="mt-4 text-[11.5px]" style={{ color: COLORS.textMuted }}>
        {rankedTotal.toLocaleString()} verified members ranked. Emails stay private.
      </p>
    </section>
  );
}

function LeaderboardRow({ row }: { row: WaitlistLeaderboardRow }) {
  return (
    <div
      className="grid grid-cols-[48px_1fr_auto] items-center gap-3 rounded-2xl border px-3 py-3 transition-transform hover:-translate-y-0.5"
      style={{
        borderColor: row.isCurrent ? COLORS.borderAccent : COLORS.border,
        backgroundColor: row.isCurrent ? "rgba(124,58,237,0.07)" : COLORS.surfaceMuted,
      }}
    >
      <span className="text-[13px] font-black" style={{ color: row.isCurrent ? COLORS.accentDeep : COLORS.textMuted }}>
        #{row.rank}
      </span>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-bold" style={{ color: COLORS.text }}>
          {row.label}
        </p>
        <p className="text-[11.5px]" style={{ color: COLORS.textMuted }}>
          {row.verifiedReferralCount} referrals
        </p>
      </div>
      <span className="text-[13px] font-black" style={{ color: COLORS.text }}>
        {row.webXp.toLocaleString()} WebXP
      </span>
    </div>
  );
}

function TaskCard({
  icon: Icon,
  title,
  reward,
  description,
  task,
  buttonLabel,
  onClick,
  disabled,
  loading,
  footer,
  statusText,
  translucent,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  reward: string;
  description: string;
  task?: WaitlistTaskState;
  buttonLabel: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  footer?: React.ReactNode;
  statusText?: string;
  translucent?: boolean;
}) {
  const status = task?.status ?? "LOCKED";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: EASE }}
      className="rounded-2xl border px-3 py-3"
      style={{
        borderColor: translucent ? "rgba(216,214,230,0.72)" : COLORS.border,
        backgroundColor: translucent ? "rgba(255,255,255,0.48)" : COLORS.surfaceMuted,
        opacity: translucent ? 0.72 : 1,
        backdropFilter: translucent ? "blur(10px)" : undefined,
      }}
    >
      <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto]">
        <div className="flex min-w-0 items-start gap-3">
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
          style={{ backgroundColor: translucent ? "rgba(255,255,255,0.62)" : "#fff", color: translucent ? COLORS.textMuted : COLORS.accentDeep }}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[12.5px] font-black leading-5" style={{ color: COLORS.text }}>
              {title}
            </h3>
            <span
              className="shrink-0 rounded-full border px-2 py-0.5 text-[9.5px] font-black"
              style={{
                borderColor: "rgba(124,58,237,0.18)",
                backgroundColor: translucent ? "rgba(124,58,237,0.08)" : "rgba(124,58,237,0.1)",
                color: translucent ? COLORS.accentDeep : COLORS.accentDeep,
              }}
            >
              {reward}
            </span>
          </div>
          <p className="mt-1 text-[12.5px] leading-5" style={{ color: COLORS.textSecondary }}>
            {description}
          </p>
          <p className="mt-2 text-[10px] font-black uppercase tracking-[0.12em]" style={{ color: COLORS.textMuted }}>
            {statusText ?? statusLabel(status)}
            {task ? ` · ${task.progress}/${task.goal}` : ""}
          </p>
        </div>
      </div>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled || loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-[11px] font-bold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-75 sm:w-auto"
          style={{
            backgroundColor: status === "LOCKED" ? "rgba(216,214,230,0.62)" : COLORS.text,
            color: status === "LOCKED" ? COLORS.textMuted : "#fff",
          }}
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : status === "LOCKED" ? <Lock className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
          {buttonLabel}
        </button>
      </div>

      {footer ? <div className="mt-3">{footer}</div> : null}
    </motion.div>
  );
}

function DarkStat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: COLORS.darkBorder, backgroundColor: "rgba(255,255,255,0.035)" }}>
      <p className="text-[10.5px] font-bold uppercase tracking-[0.14em]" style={{ color: COLORS.darkTextMuted }}>
        {label}
      </p>
      <p className="mt-2 text-[17px] font-black leading-6" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}

function PassField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: COLORS.darkTextMuted }}>
        {label}
      </p>
      <p className="mt-1 truncate text-[13px] font-bold" style={{ color: COLORS.darkText }}>
        {value}
      </p>
    </div>
  );
}

function titleCase(s: string) {
  return s.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatReward(amount: number) {
  return `+${amount.toLocaleString()} WebXP`;
}

function trackLabel(track: string | null) {
  if (!track) return "Arc / Base beta";
  if (track === "BOTH") return "Arc + Base";
  return titleCase(track);
}

function statusLabel(status: WaitlistTaskState["status"]) {
  if (status === "IN_PROGRESS") return "Pending confirmation";
  return titleCase(status);
}
