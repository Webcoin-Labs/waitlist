"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
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
  { name: "Solv", src: "/partners/Solv-Logo_Black.svg" },
  { name: "BitMart", src: "/partners/logo-black-h.png" },
  { name: "YZiLabs", src: "/partners/logo.png" },
  { name: "ArkStream Capital", src: "/partners/Logo+F+300.webp" },
  { name: "Deviation Capital", src: "/partners/Deviation-Lockup-Dark-Multi_Color-3-768x226.webp" },
  { name: "MH Ventures", src: "/partners/Screenshot_2026-07-11_031949-removebg-preview.png" },
  { name: "Electric Capital", src: "/partners/wordmark%20black.svg" },
  { name: "Maven", src: "/partners/maven-w.svg" },
  { name: "Infinite", src: "/partners/6a1de1bce8bd04b9e05333b8_LogoGray-01.svg" },
  { name: "Bybit", src: "/partners/bybit-logo.svg" },
  { name: "Gate.io", src: "/partners/full-gate.io-logo.svg" },
  { name: "MEXC", src: "/partners/full-mexc-logo.svg" },
] as const;

const TECH_PARTNERS = [
  { name: "Google Cloud", src: "/partners/Google%20Cloud.svg" },
  { name: "NVIDIA", src: "/partners/NVIDIA_logo.svg.webp" },
  { name: "Cloudflare", src: "/partners/cloudflare-seeklogo.svg" },
] as const;

type Partner = (typeof PARTNERS)[number];

const LOGO_SHADOW = "drop-shadow(0 3px 8px rgba(11,10,18,0.12))";
const RIBBON_TILT = -8; // degrees — the "///" lean

// Each column rotates its start point through the full partner list so the
// two columns never show the same logo at the same height, and each moves
// at a slightly different speed so they never fall into visible lockstep.
const RIBBON_COLUMNS = [
  { offset: 0, direction: "down" as const, duration: 38 },
  { offset: 9, direction: "up" as const, duration: 44 },
];

function rotateArray<T>(arr: readonly T[], offset: number): T[] {
  const at = offset % arr.length;
  return [...arr.slice(at), ...arr.slice(0, at)];
}

function RibbonColumn({ items, direction, duration, reduce }: { items: Partner[]; direction: "up" | "down"; duration: number; reduce: boolean | null }) {
  const loop = [...items, ...items];
  const anim = direction === "down" ? { y: ["-50%", "0%"] } : { y: ["0%", "-50%"] };

  return (
    <div className="h-full w-[148px] shrink-0 overflow-hidden">
      <motion.div
        className="flex flex-col gap-7 py-2"
        animate={reduce ? undefined : anim}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {loop.map((partner, i) => (
          <div key={`${partner.name}-${i}`} className="flex h-14 w-full items-center justify-center" style={{ transform: `rotate(${-RIBBON_TILT}deg)` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={partner.src} alt={partner.name} className="max-h-full w-auto max-w-full object-contain" style={{ filter: LOGO_SHADOW }} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/** Desktop: 3 tilted vertical marquee columns, each a straight infinite scroll
 * (the same proven technique as the mobile ScrollingRow, just rotated 90°) —
 * no per-item depth math, so there's no overlap or crowding to fight. */
function NetworkRibbon() {
  return (
    <div
      aria-hidden="true"
      className="relative my-auto flex h-[292px] w-[86px] shrink-0 flex-col items-center overflow-hidden border border-slate-700 bg-slate-950 px-3 py-7 text-center text-white shadow-xl"
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 91%, 50% 100%, 0 91%)" }}
    >
      <div className="size-2 rounded-full bg-blue-400" />
      <span className="mt-5 text-[10px] font-semibold uppercase leading-4 text-slate-300">The operator network</span>
      <span className="mt-auto text-2xl font-semibold tabular-nums">100+</span>
      <span className="mt-1 text-[9px] font-semibold uppercase leading-4 text-blue-300">Global partners</span>
      <div className="mt-5 h-px w-8 bg-slate-700" />
    </div>
  );
}

function RibbonWall() {
  const wallRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(wallRef, { margin: "160px 0px" });
  const reduce = useReducedMotion();

  return (
    <div
      ref={wallRef}
      className="relative hidden h-[420px] overflow-hidden lg:block"
      style={{
        maskImage: "linear-gradient(180deg, transparent 0%, black 14%, black 86%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 14%, black 86%, transparent 100%)",
      }}
    >
      <div className="absolute inset-[-14%] flex items-stretch justify-center gap-4" style={{ transform: `rotate(${RIBBON_TILT}deg)` }}>
        <RibbonColumn
          items={rotateArray(PARTNERS, RIBBON_COLUMNS[0].offset)}
          direction={RIBBON_COLUMNS[0].direction}
          duration={RIBBON_COLUMNS[0].duration}
          reduce={reduce || !isInView}
        />
        <NetworkRibbon />
        <RibbonColumn
          items={rotateArray(PARTNERS, RIBBON_COLUMNS[1].offset)}
          direction={RIBBON_COLUMNS[1].direction}
          duration={RIBBON_COLUMNS[1].duration}
          reduce={reduce || !isInView}
        />
      </div>
    </div>
  );
}

function ScrollingRow() {
  const loop = [...PARTNERS, ...PARTNERS];

  return (
    <div className="relative overflow-hidden lg:hidden" style={{ maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)" }}>
      <motion.div
        className="flex w-max items-center gap-9 py-2"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
      >
        {loop.map((partner, i) => (
          <div key={`${partner.name}-${i}`} className="flex h-9 w-[110px] shrink-0 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={partner.src} alt={partner.name} className="max-h-full w-auto max-w-full object-contain" style={{ filter: LOGO_SHADOW }} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function PartnerStrip() {
  return (
    <section className="overflow-hidden border-y py-9 sm:py-12" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgAlt }}>
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center lg:hidden">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: COLORS.textMuted }}>
            Trusted By Over 100+ Global Partners
          </p>
        </div>

        <div className="hidden items-center gap-8 lg:grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.15fr)]">
          <div className="relative py-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/webcoin-wordmark-dark.webp" alt="Webcoin Labs" className="mb-8 h-14 w-auto object-contain" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: COLORS.textMuted }}>
              Trusted by over 100+ global partners
            </p>
            <h2 className="mt-5 max-w-md text-balance text-4xl font-semibold leading-tight text-slate-950">
              The network behind ambitious builders.
            </h2>
            <p className="mt-5 max-w-md text-pretty text-base leading-7" style={{ color: COLORS.textSecondary }}>
              Exchanges, funds, studios, and ecosystems building alongside Webcoin Labs founders and builders.
            </p>
            <div className="mt-7 flex w-fit items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
              <span className="size-2 rounded-full bg-blue-500" />
              <span className="text-xs font-semibold uppercase text-slate-700">Ecosystem network</span>
            </div>
          </div>
          <RibbonWall />
        </div>
      </div>

      <div className="mt-5 sm:mt-6">
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
