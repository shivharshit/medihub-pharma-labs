import React from 'react';
import { ArrowRight, ShieldCheck, Globe, Truck, Award, Sparkles, CheckCircle2, MessageCircle, Layers } from 'lucide-react';

const pillThemes = {
  'shree-venkatesh-injections': 'bg-rose-600 hover:bg-rose-700 text-white border-rose-500 font-bold shadow-xs',
  'shree-venkatesh-tablets': 'bg-teal-600 hover:bg-teal-700 text-white border-teal-500 font-bold shadow-xs',
  'roger-pharma': 'bg-sky-600 hover:bg-sky-700 text-white border-sky-500 font-bold shadow-xs',
  '3rd-degree-injectable': 'bg-amber-600 hover:bg-amber-700 text-white border-amber-500 font-bold shadow-xs',
  'pharmaqo-labs-hgh-peptides': 'bg-purple-600 hover:bg-purple-700 text-white border-purple-500 font-bold shadow-xs',
  'pharmaqo-labs-injectables': 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500 font-bold shadow-xs',
  'infinity-pharma-injectables': 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 font-bold shadow-xs',
  'evolve-biolabs-anabolics': 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500 font-bold shadow-xs'
};

export default function Hero({ 
  onExploreClick, 
  onSelectPopularCategory, 
  categories = [], 
  totalProducts = 598, 
  totalCategories = 48 
}) {
  // Dynamically take top featured categories from categories list
  const topFeaturedCategories = categories.length > 0
    ? categories.filter(c => c.featured).slice(0, 8)
    : [];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-brand-navy to-slate-900 text-white py-16 md:py-24 border-b border-slate-800">
      {/* Background Glows & Medical Patterns */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-green/15 rounded-full blur-3xl pointer-events-none translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-brand-blue/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-brand-blue-light shadow-inner">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-ping"></span>
              <span>Leading Pharmaceutical Manufacturer & Global Exporter</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Importing Health, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400">
                Exporting Wellness Worldwide
              </span>
            </h1>

            {/* Description */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              <strong>Medihub Pharma Labs</strong> delivers high-grade pharmaceutical tablets, capsules, injectables, peptides, SARMs, Shree Venkatesh, Roger Pharma, 3rd Degree, PHARMAQO Labs, Infinity Pharma, and Evolve Biolabs formulations to verified buyers across 60+ countries.
            </p>

            {/* Key Quality Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0" />
                <span>European Standards</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0" />
                <span>Cold-Chain Logistics</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0" />
                <span>Shree Venkatesh & Roger</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0" />
                <span>TrustKey™ Verified</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0" />
                <span>PHARMAQO & 3rd Degree</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0" />
                <span>Direct B2B Pricing</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onExploreClick}
                className="flex items-center gap-2 bg-gradient-to-r from-brand-blue to-sky-500 hover:from-brand-blue-dark hover:to-sky-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-sky-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>Browse {totalProducts}+ Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://wa.me/919244200415?text=Hello%20Medihub%20Pharma%20Labs,%20I%20want%20to%20place%20a%20bulk%20pharmaceutical%20inquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp RFQ</span>
              </a>
            </div>

            {/* Dynamic Featured Category Filter Pills */}
            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Popular Flagship Categories & Brands:</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {topFeaturedCategories.map((cat) => {
                  const customTheme = pillThemes[cat.slug] || 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-brand-blue/50';
                  
                  return (
                    <button
                      key={cat.id}
                      onClick={() => onSelectPopularCategory(cat.name)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all transform hover:-translate-y-0.5 ${customTheme}`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-black/25 rounded-full font-mono">
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Hero Card / Stats Dashboard */}
          <div className="lg:col-span-5">
            <div className="relative bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
              
              {/* Card Header with Logo */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl p-1 flex items-center justify-center shadow-md">
                    <img src="/logo.png" alt="Medihub Pharma Labs" className="object-contain" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Medihub Pharma Labs</h3>
                    <p className="text-xs text-brand-green font-medium">WHO-GMP Sourced • Global Formulation Labs</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-900/60 text-emerald-300 text-xs font-semibold rounded-full border border-emerald-500/30">
                  Active Exporter
                </span>
              </div>

              {/* Live Metric Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/60">
                  <div className="text-2xl sm:text-3xl font-black text-brand-blue">{totalProducts}+</div>
                  <div className="text-xs text-slate-400 font-medium">Export Formulations</div>
                </div>
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/60">
                  <div className="text-2xl sm:text-3xl font-black text-brand-green">{totalCategories}</div>
                  <div className="text-xs text-slate-400 font-medium">Therapeutic Categories</div>
                </div>
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/60">
                  <div className="text-2xl sm:text-3xl font-black text-sky-400">60+</div>
                  <div className="text-xs text-slate-400 font-medium">Global Export Markets</div>
                </div>
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/60">
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">100%</div>
                  <div className="text-xs text-slate-400 font-medium">Quality Guaranteed</div>
                </div>
              </div>

              {/* Fast Quote Prompt */}
              <div className="bg-gradient-to-r from-brand-blue/15 to-brand-green/15 border border-brand-blue/30 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center justify-between font-semibold text-white">
                  <span>Fast Quotation Delivery:</span>
                  <span className="text-brand-green">Within 2 Hours</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-normal">
                  Submit your required molecules, strengths, and destination country to receive immediate proforma pricing with full COA documentation.
                </p>
              </div>

              {/* Contact direct hotline */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-300">
                <span className="text-slate-400">Export Desk:</span>
                <span className="font-mono font-bold text-white text-sm">+91 9244200415</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
