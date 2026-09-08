import React, { useState } from 'react';
import { X, Trash2, MessageCircle, Mail, Send, ShoppingBag, Globe, Building2, User, Phone, CheckCircle } from 'lucide-react';

export default function RfqCartModal({ isOpen, onClose, rfqItems, onUpdateQuantity, onRemoveItem, onClearRfq }) {
  const [buyerInfo, setBuyerInfo] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    country: '',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const totalItemsCount = rfqItems.reduce((acc, item) => acc + item.quantity, 0);

  const formatRfqMessage = () => {
    let msg = `*MEDIHUB PHARMA LABS - B2B EXPORT INQUIRY / RFQ*\n`;
    msg += `-------------------------------------------\n`;
    if (buyerInfo.companyName) msg += `*Company:* ${buyerInfo.companyName}\n`;
    if (buyerInfo.contactPerson) msg += `*Contact Person:* ${buyerInfo.contactPerson}\n`;
    if (buyerInfo.country) msg += `*Destination Country:* ${buyerInfo.country}\n`;
    if (buyerInfo.phone) msg += `*Phone/WhatsApp:* ${buyerInfo.phone}\n`;
    if (buyerInfo.email) msg += `*Email:* ${buyerInfo.email}\n`;
    msg += `-------------------------------------------\n`;
    msg += `*REQUESTED PRODUCTS LIST (${rfqItems.length} items):*\n\n`;

    rfqItems.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.name}*\n`;
      msg += `   - Category: ${item.category}\n`;
      if (item.dosage) msg += `   - Dosage: ${item.dosage}\n`;
      msg += `   - Requested Quantity: ${item.quantity} Packs/Vials\n\n`;
    });

    if (buyerInfo.notes) {
      msg += `*Additional Instructions / Requirements:*\n${buyerInfo.notes}\n\n`;
    }

    msg += `Please provide proforma quotation, delivery timeline, and Certificate of Analysis (COA).`;
    return msg;
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(formatRfqMessage());
    window.open(`https://wa.me/919244200415?text=${text}`, '_blank');
    setSubmitted(true);
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`B2B Export Quotation Request - ${buyerInfo.companyName || 'International Buyer'} (${buyerInfo.country || 'Global'})`);
    const body = encodeURIComponent(formatRfqMessage());
    window.location.href = `mailto:medihubpharmaceutical@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/70 backdrop-blur-sm flex justify-end animate-fadeIn">
      
      {/* Drawer Container */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col justify-between overflow-hidden"
      >
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-blue text-white rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Request For Quotation (RFQ)</h2>
              <p className="text-xs text-slate-500">
                {rfqItems.length} unique formulation{rfqItems.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Items List & Buyer Details */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {rfqItems.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">Your Inquiry List is empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Browse our 337+ pharmaceutical products and click "Add to RFQ" to build your custom export quote.
              </p>
            </div>
          ) : (
            <>
              {/* Product Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>Selected Formulations</span>
                  <button
                    onClick={onClearRfq}
                    className="text-rose-500 hover:text-rose-700 normal-case font-medium"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-2.5">
                  {rfqItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-800 truncate">{item.name}</div>
                        <div className="text-slate-500 text-[11px] truncate">{item.category} {item.dosage && `• ${item.dosage}`}</div>
                      </div>

                      {/* Quantity Modifier */}
                      <div className="flex items-center border border-slate-300 rounded-lg bg-white shadow-xs">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, Math.max(10, item.quantity - 50))}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-bold text-slate-800 text-xs">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 50)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buyer Contact Form */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  International Buyer & Shipping Info (Optional)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Company / Pharmacy Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Global Pharma Ltd."
                      value={buyerInfo.companyName}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, companyName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Destination Country</label>
                    <input
                      type="text"
                      placeholder="e.g. United Kingdom, USA, UAE"
                      value={buyerInfo.country}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, country: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Contact Person</label>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={buyerInfo.contactPerson}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, contactPerson: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">WhatsApp / Phone</label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={buyerInfo.phone}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-medium mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="buyer@domain.com"
                      value={buyerInfo.email}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, email: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 font-medium mb-1">Special Packaging or Delivery Instructions</label>
                    <textarea
                      rows={2}
                      placeholder="Need COA, temperature control, express air cargo, etc."
                      value={buyerInfo.notes}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, notes: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue text-xs"
                    ></textarea>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Drawer Footer Actions */}
        {rfqItems.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Total Formulations:</span>
              <span className="text-brand-blue font-bold">{rfqItems.length} Products ({totalItemsCount} Total Units)</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleSendWhatsApp}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Submit via WhatsApp</span>
              </button>

              <button
                onClick={handleSendEmail}
                className="flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blue-dark text-white py-3 px-4 rounded-xl font-bold text-xs shadow-md shadow-brand-blue/20 transition-all transform hover:-translate-y-0.5"
              >
                <Mail className="w-4 h-4" />
                <span>Submit via Email</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-400 text-center">
              Our export desk will review your list and respond with pricing & COA within 2 hours.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
