export const SOCIAL_PLATFORMS = [
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "youtube", label: "YouTube" },
  { id: "x", label: "X (Twitter)" },
  { id: "tiktok", label: "TikTok" },
  { id: "pinterest", label: "Pinterest" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "threads", label: "Threads" },
  { id: "telegram", label: "Telegram" },
] as const;

export type SocialPlatformId = (typeof SOCIAL_PLATFORMS)[number]["id"];

export type SocialLink = {
  platform: SocialPlatformId;
  url: string;
};

const PLATFORM_IDS = new Set<string>(SOCIAL_PLATFORMS.map((item) => item.id));
const LEGACY_FIELDS = ["facebook", "instagram", "linkedin", "youtube"] as const;

export function isSocialPlatform(value: string): value is SocialPlatformId {
  return PLATFORM_IDS.has(value);
}

export function socialPlatformLabel(id: string) {
  return SOCIAL_PLATFORMS.find((item) => item.id === id)?.label || id;
}

export function sanitizeSocialUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";
    return parsed.toString().slice(0, 1000);
  } catch {
    return "";
  }
}

function asLink(platform: string, url: string): SocialLink | null {
  if (!isSocialPlatform(platform)) return null;
  const safeUrl = sanitizeSocialUrl(url);
  if (!safeUrl) return null;
  return { platform, url: safeUrl };
}

export function normalizeSocialLinks(
  links: unknown,
  legacy: Partial<Record<(typeof LEGACY_FIELDS)[number], string>> = {},
): SocialLink[] {
  const fromList = Array.isArray(links)
    ? links
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const row = item as { platform?: unknown; url?: unknown };
          return asLink(String(row.platform || ""), String(row.url || ""));
        })
        .filter((item): item is SocialLink => Boolean(item))
    : [];

  if (fromList.length) {
    const seen = new Set<string>();
    return fromList.filter((item) => {
      if (seen.has(item.platform)) return false;
      seen.add(item.platform);
      return true;
    }).slice(0, SOCIAL_PLATFORMS.length);
  }

  return LEGACY_FIELDS.map((platform) => asLink(platform, legacy[platform] || "")).filter(
    (item): item is SocialLink => Boolean(item),
  );
}

export function legacySocialFromLinks(links: SocialLink[]) {
  const urlFor = (platform: SocialPlatformId) => links.find((item) => item.platform === platform)?.url || "";
  return {
    facebook: urlFor("facebook"),
    instagram: urlFor("instagram"),
    linkedin: urlFor("linkedin"),
    youtube: urlFor("youtube"),
  };
}
