import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Pill, Dumbbell, Syringe, Flame, Zap, ShieldPlus, Dna, Activity, 
  ShieldCheck, Ribbon, HeartHandshake, Sparkles, Brain, HeartPulse, 
  ShieldAlert, Baby, Smile, Scissors, Bone, Stethoscope, Wind, 
  Heart, Gauge, BrainCircuit, Shield, Droplets, Apple, CheckCircle, 
  Sun, Layers, ChevronLeft, ChevronRight 
} from 'lucide-react';

const iconMap = {
  Pill, Dumbbell, Syringe, Flame, Zap, ShieldPlus, Dna, Activity,
  ShieldCheck, Ribbon, HeartHandshake, Sparkles, Brain, HeartPulse,
  ShieldAlert, Baby, Smile, Scissors, Bone, Stethoscope, Wind,
  Heart, Gauge, BrainCircuit, Shield, Droplets, Apple, CheckCircle,
  Sun
};

export default function CategoryBar({ categories, selectedCategory, onSelectCategory, totalProducts = 598 }) {
  const { t } = useTranslation();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-[73px] z-30 shadow-xs py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-2">
        
        {/* Left Arrow (Desktop) */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors flex-shrink-0 shadow-xs"
          title="Scroll Left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Pills Container */}
        <div ref={scrollRef} className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs">
          
          {/* All Categories Pill */}
          <button
            onClick={() => onSelectCategory('all')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-brand-blue text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t('nav.allCategories')}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {totalProducts}
            </span>
          </button>

          {/* Individual Category Pills */}
          {categories.map((cat) => {
            const IconComp = iconMap[cat.icon] || Pill;
            const isSelected = selectedCategory === cat.name;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.name)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  isSelected
                    ? 'bg-brand-blue text-white shadow-md font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-brand-blue'}`} />
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Arrow (Desktop) */}
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors flex-shrink-0 shadow-xs"
          title="Scroll Right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
