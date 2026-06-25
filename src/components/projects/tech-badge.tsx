"use client";

import { motion } from "framer-motion";

interface TechBadgeProps {
  tech: string;
  index?: number;
}

/**
 * Minimal premium tech-stack pill with subtle gold border + accent dot.
 */
export function TechBadge({ tech, index = 0 }: TechBadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 * index }}
      className="group/badge inline-flex items-center gap-1.5 rounded-full border border-gold-primary/25 bg-gold-primary/[0.04] px-3 py-1 font-mono text-xs text-text-primary transition-colors duration-300 hover:border-gold-primary/50 hover:bg-gold-primary/10"
    >
      <span className="h-1 w-1 rounded-full bg-gold-primary/70 transition-colors group-hover/badge:bg-gold-primary" />
      {tech}
    </motion.span>
  );
}
