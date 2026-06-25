"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient cosmic background — renders an eclipse glow, subtle stars,
 * and drifting particles on a canvas. Purely decorative.
 */
export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;

    type Star = {
      x: number;
      y: number;
      r: number;
      tw: number; // twinkle phase
      tws: number; // twinkle speed
    };
    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
    };
    let stars: Star[] = [];
    let particles: Particle[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // regenerate stars based on screen size
      const count = Math.min(120, Math.floor((w * h) / 14000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.2,
        tw: Math.random() * Math.PI * 2,
        tws: Math.random() * 0.02 + 0.005,
      }));
    };

    const spawnParticle = () => {
      if (particles.length > 28) return;
      particles.push({
        x: Math.random() * w,
        y: h + 10,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -(Math.random() * 0.35 + 0.15),
        life: 0,
        maxLife: Math.random() * 600 + 400,
        size: Math.random() * 1.6 + 0.4,
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // stars
      for (const s of stars) {
        s.tw += s.tws;
        const alpha = 0.15 + Math.abs(Math.sin(s.tw)) * 0.6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(214, 178, 94, ${alpha * 0.5})`;
        ctx.fill();
      }

      // particles (drifting gold motes)
      if (Math.random() < 0.3) spawnParticle();
      particles = particles.filter((p) => p.life < p.maxLife && p.y > -20);
      for (const p of particles) {
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        const lifeRatio = p.life / p.maxLife;
        const alpha = Math.sin(lifeRatio * Math.PI) * 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(214, 178, 94, ${alpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = "rgba(214,178,94,0.6)";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Deep base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(22,22,29,0.9) 0%, rgba(7,7,10,1) 60%), radial-gradient(ellipse 60% 80% at 50% 100%, rgba(15,15,20,0.6) 0%, transparent 70%)",
        }}
      />
      {/* Stars + particles */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-70" />
      {/* Vignette */}
      <div className="absolute inset-0 radial-vignette" />
    </div>
  );
}
