import { NextResponse, type NextRequest } from "next/server";
import { WAITLIST_DEVICE_COOKIE, WAITLIST_DEVICE_COOKIE_MAX_AGE } from "@/lib/deviceCookie";

const IS_STATIC_FILE = /\.[^/]+$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

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
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
