import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const auth = req.cookies.get("admin-session")?.value;
    if (auth !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const messages = await db.message.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;
    if (!name || !message) {
      return NextResponse.json(
        { error: "Name and message are required" },
        { status: 400 }
      );
    }
    const msg = await db.message.create({
      data: {
        name: String(name).slice(0, 120),
        email: email ? String(email).slice(0, 200) : null,
        message: String(message).slice(0, 5000),
      },
    });
    return NextResponse.json({ success: true, id: msg.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
