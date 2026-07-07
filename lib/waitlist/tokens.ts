/**
 * Art direction — light-first, Arc/YC-inspired.
 * White/off-white base with a single violet accent used sparingly. Two
 * deliberate dark "islands" (the Founder Pass panel, the WebXP rules card, the status
 * page position panel) punch through the light page for contrast — everything
 * else reads clean and bright, matching the reference direction.
 */
export const COLORS = {
  // ── Page surfaces (light-first)
  bg: "#f8f7fb",              // warm off-white page bg (faint violet tint)
  bgAlt: "#f4f3f8",           // slightly deeper off-white for section breaks
  bgSlate: "#eef0f4",         // neutral slate section bg
  surface: "#ffffff",         // card surface
  surfaceMuted: "#fbfbfd",    // subtle card surface

  // ── Borders (light)
  border: "#e6e5ee",
  borderStrong: "#d8d6e6",
  borderAccent: "rgba(124,58,237,0.35)",

  // ── Text (dark ink on light bg)
  text: "#0b0a12",
  textSecondary: "#4b4a58",
  textMuted: "#79778a",
  textFaint: "#a3a1b3",

  // ── Accents (used sparingly)
  accent: "#7c3aed",          // violet — brand primary
  accentDeep: "#6d28d9",
  accentCool: "#0e7490",      // deep teal — reads on white (bright cyan washes out)
  accentRose: "#db2777",
  accentWarm: "#c2410c",

  // ── Status
  green: "#059669",
  amber: "#b45309",
  red: "#dc2626",

  // ── DARK islands (Founder Pass panel, WebXP rules card, status position panel)
  darkBg: "#0a0a0f",
  darkBgNavy: "#0a1024",
  darkSurface: "#12121a",
  darkText: "#f5f5f7",
  darkTextSecondary: "rgba(245,245,247,0.62)",
  darkTextMuted: "rgba(245,245,247,0.42)",
  darkBorder: "rgba(255,255,255,0.1)",
  darkBorderStrong: "rgba(255,255,255,0.16)",
} as const;

export const EASE = [0.22, 1, 0.36, 1] as const;

export const GRAD = {
  // Brand gradient text — tuned for LIGHT backgrounds (darker stops so it stays legible on white)
  brand: "linear-gradient(120deg, #7c3aed 0%, #2563eb 100%)",
  brandWarm: "linear-gradient(120deg, #7c3aed 0%, #db2777 100%)",

  // Dark-island gradient (Founder Pass panel, WebXP rules card)
  darkIsland: "linear-gradient(160deg, #0a1024 0%, #14102b 60%, #0a0a10 100%)",

  // Hero mesh — soft light backdrop
  heroMesh:
    "radial-gradient(1000px 560px at 15% -6%, rgba(124,58,237,0.10), transparent 60%), radial-gradient(760px 420px at 92% 8%, rgba(37,99,235,0.08), transparent 60%), linear-gradient(180deg, #f8f7fb 0%, #f4f3f8 100%)",

  panel: "linear-gradient(180deg, rgba(10,10,15,0.03), rgba(10,10,15,0.01))",
} as const;
