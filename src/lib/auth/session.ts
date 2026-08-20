// The ONLY place session/admin-role checks are implemented — see AGENTS.md
// Rule 13. Every admin page/action calls requireAdmin(), never a local check.
import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/database/server-client";

export async function getAdminSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Authorization is database-backed (user_admin_roles), never user_metadata.
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) return null;

  return { user };
}

/** Call at the top of any admin page/Server Action. Redirects if not an admin. */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
