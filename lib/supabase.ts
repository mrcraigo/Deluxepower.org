import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Lazy getters so module import at build time doesn't throw when env vars are absent
function getUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
  return url;
}

function getAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
  return key;
}

// Public client — browser-safe (anon key), for real-time subscriptions etc.
export function getPublicClient() {
  return createClient<Database>(getUrl(), getAnonKey());
}

// Server-side admin client — bypasses RLS, only used in API routes / server components
export function getAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  return createClient<Database>(getUrl(), serviceRoleKey, {
    auth: { persistSession: false },
  });
}
