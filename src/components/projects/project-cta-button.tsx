"use client";

import { type ReactNode } from "react";
import { ExternalLink, type LucideIcon } from "lucide-react";
import { useCursor } from "@/components/cursor/cursor-provider";

interface ProjectCtaButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  icon?: LucideIcon;
  external?: boolean;
}

/**
 * Reusable call-to-action button for project action links (Live Demo / GitHub).
 * - primary: gold gradient fill (for Live Demo)
 * - secondary: bordered outline (for GitHub)
 */
export function ProjectCtaButton({
  href,
  children,
  variant = "secondary",
  icon: Icon,
  external = true,
}: ProjectCtaButtonProps) {
  const { setVariant } = useCursor();
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setVariant("hover")}
      onMouseLeave={() => setVariant("default")}
      className={
        variant === "primary"
          ? "group relative flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 transition-transform duration-500 hover:scale-[1.04]"
          : "group flex items-center gap-2 rounded-full border border-gold-primary/40 px-6 py-3 font-cairo text-sm font-medium text-text-primary transition-all duration-500 hover:border-gold-primary hover:bg-gold-primary/5 hover:text-gold-primary"
      }
      aria-label={typeof children === "string" ? children : undefined}
    >
      {variant === "primary" && (
        <>
          <span className="absolute inset-0 bg-gold-gradient transition-transform duration-500 group-hover:scale-105" />
          <span className="absolute inset-0 bg-gold-gradient opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60" />
        </>
      )}
      <span
        className={
          variant === "primary"
            ? "relative z-10 flex items-center gap-2 font-cairo text-sm font-bold tracking-cinematic text-bg-primary"
            : "flex items-center gap-2 font-cairo text-sm font-medium"
        }
      >
        {children}
        {Icon ? (
          <Icon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        ) : (
          <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        )}
      </span>
    </a>
  );
}
