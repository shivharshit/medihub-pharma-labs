import { getSupabase } from '../lib/supabaseClient';

const BILLA_UID_KEY = 'billa_eyes_visitor_id';
const BILLA_GEO_KEY = 'billa_eyes_geo_cache';
const BILLA_LOCAL_SESSIONS_KEY = 'billa_eyes_all_sessions';
const BILLA_LOCAL_EVENTS_KEY = 'billa_eyes_all_events';

// Country Code to Name, Flag & Accurate Geographic Map Coordinates (x%, y% on 1000x500 World SVG)
export const COUNTRY_MAP = {
  IN: { name: 'India', flag: '🇮🇳', x: 71.5, y: 44.0 },
  US: { name: 'United States', flag: '🇺🇸', x: 23.0, y: 34.0 },
  GB: { name: 'United Kingdom', flag: '🇬🇧', x: 48.5, y: 22.0 },
  DE: { name: 'Germany', flag: '🇩🇪', x: 52.5, y: 23.5 },
  AE: { name: 'United Arab Emirates', flag: '🇦🇪', x: 64.0, y: 41.0 },
  SA: { name: 'Saudi Arabia', flag: '🇸🇦', x: 61.0, y: 42.0 },
  ES: { name: 'Spain', flag: '🇪🇸', x: 47.0, y: 29.0 },
  FR: { name: 'France', flag: '🇫🇷', x: 49.5, y: 26.0 },
  CA: { name: 'Canada', flag: '🇨🇦', x: 22.0, y: 20.0 },
  AU: { name: 'Australia', flag: '🇦🇺', x: 87.0, y: 72.0 },
  SG: { name: 'Singapore', flag: '🇸🇬', x: 76.5, y: 53.0 },
  NL: { name: 'Netherlands', flag: '🇳🇱', x: 50.5, y: 22.5 },
  IT: { name: 'Italy', flag: '🇮🇹', x: 52.0, y: 28.0 },
  BR: { name: 'Brazil', flag: '🇧🇷', x: 35.0, y: 64.0 },
  ZA: { name: 'South Africa', flag: '🇿🇦', x: 55.0, y: 74.0 },
  KE: { name: 'Kenya', flag: '🇰🇪', x: 59.0, y: 53.0 },
  NG: { name: 'Nigeria', flag: '🇳🇬', x: 49.5, y: 48.0 },
  RU: { name: 'Russia', flag: '🇷🇺', x: 72.0, y: 18.0 },
  TR: { name: 'Turkey', flag: '🇹🇷', x: 57.5, y: 29.5 },
  EG: { name: 'Egypt', flag: '🇪🇬', x: 56.0, y: 36.0 },
  PH: { name: 'Philippines', flag: '🇵🇭', x: 82.0, y: 46.0 },
  VN: { name: 'Vietnam', flag: '🇻🇳', x: 77.5, y: 44.0 },
  ID: { name: 'Indonesia', flag: '🇮🇩', x: 79.5, y: 57.0 },
  BD: { name: 'Bangladesh', flag: '🇧🇩', x: 74.0, y: 42.0 },
  LK: { name: 'Sri Lanka', flag: '🇱🇰', x: 72.0, y: 51.0 },
  NP: { name: 'Nepal', flag: '🇳🇵', x: 73.0, y: 40.0 },
  MX: { name: 'Mexico', flag: '🇲🇽', x: 19.5, y: 41.0 },
  JP: { name: 'Japan', flag: '🇯🇵', x: 86.5, y: 31.0 },
  KR: { name: 'South Korea', flag: '🇰🇷', x: 84.0, y: 31.0 },
  CN: { name: 'China', flag: '🇨🇳', x: 77.0, y: 33.0 },
  TH: { name: 'Thailand', flag: '🇹🇭', x: 76.0, y: 45.0 },
  MY: { name: 'Malaysia', flag: '🇲🇾', x: 76.5, y: 51.0 },
  NZ: { name: 'New Zealand', flag: '🇳🇿', x: 93.0, y: 81.0 },
  PL: { name: 'Poland', flag: '🇵🇱', x: 54.0, y: 22.0 },
  SE: { name: 'Sweden', flag: '🇸🇪', x: 53.0, y: 15.0 },
  NO: { name: 'Norway', flag: '🇳🇴', x: 50.0, y: 15.0 },
  CH: { name: 'Switzerland', flag: '🇨🇭', x: 50.5, y: 25.5 },
  BE: { name: 'Belgium', flag: '🇧🇪', x: 49.5, y: 23.0 },
  AT: { name: 'Austria', flag: '🇦🇹', x: 53.0, y: 25.0 },
  AR: { name: 'Argentina', flag: '🇦🇷', x: 32.0, y: 77.0 },
  CL: { name: 'Chile', flag: '🇨🇱', x: 29.0, y: 75.0 },
  CO: { name: 'Colombia', flag: '🇨🇴', x: 28.0, y: 49.0 },
  PE: { name: 'Peru', flag: '🇵🇪', x: 27.0, y: 58.0 }
};

// Medihub Global Hub Coordinates (Mumbai / SEZ)
export const MEDIHUB_HQ_COORDS = { x: 71.5, y: 44.0, name: 'Medihub Global Exports HQ (India)' };

export const getCountryInfo = (code) => {
  if (!code) return { name: 'Global Partner', flag: '🌐', x: 50.0, y: 50.0 };
  const upper = code.toUpperCase();
  if (COUNTRY_MAP[upper]) return COUNTRY_MAP[upper];
  
  // Convert ISO 2-letter to flag emoji dynamically
  try {
    const codePoints = upper
      .slice(0, 2)
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return { name: upper, flag: String.fromCodePoint(...codePoints), x: 50.0, y: 50.0 };
  } catch (e) {
    return { name: upper, flag: '🌐', x: 50.0, y: 50.0 };
  }
};

// Real-Time IP / Geolocation Resolver
export const resolveRealLocation = async () => {
  try {
    const cached = sessionStorage.getItem(BILLA_GEO_KEY);
    if (cached) return JSON.parse(cached);
  } catch (e) {}

  let geo = null;

  try {
    const res = await fetch('https://api.country.is', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.country) {
        const info = getCountryInfo(data.country);
        geo = {
          ip: data.ip || 'Direct Connection',
          country: info.name,
          countryCode: data.country.toUpperCase(),
          flag: info.flag,
          city: 'Gateway Node',
          x: info.x,
          y: info.y
        };
      }
    }
  } catch (e) {}

  if (!geo) {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const parts = tz.split('/');
      const city = parts[1] ? parts[1].replace(/_/g, ' ') : 'International';

      if (tz.includes('Kolkata') || tz.includes('Calcutta') || tz.includes('Asia/Kolkata')) {
        geo = { ip: 'Client Node', country: 'India', countryCode: 'IN', flag: '🇮🇳', city: 'Mumbai / Delhi SEZ', x: 70.0, y: 48.0 };
      } else if (tz.includes('Europe/Berlin')) {
        geo = { ip: 'Client Node', country: 'Germany', countryCode: 'DE', flag: '🇩🇪', city: 'Berlin / Frankfurt', x: 51.0, y: 28.0 };
      } else if (tz.includes('Europe/London')) {
        geo = { ip: 'Client Node', country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧', city: 'London', x: 47.0, y: 26.0 };
      } else if (tz.includes('America/New_York') || tz.includes('America/Chicago') || tz.includes('America/Los_Angeles')) {
        geo = { ip: 'Client Node', country: 'United States', countryCode: 'US', flag: '🇺🇸', city: 'North America', x: 23.0, y: 36.0 };
      } else if (tz.includes('Asia/Dubai')) {
        geo = { ip: 'Client Node', country: 'United Arab Emirates', countryCode: 'AE', flag: '🇦🇪', city: 'Dubai', x: 62.0, y: 43.0 };
      } else if (tz.includes('Europe/Madrid')) {
        geo = { ip: 'Client Node', country: 'Spain', countryCode: 'ES', flag: '🇪🇸', city: 'Madrid', x: 46.0, y: 35.0 };
      } else {
        geo = { ip: 'Client Node', country: 'Global Partner', countryCode: 'GL', flag: '🌐', city, x: 50.0, y: 50.0 };
      }
    } catch (e) {
      geo = { ip: 'Client Node', country: 'Global Partner', countryCode: 'GL', flag: '🌐', city: 'Direct Connection', x: 50.0, y: 50.0 };
    }
  }

  try {
    sessionStorage.setItem(BILLA_GEO_KEY, JSON.stringify(geo));
  } catch (e) {}

  return geo;
};

// Real Device & Browser detector
export const detectDeviceDiagnostics = () => {
  const ua = navigator.userAgent;
  let deviceType = 'Desktop PC';
  let browser = 'Chrome';
  let os = 'Windows';

  if (/iPhone/i.test(ua)) { deviceType = 'Apple iPhone'; os = 'iOS'; }
  else if (/iPad/i.test(ua)) { deviceType = 'Apple iPad'; os = 'iPadOS'; }
  else if (/Android/i.test(ua)) { deviceType = 'Android Smartphone'; os = 'Android'; }
  else if (/Macintosh/i.test(ua)) { deviceType = 'MacBook / iMac'; os = 'macOS'; }
  else if (/Linux/i.test(ua)) { deviceType = 'Linux Workstation'; os = 'Linux'; }
  else if (/Windows/i.test(ua)) { deviceType = 'Windows PC'; os = 'Windows'; }

  if (/Edg/i.test(ua)) browser = 'Microsoft Edge';
  else if (/Chrome/i.test(ua)) browser = 'Google Chrome';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Apple Safari';
  else if (/Firefox/i.test(ua)) browser = 'Mozilla Firefox';
  else if (/Opera|OPR/i.test(ua)) browser = 'Opera';

  return {
    deviceType,
    browser,
    os,
    screen: `${window.innerWidth}x${window.innerHeight}`
  };
};

// Persistent Visitor ID
export const getBillaVisitorId = () => {
  let uid = localStorage.getItem(BILLA_UID_KEY);
  if (!uid) {
    const rand = Math.floor(1000 + Math.random() * 9000);
    const code = (navigator.language || 'GL').slice(0, 2).toUpperCase();
    uid = `BILLA-${code}-${rand}`;
    localStorage.setItem(BILLA_UID_KEY, uid);
  }
  return uid;
};

// Send Real BILLA EYES Heartbeat Ping
export const pingBillaEyes = async (actionDesc = 'Browsing Medihub Catalog', pageName = '/') => {
  const visitorId = getBillaVisitorId();
  const loc = await resolveRealLocation();
  const dev = detectDeviceDiagnostics();
  const now = new Date().toISOString();

  const payload = {
    visitor_id: visitorId,
    country: loc.country,
    countryCode: loc.countryCode,
    flag: loc.flag,
    city: loc.city,
    x: loc.x,
    y: loc.y,
    deviceType: dev.deviceType,
    browser: dev.browser,
    os: dev.os,
    screen: dev.screen,
    current_page: pageName || window.location.pathname || '/',
    current_action: actionDesc,
    is_online: true,
    last_ping_at: now
  };

  // 1. Write to local buffer
  try {
    const raw = localStorage.getItem(BILLA_LOCAL_SESSIONS_KEY);
    let list = raw ? JSON.parse(raw) : [];
    const idx = list.findIndex(s => s.visitor_id === visitorId);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...payload, last_ping_at: now, is_online: true };
    } else {
      list.unshift({ ...payload, created_at: now, events_count: 1 });
    }
    localStorage.setItem(BILLA_LOCAL_SESSIONS_KEY, JSON.stringify(list));
  } catch (e) {}

  // 2. Write to Supabase
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
    } catch (e) {
      console.warn('Supabase billa_eyes_sessions ping error:', e);
    }
  }

  return payload;
};

// Log a Real BILLA Action Event
export const logBillaAction = async (title, detail = '') => {
  const visitorId = getBillaVisitorId();
  const timeStr = new Date().toLocaleTimeString();
  const now = new Date().toISOString();

  const eventItem = {
    id: `billa-evt-${Date.now()}`,
    visitor_id: visitorId,
    time: timeStr,
    title,
    detail,
    created_at: now
  };

  try {
    const raw = localStorage.getItem(BILLA_LOCAL_EVENTS_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[visitorId] = map[visitorId] || [];
    map[visitorId].push({ time: timeStr, title, detail, created_at: now });
    if (map[visitorId].length > 50) map[visitorId] = map[visitorId].slice(-50);
    localStorage.setItem(BILLA_LOCAL_EVENTS_KEY, JSON.stringify(map));
  } catch (e) {}

  pingBillaEyes(title, window.location.pathname);

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from('billa_eyes_events').insert({
        visitor_id: visitorId,
        title,
        detail,
        created_at: now
      });
    } catch (e) {
      console.warn('Supabase billa_eyes_events write error:', e);
    }
  }
};

// Fetch Real BILLA Sessions with Coordinates
export const fetchBillaSessions = async () => {
  const now = Date.now();
  const ONLINE_THRESHOLD_MS = 35000;

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('billa_eyes_sessions')
        .select('*')
        .order('last_ping_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return data.map(s => {
          const lastPing = new Date(s.last_ping_at || s.updated_at || s.created_at).getTime();
          const countryCode = s.country_code || 'GL';
          const info = getCountryInfo(countryCode);
          return {
            visitor_id: s.visitor_id,
            country: s.country || info.name,
            countryCode,
            flag: s.flag || info.flag,
            city: s.city || 'Network Node',
            x: info.x,
            y: info.y,
            deviceType: s.device_type || 'Desktop PC',
            browser: s.browser || 'Browser',
            os: s.os || 'OS',
            current_page: s.current_page || '/',
            current_action: s.current_action || 'Browsing Storefront',
            is_online: (now - lastPing) < ONLINE_THRESHOLD_MS,
            last_ping_at: s.last_ping_at || s.created_at,
            created_at: s.created_at
          };
        });
      }
    } catch (e) {
      console.warn('Supabase session fetch error:', e);
    }
  }

  try {
    const raw = localStorage.getItem(BILLA_LOCAL_SESSIONS_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        return list.map(s => {
          const lastPing = new Date(s.last_ping_at || s.created_at).getTime();
          const countryCode = s.countryCode || 'GL';
          const info = getCountryInfo(countryCode);
          return {
            ...s,
            x: s.x || info.x,
            y: s.y || info.y,
            is_online: (now - lastPing) < ONLINE_THRESHOLD_MS
          };
        });
      }
    }
  } catch (e) {}

  return [];
};

// Fetch Real Visitor Journey
export const fetchBillaVisitorJourney = async (visitorId) => {
  if (!visitorId) return [];

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('billa_eyes_events')
        .select('*')
        .eq('visitor_id', visitorId)
        .order('created_at', { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map(d => ({
          time: new Date(d.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          title: d.title,
          detail: d.detail || '',
          created_at: d.created_at
        }));
      }
    } catch (e) {
      console.warn('Supabase events fetch error:', e);
    }
  }

  try {
    const raw = localStorage.getItem(BILLA_LOCAL_EVENTS_KEY);
    if (raw) {
      const map = JSON.parse(raw);
      if (map[visitorId] && Array.isArray(map[visitorId])) {
        return map[visitorId];
      }
    }
  } catch (e) {}

  return [
    {
      time: 'Real-Time',
      title: 'Session Initiated',
      detail: 'Visitor connected via BILLA EYES™ Telemetry Network'
    }
  ];
};

// Filter Sessions by Historical Time-Range
export const filterSessionsByTimeRange = (sessions, timeRange = 'all') => {
  if (!Array.isArray(sessions)) return [];
  if (timeRange === 'all') return sessions;

  const now = new Date();

  return sessions.filter(s => {
    const sessionTime = new Date(s.last_ping_at || s.created_at || Date.now());

    if (timeRange === 'live') {
      return s.is_online === true;
    }

    if (timeRange === 'today') {
      return sessionTime.toDateString() === now.toDateString();
    }

    if (timeRange === 'yesterday') {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      return sessionTime.toDateString() === yesterday.toDateString();
    }

    const diffDays = (now.getTime() - sessionTime.getTime()) / (1000 * 3600 * 24);

    if (timeRange === '7d') return diffDays <= 7;
    if (timeRange === '30d') return diffDays <= 30;
    if (timeRange === '90d') return diffDays <= 90;

    return true;
  });
};
