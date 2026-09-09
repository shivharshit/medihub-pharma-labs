import React, { useState, useEffect } from 'react';
import { 
  Eye, Radio, Globe2, Laptop, Smartphone, Tablet, 
  Search, RefreshCw, Filter, Download, ChevronRight, 
  Clock, ShieldAlert, Sparkles, Activity, CheckCircle2, 
  Layers, MapPin, X, ArrowUpRight, Cpu, Zap, Compass, Play,
  Calendar, BarChart3, Database, Shield, ArrowRight
} from 'lucide-react';
import { 
  fetchBillaSessions, 
  fetchBillaVisitorJourney, 
  pingBillaEyes, 
  getCountryInfo, 
  filterSessionsByTimeRange 
} from '../services/billaEyesService';
import WorldRadarMap from '../components/WorldRadarMap';

export default function BillaEyesRadar() {
  const [allSessions, setAllSessions] = useState([]);
  const [timeRange, setTimeRange] = useState('live');
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [visitorJourney, setVisitorJourney] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRadar, setAutoRadar] = useState(true);
  const [isLoadingJourney, setIsLoadingJourney] = useState(false);
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'table'

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
      setAllSessions(list);
      
      if (list.length > 0) {
        if (!selectedVisitor) {
          handleSelectVisitor(list[0]);
        } else {
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

  // Filter sessions by Time-Range first
  const timeFilteredSessions = filterSessionsByTimeRange(allSessions, timeRange);

  // Active online count across all sessions
  const activeOnlineCount = allSessions.filter(s => s.is_online).length;

  // Extract unique countries dynamically from time-filtered sessions
  const availableCountries = Array.from(
    new Set(timeFilteredSessions.map(s => s.countryCode).filter(Boolean))
  ).map(code => ({
    code,
    ...getCountryInfo(code),
    count: timeFilteredSessions.filter(s => s.countryCode === code).length
  }));

  // Apply search query and country status filter
  const finalFilteredSessions = timeFilteredSessions.filter(s => {
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
    if (finalFilteredSessions.length === 0) return;
    const headers = "Visitor ID,Status,Time Range,Country,Country Code,City,Device,Browser,OS,Current Page,Current Action,Last Seen\n";
    const rows = finalFilteredSessions.map(s => 
      `"${s.visitor_id}","${s.is_online ? 'ONLINE' : 'IDLE'}","${timeRange}","${s.country}","${s.countryCode}","${s.city}","${s.deviceType}","${s.browser}","${s.os}","${s.current_page}","${(s.current_action || '').replace(/"/g, '""')}","${s.last_ping_at}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BILLA_EYES_Data_${timeRange}_${new Date().toISOString().slice(0, 10)}.csv`;
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
      {/* Top Hero Command Header with Cinematic BILLA EYES Imagery */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-slate-950 shadow-2xl shadow-amber-950/20">
        {/* Background Image with Gradient Blending */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/billa-eyes-banner.jpg" 
            alt="BILLA EYES Omniscient Surveillance" 
            className="w-full h-full object-cover object-right md:object-center opacity-80 filter brightness-95 contrast-125"
          />
          {/* Multi-layer Gradient Fades for perfect text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 md:via-slate-950/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 backdrop-blur-[1px]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/15 border border-amber-500/40 rounded-full text-amber-300 text-xs font-bold mb-3 shadow-lg shadow-amber-500/10">
              <Eye className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="tracking-wider uppercase font-mono">BILLA EYES™ OMNISCIENT RADAR</span>
            </div>
            <h1 className="text-2xl lg:text-4xl font-black text-white tracking-tight leading-tight flex items-center gap-3 drop-shadow-md">
              Global Buyer Surveillance & Telemetry
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-2 max-w-xl leading-relaxed drop-shadow">
              Omniscient real-time buyer intelligence. Tracking international buyers with live satellite laser arcs, hardware diagnostics, and step-by-step session trajectory replay.
            </p>
          </div>

          {/* Quick Stats Block with Amber/Cyan Glow */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-950/80 border border-amber-500/40 p-4 rounded-2xl flex items-center gap-3.5 backdrop-blur-md shadow-xl shadow-amber-950/30">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                {activeOnlineCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full animate-ping" />
                )}
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-amber-400/80 tracking-wider">Live Active</div>
                <div className="text-2xl font-black text-white font-mono">{activeOnlineCount} Online</div>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex flex-col justify-center backdrop-blur-md">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Range Sessions</div>
              <div className="text-2xl font-black text-cyan-300 font-mono">
                {timeFilteredSessions.length} <span className="text-xs text-slate-400 font-sans font-normal">Records</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time-Range Filters & View Switcher Strip */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Time Selector Tabs */}
        <div className="flex items-center flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {[
            { id: 'live', label: '🟢 Live Radar', badge: `${activeOnlineCount}` },
            { id: 'today', label: 'Today' },
            { id: 'yesterday', label: 'Yesterday' },
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' },
            { id: '90d', label: 'Last 90 Days' },
            { id: 'all', label: 'All Time' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setTimeRange(tab.id);
                setStatusFilter('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                timeRange === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[10px] rounded-full font-mono font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Action Buttons & View Mode */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'map' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>World Radar Map</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'table' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Deep Data Table</span>
            </button>
          </div>

          <button
            onClick={() => setAutoRadar(!autoRadar)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              autoRadar
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
            title="Toggle Live Radar Auto-Sync"
          >
            <Zap className={`w-3.5 h-3.5 ${autoRadar ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span>{autoRadar ? 'Syncing (3s)' : 'Paused'}</span>
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
            disabled={finalFilteredSessions.length === 0}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 1. Animated World Radar Map View */}
      {viewMode === 'map' && (
        <div className="space-y-4">
          <WorldRadarMap
            sessions={timeFilteredSessions}
            selectedVisitor={selectedVisitor}
            onSelectVisitor={handleSelectVisitor}
          />
        </div>
      )}

      {/* Dynamic Country Filter Pills */}
      {availableCountries.length > 0 && (
        <div className="flex items-center flex-wrap gap-2 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Active Territories ({availableCountries.length}):
          </span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-950 border border-slate-800 text-slate-300'
            }`}
          >
            All ({timeFilteredSessions.length})
          </button>
          {availableCountries.map(c => (
            <button
              key={c.code}
              onClick={() => setStatusFilter(c.code)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
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
      )}

      {/* 2. Main Radar Layout: Visitor Stream & Selected Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visitor List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search bar */}
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

          {/* Zero State if empty */}
          {finalFilteredSessions.length === 0 && (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-10 text-center relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 mx-auto flex items-center justify-center text-cyan-400 mb-3 relative">
                <Compass className="w-8 h-8 animate-spin text-cyan-400" style={{ animationDuration: '8s' }} />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                No Visitor Records for "{timeRange.toUpperCase()}"
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-5 leading-relaxed">
                As real visitors access <span className="text-cyan-400 font-mono">medihubpharmalabs.com</span>, laser beams and visitor trajectories will stream automatically.
              </p>
              <button
                onClick={handleTriggerTestPing}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Simulate Live Client Telemetry Ping</span>
              </button>
            </div>
          )}

          {/* Sessions List */}
          <div className="space-y-3">
            {finalFilteredSessions.map((visitor) => {
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
                  {isSelected && (
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-400 to-blue-500" />
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
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
                            {visitor.is_online ? 'Live Now' : 'Recorded'}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="text-slate-200 font-semibold">{visitor.country}</span>
                          <span>•</span>
                          <span>{visitor.city}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatTimeAgo(visitor.last_ping_at)}
                      </span>
                    </div>
                  </div>

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
                    <div className="text-xs text-slate-400 uppercase font-semibold">Session Profile</div>
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

              {/* Hardware & Geolocation Diagnostics */}
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
              <span>Select any live session on the left or click a map pin to inspect detailed telemetry diagnostics and timeline replay.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
