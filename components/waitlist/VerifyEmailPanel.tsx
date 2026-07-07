"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Mail, Loader2, Check } from "lucide-react";
import { resendWaitlistVerification } from "@/app/actions/waitlist";
import { COLORS } from "@/lib/waitlist/tokens";

export function VerifyEmailPanel({ email }: { email?: string }) {
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const resend = () => {
    if (!email) return;
    setError("");
    startTransition(async () => {
      const res = await resendWaitlistVerification(email);
      if (res.success) setSent(true);
      else setError(res.error ?? "Could not resend.");
    });
  };

  const domain = email?.split("@")[1];
  const webmail =
    domain && /gmail|googlemail/.test(domain)
      ? "https://mail.google.com"
      : domain && /outlook|hotmail|live/.test(domain)
        ? "https://outlook.live.com"
        : domain && /yahoo/.test(domain)
          ? "https://mail.yahoo.com"
          : null;

  return (
    <div
      className="mx-auto w-full max-w-md rounded-3xl border p-8 text-center"
      style={{
        borderColor: COLORS.border,
        backgroundColor: "#fff",
        boxShadow: "0 30px 70px -40px rgba(11,10,18,0.2)",
      }}
    >
      <div
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
        style={{ background: "linear-gradient(135deg, #7c3aed, #22d3ee)" }}
      >
        <Mail className="h-6 w-6 text-white" />
      </div>
      <h1 className="mt-5 text-2xl font-bold tracking-tight" style={{ color: COLORS.text }}>
        Check your inbox.
      </h1>
      <p className="mt-3 text-[15px] leading-6" style={{ color: COLORS.textSecondary }}>
        We sent a verification link
        {email ? (
          <>
            {" "}to <span className="font-semibold" style={{ color: COLORS.text }}>{email}</span>
          </>
        ) : null}
        . Verify to unlock WebXP and activate your waitlist position.
      </p>
      <p className="mt-2 text-[13px]" style={{ color: COLORS.textMuted }}>
        Check spam or promotions if you don&apos;t see it within a minute.
      </p>

      <div className="mt-6 flex flex-col gap-2">
        {webmail ? (
          <a
            href={webmail}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: COLORS.text, color: "#fff" }}
          >
            Open email app
          </a>
        ) : null}
        <button
          type="button"
          onClick={resend}
          disabled={isPending || !email || sent}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border py-3 text-sm font-semibold transition-colors disabled:opacity-60"
          style={{ borderColor: COLORS.border, color: COLORS.text, backgroundColor: COLORS.surfaceMuted }}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : sent ? <Check className="h-4 w-4" style={{ color: COLORS.green }} /> : null}
          {sent ? "Verification resent" : "Resend verification email"}
        </button>
      </div>

      {error ? <p className="mt-3 text-[13px]" style={{ color: COLORS.red }}>{error}</p> : null}

      <p className="mt-6 text-[12px]" style={{ color: COLORS.textMuted }}>
        Entered the wrong email?{" "}
        <Link href="/" className="font-semibold underline" style={{ color: COLORS.text }}>
          Start over
        </Link>
      </p>
    </div>
  );
}
