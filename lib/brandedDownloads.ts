export function slugify(str: string): string {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function rewriteDownloadUrl(url: string): string {
  if (!url) return "";
  return url;
}

export function rewriteDownloadUrlsInHtml(html: string): string {
  return html;
}
