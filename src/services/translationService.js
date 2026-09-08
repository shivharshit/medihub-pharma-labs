import { getSupabase } from '../lib/supabaseClient';
import i18n from '../i18n';
import enFallback from '../locales/en.json';
import esFallback from '../locales/es.json';
import deFallback from '../locales/de.json';

const DEFAULT_LANGUAGES = [
  { code: 'en', name: 'English (Global)', flag: '🇬🇧', is_active: true, is_default: true },
  { code: 'es', name: 'Español (Spanish)', flag: '🇪🇸', is_active: true, is_default: false },
  { code: 'de', name: 'Deutsch (German)', flag: '🇩🇪', is_active: true, is_default: false }
];

const LOCAL_FALLBACKS = {
  en: enFallback,
  es: esFallback,
  de: deFallback
};

// Flatten nested object keys (e.g. { hero: { title: "..." } } -> { "hero.title": "..." })
export const flattenKeys = (obj, prefix = '') => {
  const flattened = {};
  for (const [key, value] of Object.entries(obj || {})) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(flattened, flattenKeys(value, fullPath));
    } else {
      flattened[fullPath] = value;
    }
  }
  return flattened;
};

// Unflatten dot-notation keys back to nested object
export const unflattenKeys = (data) => {
  const result = {};
  for (const [key, value] of Object.entries(data || {})) {
    const parts = key.split('.');
    let current = result;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        current[part] = value;
      } else {
        current[part] = current[part] || {};
        current = current[part];
      }
    }
  }
  return result;
};

// Fetch available languages from Supabase or localStorage / defaults
export const fetchLanguages = async () => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('*')
        .order('is_default', { ascending: false })
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        localStorage.setItem('medihub_cached_languages', JSON.stringify(data));
        return data;
      }
    } catch (err) {
      console.warn('Supabase fetchLanguages error, using fallback:', err);
    }
  }

  // Check localStorage cache or return defaults
  const cached = localStorage.getItem('medihub_cached_languages');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      // Ignore JSON error
    }
  }
  return DEFAULT_LANGUAGES;
};

// Add or update a language
export const saveLanguage = async (languageData) => {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('languages')
      .upsert(languageData, { onConflict: 'code' })
      .select();
    if (error) throw error;
    return data;
  } else {
    // Local storage fallback
    const current = await fetchLanguages();
    const existingIdx = current.findIndex(l => l.code === languageData.code);
    let updated;
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = { ...updated[existingIdx], ...languageData };
    } else {
      updated = [...current, languageData];
    }
    localStorage.setItem('medihub_cached_languages', JSON.stringify(updated));
    return [languageData];
  }
};

// Fetch translations for a specific language
export const fetchTranslationsForLang = async (langCode) => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('key_path, translation_value, section')
        .eq('language_code', langCode);

      if (!error && data && data.length > 0) {
        const dictionary = {};
        data.forEach(item => {
          dictionary[item.key_path] = item.translation_value;
        });
        const nested = unflattenKeys(dictionary);
        // Cache to localStorage
        localStorage.setItem(`medihub_translations_${langCode}`, JSON.stringify(nested));
        return nested;
      }
    } catch (err) {
      console.warn(`Supabase fetch translations error for ${langCode}:`, err);
    }
  }

  // Fallback to localStorage or bundled JSON
  const cached = localStorage.getItem(`medihub_translations_${langCode}`);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {}
  }

  return LOCAL_FALLBACKS[langCode] || LOCAL_FALLBACKS['en'] || {};
};

// Save a single key translation
export const saveSingleTranslation = async (langCode, keyPath, translationValue, section = 'general') => {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase
      .from('translations')
      .upsert({
        language_code: langCode,
        key_path: keyPath,
        translation_value: translationValue,
        section: section || keyPath.split('.')[0] || 'general',
        updated_at: new Date().toISOString()
      }, { onConflict: 'language_code,key_path' });
    if (error) throw error;
  }

  // Update in i18next runtime
  i18n.addResource(langCode, 'translation', keyPath, translationValue);

  // Update local cache
  const cached = await fetchTranslationsForLang(langCode);
  const flat = flattenKeys(cached);
  flat[keyPath] = translationValue;
  const updatedNested = unflattenKeys(flat);
  localStorage.setItem(`medihub_translations_${langCode}`, JSON.stringify(updatedNested));

  return true;
};

// Batch seed / sync local JSON translations into Supabase
export const seedTranslationsToSupabase = async (langCode, jsonContent) => {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error('Supabase is not configured yet. Please configure Supabase URL & Anon Key.');
  }

  const flattened = flattenKeys(jsonContent);
  const rows = Object.entries(flattened).map(([keyPath, val]) => ({
    language_code: langCode,
    key_path: keyPath,
    translation_value: String(val),
    section: keyPath.split('.')[0] || 'general'
  }));

  // Batch insert in chunks of 100
  const chunkSize = 100;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await supabase
      .from('translations')
      .upsert(chunk, { onConflict: 'language_code,key_path' });
    if (error) throw error;
  }

  return rows.length;
};

// Sync translations from Supabase into runtime i18next
export const syncLiveTranslations = async () => {
  try {
    const languages = await fetchLanguages();
    for (const lang of languages) {
      if (lang.is_active) {
        const translations = await fetchTranslationsForLang(lang.code);
        if (translations && Object.keys(translations).length > 0) {
          i18n.addResourceBundle(lang.code, 'translation', translations, true, true);
        }
      }
    }
  } catch (err) {
    console.warn('Failed to sync live translations:', err);
  }
};
