"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Menu, X } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useCursor } from "@/components/cursor/cursor-provider";

export function NavBar() {
  const { t, lang, toggle } = useLanguage();
  const { setVariant } = useCursor();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      const sections = ["home", "projects", "services", "contact"];
      const offsets = sections.map((id) => {
        const el = document.getElementById(id);
        if (!el) return { id, top: Infinity };
        const rect = el.getBoundingClientRect();
        return { id, top: Math.abs(rect.top - 120) };
      });
      const closest = offsets.reduce((a, b) =>
        a.top < b.top ? a : b
      );
      setActive(closest.id);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { id: "home", label: t.nav.home },
    { id: "projects", label: t.nav.projects },
    { id: "services", label: t.nav.services },
    { id: "contact", label: t.nav.contact },
  ];

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4"
      >
        <div
          className={`flex w-full max-w-5xl items-center justify-between rounded-full px-3 py-2 transition-all duration-500 sm:px-6 sm:py-2.5 ${
            scrolled
              ? "glass-surface shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
              : "border border-transparent"
          }`}
        >
          {/* Logo / Eclipse mark */}
          <button
            onClick={() => scrollTo("home")}
            onMouseEnter={() => setVariant("hover")}
            onMouseLeave={() => setVariant("default")}
            className="group flex items-center gap-2.5"
            aria-label="M. Mahdy — Home"
          >
            <span className="relative flex h-8 w-8 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-gold-gradient opacity-90 transition-transform duration-700 group-hover:scale-110" />
              <span className="absolute inset-[5px] rounded-full bg-bg-primary transition-transform duration-700 group-hover:scale-95" />
              <span className="absolute inset-[5px] translate-x-[3px] rounded-full bg-gold-primary/80" />
            </span>
            <span className="font-name text-sm tracking-cinematic text-text-primary">
              M.<span className="text-gold-primary">MAHDY</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                onMouseEnter={() => setVariant("hover")}
                onMouseLeave={() => setVariant("default")}
                className="relative px-4 py-2 text-sm font-medium transition-colors"
              >
                <span
                  className={
                    active === item.id
                      ? "text-gold-primary"
                      : "text-text-secondary hover:text-text-primary"
                  }
                >
                  {item.label}
                </span>
                {active === item.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3 -bottom-0.5 h-px bg-gold-gradient"
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              onMouseEnter={() => setVariant("hover")}
              onMouseLeave={() => setVariant("default")}
              className="flex items-center gap-1.5 rounded-full border border-gold-primary/25 px-3 py-1.5 text-xs font-medium text-text-secondary transition-all hover:border-gold-primary/60 hover:text-gold-primary"
              aria-label="Toggle language"
            >
              <Globe className="h-3.5 w-3.5" />
              <span className="font-cairo">{t.nav.langToggle}</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              onMouseEnter={() => setVariant("hover")}
              onMouseLeave={() => setVariant("default")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-primary/25 text-text-secondary transition-all hover:border-gold-primary/60 hover:text-gold-primary md:hidden"
              aria-label="Menu"
            >
              {menuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-bg-primary/95 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col items-center gap-8">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i + 0.1 }}
                  onClick={() => scrollTo(item.id)}
                  className="font-cairo text-3xl font-medium text-text-primary transition-colors hover:text-gold-primary"
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
