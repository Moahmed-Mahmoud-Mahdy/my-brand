import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { MOCK_PROJECTS } from "@/lib/mock-projects";

// Seed endpoint — creates default projects + admin user if DB is empty
export async function POST() {
  try {
    const existing = await db.project.count();
    if (existing === 0) {
      await db.project.createMany({
        data: MOCK_PROJECTS.map((p) => ({
          titleAr: p.titleAr,
          titleEn: p.titleEn,
          descAr: p.descAr,
          descEn: p.descEn,
          stack: p.stack.join(","),
          githubUrl: p.githubUrl,
          demoUrl: p.demoUrl,
          desktopScreenshot: p.desktopScreenshot,
          mobileScreenshot: p.mobileScreenshot,
          // Legacy fields kept null/empty for backward compat
          techStack: p.stack.join(","),
          liveDemo: p.demoUrl,
          github: p.githubUrl,
          screenshot: p.desktopScreenshot,
          order: p.order,
          featured: p.featured,
        })),
      });
    }

    // Ensure admin user exists
    const adminExists = await db.user.findUnique({
      where: { email: "admin@mahdy.dev" },
    });
    if (!adminExists) {
      await db.user.create({
        data: {
          email: "admin@mahdy.dev",
          name: "M. Mahdy",
          password: "admin123",
        },
      });
    }

    return NextResponse.json({ success: true, seeded: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Seed failed", detail: String(e) },
      { status: 500 }
    );
  }
}

// Auto-seed on GET as well for convenience
export async function GET() {
  return POST();
}
