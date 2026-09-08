import React from 'react';
import { 
  Sparkles, Flame, Syringe, Dna, Dumbbell, Pill, ArrowRight, ShieldCheck, 
  ChevronRight, Award, Zap, Layers, CheckCircle2, ArrowUpRight
} from 'lucide-react';

const brandConfigs = {
  'shree-venkatesh-injections': {
    badge: 'Injectables',
    themeColor: 'rose',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    iconClass: 'bg-rose-100 text-rose-600',
    borderHover: 'hover:border-rose-400 hover:shadow-rose-500/10',
    btnClass: 'bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white',
    tag: '100% Authentic Ampoules & Vials'
  },
  'shree-venkatesh-tablets': {
    badge: 'Oral Tablets',
    themeColor: 'teal',
    badgeClass: 'bg-teal-50 text-teal-700 border-teal-200',
    iconClass: 'bg-teal-100 text-teal-600',
    borderHover: 'hover:border-teal-400 hover:shadow-teal-500/10',
    btnClass: 'bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white',
    tag: 'Blister-Sealed Formulations'
  },
  'roger-pharma': {
    badge: 'European Standard',
    themeColor: 'sky',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    iconClass: 'bg-sky-100 text-sky-600',
    borderHover: 'hover:border-sky-400 hover:shadow-sky-500/10',
    btnClass: 'bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white',
    tag: 'Complete 84-Product Catalog'
  },
  '3rd-degree-injectable': {
    badge: 'Performance Injectables',
    themeColor: 'amber',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    iconClass: 'bg-amber-100 text-amber-700',
    borderHover: 'hover:border-amber-400 hover:shadow-amber-500/10',
    btnClass: 'bg-amber-50 text-amber-800 hover:bg-amber-600 hover:text-white',
    tag: 'Precision Dosed Solutions'
  },
  'pharmaqo-labs-hgh-peptides': {
    badge: 'Research Peptides',
    themeColor: 'purple',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    iconClass: 'bg-purple-100 text-purple-600',
    borderHover: 'hover:border-purple-400 hover:shadow-purple-500/10',
    btnClass: 'bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white',
    tag: 'Lyophilized Peptides & Somatropin'
  },
  'pharmaqo-labs-injectables': {
    badge: 'Anabolic Vials',
    themeColor: 'blue',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    iconClass: 'bg-blue-100 text-blue-600',
    borderHover: 'hover:border-blue-400 hover:shadow-blue-500/10',
    btnClass: 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white',
    tag: '10ml Concentrated Vials'
  },
  'infinity-pharma-injectables': {
    badge: 'Sterile Solutions',
    themeColor: 'emerald',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconClass: 'bg-emerald-100 text-emerald-600',
    borderHover: 'hover:border-emerald-400 hover:shadow-emerald-500/10',
    btnClass: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white',
    tag: 'Sterile Multi-Dose Injections'
  },
  'evolve-biolabs-anabolics': {
    badge: 'Full Anabolic Spectrum',
    themeColor: 'indigo',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    iconClass: 'bg-indigo-100 text-indigo-600',
    borderHover: 'hover:border-indigo-400 hover:shadow-indigo-500/10',
    btnClass: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white',
    tag: '54 Formulations Catalog'
  }
};

const defaultIconMap = {
  Syringe,
  Pill,
  Sparkles,
  Flame,
  Dna,
  Dumbbell,
  Zap,
  Layers
};

export default function FeaturedBrandsGrid({ 
  categories, 
  products = [], 
  onSelectCategory, 
  onSelectProduct,
  selectedCategory 
}) {
  const featuredCats = categories.filter(c => c.featured || brandConfigs[c.slug]).slice(0, 8);

  return (
    <section className="py-12 bg-slate-100/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Clean Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-brand-blue-light text-brand-blue px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-2">
              <Award className="w-3.5 h-3.5 text-brand-blue" />
              <span>Premier Brand Portfolios</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Brands & Exclusive Catalogs
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Direct B2B export access to verified pharmaceutical manufacturers, GMP certified batches, and authentic formulations.
            </p>
          </div>

          <button
            onClick={() => onSelectCategory('all')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-blue-dark bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs hover:shadow transition-all self-start sm:self-auto"
          >
            <span>View All {categories.length} Categories</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Clean, Bright 4-Column Grid with Authentic Product Image Previews */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredCats.map((cat) => {
            const config = brandConfigs[cat.slug] || {
              badge: 'Verified Brand',
              themeColor: 'blue',
              badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
              iconClass: 'bg-sky-100 text-sky-600',
              borderHover: 'hover:border-sky-400 hover:shadow-sky-500/10',
              btnClass: 'bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white',
              tag: 'Certified Formulation'
            };

            const IconComponent = defaultIconMap[cat.icon] || Pill;
            const isSelected = selectedCategory === cat.name;

            // Get top 2-3 actual products for preview
            const brandProducts = products
              .filter(p => p.category.toLowerCase() === cat.name.toLowerCase() || p.categorySlug === cat.slug)
              .slice(0, 2);

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.name)}
                className={`group bg-white rounded-2xl border transition-all duration-300 p-5 flex flex-col justify-between cursor-pointer shadow-subtle hover:shadow-card-hover ${
                  isSelected 
                    ? 'border-brand-blue ring-2 ring-brand-blue/30 shadow-md' 
                    : `border-slate-200/90 ${config.borderHover}`
                }`}
              >
                {/* Card Top: Icon & Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-xs transition-transform group-hover:scale-105 ${config.iconClass}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${config.badgeClass}`}>
                    {config.badge}
                  </span>
                </div>

                {/* Brand Name & Count */}
                <div className="mt-3.5 mb-3">
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-brand-blue transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                      {cat.count} Products
                    </span>
                    <span className="text-[11px] text-slate-400 truncate">
                      {config.tag}
                    </span>
                  </div>
                </div>

                {/* Product Image Preview Row (Clean White Background, Zero Cut-off) */}
                <div className="my-2 bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {brandProducts.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectProduct) onSelectProduct(prod);
                        }}
                        className="bg-white rounded-lg p-1.5 border border-slate-200/70 hover:border-brand-blue flex flex-col items-center justify-between transition-all group/prod hover:shadow-xs"
                        title={prod.name}
                      >
                        <div className="w-full h-16 sm:h-18 flex items-center justify-center overflow-hidden">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="max-h-full max-w-full object-contain group-hover/prod:scale-105 transition-transform duration-200"
                            loading="lazy"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 truncate w-full text-center mt-1 group-hover/prod:text-brand-blue">
                          {prod.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                  <span className={isSelected ? 'text-brand-blue' : 'text-slate-600 group-hover:text-slate-900'}>
                    {isSelected ? 'Viewing Catalog' : 'Browse Catalog'}
                  </span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1 ${
                    isSelected ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-brand-blue group-hover:text-white'
                  }`}>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
