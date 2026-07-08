import { NextResponse, type NextRequest } from "next/server";
import { SITE_ACCESS_COOKIE } from "@/lib/siteAccessCookie";

// Matches any request path that looks like a static file (has a dot + extension
// in its final segment) — covers /logo/*.svg, /maps/*.svg, /favicon.ico, etc.
// without having to hardcode every asset folder.
const IS_STATIC_FILE = /\.[^/]+$/;

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const bypass =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/admin") || // has its own separate WAITLIST_ADMIN_TOKEN gate
    pathname === "/enter" ||
    IS_STATIC_FILE.test(pathname);

  if (bypass) return NextResponse.next();

  const unlocked = request.cookies.get(SITE_ACCESS_COOKIE)?.value === "granted";
  if (unlocked) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/enter";
  url.search = "";
  url.searchParams.set("next", pathname + search);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
