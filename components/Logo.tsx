import Image from "next/image";
import Link from "next/link";

export function Logo({
  inverse = false,
  brandName = "Fable",
  descriptor = "Journal & Essays",
  logoUrl = "",
}: {
  inverse?: boolean;
  brandName?: string;
  descriptor?: string;
  logoUrl?: string;
}) {
  return (
    <Link
      href="/"
      className="inline-flex min-h-11 items-center gap-3 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[#D96B2B] focus-visible:ring-offset-4"
      aria-label="Fable home"
    >
      {logoUrl ? (
        <span className="relative size-10 overflow-hidden rounded-lg">
          <Image src={logoUrl} alt="" fill sizes="40px" className="object-contain" />
        </span>
      ) : (
        /* Diamond-framed box icon — matches reference */
        <span
          className={`relative flex size-[42px] items-center justify-center ${
            inverse ? "border-[#C99A4A]" : "border-[#C99A4A]"
          }`}
          style={{
            border: "1.8px solid #C99A4A",
            borderRadius: "4px",
            transform: "rotate(45deg)",
          }}
        >
          <svg
            style={{ transform: "rotate(-45deg)" }}
            className="size-[22px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke={inverse ? "#ffffff" : "#0B1F33"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
          </svg>
        </span>
      )}

      <span className="leading-none">
        <strong
          className={`block font-serif text-[1.45rem] font-semibold leading-none tracking-[-0.02em] ${
            inverse ? "text-white" : "text-[#0B1F33]"
          }`}
        >
          {brandName}
        </strong>
        <small
          className={`mt-[5px] block text-[8.5px] font-semibold tracking-[0.2em] uppercase ${
            inverse ? "text-white/50" : "text-[#8A96A3]"
          }`}
        >
          {descriptor}
        </small>
      </span>
    </Link>
  );
}
