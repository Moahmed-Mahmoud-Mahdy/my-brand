"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useCursor } from "@/components/cursor/cursor-provider";
import type { Project } from "@/lib/types";
import { normalizeProject } from "@/lib/types";
import { ProjectDetailsModal } from "@/components/projects/project-details-modal";

export function ProjectsSection() {
  const { t } = useLanguage();
  const { setVariant } = useCursor();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        const list = (Array.isArray(data) ? data : []).map(
          normalizeProject
        );
        setProjects(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section
      id="projects"
      className="relative px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
    >
      {/* Ambient eclipse glow behind section */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-primary/[0.025] blur-3xl" />

      <div className="mx-auto w-full max-w-7xl">
        {/* Section header — fade + translateY */}
        <header className="mb-16 flex flex-col items-center text-center sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold-primary/25 px-4 py-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold-primary glow-gold" />
            <span className="font-mono text-[11px] uppercase tracking-wider-cinema text-gold-primary/80">
              {t.projects.tag}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 font-name text-5xl leading-none text-text-primary sm:text-6xl lg:text-7xl"
          >
            {t.projects.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-xl font-cairo text-base leading-relaxed text-text-secondary sm:text-lg"
          >
            {t.projects.subtitle}
          </motion.p>
        </header>

        {/* Fragments constellation — asymmetric, eclipse-inspired */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold-primary/30 border-t-gold-primary" />
          </div>
        ) : projects.length === 0 ? (
          <div className="py-32 text-center font-cairo text-text-secondary">
            {t.projects.empty}
          </div>
        ) : (
          <FragmentsConstellation
            projects={projects}
            onSelect={setSelected}
            onHover={setVariant}
          />
        )}
      </div>

      {/* Fullscreen project expansion — only one at a time */}
      <AnimatePresence>
        {selected && (
          <ProjectDetailsModal
            project={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/**
 * Asymmetric constellation of eclipse fragments.
 * Each fragment is a circular shape with alternating vertical offsets and
 * varying sizes to avoid a generic grid feel.
 */
function FragmentsConstellation({
  projects,
  onSelect,
  onHover,
}: {
  projects: Project[];
  onSelect: (p: Project) => void;
  onHover: (v: "default" | "hover") => void;
}) {
  const { t, lang } = useLanguage();
  const isAr = lang === "ar";

  return (
    <div className="grid grid-cols-1 place-items-center gap-x-6 gap-y-12 sm:grid-cols-2 lg:gap-x-10 xl:grid-cols-3">
      {projects.map((project, idx) => {
        // Asymmetric sizing pattern — varies by index for constellation feel (desktop only)
        const sizePattern = idx % 5;
        const sizeClass =
          sizePattern === 0
            ? "w-[220px] sm:w-[240px] lg:w-[300px] xl:w-[340px]"
            : sizePattern === 1
            ? "w-[200px] sm:w-[220px] lg:w-[260px] xl:w-[290px]"
            : sizePattern === 2
            ? "w-[230px] sm:w-[250px] lg:w-[280px] xl:w-[360px]"
            : sizePattern === 3
            ? "w-[200px] sm:w-[220px] lg:w-[240px] xl:w-[280px]"
            : "w-[215px] sm:w-[235px] lg:w-[260px] xl:w-[320px]";
        // Alternating vertical offset (desktop only)
        const offsetClass =
          sizePattern === 1
            ? "lg:mt-20"
            : sizePattern === 3
            ? "lg:mt-12"
            : sizePattern === 4
            ? "lg:-mt-8"
            : "";

        return (
          <Fragment
            key={project.id}
            project={project}
            index={idx}
            isAr={isAr}
            sizeClass={sizeClass}
            offsetClass={offsetClass}
            onClick={() => onSelect(project)}
            onHover={onHover}
            t={t}
          />
        );
      })}
    </div>
  );
}

function Fragment({
  project,
  index,
  isAr,
  sizeClass,
  offsetClass,
  onClick,
  onHover,
  t,
}: {
  project: Project;
  index: number;
  isAr: boolean;
  sizeClass: string;
  offsetClass: string;
  onClick: () => void;
  onHover: (v: "default" | "hover") => void;
  t: ReturnType<typeof useLanguage>["t"];
}) {
  const title = isAr ? project.titleAr : project.titleEn;
  const stackPreview = project.stack.slice(0, 3);
  const numberLabel = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 1,
        delay: (index % 3) * 0.14,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group relative flex flex-col items-center ${offsetClass}`}
    >
      <button
        onClick={onClick}
        onMouseEnter={() => onHover("hover")}
        onMouseLeave={() => onHover("default")}
        className={`relative ${sizeClass} aspect-square cursor-none`}
        aria-label={`${t.projects.viewProject}: ${title}`}
      >
        {/* Outer eclipse ring */}
        <div className="absolute inset-0 rounded-full border border-gold-primary/15 transition-all duration-700 group-hover:border-gold-primary/50" />

        {/* Rotating dashed orbit */}
        <div className="absolute inset-[2%] animate-eclipse-rotate rounded-full">
          <div className="h-full w-full rounded-full border border-dashed border-gold-primary/10" />
        </div>

        {/* Counter-rotating conic ring (subtle) */}
        <div
          className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(214,178,94,0.25) 80deg, transparent 160deg, rgba(214,178,94,0.15) 240deg, transparent 340deg)",
            mask: "radial-gradient(transparent 92%, black 94%)",
            WebkitMask: "radial-gradient(transparent 92%, black 94%)",
            animation: "eclipse-rotate 12s linear infinite reverse",
          }}
        />

        {/* Glow halo on hover */}
        <div
          className="absolute inset-0 rounded-full opacity-40 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(214,178,94,0.2) 0%, transparent 65%)",
          }}
        />

        {/* Screenshot in circle (desktop screenshot as the fragment visual) */}
        <div className="absolute inset-[8%] overflow-hidden rounded-full">
          <img
            src={project.desktopScreenshot}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-110"
            style={{ filter: "brightness(0.55) saturate(0.9)" }}
          />
          {/* Eclipse shadow gradient (bottom darken) */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-bg-primary/30 to-transparent" />
          {/* Hover gold tint */}
          <div className="absolute inset-0 bg-gold-primary/0 transition-colors duration-700 group-hover:bg-gold-primary/[0.06]" />
        </div>

        {/* Inner ring border */}
        <div className="absolute inset-[8%] rounded-full border border-gold-primary/30 transition-all duration-700 group-hover:border-gold-primary/70 group-hover:shadow-[0_0_40px_rgba(214,178,94,0.35)]" />

        {/* IDLE STATE — minimal info (project number + glow) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 group-hover:opacity-0">
          <span className="font-mono text-[10px] uppercase tracking-wider-cinema text-gold-primary/50">
            {t.projects.project}
          </span>
          <span className="font-name text-5xl text-gold-primary/80 glow-text-soft">
            {numberLabel}
          </span>
        </div>

        {/* HOVER STATE — reveal title + stack preview */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <ArrowUpRight className="h-6 w-6 text-gold-primary" />
          <h3 className="font-name text-xl leading-tight text-text-primary">
            {title}
          </h3>
          <div className="flex flex-wrap justify-center gap-1.5">
            {stackPreview.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-gold-primary/30 bg-bg-primary/60 px-2 py-0.5 font-mono text-[9px] text-text-secondary backdrop-blur-sm"
              >
                {tech}
              </span>
            ))}
            {project.stack.length > 3 && (
              <span className="rounded-full border border-gold-primary/30 bg-bg-primary/60 px-2 py-0.5 font-mono text-[9px] text-gold-primary/70 backdrop-blur-sm">
                +{project.stack.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Top badge — fragment index */}
        <div className="absolute -top-1 left-1/2 z-20 -translate-x-1/2 rounded-full border border-gold-primary/30 bg-bg-primary px-3 py-0.5">
          <span className="font-mono text-[9px] tracking-wider-cinema text-gold-primary/70">
            {t.projects.fragment}_{numberLabel}
          </span>
        </div>
      </button>
    </motion.div>
  );
}
