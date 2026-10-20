-- Add tiktok_link column to restaurant_settings table
ALTER TABLE restaurant_settings ADD COLUMN IF NOT EXISTS tiktok_link TEXT;
