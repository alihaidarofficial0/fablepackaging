import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { UsersClient, type AdminUserItem } from "@/components/admin/UsersClient";

export const metadata = {
  title: "Admin Users — Fable Packaging Admin",
};

export default async function UsersAdminPage() {
  const admin = await requireAdmin();
  const client = createAdminClient() || (await createClient());

  const { data } = client
    ? await client
        .from("admin_users")
        .select("user_id,email,role,active,created_at")
        .order("created_at")
    : { data: [] };

  const users = (data || []) as AdminUserItem[];
  const visibleUsers = users.some((u) => u.user_id === admin.id)
    ? users
    : [
        {
          user_id: admin.id,
          email: admin.email,
          role: admin.role,
          active: true,
          created_at: new Date().toISOString(),
        },
        ...users,
      ];

  return (
    <UsersClient
      users={visibleUsers}
      currentAdminId={admin.id}
      isOwner={admin.role === "owner"}
    />
  );
}
