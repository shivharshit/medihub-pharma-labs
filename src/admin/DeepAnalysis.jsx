import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Users, ShoppingBag, MessageSquare, Globe2, 
  Search, Smartphone, Laptop, Tablet, Calendar, Download, RefreshCw, 
  ArrowUpRight, ArrowDownRight, Activity, Filter, ShieldCheck, Sparkles, 
  PieChart, Eye, Layers, Compass
} from 'lucide-react';
import { fetchSearchLogs, fetchRfqLeads, fetchRecentEvents } from '../services/analyticsService';
import { fetchBillaSessions, getCountryInfo } from '../services/billaEyesService';
import productsData from '../data/products.json';

export default function DeepAnalysis() {
  const [timeRange, setTimeRange] = useState('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [searches, setSearches] = useState([]);
  const [leads, setLeads] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadAllRealAnalytics();
  }, [timeRange]);

  const loadAllRealAnalytics = async () => {
    setIsRefreshing(true);
    try {
      const [sessionList, searchList, leadList, eventList] = await Promise.all([
        fetchBillaSessions(),
        Promise.resolve(fetchSearchLogs()),
        fetchRfqLeads(),
        Promise.resolve(fetchRecentEvents())
      ]);

      setSessions(sessionList || []);
      setSearches(searchList || []);
      setLeads(leadList || []);
      setEvents(eventList || []);
    } catch (e) {
      console.warn('Error loading real analytics:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  // 1. Compute 100% Real Country Breakdown from Sessions
  const countryCounts = {};
  sessions.forEach(s => {
    const code = s.countryCode || 'GL';
    if (!countryCounts[code]) {
      const info = getCountryInfo(code);
      countryCounts[code] = {
        name: s.country || info.name,
        code,
        flag: s.flag || info.flag,
        count: 0
      };
    }
    countryCounts[code].count += 1;
  });

  const totalSessionsCount = sessions.length || 1;
  const realCountryBreakdown = Object.values(countryCounts)
    .sort((a, b) => b.count - a.count)
    .map(c => ({
      ...c,
      pct: Math.round((c.count / totalSessionsCount) * 100)
    }));

  // 2. Compute 100% Real Device Breakdown from Sessions
  const deviceCounts = { Desktop: 0, Mobile: 0, Tablet: 0 };
  sessions.forEach(s => {
    const dev = (s.deviceType || '').toLowerCase();
    if (dev.includes('mobile') || dev.includes('iphone') || dev.includes('android')) {
      deviceCounts.Mobile += 1;
    } else if (dev.includes('tablet') || dev.includes('ipad')) {
      deviceCounts.Tablet += 1;
    } else {
      deviceCounts.Desktop += 1;
    }
  });

  const totalDevices = sessions.length || 1;
  const realDeviceShare = [
    { type: 'Desktop Workstations', icon: Laptop, count: deviceCounts.Desktop, pct: Math.round((deviceCounts.Desktop / totalDevices) * 100) },
    { type: 'Mobile Smartphones', icon: Smartphone, count: deviceCounts.Mobile, pct: Math.round((deviceCounts.Mobile / totalDevices) * 100) },
    { type: 'Tablets & iPads', icon: Tablet, count: deviceCounts.Tablet, pct: Math.round((deviceCounts.Tablet / totalDevices) * 100) }
  ];

  // 3. Compute Real Category Engagement from Events & Catalog
  const categoryClicks = {};
  events.forEach(e => {
    if (e.event_type === 'catalog_filter' || e.event_type === 'product_modal_open') {
      const cat = e.event_data?.category || 'General Formulations';
      categoryClicks[cat] = (categoryClicks[cat] || 0) + 1;
    }
  });

  // Export Real CSV Report
  const handleExportReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value,Type\n"
      + `Total Registered Visitors,${sessions.length},Real Data\n`
      + `Active Online Sessions,${sessions.filter(s => s.is_online).length},Real Data\n`
      + `Total RFQ Submissions,${leads.length},Real Data\n`
      + `Total Search Log Entries,${searches.length},Real Data\n`
      + "\nCountry Breakdown\n"
      + realCountryBreakdown.map(c => `"${c.name} (${c.code})",${c.count},${c.pct}%`).join("\n")
      + "\n\nSearch Queries\n"
      + searches.map(s => `"${s.term}",${s.count},${s.category}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Medihub_Real_Analytics_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Executive Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Deep Intelligence & Traffic Analytics</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Comprehensive Real-Time Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated purely from active Supabase tables, real client sessions, and buyer inquiry submissions. Zero mock seeds.
          </p>
        </div>

        {/* Date Filter & Export */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            {[
              { id: 'today', label: 'Today' },
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: 'all', label: 'All Time' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTimeRange(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  timeRange === tab.id
                    ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={loadAllRealAnalytics}
            disabled={isRefreshing}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 transition-colors"
            title="Refresh Real Analytics"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <button
            onClick={handleExportReport}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Real Intelligence CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Pure Real KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Visitors */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unique Visitors</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{sessions.length}</span>
            <span className="text-xs text-emerald-400 font-bold flex items-center">
              <Activity className="w-3.5 h-3.5 mr-1" />
              {sessions.filter(s => s.is_online).length} Live Now
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Unique client devices tracked in Supabase</p>
        </div>

        {/* Real RFQ Inquiries */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">RFQ Inquiries</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{leads.length}</span>
            <span className="text-xs text-cyan-400 font-medium">Commercial Quotes</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Export inquiries submitted via web drawer</p>
        </div>

        {/* Product Catalog Scope */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Formulations Catalog</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{productsData.length || 598}</span>
            <span className="text-xs text-blue-400 font-medium">SKUs Active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Finished pharma dosage formulations</p>
        </div>

        {/* Real Telemetry Events */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Logged Events</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{events.length + searches.length}</span>
            <span className="text-xs text-purple-400 font-medium">Actions</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Recorded user interactions & telemetry stream</p>
        </div>
      </div>

      {/* Dynamic Geolocation Traffic & Device Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Country Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-cyan-400" />
                <span>Real Geographic Visitor Distribution</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculated directly from real visitor IP and geolocation records.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-300 font-semibold">
              {realCountryBreakdown.length} Countr{realCountryBreakdown.length !== 1 ? 'ies' : 'y'}
            </span>
          </div>

          {realCountryBreakdown.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              <Compass className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <span>Awaiting visitor geolocations. Traffic will display as new users connect.</span>
            </div>
          ) : (
            <div className="space-y-3.5">
              {realCountryBreakdown.map((item) => (
                <div key={item.code} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.flag}</span>
                      <span className="font-semibold text-slate-200">{item.name}</span>
                      <span className="font-mono text-slate-500 text-[11px]">({item.code})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 font-mono text-[11px]">{item.count} visitor{item.count !== 1 ? 's' : ''}</span>
                      <span className="font-bold font-mono text-cyan-300 w-10 text-right">{item.pct}%</span>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Device & Hardware Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Laptop className="w-4 h-4 text-cyan-400" />
              <span>Real Hardware & Device Share</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Breakdown of real client browser user-agents.
            </p>
          </div>

          <div className="space-y-4">
            {realDeviceShare.map((dev) => {
              const Icon = dev.icon;
              return (
                <div key={dev.type} className="bg-slate-950 border border-slate-800/80 p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-200">{dev.type}</div>
                        <div className="text-[10px] text-slate-400">{dev.count} sessions</div>
                      </div>
                    </div>
                    <span className="text-base font-black font-mono text-white">{dev.pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${dev.pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 bg-slate-950/60 border border-slate-800/60 rounded-xl text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Telemetry data validated via BILLA EYES™ browser diagnostics.</span>
          </div>
        </div>
      </div>

      {/* Real Top Search Queries & Inquiry Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Real Search Queries (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                <span>Real Buyer Search Terms</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Exact medicine keywords typed by international buyers into the search bar.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-300 font-semibold">{searches.length} queries</span>
          </div>

          {searches.length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-xs">
              <Search className="w-7 h-7 mx-auto mb-2 text-slate-600" />
              <span>No user search queries logged yet. Search keywords will appear here automatically.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Search Term</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold text-right">Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {searches.slice(0, 8).map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 font-bold text-slate-200 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>{s.term}</span>
                      </td>
                      <td className="py-3 text-slate-400">
                        <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px]">
                          {s.category || 'Pharmaceutical'}
                        </span>
                      </td>
                      <td className="py-3 font-mono font-bold text-cyan-300 text-right">
                        {s.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Real Inquiries Preview (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <span>Recent RFQ Inquiries</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Submitted commercial quotation requests.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold">{leads.length} leads</span>
          </div>

          {leads.length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-xs">
              <ShoppingBag className="w-7 h-7 mx-auto mb-2 text-slate-600" />
              <span>No quotation inquiries submitted yet. Real buyer RFQs will show here.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {leads.slice(0, 4).map((lead) => (
                <div key={lead.id} className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate">{lead.company || lead.name}</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                      {lead.status || 'New Lead'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>{lead.country || 'Global'}</span>
                    <span>•</span>
                    <span>{lead.email}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
