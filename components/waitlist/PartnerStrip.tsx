"use client";

import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { COLORS } from "@/lib/waitlist/tokens";

const PARTNERS = [
  { name: "HashVerse Capital", src: "/partners/3_23_2022-2_35_45-PM%20(1)-Photoroom.png" },
  { name: "Binance", src: "/partners/Binance_logo.svg" },
  { name: "Bitget", src: "/partners/Bitget.svg" },
  { name: "Altava", src: "/partners/AltavaGroup_LogoMark_onLight.png" },
  { name: "Bitbrawl", src: "/partners/Bitbrawl_Logo.png" },
  { name: "Corite", src: "/partners/Corite%20CO-logo-rgb-2000px.png" },
  { name: "Startfi", src: "/partners/Picsart_22-02-28_09-00-44-940-1024x1024-1-Photoroom.png" },
  { name: "Drunk Robots", src: "/partners/Picsart_22-03-13_11-53-16-173-1024x1024-1-300x300-Photoroom.png" },
  { name: "Dreamboat Capital", src: "/partners/Picsart_22-03-16_20-30-40-335-1024x1024-1-Photoroom.png" },
  { name: "LaunchZone InnoX", src: "/partners/Picsart_22-03-21_18-56-15-533-1024x1024-1-Photoroom.png" },
  { name: "HG", src: "/partners/Picsart_22-03-29_07-45-59-617-1024x1024-1-Photoroom.png" },
  { name: "Solv", src: "/partners/Solv-Logo1.png" },
  { name: "BitMart", src: "/partners/logo-black-h.png" },
  { name: "YZiLabs", src: "/partners/logo.png" },
  { name: "ArkStream Capital", src: "/partners/Logo+F+300.webp" },
  { name: "Deviation Capital", src: "/partners/Deviation-Lockup-Dark-Multi_Color-3-768x226.webp" },
  { name: "MH Ventures", src: "/partners/Screenshot_2026-07-11_031949-removebg-preview.png" },
] as const;

const TECH_PARTNERS = [
  { name: "Google Cloud", src: "/partners/Google%20Cloud.svg" },
  { name: "NVIDIA", src: "/partners/NVIDIA_logo.svg.webp" },
] as const;

type Partner = (typeof PARTNERS)[number];

const ORBIT_SECONDS = 46; // one full lap
const RX = 47; // horizontal radius, % of container — flat, near full-bleed oval
const RY = 33; // vertical radius, % of container — well under RX so it reads as an oval, not a circle

/**
 * Even-angle spacing on an ellipse bunches points at the left/right tips (where
 * dx/dtheta -> 0) and starves the top/bottom of items — that's the "empty middle,
 * clumped sides" bug from the last version. Fix: walk the ellipse's actual arc
 * length and pick angles that divide the PERIMETER evenly, not the angle. Rigidly
 * rotating this fixed set later preserves perfect spacing at every instant.
 */
function evenAnglesByArcLength(n: number, rx: number, ry: number): number[] {
  const STEPS = 1440;
  const dTheta = (Math.PI * 2) / STEPS;
  const cumulative = [0];
  for (let i = 1; i <= STEPS; i++) {
    const t = i * dTheta;
    const dx = -rx * Math.sin(t);
    const dy = ry * Math.cos(t);
    cumulative.push(cumulative[i - 1] + Math.sqrt(dx * dx + dy * dy) * dTheta);
  }
  const total = cumulative[STEPS];
  const angles: number[] = [];
  for (let i = 0; i < n; i++) {
    const target = (i / n) * total;
    let lo = 0;
    let hi = STEPS;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cumulative[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    angles.push(lo * dTheta);
  }
  return angles;
}

const BASE_ANGLES = evenAnglesByArcLength(PARTNERS.length, RX, RY);
// Small fixed per-card tilt so logos read as placed cards, not a rigid grid —
// static personality, independent of the orbit motion itself.
const CARD_TILT = PARTNERS.map((_, i) => ((i * 47) % 9) - 4);

/** One logo card riding the oval track. Front (bottom of the ellipse) renders
 * big and fully opaque; the back (top) shrinks and fades — a simple 3D ring. */
function OrbitCard({ partner, angleOffset, tilt, progress }: { partner: Partner; angleOffset: number; tilt: number; progress: MotionValue<number> }) {
  const angle = useTransform(progress, (p) => p + angleOffset);
  const left = useTransform(angle, (a) => `${50 + RX * Math.cos(a)}%`);
  const top = useTransform(angle, (a) => `${50 + RY * Math.sin(a)}%`);
  const depth = useTransform(angle, (a) => (Math.sin(a) + 1) / 2); // 0 = back, 1 = front
  const scale = useTransform(depth, (d) => 0.58 + 0.52 * d);
  const opacity = useTransform(depth, (d) => 0.45 + 0.55 * d);
  const zIndex = useTransform(depth, (d) => Math.round(d * 20));

  return (
    <motion.div
      className="absolute flex h-[74px] w-[124px] items-center justify-center"
      style={{ left, top, translateX: "-50%", translateY: "-50%", scale, opacity, zIndex, rotate: tilt }}
    >
      <div
        className="flex h-full w-full items-center justify-center rounded-2xl border bg-white px-4 py-3"
        style={{ borderColor: COLORS.border, boxShadow: "0 10px 26px -14px rgba(11,10,18,0.28)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={partner.src} alt={partner.name} className="max-h-full w-auto max-w-full object-contain" />
      </div>
    </motion.div>
  );
}

function OrbitCarousel() {
  const reduce = useReducedMotion();
  const progress = useMotionValue(0);

  useAnimationFrame((t) => {
    if (reduce) return;
    progress.set((t / (ORBIT_SECONDS * 1000)) * Math.PI * 2);
  });

  return (
    <div className="relative mx-auto hidden h-[300px] w-full overflow-hidden lg:block">
      <div className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo/webcoin-mark-dark.webp" alt="" aria-hidden className="mx-auto h-9 w-auto opacity-70" />
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.24em]" style={{ color: COLORS.textFaint }}>
          Web3 ecosystem
        </p>
      </div>
      {PARTNERS.map((partner, i) => (
        <OrbitCard key={partner.name} partner={partner} angleOffset={BASE_ANGLES[i]} tilt={CARD_TILT[i]} progress={progress} />
      ))}
    </div>
  );
}

function ScrollingRow() {
  const loop = [...PARTNERS, ...PARTNERS];

  return (
    <div className="relative overflow-hidden lg:hidden" style={{ maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)" }}>
      <motion.div
        className="flex w-max items-center gap-3 py-2"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
      >
        {loop.map((partner, i) => (
          <div
            key={`${partner.name}-${i}`}
            className="flex h-16 w-[124px] shrink-0 items-center justify-center rounded-2xl border bg-white px-3.5 py-2.5"
            style={{ borderColor: COLORS.border, boxShadow: "0 6px 18px -12px rgba(11,10,18,0.22)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={partner.src} alt={partner.name} className="max-h-full w-auto max-w-full object-contain" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function PartnerStrip() {
  return (
    <section className="overflow-hidden border-y py-9 sm:py-12" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgAlt }}>
      <div className="container mx-auto max-w-6xl px-6 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: COLORS.textMuted }}>
          Trusted across the Web3 ecosystem
        </p>
      </div>

      <div className="mt-5 sm:mt-6">
        <OrbitCarousel />
        <ScrollingRow />
      </div>

      <div className="container mx-auto mt-8 max-w-4xl px-6 sm:mt-9">
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: COLORS.textFaint }}>
          Technology partners
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-12 sm:gap-16">
          {TECH_PARTNERS.map((partner) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={partner.name} src={partner.src} alt={partner.name} className="h-8 w-auto object-contain sm:h-9" />
          ))}
        </div>
      </div>
    </section>
  );
}
