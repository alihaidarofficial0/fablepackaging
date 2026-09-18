export function PageLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div
      className="flex min-h-[calc(100dvh-68px)] flex-col items-center justify-center bg-[#FFFDF9] px-6 min-[1160px]:min-h-[calc(100dvh-114px)]"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="relative size-[92px]">
        <svg className="page-loader-ring absolute inset-0" viewBox="0 0 92 92" fill="none" aria-hidden="true">
          <circle cx="46" cy="46" r="42" stroke="#E7DDD2" strokeWidth="1.5" />
          <circle cx="46" cy="46" r="42" stroke="#D96B2B" strokeWidth="1.75" strokeLinecap="round" strokeDasharray="66 198" />
        </svg>

        <div className="absolute inset-0 grid place-items-center">
          <span className="page-loader-mark grid size-11 rotate-45 place-items-center rounded-[6px] border-2 border-[#C99A4A] text-[#0B1F33]">
            <svg className="size-[22px] -rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l-7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </svg>
          </span>
        </div>
      </div>

      <p className="mt-7 font-serif text-[1.35rem] font-medium tracking-[-0.03em] text-[#0B1F33]">Fable</p>
      <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#667085]">Packaging co.</p>
      <span className="sr-only">{label}</span>
    </div>
  );
}
