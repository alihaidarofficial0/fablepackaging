const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1200";

function normalizeImageUrl(raw: string): string {
  const trimmed = (raw || "").trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("blob:")) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (trimmed.startsWith("/")) return trimmed;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `/${trimmed.replace(/^\/+/, "")}`;
}

export function resolveBlogImage(
  image?: string | null,
  coverImage?: string | null,
  prefer: "thumbnail" | "cover" = "cover"
): string {
  const thumb = normalizeImageUrl(image || "");
  const cover = normalizeImageUrl(coverImage || "");
  const raw = prefer === "thumbnail" ? thumb || cover : cover || thumb;
  return raw || FALLBACK_IMAGE;
}

export function resolveBlogThumbnail(
  image?: string | null,
  coverImage?: string | null
): string {
  return resolveBlogImage(image, coverImage, "thumbnail");
}

export function resolveBlogCover(
  image?: string | null,
  coverImage?: string | null
): string {
  return resolveBlogImage(image, coverImage, "cover");
}

export { FALLBACK_IMAGE };
