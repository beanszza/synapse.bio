import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key-here'
);

// Fallback URL and Key to prevent runtime createClient crash if env vars are unset during dev
const safeUrl = isSupabaseConfigured ? supabaseUrl : 'https://dummyproject.supabase.co';
const safeKey = isSupabaseConfigured ? supabaseAnonKey : 'dummy-key';

export const supabase = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
