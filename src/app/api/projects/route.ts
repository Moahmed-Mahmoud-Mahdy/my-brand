import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const projects = await db.project.findMany({
      where: { featured: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(projects);
  } catch (e) {
    console.error("Failed to fetch projects:", e);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = req.cookies.get("admin-session")?.value;
    if (auth !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const project = await db.project.create({
      data: {
        titleAr: body.titleAr,
        titleEn: body.titleEn,
        descAr: body.descAr,
        descEn: body.descEn,
        techStack: body.techStack,
        liveDemo: body.liveDemo || null,
        github: body.github || null,
        screenshot: body.screenshot,
        order: body.order ?? 0,
        featured: body.featured ?? true,
      },
    });
    return NextResponse.json(project);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
