import Link from "next/link";

function DefaultWordmark({ inverse = false }: { inverse?: boolean }) {
  const ink = inverse ? "#ffffff" : "#0B1F33";
  const muted = inverse ? "rgba(255,255,255,0.5)" : "#8A96A3";

  return (
    <svg viewBox="0 0 228 56" className="h-12 w-auto" aria-hidden="true">
      <g transform="translate(28 28) rotate(45)">
        <rect x="-19" y="-19" width="38" height="38" rx="3.5" fill="none" stroke="#C99A4A" strokeWidth="1.8" />
        <g transform="rotate(-45) translate(-11 -11)" fill="none" stroke={ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19.25 7.33A1.83 1.83 0 0 0 18.33 5.74l-6.42-3.67a1.83 1.83 0 0 0-1.83 0L3.67 5.74A1.83 1.83 0 0 0 2.75 7.33v7.33a1.83 1.83 0 0 0 .92 1.59l6.42 3.67a1.83 1.83 0 0 0 1.83 0l6.42-3.67a1.83 1.83 0 0 0 .92-1.59Z" />
          <path d="m3.03 6.42 7.97 4.58 7.97-4.58" />
          <path d="M11 20.17V11" />
        </g>
      </g>
      <text x="62" y="30" fill={ink} fontFamily="Fraunces, Georgia, serif" fontSize="26" fontWeight="600" letterSpacing="-0.4">
        Fable
      </text>
      <text x="62" y="44" fill={muted} fontFamily="Inter, system-ui, sans-serif" fontSize="8" fontWeight="600" letterSpacing="2.2">
        PACKAGING CO.
      </text>
    </svg>
  );
}

export function Logo({
  inverse = false,
  logoUrl = "",
}: {
  inverse?: boolean;
  logoUrl?: string;
}) {
  return (
    <Link
      href="/"
      className="inline-flex items-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B] focus-visible:ring-offset-4"
      aria-label="Fable Packaging Co. home"
    >
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt="Fable Packaging Co."
          className="h-11 w-auto max-w-[220px] object-contain object-left sm:h-12"
        />
      ) : (
        <DefaultWordmark inverse={inverse} />
      )}
    </Link>
  );
}
