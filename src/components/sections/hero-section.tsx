"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useCursor } from "@/components/cursor/cursor-provider";

export function HeroSection() {
  const { t, lang } = useLanguage();
  const { setVariant } = useCursor();
  const isAr = lang === "ar";

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-4 pt-24 pb-16 sm:px-6 sm:pt-28 lg:px-8"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-8">
        {/* LEFT — Text */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
          className={`order-2 flex flex-col gap-4 sm:gap-6 lg:order-1 ${
            isAr ? "items-center text-center lg:items-start lg:text-right" : "items-center text-left lg:items-start"
          }`}
        >
          {/* Available badge */}
          <motion.div
            variants={fadeUp}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-gold-primary/25 bg-surface/40 px-4 py-1.5 backdrop-blur-sm self-center lg:self-auto"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider-cinema text-text-secondary">
              {t.hero.available}
            </span>
          </motion.div>

          {/* Greeting */}
          <motion.p
            variants={fadeUp}
            className="font-mono text-sm uppercase tracking-wider-cinema text-gold-primary/80"
          >
            {t.hero.greeting}
          </motion.p>

          {/* Name */}
          <motion.h1
            variants={fadeUp}
            className="font-name text-4xl leading-[1.05] tracking-cinematic text-text-primary sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {t.hero.name}
          </motion.h1>

          {/* Role */}
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 lg:justify-start">
            <span className="h-px w-10 bg-gold-gradient" />
            <span className="font-mono text-lg font-medium tracking-wide text-gold-primary glow-text-soft sm:text-xl">
              {t.hero.role}
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="max-w-md text-center font-cairo text-base leading-relaxed text-text-secondary sm:text-lg lg:text-left"
          >
            {t.hero.description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-4 pt-2 lg:justify-start"
          >
            <button
              onClick={() => scrollTo("projects")}
              onMouseEnter={() => setVariant("hover")}
              onMouseLeave={() => setVariant("default")}
              className="group relative overflow-hidden rounded-full px-8 py-3.5"
            >
              <span className="absolute inset-0 bg-gold-gradient transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute inset-0 bg-gold-gradient opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-70" />
              <span className="relative z-10 flex items-center gap-2 font-cairo text-sm font-bold tracking-cinematic text-bg-primary">
                {t.hero.ctaProjects}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </button>

            <button
              onClick={() => scrollTo("contact")}
              onMouseEnter={() => setVariant("hover")}
              onMouseLeave={() => setVariant("default")}
              className="group flex items-center gap-2 rounded-full border border-gold-primary/40 px-8 py-3.5 font-cairo text-sm font-medium text-text-primary transition-all duration-500 hover:border-gold-primary hover:bg-gold-primary/5 hover:text-gold-primary"
            >
              {t.hero.ctaContact}
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            className="mt-2 flex items-center justify-center gap-8 pt-4 sm:mt-4 lg:justify-start"
          >
            {[
              { num: "+30", label: t.hero.stat1 },
              { num: "+5", label: t.hero.stat2 },
              { num: "+20", label: t.hero.stat3 },
            ].map((s, i) => (
              <div key={i} className="flex flex-col">
                <span className="font-cairo text-2xl font-bold text-gold-primary sm:text-3xl">
                  {s.num}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider-cinema text-text-secondary">
                  {s.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT — Eclipse photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="relative order-1 flex items-center justify-center lg:order-2"
        >
          <EclipsePhoto />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => scrollTo("projects")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        onMouseEnter={() => setVariant("hover")}
        onMouseLeave={() => setVariant("default")}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-text-secondary transition-colors hover:text-gold-primary sm:flex"
        aria-label={t.hero.scroll}
      >
        <span className="font-mono text-[10px] uppercase tracking-wider-cinema">
          {t.hero.scroll}
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </motion.button>
    </section>
  );
}

function EclipsePhoto() {
  const { setVariant } = useCursor();
  return (
    <div
      className="relative aspect-square w-[220px] sm:w-[320px] lg:w-[460px]"
      onMouseEnter={() => setVariant("hover")}
      onMouseLeave={() => setVariant("default")}
    >
      {/* Outer rotating ring with notches */}
      <div className="absolute inset-[-8%] animate-eclipse-rotate">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d6b25e" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#c9a227" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8a6a2f" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <circle
            cx="100"
            cy="100"
            r="96"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="0.5"
            strokeDasharray="2 6"
          />
          {/* Notches at cardinal points */}
          {[0, 90, 180, 270].map((deg) => (
            <rect
              key={deg}
              x="99"
              y="2"
              width="2"
              height="6"
              fill="#d6b25e"
              opacity="0.6"
              transform={`rotate(${deg} 100 100)`}
            />
          ))}
        </svg>
      </div>

      {/* Middle ring (counter-rotating) */}
      <div
        className="absolute inset-[-2%] animate-glow-breathe rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, rgba(214,178,94,0.15) 60deg, transparent 120deg, rgba(214,178,94,0.1) 180deg, transparent 240deg, rgba(214,178,94,0.15) 300deg, transparent 360deg)",
          padding: "2px",
        }}
      >
        <div className="h-full w-full rounded-full bg-bg-primary" />
      </div>

      {/* Glow halo */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow:
            "0 0 60px rgba(214,178,94,0.3), 0 0 120px rgba(214,178,94,0.15), inset 0 0 60px rgba(0,0,0,0.6)",
        }}
      />

      {/* Photo container with eclipse mask */}
      <div className="absolute inset-[6%] overflow-hidden rounded-full">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(214,178,94,0.25) 0%, transparent 50%)",
            zIndex: 2,
          }}
        />
        <img
          src="/images/profile.png"
          alt="M. Mahdy — Full Stack Developer"
          className="h-full w-full object-cover"
          style={{ filter: "contrast(1.05) brightness(0.95) saturate(0.85)" }}
        />
        {/* Eclipse shadow sweep */}
        <div className="absolute inset-0 bg-gradient-to-tr from-bg-primary/40 via-transparent to-gold-primary/10" />
        {/* Top light (cinematic key light) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(214,178,94,0.35) 0%, transparent 45%)",
          }}
        />
      </div>

      {/* Inner gold border */}
      <div className="absolute inset-[6%] rounded-full border border-gold-primary/40" />

      {/* Floating accent sparkles */}
      <motion.div
        className="absolute -right-2 top-1/4 flex h-8 w-8 items-center justify-center"
        animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="h-4 w-4 text-gold-primary glow-text-soft" />
      </motion.div>
      <motion.div
        className="absolute -left-3 bottom-1/3 flex h-6 w-6 items-center justify-center"
        animate={{ y: [0, 10, 0], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Sparkles className="h-3 w-3 text-gold-primary" />
      </motion.div>

      {/* Decorative orbiting dot */}
      <div className="absolute inset-0 animate-eclipse-rotate">
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-gold-primary glow-gold-strong" />
      </div>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};
