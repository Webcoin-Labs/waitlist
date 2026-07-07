import "server-only";

type LogLevel = "info" | "warn" | "error";
type LogContext = { scope: string; message: string; data?: Record<string, unknown>; error?: unknown };

const REDACT_KEYS = ["password", "secret", "token", "authorization", "cookie", "apikey"];

function scrub(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(scrub);
  if (typeof value !== "object") return value;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    out[k] = REDACT_KEYS.some((n) => k.toLowerCase().includes(n)) ? "[REDACTED]" : scrub(v);
  }
  return out;
}

function write(level: LogLevel, ctx: LogContext) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    scope: ctx.scope,
    message: ctx.message,
    data: ctx.data ? scrub(ctx.data) : undefined,
    error: ctx.error instanceof Error ? { message: ctx.error.message, stack: ctx.error.stack } : ctx.error,
  };
  const line = JSON.stringify(payload);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.info(line);
}

export const logger = {
  info: (ctx: LogContext) => write("info", ctx),
  warn: (ctx: LogContext) => write("warn", ctx),
  error: (ctx: LogContext) => write("error", ctx),
};
