import React, { useState, useEffect } from 'react';
import { 
  Globe, Plus, Save, Search, Filter, RefreshCw, Check, AlertCircle, 
  Download, Upload, Sparkles, CloudUpload, ArrowRight, CheckCircle2 
} from 'lucide-react';
import { 
  fetchLanguages, saveLanguage, fetchTranslationsForLang, 
  saveSingleTranslation, flattenKeys, unflattenKeys, seedTranslationsToSupabase 
} from '../services/translationService';
import enFallback from '../locales/en.json';
import esFallback from '../locales/es.json';
import deFallback from '../locales/de.json';
import { getSupabaseConfig } from '../lib/supabaseClient';

const PRESET_LANGUAGES = [
  { code: 'fr', name: 'Français (French)', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية (Arabic)', flag: '🇦🇪', direction: 'rtl' },
  { code: 'ru', name: 'Русский (Russian)', flag: '🇷🇺' },
  { code: 'pt', name: 'Português (Portuguese)', flag: '🇵🇹' },
  { code: 'it', name: 'Italiano (Italian)', flag: '🇮🇹' },
  { code: 'ja', name: '日本語 (Japanese)', flag: '🇯🇵' },
  { code: 'zh', name: '中文 (Chinese)', flag: '🇨🇳' }
];

export default function LanguageManager() {
  const [languages, setLanguages] = useState([]);
  const [activeLang, setActiveLang] = useState('en');
  const [enFlatTranslations, setEnFlatTranslations] = useState({});
  const [targetFlatTranslations, setTargetFlatTranslations] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // New language form state
  const [newLangCode, setNewLangCode] = useState('');
  const [newLangName, setNewLangName] = useState('');
  const [newLangFlag, setNewLangFlag] = useState('');
  const [newLangDirection, setNewLangDirection] = useState('ltr');

  // Load languages and initial master English translations
  useEffect(() => {
    loadAllLanguages();
    const flatEn = flattenKeys(enFallback);
    setEnFlatTranslations(flatEn);
  }, []);

  // When active language changes, load its translations
  useEffect(() => {
    loadTranslationsFor(activeLang);
  }, [activeLang]);

  const loadAllLanguages = async () => {
    try {
      const langs = await fetchLanguages();
      setLanguages(langs);
      if (langs.length > 0 && !activeLang) {
        setActiveLang(langs[0].code);
      }
    } catch (err) {
      console.error('Error loading languages:', err);
    }
  };

  const loadTranslationsFor = async (langCode) => {
    try {
      const raw = await fetchTranslationsForLang(langCode);
      const flat = flattenKeys(raw);
      setTargetFlatTranslations(flat);
    } catch (err) {
      console.error(`Error loading translations for ${langCode}:`, err);
    }
  };

  const handleValueChange = (keyPath, val) => {
    setTargetFlatTranslations(prev => ({
      ...prev,
      [keyPath]: val
    }));
  };

  const handleSaveSingle = async (keyPath) => {
    const val = targetFlatTranslations[keyPath] || '';
    const section = keyPath.split('.')[0] || 'general';
    try {
      await saveSingleTranslation(activeLang, keyPath, val, section);
      showNotification(`Saved "${keyPath}" successfully!`, 'success');
    } catch (err) {
      showNotification(`Failed to save: ${err.message}`, 'error');
    }
  };

  const handleSaveAllCurrent = async () => {
    setIsSaving(true);
    try {
      const dbConfig = getSupabaseConfig();
      if (dbConfig.isConfigured) {
        const nested = unflattenKeys(targetFlatTranslations);
        await seedTranslationsToSupabase(activeLang, nested);
        showNotification(`All ${activeLang.toUpperCase()} translations synced to Supabase!`, 'success');
      } else {
        // Save to localStorage
        const nested = unflattenKeys(targetFlatTranslations);
        localStorage.setItem(`medihub_translations_${activeLang}`, JSON.stringify(nested));
        showNotification(`All ${activeLang.toUpperCase()} translations saved locally!`, 'success');
      }
    } catch (err) {
      showNotification(`Sync error: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNewLanguage = async (e) => {
    e.preventDefault();
    if (!newLangCode || !newLangName) return;

    const langObj = {
      code: newLangCode.toLowerCase().trim(),
      name: newLangName.trim(),
      flag: newLangFlag.trim() || '🌐',
      direction: newLangDirection,
      is_active: true,
      is_default: false
    };

    try {
      await saveLanguage(langObj);
      await loadAllLanguages();
      setActiveLang(langObj.code);
      setIsAddModalOpen(false);
      setNewLangCode('');
      setNewLangName('');
      setNewLangFlag('');
      showNotification(`Language ${langObj.name} added successfully!`, 'success');
    } catch (err) {
      showNotification(`Failed to add language: ${err.message}`, 'error');
    }
  };

  const showNotification = (msg, type = 'success') => {
    setStatusMessage({ msg, type });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  // Extract unique sections
  const sections = ['all', ...Array.from(new Set(Object.keys(enFlatTranslations).map(k => k.split('.')[0])))];

  // Filter keys
  const filteredKeys = Object.keys(enFlatTranslations).filter(keyPath => {
    const matchesSection = selectedSection === 'all' || keyPath.startsWith(`${selectedSection}.`);
    const masterVal = String(enFlatTranslations[keyPath] || '').toLowerCase();
    const targetVal = String(targetFlatTranslations[keyPath] || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || keyPath.toLowerCase().includes(q) || masterVal.includes(q) || targetVal.includes(q);
    return matchesSection && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Globe className="w-6 h-6 text-cyan-400" />
            Multi-Language Translation Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Edit strings live, manage global localized phrasing, and sync changes directly with Supabase.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4 text-cyan-400" /> Add Language
          </button>

          <button
            onClick={handleSaveAllCurrent}
            disabled={isSaving}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-4 h-4" />}
            <span>Sync {activeLang.toUpperCase()} to Database</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {statusMessage && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-xs font-medium transition-all ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-200' 
            : 'bg-red-950/80 border border-red-500/40 text-red-200'
        }`}>
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{statusMessage.msg}</span>
        </div>
      )}

      {/* Language Selector Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Select Target Editing Language:
        </div>
        <div className="flex flex-wrap gap-2.5">
          {languages.map((lang) => {
            const isSelected = activeLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setActiveLang(lang.code)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25 font-bold'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase ${
                  isSelected ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'
                }`}>
                  {lang.code}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        {/* Search Input */}
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search translation key or text in English/Target language..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        {/* Section Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 capitalize"
          >
            {sections.map(sec => (
              <option key={sec} value={sec}>
                {sec === 'all' ? 'All Sections' : `Section: ${sec}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Translation Keys List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
          <div className="w-1/3">Translation Key & English Master (Source)</div>
          <div className="w-2/3 pl-4">Target Translation ({activeLang.toUpperCase()})</div>
        </div>

        <div className="divide-y divide-slate-800/80 max-h-[600px] overflow-y-auto">
          {filteredKeys.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              No matching translation keys found.
            </div>
          ) : (
            filteredKeys.map((keyPath) => {
              const masterValue = enFlatTranslations[keyPath] || '';
              const targetValue = targetFlatTranslations[keyPath] ?? masterValue;
              const isModified = targetFlatTranslations[keyPath] !== undefined;

              return (
                <div key={keyPath} className="p-4 hover:bg-slate-800/30 transition-colors flex flex-col md:flex-row gap-4 items-start">
                  {/* Left Column: Key & Master English */}
                  <div className="w-full md:w-1/3 space-y-1">
                    <div className="font-mono text-[11px] text-cyan-400 break-all font-semibold">
                      {keyPath}
                    </div>
                    <div className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">English Master:</span>
                      {masterValue}
                    </div>
                  </div>

                  {/* Right Column: Editable Target Translation */}
                  <div className="w-full md:w-2/3 flex items-center gap-2">
                    <textarea
                      rows={masterValue.length > 60 ? 3 : 1}
                      value={targetValue}
                      onChange={(e) => handleValueChange(keyPath, e.target.value)}
                      placeholder={`Enter translation for ${keyPath}...`}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all resize-y"
                    />
                    <button
                      onClick={() => handleSaveSingle(keyPath)}
                      title="Save this single key"
                      className="p-2.5 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 rounded-xl border border-slate-700 transition-all shrink-0"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add New Language Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                Add New Language
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>

            {/* Quick Presets */}
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Quick Select Preset:
              </div>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_LANGUAGES.map(p => (
                  <button
                    key={p.code}
                    type="button"
                    onClick={() => {
                      setNewLangCode(p.code);
                      setNewLangName(p.name);
                      setNewLangFlag(p.flag);
                      setNewLangDirection(p.direction || 'ltr');
                    }}
                    className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left flex items-center gap-2 text-xs text-slate-200 transition-colors"
                  >
                    <span className="text-sm">{p.flag}</span>
                    <span className="truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddNewLanguage} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">Language Code (ISO 639-1)</label>
                <input
                  type="text"
                  placeholder="e.g. fr, ar, ru, pt"
                  value={newLangCode}
                  onChange={(e) => setNewLangCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Français (French)"
                  value={newLangName}
                  onChange={(e) => setNewLangName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1">Flag Emoji</label>
                  <input
                    type="text"
                    placeholder="e.g. 🇫🇷"
                    value={newLangFlag}
                    onChange={(e) => setNewLangFlag(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1">Text Direction</label>
                  <select
                    value={newLangDirection}
                    onChange={(e) => setNewLangDirection(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="ltr">LTR (Left to Right)</option>
                    <option value="rtl">RTL (Right to Left)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Save & Enable Language
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
