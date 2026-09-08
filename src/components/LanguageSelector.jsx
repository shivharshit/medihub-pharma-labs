import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Check } from 'lucide-react';

const languages = [
  { code: 'en', label: 'English', short: 'EN', flag: '🇬🇧' },
  { code: 'es', label: 'Español', short: 'ES', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', short: 'DE', flag: '🇩🇪' }
];

export default function LanguageSelector({ variant = 'header' }) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeLangCode = (i18n.language || 'en').slice(0, 2);
  const currentLang = languages.find(l => l.code === activeLangCode) || languages[0];

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
        {languages.map((l) => {
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
              <span>{l.short}</span>
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
        <span className="font-semibold">{currentLang.short}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-36 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 animate-fadeIn">
          {languages.map((l) => {
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
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{l.flag}</span>
                  <span>{l.label}</span>
                </div>
                {isActive && <Check className="w-3.5 h-3.5 text-brand-blue" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
