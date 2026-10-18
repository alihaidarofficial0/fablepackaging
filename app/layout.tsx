import type { Metadata } from "next";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/fraunces/wght.css";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PublicChrome } from "@/components/PublicChrome";
import { getCatalogItems, getIndustries, getNavigationItems, getProducts, getSiteSettings } from "@/lib/content";
import { getAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.fablepack.co"),
  title: { default: "Fable Packaging — Custom Boxes, Thoughtfully Made", template: "%s | Fable Packaging" },
  description: "Premium custom packaging with low minimums, expert design support and worldwide delivery.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [settings, products, industries, catalog, navigation, admin] = await Promise.all([getSiteSettings(), getProducts(), getIndustries(), getCatalogItems(), getNavigationItems(), getAdmin()]);
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <a className="skip-link" href="#main">Skip to content</a>
        <PublicChrome
          header={<Header settings={settings} products={products} industries={industries} catalog={catalog} navigation={navigation} admin={admin ? { email: admin.email, role: admin.role } : null} />}
          footer={<Footer settings={settings} products={products} navigation={navigation} />}
        >
          {children}
        </PublicChrome>
      </body>
    </html>
  );
}
