import React from 'react';
import { ShieldCheck, Phone, Mail, Globe, ArrowUp, Award } from 'lucide-react';

export default function Footer({ categories, onSelectCategory }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (catName) => {
    onSelectCategory(catName);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      
      {/* Top Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1 & 2: Brand & Credentials */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-xl p-1.5 h-12 flex items-center justify-center shadow-md">
                <img src="/logo.png" alt="Medihub Pharma Labs" className="h-full object-contain" />
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed text-xs">
              <strong>Medihub Pharma Labs</strong> is an internationally accredited pharmaceutical exporter and manufacturer network specializing in finished formulations, generic tablets, sterile injectables, research peptides, and specialized healthcare solutions for global healthcare markets.
            </p>

            <div className="pt-1 space-y-2 text-slate-300">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4 text-brand-green flex-shrink-0" />
                <span>WHO-GMP Sourced & European Quality Standards</span>
              </div>
              <div className="flex items-center gap-2 text-sky-400 font-medium">
                <Globe className="w-4 h-4 text-brand-blue flex-shrink-0" />
                <span>Global Air-Express Sourcing Across 60+ Countries</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-green flex-shrink-0" />
                <a href="tel:+919244200415" className="hover:text-white transition-colors">
                  +91 9244200415
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-blue flex-shrink-0" />
                <a href="mailto:support@medihubpharmalabs.com" className="hover:text-white transition-colors">
                  support@medihubpharmalabs.com
                </a>
              </div>
            </div>
          </div>

          {/* Col 3, 4, 5: All Categories Columns */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-white font-bold text-sm border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Therapeutic Categories & Brands ({categories.length} Lines)</span>
              <span className="text-[10px] text-brand-blue font-semibold uppercase">Browse By Area</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 pt-1 text-[11px] max-h-80 overflow-y-auto pr-2 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="text-left text-slate-400 hover:text-brand-blue transition-colors truncate py-0.5"
                >
                  • {cat.name} ({cat.count})
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Regulatory & Compliance Disclaimer Strip */}
        <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed space-y-2">
          <div className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-brand-green" />
            <span>International Compliance & Export Disclaimer:</span>
          </div>
          <p>
            Medihub Pharma Labs supplies pharmaceutical formulations, active compounds, and specialty products strictly in accordance with applicable drug regulations in manufacturing and destination jurisdictions. Information on this website is intended solely for licensed B2B international distributors, healthcare professionals, pharmacies, and commercial buyers. All trademarks and brand names are property of their respective owners.
          </p>
        </div>

        {/* Bottom Strip */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} <strong>Medihub Pharma Labs</strong>. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
