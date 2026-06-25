"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/language-provider";

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showEnter, setShowEnter] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const stepDurations = [1400, 1600];
    let current = 0;

    const next = () => {
      if (current < stepDurations.length) {
        setStep(current);
        const dur = stepDurations[current];
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const pct = Math.min(
            ((current + elapsed / dur) / stepDurations.length) * 100,
            100
          );
          setProgress(pct);
          if (elapsed < dur) {
            requestAnimationFrame(tick);
          } else {
            current += 1;
            if (current < stepDurations.length) {
              next();
            } else {
              setProgress(100);
              setTimeout(() => setShowEnter(true), 300);
            }
          }
        };
        tick();
      }
    };

    const timer = setTimeout(next, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(onComplete, 900);
  };

  const labels = [t.loading.step1, t.loading.step2];
  const statusLabels = [
    t.loading.initializing,
    t.loading.loadingModules,
    t.loading.calibrating,
    t.loading.synchronizing,
  ];

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-[#07070a]"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.08,
            filter: "blur(8px)",
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Vignette */}
          <div className="absolute inset-0 radial-vignette" />
          {/* Grain */}
          <div className="absolute inset-0 grain-overlay" />

          {/* Eclipse orb in background */}
          <motion.div
            className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(214,178,94,0.12) 0%, rgba(214,178,94,0.04) 40%, transparent 70%)",
              filter: "blur(20px)",
            }}
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Rotating eclipse ring */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <div className="h-[420px] w-[420px] rounded-full border border-gold-primary/20" />
          </motion.div>
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          >
            <div
              className="h-[340px] w-[340px] rounded-full border border-gold-primary/10"
              style={{ borderTopColor: "rgba(214,178,94,0.5)" }}
            />
          </motion.div>

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            {/* Eclipse symbol */}
            <motion.div
              className="relative mb-10 h-24 w-24"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute inset-0 rounded-full bg-gold-gradient opacity-90 glow-gold-strong" />
              <motion.div
                className="absolute inset-[18%] rounded-full bg-[#07070a]"
                animate={{
                  x: [-6, 6, -6],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Status label */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <div className="mb-2 font-mono text-[10px] uppercase tracking-wider-cinema text-gold-primary/70">
                  {statusLabels[Math.min(step, statusLabels.length - 1)]}
                </div>
                <h1 className="font-cairo text-xl font-medium text-text-primary sm:text-2xl">
                  {showEnter ? t.loading.step2 : labels[step] ?? t.loading.step2}
                </h1>
              </motion.div>
            </AnimatePresence>

            {/* Progress bar */}
            {!showEnter && (
              <div className="relative h-px w-56 overflow-hidden bg-eclipse-border sm:w-72">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gold-gradient"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="absolute inset-y-0 w-12 -translate-x-12"
                  style={{
                    left: `${progress}%`,
                    background:
                      "linear-gradient(90deg, transparent, rgba(214,178,94,0.8), transparent)",
                  }}
                />
              </div>
            )}

            {/* Percentage */}
            {!showEnter && (
              <motion.div
                className="mt-4 font-mono text-[11px] tracking-wider-cinema text-text-secondary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {Math.round(progress).toString().padStart(2, "0")}%
              </motion.div>
            )}

            {/* Enter button */}
            <AnimatePresence>
              {showEnter && (
                <motion.button
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  onClick={handleEnter}
                  className="group relative mt-4 overflow-hidden rounded-full border border-gold-primary/40 px-10 py-3"
                >
                  <span className="absolute inset-0 bg-gold-gradient opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="relative z-10 font-cairo text-sm font-medium tracking-cinematic text-gold-primary transition-colors duration-500 group-hover:text-bg-primary">
                    {t.loading.enter}
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Corner brackets — cinematic frame */}
          <CornerBrackets />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CornerBrackets() {
  const bracket = "absolute h-8 w-8 border-gold-primary/30";
  return (
    <>
      <div className={`${bracket} left-6 top-6 border-l border-t`} />
      <div className={`${bracket} right-6 top-6 border-r border-t`} />
      <div className={`${bracket} bottom-6 left-6 border-b border-l`} />
      <div className={`${bracket} bottom-6 right-6 border-b border-r`} />
    </>
  );
}
