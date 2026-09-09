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
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
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

// Supabase Email & Password Sign In
export const loginWithSupabase = async (email, password) => {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase project URL & Anon Key are not configured yet.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: password
  });

  if (error) {
    throw error;
  }

  return data;
};

// Supabase Sign Out
export const logoutSupabase = async () => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signout error:', e);
    }
  }
  sessionStorage.removeItem('medihub_admin_auth');
  localStorage.removeItem('medihub_admin_user');
};

// Get current Supabase user
export const getCurrentSupabaseUser = async () => {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
  } catch (e) {
    return null;
  }
};
