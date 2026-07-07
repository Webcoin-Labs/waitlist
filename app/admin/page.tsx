import { db } from "@/lib/prisma";
import { isAdminSession } from "@/lib/adminAuth";
import { adminLogin, adminLogout } from "@/app/actions/adminAuth";
import { compareRank, RANKED_STATUSES, type Rankable } from "@/lib/waitlist/xp";
import { AdminWaitlistTable, type AdminWaitlistRow } from "@/components/waitlist/AdminWaitlistTable";
import { COLORS } from "@/lib/waitlist/tokens";

export const metadata = { title: "Waitlist admin — Webcoin Labs" };

export default async function AdminPage() {
  const authed = await isAdminSession();

  if (!authed) {
    const login = async (formData: FormData) => {
      "use server";
      await adminLogin(formData);
    };
    return (
      <main className="flex min-h-screen items-center justify-center px-6" style={{ backgroundColor: COLORS.bg }}>
        <form
          action={login}
          className="w-full max-w-sm rounded-3xl border p-8"
          style={{ borderColor: COLORS.border, backgroundColor: "#fff" }}
        >
          <h1 className="text-xl font-bold" style={{ color: COLORS.text }}>
            Waitlist admin
          </h1>
          <p className="mt-2 text-[13px]" style={{ color: COLORS.textMuted }}>
            Enter the admin passphrase to manage entries.
          </p>
          <input
            type="password"
            name="passphrase"
            required
            placeholder="Passphrase"
            className="mt-5 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
            style={{ borderColor: COLORS.border, backgroundColor: COLORS.surfaceMuted, color: COLORS.text }}
          />
          <button
            type="submit"
            className="mt-4 w-full rounded-xl py-2.5 text-sm font-semibold"
            style={{ backgroundColor: COLORS.text, color: "#fff" }}
          >
            Sign in
          </button>
        </form>
      </main>
    );
  }

  const [entries, ranked, totalVerified] = await Promise.all([
    db.waitlistEntry.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
      include: { referredBy: { select: { email: true } } },
    }),
    db.waitlistEntry.findMany({
      where: { status: { in: RANKED_STATUSES as unknown as ("VERIFIED" | "INVITED" | "APPROVED")[] } },
      select: { id: true, webXp: true, verifiedReferralCount: true, emailVerifiedAt: true },
      take: 10_000,
    }),
    db.waitlistEntry.count({ where: { status: { in: RANKED_STATUSES as unknown as ("VERIFIED" | "INVITED" | "APPROVED")[] } } }),
  ]);

  const rankMap = new Map<string, number>();
  [...(ranked as (Rankable & { id: string })[])].sort(compareRank).forEach((r, i) => rankMap.set(r.id, i + 1));

  const rows: AdminWaitlistRow[] = entries.map((e) => ({
    id: e.id,
    email: e.email,
    name: e.name,
    role: e.role,
    status: e.status,
    webXp: e.webXp,
    verifiedReferralCount: e.verifiedReferralCount,
    referredByEmail: e.referredBy?.email ?? null,
    founderPassStatus: e.founderPassStatus,
    founderPassTier: e.founderPassTier,
    founderPassTrack: e.founderPassTrack,
    createdAt: e.createdAt.toISOString(),
    verifiedAt: e.emailVerifiedAt ? e.emailVerifiedAt.toISOString() : null,
    rank: rankMap.get(e.id) ?? null,
  }));

  return (
    <main
      className="mx-auto min-h-screen max-w-6xl space-y-6 px-6 py-10"
      style={{ backgroundColor: COLORS.bg, color: COLORS.text }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Waitlist</h1>
          <p className="text-sm" style={{ color: COLORS.textMuted }}>
            {totalVerified} verified · showing latest {rows.length}.
          </p>
        </div>
        <form action={adminLogout}>
          <button
            type="submit"
            className="rounded-lg border px-3 py-2 text-xs"
            style={{ borderColor: COLORS.border, color: COLORS.textSecondary, backgroundColor: "#fff" }}
          >
            Sign out
          </button>
        </form>
      </div>

      {rows.length === 0 ? (
        <p className="py-8 text-sm" style={{ color: COLORS.textMuted }}>
          No waitlist entries yet.
        </p>
      ) : (
        <AdminWaitlistTable rows={rows} />
      )}
    </main>
  );
}
