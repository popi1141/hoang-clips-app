import { getCookie, setCookie } from "hono/cookie";
import type { Context } from "hono";

const ADMIN_PASSCODE = "Hoang2026!";

export function isAdmin(c: Context): boolean {
  return getCookie(c, "admin_auth") === "1";
}

export function loginAdmin(c: Context, passcode: string): boolean {
  if (passcode === ADMIN_PASSCODE) {
    setCookie(c, "admin_auth", "1", { path: "/", maxAge: 60 * 60 * 24 * 7, httpOnly: true, sameSite: "Lax" });
    return true;
  }
  return false;
}

export function logoutAdmin(c: Context) {
  setCookie(c, "admin_auth", "", { path: "/", maxAge: 0 });
}
