import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "wcl_waitlist_admin";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

function secret() {
  return process.env.WAITLIST_ADMIN_TOKEN ?? "";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

/** Compares the submitted passphrase to WAITLIST_ADMIN_TOKEN in constant time. */
export function checkAdminPassphrase(input: string): boolean {
  const expected = secret();
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function setAdminCookie() {
  const token = sign("admin-session");
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

export async function isAdminSession(): Promise<boolean> {
  if (!secret()) return false;
  const store = await cookies();
  const value = store.get(ADMIN_COOKIE)?.value;
  if (!value) return false;
  return value === sign("admin-session");
}
