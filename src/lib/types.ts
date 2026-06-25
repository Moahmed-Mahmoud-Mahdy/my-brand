export interface Project {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  /** Comma-separated tech list (canonical field). */
  stack: string[];
  githubUrl: string | null;
  demoUrl: string | null;
  desktopScreenshot: string;
  mobileScreenshot: string | null;
  order: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  name: string;
  email: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

/**
 * Normalize a raw project record from the API into the canonical Project type.
 * Handles both the new schema fields and legacy field names for backward compat.
 */
export function normalizeProject(raw: Record<string, unknown>): Project {
  const stackRaw =
    (raw.stack as string) ?? (raw.techStack as string) ?? "";
  const stack = stackRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const desktopScreenshot =
    (raw.desktopScreenshot as string) ??
    (raw.screenshot as string) ??
    "/images/projects/desktop/p1.png";

  const mobileScreenshot =
    (raw.mobileScreenshot as string) ?? null;

  return {
    id: String(raw.id ?? ""),
    titleAr: String(raw.titleAr ?? ""),
    titleEn: String(raw.titleEn ?? ""),
    descAr: String(raw.descAr ?? ""),
    descEn: String(raw.descEn ?? ""),
    stack,
    githubUrl: (raw.githubUrl as string) ?? (raw.github as string) ?? null,
    demoUrl: (raw.demoUrl as string) ?? (raw.liveDemo as string) ?? null,
    desktopScreenshot,
    mobileScreenshot,
    order: Number(raw.order ?? 0),
    featured: Boolean(raw.featured ?? true),
    createdAt: String(raw.createdAt ?? ""),
    updatedAt: String(raw.updatedAt ?? ""),
  };
}
