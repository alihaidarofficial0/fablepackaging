import type { Metadata } from "next";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/fraunces/wght.css";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PublicChrome } from "@/components/PublicChrome";
import { ToastContainer } from "@/components/Toast";
import { getSiteSettings } from "@/lib/content";
import { getAdmin } from "@/lib/auth";
import { SiteScripts } from "@/components/SiteScripts";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.fablepack.co");
  const stamp = encodeURIComponent(settings.favicon_url || "default");

  return {
    metadataBase,
    title: {
      default: "Fable Journal — Packaging Design, Craftsmanship & Material Culture",
      template: "%s | Fable Journal",
    },
    description:
      "An editorial publication exploring structural design, material science, sustainability, and the tactile art of packaging.",
    icons: {
      icon: [{ url: `/icon?v=${stamp}`, type: "image/png" }],
      shortcut: `/icon?v=${stamp}`,
      apple: [{ url: `/apple-icon?v=${stamp}`, type: "image/png" }],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [settings, admin] = await Promise.all([
    getSiteSettings(),
    getAdmin(),
  ]);

  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="font-sans antialiased bg-[#FFFDF9] text-[#0B1F33]" suppressHydrationWarning>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <ToastContainer />
        <SiteScripts header={settings.header_scripts} footer={settings.footer_scripts} />
        <PublicChrome
          header={
            <Header
              settings={settings}
              admin={admin ? { email: admin.email, role: admin.role } : null}
            />
          }
          footer={<Footer settings={settings} />}
        >
          {children}
        </PublicChrome>
      </body>
    </html>
  );
}
