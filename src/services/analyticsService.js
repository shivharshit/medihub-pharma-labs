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

// Initial realistic seed data for immediate demonstration if fresh
const INITIAL_DEMO_LEADS = [
  {
    id: 'lead-101',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    name: 'Dr. Arthur Sterling',
    company: 'EuroMed Distribution GmbH',
    email: 'a.sterling@euromed-berlin.de',
    phone: '+49 30 901820',
    country: 'Germany',
    countryCode: 'DE',
    items: [
      { name: 'Meropenem 1g Injection', quantity: 5000, category: 'Anti-Infectives' },
      { name: 'Amoxicillin + Clavulanic Acid 1.2g', quantity: 10000, category: 'Anti-Infectives' }
    ],
    status: 'New Lead',
    notes: 'Urgent hospital tender requirement for Q4.',
    estimatedValue: '$38,500'
  },
  {
    id: 'lead-102',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    name: 'Carlos Mendoza',
    company: 'FarmaSur Latina S.A.',
    email: 'cmendoza@farmasur.es',
    phone: '+34 91 580 4260',
    country: 'Spain',
    countryCode: 'ES',
    items: [
      { name: 'Atorvastatin 40mg Tablets', quantity: 25000, category: 'Cardiovascular' },
      { name: 'Metformin 500mg ER', quantity: 50000, category: 'Anti-Diabetic' }
    ],
    status: 'In Discussion',
    notes: 'Requested Certificate of Analysis (COA) and WHO-GMP pack insert in Spanish.',
    estimatedValue: '$24,200'
  },
  {
    id: 'lead-103',
    created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
    name: 'Sarah Jenkins',
    company: 'Apex Health Partners UK',
    email: 's.jenkins@apexhealth.co.uk',
    phone: '+44 20 7946 0912',
    country: 'United Kingdom',
    countryCode: 'GB',
    items: [
      { name: 'Paracetamol 500mg IV Infusion', quantity: 15000, category: 'Analgesics' },
      { name: 'Ceftriaxone 1g Injection', quantity: 8000, category: 'Anti-Infectives' }
    ],
    status: 'Quoted',
    notes: 'Proforma invoice sent on CIF London terms.',
    estimatedValue: '$42,000'
  },
  {
    id: 'lead-104',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    name: 'Tariq Al-Mansoor',
    company: 'Gulf Pharma Global LLC',
    email: 'tariq@gulfpharmadubai.ae',
    phone: '+971 4 313 8888',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    items: [
      { name: 'Enoxaparin 40mg PFS', quantity: 12000, category: 'Cardiovascular' },
      { name: 'Piperacillin + Tazobactam 4.5g', quantity: 6000, category: 'Anti-Infectives' }
    ],
    status: 'Order Placed',
    notes: 'Letter of Credit confirmed. Production scheduled.',
    estimatedValue: '$68,400'
  },
  {
    id: 'lead-105',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    name: 'Robert Vance',
    company: 'NorthStar Bio Logistics',
    email: 'rvance@northstarpharma.ca',
    phone: '+1 416 555 0199',
    country: 'Canada',
    countryCode: 'CA',
    items: [
      { name: 'Levofloxacin 500mg Tablets', quantity: 20000, category: 'Anti-Infectives' },
      { name: 'Esomeprazole 40mg IV', quantity: 10000, category: 'Gastrointestinal' }
    ],
    status: 'New Lead',
    notes: 'Exploring annual contract for Canadian pharmacy chain.',
    estimatedValue: '$31,500'
  }
];

const INITIAL_DEMO_SEARCHES = [
  { term: 'Paracetamol IV', count: 48, category: 'Analgesics', lastSearched: new Date().toISOString() },
  { term: 'Meropenem Injection', count: 42, category: 'Anti-Infectives', lastSearched: new Date().toISOString() },
  { term: 'Atorvastatin', count: 37, category: 'Cardiovascular', lastSearched: new Date().toISOString() },
  { term: 'Amoxicillin Clavulanate', count: 31, category: 'Anti-Infectives', lastSearched: new Date().toISOString() },
  { term: 'Enoxaparin PFS', count: 28, category: 'Cardiovascular', lastSearched: new Date().toISOString() },
  { term: 'Ceftriaxone', count: 24, category: 'Anti-Infectives', lastSearched: new Date().toISOString() },
  { term: 'Metformin ER', count: 22, category: 'Anti-Diabetic', lastSearched: new Date().toISOString() },
  { term: 'WHO-GMP certification', count: 19, category: 'General', lastSearched: new Date().toISOString() }
];

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
    let list = raw ? JSON.parse(raw) : INITIAL_DEMO_SEARCHES;
    const existingIdx = list.findIndex(s => s.term.toLowerCase() === cleanTerm.toLowerCase());
    if (existingIdx >= 0) {
      list[existingIdx].count += 1;
      list[existingIdx].lastSearched = new Date().toISOString();
    } else {
      list.unshift({
        term: cleanTerm,
        count: 1,
        category: 'Search',
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
    const list = raw ? JSON.parse(raw) : INITIAL_DEMO_LEADS;
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

// 4. Fetch RFQ Leads
export const fetchRfqLeads = async () => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('rfq_inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {}
  }

  const raw = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {}
  }
  return INITIAL_DEMO_LEADS;
};

// 5. Update RFQ Lead Status
export const updateLeadStatus = async (leadId, newStatus, newNotes) => {
  const raw = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
  let list = raw ? JSON.parse(raw) : INITIAL_DEMO_LEADS;
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
    return raw ? JSON.parse(raw) : INITIAL_DEMO_SEARCHES;
  } catch (e) {
    return INITIAL_DEMO_SEARCHES;
  }
};

// 7. Fetch Recent Events
export const fetchRecentEvents = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_EVENTS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    if (list.length === 0) {
      // Generate initial representative telemetry
      return [
        { id: 'evt-1', event_type: 'rfq_submitted', device_type: 'Desktop', language: 'en', created_at: new Date(Date.now() - 1000 * 60 * 4).toISOString(), event_data: { company: 'EuroMed Distribution', itemsCount: 2, country: 'Germany' } },
        { id: 'evt-2', event_type: 'whatsapp_click', device_type: 'Mobile', language: 'es', created_at: new Date(Date.now() - 1000 * 60 * 14).toISOString(), event_data: { product: 'Atorvastatin 40mg' } },
        { id: 'evt-3', event_type: 'language_change', device_type: 'Desktop', language: 'de', created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(), event_data: { to: 'de' } },
        { id: 'evt-4', event_type: 'search', device_type: 'Desktop', language: 'en', created_at: new Date(Date.now() - 1000 * 60 * 42).toISOString(), event_data: { query: 'Meropenem Injection', results: 1 } },
        { id: 'evt-5', event_type: 'product_view', device_type: 'Mobile', language: 'en', created_at: new Date(Date.now() - 1000 * 60 * 58).toISOString(), event_data: { productName: 'Paracetamol IV' } },
        { id: 'evt-6', event_type: 'page_view', device_type: 'Desktop', language: 'en', created_at: new Date(Date.now() - 1000 * 60 * 75).toISOString(), event_data: { page: '/' } }
      ];
    }
    return list;
  } catch (e) {
    return [];
  }
};
