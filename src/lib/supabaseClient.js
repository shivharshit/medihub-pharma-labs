import { createClient } from '@supabase/supabase-js';

export const getSupabaseConfig = () => {
  const localUrl = localStorage.getItem('medihub_supabase_url');
  const localKey = localStorage.getItem('medihub_supabase_anon_key');

  const supabaseUrl = localUrl || import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = localKey || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  return { supabaseUrl, supabaseAnonKey, isConfigured: Boolean(supabaseUrl && supabaseAnonKey) };
};

export const saveSupabaseConfig = (url, anonKey) => {
  if (url) localStorage.setItem('medihub_supabase_url', url.trim());
  else localStorage.removeItem('medihub_supabase_url');

  if (anonKey) localStorage.setItem('medihub_supabase_anon_key', anonKey.trim());
  else localStorage.removeItem('medihub_supabase_anon_key');
  
  supabaseInstance = createSupabaseInstance();
  return supabaseInstance;
};

const createSupabaseInstance = () => {
  const { supabaseUrl, supabaseAnonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;
  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
};

let supabaseInstance = createSupabaseInstance();

export const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseInstance();
  }
  return supabaseInstance;
};
