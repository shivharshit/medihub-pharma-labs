import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import DashboardOverview from './DashboardOverview';
import DeepAnalysis from './DeepAnalysis';
import RfqLeadsManager from './RfqLeadsManager';
import LiveActivityFeed from './LiveActivityFeed';
import LanguageManager from './LanguageManager';
import SupabaseSettings from './SupabaseSettings';
import AdminErrorBoundary from './AdminErrorBoundary';
import { getCurrentSupabaseUser, logoutSupabase, getSupabase } from '../lib/supabaseClient';

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('medihub_admin_auth') === 'true';
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const user = await getCurrentSupabaseUser();
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        sessionStorage.setItem('medihub_admin_auth', 'true');
      }

      const supabase = getSupabase();
      if (supabase) {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (session?.user) {
            setCurrentUser(session.user);
            setIsAuthenticated(true);
            sessionStorage.setItem('medihub_admin_auth', 'true');
          } else if (event === 'SIGNED_OUT') {
            setCurrentUser(null);
            setIsAuthenticated(false);
            sessionStorage.removeItem('medihub_admin_auth');
          }
        });
        return () => subscription?.unsubscribe();
      }
    };
    checkSession();
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await logoutSupabase();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <AdminErrorBoundary>
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      </AdminErrorBoundary>
    );
  }

  return (
    <AdminErrorBoundary>
      <AdminLayout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        user={currentUser}
      >
        {activeTab === 'overview' && <DashboardOverview onNavigate={setActiveTab} />}
        {activeTab === 'analytics' && <DeepAnalysis />}
        {activeTab === 'leads' && <RfqLeadsManager />}
        {activeTab === 'feed' && <LiveActivityFeed />}
        {activeTab === 'languages' && <LanguageManager />}
        {activeTab === 'supabase' && <SupabaseSettings />}
      </AdminLayout>
    </AdminErrorBoundary>
  );
}
