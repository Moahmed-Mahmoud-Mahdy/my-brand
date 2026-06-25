import { NextRequest, NextResponse } from "next/server";

// Checks for auth via cookie OR x-admin-token header (iframe-friendly)
export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("admin-session")?.value;
  const header = req.headers.get("x-admin-token");
  const authenticated =
    cookie === "authenticated" || header === "authenticated";
  return NextResponse.json({ authenticated });
}
