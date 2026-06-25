import type { Project } from "@/lib/types";

/**
 * Temporary mock project data used for seeding the database.
 * Stored separately from UI components per architecture rules.
 * Strongest projects ordered first.
 *
 * NOTE: This is placeholder data. Replace via the admin dashboard
 * (/login → /dashboard) for production content.
 */
export const MOCK_PROJECTS: Omit<
  Project,
  "id" | "createdAt" | "updatedAt"
>[] = [
  {
    titleAr: "منصة تحليلات مالية",
    titleEn: "FinScope Analytics",
    descAr:
      "منصة تحليلات مالية متكاملة تربط بين مصادر البيانات المتعددة وتعرض مؤشرات الأداء لحظيًا عبر لوحات تحكم تفاعلية. صُممت البنية لتتحمل أحمالًا عالية مع تنبؤات مدعومة بالذكاء الاصطناعي وكشف للأنماط الشاذة في المعاملات.",
    descEn:
      "A comprehensive financial analytics platform that unifies multiple data sources and surfaces real-time KPIs through interactive dashboards. Engineered for high-throughput workloads with AI-driven forecasting and anomaly detection across transaction streams.",
    stack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "Recharts"],
    githubUrl: "https://github.com/mahdy/finscope",
    demoUrl: "https://finscope.example.com",
    desktopScreenshot: "/images/projects/desktop/p1.png",
    mobileScreenshot: "/images/projects/mobile/p1.png",
    order: 0,
    featured: true,
  },
  {
    titleAr: "متجر أزياء فاخر",
    titleEn: "Atelier Noir",
    descAr:
      "تجربة تسوق سينمائية لعلامة أزياء فاخرة، مع كتالوج ديناميكي وسلة شراء متقدمة ونظام مدفوعات متكامل. التركيز على الأداء البصري وتجربة المستخدم الناعمة من أول لقطة حتى إتمام الطلب.",
    descEn:
      "A cinematic shopping experience for a luxury fashion house, featuring a dynamic catalog, advanced cart logic, and integrated payments. Focus on visual performance and a fluid user journey from first impression to checkout.",
    stack: ["Next.js", "Stripe", "Tailwind", "Prisma", "Zustand"],
    githubUrl: "https://github.com/mahdy/atelier-noir",
    demoUrl: "https://atelier.example.com",
    desktopScreenshot: "/images/projects/desktop/p2.png",
    mobileScreenshot: "/images/projects/mobile/p2.png",
    order: 1,
    featured: true,
  },
  {
    titleAr: "مساعد ذكي بالذكاء الاصطناعي",
    titleEn: "Nova AI Assistant",
    descAr:
      "مساعد محادثة ذكي متعدد اللغات مع ذاكرة سياقية وتكامل مع أدوات خارجية. يعتمد معمارية streaming لتقديم ردود فورية، مع طبقة أمان للتحكم في الصلاحيات وتسجيل نشاط المستخدمين.",
    descEn:
      "A multilingual AI chat assistant with contextual memory and external tool integration. Built on a streaming architecture for real-time responses, with a security layer for permission control and user activity logging.",
    stack: ["Next.js", "OpenAI", "WebSocket", "Prisma", "TypeScript"],
    githubUrl: "https://github.com/mahdy/nova-ai",
    demoUrl: "https://nova.example.com",
    desktopScreenshot: "/images/projects/desktop/p3.png",
    mobileScreenshot: "/images/projects/mobile/p3.png",
    order: 2,
    featured: true,
  },
  {
    titleAr: "منصة عقارات فاخرة",
    titleEn: "Estate Eclipse",
    descAr:
      "منصة عقارات فاخرة مع جولات افتراضية ثلاثية الأبعاد، فلاتر بحث متقدمة جغرافيًا وزمنيًا، ونظام حجوزات للمشاهدات الميدانية. تكامل مع خرائط عالية الدقة وطبقة إشعارات لحظية.",
    descEn:
      "A luxury real estate platform with 3D virtual tours, geo-temporal advanced search filters, and a booking system for field viewings. Integrates high-resolution mapping with a real-time notification layer.",
    stack: ["Next.js", "Three.js", "Mapbox", "Prisma", "PostgreSQL"],
    githubUrl: "https://github.com/mahdy/estate-eclipse",
    demoUrl: "https://estate.example.com",
    desktopScreenshot: "/images/projects/desktop/p4.png",
    mobileScreenshot: "/images/projects/mobile/p4.png",
    order: 3,
    featured: true,
  },
  {
    titleAr: "منصة رعاية صحية",
    titleEn: "MediCore Platform",
    descAr:
      "منصة رعاية صحية متكاملة لإدارة المرضى والمواعيد والسجلات الطبية، مع لوحات تحكم تخصصية للأطباء والإدارة. تلتزم بمعايير الخصوصية وتوفر نسخًا احتياطيًا مشفّرًا للسجلات الحساسة.",
    descEn:
      "An integrated healthcare platform for patient management, appointments, and medical records, with specialized dashboards for clinicians and administrators. Compliant with privacy standards and provides encrypted backups for sensitive records.",
    stack: ["Next.js", "React", "Prisma", "Chart.js", "Tailwind"],
    githubUrl: "https://github.com/mahdy/medicore",
    demoUrl: null,
    desktopScreenshot: "/images/projects/desktop/p5.png",
    mobileScreenshot: "/images/projects/mobile/p5.png",
    order: 4,
    featured: true,
  },
];
