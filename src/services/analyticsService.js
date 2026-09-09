import { getSupabase } from '../lib/supabaseClient';

const LOCAL_STORAGE_EVENTS_KEY = 'medihub_analytics_events';
const LOCAL_STORAGE_LEADS_KEY = 'medihub_rfq_leads';
const LOCAL_STORAGE_SEARCHES_KEY = 'medihub_search_logs';

// Helper to determine device type
const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'Tablet';
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) return 'Mobile';
  return 'Desktop';
};

// 1. Log an event
export const trackEvent = async (eventType, eventData = {}) => {
  const payload = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    event_type: eventType,
    event_data: eventData,
    device_type: getDeviceType(),
    url: window.location.href,
    language: localStorage.getItem('i18nextLng') || 'en',
    created_at: new Date().toISOString()
  };

  // Save to LocalStorage buffer
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_EVENTS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(payload);
    if (list.length > 500) list.pop(); // keep last 500 events
    localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Local analytics write error:', e);
  }

  // Attempt Supabase push
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('analytics_events').insert({
        event_type: payload.event_type,
        event_data: payload.event_data,
        device_type: payload.device_type,
        language: payload.language,
        created_at: payload.created_at
      });
    } catch (err) {
      // Quiet fail if table doesn't exist yet
    }
  }

  return payload;
};

// 2. Track a Search Query
export const trackSearchQuery = async (term, resultCount = 0) => {
  if (!term || term.trim().length < 2) return;
  const cleanTerm = term.trim();

  // Log as general event
  trackEvent('search', { query: cleanTerm, results: resultCount });

  // Update searches aggregate table
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SEARCHES_KEY);
    let list = raw ? JSON.parse(raw) : [];
    const existingIdx = list.findIndex(s => s.term.toLowerCase() === cleanTerm.toLowerCase());
    if (existingIdx >= 0) {
      list[existingIdx].count += 1;
      list[existingIdx].lastSearched = new Date().toISOString();
    } else {
      list.unshift({
        term: cleanTerm,
        count: 1,
        category: 'Pharmaceutical',
        lastSearched: new Date().toISOString()
      });
    }
    localStorage.setItem(LOCAL_STORAGE_SEARCHES_KEY, JSON.stringify(list));
  } catch (e) {}
};

// 3. Submit a new RFQ / Lead
export const submitRfqLead = async (leadData) => {
  const lead = {
    id: `lead-${Date.now()}`,
    created_at: new Date().toISOString(),
    status: 'New Lead',
    notes: 'Submitted via Medihub Public Storefront RFQ Cart / WhatsApp Portal',
    ...leadData
  };

  // Local write
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(lead);
    localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(list));
  } catch (e) {}

  // Track event
  trackEvent('rfq_submitted', {
    company: lead.company,
    itemsCount: lead.items?.length || 0,
    country: lead.country
  });

  // Supabase push
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('rfq_inquiries').insert(lead);
    } catch (err) {
      console.warn('Supabase lead write failed:', err);
    }
  }

  return lead;
};

// 4. Fetch RFQ Leads (Real Supabase & Local)
export const fetchRfqLeads = async () => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('rfq_inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        return data;
      }
    } catch (e) {}
  }

  const raw = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
  }
  return [];
};

// 5. Update RFQ Lead Status
export const updateLeadStatus = async (leadId, newStatus, newNotes) => {
  const raw = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
  let list = raw ? JSON.parse(raw) : [];
  list = list.map(l => {
    if (l.id === leadId) {
      return { 
        ...l, 
        status: newStatus || l.status, 
        notes: newNotes !== undefined ? newNotes : l.notes,
        updated_at: new Date().toISOString()
      };
    }
    return l;
  });
  localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(list));

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase
        .from('rfq_inquiries')
        .update({ status: newStatus, notes: newNotes, updated_at: new Date().toISOString() })
        .eq('id', leadId);
    } catch (e) {}
  }
  return list;
};

// 6. Fetch Search Logs
export const fetchSearchLogs = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SEARCHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

// 7. Fetch Recent Events
export const fetchRecentEvents = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};
