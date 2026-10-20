-- Drop existing tables if they exist (for clean setup)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS promotions CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS home_buttons CASCADE;
DROP TABLE IF EXISTS restaurant_settings CASCADE;

-- 1. Restaurant Settings
CREATE TABLE restaurant_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    hero_text TEXT,
    take_away_additional_fee INTEGER DEFAULT 0 NOT NULL,
    jumbo_size_upgrade_fee INTEGER DEFAULT 0 NOT NULL,
    tax_percentage INTEGER DEFAULT 0 NOT NULL,
    tax_status TEXT NOT NULL,
    whatsapp_link TEXT,
    google_maps_link TEXT,
    instagram_link TEXT,
    tiktok_link TEXT,
    banner_image_url TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. Home Buttons (Optional/Future expansion)
CREATE TABLE home_buttons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    variant TEXT DEFAULT 'primary' NOT NULL,
    order_number INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. Categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    order_number INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4. Menu Items
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    price INTEGER NOT NULL,
    description TEXT,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true NOT NULL,
    is_best_seller BOOLEAN DEFAULT false NOT NULL,
    is_chef_choice BOOLEAN DEFAULT false NOT NULL,
    supports_jumbo BOOLEAN DEFAULT false NOT NULL,
    order_number INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 5. Promotions
CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    min_transaction INTEGER,
    reward TEXT,
    start_date DATE,
    end_date DATE,
    valid_days TEXT[],
    valid_time_start TIME,
    valid_time_end TIME,
    valid_time_start_2 TIME,
    valid_time_end_2 TIME,
    is_active BOOLEAN DEFAULT true NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- RLS Policies

ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON restaurant_settings FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users" ON restaurant_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE home_buttons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON home_buttons FOR SELECT USING (is_active = true);
CREATE POLICY "Enable all access for authenticated users" ON home_buttons FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON categories FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users" ON menu_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON promotions FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users" ON promotions FOR ALL TO authenticated USING (true) WITH CHECK (true);
