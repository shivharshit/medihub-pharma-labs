import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  return (
    <aside aria-label="WhatsApp Inquiry" className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Tooltip on hover */}
      <div className="hidden sm:block mr-3 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        Chat with Export Desk (Online 24/7)
      </div>

      {/* Action Button */}
      <a
        href="https://wa.me/918043812772?text=Hello%20Medihub%20Pharma%20Labs,%20I%20want%20to%20place%20an%20inquiry%20for%20pharmaceutical%20products."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Inquiry"
        className="relative flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl shadow-emerald-600/50 transition-transform transform hover:scale-110 active:scale-95"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 border-2 border-white rounded-full animate-ping"></span>
        <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 border-2 border-white rounded-full"></span>
      </a>
    </aside>
  );
}
