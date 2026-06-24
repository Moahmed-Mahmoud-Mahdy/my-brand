"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, X, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useCursor } from "@/components/cursor/cursor-provider";
import type { Project } from "@/lib/types";

export function ProjectsSection() {
  const { t, lang } = useLanguage();
  const { setVariant } = useCursor();
  const isAr = lang === "ar";
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section
      id="projects"
      className="relative px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Section header */}
        <div
          className={`mb-16 flex flex-col items-center text-center sm:mb-20 ${
            isAr ? "text-right" : "text-left"
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold-primary/25 px-4 py-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold-primary glow-gold" />
            <span className="font-mono text-[11px] uppercase tracking-wider-cinema text-gold-primary/80">
              {t.projects.tag}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-3 font-cairo text-4xl font-bold tracking-cinematic text-text-primary sm:text-5xl"
          >
            {t.projects.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-lg font-cairo text-base text-text-secondary"
          >
            {t.projects.subtitle}
          </motion.p>
        </div>

        {/* Memory Fragments grid — staggered eclipse circles */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold-primary/30 border-t-gold-primary" />
          </div>
        ) : projects.length === 0 ? (
          <div className="py-20 text-center font-cairo text-text-secondary">
            {t.projects.empty}
          </div>
        ) : (
          <div className="relative grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, idx) => (
              <FragmentCard
                key={project.id}
                project={project}
                index={idx}
                isAr={isAr}
                onClick={() => setSelected(project)}
                onHover={setVariant}
                t={t}
              />
            ))}
          </div>
        )}
      </div>

      {/* Project detail modal */}
      <AnimatePresence>
        {selected && (
          <ProjectModal
            project={selected}
            isAr={isAr}
            t={t}
            onClose={() => setSelected(null)}
            onHover={setVariant}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function FragmentCard({
  project,
  index,
  isAr,
  onClick,
  onHover,
  t,
}: {
  project: Project;
  index: number;
  isAr: boolean;
  onClick: () => void;
  onHover: (v: "default" | "hover") => void;
  t: ReturnType<typeof useLanguage>["t"];
}) {
  const title = isAr ? project.titleAr : project.titleEn;
  const desc = isAr ? project.descAr : project.descEn;
  const techList = project.techStack.split(",").filter(Boolean);
  // Alternate vertical offset for staggered constellation feel
  const offsetClass =
    index % 3 === 1 ? "lg:translate-y-10" : index % 3 === 2 ? "lg:-translate-y-6" : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.9,
        delay: (index % 3) * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group relative flex flex-col items-center ${offsetClass}`}
    >
      <button
        onClick={onClick}
        onMouseEnter={() => onHover("hover")}
        onMouseLeave={() => onHover("default")}
        className="relative flex aspect-square w-full max-w-[320px] flex-col items-center justify-center"
        aria-label={`${t.projects.viewProject}: ${title}`}
      >
        {/* Eclipse ring outer */}
        <div className="absolute inset-0 rounded-full border border-gold-primary/15 transition-all duration-700 group-hover:border-gold-primary/40" />

        {/* Rotating dashed orbit */}
        <div className="absolute inset-[3%] animate-eclipse-rotate rounded-full">
          <div className="h-full w-full rounded-full border border-dashed border-gold-primary/10" />
        </div>

        {/* Glow halo on hover */}
        <div
          className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(214,178,94,0.18) 0%, transparent 65%)",
          }}
        />

        {/* Screenshot in circle */}
        <div className="absolute inset-[10%] overflow-hidden rounded-full">
          <img
            src={project.screenshot}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
            style={{ filter: "brightness(0.7) saturate(0.9)" }}
          />
          {/* Eclipse shadow gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 via-bg-primary/20 to-transparent" />
          {/* Gold tint on hover */}
          <div className="absolute inset-0 bg-gold-primary/0 transition-colors duration-700 group-hover:bg-gold-primary/5" />
        </div>

        {/* Inner ring border */}
        <div className="absolute inset-[10%] rounded-full border border-gold-primary/30 transition-all duration-700 group-hover:border-gold-primary/70 group-hover:shadow-[0_0_30px_rgba(214,178,94,0.3)]" />

        {/* Center content — appears on hover */}
        <div className="relative z-10 flex flex-col items-center gap-2 px-6 text-center opacity-0 transition-all duration-700 group-hover:opacity-100">
          <span className="font-mono text-[10px] uppercase tracking-wider-cinema text-gold-primary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <ArrowUpRight className="h-6 w-6 text-gold-primary" />
        </div>

        {/* Always-visible index badge at top */}
        <div className="absolute -top-1 left-1/2 z-20 -translate-x-1/2 rounded-full border border-gold-primary/30 bg-bg-primary px-3 py-0.5">
          <span className="font-mono text-[10px] tracking-wider-cinema text-gold-primary/80">
            FRAGMENT_{String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </button>

      {/* Title below the circle */}
      <div className="mt-6 flex flex-col items-center gap-2 text-center">
        <h3 className="font-cairo text-xl font-bold text-text-primary transition-colors duration-300 group-hover:text-gold-primary">
          {title}
        </h3>
        <p className="line-clamp-2 max-w-[260px] font-cairo text-sm text-text-secondary">
          {desc}
        </p>
        {/* Tech chips */}
        <div className="mt-1 flex flex-wrap justify-center gap-1.5">
          {techList.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-eclipse-border px-2.5 py-0.5 font-mono text-[10px] text-text-secondary"
            >
              {tech.trim()}
            </span>
          ))}
          {techList.length > 3 && (
            <span className="rounded-full border border-eclipse-border px-2.5 py-0.5 font-mono text-[10px] text-gold-primary/70">
              +{techList.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ProjectModal({
  project,
  isAr,
  t,
  onClose,
  onHover,
}: {
  project: Project;
  isAr: boolean;
  t: ReturnType<typeof useLanguage>["t"];
  onClose: () => void;
  onHover: (v: "default" | "hover") => void;
}) {
  const title = isAr ? project.titleAr : project.titleEn;
  const desc = isAr ? project.descAr : project.descEn;
  const techList = project.techStack.split(",").filter(Boolean);

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
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-bg-primary/85 backdrop-blur-xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-gold-primary/20 bg-surface/90 backdrop-blur-2xl"
        onMouseEnter={() => onHover("default")}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          onMouseEnter={() => onHover("hover")}
          onMouseLeave={() => onHover("default")}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-gold-primary/30 bg-bg-primary/60 text-text-secondary transition-all hover:border-gold-primary hover:text-gold-primary"
          aria-label={t.projects.closeProject}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image side */}
          <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto">
            <img
              src={project.screenshot}
              alt={title}
              className="h-full w-full object-cover"
              style={{ filter: "brightness(0.85) saturate(0.95)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent md:bg-gradient-to-l" />
            {/* Eclipse overlay */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-primary/10 blur-3xl" />
          </div>

          {/* Content side */}
          <div className="flex flex-col gap-5 p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider-cinema text-gold-primary/70">
                Fragment
              </span>
              <span className="h-px flex-1 bg-eclipse-border" />
            </div>

            <h3 className="font-cairo text-3xl font-bold text-text-primary sm:text-4xl">
              {title}
            </h3>

            <p className="font-cairo text-sm leading-relaxed text-text-secondary sm:text-base">
              {desc}
            </p>

            {/* Tech stack */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider-cinema text-gold-primary/70">
                {t.projects.techStack}
              </span>
              <div className="flex flex-wrap gap-2">
                {techList.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-gold-primary/25 bg-gold-primary/5 px-3 py-1 font-mono text-xs text-text-primary"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto flex flex-wrap gap-3 pt-4">
              {project.liveDemo && (
                <a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => onHover("hover")}
                  onMouseLeave={() => onHover("default")}
                  className="group flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 font-cairo text-sm font-bold text-bg-primary transition-transform hover:scale-105"
                >
                  {t.projects.liveDemo}
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => onHover("hover")}
                  onMouseLeave={() => onHover("default")}
                  className="flex items-center gap-2 rounded-full border border-gold-primary/40 px-6 py-3 font-cairo text-sm font-medium text-text-primary transition-all hover:border-gold-primary hover:bg-gold-primary/5 hover:text-gold-primary"
                >
                  {t.projects.github}
                  <Github className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
