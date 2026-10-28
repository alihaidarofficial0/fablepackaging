"use client";

import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { SocialIcon } from "@/components/SocialLinks";
import { SOCIAL_PLATFORMS, type SocialLink, type SocialPlatformId } from "@/lib/social";

const inputClass =
  "h-11 w-full rounded-lg border border-[#E7DDD2] bg-white px-3.5 text-sm text-[#0B1F33] outline-none transition-colors placeholder:text-[#98A2B3] focus:border-[#D96B2B] focus:ring-2 focus:ring-[#D96B2B]/10";

type Row = SocialLink & { key: string };

function nextPlatform(used: string[]): SocialPlatformId {
  return SOCIAL_PLATFORMS.find((item) => !used.includes(item.id))?.id || "facebook";
}

export function SocialLinksEditor({ initial }: { initial: SocialLink[] }) {
  const [rows, setRows] = useState<Row[]>(() => {
    const source: SocialLink[] = initial.length
      ? initial
      : [
          { platform: "facebook", url: "" },
          { platform: "instagram", url: "" },
          { platform: "linkedin", url: "" },
          { platform: "youtube", url: "" },
        ];
    return source.map((item, index) => ({ ...item, key: `${item.platform}-${index}` }));
  });

  const used = useMemo(() => rows.map((row) => row.platform), [rows]);
  const canAdd = rows.length < SOCIAL_PLATFORMS.length;

  function update(key: string, patch: Partial<SocialLink>) {
    setRows((current) => current.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <div key={row.key} className="grid gap-3 sm:grid-cols-[auto_180px_1fr_auto] sm:items-center">
          <div className="hidden size-11 place-items-center rounded-full border border-[#E7DDD2] bg-[#FFF9F2] text-[#0B1F33] sm:grid">
            <SocialIcon platform={row.platform} />
          </div>
          <label className="block text-sm font-bold text-[#0B1F33] sm:contents">
            <span className="sm:hidden">Network</span>
            <select
              name="social_platform"
              value={row.platform}
              onChange={(event) => update(row.key, { platform: event.target.value as SocialPlatformId })}
              className={inputClass}
            >
              {SOCIAL_PLATFORMS.map((platform) => (
                <option
                  key={platform.id}
                  value={platform.id}
                  disabled={used.includes(platform.id) && platform.id !== row.platform}
                >
                  {platform.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-bold text-[#0B1F33] sm:contents">
            <span className="sm:hidden">Profile URL</span>
            <input
              name="social_url"
              value={row.url}
              onChange={(event) => update(row.key, { url: event.target.value })}
              placeholder="https://"
              inputMode="url"
              className={inputClass}
            />
          </label>
          <button
            type="button"
            onClick={() => setRows((current) => current.filter((item) => item.key !== row.key))}
            aria-label={`Remove ${row.platform}`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#E7DDD2] text-[#667085] transition-colors hover:border-[#D96B2B] hover:text-[#D96B2B]"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}

      {canAdd ? (
        <button
          type="button"
          onClick={() =>
            setRows((current) => [
              ...current,
              { key: crypto.randomUUID(), platform: nextPlatform(current.map((row) => row.platform)), url: "" },
            ])
          }
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-dashed border-[#D9D0C7] px-4 text-sm font-bold text-[#0B1F33] transition-colors hover:border-[#D96B2B] hover:text-[#D96B2B]"
        >
          <Plus className="size-4" />
          Add social profile
        </button>
      ) : null}

      {!rows.length ? (
        <p className="text-sm text-[#667085]">No social profiles yet. Add one to show its icon on the website.</p>
      ) : null}
    </div>
  );
}
