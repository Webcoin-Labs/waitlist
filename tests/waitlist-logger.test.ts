import { afterEach, describe, expect, it, vi } from "vitest";
import { logger } from "@/lib/logger";

afterEach(() => {
  delete process.env.WAITLIST_ALERT_WEBHOOK_URL;
  delete process.env.WAITLIST_ALERT_WEBHOOK_TOKEN;
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("waitlist operational alerts", () => {
  it("posts a sanitized warning to the configured alert webhook", async () => {
    process.env.WAITLIST_ALERT_WEBHOOK_URL = "https://alerts.example.test/waitlist";
    process.env.WAITLIST_ALERT_WEBHOOK_TOKEN = "alert-secret";
    const fetchMock = vi.fn(async (_input: string | URL | Request, _init?: RequestInit) =>
      new Response(null, { status: 204 }),
    );
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);

    await logger.captureWarn({
      scope: "waitlist.test",
      message: "Suspicious signup blocked.",
      data: {
        verificationToken: "private-value",
        detail: "user@example.com failed at /verify?token=private-token",
        riskScore: 100,
      },
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe("https://alerts.example.test/waitlist");
    expect((init?.headers as Record<string, string>).authorization).toBe("Bearer alert-secret");
    const payload = JSON.parse(String(init?.body));
    expect(payload.source).toBe("webcoinlabs-waitlist");
    expect(payload.event.data.verificationToken).toBe("[REDACTED]");
    expect(payload.event.data.detail).toBe("[REDACTED_EMAIL] failed at /verify?token=[REDACTED]");
    expect(payload.event.data.riskScore).toBe(100);
  });
});
