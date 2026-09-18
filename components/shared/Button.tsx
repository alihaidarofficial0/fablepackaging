import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Button({ href, children, variant = "primary", full = false }: { href: string; children: React.ReactNode; variant?: "primary" | "secondary" | "light"; full?: boolean }) {
  const styles = variant === "primary" ? "border-[#D96B2B] bg-[#D96B2B] text-white hover:border-[#BC5420] hover:bg-[#BC5420] active:border-[#A94718] active:bg-[#A94718]" : variant === "light" ? "border-[#D96B2B] bg-[#D96B2B] text-white hover:border-[#BC5420] hover:bg-[#BC5420] active:border-[#A94718] active:bg-[#A94718]" : "border-[#0B1F33]/20 bg-white text-[#0B1F33] hover:border-[#0B1F33]/35 hover:bg-[#F3E8DA]";
  return <Link href={href} style={variant === "secondary" ? undefined : { color: "#FFFFFF" }} className={`inline-flex h-[50px] items-center justify-center gap-2 rounded-[9px] border px-5 text-sm font-extrabold outline-none transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-[#D96B2B] focus-visible:ring-offset-4 ${styles} ${full ? "w-full" : ""}`}>{children}<ArrowRight className="size-4" aria-hidden="true"/></Link>;
}
