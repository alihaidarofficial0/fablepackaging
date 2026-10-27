const MAX_LENGTH = 20_000;

const ALLOWED_HOSTS = [
  "googletagmanager.com",
  "google-analytics.com",
  "google.com",
  "gstatic.com",
  "googleadservices.com",
  "doubleclick.net",
  "facebook.net",
  "facebook.com",
  "hotjar.com",
  "clarity.ms",
  "cloudflareinsights.com",
];

function hostAllowed(value: string) {
  try {
    const url = new URL(value, "https://www.fablepack.co");
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    return ALLOWED_HOSTS.some(
      (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
    );
  } catch {
    return false;
  }
}

export function sanitizeSiteScripts(raw: string) {
  if (!raw.trim()) return "";

  let html = raw.slice(0, MAX_LENGTH);
  html = html.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  html = html.replace(/javascript:/gi, "");

  html = html.replace(
    /\s(src|href)\s*=\s*("([^"]*)"|'([^']*)')/gi,
    (match, _attr, _quoted, doubleValue, singleValue) => {
      const value = doubleValue ?? singleValue ?? "";
      return hostAllowed(value) ? match : "";
    },
  );

  return html.trim();
}
