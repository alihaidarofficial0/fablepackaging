"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Link2, Upload, Check } from "lucide-react";
import { slugify } from "@/lib/brandedDownloads";

type Props = {
  /** Input name for HTML/Server Action form (e.g. "image" or "avatar") */
  name?: string;
  label: string;
  value?: string;
  defaultValue?: string;
  onChange?: (url: string) => void;
  recommended?: string;
  hint?: string;
  folder?: string;
  accept?: string;
  className?: string;
  /** Prefill image filename (e.g. product/category slug) */
  defaultSlug?: string;
  /** Show the image name field (default true) */
  showSlugField?: boolean;
};

function mediaBasename(url: string): string {
  if (!url) return "";
  const base = url.split("?")[0].split("/").pop() || "";
  return slugify(base.replace(/\.[a-z0-9]{2,5}$/i, ""));
}

function mediaExtension(url: string): string {
  if (!url) return "webp";
  const base = url.split("?")[0].split("/").pop() || "";
  const match = base.match(/\.([a-z0-9]{2,5})$/i);
  return match?.[1]?.toLowerCase() || "webp";
}

export function ImageUploadField({
  name: inputName,
  label,
  value: controlledValue,
  defaultValue = "",
  onChange,
  recommended,
  hint = "Max 10MB · JPG, PNG, WEBP, SVG",
  folder = "uploads",
  accept = "image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif",
  className,
  defaultSlug = "",
  showSlugField = true,
}: Props) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentUrl = isControlled ? controlledValue : internalValue;

  const updateUrl = (newUrl: string) => {
    if (!isControlled) {
      setInternalValue(newUrl);
    }
    onChange?.(newUrl);
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showUrl, setShowUrl] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imageSlug, setImageSlug] = useState(() =>
    slugify(defaultSlug || mediaBasename(currentUrl) || "")
  );
  const [slugTouched, setSlugTouched] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setImgError(false);
  }, [currentUrl]);

  useEffect(() => {
    if (slugTouched) return;
    const next = slugify(defaultSlug || mediaBasename(currentUrl) || "");
    if (next) setImageSlug(next);
  }, [defaultSlug, currentUrl, slugTouched]);

  const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
  const cleanSlug = slugify(imageSlug.replace(/\.[a-z0-9]{2,5}$/i, ""));
  const currentBase = mediaBasename(currentUrl);
  const currentExt = mediaExtension(currentUrl);

  const targetPath = cleanSlug
    ? `/${cleanFolder}/${cleanSlug}.${currentExt}`
    : `/${cleanFolder}/[image-name].${currentExt}`;

  const alreadyNamed =
    Boolean(currentUrl) && Boolean(cleanSlug) && currentBase === cleanSlug;

  async function applyImageName(nextSlug = cleanSlug) {
    const slugToUse = slugify(nextSlug.replace(/\.[a-z0-9]{2,5}$/i, ""));
    if (!currentUrl || !slugToUse) {
      setError("Set an image name first.");
      return false;
    }

    setError("");
    setStatus("");
    setUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: currentUrl,
          slug: slugToUse,
          folder: cleanFolder,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || "Could not set image name");
        return false;
      }
      updateUrl(data.url);
      setStatus("Image name updated with exact slug.");
      return true;
    } catch {
      setError("Could not set image name. Please try again.");
      return false;
    } finally {
      setUploading(false);
    }
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError("");
    setStatus("");
    setUploading(true);

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", cleanFolder);
      if (cleanSlug) {
        body.append("slug", cleanSlug);
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (!res.ok || (!data.url && !data.imageUrl)) {
        setError(data.error || "Upload failed");
        return;
      }
      const uploadedUrl = data.imageUrl || data.url;
      updateUrl(uploadedUrl);
      setShowUrl(false);
      setStatus(
        cleanSlug
          ? `Uploaded with exact name: ${cleanSlug}`
          : "Uploaded — set an image name and click Apply."
      );
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={`space-y-2.5 ${className || ""}`}>
      {/* Hidden input to pass value in form submission */}
      {inputName ? (
        <input type="hidden" name={inputName} value={currentUrl} />
      ) : null}

      <div className="flex min-h-[38px] flex-wrap items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-[#0B1F33]">
            {label}
          </p>
          {(recommended || hint) && (
            <p className="mt-0.5 text-xs text-[#667085]">
              {recommended && (
                <span className="font-semibold text-[#0B1F33]">
                  {recommended} ·{" "}
                </span>
              )}
              {hint}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowUrl((v) => !v)}
          className="inline-flex cursor-pointer items-center gap-1 text-xs font-bold text-[#D96B2B] hover:text-[#BC5420]"
        >
          <Link2 className="size-3.5" />
          {showUrl ? "Hide URL" : "Paste URL"}
        </button>
      </div>

      {showSlugField ? (
        <div className="rounded-lg border border-[#E7DDD2] bg-[#FFFDF9] p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B1F33]">
              Image Name (Slug)
            </span>
            <span className="text-[11px] text-[#667085]">
              Exact name used for the file
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={imageSlug}
              onChange={(e) => {
                setSlugTouched(true);
                setImageSlug(e.target.value);
                setStatus("");
              }}
              onBlur={() => {
                const cleaned = slugify(imageSlug.replace(/\.[a-z0-9]{2,5}$/i, ""));
                setImageSlug(cleaned);
                if (currentUrl && cleaned && !alreadyNamed) {
                  void applyImageName(cleaned);
                }
              }}
              placeholder="e.g. kraft-mailer-boxes"
              className="flex-1 rounded-md border border-[#D9D0C7] bg-white px-3 py-1.5 text-sm font-medium text-[#0B1F33] placeholder:text-[#98A2B3] outline-none focus:border-[#D96B2B] focus:ring-2 focus:ring-[#D96B2B]/10"
            />
            <button
              type="button"
              disabled={uploading || !currentUrl || !cleanSlug}
              onClick={() => void applyImageName()}
              className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-[#D96B2B] bg-white px-3 text-xs font-bold text-[#D96B2B] hover:bg-[#FFF0E2] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : alreadyNamed ? (
                <Check className="size-3.5" />
              ) : null}
              {uploading
                ? "Working…"
                : alreadyNamed
                ? "Name Applied"
                : "Apply Name"}
            </button>
          </div>

          <div className="text-[11px] space-y-0.5">
            <p className="break-all font-mono text-[#D96B2B]">
              Saves as: {targetPath}
            </p>
            {currentUrl ? (
              <p className="break-all font-mono text-[#667085]">
                Current: {currentUrl}
              </p>
            ) : null}
          </div>

          {status ? (
            <p className="text-[11px] font-semibold text-emerald-700">
              {status}
            </p>
          ) : null}
        </div>
      ) : null}

      <div
        onDragEnter={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void onFile(e.dataTransfer.files?.[0]);
        }}
        className={`grid min-h-[120px] cursor-pointer gap-3 rounded-xl border-2 border-dashed p-3 transition-colors sm:grid-cols-[120px_1fr] ${
          dragging
            ? "border-[#D96B2B] bg-[#FFF0E2]"
            : "border-[#D9D0C7] bg-[#FFFDF9] hover:bg-[#FFF9F2]"
        }`}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        <div className="relative h-[100px] w-full overflow-hidden rounded-lg border border-[#E7DDD2] bg-white sm:w-[120px]">
          {currentUrl && !imgError ? (
            <Image
              src={currentUrl}
              alt="Preview"
              fill
              draggable={false}
              className="pointer-events-none object-cover"
              sizes="120px"
              unoptimized
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1 text-[#98A2B3]">
              <ImagePlus className="size-6 text-[#D96B2B]" />
              <span className="text-[10px] font-semibold">
                {imgError ? "Preview error" : "Preview"}
              </span>
            </div>
          )}
        </div>

        <div
          className="flex min-w-0 flex-col justify-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />

          <p className="text-xs text-[#667085]">
            {dragging
              ? "Drop image to upload"
              : "Drag & drop an image here, or choose a file"}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-[#D96B2B] px-3.5 text-xs font-bold text-white transition-colors hover:bg-[#BC5420] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Upload className="size-3.5" />
              )}
              {uploading ? "Uploading…" : "Choose file"}
            </button>

            {currentUrl ? (
              <button
                type="button"
                onClick={() => updateUrl("")}
                className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-[#E7DDD2] bg-white px-3 text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
              >
                <Trash2 className="size-3.5" />
                Remove
              </button>
            ) : null}
          </div>

          {showUrl ? (
            <div className="pt-1">
              <input
                type="text"
                value={currentUrl}
                onChange={(e) => updateUrl(e.target.value)}
                placeholder="https://... or /uploads/..."
                className="w-full rounded-md border border-[#D9D0C7] bg-white px-3 py-1.5 text-xs font-medium text-[#0B1F33] placeholder:text-[#98A2B3] outline-none focus:border-[#D96B2B]"
              />
            </div>
          ) : null}

          {error ? (
            <p className="text-xs font-medium text-red-600">{error}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

