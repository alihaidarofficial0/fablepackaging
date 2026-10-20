import { requireAdmin } from "@/lib/auth";
import { getAboutPageContent } from "@/lib/about-content";
import { AboutPageEditor } from "@/components/admin/AboutPageEditor";

export const metadata = {
  title: "About Page Editor — Fable Admin",
};

export default async function AdminAboutPage() {
  await requireAdmin();
  const content = await getAboutPageContent();

  return <AboutPageEditor initialContent={content} />;
}
