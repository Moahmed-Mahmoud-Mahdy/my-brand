"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Mail,
  Plus,
  Pencil,
  Trash2,
  LogOut,
  X,
  Check,
  Eye,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useCursor } from "@/components/cursor/cursor-provider";
import { AmbientBackground } from "@/components/effects/ambient-background";
import { toast } from "sonner";
import type { Project, Message } from "@/lib/types";
import { normalizeProject } from "@/lib/types";
import {
  getStoredToken,
  storeToken,
  clearToken,
  authHeaders,
  ADMIN_TOKEN,
} from "@/lib/auth";

export default function DashboardPage() {
  const { t, lang } = useLanguage();
  const { setVariant } = useCursor();
  const router = useRouter();
  const isAr = lang === "ar";
  const [tab, setTab] = useState<"projects" | "messages">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadProjects = () =>
    fetch("/api/projects", { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) =>
        setProjects(
          (Array.isArray(d) ? d : []).map(normalizeProject)
        )
      );

  const loadMessages = () =>
    fetch("/api/messages", { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => setMessages(Array.isArray(d) ? d : []));

  useEffect(() => {
    const token = getStoredToken();
    // Fast-path: if we have a local token, optimistically proceed and verify
    // via the API (which accepts the token header as a cookie fallback).
    fetch("/api/auth/check", {
      headers: token ? { "x-admin-token": token } : {},
    })
      .then((r) => r.json())
      .then((d) => {
        if (!d.authenticated) {
          router.push("/login");
          return;
        }
        // Ensure token is stored (e.g. if auth came via cookie only)
        storeToken();
        Promise.all([loadProjects(), loadMessages()]).finally(() =>
          setLoading(false)
        );
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  const logout = async () => {
    clearToken();
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const deleteProject = async (id: string) => {
    if (!confirm(t.admin.dashboard.confirmDelete)) return;
    await fetch(`/api/projects/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    toast.success(isAr ? "تم الحذف" : "Deleted");
    loadProjects();
  };

  const markRead = async (id: string, read: boolean) => {
    await fetch(`/api/messages/${id}`, {
      method: "PATCH",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ read }),
    });
    loadMessages();
  };

  const deleteMessage = async (id: string) => {
    await fetch(`/api/messages/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    toast.success(isAr ? "تم الحذف" : "Deleted");
    loadMessages();
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AmbientBackground />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-primary/30 bg-surface/40">
              <LayoutDashboard className="h-5 w-5 text-gold-primary" />
            </div>
            <div>
              <h1 className="font-cairo text-2xl font-bold text-text-primary">
                {t.admin.dashboard.title}
              </h1>
              <p className="font-mono text-[10px] uppercase tracking-wider-cinema text-text-secondary">
                M. Mahdy — Control Center
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/")}
              onMouseEnter={() => setVariant("hover")}
              onMouseLeave={() => setVariant("default")}
              className="flex items-center gap-2 rounded-full border border-eclipse-border px-4 py-2 font-cairo text-sm text-text-secondary transition-all hover:border-gold-primary/50 hover:text-gold-primary"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {t.admin.dashboard.viewSite}
            </button>
            <button
              onClick={logout}
              onMouseEnter={() => setVariant("hover")}
              onMouseLeave={() => setVariant("default")}
              className="flex items-center gap-2 rounded-full border border-red-500/30 px-4 py-2 font-cairo text-sm text-red-400 transition-all hover:border-red-500/60 hover:bg-red-500/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              {t.admin.dashboard.logout}
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 rounded-2xl border border-eclipse-border bg-surface/30 p-1.5 backdrop-blur-sm">
          <TabButton
            active={tab === "projects"}
            onClick={() => setTab("projects")}
            icon={FolderKanban}
            label={t.admin.dashboard.projects}
            count={projects.length}
          />
          <TabButton
            active={tab === "messages"}
            onClick={() => setTab("messages")}
            icon={Mail}
            label={t.admin.dashboard.messages}
            count={messages.length}
            badge={unreadCount}
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-primary/30 border-t-gold-primary" />
          </div>
        ) : tab === "projects" ? (
          <div>
            <div className="mb-4 flex justify-end">
              <button
                onClick={() => {
                  setEditing(null);
                  setShowForm(true);
                }}
                onMouseEnter={() => setVariant("hover")}
                onMouseLeave={() => setVariant("default")}
                className="flex items-center gap-2 rounded-full bg-gold-gradient px-5 py-2.5 font-cairo text-sm font-bold text-bg-primary transition-transform hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                {t.admin.dashboard.addProject}
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="py-20 text-center font-cairo text-text-secondary">
                {t.admin.dashboard.noProjects}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((p) => (
                  <ProjectAdminCard
                    key={p.id}
                    project={p}
                    isAr={isAr}
                    onEdit={() => {
                      setEditing(p);
                      setShowForm(true);
                    }}
                    onDelete={() => deleteProject(p.id)}
                    onHover={setVariant}
                    t={t}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {messages.length === 0 ? (
              <div className="py-20 text-center font-cairo text-text-secondary">
                {t.admin.dashboard.noMessages}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {messages.map((m) => (
                  <MessageCard
                    key={m.id}
                    message={m}
                    isAr={isAr}
                    onMarkRead={() => markRead(m.id, !m.read)}
                    onDelete={() => deleteMessage(m.id)}
                    onHover={setVariant}
                    t={t}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Project form modal */}
      {showForm && (
        <ProjectForm
          project={editing}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSaved={() => {
            setShowForm(false);
            setEditing(null);
            loadProjects();
          }}
        />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  count,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count?: number;
  badge?: number;
}) {
  const { setVariant } = useCursor();
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setVariant("hover")}
      onMouseLeave={() => setVariant("default")}
      className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-cairo text-sm font-medium transition-all ${
        active
          ? "bg-gold-primary/10 text-gold-primary"
          : "text-text-secondary hover:text-text-primary"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
      {count !== undefined && (
        <span
          className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${
            active ? "bg-gold-primary/20" : "bg-surface"
          }`}
        >
          {count}
        </span>
      )}
      {badge !== undefined && badge > 0 && (
        <span className="absolute right-3 top-2 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400/70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
        </span>
      )}
    </button>
  );
}

function ProjectAdminCard({
  project,
  isAr,
  onEdit,
  onDelete,
  onHover,
  t,
}: {
  project: Project;
  isAr: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onHover: (v: "default" | "hover") => void;
  t: ReturnType<typeof useLanguage>["t"];
}) {
  const title = isAr ? project.titleAr : project.titleEn;
  return (
    <div
      onMouseEnter={() => onHover("hover")}
      onMouseLeave={() => onHover("default")}
      className="group overflow-hidden rounded-2xl border border-eclipse-border bg-surface/40 backdrop-blur-sm transition-all hover:border-gold-primary/30"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={project.desktopScreenshot}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
        <div className="absolute bottom-2 left-2 flex gap-1.5">
          <button
            onClick={onEdit}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-primary/30 bg-bg-primary/70 text-gold-primary backdrop-blur-sm transition-all hover:bg-gold-primary hover:text-bg-primary"
            aria-label={t.admin.dashboard.editProject}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-red-500/30 bg-bg-primary/70 text-red-400 backdrop-blur-sm transition-all hover:bg-red-500 hover:text-white"
            aria-label={t.admin.dashboard.deleteProject}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="mb-1 font-cairo text-base font-bold text-text-primary">
          {title}
        </h3>
        <p className="line-clamp-2 font-cairo text-xs text-text-secondary">
          {isAr ? project.descAr : project.descEn}
        </p>
        <div className="mt-3 flex flex-wrap gap-1">
          {project.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-eclipse-border px-2 py-0.5 font-mono text-[9px] text-text-secondary"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageCard({
  message,
  isAr,
  onMarkRead,
  onDelete,
  onHover,
  t,
}: {
  message: Message;
  isAr: boolean;
  onMarkRead: () => void;
  onDelete: () => void;
  onHover: (v: "default" | "hover") => void;
  t: ReturnType<typeof useLanguage>["t"];
}) {
  const date = new Date(message.createdAt).toLocaleString(
    isAr ? "ar-EG" : "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
  return (
    <div
      onMouseEnter={() => onHover("hover")}
      onMouseLeave={() => onHover("default")}
      className={`rounded-2xl border p-5 backdrop-blur-sm transition-all ${
        message.read
          ? "border-eclipse-border bg-surface/30"
          : "border-gold-primary/30 bg-gold-primary/5"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-cairo text-base font-bold text-text-primary">
              {message.name}
            </span>
            {!message.read && (
              <span className="rounded-full bg-gold-primary/20 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-gold-primary">
                {t.admin.dashboard.unread}
              </span>
            )}
          </div>
          {message.email && (
            <a
              href={`mailto:${message.email}`}
              className="font-mono text-xs text-text-secondary hover:text-gold-primary"
            >
              {message.email}
            </a>
          )}
        </div>
        <span className="font-mono text-[10px] text-text-secondary">
          {date}
        </span>
      </div>
      <p className="mb-4 whitespace-pre-wrap font-cairo text-sm leading-relaxed text-text-secondary">
        {message.message}
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onMarkRead}
          className="flex items-center gap-1.5 rounded-full border border-eclipse-border px-3 py-1.5 font-cairo text-xs text-text-secondary transition-all hover:border-gold-primary/50 hover:text-gold-primary"
        >
          {message.read ? (
            <>
              <Eye className="h-3 w-3" /> {isAr ? "كغير مقروءة" : "Unread"}
            </>
          ) : (
            <>
              <Check className="h-3 w-3" /> {t.admin.dashboard.markRead}
            </>
          )}
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 rounded-full border border-red-500/30 px-3 py-1.5 font-cairo text-xs text-red-400 transition-all hover:border-red-500/60 hover:bg-red-500/10"
        >
          <Trash2 className="h-3 w-3" /> {t.admin.dashboard.deleteProject}
        </button>
      </div>
    </div>
  );
}

function ProjectForm({
  project,
  onClose,
  onSaved,
}: {
  project: Project | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t, lang } = useLanguage();
  const { setVariant } = useCursor();
  const isAr = lang === "ar";
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    titleAr: project?.titleAr ?? "",
    titleEn: project?.titleEn ?? "",
    descAr: project?.descAr ?? "",
    descEn: project?.descEn ?? "",
    stack: project?.stack?.join(", ") ?? "",
    githubUrl: project?.githubUrl ?? "",
    demoUrl: project?.demoUrl ?? "",
    desktopScreenshot:
      project?.desktopScreenshot ?? "/images/projects/desktop/p1.png",
    mobileScreenshot: project?.mobileScreenshot ?? "",
    order: project?.order ?? 0,
    featured: project?.featured ?? true,
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = project
        ? `/api/projects/${project.id}`
        : "/api/projects";
      const method = project ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("failed");
      toast.success(isAr ? "تم الحفظ" : "Saved");
      onSaved();
    } catch {
      toast.error(isAr ? "فشل الحفظ" : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-bg-primary/85 backdrop-blur-xl" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-gold-primary/20 bg-surface/90 p-6 backdrop-blur-2xl sm:p-8"
        onMouseEnter={() => setVariant("default")}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-cairo text-xl font-bold text-text-primary">
            {project ? t.admin.dashboard.editProject : t.admin.dashboard.addProject}
          </h2>
          <button
            onClick={onClose}
            onMouseEnter={() => setVariant("hover")}
            onMouseLeave={() => setVariant("default")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-eclipse-border text-text-secondary hover:border-gold-primary hover:text-gold-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={isAr ? "العنوان (عربي)" : "Title (Arabic)"}>
            <input
              value={form.titleAr}
              onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
              required
              onMouseEnter={() => setVariant("text")}
              onMouseLeave={() => setVariant("default")}
              className="w-full rounded-xl border border-eclipse-border bg-bg-primary/60 px-4 py-2.5 font-cairo text-text-primary focus:border-gold-primary/60 focus:outline-none"
            />
          </Field>
          <Field label={isAr ? "العنوان (إنجليزي)" : "Title (English)"}>
            <input
              value={form.titleEn}
              onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
              required
              onMouseEnter={() => setVariant("text")}
              onMouseLeave={() => setVariant("default")}
              className="w-full rounded-xl border border-eclipse-border bg-bg-primary/60 px-4 py-2.5 font-cairo text-text-primary focus:border-gold-primary/60 focus:outline-none"
            />
          </Field>
          <Field label={isAr ? "الوصف (عربي)" : "Description (Arabic)"}>
            <textarea
              value={form.descAr}
              onChange={(e) => setForm({ ...form, descAr: e.target.value })}
              required
              rows={3}
              onMouseEnter={() => setVariant("text")}
              onMouseLeave={() => setVariant("default")}
              className="w-full resize-none rounded-xl border border-eclipse-border bg-bg-primary/60 px-4 py-2.5 font-cairo text-text-primary focus:border-gold-primary/60 focus:outline-none"
            />
          </Field>
          <Field label={isAr ? "الوصف (إنجليزي)" : "Description (English)"}>
            <textarea
              value={form.descEn}
              onChange={(e) => setForm({ ...form, descEn: e.target.value })}
              required
              rows={3}
              onMouseEnter={() => setVariant("text")}
              onMouseLeave={() => setVariant("default")}
              className="w-full resize-none rounded-xl border border-eclipse-border bg-bg-primary/60 px-4 py-2.5 font-cairo text-text-primary focus:border-gold-primary/60 focus:outline-none"
            />
          </Field>
          <Field label={isAr ? "التقنيات (مفصولة بفاصلة)" : "Tech Stack (comma separated)"}>
            <input
              value={form.stack}
              onChange={(e) => setForm({ ...form, stack: e.target.value })}
              required
              placeholder="Next.js,React,TypeScript"
              onMouseEnter={() => setVariant("text")}
              onMouseLeave={() => setVariant("default")}
              className="w-full rounded-xl border border-eclipse-border bg-bg-primary/60 px-4 py-2.5 font-mono text-sm text-text-primary focus:border-gold-primary/60 focus:outline-none"
            />
          </Field>
          <Field label={isAr ? "صورة سطح المكتب" : "Desktop Screenshot path"}>
            <input
              value={form.desktopScreenshot}
              onChange={(e) => setForm({ ...form, desktopScreenshot: e.target.value })}
              required
              onMouseEnter={() => setVariant("text")}
              onMouseLeave={() => setVariant("default")}
              className="w-full rounded-xl border border-eclipse-border bg-bg-primary/60 px-4 py-2.5 font-mono text-sm text-text-primary focus:border-gold-primary/60 focus:outline-none"
            />
          </Field>
          <Field label={isAr ? "صورة الجوال" : "Mobile Screenshot path"}>
            <input
              value={form.mobileScreenshot}
              onChange={(e) => setForm({ ...form, mobileScreenshot: e.target.value })}
              placeholder="(optional)"
              onMouseEnter={() => setVariant("text")}
              onMouseLeave={() => setVariant("default")}
              className="w-full rounded-xl border border-eclipse-border bg-bg-primary/60 px-4 py-2.5 font-mono text-sm text-text-primary focus:border-gold-primary/60 focus:outline-none"
            />
          </Field>
          <Field label="Live Demo URL">
            <input
              value={form.demoUrl}
              onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
              placeholder="(optional)"
              onMouseEnter={() => setVariant("text")}
              onMouseLeave={() => setVariant("default")}
              className="w-full rounded-xl border border-eclipse-border bg-bg-primary/60 px-4 py-2.5 font-mono text-sm text-text-primary focus:border-gold-primary/60 focus:outline-none"
            />
          </Field>
          <Field label="GitHub URL">
            <input
              value={form.githubUrl}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
              onMouseEnter={() => setVariant("text")}
              onMouseLeave={() => setVariant("default")}
              className="w-full rounded-xl border border-eclipse-border bg-bg-primary/60 px-4 py-2.5 font-mono text-sm text-text-primary focus:border-gold-primary/60 focus:outline-none"
            />
          </Field>
          <Field label={isAr ? "الترتيب" : "Order"}>
            <input
              type="number"
              value={form.order}
              onChange={(e) =>
                setForm({ ...form, order: Number(e.target.value) })
              }
              onMouseEnter={() => setVariant("text")}
              onMouseLeave={() => setVariant("default")}
              className="w-full rounded-xl border border-eclipse-border bg-bg-primary/60 px-4 py-2.5 font-mono text-sm text-text-primary focus:border-gold-primary/60 focus:outline-none"
            />
          </Field>
          <Field label={isAr ? "مميز" : "Featured"}>
            <label className="flex h-[42px] items-center gap-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm({ ...form, featured: e.target.checked })
                }
                className="h-4 w-4 accent-gold-primary"
              />
              <span className="font-cairo text-sm text-text-secondary">
                {form.featured ? "✓" : "✗"}
              </span>
            </label>
          </Field>

          <div className="col-span-1 flex justify-end gap-3 sm:col-span-2">
            <button
              type="button"
              onClick={onClose}
              onMouseEnter={() => setVariant("hover")}
              onMouseLeave={() => setVariant("default")}
              className="rounded-full border border-eclipse-border px-6 py-2.5 font-cairo text-sm text-text-secondary hover:text-text-primary"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              disabled={saving}
              onMouseEnter={() => setVariant("hover")}
              onMouseLeave={() => setVariant("default")}
              className="rounded-full bg-gold-gradient px-6 py-2.5 font-cairo text-sm font-bold text-bg-primary disabled:opacity-70"
            >
              {saving ? "..." : t.common.save}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[10px] uppercase tracking-wider-cinema text-text-secondary">
        {label}
      </label>
      {children}
    </div>
  );
}
