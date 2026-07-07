import Image from "next/image";

/**
 * Webcoin Labs wordmark. Multiple variants — pick per section background.
 *
 * - "dark"       — black glyph + purple "Labs"  (light bg)
 * - "rose"       — black glyph + rose-pink "Labs" (light bg, warm)
 * - "light"      — white "Webcoin" + blue-violet "Labs" (dark bg)
 * - "mono-black" — solid black wordmark (light bg, minimal)
 * - "mono-white" — solid white wordmark (dark bg, minimal)
 */
export type WordmarkVariant = "dark" | "rose" | "light" | "mono-black" | "mono-white";

const VARIANTS: Record<WordmarkVariant, { src: string; ratio: number }> = {
  dark: { src: "/logo/webcoin-wordmark-dark.webp", ratio: 5.588 },
  rose: { src: "/logo/webcoin-wordmark-rose.webp", ratio: 5.32 },
  light: { src: "/logo/webcoin-wordmark-light.webp", ratio: 5.68 },
  "mono-black": { src: "/logo/webcoin-mono-black.webp", ratio: 5.588 },
  "mono-white": { src: "/logo/webcoin-mono-white.webp", ratio: 5.588 },
};

export function Wordmark({
  variant = "dark",
  height = 30,
  className,
  priority,
}: {
  variant?: WordmarkVariant;
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  const { src, ratio } = VARIANTS[variant];
  return (
    <Image
      src={src}
      alt="Webcoin Labs"
      width={Math.round(height * ratio)}
      height={height}
      priority={priority}
      className={className}
      style={{ height, width: "auto" }}
    />
  );
}

/** Minimal Arc mark (svg glyph + wordmark). */
export function ArcMark({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const color = tone === "light" ? "#f5f5f7" : "#0a0a0f";
  return (
    <span className={`inline-flex items-center gap-1.5 ${className ?? ""}`}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 15 A 9 9 0 0 1 20 15" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="6.2" r="2.1" fill={color} />
      </svg>
      <span className="text-[15px] font-semibold tracking-tight" style={{ color }}>
        Arc
      </span>
    </span>
  );
}

/**
 * Shared "word art" gradient text treatment — the one stylized headline
 * accent used consistently across the site instead of ad-hoc inline spans.
 * `tone="brand"` (violet→blue) is the default; `tone="warm"` (violet→rose)
 * is reserved for the WebXP section to differentiate it visually.
 */
export function GradientText({
  children,
  tone = "brand",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "brand" | "warm";
  className?: string;
}) {
  const gradient =
    tone === "warm"
      ? "linear-gradient(120deg, #7c3aed 0%, #db2777 100%)"
      : "linear-gradient(120deg, #7c3aed 0%, #2563eb 100%)";
  return (
    <span className={`bg-clip-text text-transparent ${className}`} style={{ backgroundImage: gradient }}>
      {children}
    </span>
  );
}
