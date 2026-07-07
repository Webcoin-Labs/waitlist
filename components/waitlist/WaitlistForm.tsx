"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { joinWaitlist } from "@/app/actions/waitlist";
import { COLORS } from "@/lib/waitlist/tokens";

export function WaitlistForm({
  referralCode,
  onFocusChange,
}: {
  referralCode?: string;
  onFocusChange?: (focused: boolean) => void;
  /** @deprecated the site is light-first now; kept optional for old call sites. */
  theme?: "dark" | "light";
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const submit = () => {
    setError("");
    startTransition(async () => {
      const fd = new FormData();
      fd.set("email", email);
      if (referralCode) fd.set("ref", referralCode);
      if (typeof window !== "undefined") {
        const p = new URLSearchParams(window.location.search);
        if (p.get("utm_source")) fd.set("utmSource", p.get("utm_source") ?? "");
        if (p.get("utm_medium")) fd.set("utmMedium", p.get("utm_medium") ?? "");
        if (p.get("utm_campaign")) fd.set("utmCampaign", p.get("utm_campaign") ?? "");
      }
      const res = await joinWaitlist(fd);
      if (!res.success) {
        setError(res.error);
        return;
      }
      if (res.alreadyVerified && res.referralCode) {
        router.push(`/status?c=${res.referralCode}`);
        return;
      }
      router.push(`/verify?e=${encodeURIComponent(res.email)}`);
    });
  };

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex flex-col gap-2 rounded-[22px] border p-2.5 transition-shadow duration-300 focus-within:shadow-[0_0_0_5px_rgba(124,58,237,0.14)] sm:flex-row sm:items-center"
        style={{
          borderColor: COLORS.border,
          backgroundColor: "#fff",
          boxShadow: "0 24px 60px -30px rgba(11,10,18,0.18)",
        }}
      >
        <div className="flex-1 px-3.5 py-2.5 text-left">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => onFocusChange?.(true)}
            onBlur={() => onFocusChange?.(false)}
            placeholder="Enter your email to get started"
            className="w-full bg-transparent text-[15px] outline-none sm:text-[16px]"
            style={{ color: COLORS.text }}
            autoComplete="email"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="group inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70"
          style={{ backgroundColor: COLORS.text, color: "#fff", boxShadow: "0 10px 24px -12px rgba(11,10,18,0.5)" }}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isPending ? "Joining…" : "Join Waitlist"}
          {!isPending ? <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /> : null}
        </button>
      </form>

      {error ? (
        <p className="mt-3 text-center text-[13px]" style={{ color: COLORS.red }}>
          {error}
        </p>
      ) : (
        <div className="mt-3 flex flex-col items-center gap-1 text-center">
          <p className="text-[13.5px] font-semibold" style={{ color: COLORS.text }}>
            Verify your email to activate your WebXP and waitlist position.
          </p>
          <p className="text-[13px] font-medium" style={{ color: COLORS.textSecondary }}>
            Get{" "}
            <span className="font-bold" style={{ color: COLORS.accentDeep }}>
              +100 WebXP
            </span>{" "}
            after verifying your email.
          </p>
        </div>
      )}
    </div>
  );
}
