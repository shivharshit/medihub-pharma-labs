import React, { useState } from 'react';
import { Eye, Plus, Check, MessageCircle, Package, ShieldCheck, Zap } from 'lucide-react';

export default function ProductCard({ product, onSelectProduct, onAddToRfq, isInRfq }) {
  const [imgError, setImgError] = useState(false);
  const [isAddedAnim, setIsAddedAnim] = useState(false);

  // Fallback image generator based on category
  const fallbackImg = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80";

  const handleAddClick = (e) => {
    e.stopPropagation();
    onAddToRfq(product);
    setIsAddedAnim(true);
    setTimeout(() => setIsAddedAnim(false), 1500);
  };

  const getFormColor = (form) => {
    const f = (form || '').toLowerCase();
    if (f.includes('injection') || f.includes('vial')) return 'bg-amber-100 text-amber-800 border-amber-200';
    if (f.includes('capsule')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (f.includes('peptide')) return 'bg-rose-100 text-rose-800 border-rose-200';
    if (f.includes('jelly') || f.includes('gel')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (f.includes('spray') || f.includes('inhaler')) return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    return 'bg-sky-100 text-sky-800 border-sky-200';
  };

  return (
    <div 
      onClick={() => onSelectProduct(product)}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-brand-blue/50 shadow-subtle hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Top Badges & Indicators */}
      <div className="p-3 pb-0 flex items-center justify-between gap-1 z-10">
        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getFormColor(product.form)}`}>
          {product.form || 'Tablet'}
        </span>

        {product.dosage && (
          <span className="text-[11px] font-bold bg-slate-900 text-white px-2.5 py-0.5 rounded-full">
            {product.dosage}
          </span>
        )}
      </div>

      {/* Image Container */}
      <div className="relative w-full h-52 sm:h-56 bg-white flex items-center justify-center p-2.5 sm:p-3 overflow-hidden">
        <img
          src={imgError ? fallbackImg : product.image}
          alt={product.name}
          onError={() => setImgError(true)}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
          loading="lazy"
        />

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/95 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-brand-blue" />
            Quick View Specs
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category Tag */}
          <p className="text-[11px] font-medium text-brand-blue uppercase tracking-wider line-clamp-1">
            {product.category}
          </p>

          {/* Product Name */}
          <h3 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-brand-blue transition-colors line-clamp-2 mt-1 leading-snug">
            {product.name}
          </h3>

          {/* Packaging / Specs Info */}
          {product.packaging && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
              <Package className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{product.packaging}</span>
            </div>
          )}

          {/* Active Composition or Strength if available */}
          {product.specifications?.Composition && (
            <div className="text-[11px] text-slate-600 bg-slate-50 rounded-lg p-2 mt-2 border border-slate-100 line-clamp-1">
              <strong className="text-slate-700">Active: </strong> {product.specifications.Composition}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
          {/* Add to RFQ Button */}
          <button
            type="button"
            onClick={handleAddClick}
            className={`flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all ${
              isInRfq || isAddedAnim
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                : 'bg-slate-100 hover:bg-brand-blue hover:text-white text-slate-700'
            }`}
          >
            {isInRfq || isAddedAnim ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>In RFQ</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to RFQ</span>
              </>
            )}
          </button>

          {/* WhatsApp Direct Quote */}
          <a
            href={`https://wa.me/917587970797?text=Hello%20Medihub%20Pharma%20Labs,%20I%20am%20interested%20in%20product:%20${encodeURIComponent(product.name)}%20(${encodeURIComponent(product.dosage || '')}).%20Please%20provide%20export%20quotation%20and%20MOQ.`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Quote</span>
          </a>
        </div>
      </div>
    </div>
  );
}
