"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Send,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Github,
  Linkedin,
  Twitter,
  Loader2,
  CheckCircle2,
  Radio,
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useCursor } from "@/components/cursor/cursor-provider";
import { toast } from "sonner";

const WHATSAPP_NUMBER = "201000000000"; // placeholder

export function ContactSection() {
  const { t } = useLanguage();
  const { setVariant } = useCursor();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast.error(t.contact.error);
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error("failed");
      setSent(true);
      toast.success(t.contact.sent);
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setSent(false), 4000);
    } catch {
      toast.error(t.contact.error);
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
    >
      <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <div className="mb-14 flex flex-col items-center text-center sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold-primary/25 px-4 py-1.5"
          >
            <Radio className="h-3 w-3 text-gold-primary glow-gold" />
            <span className="font-mono text-[11px] uppercase tracking-wider-cinema text-gold-primary/80">
              {t.contact.tag}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-3 font-cairo text-4xl font-bold tracking-cinematic text-text-primary sm:text-5xl"
          >
            {t.contact.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-lg font-cairo text-base text-text-secondary"
          >
            {t.contact.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Form — Signal Transmission */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3"
          >
            <div className="relative overflow-hidden rounded-3xl border border-gold-primary/20 bg-surface/40 p-6 backdrop-blur-sm sm:p-8">
              {/* Scan line effect */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                <div
                  className="absolute inset-x-0 h-px animate-scan-line"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(214,178,94,0.6), transparent)",
                  }}
                />
              </div>

              {/* Corner brackets */}
              <CornerBracket className="left-3 top-3 border-l border-t" />
              <CornerBracket className="right-3 top-3 border-r border-t" />
              <CornerBracket className="bottom-3 left-3 border-b border-l" />
              <CornerBracket className="bottom-3 right-3 border-b border-r" />

              <form onSubmit={onSubmit} className="relative flex flex-col gap-5">
                {/* Signal status bar */}
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-primary/60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-primary" />
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider-cinema text-gold-primary/70">
                      Channel Open
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-text-secondary">
                    ENC: AES-256
                  </span>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-wider-cinema text-text-secondary">
                    {t.contact.name}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.contact.namePlaceholder}
                    onMouseEnter={() => setVariant("text")}
                    onMouseLeave={() => setVariant("default")}
                    required
                    className="rounded-xl border border-eclipse-border bg-bg-primary/60 px-4 py-3 font-cairo text-text-primary placeholder:text-text-secondary/50 transition-all focus:border-gold-primary/60 focus:outline-none focus:ring-1 focus:ring-gold-primary/40"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-wider-cinema text-text-secondary">
                    {t.contact.email}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.contact.emailPlaceholder}
                    onMouseEnter={() => setVariant("text")}
                    onMouseLeave={() => setVariant("default")}
                    className="rounded-xl border border-eclipse-border bg-bg-primary/60 px-4 py-3 font-cairo text-text-primary placeholder:text-text-secondary/50 transition-all focus:border-gold-primary/60 focus:outline-none focus:ring-1 focus:ring-gold-primary/40"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-wider-cinema text-text-secondary">
                    {t.contact.message}
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.contact.messagePlaceholder}
                    onMouseEnter={() => setVariant("text")}
                    onMouseLeave={() => setVariant("default")}
                    required
                    rows={4}
                    className="resize-none rounded-xl border border-eclipse-border bg-bg-primary/60 px-4 py-3 font-cairo text-text-primary placeholder:text-text-secondary/50 transition-all focus:border-gold-primary/60 focus:outline-none focus:ring-1 focus:ring-gold-primary/40"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={sending || sent}
                  onMouseEnter={() => setVariant("hover")}
                  onMouseLeave={() => setVariant("default")}
                  className="group relative mt-2 flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-3.5 disabled:opacity-70"
                >
                  <span
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      sent ? "bg-emerald-500/80" : "bg-gold-gradient"
                    }`}
                  />
                  <span className="absolute inset-0 bg-gold-gradient opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60" />
                  <span className="relative z-10 flex items-center gap-2 font-cairo text-sm font-bold tracking-cinematic text-bg-primary">
                    {sending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t.contact.sending}
                      </>
                    ) : sent ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        {t.contact.sent}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                        {t.contact.send}
                      </>
                    )}
                  </span>
                </button>
              </form>
            </div>
          </motion.div>

          {/* Side — WhatsApp + info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="flex flex-col gap-4 lg:col-span-2"
          >
            {/* WhatsApp primary CTA */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setVariant("hover")}
              onMouseLeave={() => setVariant("default")}
              className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 transition-all hover:border-emerald-500/60 hover:bg-emerald-500/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 transition-transform duration-500 group-hover:scale-110">
                <MessageCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] uppercase tracking-wider-cinema text-emerald-400/70">
                  {t.contact.whatsapp}
                </span>
                <span className="font-cairo text-base font-bold text-text-primary">
                  {t.contact.whatsappCta}
                </span>
              </div>
              <ArrowUpRightIcon />
            </a>

            {/* Info cards */}
            <div className="flex flex-col gap-3">
              <InfoRow
                icon={Mail}
                label={t.contact.emailLabel}
                value="hello@mahdy.dev"
              />
              <InfoRow
                icon={MapPin}
                label=""
                value={t.contact.location}
              />
              <InfoRow
                icon={Clock}
                label=""
                value={t.contact.responseTime}
              />
            </div>

            {/* Social links */}
            <div className="mt-2 flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider-cinema text-text-secondary">
                {t.contact.social}
              </span>
              <div className="flex gap-3">
                {[
                  { Icon: Github, href: "https://github.com", label: "GitHub" },
                  {
                    Icon: Linkedin,
                    href: "https://linkedin.com",
                    label: "LinkedIn",
                  },
                  {
                    Icon: Twitter,
                    href: "https://twitter.com",
                    label: "Twitter",
                  },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setVariant("hover")}
                    onMouseLeave={() => setVariant("default")}
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-primary/25 text-text-secondary transition-all hover:border-gold-primary hover:text-gold-primary hover:shadow-[0_0_20px_rgba(214,178,94,0.25)]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CornerBracket({ className }: { className: string }) {
  return (
    <div
      className={`pointer-events-none absolute h-5 w-5 border-gold-primary/30 ${className}`}
    />
  );
}

function ArrowUpRightIcon() {
  return (
    <span className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-emerald-500/30 transition-all group-hover:border-emerald-500 group-hover:bg-emerald-500/20">
      <Send className="h-3.5 w-3.5 text-emerald-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </span>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  const { setVariant } = useCursor();
  return (
    <div
      onMouseEnter={() => setVariant("hover")}
      onMouseLeave={() => setVariant("default")}
      className="flex items-center gap-3 rounded-xl border border-eclipse-border bg-surface/30 px-4 py-3 backdrop-blur-sm transition-colors hover:border-gold-primary/30"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-primary/20">
        <Icon className="h-4 w-4 text-gold-primary" />
      </div>
      <div className="flex flex-col">
        {label && (
          <span className="font-mono text-[10px] uppercase tracking-wider-cinema text-text-secondary">
            {label}
          </span>
        )}
        <span className="font-cairo text-sm text-text-primary">{value}</span>
      </div>
    </div>
  );
}
