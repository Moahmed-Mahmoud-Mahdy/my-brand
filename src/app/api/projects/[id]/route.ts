import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    const projects = await db.project.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json([]);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();
    const project = await db.project.update({
      where: { id },
      data: {
        titleAr: body.titleAr,
        titleEn: body.titleEn,
        descAr: body.descAr,
        descEn: body.descEn,
        techStack: body.techStack,
        liveDemo: body.liveDemo || null,
        github: body.github || null,
        screenshot: body.screenshot,
        order: body.order,
        featured: body.featured,
      },
    });
    return NextResponse.json(project);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    await db.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
