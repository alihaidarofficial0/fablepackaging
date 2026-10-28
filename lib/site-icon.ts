import "server-only";

import { readFile } from "fs/promises";
import path from "path";
import { getSiteSettings } from "@/lib/content";

const TYPE_BY_EXT: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".avif": "image/avif",
};

export function absoluteAssetUrl(src: string) {
  if (/^https?:\/\//i.test(src)) return src;
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return new URL(src, base).toString();
}

function contentTypeFor(src: string, fallback = "image/png") {
  const ext = path.extname(new URL(absoluteAssetUrl(src)).pathname).toLowerCase();
  return TYPE_BY_EXT[ext] || fallback;
}

async function readLocalAsset(src: string) {
  if (!src.startsWith("/uploads/") && !src.startsWith("/downloads/")) return null;
  try {
    const filePath = path.join(process.cwd(), "public", src.replace(/^\/+/, ""));
    const buffer = await readFile(filePath);
    return { buffer, type: contentTypeFor(src) };
  } catch {
    return null;
  }
}

export async function getUploadedFavicon() {
  const { favicon_url } = await getSiteSettings();
  if (!favicon_url) return null;

  const local = await readLocalAsset(favicon_url);
  if (local) return local;

  try {
    const response = await fetch(absoluteAssetUrl(favicon_url), { cache: "no-store" });
    if (!response.ok) return null;
    const buffer = Buffer.from(await response.arrayBuffer());
    const type = response.headers.get("content-type") || contentTypeFor(favicon_url);
    return { buffer, type };
  } catch {
    return null;
  }
}
