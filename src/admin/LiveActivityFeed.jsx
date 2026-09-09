import React, { useState, useEffect } from 'react';
import { 
  Activity, Radio, Globe, Search, ShoppingBag, MessageSquare, 
  RefreshCw, Smartphone, Laptop, Sparkles, Clock, ArrowUpRight, Compass
} from 'lucide-react';
import { fetchRecentEvents } from '../services/analyticsService';

const EVENT_TYPE_MAP = {
  rfq_submitted: { label: 'RFQ Commercial Inquiry', icon: ShoppingBag, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  whatsapp_click: { label: 'WhatsApp Outreach Initiated', icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  language_change: { label: 'Language Locale Switched', icon: Globe, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  search: { label: 'Drug Catalog Search', icon: Search, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  product_view: { label: 'Product Specifications Viewed', icon: Sparkles, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  page_view: { label: 'Page Impression', icon: Activity, color: 'text-slate-400', bg: 'bg-slate-500/10' }
};

export default function LiveActivityFeed() {
  const [events, setEvents] = useState([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    loadEvents();
    if (!isLive) return;

    // Auto update feed every 4 seconds
    const interval = setInterval(() => {
      loadEvents();
    }, 4000);

    return () => clearInterval(interval);
  }, [isLive]);

  const loadEvents = () => {
    const list = fetchRecentEvents();
    setEvents(list);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Real-time Stream Telemetry</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Live Buyer Activity & Event Stream
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Watch real-time actions, RFQ generation, and searches as international buyers browse the Medihub catalog.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              isLive 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isLive ? 'animate-pulse text-emerald-400' : ''}`} />
            <span>{isLive ? 'Live Stream On' : 'Live Paused'}</span>
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span>Recent Activity Events ({events.length})</span>
          <span>Device & Timestamp</span>
        </div>

        {events.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <Compass className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <span>No activity events recorded yet. Actions taken on the storefront will stream here automatically.</span>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80 max-h-[700px] overflow-y-auto">
            {events.map((evt) => {
              const meta = EVENT_TYPE_MAP[evt.event_type] || EVENT_TYPE_MAP.page_view;
              const Icon = meta.icon;
              const dataStr = evt.event_data 
                ? Object.entries(evt.event_data).map(([k, v]) => `${k}: ${v}`).join(' | ') 
                : 'General event';

              return (
                <div key={evt.id} className="p-4 hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-10 h-10 rounded-2xl ${meta.bg} ${meta.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{meta.label}</span>
                        <span className="text-[10px] bg-slate-800 text-cyan-400 px-2 py-0.5 rounded-full font-mono uppercase font-bold">
                          {evt.language || 'en'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                        {dataStr}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[11px] font-semibold text-slate-300 flex items-center justify-end gap-1.5">
                      {evt.device_type === 'Mobile' ? <Smartphone className="w-3.5 h-3.5 text-slate-400" /> : <Laptop className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{evt.device_type}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 font-mono">
                      {new Date(evt.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
