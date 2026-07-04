import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const isUrlValid = rawUrl.startsWith('http://') || rawUrl.startsWith('https://');
const supabaseUrl = isUrlValid ? rawUrl : 'https://placeholder-project.supabase.co';
const supabaseServiceRoleKey = rawKey || 'dummy-service-role-key';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
