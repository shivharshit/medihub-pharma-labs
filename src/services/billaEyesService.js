import { getSupabase } from '../lib/supabaseClient';

const BILLA_UID_KEY = 'billa_eyes_visitor_id';
const BILLA_SESSION_KEY = 'billa_eyes_session_data';
const BILLA_LOCAL_SESSIONS_KEY = 'billa_eyes_all_sessions';
const BILLA_LOCAL_EVENTS_KEY = 'billa_eyes_all_events';

// Country & Geolocation detector based on Intl timezone
const detectLocation = () => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Europe/Berlin') || tz.includes('Europe/Busingen')) return { country: 'Germany', countryCode: 'DE', flag: '🇩🇪', city: 'Berlin' };
    if (tz.includes('Europe/London')) return { country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧', city: 'London' };
    if (tz.includes('Europe/Madrid')) return { country: 'Spain', countryCode: 'ES', flag: '🇪🇸', city: 'Madrid' };
    if (tz.includes('America/New_York') || tz.includes('America/Chicago') || tz.includes('America/Los_Angeles')) return { country: 'United States', countryCode: 'US', flag: '🇺🇸', city: 'New York' };
    if (tz.includes('America/Toronto') || tz.includes('America/Vancouver')) return { country: 'Canada', countryCode: 'CA', flag: '🇨🇦', city: 'Toronto' };
    if (tz.includes('Asia/Dubai')) return { country: 'United Arab Emirates', countryCode: 'AE', flag: '🇦🇪', city: 'Dubai' };
    if (tz.includes('Asia/Kolkata') || tz.includes('Asia/Calcutta')) return { country: 'India', countryCode: 'IN', flag: '🇮🇳', city: 'Mumbai / SEZ' };
    if (tz.includes('Australia/Sydney') || tz.includes('Australia/Melbourne')) return { country: 'Australia', countryCode: 'AU', flag: '🇦🇺', city: 'Sydney' };
    if (tz.includes('Europe/Paris')) return { country: 'France', countryCode: 'FR', flag: '🇫🇷', city: 'Paris' };
    
    // Fallback extraction from timezone name
    const parts = tz.split('/');
    const city = parts[1] ? parts[1].replace(/_/g, ' ') : 'Global Gateway';
    return { country: 'International', countryCode: 'GLOBAL', flag: '🌐', city };
  } catch (e) {
    return { country: 'Global Partner', countryCode: 'GL', flag: '🌐', city: 'International Gateway' };
  }
};

// Device & Browser detector
const detectDevice = () => {
  const ua = navigator.userAgent;
  let deviceType = 'Desktop PC';
  let browser = 'Chrome';
  let os = 'Windows';

  if (/iPhone/i.test(ua)) { deviceType = 'Apple iPhone'; os = 'iOS'; }
  else if (/iPad/i.test(ua)) { deviceType = 'Apple iPad'; os = 'iPadOS'; }
  else if (/Android/i.test(ua)) { deviceType = 'Android Smartphone'; os = 'Android'; }
  else if (/Macintosh/i.test(ua)) { deviceType = 'MacBook / Mac'; os = 'macOS'; }
  else if (/Windows/i.test(ua)) { deviceType = 'Windows Workstation'; os = 'Windows'; }

  if (/Edg/i.test(ua)) browser = 'Microsoft Edge';
  else if (/Chrome/i.test(ua)) browser = 'Google Chrome';
  else if (/Safari/i.test(ua)) browser = 'Apple Safari';
  else if (/Firefox/i.test(ua)) browser = 'Mozilla Firefox';

  return { deviceType, browser, os, screen: `${window.innerWidth}x${window.innerHeight}` };
};

// 1. Get or Generate Persistent BILLA Visitor ID
export const getBillaVisitorId = () => {
  let uid = localStorage.getItem(BILLA_UID_KEY);
  if (!uid) {
    const loc = detectLocation();
    const rand = Math.floor(1000 + Math.random() * 9000);
    uid = `BILLA-${loc.countryCode}-${rand}`;
    localStorage.setItem(BILLA_UID_KEY, uid);
  }
  return uid;
};

// 2. Representative initial seed sessions for instant rich visualization
const DEMO_BILLA_SESSIONS = [
  {
    visitor_id: 'BILLA-DE-8492',
    country: 'Germany',
    countryCode: 'DE',
    flag: '🇩🇪',
    city: 'Frankfurt',
    deviceType: 'Windows Workstation',
    browser: 'Chrome 128',
    os: 'Windows 11',
    screen: '1920x1080',
    current_page: 'Product: Meropenem 1g Injection',
    current_action: 'Inspecting Antibiotic COA Specifications',
    is_online: true,
    created_at: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
    last_ping_at: new Date(Date.now() - 1000 * 8).toISOString(),
    events_count: 5
  },
  {
    visitor_id: 'BILLA-US-3194',
    country: 'United States',
    countryCode: 'US',
    flag: '🇺🇸',
    city: 'New Jersey',
    deviceType: 'MacBook Pro',
    browser: 'Safari 18',
    os: 'macOS Sequoia',
    screen: '1728x1117',
    current_page: 'RFQ Cart Drawer',
    current_action: 'Added 25,000 units of Atorvastatin 40mg',
    is_online: true,
    created_at: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    last_ping_at: new Date(Date.now() - 1000 * 12).toISOString(),
    events_count: 7
  },
  {
    visitor_id: 'BILLA-GB-6721',
    country: 'United Kingdom',
    countryCode: 'GB',
    flag: '🇬🇧',
    city: 'London',
    deviceType: 'Apple iPhone 15 Pro',
    browser: 'Mobile Safari',
    os: 'iOS 18',
    screen: '393x852',
    current_page: 'Therapeutic: Anti-Infectives',
    current_action: 'Browsing Ceftriaxone & Amoxicillin',
    is_online: true,
    created_at: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    last_ping_at: new Date(Date.now() - 1000 * 15).toISOString(),
    events_count: 4
  },
  {
    visitor_id: 'BILLA-AE-9051',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    flag: '🇦🇪',
    city: 'Dubai',
    deviceType: 'Windows Workstation',
    browser: 'Edge 128',
    os: 'Windows 11',
    screen: '2560x1440',
    current_page: 'WhatsApp Export Desk',
    current_action: 'Initiated Commercial Inquiry for Hospital Tender',
    is_online: true,
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    last_ping_at: new Date(Date.now() - 1000 * 25).toISOString(),
    events_count: 9
  },
  {
    visitor_id: 'BILLA-ES-4209',
    country: 'Spain',
    countryCode: 'ES',
    flag: '🇪🇸',
    city: 'Madrid',
    deviceType: 'Android Smartphone',
    browser: 'Chrome Mobile',
    os: 'Android 14',
    screen: '412x915',
    current_page: 'Storefront (Español)',
    current_action: 'Switched Language to Spanish & Browsing Analgesics',
    is_online: false,
    created_at: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    last_ping_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    events_count: 3
  }
];

const DEMO_BILLA_EVENTS = {
  'BILLA-DE-8492': [
    { time: '14:02:10', title: 'Landed on Medihub Storefront', detail: 'Referrer: Google Organic Search (Keywords: WHO-GMP finished pharma exports)' },
    { time: '14:02:40', title: 'Language Switched to German 🇩🇪', detail: 'Selected Deutsch localization for product catalog' },
    { time: '14:03:15', title: 'Filtered Therapeutic Category', detail: 'Selected "Anti-Infectives & Antibiotics" (142 formulations)' },
    { time: '14:04:20', title: 'Opened Product Specification', detail: 'Meropenem 1g Injection with COA / WHO-GMP compliance sheet' },
    { time: '14:05:00', title: 'Currently Active', detail: 'Inspecting Antibiotic COA Specifications' }
  ],
  'BILLA-US-3194': [
    { time: '13:54:05', title: 'Landed on Storefront', detail: 'Direct B2B referral from pharma portal' },
    { time: '13:55:10', title: 'Searched Formulation', detail: 'Query: "Atorvastatin 40mg"' },
    { time: '13:57:30', title: 'Added to RFQ Cart', detail: '25,000 units of Atorvastatin 40mg' },
    { time: '14:02:15', title: 'Opened RFQ Drawer', detail: 'Filling procurement details for North American distribution' }
  ]
};

// 3. Send BILLA EYES Heartbeat Ping
export const pingBillaEyes = async (actionDesc = 'Browsing Catalog', pageName = '/') => {
  const visitorId = getBillaVisitorId();
  const loc = detectLocation();
  const dev = detectDevice();

  const payload = {
    visitor_id: visitorId,
    country: loc.country,
    countryCode: loc.countryCode,
    flag: loc.flag,
    city: loc.city,
    deviceType: dev.deviceType,
    browser: dev.browser,
    os: dev.os,
    screen: dev.screen,
    current_page: pageName || window.location.pathname,
    current_action: actionDesc,
    is_online: true,
    last_ping_at: new Date().toISOString()
  };

  // Local write
  try {
    const raw = localStorage.getItem(BILLA_LOCAL_SESSIONS_KEY);
    let list = raw ? JSON.parse(raw) : DEMO_BILLA_SESSIONS;
    const existingIdx = list.findIndex(s => s.visitor_id === visitorId);
    if (existingIdx >= 0) {
      list[existingIdx] = { ...list[existingIdx], ...payload, last_ping_at: payload.last_ping_at, is_online: true };
    } else {
      list.unshift({ ...payload, created_at: new Date().toISOString(), events_count: 1 });
    }
    localStorage.setItem(BILLA_LOCAL_SESSIONS_KEY, JSON.stringify(list));
  } catch (e) {}

  // Supabase push
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('billa_eyes_sessions').upsert({
        visitor_id: payload.visitor_id,
        country: payload.country,
        country_code: payload.countryCode,
        flag: payload.flag,
        city: payload.city,
        device_type: payload.deviceType,
        browser: payload.browser,
        os: payload.os,
        current_page: payload.current_page,
        current_action: payload.current_action,
        is_online: true,
        last_ping_at: payload.last_ping_at
      }, { onConflict: 'visitor_id' });
    } catch (e) {}
  }

  return payload;
};

// 4. Log a Specific BILLA Action Event
export const logBillaAction = async (title, detail = '') => {
  const visitorId = getBillaVisitorId();
  const timeStr = new Date().toLocaleTimeString();

  const eventItem = {
    id: `billa-evt-${Date.now()}`,
    visitor_id: visitorId,
    time: timeStr,
    title,
    detail,
    created_at: new Date().toISOString()
  };

  // Update local events map
  try {
    const raw = localStorage.getItem(BILLA_LOCAL_EVENTS_KEY);
    const map = raw ? JSON.parse(raw) : DEMO_BILLA_EVENTS;
    map[visitorId] = map[visitorId] || [];
    map[visitorId].push({ time: timeStr, title, detail });
    localStorage.setItem(BILLA_LOCAL_EVENTS_KEY, JSON.stringify(map));
  } catch (e) {}

  // Trigger heartbeat with new action
  pingBillaEyes(title, window.location.pathname);

  // Supabase push
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('billa_eyes_events').insert({
        visitor_id: visitorId,
        title,
        detail,
        created_at: eventItem.created_at
      });
    } catch (e) {}
  }
};

// 5. Fetch Active BILLA Sessions for Dashboard
export const fetchBillaSessions = async () => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('billa_eyes_sessions')
        .select('*')
        .order('last_ping_at', { ascending: false });
      if (!error && data && data.length > 0) {
        // Mark as offline if last ping > 45 seconds ago
        const now = Date.now();
        return data.map(s => ({
          ...s,
          visitor_id: s.visitor_id,
          deviceType: s.device_type,
          is_online: (now - new Date(s.last_ping_at).getTime()) < 45000
        }));
      }
    } catch (e) {}
  }

  const raw = localStorage.getItem(BILLA_LOCAL_SESSIONS_KEY);
  if (raw) {
    try {
      const list = JSON.parse(raw);
      const now = Date.now();
      return list.map(s => ({
        ...s,
        is_online: (now - new Date(s.last_ping_at).getTime()) < 45000
      }));
    } catch (e) {}
  }

  return DEMO_BILLA_SESSIONS;
};

// 6. Fetch Visitor Journey for Detail Drawer
export const fetchBillaVisitorJourney = async (visitorId) => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('billa_eyes_events')
        .select('*')
        .eq('visitor_id', visitorId)
        .order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map(d => ({
          time: new Date(d.created_at).toLocaleTimeString(),
          title: d.title,
          detail: d.detail
        }));
      }
    } catch (e) {}
  }

  const raw = localStorage.getItem(BILLA_LOCAL_EVENTS_KEY);
  if (raw) {
    try {
      const map = JSON.parse(raw);
      if (map[visitorId]) return map[visitorId];
    } catch (e) {}
  }

  return DEMO_BILLA_EVENTS[visitorId] || [
    { time: 'Just now', title: 'Landed on Website', detail: 'Exploring Medihub pharmaceutical export formulations' },
    { time: 'Just now', title: 'Live Session Connected', detail: 'Heartbeat registered via BILLA EYES Telemetry' }
  ];
};
