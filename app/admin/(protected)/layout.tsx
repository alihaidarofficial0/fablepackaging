import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { DatabaseSetupNotice } from "@/components/admin/DatabaseSetupNotice";
import { createAdminClient } from "@/lib/supabase/admin";

function isMissingSchemaError(error: { code?: string; message?: string }) {
  return (
    error.code === "PGRST205" ||
    error.message?.includes("Could not find the table") ||
    error.message?.includes("schema cache")
  );
}

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const client = createAdminClient();
  const schemaCheck = client
    ? await client.from("products").select("id").limit(1)
    : { error: { code: "CONFIG_MISSING", message: "Supabase is not configured." } };

  if (schemaCheck.error && !isMissingSchemaError(schemaCheck.error)) {
    throw new Error(schemaCheck.error.message);
  }

  return (
    <AdminShell email={admin.email} role={admin.role === "owner" ? "Administrator" : "Editor"}>
      {schemaCheck.error ? <DatabaseSetupNotice /> : children}
    </AdminShell>
  );
}
