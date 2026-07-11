"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { COLORS, EASE } from "@/lib/waitlist/tokens";

type FaqItemData = {
  id: string;
  question: string;
  answer: string;
};

type FaqGroup = {
  id: string;
  number: string;
  label: string;
  description: string;
  items: FaqItemData[];
};

const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "faq-start-here",
    number: "01",
    label: "Start here",
    description: "The basics of joining Webcoin Labs.",
    items: [
      {
        id: "what-is-webcoin-labs",
        question: "What is Webcoin Labs?",
        answer:
          "Webcoin Labs is an early-access operating layer for founders, builders, investors, and advisors. It brings together verified profiles, launch support, builder discovery, advisor visibility, introduction requests, and private dashboard tools in one place. The waitlist is the entry point while the product is being opened in stages.",
      },
      {
        id: "who-should-join",
        question: "Who is the waitlist for?",
        answer:
          "Founders building serious companies, builders with real projects, investors looking for structured founder discovery, and advisors who can help with execution are all welcome. Choose the role that best describes your goal; it helps us show the most relevant access path and product updates.",
      },
      {
        id: "what-happens-after-joining",
        question: "What happens after I join?",
        answer:
          "You submit your email, choose a role, and can optionally add a referral code. After you verify the email we send, your private status dashboard becomes available with Credits, referral progress, rank signals, and any current tasks or access updates. Joining is consideration for early access, not a guarantee of an invitation or pass.",
      },
    ],
  },
  {
    id: "faq-webxp",
    number: "02",
    label: "Credits & referrals",
    description: "How early-access points and referrals work.",
    items: [
      {
        id: "how-webxp-works",
        question: "How are Credits awarded?",
        answer:
          "Credits are awarded only after the relevant action is verified. During the first eight days, a verified signup gives +100 Credits and each verified referral gives +50 Credits. After that launch window, the standard amounts are +50 Credits for signup and +10 Credits per verified referral; joining later is still useful for dashboard and beta consideration.",
      },
      {
        id: "when-referrals-count",
        question: "When does a referral count?",
        answer:
          "A referral counts only when the invited person uses your referral code or link, completes their signup, and verifies their email. An unverified signup does not create referral credit, and the referred person must be a valid new waitlist entry. This keeps ranking signals based on confirmed participation rather than clicks alone.",
      },
      {
        id: "webxp-value",
        question: "Do Credits have monetary, token, or airdrop value?",
        answer:
          "No. Credits are a promotional in-app points and priority signal only. They have no monetary value, token value, airdrop value, ownership value, investment value, or financial rights. They cannot be bought, sold, redeemed for cash, or treated as a promise of future distribution.",
      },
    ],
  },
  {
    id: "faq-passes",
    number: "03",
    label: "Passes & eligibility",
    description: "What Founder Pass and Builder Pass mean.",
    items: [
      {
        id: "founder-pass",
        question: "What is Founder Pass?",
        answer:
          "Founder Pass is an invite-only access credential for founders building serious startups. It is intended to unlock curated founder tools such as builder discovery, co-founder visibility, investor-readiness support, funding support, advisor discovery, and marketing or distribution advantages. Invitations are considered after beta launch and are not automatic.",
      },
      {
        id: "builder-pass",
        question: "What is Builder Pass?",
        answer:
          "Builder Pass is a proof-based access credential for builders shipping on selected ecosystems. It is designed to recognize real execution such as mini apps, deployed contracts, GitHub projects, and ecosystem contributions, rather than relying only on self-description. The beta currently focuses on builders working across Arc and Base.",
      },
      {
        id: "builder-pass-eligibility",
        question: "How is Builder Pass eligibility evaluated?",
        answer:
          "Builder Pass recognizes verifiable execution such as mini apps, deployed contracts, GitHub projects, and ecosystem contributions. Arc and Base are the current beta tracks; other ecosystems may be added later. Criteria can change as the review process develops, and the pass is an access credential with no monetary, token, airdrop, ownership, or investment value.",
      },
    ],
  },
  {
    id: "faq-access",
    number: "04",
    label: "Account & access",
    description: "Verification, email, dashboard, and privacy questions.",
    items: [
      {
        id: "email-requirements",
        question: "Do I need a business email?",
        answer:
          "Founders, builders, and advisors can generally use the email they want connected to their Webcoin Labs access. Investors must use a registered firm or work email so investor access can be reviewed in the right context; common free personal inboxes are not accepted for that role.",
      },
      {
        id: "verification-email",
        question: "What if I do not receive the verification email?",
        answer:
          "Check spam, promotions, or filtered folders first, then confirm the address you entered. The verification flow supports resending the message for an existing pending entry; using the same email lets the system find that entry instead of creating confusion with multiple accounts.",
      },
      {
        id: "dashboard-access",
        question: "What can I see in the private dashboard?",
        answer:
          "After verification, the dashboard can show Credits, waitlist position or ranking signals, verified referrals, your referral link, task progress, and pass status when available. The preview on this page is illustrative; the live dashboard is connected to your verified entry and is protected by a separate access token. Do not share that private dashboard link.",
      },
    ],
  },
];

function FaqItem({ item, index, defaultOpen = false }: { item: FaqItemData; index: number; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const answerId = `${item.id}-answer`;
  const questionId = `${item.id}-question`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: (index % 5) * 0.035, ease: EASE }}
      className="border-t first:border-t-0"
      style={{ borderColor: COLORS.border }}
    >
      <h3>
        <button
          id={questionId}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={answerId}
          className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-[#fbfbfd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#7c3aed] sm:px-5 sm:py-4"
        >
          <span className="flex min-w-0 items-start gap-3">
            <span className="pt-0.5 text-[11px] font-semibold tabular-nums" style={{ color: COLORS.accentDeep }}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-[14px] font-semibold leading-5" style={{ color: COLORS.text }}>
              {item.question}
            </span>
          </span>
          <span
            aria-hidden
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border"
            style={{ borderColor: open ? COLORS.accent : COLORS.border, color: open ? COLORS.accent : COLORS.textMuted }}
          >
            {open ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
          </span>
        </button>
      </h3>

      {open ? (
        <div id={answerId} role="region" aria-labelledby={questionId} className="px-4 pb-5 pl-12 sm:px-5 sm:pb-5 sm:pl-[4.1rem]">
          <p className="max-w-2xl text-pretty text-[13.5px] leading-6" style={{ color: COLORS.textSecondary }}>
            {item.answer}
          </p>
        </div>
      ) : null}
    </motion.article>
  );
}

export function Faq() {
  return (
    <section id="faq" className="border-t py-12 sm:py-16 lg:py-20" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgAlt }}>
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid gap-6 sm:gap-9 lg:grid-cols-[minmax(220px,0.7fr)_minmax(0,1.3fr)] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase" style={{ color: COLORS.accentDeep }}>
              <span className="h-px w-8" style={{ backgroundColor: COLORS.accent }} />
              FAQ / Field guide
            </p>
            <h2 className="mt-4 text-balance text-[2rem] font-semibold leading-[1.05] tracking-tight sm:mt-5 sm:text-4xl sm:leading-[1.02] md:text-[3.35rem]" style={{ color: COLORS.text }}>
              Know what happens next.
            </h2>
            <p className="mt-3 max-w-sm text-pretty text-[13.5px] leading-6 sm:mt-5 sm:text-[15px] sm:leading-7" style={{ color: COLORS.textSecondary }}>
              Clear answers about joining, verification, Credits, passes, referrals, and private dashboard access.
            </p>

            <nav className="mt-6 hidden border-l lg:block" style={{ borderColor: COLORS.border }} aria-label="FAQ topics">
              {FAQ_GROUPS.map((group) => (
                <a
                  key={group.id}
                  href={`#${group.id}`}
                  className="group block border-l-2 py-2 pl-4 text-[13px] transition-colors hover:border-[#7c3aed]"
                  style={{ borderColor: "transparent", color: COLORS.textMuted }}
                >
                  <span className="block font-semibold" style={{ color: COLORS.textSecondary }}>
                    {group.number} / {group.label}
                  </span>
                  <span className="mt-0.5 block text-[12px]">{group.description}</span>
                </a>
              ))}
            </nav>
          </div>

          <div className="grid gap-3">
            {FAQ_GROUPS.map((group) => (
              <section key={group.id} id={group.id} className="scroll-mt-24 overflow-hidden rounded-xl border bg-white shadow-sm sm:rounded-2xl" style={{ borderColor: COLORS.border }}>
                <div className="flex items-start justify-between gap-5 border-b px-4 py-4 sm:px-5" style={{ borderColor: COLORS.border }}>
                  <div>
                    <p className="text-[11px] font-semibold uppercase" style={{ color: COLORS.accentDeep }}>
                      {group.number} / {group.label}
                    </p>
                    <p className="mt-1 text-[13px]" style={{ color: COLORS.textMuted }}>
                      {group.description}
                    </p>
                  </div>
                  <span className="hidden rounded-full border px-2.5 py-1 text-[10px] font-semibold tabular-nums sm:inline-flex" style={{ borderColor: COLORS.border, color: COLORS.textMuted }}>
                    {String(group.items.length).padStart(2, "0")} answers
                  </span>
                </div>

                <div>
                  {group.items.map((item, index) => (
                    <FaqItem key={item.id} item={item} index={index} />
                  ))}
                </div>
              </section>
            ))}

            <p className="border-l-2 pl-4 text-[12px] leading-5" style={{ borderColor: COLORS.accent, color: COLORS.textMuted }}>
              Access, eligibility, supported networks, and product features may change as Webcoin Labs moves through beta. The most current information will appear in your verified dashboard and official product updates.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
