"use client";

import { motion } from "framer-motion";
import { Monitor, Smartphone } from "lucide-react";
import { useCursor } from "@/components/cursor/cursor-provider";

interface ProjectVisualsProps {
  desktopScreenshot: string;
  mobileScreenshot: string | null;
  title: string;
  desktopLabel: string;
  mobileLabel: string;
}

/**
 * Premium presentation of a project's desktop + mobile screenshots.
 * Desktop mockup fills the panel; mobile mockup floats overlapping at the
 * corner for a balanced, cinematic composition.
 */
export function ProjectVisuals({
  desktopScreenshot,
  mobileScreenshot,
  title,
  desktopLabel,
  mobileLabel,
}: ProjectVisualsProps) {
  const { setVariant } = useCursor();
  return (
    <div
      className="relative flex h-full min-h-[320px] items-center justify-center overflow-hidden p-6 sm:p-8"
      onMouseEnter={() => setVariant("default")}
    >
      {/* Ambient eclipse glow behind visuals */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gold-primary/[0.06] blur-3xl" />

      {/* Desktop browser mockup */}
      <motion.div
        initial={{ opacity: 0, x: -24, rotate: -1 }}
        animate={{ opacity: 1, x: 0, rotate: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="relative z-10 w-full max-w-[440px]"
      >
        <BrowserFrame label={desktopLabel}>
          <img
            src={desktopScreenshot}
            alt={`${title} — ${desktopLabel}`}
            className="h-full w-full object-cover"
            style={{ filter: "brightness(0.92) saturate(0.95)" }}
          />
        </BrowserFrame>
      </motion.div>

      {/* Mobile phone mockup (overlapping) */}
      {mobileScreenshot && (
        <motion.div
          initial={{ opacity: 0, y: 30, x: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
          className="absolute bottom-4 z-20 w-[88px] sm:bottom-6 sm:w-[104px]"
          style={{ insetInlineEnd: "1.5rem" }}
        >
          <PhoneFrame label={mobileLabel}>
            <img
              src={mobileScreenshot}
              alt={`${title} — ${mobileLabel}`}
              className="h-full w-full object-cover"
              style={{ filter: "brightness(0.92) saturate(0.95)" }}
            />
          </PhoneFrame>
        </motion.div>
      )}
    </div>
  );
}

function BrowserFrame({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gold-primary/20 bg-surface shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-eclipse-border/60 bg-bg-secondary/60 px-3 py-2">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/50" />
        </div>
        <div className="mx-auto flex items-center gap-1.5 rounded-md bg-bg-primary/60 px-3 py-0.5">
          <Monitor className="h-3 w-3 text-gold-primary/60" />
          <span className="font-mono text-[9px] uppercase tracking-wider text-text-secondary">
            {label}
          </span>
        </div>
      </div>
      {/* Viewport */}
      <div className="aspect-[4/3] w-full overflow-hidden bg-bg-primary">
        {children}
      </div>
    </div>
  );
}

function PhoneFrame({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[1.4rem] border border-gold-primary/30 bg-surface p-1 shadow-[0_16px_48px_rgba(0,0,0,0.6)]">
      {/* Notch */}
      <div className="absolute left-1/2 top-1 z-20 h-1 w-8 -translate-x-1/2 rounded-full bg-gold-primary/30" />
      <div className="aspect-[9/19] overflow-hidden rounded-[1.1rem] bg-bg-primary">
        {children}
      </div>
      {/* Label chip */}
      <div className="absolute -bottom-1 left-1/2 z-20 -translate-x-1/2 translate-y-full rounded-full border border-gold-primary/30 bg-bg-primary px-2 py-0.5 opacity-0">
        <span className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-wider text-gold-primary/70">
          <Smartphone className="h-2 w-2" />
          {label}
        </span>
      </div>
    </div>
  );
}
