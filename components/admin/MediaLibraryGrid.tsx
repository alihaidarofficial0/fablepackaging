"use client";

import Image from "next/image";
import { Copy, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { deleteSiteMedia } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";

export type MediaFile = { name: string; path: string; url: string; size?: number; createdAt?: string };

function formatBytes(size?: number) {
  if (!size) return "Unknown size";
  return size < 1024 * 1024 ? `${Math.ceil(size / 1024)} KB` : `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibraryGrid({ files }: { files: MediaFile[] }) {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState("");
  const filtered = useMemo(() => files.filter((file) => file.name.toLowerCase().includes(query.trim().toLowerCase())), [files, query]);
  async function copyUrl(file: MediaFile) {
    await navigator.clipboard.writeText(file.url);
    setCopied(file.path);
    window.setTimeout(() => setCopied(""), 1800);
  }
  return <><label className="mt-6 flex h-11 max-w-sm items-center gap-2 rounded-lg border border-[#E7DDD2] bg-white px-3 text-[#667085] focus-within:border-[#D96B2B]"><Search className="size-4" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Search media" /></label><div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{filtered.map((file) => <article key={file.path} className="overflow-hidden rounded-xl border border-[#E7DDD2] bg-white"><div className="relative aspect-[4/3] bg-[#F3E8DA]"><Image src={file.url} alt="" fill unoptimized sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 100vw" className="object-cover" /></div><div className="p-3"><p className="truncate text-sm font-bold text-[#0B1F33]">{file.name}</p><p className="mt-1 text-xs text-[#98A2B3]">{formatBytes(file.size)}{file.createdAt ? ` · ${new Date(file.createdAt).toLocaleDateString()}` : ""}</p><div className="mt-3 flex gap-2"><button type="button" onClick={() => copyUrl(file)} className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#E7DDD2] text-xs font-bold text-[#0B1F33] transition-colors hover:border-[#D96B2B] hover:text-[#D96B2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B]"><Copy className="size-3.5" />{copied === file.path ? "Copied" : "Copy URL"}</button><form action={deleteSiteMedia}><input type="hidden" name="path" value={file.path} /><DeleteButton compact /></form></div></div></article>)}{!filtered.length && <p className="col-span-full rounded-xl border border-dashed border-[#E7DDD2] px-5 py-10 text-center text-sm text-[#667085]">No media files match this search.</p>}</div></>;
}
