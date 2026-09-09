import React, { useState, useEffect } from 'react';
import { 
  Eye, Radio, Globe2, Laptop, Smartphone, Tablet, 
  Search, RefreshCw, Filter, Download, ChevronRight, 
  Clock, ShieldAlert, Sparkles, Activity, CheckCircle2, 
  Layers, MapPin, X, ArrowUpRight, Cpu
} from 'lucide-react';
import { fetchBillaSessions, fetchBillaVisitorJourney } from '../services/billaEyesService';

export default function BillaEyesRadar() {
  const [sessions, setSessions] = useState([]);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [visitorJourney, setVisitorJourney] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRadar, setAutoRadar] = useState(true);

  useEffect(() => {
    loadRadarData();

    if (!autoRadar) return;
    const interval = setInterval(() => {
      loadRadarData(false);
    }, 4000);

    return () => clearInterval(interval);
  }, [autoRadar]);

  const loadRadarData = async (showSpinner = true) => {
    if (showSpinner) setIsRefreshing(true);
    try {
      const list = await fetchBillaSessions();
      setSessions(list);
      if (list.length > 0 && !selectedVisitor) {
        handleSelectVisitor(list[0]);
      }
    } catch (e) {
      console.warn('Error loading BILLA sessions:', e);
    } finally {
      if (showSpinner) setIsRefreshing(false);
    }
  };

  const handleSelectVisitor = async (visitor) => {
    setSelectedVisitor(visitor);
    const journey = await fetchBillaVisitorJourney(visitor.visitor_id);
    setVisitorJourney(journey);
  };

  const activeOnlineCount = sessions.filter(s => s.is_online).length;

  const filteredSessions = sessions.filter(s => {
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'online' && s.is_online) || 
      (statusFilter === 'offline' && !s.is_online) ||
      (s.countryCode?.toLowerCase() === statusFilter.toLowerCase());

    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      s.visitor_id.toLowerCase().includes(q) ||
      s.country.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      (s.current_action && s.current_action.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  const handleExportCsv = () => {
    const headers = "Visitor ID,Status,Country,City,Device,Current Page,Current Action,Last Ping\n";
    const rows = sessions.map(s => 
      `"${s.visitor_id}","${s.is_online ? 'ONLINE' : 'IDLE'}","${s.country}","${s.city}","${s.deviceType}","${s.current_page}","${s.current_action}","${s.last_ping_at}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BILLA_EYES_Telemetry_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* BILLA EYES Hero Radar Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/80 border border-cyan-500/30 rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-cyan-500/5">
        {/* Animated Radar Pulse Effect */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 w-64 h-64 border border-cyan-500/20 rounded-full animate-ping pointer-events-none" />
        <div className="absolute right-16 top-1/2 -translate-y-1/2 w-48 h-48 border border-emerald-500/30 rounded-full animate-pulse pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-bold mb-3 shadow-sm">
              <Eye className="w-4 h-4 animate-pulse text-cyan-400" />
              <span>BILLA EYES™ LIVE VISITOR RADAR</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Real-Time Buyer Surveillance & Telemetry
            </h1>
            <p className="text-slate-300 text-xs mt-2 max-w-2xl leading-relaxed">
              Tracking every active international pharmaceutical buyer on the website. Live location, device diagnostics, live page view, and complete session replay.
            </p>
          </div>

          {/* Active Live Counter Card */}
          <div className="bg-slate-900/90 border border-cyan-500/40 p-5 rounded-2xl flex items-center gap-5 shrink-0 backdrop-blur-md shadow-xl">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Live Online Now</div>
              <div className="text-2xl font-black text-white font-mono flex items-center gap-2">
                <span>{activeOnlineCount}</span>
                <span className="text-xs text-emerald-400 font-sans font-bold">Active Buyers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Strip & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center flex-wrap gap-2">
          {/* Quick country / status filters */}
          {[
            { id: 'all', label: `All Visitors (${sessions.length})` },
            { id: 'online', label: `🟢 Online (${activeOnlineCount})` },
            { id: 'DE', label: '🇩🇪 Germany' },
            { id: 'US', label: '🇺🇸 USA' },
            { id: 'GB', label: '🇬🇧 UK' },
            { id: 'AE', label: '🇦🇪 UAE' },
            { id: 'ES', label: '🇪🇸 Spain' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === tab.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-auto">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Visitor ID, country, or action..."
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 w-64"
            />
          </div>

          <button
            onClick={handleExportCsv}
            className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
            title="Export Surveillance Logs"
          >
            <Download className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Main Split Interface: Active Visitors on Left, Deep Journey Replay on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Visitor Cards (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col">
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Active Target Feed ({filteredSessions.length})</span>
            </div>
            <span>Status & Action</span>
          </div>

          <div className="divide-y divide-slate-800/80 max-h-[680px] overflow-y-auto">
            {filteredSessions.length === 0 ? (
              <div className="p-16 text-center text-slate-500 text-xs">
                No active visitors match your filter criteria.
              </div>
            ) : (
              filteredSessions.map((visitor) => {
                const isSelected = selectedVisitor?.visitor_id === visitor.visitor_id;

                return (
                  <div
                    key={visitor.visitor_id}
                    onClick={() => handleSelectVisitor(visitor)}
                    className={`p-4.5 cursor-pointer transition-all flex items-start justify-between gap-4 ${
                      isSelected
                        ? 'bg-slate-800/90 border-l-4 border-cyan-400 pl-3.5 shadow-inner'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl leading-none">{visitor.flag || '🌐'}</span>
                        <span className="font-mono text-xs font-bold text-cyan-400 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                          {visitor.visitor_id}
                        </span>
                        <span className="text-xs text-slate-300 font-semibold truncate">
                          {visitor.city}, {visitor.country}
                        </span>
                      </div>

                      {/* Live Action */}
                      <div className="text-xs text-slate-200 font-medium flex items-center gap-1.5 pt-0.5">
                        <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{visitor.current_action || 'Browsing Storefront'}</span>
                      </div>

                      {/* Device & Location Meta */}
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-0.5 font-mono">
                        <span>{visitor.deviceType}</span>
                        <span>•</span>
                        <span>{visitor.browser}</span>
                        <span>•</span>
                        <span>{visitor.current_page}</span>
                      </div>
                    </div>

                    {/* Status & Timing */}
                    <div className="text-right shrink-0 space-y-1">
                      {visitor.is_online ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          ONLINE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400">
                          IDLE
                        </span>
                      )}
                      <div className="text-[10px] text-slate-500 font-mono">
                        {new Date(visitor.last_ping_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Deep Session Replay & Timeline (5 cols) */}
        <div className="lg:col-span-5">
          {selectedVisitor ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 sticky top-20">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedVisitor.flag || '🌐'}</span>
                    <div>
                      <h2 className="text-sm font-bold text-white font-mono">{selectedVisitor.visitor_id}</h2>
                      <p className="text-xs text-slate-400">{selectedVisitor.city}, {selectedVisitor.country}</p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {selectedVisitor.is_online ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      LIVE NOW
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">Inactive</span>
                  )}
                </div>
              </div>

              {/* Hardware & Diagnostic Specs */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Hardware:</span>
                  <span className="text-white font-mono">{selectedVisitor.deviceType}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Browser / OS:</span>
                  <span className="text-cyan-400 font-mono">{selectedVisitor.browser} ({selectedVisitor.os})</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Screen Resolution:</span>
                  <span className="text-slate-300 font-mono">{selectedVisitor.screen || '1920x1080'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Active URL:</span>
                  <span className="text-emerald-400 font-mono truncate max-w-[200px]">{selectedVisitor.current_page}</span>
                </div>
              </div>

              {/* Step-by-Step Chronological Journey Timeline */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Session Journey Timeline</span>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {visitorJourney.map((step, idx) => (
                    <div key={idx} className="relative pl-6 pb-2 border-l-2 border-slate-800 last:border-transparent">
                      <div className="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-cyan-500 border-2 border-slate-900" />
                      <div className="text-[10px] font-mono text-cyan-400 font-bold">{step.time}</div>
                      <div className="text-xs font-bold text-slate-200 mt-0.5">{step.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{step.detail}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Outreach CTA */}
              <div className="pt-2 border-t border-slate-800">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Buyer Territory: <strong>{selectedVisitor.country}</strong></span>
                  <span className="text-cyan-400 font-bold font-mono">BILLA EYES Protected</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 text-xs">
              Select a visitor from the radar list to view their step-by-step session journey.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
