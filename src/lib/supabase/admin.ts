import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "./server";

// Service role client - ONLY use in server-side code (Server Actions, API Routes)
// Never expose to the browser
export async function createAdminClient() {
  const serverClient = await createServerClient();
  const {
    data: { user },
    error,
  } = await serverClient.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
