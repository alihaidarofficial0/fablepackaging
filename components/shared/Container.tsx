export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1320px] px-4 sm:px-6 ${className}`}>{children}</div>;
}
