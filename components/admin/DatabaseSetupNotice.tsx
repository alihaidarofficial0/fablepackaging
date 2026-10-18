import Link from "next/link";
import { AlertTriangle, ExternalLink } from "lucide-react";

function getSqlEditorUrl() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) return "https://supabase.com/dashboard";

  try {
    const projectRef = new URL(supabaseUrl).hostname.split(".")[0];
    return `https://supabase.com/dashboard/project/${projectRef}/sql/new`;
  } catch {
    return "https://supabase.com/dashboard";
  }
}

const allMigrations = [
  "supabase/migrations/202609180001_initial_cms.sql",
  "supabase/migrations/202609180002_catalog_navigation.sql",
  "supabase/migrations/202609210003_admin_cms_extensions.sql",
  "supabase/migrations/202609210004_content_editor_fields.sql",
];

export function DatabaseSetupNotice({ migrations = allMigrations }: { migrations?: string[] }) {
  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-amber-300 bg-amber-50 p-6 text-[#0B1F33] sm:p-8">
      <div className="flex items-start gap-4">
        <span className="rounded-xl bg-amber-100 p-3 text-amber-700">
          <AlertTriangle className="size-6" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.16em] text-amber-700">
            Database setup required
          </p>
          <h1 className="mt-2 font-serif text-3xl">CMS database update required</h1>
          <p className="mt-3 text-sm leading-6 text-[#526171]">
            Supabase is connected, but one or more tables or fields required by this
            module are missing. Run the unapplied SQL files below in the order shown,
            then refresh this page.
          </p>
        </div>
      </div>

      <ol className="mt-6 space-y-3 rounded-xl border border-amber-200 bg-white p-5 text-sm font-semibold">
        {migrations.map((migration, index) => <li key={migration}><span className="mr-2 text-amber-700">{index + 1}.</span><code>{migration}</code></li>)}
      </ol>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={getSqlEditorUrl()}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#0B1F33] px-5 text-sm font-bold text-white hover:bg-[#16324d]"
        >
          Open Supabase SQL Editor <ExternalLink className="size-4" />
        </a>
        <Link
          href="/admin"
          className="inline-flex min-h-11 items-center rounded-lg border border-[#0B1F33]/20 bg-white px-5 text-sm font-bold hover:bg-[#F7F5F2]"
        >
          Check again
        </Link>
      </div>
    </section>
  );
}
