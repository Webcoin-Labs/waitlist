import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { db } from "@/lib/prisma";
import { getDisplayNameFromEmail } from "@/lib/notifications/displayName";

export const runtime = "nodejs";

const WIDTH = 1200;
const HEIGHT = 630;

async function assetDataUri(relPath: string, mime: string): Promise<string> {
  const buf = await readFile(join(process.cwd(), "public", relPath));
  return `data:${mime};base64,${buf.toString("base64")}`;
}

// Satori's SVG parser only understands inline presentation attributes — CSS
// <style>/class-based fills (like Base_lockup_white.svg uses) crash it. Strip
// the style block and swap class="..." for a direct fill so it renders.
async function svgAssetDataUri(relPath: string, fillColor = "#ffffff"): Promise<string> {
  const raw = await readFile(join(process.cwd(), "public", relPath), "utf-8");
  const cleaned = raw
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<defs>\s*<\/defs>/gi, "")
    .replace(/class="[^"]*"/gi, `fill="${fillColor}"`);
  return `data:image/svg+xml;base64,${Buffer.from(cleaned).toString("base64")}`;
}

function sanitizeRef(value: string | null): string {
  return (value ?? "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 32);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ref = sanitizeRef(searchParams.get("ref"));

  let displayName = "Founder";
  let role = "FOUNDER";

  if (ref) {
    try {
      const entry = await db.waitlistEntry.findUnique({
        where: { referralCode: ref },
        select: { name: true, email: true, role: true },
      });
      if (entry) {
        displayName = entry.name?.trim() || getDisplayNameFromEmail(entry.email) || "Founder";
        role = entry.role;
      }
    } catch {
      // A broken lookup should never break the share image — fall back to defaults.
    }
  }

  const showPass = role === "FOUNDER" || role === "BUILDER";
  const passLabel = role === "BUILDER" ? "Builder Pass" : "Founder Pass";

  const [wordmark, avatar, arcLogo, baseLogo] = await Promise.all([
    // PNG, not WebP — Satori's image decoder doesn't reliably handle WebP data URIs.
    assetDataUri("logo/webcoin-wordmark-email.png", "image/png"),
    assetDataUri("emoji/pngfind.com-default-image-png-6764065.png", "image/png"),
    svgAssetDataUri("logo/Arc_Logo_White.svg"),
    svgAssetDataUri("logo/Base_lockup_white.svg"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 56,
          backgroundColor: "#0a0a0f",
          backgroundImage: "linear-gradient(160deg, #0a1024 0%, #14102b 60%, #0a0a10 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -140,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: 420,
            backgroundColor: "rgba(124,58,237,0.16)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={wordmark} alt="" width={230} height={48} style={{ objectFit: "contain" }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.16)",
              color: "#d4d4d8",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: 8, backgroundColor: "#22d3ee", display: "flex" }} />
            Private Beta
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div
            style={{
              width: 108,
              height: 108,
              borderRadius: 108,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#a78bfa",
              padding: 4,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatar}
              alt=""
              width={100}
              height={100}
              style={{ borderRadius: 100, objectFit: "cover", backgroundColor: "#12121a" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", color: "#a78bfa", fontSize: 22, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
              {showPass ? passLabel : "Webcoin Labs Access"}
            </div>
            <div style={{ display: "flex", color: "#f5f5f7", fontSize: 52, fontWeight: 800, letterSpacing: -1, marginTop: 6 }}>
              {displayName}
            </div>
            <div style={{ display: "flex", color: "rgba(245,245,247,0.5)", fontSize: 24, marginTop: 8 }}>
              Company: —
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {showPass ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={arcLogo} alt="" height={30} style={{ objectFit: "contain" }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={baseLogo} alt="" height={26} style={{ objectFit: "contain" }} />
              </div>
              <div
                style={{
                  display: "flex",
                  color: "#c4b5fd",
                  fontSize: 20,
                  fontWeight: 700,
                  padding: "8px 18px",
                  borderRadius: 999,
                  backgroundColor: "rgba(167,139,250,0.16)",
                  border: "1px solid rgba(167,139,250,0.3)",
                }}
              >
                Eligibility: Beta review
              </div>
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(255,255,255,0.12)",
              paddingTop: 22,
            }}
          >
            <div style={{ display: "flex", color: "#f5f5f7", fontSize: 26, fontWeight: 700 }}>
              {showPass ? "Waitlist is live — don't forget to claim your card." : "Waitlist is live — join the private network."}
            </div>
            <div style={{ display: "flex", color: "rgba(245,245,247,0.45)", fontSize: 18 }}>
              webcoinlabs.com
            </div>
          </div>
        </div>
      </div>
    ),
    { width: WIDTH, height: HEIGHT },
  );
}
