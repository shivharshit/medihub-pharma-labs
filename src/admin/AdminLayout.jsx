import React from 'react';
import { 
  LayoutDashboard, Globe, Database, LogOut, ArrowLeft, 
  Shield, Layers, Activity, BarChart3, Users, Radio, UserCheck 
} from 'lucide-react';

export default function AdminLayout({ activeTab, setActiveTab, onLogout, user, children }) {
  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'analytics', label: 'Deep Analysis & Insights', icon: BarChart3 },
    { id: 'leads', label: 'RFQ Leads & Inquiries', icon: Users },
    { id: 'feed', label: 'Live Activity Stream', icon: Radio },
    { id: 'languages', label: 'Multi-Language Studio', icon: Globe },
    { id: 'supabase', label: 'Supabase Cloud', icon: Database },
  ];

  const userEmail = user?.email || 'admin@medihubpharmalabs.com';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-xl shadow-md border border-slate-700 h-10 w-auto flex items-center justify-center shrink-0">
                <img 
                  src="/logo.png" 
                  alt="Medihub Official Logo" 
                  className="h-full w-auto object-contain" 
                />
              </div>
              <div>
                <h2 className="text-xs font-bold text-white tracking-tight leading-tight">Medihub Pharma Labs</h2>
                <div className="flex items-center gap-1.5 text-[9px] text-cyan-400 font-semibold uppercase tracking-wider mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Admin Console v2.0
                </div>
              </div>
            </div>
          </div>

          {/* Logged in User Badge */}
          <div className="px-4 pt-4 pb-2">
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Logged in as</div>
                <div className="text-xs text-slate-200 font-bold truncate">{userEmail}</div>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Workspaces
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 text-cyan-300 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <a
            href="/"
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all font-medium"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>Storefront Public View</span>
          </a>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-transparent hover:border-red-500/20 transition-all font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar */}
        <header className="h-16 bg-slate-900/60 backdrop-blur-md border-b border-slate-800/80 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Admin</span>
            <span>/</span>
            <span className="text-slate-200 font-semibold capitalize">
              {navItems.find(n => n.id === activeTab)?.label || 'Console'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/80 border border-slate-700/60 rounded-full text-[11px] text-slate-300">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>Production Live</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
