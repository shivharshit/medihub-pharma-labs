import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Users, ShoppingBag, MessageSquare, Globe2, 
  Search, Smartphone, Laptop, Tablet, Calendar, Download, RefreshCw, 
  ArrowUpRight, ArrowDownRight, Activity, Filter, ShieldCheck, Sparkles, PieChart
} from 'lucide-react';
import { fetchSearchLogs, fetchRfqLeads, fetchRecentEvents } from '../services/analyticsService';
import productsData from '../data/products.json';

export default function DeepAnalysis() {
  const [timeRange, setTimeRange] = useState('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searches, setSearches] = useState([]);
  const [leads, setLeads] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = () => {
    setIsRefreshing(true);
    setSearches(fetchSearchLogs());
    fetchRfqLeads().then(data => setLeads(data));
    setEvents(fetchRecentEvents());
    setTimeout(() => setIsRefreshing(false), 300);
  };

  // Aggregates & Mock Calculations based on Time Range
  const multipliers = {
    today: { visitors: 342, rfq: 8, whatsapp: 19, views: 1890, rate: '+14.2%' },
    '7d': { visitors: 2840, rfq: 46, whatsapp: 124, views: 14200, rate: '+18.5%' },
    '30d': { visitors: 11420, rfq: 182, whatsapp: 490, views: 58900, rate: '+24.8%' },
    all: { visitors: 48900, rfq: 720, whatsapp: 1950, views: 245000, rate: '+32.1%' }
  };

  const currentStats = multipliers[timeRange] || multipliers['30d'];

  // Country Traffic Distribution
  const countryBreakdown = [
    { country: 'Germany', flag: '🇩🇪', share: 26, rfqCount: 42, color: 'bg-amber-500' },
    { country: 'United States', flag: '🇺🇸', share: 22, rfqCount: 38, color: 'bg-blue-500' },
    { country: 'United Kingdom', flag: '🇬🇧', share: 18, rfqCount: 29, color: 'bg-cyan-500' },
    { country: 'Spain & LATAM', flag: '🇪🇸', share: 15, rfqCount: 24, color: 'bg-red-500' },
    { country: 'United Arab Emirates', flag: '🇦🇪', share: 11, rfqCount: 19, color: 'bg-emerald-500' },
    { country: 'Canada', flag: '🇨🇦', share: 8, rfqCount: 14, color: 'bg-purple-500' }
  ];

  // Category demand from 598 products
  const categoryDemand = [
    { name: 'Anti-Infectives & Antibiotics', count: 142, inquiries: 64, pct: 35 },
    { name: 'Cardiovascular & Hypertension', count: 98, inquiries: 48, pct: 26 },
    { name: 'Analgesics & Anti-Pyretics', count: 76, inquiries: 36, pct: 19 },
    { name: 'Anti-Diabetic & Metabolic', count: 54, inquiries: 24, pct: 13 },
    { name: 'Gastrointestinal & Oncology', count: 88, inquiries: 16, pct: 7 }
  ];

  // Device breakdown
  const deviceShare = [
    { type: 'Desktop / Workstation', icon: Laptop, share: 58, count: '6,623' },
    { type: 'Mobile Smartphone', icon: Smartphone, share: 36, count: '4,111' },
    { type: 'Tablet & iPad', icon: Tablet, share: 6, count: '686' }
  ];

  // Export CSV Report
  const handleExportReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value,Period\n"
      + `Total Visitors,${currentStats.visitors},${timeRange}\n`
      + `Total RFQ Submissions,${currentStats.rfq},${timeRange}\n`
      + `WhatsApp Inquiries,${currentStats.whatsapp},${timeRange}\n`
      + `Total Catalog Pageviews,${currentStats.views},${timeRange}\n`
      + "\nTop Searched Drug Queries\n"
      + searches.map(s => `"${s.term}",${s.count},${s.category}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Medihub_Deep_Analysis_${timeRange}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Top Controls Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Deep Intelligence Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Comprehensive Website & Export Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry, visitor behavioral funnels, global demand distribution, and RFQ pipeline conversion.
          </p>
        </div>

        {/* Date Filter & Export */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            {[
              { id: 'today', label: 'Today' },
              { id: '7d', label: 'Last 7 Days' },
              { id: '30d', label: 'Last 30 Days' },
              { id: 'all', label: 'All Time' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTimeRange(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  timeRange === tab.id
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={loadAnalyticsData}
            disabled={isRefreshing}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 transition-colors"
            title="Refresh Real-time Analytics"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <button
            onClick={handleExportReport}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Intelligence</span>
          </button>
        </div>
      </div>

      {/* 4 Big KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Visitors */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Unique Visitors</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{currentStats.visitors.toLocaleString()}</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> {currentStats.rate}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Active international pharma buyers</p>
        </div>

        {/* RFQs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">RFQ Inquiries Generated</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{currentStats.rfq}</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +21.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">B2B commercial quotation requests</p>
        </div>

        {/* WhatsApp Outreach */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">WhatsApp Direct Chats</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{currentStats.whatsapp}</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +16.8%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Direct export inquiries initiated</p>
        </div>

        {/* Catalog Page Views */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Catalog Interactions</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{currentStats.views.toLocaleString()}</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +29.1%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Total drug specification views</p>
        </div>
      </div>

      {/* Main Grid: Country Distribution & Therapeutic Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Country Demand Hotspots */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Globe2 className="w-5 h-5 text-cyan-400" />
              <div>
                <h2 className="text-base font-bold text-white">Global Export Demand Hotspots</h2>
                <p className="text-[11px] text-slate-400">Visitor volume & buyer RFQ concentration by market</p>
              </div>
            </div>
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-mono">
              6 Key Territories
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {countryBreakdown.map((item) => (
              <div key={item.country} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.flag}</span>
                    <span className="font-semibold text-slate-200">{item.country}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-[11px] font-mono">{item.rfqCount} Inquiries</span>
                    <span className="font-bold text-white font-mono">{item.share}%</span>
                  </div>
                </div>
                {/* Visual Bar */}
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-1000`} 
                    style={{ width: `${item.share * 2.8}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Therapeutic Category Interest */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <div>
                <h2 className="text-base font-bold text-white">Therapeutic Category Demand</h2>
                <p className="text-[11px] text-slate-400">Share of buyer inquiries across 598 formulations</p>
              </div>
            </div>
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-mono">
              25 Categories
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {categoryDemand.map((cat) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 truncate max-w-[220px]">{cat.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-[11px] font-mono">{cat.inquiries} RFQs</span>
                    <span className="font-bold text-emerald-400 font-mono">{cat.pct}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000" 
                    style={{ width: `${cat.pct * 2.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row: Top Searched Drug Queries & Device Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Searched Queries (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Search className="w-5 h-5 text-purple-400" />
              <div>
                <h2 className="text-base font-bold text-white">Top Searched Pharmaceutical Formulations</h2>
                <p className="text-[11px] text-slate-400">What international buyers are searching for on the search bar</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {searches.map((s, idx) => (
              <div 
                key={s.term}
                className="bg-slate-950 border border-slate-800/80 hover:border-slate-700 p-3.5 rounded-2xl flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 text-xs font-mono font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-200">{s.term}</div>
                    <div className="text-[10px] text-slate-500">{s.category}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-extrabold text-cyan-400 font-mono">{s.count} searches</div>
                  <div className="text-[9px] text-emerald-400 font-semibold">High Demand</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device & Client Breakdown (1 col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <PieChart className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-base font-bold text-white">Buyer Devices</h2>
              <p className="text-[11px] text-slate-400">Browsing hardware distribution</p>
            </div>
          </div>

          <div className="space-y-4 pt-3">
            {deviceShare.map((dev) => {
              const Icon = dev.icon;
              return (
                <div key={dev.type} className="bg-slate-950 border border-slate-800/80 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-cyan-400" />
                      <span className="font-semibold text-slate-200">{dev.type}</span>
                    </div>
                    <span className="font-bold text-white font-mono">{dev.share}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-400 rounded-full" 
                      style={{ width: `${dev.share}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 text-right">{dev.count} Sessions</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
