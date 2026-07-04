import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isUrlValid = rawUrl.startsWith('http://') || rawUrl.startsWith('https://');
const supabaseUrl = isUrlValid ? rawUrl : 'https://placeholder-project.supabase.co';
const supabaseAnonKey = rawKey || 'dummy-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
