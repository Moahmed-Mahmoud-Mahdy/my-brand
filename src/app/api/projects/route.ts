import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

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
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const stack = Array.isArray(body.stack)
      ? body.stack.join(",")
      : String(body.stack ?? "");
    const project = await db.project.create({
      data: {
        titleAr: body.titleAr,
        titleEn: body.titleEn,
        descAr: body.descAr,
        descEn: body.descEn,
        stack,
        githubUrl: body.githubUrl || null,
        demoUrl: body.demoUrl || null,
        desktopScreenshot:
          body.desktopScreenshot || "/images/projects/desktop/p1.png",
        mobileScreenshot: body.mobileScreenshot || null,
        // legacy mirrors
        techStack: stack,
        liveDemo: body.demoUrl || null,
        github: body.githubUrl || null,
        screenshot: body.desktopScreenshot || null,
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
