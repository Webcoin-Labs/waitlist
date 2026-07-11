import "server-only";

type LogLevel = "info" | "warn" | "error";
export type LogContext = { scope: string; message: string; data?: Record<string, unknown>; error?: unknown };

const REDACT_KEYS = ["password", "secret", "token", "authorization", "cookie", "apikey"];

function scrubString(value: string) {
  return value
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[REDACTED_EMAIL]")
    .replace(/([?&](?:token|c|code)=)[^&\s]+/gi, "$1[REDACTED]");
}

function scrub(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(scrub);
  if (typeof value === "string") return scrubString(value);
  if (typeof value !== "object") return value;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    out[k] = REDACT_KEYS.some((n) => k.toLowerCase().includes(n)) ? "[REDACTED]" : scrub(v);
  }
  return out;
}

function payloadFor(level: LogLevel, ctx: LogContext) {
  return {
    ts: new Date().toISOString(),
    level,
    scope: ctx.scope,
    message: ctx.message,
    data: ctx.data ? scrub(ctx.data) : undefined,
    error: scrub(ctx.error instanceof Error ? { message: ctx.error.message, stack: ctx.error.stack } : ctx.error),
  };
}

function write(level: LogLevel, ctx: LogContext) {
  const payload = payloadFor(level, ctx);
  const line = JSON.stringify(payload);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.info(line);
  return payload;
}

async function sendAlert(level: "warn" | "error", ctx: LogContext) {
  const webhookUrl = process.env.WAITLIST_ALERT_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    const parsed = new URL(webhookUrl);
    if (parsed.protocol !== "https:" && !(process.env.NODE_ENV !== "production" && parsed.protocol === "http:")) {
      throw new Error("Alert webhook must use HTTPS in production.");
    }
    const token = process.env.WAITLIST_ALERT_WEBHOOK_TOKEN;
    const response = await fetch(parsed, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        source: "webcoinlabs-waitlist",
        environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown",
        event: scrub(payloadFor(level, ctx)),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) throw new Error(`Alert webhook responded ${response.status}.`);
  } catch (error) {
    console.error(
      JSON.stringify({
        ts: new Date().toISOString(),
        level: "error",
        scope: "monitoring.alertWebhook",
        message: "Could not deliver operational alert.",
        error: error instanceof Error ? error.message : "Unknown alert delivery error.",
      }),
    );
  }
}

export const logger = {
  info: (ctx: LogContext) => write("info", ctx),
  warn: (ctx: LogContext) => write("warn", ctx),
  error: (ctx: LogContext) => write("error", ctx),
  captureWarn: async (ctx: LogContext) => {
    write("warn", ctx);
    await sendAlert("warn", ctx);
  },
  captureError: async (ctx: LogContext) => {
    write("error", ctx);
    await sendAlert("error", ctx);
  },
};
