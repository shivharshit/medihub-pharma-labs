import React, { useState, useEffect } from 'react';
import { 
  Eye, Radio, Globe2, Laptop, Smartphone, Tablet, 
  Search, RefreshCw, Filter, Download, ChevronRight, 
  Clock, ShieldAlert, Sparkles, Activity, CheckCircle2, 
  Layers, MapPin, X, ArrowUpRight, Cpu, Zap, Compass, Play
} from 'lucide-react';
import { fetchBillaSessions, fetchBillaVisitorJourney, pingBillaEyes, getCountryInfo } from '../services/billaEyesService';

export default function BillaEyesRadar() {
  const [sessions, setSessions] = useState([]);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [visitorJourney, setVisitorJourney] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRadar, setAutoRadar] = useState(true);
  const [isLoadingJourney, setIsLoadingJourney] = useState(false);

  useEffect(() => {
    loadRadarData(true);

    if (!autoRadar) return;
    const interval = setInterval(() => {
      loadRadarData(false);
    }, 3500);

    return () => clearInterval(interval);
  }, [autoRadar]);

  const loadRadarData = async (showSpinner = false) => {
    if (showSpinner) setIsRefreshing(true);
    try {
      const list = await fetchBillaSessions();
      setSessions(list);
      
      // Auto-select first visitor if none selected or if selected is no longer in list
      if (list.length > 0) {
        if (!selectedVisitor) {
          handleSelectVisitor(list[0]);
        } else {
          // Update selected visitor's live status
          const updatedSelected = list.find(s => s.visitor_id === selectedVisitor.visitor_id);
          if (updatedSelected) {
            setSelectedVisitor(prev => ({ ...prev, ...updatedSelected }));
          }
        }
      }
    } catch (e) {
      console.warn('Error loading BILLA sessions:', e);
    } finally {
      if (showSpinner) setIsRefreshing(false);
    }
  };

  const handleSelectVisitor = async (visitor) => {
    setSelectedVisitor(visitor);
    setIsLoadingJourney(true);
    try {
      const journey = await fetchBillaVisitorJourney(visitor.visitor_id);
      setVisitorJourney(journey);
    } catch (e) {
      console.warn('Error loading visitor journey:', e);
    } finally {
      setIsLoadingJourney(false);
    }
  };

  const handleTriggerTestPing = async () => {
    setIsRefreshing(true);
    await pingBillaEyes('Browsing Medihub Catalog (Admin Test Ping)', '/');
    await loadRadarData(true);
  };

  const activeOnlineCount = sessions.filter(s => s.is_online).length;

  // Extract unique countries dynamically from real sessions
  const availableCountries = Array.from(
    new Set(sessions.map(s => s.countryCode).filter(Boolean))
  ).map(code => ({
    code,
    ...getCountryInfo(code),
    count: sessions.filter(s => s.countryCode === code).length
  }));

  const filteredSessions = sessions.filter(s => {
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'online' && s.is_online) || 
      (statusFilter === 'offline' && !s.is_online) ||
      (s.countryCode?.toLowerCase() === statusFilter.toLowerCase());

    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      s.visitor_id.toLowerCase().includes(q) ||
      (s.country && s.country.toLowerCase().includes(q)) ||
      (s.city && s.city.toLowerCase().includes(q)) ||
      (s.current_page && s.current_page.toLowerCase().includes(q)) ||
      (s.current_action && s.current_action.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  const handleExportCsv = () => {
    if (sessions.length === 0) return;
    const headers = "Visitor ID,Status,Country,Country Code,City,Device,Browser,OS,Current Page,Current Action,Last Seen\n";
    const rows = sessions.map(s => 
      `"${s.visitor_id}","${s.is_online ? 'ONLINE' : 'IDLE'}","${s.country}","${s.countryCode}","${s.city}","${s.deviceType}","${s.browser}","${s.os}","${s.current_page}","${(s.current_action || '').replace(/"/g, '""')}","${s.last_ping_at}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BILLA_EYES_Real_Telemetry_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Just now';
    const diffSec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diffSec < 10) return 'Active just now';
    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    return `${Math.floor(diffSec / 3600)}h ago`;
  };

  return (
    <div className="space-y-6 font-sans">
      {/* High-Class Executive Hero Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/70 border border-cyan-500/30 rounded-3xl p-6 lg:p-8 relative overflow-hidden shadow-2xl shadow-cyan-950/40">
        {/* Subtle radar pulse glow in background */}
        <div className="absolute -right-10 -top-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-12 top-1/2 -translate-y-1/2 w-48 h-48 border border-cyan-500/20 rounded-full animate-ping pointer-events-none hidden lg:block" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-bold mb-3">
              <Eye className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>BILLA EYES™ REAL-TIME BUYER RADAR</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Executive Telemetry & Surveillance
            </h1>
            <p className="text-slate-300 text-xs mt-2 max-w-2xl leading-relaxed">
              100% genuine real-time visitor telemetry streaming directly from global client visits. Inspect live IP geolocation, active browsing routes, product engagement, and session trajectories.
            </p>
          </div>

          {/* Active Live Metric Counter */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="bg-slate-900/90 border border-cyan-500/40 p-4 lg:p-5 rounded-2xl flex items-center gap-4 backdrop-blur-md shadow-xl">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
                {activeOnlineCount > 0 && (
                  <>
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-ping" />
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
                  </>
                )}
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Live Online Now</div>
                <div className="text-2xl font-black text-white font-mono flex items-center gap-2">
                  <span>{activeOnlineCount}</span>
                  <span className="text-xs text-emerald-400 font-sans font-bold">Active Buyer{activeOnlineCount !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-4 lg:p-5 rounded-2xl flex flex-col justify-center backdrop-blur-md">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Recorded</div>
              <div className="text-2xl font-black text-cyan-300 font-mono">
                {sessions.length} <span className="text-xs text-slate-400 font-sans font-normal">Sessions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Strip & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center flex-wrap gap-2">
          {/* Base status filters */}
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Visitors ({sessions.length})
          </button>

          <button
            onClick={() => setStatusFilter('online')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              statusFilter === 'online'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-950 border border-slate-800 text-emerald-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Online ({activeOnlineCount})
          </button>

          {/* Dynamic country filter pills from real sessions */}
          {availableCountries.map(c => (
            <button
              key={c.code}
              onClick={() => setStatusFilter(c.code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                statusFilter.toLowerCase() === c.code.toLowerCase()
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.name}</span>
              <span className="text-[10px] opacity-70">({c.count})</span>
            </button>
          ))}
        </div>

        {/* Live Auto-Radar switch & Export */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          <button
            onClick={() => setAutoRadar(!autoRadar)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
              autoRadar
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
            title="Toggle Real-Time Radar Auto-Sync"
          >
            <Zap className={`w-3.5 h-3.5 ${autoRadar ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span>Auto-Radar: {autoRadar ? 'ON (3s)' : 'PAUSED'}</span>
          </button>

          <button
            onClick={() => loadRadarData(true)}
            disabled={isRefreshing}
            className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 transition-colors"
            title="Manual Radar Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <button
            onClick={handleExportCsv}
            disabled={sessions.length === 0}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Radar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Visitor List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search bar inside list */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search visitor ID, country, city, active drug or page..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Zero State: Pure Real Radar Awaiting Pings */}
          {filteredSessions.length === 0 && (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-10 text-center relative overflow-hidden">
              <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/20 mx-auto flex items-center justify-center text-cyan-400 mb-4 relative">
                <Compass className="w-10 h-10 animate-spin text-cyan-400" style={{ animationDuration: '8s' }} />
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping pointer-events-none" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">BILLA EYES™ Radar Active & Listening</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
                Awaiting incoming client connections. No fake placeholder data is displayed. Open <span className="text-cyan-400 font-mono">medihubpharmalabs.com</span> or test a live telemetry ping below to see real data populate.
              </p>
              <button
                onClick={handleTriggerTestPing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Simulate Live Client Ping</span>
              </button>
            </div>
          )}

          {/* Sessions List */}
          <div className="space-y-3">
            {filteredSessions.map((visitor) => {
              const isSelected = selectedVisitor?.visitor_id === visitor.visitor_id;
              return (
                <div
                  key={visitor.visitor_id}
                  onClick={() => handleSelectVisitor(visitor)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  {/* Active highlight pill */}
                  {isSelected && (
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-400 to-blue-500" />
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Flag and Status */}
                      <div className="relative">
                        <div className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xl shadow-inner">
                          {visitor.flag || '🌐'}
                        </div>
                        <span
                          className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                            visitor.is_online
                              ? 'bg-emerald-400 animate-pulse'
                              : 'bg-slate-500'
                          }`}
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white tracking-wide">
                            {visitor.visitor_id}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                              visitor.is_online
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {visitor.is_online ? 'Live Now' : 'Idle'}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="text-slate-200 font-semibold">{visitor.country}</span>
                          <span>•</span>
                          <span>{visitor.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Time ago */}
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatTimeAgo(visitor.last_ping_at)}
                      </span>
                    </div>
                  </div>

                  {/* Current Active Action */}
                  <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-cyan-300 font-medium truncate">
                      <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-pulse" />
                      <span className="truncate">{visitor.current_action || 'Browsing Catalog'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono shrink-0">
                      <span className="bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                        {visitor.deviceType}
                      </span>
                      <span className="bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                        {visitor.browser}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Visitor Deep Telemetry Inspector & Journey (5 cols) */}
        <div className="lg:col-span-5">
          {selectedVisitor ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sticky top-6 space-y-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl shadow-inner">
                    {selectedVisitor.flag || '🌐'}
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-semibold">Active Session Profile</div>
                    <div className="text-base font-bold text-white font-mono">{selectedVisitor.visitor_id}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      selectedVisitor.is_online
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedVisitor.is_online ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
                    {selectedVisitor.is_online ? 'Streaming' : 'Recorded'}
                  </span>
                </div>
              </div>

              {/* Hardware & Geolocation Diagnostics Matrix */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Country & Region</div>
                  <div className="text-slate-200 font-bold mt-0.5 flex items-center gap-1.5">
                    <span>{selectedVisitor.flag}</span>
                    <span className="truncate">{selectedVisitor.country}</span>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">City / Location</div>
                  <div className="text-slate-200 font-bold mt-0.5 truncate">{selectedVisitor.city || 'Direct Node'}</div>
                </div>

                <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Device & OS</div>
                  <div className="text-slate-200 font-semibold mt-0.5 truncate">
                    {selectedVisitor.os} ({selectedVisitor.deviceType})
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Browser & Display</div>
                  <div className="text-slate-200 font-semibold mt-0.5 truncate">
                    {selectedVisitor.browser} {selectedVisitor.screen ? `• ${selectedVisitor.screen}` : ''}
                  </div>
                </div>
              </div>

              {/* Active Route */}
              <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Live Active Path</div>
                <div className="text-xs text-cyan-300 font-mono break-all font-semibold">
                  {selectedVisitor.current_page || '/'}
                </div>
                <div className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{selectedVisitor.current_action || 'Browsing Storefront'}</span>
                </div>
              </div>

              {/* Step-by-Step Chronological Journey Replay */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Real Session Event Stream</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {visitorJourney.length} event{visitorJourney.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {isLoadingJourney ? (
                  <div className="text-center py-6 text-slate-400 text-xs flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>Loading real event timeline...</span>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {visitorJourney.map((evt, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl text-xs flex items-start gap-3 hover:border-slate-700 transition-colors"
                      >
                        <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0 shadow-sm shadow-cyan-400/50" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-slate-200 truncate">{evt.title}</span>
                            <span className="text-[10px] text-slate-500 font-mono shrink-0">{evt.time}</span>
                          </div>
                          {evt.detail && (
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{evt.detail}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 text-xs">
              <Eye className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <span>Select any live session on the left to inspect detailed telemetry diagnostics and timeline replay.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
