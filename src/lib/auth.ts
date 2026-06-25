import { NextRequest } from "next/server";

/**
 * Checks for admin authentication via EITHER the httpOnly cookie OR an
 * `x-admin-token` request header. The header fallback lets auth work inside
 * cross-site preview iframes where SameSite=Lax cookies are blocked.
 */
export function isAuthenticated(req: NextRequest): boolean {
  const cookie = req.cookies.get("admin-session")?.value;
  if (cookie === "authenticated") return true;
  const header = req.headers.get("x-admin-token");
  if (header === "authenticated") return true;
  return false;
}

/** The token value stored in localStorage by the client after login. */
export const ADMIN_TOKEN = "authenticated";

/** Reads the token from localStorage on the client (returns "" if absent). */
export function getStoredToken(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem("mahdy-admin-token") ?? "";
  } catch {
    return "";
  }
}

/** Stores the token in localStorage (called after a successful login). */
export function storeToken(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("mahdy-admin-token", ADMIN_TOKEN);
  } catch {
    /* ignore */
  }
}

/** Removes the token from localStorage (called on logout). */
export function clearToken(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("mahdy-admin-token");
  } catch {
    /* ignore */
  }
}

/** Build fetch headers that include the admin token if present. */
export function authHeaders(extra?: Record<string, string>): HeadersInit {
  const token = getStoredToken();
  return {
    ...(token ? { "x-admin-token": token } : {}),
    ...(extra ?? {}),
  };
}
