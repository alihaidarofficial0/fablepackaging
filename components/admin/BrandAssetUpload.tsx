"use client";

import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "@/components/Toast";
import { uploadClientImage } from "@/lib/uploadClientImage";

export function BrandAssetUpload({
  name,
  label,
  hint,
  initialUrl = "",
  accept = "image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon,.ico",
  preview = "logo",
}: {
  name: string;
  label: string;
  hint: string;
  initialUrl?: string;
  accept?: string;
  preview?: "logo" | "favicon";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);

  async function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadClientImage(file);
      if (result.success && result.imageUrl) {
        setUrl(result.imageUrl);
        toast.success(`${label} uploaded.`);
      } else {
        toast.error(result.error || `Could not upload ${label.toLowerCase()}.`);
      }
    } catch {
      toast.error(`Could not upload ${label.toLowerCase()}.`);
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
