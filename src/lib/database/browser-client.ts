// Anon browser client — used ONLY for Supabase Auth methods (signInWithPassword,
// signOut, onAuthStateChange) on the admin login screen. Never used to query
// political data directly from a Client Component. See AGENTS.md Rule 12.
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
