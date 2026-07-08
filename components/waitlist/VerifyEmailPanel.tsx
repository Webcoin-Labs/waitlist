"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Loader2, Check, Copy } from "lucide-react";
import { resendWaitlistVerification } from "@/app/actions/waitlist";
import { COLORS, EASE } from "@/lib/waitlist/tokens";

const STEPS = ["Details", "Verify email", "Dashboard access"] as const;

export function VerifyEmailPanel({ email }: { email?: string }) {
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const copyEmail = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
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
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
      className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border p-8 text-center"
      style={{
        borderColor: COLORS.border,
        backgroundColor: "#fff",
        boxShadow: "0 30px 70px -40px rgba(11,10,18,0.2)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.16), transparent 65%)" }}
      />

      <div className="relative mb-7 flex items-center justify-center gap-1.5">
        {STEPS.map((step, i) => {
          const state = i < 1 ? "done" : i === 1 ? "active" : "upcoming";
          return (
            <div key={step} className="flex items-center gap-1.5">
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
                style={{
                  backgroundColor: state === "upcoming" ? COLORS.surfaceMuted : state === "active" ? COLORS.accent : COLORS.text,
                  color: state === "upcoming" ? COLORS.textFaint : "#fff",
                  boxShadow: state === "active" ? "0 0 0 3px rgba(124,58,237,0.18)" : "none",
                }}
              >
                {state === "done" ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              {i < STEPS.length - 1 ? (
                <span className="h-px w-6" style={{ backgroundColor: state === "done" ? COLORS.text : COLORS.border }} />
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="relative">
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
          We sent a verification link. Verify to unlock WebXP and activate your waitlist position.
        </p>

        {email ? (
          <div
            className="mx-auto mt-4 flex max-w-full items-center justify-between gap-2 rounded-xl border py-2 pl-3.5 pr-2"
            style={{ borderColor: COLORS.border, backgroundColor: COLORS.surfaceMuted }}
          >
            <span className="truncate font-mono text-[13px]" style={{ color: COLORS.text }}>
              {email}
            </span>
            <button
              type="button"
              onClick={copyEmail}
              aria-label="Copy email"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-black/5"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" style={{ color: COLORS.green }} />
              ) : (
                <Copy className="h-3.5 w-3.5" style={{ color: COLORS.textMuted }} />
              )}
            </button>
          </div>
        ) : null}

        <p className="mt-3 text-[13px]" style={{ color: COLORS.textMuted }}>
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
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : sent ? (
              <Check className="h-4 w-4" style={{ color: COLORS.green }} />
            ) : null}
            {sent ? "Verification resent" : "Resend verification email"}
          </button>
        </div>

        {error ? (
          <p className="mt-3 text-[13px]" style={{ color: COLORS.red }}>
            {error}
          </p>
        ) : null}

        <p className="mt-6 text-[12px]" style={{ color: COLORS.textMuted }}>
          Entered the wrong email?{" "}
          <Link href="/" className="font-semibold underline" style={{ color: COLORS.text }}>
            Start over
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
