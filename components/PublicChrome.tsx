"use client";

import { usePathname } from "next/navigation";

export function PublicChrome({ header, footer, children }: { header: React.ReactNode; footer: React.ReactNode; children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return <main id="main">{children}</main>;
  return <>{header}<main id="main">{children}</main>{footer}</>;
}
