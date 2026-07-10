"use client";

import { motion } from "framer-motion";
import { COLORS } from "@/lib/waitlist/tokens";

const PARTNERS = [
  { name: "MoonLift Capital", src: "/partners/192-Text-Black-Background.jpg" },
  { name: "HashVerse Capital", src: "/partners/3_23_2022-2_35_45-PM%20(1)-Photoroom.png" },
  { name: "Altava", src: "/partners/AltavaGroup_LogoMark_onLight.png" },
  { name: "Bitbrawl", src: "/partners/Bitbrawl_Logo.png" },
  { name: "Corite", src: "/partners/Corite%20CO-logo-rgb-2000px.png" },
  { name: "NUNU Spirits", src: "/partners/Picsart_22-02-24_17-58-30-238-1024x1024-1-300x300.png" },
  { name: "Startfi", src: "/partners/Picsart_22-02-28_09-00-44-940-1024x1024-1-Photoroom.png" },
  { name: "Drunk Robots", src: "/partners/Picsart_22-03-13_11-53-16-173-1024x1024-1-300x300-Photoroom.png" },
  { name: "Dreamboat Capital", src: "/partners/Picsart_22-03-16_20-30-40-335-1024x1024-1-Photoroom.png" },
  { name: "LaunchZone InnoX", src: "/partners/Picsart_22-03-21_18-56-15-533-1024x1024-1-Photoroom.png" },
  { name: "Bitrue", src: "/partners/Picsart_22-03-21_20-16-08-782-1024x1024-1-Photoroom.png" },
  { name: "HG", src: "/partners/Picsart_22-03-29_07-45-59-617-1024x1024-1-Photoroom.png" },
  { name: "Solv", src: "/partners/Solv-Logo1.png" },
  { name: "BitMart", src: "/partners/logo-black-h.png" },
  { name: "YZiLabs", src: "/partners/logo.png" },
] as const;

function LogoCard({ name, src }: { name: string; src: string }) {
  return (
    <div
      className="group flex h-14 w-[140px] shrink-0 items-center justify-center rounded-xl border px-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-24px_rgba(11,10,18,0.35)] sm:h-16 sm:w-[168px] sm:rounded-2xl sm:px-5"
      style={{ borderColor: COLORS.border, backgroundColor: "#fff", boxShadow: "0 1px 2px rgba(11,10,18,0.03)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={name} className="max-h-7 w-auto max-w-full object-contain sm:max-h-9" />
    </div>
  );
}

export function PartnerStrip() {
  const loop = [...PARTNERS, ...PARTNERS];

  return (
    <section className="border-y py-9 sm:py-14" style={{ borderColor: COLORS.border, backgroundColor: COLORS.bgAlt }}>
      <div className="container mx-auto max-w-6xl px-6 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: COLORS.textMuted }}>
          Trusted across the Web3 ecosystem
        </p>
      </div>

      <div className="relative mt-5 overflow-hidden sm:mt-8" style={{ maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)" }}>
        <motion.div
          className="flex w-max gap-3 sm:gap-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
        >
          {loop.map((partner, i) => (
            <LogoCard key={`${partner.name}-${i}`} name={partner.name} src={partner.src} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
