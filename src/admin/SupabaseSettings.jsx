import React, { useState, useEffect } from 'react';
import { 
  Database, Key, Link as LinkIcon, CheckCircle2, AlertCircle, 
  Copy, RefreshCw, Sparkles, UploadCloud, ShieldCheck, Terminal
} from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig, getSupabase } from '../lib/supabaseClient';
import { seedTranslationsToSupabase, saveLanguage } from '../services/translationService';
import enFallback from '../locales/en.json';
import esFallback from '../locales/es.json';
import deFallback from '../locales/de.json';

const SQL_SCHEMA = `-- Supabase Schema for Medihub Pharma Labs
CREATE TABLE IF NOT EXISTS languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    flag VARCHAR(10) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false,
    direction VARCHAR(5) DEFAULT 'ltr',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    language_code VARCHAR(10) NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
    key_path VARCHAR(255) NOT NULL,
    translation_value TEXT NOT NULL,
    section VARCHAR(100) DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(language_code, key_path)
);

CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rfq_inquiries (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255),
    company VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100),
    country VARCHAR(100),
    country_code VARCHAR(10),
    items JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) DEFAULT 'New Lead',
    notes TEXT,
    estimated_value VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS billa_eyes_sessions (
    visitor_id VARCHAR(100) PRIMARY KEY,
    country VARCHAR(100),
    country_code VARCHAR(10),
    flag VARCHAR(10),
    city VARCHAR(100),
    device_type VARCHAR(100),
    browser VARCHAR(100),
    os VARCHAR(100),
    current_page VARCHAR(255),
    current_action VARCHAR(255),
    is_online BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    last_ping_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS billa_eyes_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    detail TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    device_type VARCHAR(50) DEFAULT 'Desktop',
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfq_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE billa_eyes_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE billa_eyes_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Languages" ON languages FOR SELECT USING (true);
CREATE POLICY "Public Read Translations" ON translations FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow All on Languages" ON languages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All on Translations" ON translations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All on Settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All on RFQ" ON rfq_inquiries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All on Billa Sessions" ON billa_eyes_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All on Billa Events" ON billa_eyes_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All on Analytics" ON analytics_events FOR ALL USING (true) WITH CHECK (true);
`;

export default function SupabaseSettings() {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [status, setStatus] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    const config = getSupabaseConfig();
    setUrl(config.supabaseUrl || '');
    setAnonKey(config.supabaseAnonKey || '');
  }, []);

  const handleSaveAndTest = async (e) => {
    e.preventDefault();
    setIsTesting(true);
    setStatus(null);

    try {
      saveSupabaseConfig(url, anonKey);
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Please enter valid Supabase credentials.');
      }

      // Test connection with lightweight select
      const { data, error } = await supabase.from('languages').select('count', { count: 'exact', head: true });
      if (error && error.code !== 'PGRST116') {
        // Table might not exist yet, check auth
        const { error: authErr } = await supabase.auth.getSession();
        if (authErr) throw authErr;
      }

      setStatus({
        type: 'success',
        message: 'Successfully connected to Supabase Project! Credentials stored and active.'
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: `Connection failed: ${err.message || 'Check URL and Anon Key'}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSeedDefaults = async () => {
    setIsSeeding(true);
    setStatus(null);
    try {
      // 1. Seed languages
      await saveLanguage({ code: 'en', name: 'English (Global)', flag: '🇬🇧', is_active: true, is_default: true });
      await saveLanguage({ code: 'es', name: 'Español (Spanish)', flag: '🇪🇸', is_active: true, is_default: false });
      await saveLanguage({ code: 'de', name: 'Deutsch (German)', flag: '🇩🇪', is_active: true, is_default: false });

      // 2. Seed translations
      const countEn = await seedTranslationsToSupabase('en', enFallback);
      const countEs = await seedTranslationsToSupabase('es', esFallback);
      const countDe = await seedTranslationsToSupabase('de', deFallback);

      setStatus({
        type: 'success',
        message: `Successfully seeded ${countEn + countEs + countDe} translations across English, Spanish, and German to Supabase!`
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: `Seeding failed: ${err.message}. Make sure you ran the SQL Schema in your Supabase SQL editor first.`
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Supabase Cloud Database Settings</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Connect your Supabase instance to sync dynamic multi-language translations and catalog data.
            </p>
          </div>
        </div>
      </div>

      {/* Status Alert */}
      {status && (
        <div className={`p-4 rounded-xl flex items-start gap-3 text-xs font-medium ${
          status.type === 'success'
            ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-200'
            : 'bg-red-950/80 border border-red-500/40 text-red-200'
        }`}>
          {status.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      {/* Supabase Credentials Form */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-cyan-400" />
            Project API Credentials
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Found in your Supabase Dashboard under <strong>Project Settings → API</strong>.
          </p>
        </div>

        <form onSubmit={handleSaveAndTest} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Supabase Project URL
            </label>
            <input
              type="url"
              placeholder="https://your-project-id.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Supabase Anon / Public API Key
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
              required
            />
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isTesting}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>Save & Test Connection</span>
            </button>

            <button
              type="button"
              onClick={handleSeedDefaults}
              disabled={isSeeding || !url || !anonKey}
              className="px-5 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-semibold rounded-xl text-xs flex items-center gap-2 transition-all disabled:opacity-40"
            >
              {isSeeding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              <span>Seed Initial EN, ES, DE Translations to Supabase</span>
            </button>
          </div>
        </form>
      </div>

      {/* SQL Initialization helper */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">1-Click Database Setup SQL</h2>
          </div>
          <button
            onClick={handleCopySql}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-slate-200 font-medium flex items-center gap-1.5 transition-colors"
          >
            {copiedSql ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy SQL Schema</span>
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Paste this SQL into your Supabase Dashboard (<strong>SQL Editor → New Query → Run</strong>) to create the required tables and security policies.
        </p>
        <pre className="bg-slate-950 p-4 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto max-h-48 border border-slate-800">
          {SQL_SCHEMA}
        </pre>
      </div>
    </div>
  );
}
