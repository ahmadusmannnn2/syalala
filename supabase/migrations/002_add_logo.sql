-- Add logo_url column to restaurant_settings table
ALTER TABLE restaurant_settings ADD COLUMN IF NOT EXISTS logo_url TEXT;
