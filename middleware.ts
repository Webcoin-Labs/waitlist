import { NextResponse, type NextRequest } from "next/server";
import { SITE_ACCESS_COOKIE } from "@/lib/siteAccessCookie";
import { WAITLIST_DEVICE_COOKIE, WAITLIST_DEVICE_COOKIE_MAX_AGE } from "@/lib/deviceCookie";

// Matches any request path that looks like a static file (has a dot + extension
// in its final segment) — covers /logo/*.svg, /maps/*.svg, /favicon.ico, etc.
// without having to hardcode every asset folder.
const IS_STATIC_FILE = /\.[^/]+$/;

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const withDeviceCookie = (response: NextResponse) => {
    if (!request.cookies.has(WAITLIST_DEVICE_COOKIE) && !IS_STATIC_FILE.test(pathname) && !pathname.startsWith("/_next")) {
      response.cookies.set(WAITLIST_DEVICE_COOKIE, crypto.randomUUID(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: WAITLIST_DEVICE_COOKIE_MAX_AGE,
        path: "/",
      });
    }
    return response;
  };

  const bypass =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/admin") || // has its own separate WAITLIST_ADMIN_TOKEN gate
    pathname === "/enter" ||
    pathname === "/verify" ||
    pathname === "/status" ||
    pathname === "/api/share-card" || // fetched by X/Discord/iMessage link-unfurl bots — no session cookie available
    IS_STATIC_FILE.test(pathname);

  if (bypass) return withDeviceCookie(NextResponse.next());

  const unlocked = request.cookies.get(SITE_ACCESS_COOKIE)?.value === "granted";
  if (unlocked) return withDeviceCookie(NextResponse.next());

  const url = request.nextUrl.clone();
  url.pathname = "/enter";
  url.search = "";
  url.searchParams.set("next", pathname + search);
  return withDeviceCookie(NextResponse.redirect(url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
