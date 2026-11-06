"use client";

import { ImagePlus, Loader2, Trash2, Check } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "@/components/Toast";
import { uploadClientImage, applyImageSlug } from "@/lib/uploadClientImage";
import { slugify } from "@/lib/brandedDownloads";

export function BrandAssetUpload({
  name,
  label,
  hint,
  initialUrl = "",
  accept = "image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon,.ico",
  preview = "logo",
  defaultSlug,
}: {
  name: string;
  label: string;
  hint: string;
  initialUrl?: string;
  accept?: string;
  preview?: "logo" | "favicon";
  defaultSlug?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [slug, setSlug] = useState(() => defaultSlug || (preview === "favicon" ? "favicon" : "brand-logo"));

  async function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const cleanSlug = slugify(slug);
      const result = await uploadClientImage(file, cleanSlug || undefined, "uploads");
      if (result.success && result.imageUrl) {
        setUrl(result.imageUrl);
        toast.success(`${label} uploaded as "${cleanSlug}".`);
      } else {
        toast.error(result.error || `Could not upload ${label.toLowerCase()}.`);
      }
    } catch {
      toast.error(`Could not upload ${label.toLowerCase()}.`);
    } finally {
      setUploading(false);
    }
  }

  async function handleApplySlug() {
    const cleanSlug = slugify(slug);
    if (!url || !cleanSlug) return;
    setUploading(true);
    try {
      const result = await applyImageSlug(url, cleanSlug, "uploads");
      if (result.success && result.imageUrl) {
        setUrl(result.imageUrl);
        toast.success(`Image name updated to "${cleanSlug}".`);
      } else {
        toast.error(result.error || "Could not update image name.");
      }
    } catch {
      toast.error("Could not update image name.");
    } finally {
      setUploading(false);
    }
  }

  const frame =
    preview === "favicon"
      ? "size-20"
      : "h-24 w-full max-w-xs";

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={url} readOnly />
      <span className="block text-sm font-bold text-[#0B1F33]">{label}</span>
      <p className="text-sm text-[#667085]">{hint}</p>

      <div className="space-y-1">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#667085]">
          Image Name (Slug)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            onBlur={() => {
              const cleaned = slugify(slug);
              setSlug(cleaned);
              if (url && cleaned) {
                void handleApplySlug();
              }
            }}
            placeholder="e.g. brand-logo"
            className="flex-1 rounded-lg border border-[#D9D0C7] bg-white px-3 py-1.5 text-xs font-medium text-[#0B1F33] placeholder:text-[#98A2B3] outline-none focus:border-[#D96B2B]"
          />
          {url ? (
            <button
              type="button"
              disabled={uploading || !slug}
              onClick={() => void handleApplySlug()}
              className="inline-flex h-8 items-center gap-1 rounded-md border border-[#D96B2B] bg-white px-2.5 text-xs font-bold text-[#D96B2B] hover:bg-[#FFF0E2] disabled:opacity-50"
            >
              {uploading ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
              Apply Name
            </button>
          ) : null}
        </div>
      </div>

      {url ? (
        <div className={`relative overflow-hidden rounded-xl border border-[#E7DDD2] bg-[#FFF9F2] ${frame}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" className="size-full object-contain p-2" />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => !uploading && inputRef.current?.click()}
          disabled={uploading}
          className={`grid place-items-center rounded-xl border-2 border-dashed border-[#D9D0C7] bg-white text-center transition-colors hover:border-[#D96B2B] hover:bg-[#FFF9F2] ${frame} ${preview === "logo" ? "px-4" : ""}`}
        >
          {uploading ? (
            <Loader2 className="size-6 animate-spin text-[#D96B2B]" />
          ) : (
            <span className="flex flex-col items-center gap-1.5 p-3">
              <ImagePlus className="size-5 text-[#D96B2B]" />
              <span className="text-xs font-bold text-[#0B1F33]">Upload {label.toLowerCase()}</span>
            </span>
          )}
        </button>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex h-10 items-center rounded-lg border border-[#E7DDD2] px-3 text-sm font-bold text-[#0B1F33] transition-colors hover:border-[#D96B2B] hover:text-[#D96B2B] disabled:opacity-60"
        >
          {url ? "Replace" : "Choose file"}
        </button>
        {url ? (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#E7DDD2] px-3 text-sm font-bold text-[#667085] transition-colors hover:border-[#D96B2B] hover:text-[#D96B2B]"
          >
            <Trash2 className="size-3.5" />
            Remove
          </button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        name={name.replace(/_url$/, "_file")}
        accept={accept}
        className="hidden"
        onChange={onFile}
      />
    </div>
  );
}
