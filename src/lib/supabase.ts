import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !supabaseServiceRole) {
  // It's fine to run without Supabase locally; uploads will fall back to local filesystem.
  console.warn('Supabase is not configured. SUPABASE_URL or SUPABASE_SERVICE_ROLE is missing.');
}

export const supabase = supabaseUrl && supabaseServiceRole
  ? createClient(supabaseUrl, supabaseServiceRole, {
      auth: { persistSession: false },
    })
  : null;
