import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, Plus, Check, MessageCircle, Package, ShieldCheck, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductCard({ product, onSelectProduct, onAddToRfq, isInRfq }) {
  const { t, i18n } = useTranslation();
  const [imgError, setImgError] = useState(false);
  const [isAddedAnim, setIsAddedAnim] = useState(false);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const images = (product.images && product.images.length > 0) 
    ? product.images 
    : [product.image];

  // Fallback image generator based on category
  const fallbackImg = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80";

  const handlePrevImg = (e) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImg = (e) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (e, idx) => {
    e.stopPropagation();
    setActiveImgIdx(idx);
  };

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

  const getLocalizedWaMessage = () => {
    const lang = (i18n.language || 'en').slice(0, 2);
    if (lang === 'es') {
      return `Hola Medihub Pharma Labs, estoy interesado en el producto: ${encodeURIComponent(product.name)} (${encodeURIComponent(product.dosage || '')}). Por favor proporcione cotización de exportación y MOQ.`;
    }
    if (lang === 'de') {
      return `Hallo Medihub Pharma Labs, ich interessiere mich für das Produkt: ${encodeURIComponent(product.name)} (${encodeURIComponent(product.dosage || '')}). Bitte senden Sie mir ein Export-Angebot und Mindestbestellmengen (MOQ).`;
    }
    return `Hello Medihub Pharma Labs, I am interested in product: ${encodeURIComponent(product.name)} (${encodeURIComponent(product.dosage || '')}). Please provide export quotation and MOQ.`;
  };

  const currentImage = images[activeImgIdx] || product.image;

  return (
    <div 
      onClick={() => onSelectProduct(product)}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-brand-blue/50 shadow-subtle hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Top Badges & Indicators */}
      <div className="p-3 pb-0 flex items-center justify-between gap-1 z-10">
        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getFormColor(product.form)}`}>
          {product.form || t('productCard.tablets')}
        </span>

        {product.dosage && (
          <span className="text-[11px] font-bold bg-slate-900 text-white px-2.5 py-0.5 rounded-full">
            {product.dosage}
          </span>
        )}
      </div>

      {/* Image Container with Carousel */}
      <div className="relative w-full h-52 sm:h-56 bg-white flex items-center justify-center p-2.5 sm:p-3 overflow-hidden">
        <img
          key={currentImage}
          src={imgError ? fallbackImg : currentImage}
          alt={`${product.name} - image ${activeImgIdx + 1}`}
          onError={() => setImgError(true)}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-all duration-300 drop-shadow-xs"
          loading="lazy"
        />

        {/* Carousel Prev/Next Buttons if product has multiple images */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImg}
              aria-label="Previous Image"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow-md text-slate-700 hover:text-brand-blue hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextImg}
              aria-label="Next Image"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 shadow-md text-slate-700 hover:text-brand-blue hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dots indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-slate-900/40 px-2 py-1 rounded-full backdrop-blur-xs">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => handleDotClick(e, idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === activeImgIdx ? 'bg-white w-3 scale-110' : 'bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-brand-blue" />
            {t('productCard.viewDetails')}
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
                <span>{t('productCard.addedToRfq')}</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>{t('productCard.addToRfq')}</span>
              </>
            )}
          </button>

          {/* WhatsApp Direct Quote */}
          <a
            href={`https://wa.me/919244200415?text=${getLocalizedWaMessage()}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{t('productCard.quote')}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
