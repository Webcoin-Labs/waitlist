import type { Instrumentation } from "next";
import { logger } from "@/lib/logger";

export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  await logger.captureError({
    scope: "next.request",
    message: "Unhandled server request error.",
    error,
    data: {
      method: request.method,
      // Query strings can contain private status or verification tokens.
      path: request.path.split("?")[0],
      routePath: context.routePath,
      routeType: context.routeType,
      routerKind: context.routerKind,
      digest:
        error && typeof error === "object" && "digest" in error
          ? String((error as { digest?: unknown }).digest ?? "")
          : undefined,
    },
  });
};
