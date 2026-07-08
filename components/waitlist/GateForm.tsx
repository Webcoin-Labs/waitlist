"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, ArrowRight } from "lucide-react";
import { Wordmark } from "./Brand";
import { unlockSite } from "@/app/actions/siteAccess";
import { COLORS, EASE } from "@/lib/waitlist/tokens";

export function GateForm({ next }: { next: string }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const formData = new FormData();
      formData.set("code", code);
      const res = await unlockSite(formData);
      if (res.success) {
        router.push(next);
        router.refresh();
      } else {
        setError(res.error ?? "Incorrect code.");
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="mx-auto w-full max-w-sm rounded-3xl border p-8 text-center"
      style={{ borderColor: COLORS.border, backgroundColor: "#fff", boxShadow: "0 30px 70px -40px rgba(11,10,18,0.2)" }}
    >
      <Wordmark variant="dark" height={22} className="mx-auto" />

      <div className="mx-auto mt-6 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: COLORS.surfaceMuted }}>
        <Lock className="h-5 w-5" style={{ color: COLORS.accentDeep }} />
      </div>
      <h1 className="mt-4 text-xl font-bold tracking-tight" style={{ color: COLORS.text }}>
        Private preview.
      </h1>
      <p className="mt-2 text-[13.5px] leading-6" style={{ color: COLORS.textSecondary }}>
        Enter your access code to continue.
      </p>

      <form onSubmit={submit} className="mt-6">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="ACCESS CODE"
          autoFocus
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          className="w-full rounded-xl border px-4 py-3 text-center text-[15px] font-semibold tracking-[0.3em] outline-none"
          style={{ borderColor: error ? COLORS.red : COLORS.border, color: COLORS.text, backgroundColor: COLORS.surfaceMuted }}
        />
        {error ? (
          <p className="mt-2 text-[12.5px]" style={{ color: COLORS.red }}>
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={isPending || !code}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          style={{ backgroundColor: COLORS.text, color: "#fff" }}
        >
          {isPending ? "Checking..." : "Continue"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </motion.div>
  );
}
