import "server-only";

import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { SITE_ACCESS_COOKIE } from "./siteAccessCookie";

export { SITE_ACCESS_COOKIE };
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 days — soft pre-launch gate, not meant to expire mid-review

function expectedCode() {
  return (process.env.SITE_ACCESS_CODE ?? "ANSHIT").trim().toUpperCase();
}

/** Compares the submitted code to the expected access code in constant time. */
export function checkSiteAccessCode(input: string): boolean {
  const expected = expectedCode();
  const a = Buffer.from(input.trim().toUpperCase());
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function grantSiteAccess() {
  const store = await cookies();
  store.set(SITE_ACCESS_COOKIE, "granted", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}
