"use client";

import { useEffect, useState } from "react";
import { LoadingScreen } from "@/components/effects/loading-screen";
import { AmbientBackground } from "@/components/effects/ambient-background";
import { NavBar } from "@/components/sections/nav-bar";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ServicesSection } from "@/components/sections/services-section";
import { ContactSection } from "@/components/sections/contact-section";
import { Footer } from "@/components/sections/footer";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

export default function Home() {
  const [loading, setLoading] = useState(true);

  // Seed DB on first load (creates default projects + admin)
  useEffect(() => {
    fetch("/api/seed", { method: "POST" }).catch(() => {});
  }, []);

  return (
    <>
      <AmbientBackground />
      <SonnerToaster
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--surface)",
            border: "1px solid rgba(214,178,94,0.3)",
            color: "var(--text-primary)",
          },
        }}
      />
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

      <div
        className={`relative z-10 flex min-h-screen flex-col overflow-x-hidden transition-opacity duration-700 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        <NavBar />
        <main className="flex-1">
          <HeroSection />
          <SectionDivider label="I" />
          <ProjectsSection />
          <SectionDivider label="II" />
          <ServicesSection />
          <SectionDivider label="III" />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="relative mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-2">
      <div className="flex items-center gap-4">
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold-primary/40 sm:w-24" />
        <span className="font-mono text-[10px] uppercase tracking-wider-cinema text-gold-primary/40">
          {label}
        </span>
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold-primary/40 sm:w-24" />
      </div>
    </div>
  );
}
