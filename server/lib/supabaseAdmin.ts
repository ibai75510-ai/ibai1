import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

let client: ReturnType<typeof createClient> | undefined;

export function getSupabaseAdmin() {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
  if (!client) {
    client = createClient(env.supabaseUrl, env.supabaseServiceRoleKey);
  }
  return client;
}
