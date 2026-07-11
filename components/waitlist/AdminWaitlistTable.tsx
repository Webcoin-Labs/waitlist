"use client";

import { useMemo, useState, useTransition } from "react";
import {
  adminAdjustWebXp,
  adminSetFounderPassStatus,
  adminSetFounderPassTier,
  adminSetFounderPassTrack,
  adminSetWaitlistStatus,
} from "@/app/actions/waitlist";

export type AdminWaitlistRow = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  status: string;
  webXp: number;
  verifiedReferralCount: number;
  referredByEmail: string | null;
  founderPassStatus: string;
  founderPassTier: string | null;
  founderPassTrack: string | null;
  createdAt: string;
  verifiedAt: string | null;
  rank: number | null;
};

const STATUSES = ["PENDING_VERIFICATION", "VERIFIED", "INVITED", "APPROVED", "BLOCKED"];
const FOUNDER_PASS_STATUSES = ["LOCKED", "ELIGIBLE_SOON", "ELIGIBLE", "INVITED", "CLAIMED"];
const FOUNDER_PASS_TIERS = ["", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"];
const FOUNDER_PASS_TRACKS = ["", "ARC", "BASE", "FARCASTER", "SOLANA", "POLYGON", "OPTIMISM", "OTHER"];
const ROLES = ["FOUNDER", "BUILDER", "INVESTOR", "ADVISOR"];

export function AdminWaitlistTable({ rows }: { rows: AdminWaitlistRow[] }) {
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [passOnly, setPassOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"xp" | "referrals" | "date">("xp");
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState("");

  const view = useMemo(() => {
    let list = rows.filter((r) => {
      if (roleFilter && r.role !== roleFilter) return false;
      if (statusFilter && r.status !== statusFilter) return false;
      if (passOnly && !["ELIGIBLE", "INVITED", "CLAIMED"].includes(r.founderPassStatus)) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sortBy === "referrals") return b.verifiedReferralCount - a.verifiedReferralCount;
      if (sortBy === "date") return +new Date(b.createdAt) - +new Date(a.createdAt);
      return b.webXp - a.webXp;
    });
    return list;
  }, [rows, roleFilter, statusFilter, passOnly, sortBy]);

  const run = (fn: () => Promise<{ success: boolean; error?: string }>, ok: string) => {
    setMsg("");
    startTransition(async () => {
      const res = await fn();
      setMsg(res.success ? ok : res.error ?? "Failed.");
    });
  };

  const inputCls = "rounded-md border border-border bg-background px-2 py-1 text-xs";

  return (
    <div className="space-y-4">
      {/* filters */}
      <div className="flex flex-wrap items-center gap-2">
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className={inputCls}>
          <option value="">All roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputCls}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className={inputCls}>
          <option value="xp">Highest Credits</option>
          <option value="referrals">Most referrals</option>
          <option value="date">Date joined</option>
        </select>
        <label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <input type="checkbox" checked={passOnly} onChange={(e) => setPassOnly(e.target.checked)} />
          Founder Pass eligible
        </label>
        <span className="ml-auto text-xs text-muted-foreground">{view.length} shown</span>
      </div>

      {msg ? <p className="text-xs text-cyan-400">{msg}</p> : null}

      <div className="overflow-x-auto rounded-xl border border-border/60">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              {["Rank", "Email", "Role", "Status", "Credits", "Refs", "Referred by", "Founder Pass", "Tier", "Track", "Joined", "Verified", "Actions"].map((h) => (
                <th key={h} className="whitespace-nowrap px-3 py-2 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {view.map((r) => (
              <tr key={r.id} className="border-t border-border/50 align-middle">
                <td className="px-3 py-2">{r.rank ? `#${r.rank}` : "—"}</td>
                <td className="px-3 py-2">
                  <div className="font-medium text-foreground">{r.email}</div>
                  {r.name ? <div className="text-muted-foreground">{r.name}</div> : null}
                </td>
                <td className="px-3 py-2">{r.role}</td>
                <td className="px-3 py-2">
                  <select
                    defaultValue={r.status}
                    disabled={isPending}
                    onChange={(e) => run(() => adminSetWaitlistStatus(r.id, e.target.value as never), "Status updated.")}
                    className={inputCls}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2 font-semibold text-foreground">{r.webXp}</td>
                <td className="px-3 py-2">{r.verifiedReferralCount}</td>
                <td className="px-3 py-2 text-muted-foreground">{r.referredByEmail ?? "—"}</td>
                <td className="px-3 py-2">
                  <select
                    defaultValue={r.founderPassStatus}
                    disabled={isPending}
                    onChange={(e) => run(() => adminSetFounderPassStatus(r.id, e.target.value as never), "Founder Pass status updated.")}
                    className={inputCls}
                  >
                    {FOUNDER_PASS_STATUSES.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <select
                    defaultValue={r.founderPassTier ?? ""}
                    disabled={isPending}
                    onChange={(e) => run(() => adminSetFounderPassTier(r.id, e.target.value as never), "Founder Pass tier updated.")}
                    className={inputCls}
                  >
                    {FOUNDER_PASS_TIERS.map((tier) => (
                      <option key={tier || "none"} value={tier}>{tier || "NONE"}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <select
                    defaultValue={r.founderPassTrack ?? ""}
                    disabled={isPending}
                    onChange={(e) => run(() => adminSetFounderPassTrack(r.id, e.target.value as never), "Founder Pass track updated.")}
                    className={inputCls}
                  >
                    {FOUNDER_PASS_TRACKS.map((track) => (
                      <option key={track || "none"} value={track}>{track || "NONE"}</option>
                    ))}
                  </select>
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</td>
                <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">{r.verifiedAt ? new Date(r.verifiedAt).toLocaleDateString() : "—"}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => run(() => adminAdjustWebXp(r.id, 50), "Credits +50.")}
                      className="rounded border border-border px-1.5 py-1 hover:bg-muted/50"
                      title="Add 50 Credits"
                    >
                      +50
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => run(() => adminAdjustWebXp(r.id, -50), "Credits -50.")}
                      className="rounded border border-border px-1.5 py-1 hover:bg-muted/50"
                      title="Remove 50 Credits"
                    >
                      -50
                    </button>
                    <button type="button" disabled={isPending} onClick={() => run(() => adminSetWaitlistStatus(r.id, "INVITED" as never), "Invited.")} className="rounded border border-border px-1.5 py-1 hover:bg-muted/50">Invite</button>
                    <button type="button" disabled={isPending} onClick={() => run(() => adminSetWaitlistStatus(r.id, "APPROVED" as never), "Approved.")} className="rounded border border-border px-1.5 py-1 hover:bg-muted/50">Approve</button>
                    <button type="button" disabled={isPending} onClick={() => run(() => adminSetFounderPassStatus(r.id, "ELIGIBLE" as never), "Founder Pass eligible.")} className="rounded border border-border px-1.5 py-1 hover:bg-muted/50">Pass</button>
                    <button type="button" disabled={isPending} onClick={() => run(() => adminSetWaitlistStatus(r.id, "BLOCKED" as never), "Blocked.")} className="rounded border border-red-500/30 px-1.5 py-1 text-red-400 hover:bg-red-500/10">Block</button>
                  </div>
                </td>
              </tr>
            ))}
            {view.length === 0 ? (
              <tr>
                <td colSpan={13} className="px-3 py-8 text-center text-muted-foreground">No entries match.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
