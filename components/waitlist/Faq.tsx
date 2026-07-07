"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { COLORS, EASE } from "@/lib/waitlist/tokens";

const FAQS = [
  {
    q: "How long will the waitlist last?",
    a: "The waitlist will remain open for 20 days during the early-access launch window.",
  },
  {
    q: "How much WebXP do I get for joining?",
    a: "For the first 7 days, verified users get 100 WebXP for joining. After that, verified users get 50 WebXP for joining.",
  },
  {
    q: "How much WebXP do I get for referrals?",
    a: "For the first 7 days, each verified referral gives 20 WebXP. After the first 7 days, each verified referral gives 10 WebXP.",
  },
  {
    q: "Does WebXP have token or airdrop value?",
    a: "No. WebXP is a promotional in-app points system. It has no monetary value, no token value, no airdrop value, and no financial rights.",
  },
  {
    q: "Who should join?",
    a: "Founders, builders, VCs, advisors, and people building serious products, startups, projects, or careers.",
  },
  {
    q: "Do referrals count immediately?",
    a: "No. Referrals count only after the referred user verifies their email.",
  },
  {
    q: "What is the Founder Pass?",
    a: "Founder Pass is an in-app access credential for selected founders and builders. During beta, eligibility is focused on Arc and Base builders.",
  },
  {
    q: "What networks are eligible for Founder Pass beta?",
    a: "Arc and Base are eligible during beta. More tracks are coming soon.",
  },
  {
    q: "Does Founder Pass have monetary value?",
    a: "No. Founder Pass is an access credential inside Webcoin Labs. It has no monetary value, no token value, no airdrop value, and does not represent ownership, investment, or financial rights.",
  },
  {
    q: "Do I need a business email?",
    a: "You can use a personal or business email. Use the email you want connected to your Webcoin Labs access.",
  },
];

function Item({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: (i % 8) * 0.04, ease: EASE }}
      className="overflow-hidden rounded-2xl border"
      style={{ borderColor: COLORS.border, backgroundColor: "#fff" }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="text-[14.5px] font-semibold" style={{ color: COLORS.text }}>
          {q}
        </span>
        <span
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border"
          style={{
            borderColor: COLORS.border,
            color: open ? "#fff" : COLORS.textSecondary,
            backgroundColor: open ? COLORS.text : "transparent",
          }}
        >
          {open ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="c"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <p
              className="border-t px-5 py-4 text-[13.5px] leading-6"
              style={{ borderColor: COLORS.border, color: COLORS.textSecondary }}
            >
              {a}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

export function Faq() {
  return (
    <section id="faq" className="py-24" style={{ backgroundColor: COLORS.bgAlt }}>
      <div className="container mx-auto max-w-3xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-[2.7rem] md:leading-[1.05]" style={{ color: COLORS.text }}>
            Frequently asked.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-6" style={{ color: COLORS.textSecondary }}>
            Everything you need before joining.
          </p>
        </div>

        <div className="mt-10 grid gap-3">
          {FAQS.map((f, i) => (
            <Item key={f.q} q={f.q} a={f.a} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
