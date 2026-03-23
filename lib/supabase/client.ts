"use client";

import { Database } from "@/supabase/database.types";
import { createBrowserClient } from "@supabase/ssr";


let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null =
  null;

function getSupabase() {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabaseClient;
}

export const createClient = () => getSupabase();
