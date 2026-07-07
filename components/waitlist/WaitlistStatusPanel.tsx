"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Trophy, Sparkles, Users, IdCard, Plane } from "lucide-react";
import { COLORS, EASE, GRAD } from "@/lib/waitlist/tokens";
import { GlobalMap } from "./GlobalMap";

type Props = {
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

export function WaitlistStatusPanel(props: Props) {
  const [copied, setCopied] = useState(false);
  const passStatus = PASS_STATUS_LABEL[props.founderPassStatus] ?? titleCase(props.founderPassStatus);
  const passTier = props.founderPassTier ? titleCase(props.founderPassTier) : "Not assigned";
  const passTrack = props.founderPassTrack ? titleCase(props.founderPassTrack) : "Arc / Base beta";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(props.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-5 lg:grid-cols-[1fr_1.15fr]">
      {/* LEFT — position + global map (dark, "boarding pass" style) */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="relative overflow-hidden rounded-3xl border p-7"
          style={{ borderColor: COLORS.darkBorderStrong, background: GRAD.darkIsland }}
        >
          <div
            aria-hidden
            className="absolute -right-24 -top-24 h-56 w-56 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(124,58,237,0.35), transparent 60%)" }}
          />
          <div className="relative">
            <div className="flex items-center gap-2" style={{ color: COLORS.darkTextMuted }}>
              <Plane className="h-4 w-4" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">Your position</span>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mt-4 text-6xl font-bold tracking-tight md:text-7xl"
              style={{ color: COLORS.darkText }}
            >
              {props.rank ? `#${props.rank.toLocaleString()}` : "—"}
            </motion.p>
            <p className="mt-1 text-[13px]" style={{ color: COLORS.darkTextMuted }}>
              {props.rank ? `of ${props.rankedTotal.toLocaleString()} verified` : "Rank will appear after verification"}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <Mini label="Role" value={ROLE_LABEL[props.role] ?? "Member"} />
              <Mini label="Access" value={props.accessTier} />
              <Mini label="WebXP" value={props.webXp.toLocaleString()} highlight />
              <Mini label="Status" value={titleCase(props.status)} />
            </div>
          </div>
        </motion.div>

        <GlobalMap />
      </div>

      {/* RIGHT — advance (light card) */}
      <div className="rounded-3xl border p-7" style={{ borderColor: COLORS.border, backgroundColor: "#fff" }}>
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: COLORS.text }}>
          Advance your position.
        </h2>
        <p className="mt-2 text-[14px] leading-6" style={{ color: COLORS.textSecondary }}>
          Invite verified founders, builders, and ecosystem operators to move up.
        </p>

        <div className="mt-6 rounded-2xl border p-4" style={{ borderColor: COLORS.border, backgroundColor: COLORS.surfaceMuted }}>
          <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: COLORS.textMuted }}>
            Your referral link
          </p>
          <div className="mt-2 flex items-center gap-2">
            <code
              className="flex-1 truncate rounded-lg border px-3 py-2 text-[13px]"
              style={{ borderColor: COLORS.border, backgroundColor: "#fff", color: COLORS.text }}
            >
              {props.referralLink}
            </code>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: COLORS.text, color: "#fff" }}
            >
              {copied ? <Check className="h-4 w-4" style={{ color: COLORS.green }} /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Stat icon={Trophy} label="Position" value={props.rank ? `#${props.rank.toLocaleString()}` : "—"} accent={COLORS.accentDeep} />
          <Stat icon={Sparkles} label="WebXP" value={props.webXp.toLocaleString()} accent="#c026d3" />
          <Stat icon={Users} label="Verified referrals" value={String(props.verifiedReferralCount)} accent={COLORS.green} />
          <Stat icon={IdCard} label="Founder Pass" value={passStatus} accent={COLORS.accentRose} />
          <Stat icon={IdCard} label="Pass tier" value={passTier} accent="#b45309" />
          <Stat icon={IdCard} label="Pass track" value={passTrack} accent="#0891b2" />
        </div>

        {props.founderPassStatus === "LOCKED" ? (
          <p className="mt-5 rounded-2xl border p-4 text-[12.5px] leading-6" style={{ borderColor: COLORS.border, color: COLORS.textSecondary, backgroundColor: COLORS.surfaceMuted }}>
            Founder Pass beta is currently available for Arc and Base builders. More tracks are coming soon.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function titleCase(s: string) {
  return s.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function Mini({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-2xl border p-3" style={{ borderColor: COLORS.darkBorder, backgroundColor: "rgba(255,255,255,0.03)" }}>
      <p className="text-[10px] uppercase tracking-wide" style={{ color: COLORS.darkTextMuted }}>
        {label}
      </p>
      <p className="mt-1 text-[14px] font-semibold" style={{ color: highlight ? COLORS.accent : COLORS.darkText }}>
        {value}
      </p>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: COLORS.border, backgroundColor: COLORS.surfaceMuted }}>
      <Icon className="h-4 w-4" style={{ color: accent }} />
      <p className="mt-2 text-[11px] uppercase tracking-wide" style={{ color: COLORS.textMuted }}>
        {label}
      </p>
      <p className="mt-0.5 text-[14px] font-semibold" style={{ color: COLORS.text }}>
        {value}
      </p>
    </div>
  );
}
