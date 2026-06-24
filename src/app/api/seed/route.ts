import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Seed endpoint — creates default projects + admin user if DB is empty
export async function POST() {
  try {
    const existing = await db.project.count();
    if (existing === 0) {
      await db.project.createMany({
        data: [
          {
            titleAr: "منصة تحليلات مالية",
            titleEn: "FinScope Analytics",
            descAr:
              "منصة تحليلات مالية متكاملة مع لوحات تحكم تفاعلية وتقارير لحظية وتنبؤات بالذكاء الاصطناعي.",
            descEn:
              "A comprehensive financial analytics platform with interactive dashboards, real-time reports, and AI-driven forecasting.",
            techStack: "Next.js,React,TypeScript,Prisma,PostgreSQL,Recharts",
            liveDemo: "https://example.com/finscope",
            github: "https://github.com/mahdy/finscope",
            screenshot: "/images/projects/project-1.png",
            order: 0,
          },
          {
            titleAr: "متجر أزياء فاخر",
            titleEn: "Atelier Noir",
            descAr:
              "متجر إلكتروني فاخر للأزياء مع تجربة تسوق سينمائية وسلة شراء متقدمة ونظام مدفوعات متكامل.",
            descEn:
              "A luxury fashion e-commerce store with a cinematic shopping experience, advanced cart, and integrated payments.",
            techStack: "Next.js,Stripe,Tailwind,Prisma,Zustand",
            liveDemo: "https://example.com/atelier",
            github: "https://github.com/mahdy/atelier-noir",
            screenshot: "/images/projects/project-2.png",
            order: 1,
          },
          {
            titleAr: "مساعد ذكي بالذكاء الاصطناعي",
            titleEn: "Nova AI Assistant",
            descAr:
              "مساعد محادثة ذكي مدعوم بالذكاء الاصطناعي مع دعم متعدد اللغات وتكامل مع أدوات خارجية.",
            descEn:
              "An AI-powered chat assistant with multilingual support and integration with external tools.",
            techStack: "Next.js,OpenAI,WebSocket,Prisma,TypeScript",
            liveDemo: "https://example.com/nova",
            github: "https://github.com/mahdy/nova-ai",
            screenshot: "/images/projects/project-3.png",
            order: 2,
          },
          {
            titleAr: "منصة عقارات فاخرة",
            titleEn: "Estate Eclipse",
            descAr:
              "منصة عقارات فاخرة مع جولات افتراضية ثلاثية الأبعاد وفلاتر بحث متقدمة ونظام حجوزات.",
            descEn:
              "A luxury real estate platform with 3D virtual tours, advanced search filters, and a booking system.",
            techStack: "Next.js,Three.js,Mapbox,Prisma,PostgreSQL",
            liveDemo: "https://example.com/estate",
            github: "https://github.com/mahdy/estate-eclipse",
            screenshot: "/images/projects/project-4.png",
            order: 3,
          },
          {
            titleAr: "منصة رعاية صحية",
            titleEn: "MediCore Platform",
            descAr:
              "منصة رعاية صحية متكاملة لإدارة المرضى والمواعيد والسجلات الطبية مع لوحات تحكم للمختصين.",
            descEn:
              "An integrated healthcare platform for patient management, appointments, and medical records with professional dashboards.",
            techStack: "Next.js,React,Prisma,Chart.js,Tailwind",
            liveDemo: "https://example.com/medicore",
            github: "https://github.com/mahdy/medicore",
            screenshot: "/images/projects/project-5.png",
            order: 4,
          },
        ],
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
