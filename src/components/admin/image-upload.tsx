"use client";

import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import { Upload, Loader2, Image as ImageIcon, X, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { authHeaders } from "@/lib/auth";
import { useCursor } from "@/components/cursor/cursor-provider";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  placeholder?: string;
  isAr?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  label,
  placeholder = "/images/projects/desktop/p1.png",
  isAr = true,
}: ImageUploadProps) {
  const { setVariant } = useCursor();
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error(isAr ? "يرجى اختيار صورة صحيحة" : "Please select a valid image file");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload");
      }

      onChange(data.url);
      toast.success(isAr ? "تم رفع الصورة بنجاح على Cloudinary" : "Uploaded to Cloudinary successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.message || (isAr ? "فشل رفع الصورة" : "Failed to upload image")
      );
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-[10px] uppercase tracking-wider-cinema text-text-secondary">
        {label}
      </label>

      {/* Upload Zone / Preview Card */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative overflow-hidden rounded-2xl border transition-all ${
          isDragging
            ? "border-gold-primary bg-gold-primary/10 shadow-[0_0_30px_rgba(214,178,94,0.2)]"
            : "border-eclipse-border bg-bg-primary/60 hover:border-gold-primary/40"
        }`}
      >
        {value ? (
          <div className="group relative aspect-video w-full overflow-hidden bg-black/40">
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                onMouseEnter={() => setVariant("hover")}
                onMouseLeave={() => setVariant("default")}
                className="flex items-center gap-2 rounded-full border border-gold-primary/40 bg-surface/80 px-4 py-2 text-xs font-bold text-gold-primary backdrop-blur-md hover:bg-gold-primary hover:text-bg-primary"
              >
                {uploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                {isAr ? "تغيير الصورة" : "Change Image"}
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                onMouseEnter={() => setVariant("hover")}
                onMouseLeave={() => setVariant("default")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-red-500/40 bg-surface/80 text-red-400 backdrop-blur-md hover:bg-red-500 hover:text-white"
                title={isAr ? "حذف" : "Remove"}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors hover:bg-gold-primary/5"
            onMouseEnter={() => setVariant("hover")}
            onMouseLeave={() => setVariant("default")}
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-gold-primary/30 bg-surface/40 text-gold-primary">
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-gold-primary" />
              ) : (
                <Upload className="h-5 w-5" />
              )}
            </div>
            <p className="font-cairo text-sm font-bold text-text-primary">
              {uploading
                ? isAr
                  ? "جاري الرفع إلى Cloudinary..."
                  : "Uploading to Cloudinary..."
                : isAr
                ? "انقر لرفع صورة أو اسحبها هنا"
                : "Click or drag & drop to upload image"}
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase text-text-secondary">
              PNG, JPG, WEBP, GIF (Max 10MB)
            </p>
          </div>
        )}
      </div>

      {/* Manual URL Input Fallback */}
      <div className="relative flex items-center">
        <LinkIcon className="absolute left-3 h-3.5 w-3.5 text-text-secondary" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onMouseEnter={() => setVariant("text")}
          onMouseLeave={() => setVariant("default")}
          className="w-full rounded-xl border border-eclipse-border bg-bg-primary/40 pl-9 pr-4 py-2 font-mono text-xs text-text-primary placeholder:text-text-secondary/40 focus:border-gold-primary/60 focus:outline-none"
        />
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
      />
    </div>
  );
}
