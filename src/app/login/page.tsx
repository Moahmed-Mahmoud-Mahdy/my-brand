"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, ArrowLeft, Shield } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useCursor } from "@/components/cursor/cursor-provider";
import { toast } from "sonner";
import { AmbientBackground } from "@/components/effects/ambient-background";
import { storeToken, getStoredToken } from "@/lib/auth";

export default function LoginPage() {
  const { t, lang } = useLanguage();
  const { setVariant } = useCursor();
  const router = useRouter();
  const isAr = lang === "ar";
  const [email, setEmail] = useState("admin@mahdy.dev");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If we already have a token in localStorage (or cookie), skip login.
    const token = getStoredToken();
    fetch("/api/auth/check", {
      headers: token ? { "x-admin-token": token } : {},
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) router.push("/dashboard");
      })
      .catch(() => {});
  }, [router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(t.admin.login.error);
        return;
      }
      // Store token in localStorage as a fallback for iframe contexts
      // where SameSite cookies may be blocked.
      storeToken();
      toast.success(isAr ? "تم تسجيل الدخول" : "Signed in");
      router.push("/dashboard");
    } catch {
      toast.error(t.admin.login.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <AmbientBackground />

      {/* Back to site */}
      <button
        onClick={() => router.push("/")}
        onMouseEnter={() => setVariant("hover")}
        onMouseLeave={() => setVariant("default")}
        className="absolute left-6 top-6 z-20 flex items-center gap-2 font-mono text-xs text-text-secondary transition-colors hover:text-gold-primary"
      >
        {isAr ? (
          <ArrowLeft className="h-3.5 w-3.5" />
        ) : (
          <ArrowRight className="h-3.5 w-3.5 rotate-180" />
        )}
        {t.admin.login.back}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="relative overflow-hidden rounded-3xl border border-gold-primary/20 bg-surface/60 p-8 backdrop-blur-xl">
          {/* Eclipse glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gold-primary/10 blur-3xl" />

          {/* Header */}
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-gold-primary/30">
              <div className="absolute inset-0 rounded-full bg-gold-primary/5" />
              <Shield className="h-6 w-6 text-gold-primary" />
            </div>
            <h1 className="font-cairo text-2xl font-bold text-text-primary">
              {t.admin.login.title}
            </h1>
            <p className="font-cairo text-sm text-text-secondary">
              {t.admin.login.subtitle}
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[11px] uppercase tracking-wider-cinema text-text-secondary">
                {t.admin.login.email}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  onMouseEnter={() => setVariant("text")}
                  onMouseLeave={() => setVariant("default")}
                  className="w-full rounded-xl border border-eclipse-border bg-bg-primary/60 py-3 pr-4 pl-10 font-cairo text-text-primary transition-all focus:border-gold-primary/60 focus:outline-none focus:ring-1 focus:ring-gold-primary/40"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[11px] uppercase tracking-wider-cinema text-text-secondary">
                {t.admin.login.password}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  onMouseEnter={() => setVariant("text")}
                  onMouseLeave={() => setVariant("default")}
                  className="w-full rounded-xl border border-eclipse-border bg-bg-primary/60 py-3 pr-4 pl-10 font-cairo text-text-primary transition-all focus:border-gold-primary/60 focus:outline-none focus:ring-1 focus:ring-gold-primary/40"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              onMouseEnter={() => setVariant("hover")}
              onMouseLeave={() => setVariant("default")}
              className="group relative mt-2 flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-3.5 disabled:opacity-70"
            >
              <span className="absolute inset-0 bg-gold-gradient transition-transform duration-500 group-hover:scale-105" />
              <span className="relative z-10 flex items-center gap-2 font-cairo text-sm font-bold tracking-cinematic text-bg-primary">
                {t.admin.login.submit}
                {isAr ? (
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                ) : (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                )}
              </span>
            </button>
          </form>

          <p className="mt-6 text-center font-mono text-[10px] text-text-secondary/70">
            {t.admin.login.hint}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
