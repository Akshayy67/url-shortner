import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check if Supabase is properly configured
export const isSupabaseConfigured = !!(
  supabaseUrl &&
  supabaseUrl !== "your_supabase_project_url" &&
  supabaseUrl.includes("supabase.co") &&
  supabaseAnonKey &&
  supabaseAnonKey !== "your_supabase_anon_key" &&
  supabaseAnonKey.length > 50 &&
  serviceRoleKey &&
  serviceRoleKey !== "your_supabase_service_role_key" &&
  serviceRoleKey.length > 50
);

// Log configuration status for debugging
if (typeof window === "undefined") {
  // Only log on server side to avoid console spam
  console.log("🔧 Supabase Configuration Status:", {
    configured: isSupabaseConfigured,
    hasUrl: !!supabaseUrl && supabaseUrl !== "your_supabase_project_url",
    hasAnonKey:
      !!supabaseAnonKey && supabaseAnonKey !== "your_supabase_anon_key",
    hasServiceKey:
      !!serviceRoleKey && serviceRoleKey !== "your_supabase_service_role_key",
    mode: isSupabaseConfigured ? "🟢 REAL DATABASE" : "🟡 DEMO MODE",
  });
}

// Create clients only if properly configured
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export const supabaseAdmin =
  isSupabaseConfigured && serviceRoleKey
    ? createClient(supabaseUrl!, serviceRoleKey)
    : null;
