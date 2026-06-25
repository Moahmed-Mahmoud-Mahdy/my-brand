"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Github, X } from "lucide-react";
import type { Project } from "@/lib/types";
import type { TranslationKeys } from "@/lib/i18n";
import { useLanguage } from "@/components/language-provider";
import { useCursor } from "@/components/cursor/cursor-provider";
import { ProjectCtaButton } from "@/components/projects/project-cta-button";
import { TechBadge } from "@/components/projects/tech-badge";
import { ProjectVisuals } from "@/components/projects/project-visuals";

interface ProjectDetailsModalProps {
  project: Project;
  onClose: () => void;
}

/**
 * Fullscreen cinematic project panel.
 * - Desktop: 2-column (visuals left, details right)
 * - Mobile: single column
 * Behavior: ESC closes, outside click closes, body scroll locked.
 */
export function ProjectDetailsModal({
  project,
  onClose,
}: ProjectDetailsModalProps) {
  const { t, lang } = useLanguage();
  const { setVariant } = useCursor();
  const isAr = lang === "ar";
  const title = isAr ? project.titleAr : project.titleEn;
  const desc = isAr ? project.descAr : project.descEn;

  // ESC to close + lock body scroll
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop — blur + dim */}
      <div className="absolute inset-0 bg-bg-primary/85 backdrop-blur-xl" />

      {/* Modal panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-gold-primary/25 bg-surface/95 backdrop-blur-2xl shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
        onMouseEnter={() => setVariant("default")}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          onMouseEnter={() => setVariant("hover")}
          onMouseLeave={() => setVariant("default")}
          className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-gold-primary/30 bg-bg-primary/70 text-text-secondary backdrop-blur-sm transition-all hover:border-gold-primary hover:text-gold-primary"
          aria-label={t.projects.closeProject}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid max-h-[92vh] grid-cols-1 overflow-y-auto md:grid-cols-2 md:overflow-hidden">
          {/* LEFT — Project visuals */}
          <div className="relative min-h-[280px] overflow-hidden border-b border-gold-primary/15 md:border-b-0 md:border-e">
            <ProjectVisuals
              desktopScreenshot={project.desktopScreenshot}
              mobileScreenshot={project.mobileScreenshot}
              title={title}
              desktopLabel={t.projects.desktopView}
              mobileLabel={t.projects.mobileView}
            />
          </div>

          {/* RIGHT — Project details */}
          <div className="flex flex-col gap-5 overflow-y-auto p-6 sm:p-8 md:max-h-[92vh]">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex items-center gap-3"
            >
              <span className="font-mono text-[10px] uppercase tracking-wider-cinema text-gold-primary/70">
                {t.projects.caseStudy}
              </span>
              <span className="h-px flex-1 bg-eclipse-border" />
              <span className="font-mono text-[10px] tracking-wider-cinema text-text-secondary">
                {String(project.order + 1).padStart(2, "0")} / 05
              </span>
            </motion.div>

            {/* Title */}
            <motion.h3
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-name text-3xl leading-tight text-text-primary sm:text-4xl"
            >
              {title}
            </motion.h3>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="font-cairo text-sm leading-relaxed text-text-secondary sm:text-base"
            >
              {desc}
            </motion.p>

            {/* Tech stack */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col gap-2.5"
            >
              <span className="font-mono text-[10px] uppercase tracking-wider-cinema text-gold-primary/70">
                {t.projects.techStack}
              </span>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech, i) => (
                  <TechBadge key={tech} tech={tech} index={i} />
                ))}
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-auto flex flex-wrap gap-3 pt-6"
            >
              {project.demoUrl && (
                <ProjectCtaButton
                  href={project.demoUrl}
                  variant="primary"
                  icon={undefined}
                >
                  {t.projects.liveDemo}
                </ProjectCtaButton>
              )}
              {project.githubUrl && (
                <ProjectCtaButton
                  href={project.githubUrl}
                  variant="secondary"
                  icon={Github}
                >
                  {t.projects.github}
                </ProjectCtaButton>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Re-export for type usage in parent
export type { TranslationKeys };
