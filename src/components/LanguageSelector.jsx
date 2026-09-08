import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Check } from 'lucide-react';

import { fetchLanguages } from '../services/translationService';

const DEFAULT_LANGS = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
];

export default function LanguageSelector({ variant = 'header' }) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState(DEFAULT_LANGS);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const getLangs = async () => {
      try {
        const list = await fetchLanguages();
        if (list && list.length > 0) {
          setAvailableLanguages(list.filter(l => l.is_active !== false));
        }
      } catch (err) {
        console.warn('Failed to load active languages for selector:', err);
      }
    };
    getLangs();
  }, []);

  const activeLangCode = (i18n.language || 'en').slice(0, 2);
  const currentLang = availableLanguages.find(l => l.code === activeLangCode) || availableLanguages[0] || DEFAULT_LANGS[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLang = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  if (variant === 'mobile') {
    return (
      <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-xl border border-slate-700">
        {availableLanguages.map((l) => {
          const isActive = currentLang.code === l.code;
          return (
            <button
              key={l.code}
              onClick={() => changeLang(l.code)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-brand-blue text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <span>{l.flag}</span>
              <span>{l.code.toUpperCase()}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-all shadow-xs"
        aria-label="Select Language"
      >
        <span className="text-sm leading-none">{currentLang.flag}</span>
        <span className="font-semibold">{currentLang.code.toUpperCase()}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 animate-fadeIn">
          {availableLanguages.map((l) => {
            const isActive = currentLang.code === l.code;
            return (
              <button
                key={l.code}
                onClick={() => changeLang(l.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors text-left ${
                  isActive
                    ? 'bg-brand-blue/20 text-brand-blue font-bold'
                    : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-base leading-none">{l.flag}</span>
                  <span className="truncate">{l.name || l.label}</span>
                </div>
                {isActive && <Check className="w-3.5 h-3.5 text-brand-blue shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
