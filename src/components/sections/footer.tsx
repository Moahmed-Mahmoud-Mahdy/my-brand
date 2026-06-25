"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Instagram, ArrowUp } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useCursor } from "@/components/cursor/cursor-provider";

export function Footer() {
  const { t } = useLanguage();
  const { setVariant } = useCursor();

  const navItems = [
    { id: "home", label: t.footer.nav.home },
    { id: "projects", label: t.footer.nav.projects },
    { id: "services", label: t.footer.nav.services },
    { id: "contact", label: t.footer.nav.contact },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-auto border-t border-eclipse-border/60 bg-bg-secondary/40 backdrop-blur-sm">
      {/* Top glow line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-primary/40 to-transparent" />

      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-between md:gap-4">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-3 text-center md:items-start md:text-left"
          >
            <button
              onClick={scrollTop}
              onMouseEnter={() => setVariant("hover")}
              onMouseLeave={() => setVariant("default")}
              className="group flex items-center gap-2.5"
            >
              <span className="relative flex h-8 w-8 items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-gold-gradient opacity-90 transition-transform duration-700 group-hover:scale-110" />
                <span className="absolute inset-[5px] rounded-full bg-bg-primary" />
                <span className="absolute inset-[5px] translate-x-[3px] rounded-full bg-gold-primary/80" />
              </span>
              <span className="font-name text-sm tracking-cinematic text-text-primary">
                M.<span className="text-gold-primary">MAHDY</span>
              </span>
            </button>
            <p className="max-w-xs font-cairo text-xs text-text-secondary">
              {t.footer.tagline}
            </p>
          </motion.div>

          {/* Nav */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                onMouseEnter={() => setVariant("hover")}
                onMouseLeave={() => setVariant("default")}
                className="font-cairo text-sm text-text-secondary transition-colors hover:text-gold-primary"
              >
                {item.label}
              </button>
            ))}
          </motion.nav>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-3"
          >
            {[
              { Icon: Github, href: "https://github.com/Moahmed-Mahmoud-Mahdy", label: "GitHub" },
              {
                Icon: Linkedin,
                href: "https://www.linkedin.com/in/mohamed-mahdy-898217305/",
                label: "LinkedIn",
              },
              { Icon: Instagram, href: "https://www.instagram.com/mr_ultra_1/", label: "Instagram" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setVariant("hover")}
                onMouseLeave={() => setVariant("default")}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-eclipse-border text-text-secondary transition-all hover:border-gold-primary hover:text-gold-primary"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-eclipse-border/40 pt-6 sm:flex-row">
          <p className="font-mono text-[11px] text-text-secondary">
            © {new Date().getFullYear()} M. Mahdy. {t.footer.rights}.
          </p>
          <p className="font-mono text-[11px] text-text-secondary">
            {t.footer.madeWith}{" "}
            <span className="text-gold-primary">✦</span>
          </p>
          <button
            onClick={scrollTop}
            onMouseEnter={() => setVariant("hover")}
            onMouseLeave={() => setVariant("default")}
            className="flex items-center gap-1.5 font-mono text-[11px] text-text-secondary transition-colors hover:text-gold-primary"
          >
            <ArrowUp className="h-3 w-3" />
            Top
          </button>
        </div>
      </div>
    </footer>
  );
}
