import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = req.cookies.get("admin-session")?.value;
  return NextResponse.json({ authenticated: auth === "authenticated" });
}
