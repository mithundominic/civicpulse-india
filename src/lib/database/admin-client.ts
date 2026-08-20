// [Server-only] Service-role client — bypasses Row Level Security entirely.
// Import this ONLY inside features/admin/ or a features/*/actions.ts write
// that has already called requireAdmin(). Never import into anything
// reachable by an unauthenticated request. See AGENTS.md Rule 12.
import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export function createAdminClient() {
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Admin operations require it — see .env.example."
    );
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;

  return createSupabaseClient<Database>(
    supabaseUrl!,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
