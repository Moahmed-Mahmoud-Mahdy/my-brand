"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Layers,
  Compass,
  GraduationCap,
  ArrowUpRight,
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useCursor } from "@/components/cursor/cursor-provider";

export function ServicesSection() {
  const { t, lang } = useLanguage();
  const { setVariant } = useCursor();
  const isAr = lang === "ar";

  const services = [
    {
      icon: Code2,
      key: "fullstack" as const,
      number: "01",
    },
    {
      icon: Layers,
      key: "frontend" as const,
      number: "02",
    },
    {
      icon: Compass,
      key: "consultation" as const,
      number: "03",
    },
    {
      icon: GraduationCap,
      key: "graduation" as const,
      number: "04",
    },
  ];

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="services"
      className="relative px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
    >
      {/* Background eclipse glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-primary/[0.03] blur-3xl" />

      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold-primary/25 px-4 py-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold-primary glow-gold" />
            <span className="font-mono text-[11px] uppercase tracking-wider-cinema text-gold-primary/80">
              {t.services.tag}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-3 font-cairo text-4xl font-bold tracking-cinematic text-text-primary sm:text-5xl"
          >
            {t.services.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-lg font-cairo text-base text-text-secondary"
          >
            {t.services.subtitle}
          </motion.p>
        </div>

        {/* Services grid — circular cards */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {services.map((service, idx) => {
            const Icon = service.icon;
            const data = t.services.list[service.key];
            return (
              <motion.div
                key={service.key}
                initial={{ opacity: 0, y: 40, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.9,
                  delay: idx * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onMouseEnter={() => setVariant("hover")}
                onMouseLeave={() => setVariant("default")}
                className="group relative flex flex-col items-center"
              >
                {/* Circular card */}
                <div className="relative flex aspect-square w-full max-w-[260px] items-center justify-center">
                  {/* Outer ring */}
                  <div className="absolute inset-0 rounded-full border border-eclipse-border transition-all duration-700 group-hover:border-gold-primary/40" />

                  {/* Rotating conic gradient ring */}
                  <div
                    className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                    style={{
                      background:
                        "conic-gradient(from 0deg, transparent 0deg, rgba(214,178,94,0.4) 90deg, transparent 180deg, rgba(214,178,94,0.2) 270deg, transparent 360deg)",
                      mask: "radial-gradient(transparent 88%, black 90%)",
                      WebkitMask:
                        "radial-gradient(transparent 88%, black 90%)",
                      animation: "eclipse-rotate 8s linear infinite",
                    }}
                  />

                  {/* Inner content surface */}
                  <div className="absolute inset-[4%] flex flex-col items-center justify-center gap-3 rounded-full border border-gold-primary/15 bg-surface/40 backdrop-blur-sm transition-all duration-700 group-hover:bg-surface/70 group-hover:shadow-[inset_0_0_40px_rgba(214,178,94,0.1)]">
                    {/* Number */}
                    <span className="font-mono text-[10px] uppercase tracking-wider-cinema text-gold-primary/60">
                      {service.number}
                    </span>
                    {/* Icon */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-primary/25 transition-all duration-700 group-hover:border-gold-primary group-hover:shadow-[0_0_24px_rgba(214,178,94,0.4)]">
                      <Icon className="h-6 w-6 text-gold-primary transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    {/* Title */}
                    <h3 className="px-4 text-center font-cairo text-sm font-bold leading-tight text-text-primary transition-colors duration-300 group-hover:text-gold-primary">
                      {data.title}
                    </h3>
                  </div>

                  {/* Corner arrow indicator */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gold-primary/30 bg-bg-primary transition-all duration-500 group-hover:border-gold-primary group-hover:bg-gold-primary">
                      <ArrowUpRight className="h-3.5 w-3.5 text-gold-primary transition-colors duration-500 group-hover:text-bg-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* Description below */}
                <p className="mt-6 max-w-[240px] text-center font-cairo text-sm leading-relaxed text-text-secondary">
                  {data.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 flex justify-center sm:mt-20"
        >
          <button
            onClick={scrollToContact}
            onMouseEnter={() => setVariant("hover")}
            onMouseLeave={() => setVariant("default")}
            className="group relative overflow-hidden rounded-full px-8 py-3.5"
          >
            <span className="absolute inset-0 border border-gold-primary/40 transition-colors duration-500 group-hover:border-gold-primary" />
            <span className="absolute inset-0 bg-gold-primary/0 transition-colors duration-500 group-hover:bg-gold-primary/10" />
            <span className="relative z-10 flex items-center gap-2 font-cairo text-sm font-medium text-text-primary transition-colors duration-500 group-hover:text-gold-primary">
              {t.services.cta}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
