import React, { useState, useEffect } from 'react';
import { Globe, Database, PackageCheck, Layers, ArrowUpRight, ShieldCheck, RefreshCw, Cpu, CheckCircle2 } from 'lucide-react';
import { getSupabaseConfig } from '../lib/supabaseClient';
import { fetchLanguages } from '../services/translationService';
import products from '../data/products.json';

export default function DashboardOverview({ onNavigate }) {
  const [languages, setLanguages] = useState([]);
  const [dbConfig, setDbConfig] = useState({ isConfigured: false });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      const langs = await fetchLanguages();
      setLanguages(langs);
      setDbConfig(getSupabaseConfig());
      setIsLoading(false);
    };
    loadStats();
  }, []);

  const totalProducts = products?.length || 598;
  const categoriesCount = new Set(products?.map(p => p.category) || []).size || 25;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-full bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-semibold mb-3">
            <Cpu className="w-3.5 h-3.5" /> Medihub Cloud Console v2.0
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Medihub Pharma Labs Overview
          </h1>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Centralized management hub for multi-language global translation workflows, pharmaceutical product catalogs, and Supabase cloud persistence.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Products */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Export Catalog</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <PackageCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{totalProducts}</div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
            <span className="text-cyan-400 font-medium">{categoriesCount}</span> Therapeutic Categories
          </p>
        </div>

        {/* Active Languages */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Languages</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{languages.length || 3}</div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-2">
            {languages.map(l => (
              <span key={l.code} className="text-sm" title={l.name}>{l.flag}</span>
            ))}
          </p>
        </div>

        {/* Database Status */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cloud Database</span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              dbConfig.isConfigured ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
            }`}>
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl font-bold text-white flex items-center gap-2">
            {dbConfig.isConfigured ? (
              <span className="text-emerald-400 flex items-center gap-1.5 text-base">
                <CheckCircle2 className="w-4 h-4" /> Supabase Live
              </span>
            ) : (
              <span className="text-amber-400 text-base">Local / Hybrid</span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {dbConfig.isConfigured ? 'Direct cloud database sync active' : 'Click Settings to link Supabase'}
          </p>
        </div>

        {/* Compliance & Export */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Global Compliance</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xl font-bold text-white">WHO-GMP & US-FDA</div>
          <p className="text-xs text-slate-400 mt-2">Verified export documentation</p>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Management Workspaces
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Languages workspace */}
          <div 
            onClick={() => onNavigate('languages')}
            className="group cursor-pointer bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 transition-all shadow-lg hover:shadow-cyan-500/5 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                Multi-Language Studio
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Add new international languages (French, Arabic, German, Spanish), edit translation strings side-by-side, and push real-time updates to visitors.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-cyan-400 gap-1">
              <span>Open Translation Studio</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Database workspace */}
          <div 
            onClick={() => onNavigate('supabase')}
            className="group cursor-pointer bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 transition-all shadow-lg hover:shadow-blue-500/5 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                Supabase Cloud Settings
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Connect your Supabase project URL & Anon Key, initialize database tables with 1-click SQL scripts, and sync local translations to cloud tables.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-blue-400 gap-1">
              <span>Configure Cloud Sync</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Public Storefront */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="group cursor-pointer bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all shadow-lg hover:shadow-emerald-500/5 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                Live Storefront Preview
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Open the customer-facing pharmaceutical portal at medihubpharmalabs.com to test language switching and RFQ inquiries live.
              </p>
            </div>
            <div className="mt-6 flex items-center text-xs font-semibold text-emerald-400 gap-1">
              <span>View Public Portal</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
