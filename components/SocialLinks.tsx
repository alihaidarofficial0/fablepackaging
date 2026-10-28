import type { ReactNode } from "react";
import type { SocialLink, SocialPlatformId } from "@/lib/social";
import { socialPlatformLabel } from "@/lib/social";

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-[18px]">
      {children}
    </svg>
  );
}

export function SocialIcon({ platform }: { platform: string }) {
  switch (platform as SocialPlatformId) {
    case "facebook":
      return (
        <Icon>
          <path d="M14 8.5h3.2V4.8H14c-2.7 0-4.5 1.7-4.5 4.6V12H6.8v3.6h2.7V24h4V15.6h3.3L17.4 12h-3.4V9.7c0-.8.3-1.2 1-1.2Z" />
        </Icon>
      );
    case "instagram":
      return (
        <Icon>
          <path d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm8 1.7H8A3.3 3.3 0 0 0 4.7 8v8A3.3 3.3 0 0 0 8 19.3h8A3.3 3.3 0 0 0 19.3 16V8A3.3 3.3 0 0 0 16 4.7Zm-4 3.1A4.2 4.2 0 1 1 7.8 12 4.2 4.2 0 0 1 12 7.8Zm0 1.7A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5Zm5.1-3.4a1.05 1.05 0 1 1-1.05 1.05A1.05 1.05 0 0 1 17.1 6.1Z" />
        </Icon>
      );
    case "linkedin":
      return (
        <Icon>
          <path d="M6.5 9.2H3.4V20.6h3.1V9.2ZM5 3.4A1.8 1.8 0 1 0 5 7a1.8 1.8 0 0 0 0-3.6ZM20.6 20.6h-3.1v-6.1c0-1.8-.7-2.4-1.8-2.4s-2.1.9-2.1 2.5v6H10.5V9.2h3v1.5c.6-1.1 1.9-1.8 3.4-1.8 2.6 0 3.7 1.6 3.7 4.8v6.9Z" />
        </Icon>
      );
    case "youtube":
      return (
        <Icon>
          <path d="M22.5 7.6a2.8 2.8 0 0 0-2-2C18.7 5.2 12 5.2 12 5.2s-6.7 0-8.5.4a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1.1 12a29 29 0 0 0 .4 4.4 2.8 2.8 0 0 0 2 2c1.8.4 8.5.4 8.5.4s6.7 0 8.5-.4a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .4-4.4 29 29 0 0 0-.4-4.4ZM10 15.2V8.8l5.6 3.2L10 15.2Z" />
        </Icon>
      );
    case "x":
      return (
        <Icon>
          <path d="M17.6 3.4h2.8l-6.1 7 7.2 9.6h-5.6l-4.4-5.8-5 5.8H3.7l6.5-7.5-6.9-9.1h5.8l4 5.3 4.5-5.3Zm-1 15.1h1.5L7.5 4.9H5.8l10.8 13.6Z" />
        </Icon>
      );
    case "tiktok":
      return (
        <Icon>
          <path d="M14.2 3h3a6.4 6.4 0 0 0 4.3 4v3.1A9.3 9.3 0 0 1 16 8.4v7.2a6.4 6.4 0 1 1-6.4-6.4c.3 0 .6 0 .9.1v3.2a3.3 3.3 0 1 0 2.5 3.2V3Z" />
        </Icon>
      );
    case "pinterest":
      return (
        <Icon>
          <path d="M12 2.2A9.8 9.8 0 0 0 8.4 21c0-.7.1-1.7.4-2.5l1.4-5.8s-.3-.7-.3-1.7c0-1.6.9-2.8 2.1-2.8 1 0 1.5.7 1.5 1.6 0 1-.6 2.4-.9 3.8-.3 1.1.5 2 1.6 2 2 0 3.3-2.5 3.3-5.5 0-2.3-1.5-4-4.3-4-3.1 0-5 2.3-5 4.9 0 .9.3 1.5.7 2l.2.2c.1.1.1.2 0 .3l-.2.9c-.1.3-.2.4-.5.2-1.4-.6-2-2.2-2-4 0-3 2.5-6.7 7.4-6.7 3.9 0 6.5 2.8 6.5 5.9 0 4-2.2 7-5.6 7-1.1 0-2.2-.6-2.5-1.3l-.7 2.6c-.2.9-.8 2-1.2 2.7A9.8 9.8 0 1 0 12 2.2Z" />
        </Icon>
      );
    case "whatsapp":
      return (
        <Icon>
          <path d="M12 2.2A9.8 9.8 0 0 0 4.1 17.3L3 21.8l4.6-1.2A9.8 9.8 0 1 0 12 2.2Zm5.7 13.8c-.2.7-1.3 1.2-1.8 1.3-.5.1-1 .2-1.7-.1-.4-.2-.9-.3-1.6-.7-2.8-1.4-4.6-4.5-4.8-4.7s-1.5-2-1.5-3.8.9-2.7 1.3-3.1c.3-.3.7-.4 1-.4h.8c.2 0 .5 0 .8.6s1 2.4 1.1 2.6.2.4 0 .7l-.5.6c-.2.2-.4.4-.2.8s.7 1.2 1.5 2 1.6 1.2 2 .1.9-1.1 1.2-1.4.5-.2.8-.1 2.1 1 2.4 1.2.6.3.7.5c.1.3.1 1.2-.2 1.9Z" />
        </Icon>
      );
    case "threads":
      return (
        <Icon>
          <path d="M16.6 11.3c.1-.4.1-.8.1-1.2 0-2.6-1.6-4.1-4.2-4.1-2.9 0-4.8 2.2-4.8 5.9 0 3.2 1.5 5.4 4.1 5.4 1.8 0 3.2-.8 4-2.3l-1.5-.8c-.5 1-1.3 1.4-2.5 1.4-1.5 0-2.4-1.3-2.4-3.3 0-.2 0-.4.1-.6 2.6.5 5.2.6 6.7.3Zm-6.4-.7c.3-1.8 1.3-2.8 2.3-2.8.8 0 1.4.5 1.4 1.6 0 .3 0 .6-.1.9-1.3.2-2.7.2-3.6.3Z" />
          <path d="M12.1 2.2c5.4 0 8.7 3.7 8.7 9.6 0 2.2-.6 4.2-1.8 5.6-1.3 1.6-3.3 2.5-5.7 2.5-1.8 0-3.4-.5-4.7-1.4l-1.1 3.3h-2.1l3-8.8c-.2-.8-.3-1.6-.3-2.4 0-2.6 1-4.6 2.8-5.8 1.5-1 3.3-1.6 5.2-1.6Zm0 1.8c-3.7 0-6.1 2.5-6.1 6.6 0 .7.1 1.4.3 2.1l.3.9-1.5 4.4.7.4c1.2.8 2.6 1.2 4.1 1.2 4.1 0 6.8-2.8 6.8-7.4 0-4.8-2.6-8.2-7-8.2Z" />
        </Icon>
      );
    case "telegram":
      return (
        <Icon>
          <path d="M21.5 4.4 18.7 20c-.2.9-.8 1.1-1.6.7l-4.5-3.3-2.2 2.1c-.2.2-.5.5-1 .5l.3-4.8 8.7-7.9c.4-.3-.1-.5-.6-.2l-10.8 6.8-4.6-1.4c-1-.3-1-.9.2-1.4L20 3.3c.8-.3 1.5.2 1.5 1.1Z" />
        </Icon>
      );
    default:
      return (
        <Icon>
          <path d="M12 2.5A9.5 9.5 0 1 0 21.5 12 9.5 9.5 0 0 0 12 2.5Zm0 3.2a6.2 6.2 0 0 1 5.9 4.3H14A8.6 8.6 0 0 0 12 5.7Zm-1.7 0A8.6 8.6 0 0 0 10 10H6.1A6.2 6.2 0 0 1 10.3 5.7ZM5.7 12c0-.3 0-.7.1-1H10v2H5.8c-.1-.3-.1-.6-.1-1Zm.4 3H10a8.6 8.6 0 0 0 .3 4.3A6.2 6.2 0 0 1 6.1 15ZM12 18.3A8.6 8.6 0 0 1 14 14h3.9A6.2 6.2 0 0 1 12 18.3ZM14 13h4.2c.1-.3.1-.6.1-1s0-.7-.1-1H14v2Zm0-5h3.9A8.6 8.6 0 0 0 14 10h-3.9A8.6 8.6 0 0 1 14 8Zm-4 5h4v2h-4v-2Z" />
        </Icon>
      );
  }
}

export function SocialLinks({
  links,
  variant = "dark",
  size = "md",
  wrap = true,
}: {
  links: SocialLink[];
  variant?: "dark" | "light";
  size?: "sm" | "md";
  wrap?: boolean;
}) {
  if (!links.length) return null;

  const box = size === "sm" ? "size-8" : "size-10";
  const tone =
    variant === "dark"
      ? "border-white/15 bg-white/5 text-white/75 hover:border-white/30 hover:bg-white/10 hover:text-white"
      : "border-[#E7DDD2] bg-white text-[#0B1F33]/75 hover:border-[#D96B2B] hover:text-[#D96B2B]";

  return (
    <div className={`flex gap-2 ${wrap ? "flex-wrap" : "flex-nowrap"}`}>
      {links.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noreferrer"
          aria-label={socialPlatformLabel(link.platform)}
          className={`grid ${box} place-items-center rounded-full border transition-colors ${tone}`}
        >
          <SocialIcon platform={link.platform} />
        </a>
      ))}
    </div>
  );
}
