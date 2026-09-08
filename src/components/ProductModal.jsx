import React, { useState, useEffect } from 'react';
import { X, Check, MessageCircle, ShoppingBag, ShieldCheck, FileText, Package, AlertCircle, Sparkles, Building2 } from 'lucide-react';

export default function ProductModal({ product, onClose, onAddToRfq, isInRfq }) {
  const [quantity, setQuantity] = useState(100);
  const [isAdded, setIsAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToRfq(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Medihub Pharma Labs, I would like to request an export quotation for:\n\n*Product:* ${product.name}\n*Category:* ${product.category}\n*Strength/Dosage:* ${product.dosage || 'Standard'}\n*Estimated Order Quantity:* ${quantity} Units / Packs\n\nPlease provide wholesale quotation, delivery timeline, and COA availability.`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      
      {/* Modal Container */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
      >
        
        {/* Header Strip */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-brand-blue uppercase tracking-wider bg-brand-blue-light px-2.5 py-1 rounded-full">
              {product.category}
            </span>
            {product.dosage && (
              <span className="text-xs font-bold bg-slate-900 text-white px-2.5 py-1 rounded-full">
                {product.dosage}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Image Preview */}
            <div className="md:col-span-5 bg-gradient-to-b from-slate-50 to-slate-100/50 rounded-2xl border border-slate-200/80 p-6 flex items-center justify-center min-h-[260px] relative">
              <img
                src={imgError ? "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80" : product.image}
                alt={product.name}
                onError={() => setImgError(true)}
                className="max-h-56 max-w-full object-contain rounded-lg"
              />
              <span className="absolute bottom-2 right-2 text-[10px] text-slate-400 font-mono">
                Certified Formulation
              </span>
            </div>

            {/* Product Details & Specs */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {product.name}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Export SKU: <span className="font-mono text-slate-700 font-semibold">{product.id.toUpperCase()}</span>
                </p>
              </div>

              {/* Technical Specifications Table */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/70 space-y-2 text-xs">
                <div className="font-bold text-slate-800 pb-1 border-b border-slate-200 flex items-center justify-between">
                  <span>Product Specifications</span>
                  <span className="text-[10px] text-brand-green font-semibold">Export Ready</span>
                </div>

                <div className="grid grid-cols-2 gap-y-2 pt-1">
                  <div className="text-slate-500">Dosage Form:</div>
                  <div className="font-semibold text-slate-800">{product.form || 'Tablet'}</div>

                  {product.dosage && (
                    <>
                      <div className="text-slate-500">Strength:</div>
                      <div className="font-semibold text-slate-800">{product.dosage}</div>
                    </>
                  )}

                  {product.packaging && (
                    <>
                      <div className="text-slate-500">Packaging Type:</div>
                      <div className="font-semibold text-slate-800">{product.packaging}</div>
                    </>
                  )}

                  {Object.entries(product.specifications || {}).map(([key, val]) => {
                    if (['Form', 'Strength', 'Packaging Type', 'Packaging Size'].includes(key)) return null;
                    return (
                      <React.Fragment key={key}>
                        <div className="text-slate-500 truncate pr-2">{key}:</div>
                        <div className="font-semibold text-slate-800 break-words">{val}</div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Product Description */}
              {product.description && (
                <div className="text-xs text-slate-600 leading-relaxed bg-brand-blue-light/30 p-3.5 rounded-xl border border-brand-blue/20">
                  <strong className="text-brand-blue block mb-1">Export Formulation Details:</strong>
                  <p>{product.description}</p>
                </div>
              )}
            </div>

          </div>

          {/* Compliance & Export Guarantee Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-brand-green flex-shrink-0" />
              <span className="text-slate-700">100% WHO-GMP Sourced</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <FileText className="w-4 h-4 text-brand-blue flex-shrink-0" />
              <span className="text-slate-700">COA & Batch Testing Available</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <Building2 className="w-4 h-4 text-brand-blue flex-shrink-0" />
              <span className="text-slate-700">Customs Clearance Support</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-xs font-semibold text-slate-600">
              RFQ Quantity:
            </label>
            <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(10, q - 50))}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center text-xs font-bold text-slate-800 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 50)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
              >
                +
              </button>
            </div>
            <span className="text-xs text-slate-400">packs/vials</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleAdd}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all ${
                isInRfq || isAdded
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                  : 'bg-slate-800 hover:bg-slate-900 text-white'
              }`}
            >
              {isInRfq || isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to RFQ</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Inquiry List</span>
                </>
              )}
            </button>

            <a
              href={`https://wa.me/918043812772?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire via WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
