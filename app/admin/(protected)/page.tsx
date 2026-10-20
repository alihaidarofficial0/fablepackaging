import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FolderOpen,
  Inbox,
  PencilLine,
  ExternalLink,
  Users,
} from "lucide-react";
import { getBlogs, getCategories } from "@/app/admin/blog/actions";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const number = new Intl.NumberFormat("en-US");

function StatCard({
  label,
  value,
  href,
  icon: Icon,
  description,
}: {
  label: string;
  value: number;
  href: string;
  icon: typeof BookOpen;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-[#E7DDD2] bg-white p-5 outline-none transition-all hover:border-[#D96B2B]/60 hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#D96B2B] sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-[#FFF4E9] text-[#D96B2B]">
          <Icon className="size-5" />
        </span>
        <ArrowRight className="mt-1 size-4 text-[#98A2B3] transition-colors group-hover:text-[#D96B2B]" />
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-wider text-[#667085]">{label}</p>
      <strong className="mt-1 block font-serif text-4xl leading-none text-[#0B1F33]">
        {number.format(value)}
      </strong>
      <p className="mt-2 text-xs leading-5 text-[#98A2B3]">{description}</p>
    </Link>
  );
}

export default async function AdminDashboard() {
  const [blogs, categories] = await Promise.all([getBlogs(), getCategories()]);

  const client = createAdminClient() || (await createClient());
  let leadCount = 0;
  if (client) {
    try {
      const { count } = await client
        .from("contact_requests")
        .select("id", { count: "exact", head: true });
      leadCount = count || 0;
    } catch {
      leadCount = 0;
    }
  }

  const publishedCount = blogs.filter((b) => b.status === "Published" || !b.status).length;
  const draftCount = blogs.filter((b) => b.status === "Draft").length;

  const stats = [
    {
      label: "Published Articles",
      value: publishedCount,
      href: "/admin/blog",
      icon: BookOpen,
      description: "Active stories live on journal",
    },
    {
      label: "Drafts",
      value: draftCount,
      href: "/admin/blog",
      icon: PencilLine,
      description: "Works currently in progress",
    },
    {
      label: "Topics & Categories",
      value: categories.length,
      href: "/admin/blog/categories",
      icon: FolderOpen,
      description: "Editorial subject classifications",
    },
    {
      label: "Reader Inquiries",
      value: leadCount,
      href: "/admin/leads",
      icon: Inbox,
      description: "Contact and feedback submissions",
    },
  ];

  return (
    <>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#D96B2B]">
            Dashboard
          </p>
          <h1 className="mt-2 font-serif text-4xl leading-none text-[#0B1F33] sm:text-5xl">
            Journal Overview
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667085]">
            Manage your publication, write new stories, track reader feedback, and keep your editorial calendar flowing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/blog"
            target="_blank"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E7DDD2] bg-white px-4 text-xs font-bold uppercase tracking-wider text-[#0B1F33] hover:border-[#D96B2B] hover:text-[#D96B2B] transition-colors"
          >
            View Live Site <ExternalLink className="size-3.5" />
          </Link>
          <Link
            href="/admin/blog/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#D96B2B] px-5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#BC5420] shadow-md shadow-[#D96B2B]/20"
          >
            Write Story <PencilLine className="size-4" />
          </Link>
        </div>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.8fr)]">
        {/* Recent Articles */}
        <div className="rounded-2xl border border-[#E7DDD2] bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#F0EAE2] px-6 py-5">
            <div>
              <h2 className="font-serif text-2xl text-[#0B1F33]">Recent Articles</h2>
              <p className="text-xs text-[#667085] mt-0.5">Latest published or edited stories.</p>
            </div>
            <Link
              href="/admin/blog"
              className="text-xs font-bold uppercase tracking-wider text-[#D96B2B] hover:text-[#BC5420]"
            >
              View All ({blogs.length})
            </Link>
          </div>

          <div className="divide-y divide-[#F0EAE2]">
            {blogs.slice(0, 5).map((post) => (
              <div
                key={post.id || post.slug}
                className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-[#FFFDF9] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/blog/edit/${post.slug}`}
                    className="font-serif font-bold text-sm text-[#0B1F33] hover:text-[#D96B2B] line-clamp-1 transition-colors"
                  >
                    {post.title}
                  </Link>
                  <p className="text-[11px] text-[#98A2B3] mt-0.5">
                    {post.category || "Journal"} · {post.author || "Editorial"} · {post.readTime || "3 min read"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      post.status === "Published" || !post.status
                        ? "bg-[#FFF0E2] text-[#D96B2B]"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {post.status || "Published"}
                  </span>
                  <Link
                    href={`/admin/blog/edit/${post.slug}`}
                    className="p-1.5 text-[#D96B2B] hover:bg-[#FFF4E9] rounded-lg transition-colors"
                  >
                    <PencilLine className="size-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <aside className="rounded-2xl border border-[#E7DDD2] bg-[#FFF9F2] p-6 shadow-sm space-y-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#D96B2B]">
              Quick Actions
            </p>
            <h2 className="mt-1 font-serif text-2xl text-[#0B1F33]">Editorial Tools</h2>
          </div>
          <div className="space-y-2 pt-1">
            <Link
              href="/admin/blog/new"
              className="flex min-h-12 items-center justify-between rounded-xl border border-[#E7DDD2] bg-white px-4 text-xs font-bold uppercase tracking-wider text-[#0B1F33] transition-all hover:border-[#D96B2B] hover:shadow-sm"
            >
              Write New Story <PencilLine className="size-4 text-[#D96B2B]" />
            </Link>
            <Link
              href="/admin/blog/categories"
              className="flex min-h-12 items-center justify-between rounded-xl border border-[#E7DDD2] bg-white px-4 text-xs font-bold uppercase tracking-wider text-[#0B1F33] transition-all hover:border-[#D96B2B] hover:shadow-sm"
            >
              Manage Categories <FolderOpen className="size-4 text-[#D96B2B]" />
            </Link>
            <Link
              href="/admin/users"
              className="flex min-h-12 items-center justify-between rounded-xl border border-[#E7DDD2] bg-white px-4 text-xs font-bold uppercase tracking-wider text-[#0B1F33] transition-all hover:border-[#D96B2B] hover:shadow-sm"
            >
              Manage Admin Users <Users className="size-4 text-[#D96B2B]" />
            </Link>
          </div>
        </aside>
      </section>
    </>
  );
}
