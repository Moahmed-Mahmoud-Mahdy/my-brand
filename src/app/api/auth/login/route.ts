import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Checks for auth via EITHER the httpOnly cookie OR an x-admin-token header
// (the header lets auth work inside cross-site preview iframes where
// SameSite=Lax cookies are blocked).
function isAuthenticated(req: NextRequest): boolean {
  const cookie = req.cookies.get("admin-session")?.value;
  if (cookie === "authenticated") return true;
  const header = req.headers.get("x-admin-token");
  if (header === "authenticated") return true;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 }
      );
    }
    const user = await db.user.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    const res = NextResponse.json({ success: true, name: user.name });
    // Set httpOnly cookie (works on real same-site deployments)
    res.cookies.set("admin-session", "authenticated", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

export { isAuthenticated };
