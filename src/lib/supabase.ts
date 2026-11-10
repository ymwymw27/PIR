import { createClient } from "@supabase/supabase-js"

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? ""
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ""
export const DEMO_MODE = !SUPABASE_URL || !SUPABASE_ANON_KEY

export const db = DEMO_MODE
  ? null
  : createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
