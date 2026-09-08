-- Supabase Schema for Medihub Pharma Labs
-- Run this SQL in your Supabase SQL Editor to initialize the database

-- 1. Create Languages Table
CREATE TABLE IF NOT EXISTS languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    flag VARCHAR(10) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false,
    direction VARCHAR(5) DEFAULT 'ltr',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Translations Table
CREATE TABLE IF NOT EXISTS translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    language_code VARCHAR(10) NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
    key_path VARCHAR(255) NOT NULL,
    translation_value TEXT NOT NULL,
    section VARCHAR(100) DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(language_code, key_path)
);

-- 3. Create Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create RFQ Commercial Inquiries Table
CREATE TABLE IF NOT EXISTS rfq_inquiries (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255),
    company VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100),
    country VARCHAR(100),
    country_code VARCHAR(10),
    items JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) DEFAULT 'New Lead',
    notes TEXT,
    estimated_value VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Create Analytics Events & Telemetry Table
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    device_type VARCHAR(50) DEFAULT 'Desktop',
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfq_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- 7. Public & Admin Policies
CREATE POLICY "Public Read Languages" ON languages FOR SELECT USING (true);
CREATE POLICY "Public Read Translations" ON translations FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow All on Languages" ON languages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All on Translations" ON translations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All on Settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All on RFQ" ON rfq_inquiries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All on Analytics" ON analytics_events FOR ALL USING (true) WITH CHECK (true);

-- 8. Insert Initial Seed Languages
INSERT INTO languages (code, name, flag, is_active, is_default)
VALUES 
    ('en', 'English (Global)', '🇬🇧', true, true),
    ('es', 'Español (Spanish)', '🇪🇸', true, false),
    ('de', 'Deutsch (German)', '🇩🇪', true, false)
ON CONFLICT (code) DO UPDATE 
SET name = EXCLUDED.name, flag = EXCLUDED.flag, is_active = EXCLUDED.is_active;

-- 9. Insert Initial Seed Site Settings
INSERT INTO site_settings (setting_key, setting_value, description)
VALUES 
    ('company_info', '{
        "name": "Medihub Pharma Labs",
        "email": "support@medihubpharmalabs.com",
        "phone": "+91 9244200415",
        "whatsapp": "+91 9244200415",
        "address": "Pharma City, Special Economic Zone, India",
        "certifications": ["WHO-GMP", "EU-GMP", "US-FDA", "ISO 9001:2015"]
    }'::jsonb, 'Global Contact and Corporate Information')
ON CONFLICT (setting_key) DO UPDATE 
SET setting_value = EXCLUDED.setting_value, updated_at = now();
