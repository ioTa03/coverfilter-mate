// src/config/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Anon Key must be defined in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;